/* ---------------- finestra esterna ---------------- */

function apriFinestra(){
  const f = window.open("", "schermoQuiz", "width=1280,height=760");
  if(!f){
    mostraAvviso("#avvisoPopup", tr("Il browser ha bloccato la finestra. Consenti i popup per questa pagina e riprova."));
    return;
  }
  finestre.esterna = f;
  $("#avvisoPopup").hidden = true;
  const d = f.document;
  d.open();
  d.write('<!doctype html><html lang="it"><head><meta charset="utf-8"><title>Schermo</title>' +
    '<style>html,body{margin:0;height:100%;overflow:hidden;background:' + cfg.tema.sfondo + '}' +
    'body:fullscreen{cursor:none}' + document.getElementById("stileSchermo").textContent +
    '</style></head><body></body></html>');
  d.close();
  const rif = agganciaSchermo(d.body, d);
  f.addEventListener("resize", () => scala(rif));
  d.addEventListener("keydown", ev => {
    if(ev.code === "KeyF"){ ev.preventDefault(); pienoSchermo(d); return; }
    tastoPremuto(ev);
  });
  f.addEventListener("beforeunload", () => {
    const i = schermi.indexOf(rif);
    if(i >= 0) schermi.splice(i,1);
    finestre.esterna = null;
  });
  dipingi();
}

function pienoSchermo(d){
  if(d.fullscreenElement) d.exitFullscreen();
  else if(d.documentElement.requestFullscreen) d.documentElement.requestFullscreen();
}
function chiudiFinestra(){
  if(finestre.esterna && !finestre.esterna.closed) finestre.esterna.close();
}

/* ---------------- schermo sempre acceso ---------------- */

let lucchetto = null;
async function tieniAcceso(){
  try{
    if("wakeLock" in navigator && !lucchetto){
      lucchetto = await navigator.wakeLock.request("screen");
      lucchetto.addEventListener("release", () => { lucchetto = null; });
    }
  }catch(e){ /* non concesso: nessun danno */ }
}
function lasciaSpegnere(){
  if(lucchetto){ lucchetto.release().catch(()=>{}); lucchetto = null; }
}
document.addEventListener("visibilitychange", () => {
  if(document.visibilityState === "visible" && live) tieniAcceso();
});

/* ---------------- round ---------------- */

function templateDi(g, sc){
  return sc.template && sc.template !== "eredita" ? sc.template : (g.template || "parole");
}
function finaleDi(g){
  const s = g.finale && g.finale.schermo && g.finale.schermo !== "predefinito"
    ? g.finale.schermo : cfg.finale.schermo;
  return {schermo:s, logo:(g.finale||{}).logo || "", testo:(g.finale||{}).testo || ""};
}
function suonoDi(g){
  const s = g.suono || {};
  const tipo = s.tipo && s.tipo !== "predefinito" ? s.tipo : cfg.suono.tipo;
  const vol = s.volume != null ? s.volume : cfg.suono.volume;
  return {tipo, volume:vol};
}

function avviaRound(gi, ri){
  const g = cfg.giochi[gi];
  const sc = g.round[ri];
  const sq = squadraDi(sc.squadraId);
  const ms = Math.max(1, sc.secondi) * 1000;
  live = {
    gi, ri,
    squadraId: sq.id,
    gioco: g.nome,
    squadra: sq.nome || tr("Squadra"),
    colore: sq.colore,
    template: templateDi(g, sc),
    timerRisposta: g.timerRisposta || "continua",
    finale: finaleDi(g),
    suono: suonoDi(g),
    elenco: vociDi(sc.voci),
    indice: -1,
    mostraRisposta: false,
    pausaPerRisposta: false,
    durataMs: ms, restoMs: ms,
    inCorsa: false, iniziato: false,
    mostraTappo: false, mostraFinale: false,
  };
  orologio = Date.now();
  tappoSporco = fontSporco = true;
  tieniAcceso();
  disegnaRegia(); dipingi();
}

function chiudiRound(){
  live = null;
  lasciaSpegnere();
  tappoSporco = fontSporco = true;
  disegnaRegia(); dipingi();
}

function avviaFerma(){
  const r = live; if(!r || r.restoMs <= 0) return;
  if(r.mostraTappo || r.mostraFinale){ r.mostraTappo = false; r.mostraFinale = false; tappoSporco = true; }
  if(!r.iniziato){
    r.iniziato = true;
    r.indice = r.elenco.length ? 0 : -1;
    r.mostraRisposta = false;
  }
  r.inCorsa = !r.inCorsa;
  r.pausaPerRisposta = false;
  orologio = Date.now();
  dipingi(); disegnaRegia();
}

function azzera(){
  const r = live; if(!r) return;
  r.restoMs = r.durataMs;
  r.inCorsa = false;
  r.mostraFinale = false;
  if(r.iniziato) r.mostraTappo = false;
  tappoSporco = true;
  orologio = Date.now();
  dipingi(); disegnaRegia();
}

/* correzione in corsa: non tocca la durata configurata del round */
function correggi(secondi){
  const r = live; if(!r) return;
  r.restoMs = Math.max(0, r.restoMs + secondi * 1000);
  if(r.restoMs > 0 && (r.mostraFinale || (r.mostraTappo && r.iniziato))){
    r.mostraFinale = false; r.mostraTappo = false; tappoSporco = true;
  }
  orologio = Date.now();
  dipingi(); disegnaRegia();
}

function imponiTempo(secondi){
  const r = live; if(!r || secondi == null) return;
  r.restoMs = Math.max(0, secondi * 1000);
  if(r.restoMs > 0){ r.mostraFinale = false; if(r.iniziato) r.mostraTappo = false; tappoSporco = true; }
  orologio = Date.now();
  dipingi(); disegnaRegia();
}

function avanti(){
  const r = live;
  if(!r || !r.iniziato || r.template === "timer" || !r.elenco.length) return;
  const v = r.elenco[r.indice];
  if(r.template === "risposte" && !r.mostraRisposta && v && v.r){
    r.mostraRisposta = true;
    if(r.timerRisposta === "ferma" && r.inCorsa){ r.inCorsa = false; r.pausaPerRisposta = true; }
  } else if(r.indice < r.elenco.length - 1){
    r.indice++;
    r.mostraRisposta = false;
    if(r.pausaPerRisposta){ r.inCorsa = true; r.pausaPerRisposta = false; orologio = Date.now(); }
  } else {
    return;
  }
  dipingi(); disegnaRegia();
}

function indietro(){
  const r = live;
  if(!r || !r.iniziato || r.template === "timer" || !r.elenco.length) return;
  if(r.mostraRisposta){
    r.mostraRisposta = false;
    if(r.pausaPerRisposta){ r.inCorsa = true; r.pausaPerRisposta = false; orologio = Date.now(); }
  } else if(r.indice > 0){
    r.indice--;
    const v = r.elenco[r.indice];
    r.mostraRisposta = r.template === "risposte" && !!(v && v.r);
  }
  dipingi(); disegnaRegia();
}

function vaiA(i){
  const r = live; if(!r || !r.iniziato) return;
  r.indice = i; r.mostraRisposta = false;
  dipingi(); disegnaRegia();
}

function tornaInizio(){
  const r = live; if(!r || !r.iniziato) return;
  r.indice = r.elenco.length ? 0 : -1;
  r.mostraRisposta = false;
  dipingi(); disegnaRegia();
}

function alternaTappo(){
  const r = live; if(!r) return;
  r.mostraTappo = !r.mostraTappo;
  r.mostraFinale = false;
  if(r.mostraTappo) r.inCorsa = false;
  tappoSporco = true;
  dipingi(); disegnaRegia();
}

/* ---------------- scorrere del tempo ---------------- */
/* basato su Date.now(), così resta esatto anche se la scheda viene rallentata */

let orologio = Date.now();

setInterval(() => {
  const ora = Date.now();
  const passato = ora - orologio;
  orologio = ora;
  const r = live;
  if(!r || !r.inCorsa) return;
  r.restoMs -= passato;
  if(r.restoMs <= 0){
    r.restoMs = 0;
    r.inCorsa = false;
    r.pausaPerRisposta = false;
    const f = r.finale.schermo;
    if(f === "tappo"){ r.mostraTappo = true; }
    else if(f === "custom"){ r.mostraFinale = true; }
    tappoSporco = true;
    suona(r.suono.tipo, r.suono.volume);
    lasciaSpegnere();
    disegnaRegia();
  }
  dipingi();
}, 50);

/* ---------------- tasti ---------------- */

let inAscolto = null;

function tastoPremuto(ev){
  const b = ev.target;
  const scrive = b && /^(INPUT|TEXTAREA|SELECT)$/.test(b.tagName);

  if(inAscolto){
    if(ev.code === "Tab") return;
    ev.preventDefault();
    for(const k in cfg.tasti) if(cfg.tasti[k] === ev.code) cfg.tasti[k] = "";
    cfg.tasti[inAscolto] = ev.code;
    inAscolto = null;
    disegnaTasti(); disegnaRegia(); segnaModifica();
    return;
  }
  if(scrive || !live) return;

  const t = cfg.tasti;
  let preso = true;
  switch(ev.code){
    case t.avviaFerma: avviaFerma(); break;
    case t.avanti:     avanti(); break;
    case t.indietro:   indietro(); break;
    case t.reset:      azzera(); break;
    case t.piu:        correggi(5); break;
    case t.meno:       correggi(-5); break;
    case t.inizio:     tornaInizio(); break;
    case t.tappo:      alternaTappo(); break;
    case t.fine:       chiudiRound(); break;
    default: preso = false;
  }
  if(preso) ev.preventDefault();
}
document.addEventListener("keydown", tastoPremuto);

/* ---------------- regia ---------------- */

function disegnaRegia(){
  const r = live;
  const attivo = !!r;

  $("#stato").style.borderLeftColor = attivo ? r.colore : "var(--riga)";
  $("#statoChi").textContent = !attivo ? tr("Nessun round attivo")
    : (r.gioco ? r.gioco + " · " : "") + r.squadra;
  $("#statoTempo").textContent = attivo ? mmss(r.restoMs) : "--:--";
  $("#statoTempo").className = "tempo" + (!attivo ? ""
    : r.restoMs/1000 <= cfg.vista.sogliaRossa ? " finito"
    : r.restoMs/1000 <= cfg.vista.sogliaGialla ? " scarso" : "");
  $("#statoNota").textContent = !attivo ? tr("Avvia un round dalla colonna a sinistra")
    : r.mostraFinale ? tr("Schermata di fine")
    : r.mostraTappo ? (r.restoMs <= 0 ? tr("Round finito, schermo sul tappo") : tr("Schermo esterno sul tappo"))
    : !r.iniziato ? tr("In attesa, timer a schermo pieno")
    : r.pausaPerRisposta ? tr("In pausa sulla risposta")
    : r.inCorsa ? tr("In corsa") : tr("In pausa");

  const bottoni = ["cAvvia","cReset","cIndietro","cAvanti","cInizio","cTappo","cFine",
                   "cMeno","cMeno5","cPiu5","cPiu","cEsatto","cImponi"];
  bottoni.forEach(id => { $("#"+id).disabled = !attivo; });

  const et = (id, f, t) => $("#"+id).replaceChildren(t, el("kbd", {textContent:nomeTasto(cfg.tasti[f])}));
  et("cAvvia", "avviaFerma", attivo && r.inCorsa ? tr("Ferma") : tr("Avvia"));
  et("cReset", "reset", tr("Azzera"));
  et("cIndietro", "indietro", tr("Indietro"));
  et("cAvanti", "avanti", tr("Avanti"));
  et("cInizio", "inizio", tr("Inizio"));
  et("cTappo", "tappo", tr("Tappo"));
  et("cFine", "fine", tr("Chiudi round"));

  const solo = attivo && r.template === "timer";
  ["cIndietro","cAvanti","cInizio"].forEach(id => { if(solo) $("#"+id).disabled = true; });

  const v = attivo && r.indice >= 0 ? r.elenco[r.indice] : null;
  $("#ora").textContent = !attivo ? "—"
    : solo ? tr("Round solo timer")
    : !r.iniziato ? tr("Premi %s per partire", nomeTasto(cfg.tasti.avviaFerma).toLowerCase())
    : !v ? tr("Scaletta vuota")
    : r.mostraRisposta ? (v.r || v.d)
    : v.d;
  $("#poi").textContent = !attivo || solo || !r.iniziato ? ""
    : r.mostraRisposta ? tr("risposta a schermo")
    : v && v.r ? tr("risposta") + ": " + v.r
    : r.elenco[r.indice+1] ? tr("poi") + ": " + r.elenco[r.indice+1].d
    : v ? tr("ultima voce") : "";

  const ol = $("#voci");
  ol.innerHTML = "";
  if(attivo && !solo){
    r.elenco.forEach((x, i) => {
      const li = document.createElement("li");
      li.className = i === r.indice ? "viva" : i < r.indice ? "passata" : "";
      if(i === r.indice) li.style.background = r.colore;
      const n = document.createElement("span"); n.className = "n"; n.textContent = i+1;
      const d = document.createElement("span"); d.textContent = x.d;
      li.append(n, d);
      if(x.r){
        const ris = document.createElement("span");
        ris.className = "ris"; ris.textContent = "→ " + x.r;
        li.appendChild(ris);
      }
      li.onclick = () => vaiA(i);
      ol.appendChild(li);
    });
    const viva = ol.querySelector(".viva");
    if(viva) viva.scrollIntoView({block:"nearest"});
  }
}
