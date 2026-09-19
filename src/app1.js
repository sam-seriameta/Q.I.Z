"use strict";

const VERSIONE = "__VERSIONE__";
const REPO = "__REPO__";
const LOGO_SEGNAPOSTO = "__LOGO_SEGNAPOSTO__";
const LOGO_SAM = "__LOGO_SAM__";

const COLORI = ["#F5169B","#0FB5DC","#F5A300","#7B2FBE","#2FA36B","#E01B3C","#2F7BD1","#FF7A1A"];
const TEMPLATE = {timer:"Solo timer", parole:"Timer e parole", risposte:"Parole e risposte"};

const FUNZIONI = [
  ["avviaFerma", "Avvia / ferma il tempo", "Space"],
  ["avanti",     tr("Avanti"),                 "ArrowRight"],
  ["indietro",   tr("Indietro"),               "ArrowLeft"],
  ["reset",      "Azzera il tempo",        "KeyR"],
  ["piu",        "Aggiungi 5 secondi",     "Equal"],
  ["meno",       "Togli 5 secondi",        "Minus"],
  ["inizio",     "Torna all'inizio",       "KeyI"],
  ["tappo",      "Mostra il tappo",        "KeyT"],
  ["fine",       "Chiudi il round",        "KeyX"],
];

let seq = 0;
const nuovoId = () => "i" + (++seq) + Date.now().toString(36).slice(-4);

function configBase(){
  const a = {id:nuovoId(), nome:tr("Squadra %s", 1), colore:COLORI[0]};
  const b = {id:nuovoId(), nome:tr("Squadra %s", 2), colore:COLORI[1]};
  return {
    versione: 1,
    lingua: LINGUA,
    salvatoIl: 0,
    tema: {
      sfondo:"#FFF6FA", testo:"#1B1033", giallo:"#F59E00", rosso:"#E01B3C",
      onde:true, ondeColori:["#29D3F0","#F5169B","#F5169B","#FFD447"],
      altezzaOnde:170, granelli:true, barra:true,
      font:{nome:"", dati:"", scala:100, peso:400, corsivo:false, maiuscolo:false, spaziatura:0},
    },
    tappo:  {logo:LOGO_SAM, mostraLogo:true, scalaLogo:145, testo:"", scalaTesto:100},
    angolo: {logo:LOGO_SAM, mostra:false, scala:100, posizione:"alto-destra"},
    vista:  {timerPosizione:"basso-destra", timerScala:100, sogliaGialla:10, sogliaRossa:5},
    suono:  {tipo:"campana", volume:60},
    finale: {schermo:"tappo"},
    tasti:  Object.fromEntries(FUNZIONI.map(f => [f[0], f[2]])),
    rubrica:[a, b],
    giochi: [{
      id:nuovoId(), nome:tr("Gioco %s", 1), aperto:true,
      template:"parole", timerRisposta:"continua",
      finale:{schermo:"predefinito", logo:"", testo:""},
      suono:{tipo:"predefinito"},
      round:[
        {squadraId:a.id, secondi:90, voci:"", template:"eredita", aperto:false},
        {squadraId:b.id, secondi:90, voci:"", template:"eredita", aperto:false},
      ],
    }],
  };
}

let cfg = configBase();
let live = null;
let tappoSporco = true, fontSporco = true;

const finestre = {esterna:null};
const schermi = [];
const $ = s => document.querySelector(s);
const squadraDi = id => cfg.rubrica.find(s => s.id === id) || cfg.rubrica[0];

/* ---------------- utilità ---------------- */

function mmss(ms){
  const t = Math.max(0, Math.ceil(ms/1000));
  return String(Math.floor(t/60)).padStart(2,"0") + ":" + String(t%60).padStart(2,"0");
}

function leggiTempo(txt){
  if(txt == null) return null;
  const s = String(txt).trim();
  if(!s) return null;
  if(s.includes(":")){
    const [m, x] = s.split(":");
    const mm = parseInt(m,10), ss = parseInt(x,10);
    if(isNaN(mm) || isNaN(ss)) return null;
    return mm*60 + ss;
  }
  const n = parseInt(s,10);
  return isNaN(n) ? null : n;
}

const scriviTempo = sec =>
  sec >= 60 ? Math.floor(sec/60) + ":" + String(sec%60).padStart(2,"0") : String(sec);

function vociDi(testo){
  return String(testo || "").split("\n").map(r => r.trim()).filter(Boolean).map(r => {
    const i = r.indexOf("|");
    return i < 0 ? {d:r, r:""} : {d:r.slice(0,i).trim(), r:r.slice(i+1).trim()};
  });
}

function nomeTasto(code){
  const m = {Space:"Spazio",Escape:"Esc",ArrowRight:"→",ArrowLeft:"←",ArrowUp:"↑",ArrowDown:"↓",
             Enter:"Invio",Equal:"+",Minus:"−",NumpadAdd:"Num +",NumpadSubtract:"Num −"};
  if(m[code]) return tr(m[code]);
  if(!code) return "—";
  if(code.startsWith("Key")) return code.slice(3);
  if(code.startsWith("Digit")) return code.slice(5);
  if(code.startsWith("Numpad")) return "Num " + code.slice(6);
  return code;
}

function mescola(colore, verso, quanto){
  const n = h => [0,2,4].map(i => parseInt(h.replace("#","").slice(i,i+2),16));
  const [r1,g1,b1] = n(colore), [r2,g2,b2] = n(verso);
  const m = (a,z) => Math.round(a + (z-a)*quanto).toString(16).padStart(2,"0");
  return "#" + m(r1,r2) + m(g1,g2) + m(b1,b2);
}

/* luminosità percepita, per avvisare se il contrasto è troppo basso */
function luce(hex){
  const [r,g,b] = [0,2,4].map(i => parseInt(hex.replace("#","").slice(i,i+2),16)/255)
    .map(v => v <= .03928 ? v/12.92 : Math.pow((v+.055)/1.055, 2.4));
  return .2126*r + .7152*g + .0722*b;
}
function contrasto(a, b){
  const x = luce(a), y = luce(b);
  return (Math.max(x,y) + .05) / (Math.min(x,y) + .05);
}

/* ---------------- suono ---------------- */

let ctxAudio = null;
function suona(tipo, volume){
  if(!tipo || tipo === "nessuno") return;
  try{
    ctxAudio = ctxAudio || new (window.AudioContext || window.webkitAudioContext)();
    if(ctxAudio.state === "suspended") ctxAudio.resume();
    const v = Math.max(0, Math.min(1, (volume ?? 60) / 100));
    const t0 = ctxAudio.currentTime;
    const nota = (freq, inizio, durata, onda, picco) => {
      const o = ctxAudio.createOscillator(), g = ctxAudio.createGain();
      o.type = onda; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t0 + inizio);
      g.gain.exponentialRampToValueAtTime(Math.max(.0002, picco * v), t0 + inizio + .01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + inizio + durata);
      o.connect(g).connect(ctxAudio.destination);
      o.start(t0 + inizio); o.stop(t0 + inizio + durata + .02);
    };
    if(tipo === "bip"){ nota(880,0,.12,"square",.3); nota(880,.18,.12,"square",.3); nota(1320,.36,.22,"square",.3); }
    else if(tipo === "campana"){ nota(1046,0,1.1,"sine",.45); nota(1568,.02,.9,"sine",.2); }
    else if(tipo === "buzzer"){ nota(150,0,.65,"sawtooth",.28); nota(110,0,.65,"square",.2); }
  }catch(e){ /* audio non disponibile: pazienza */ }
}

/* ---------------- schermo esterno ---------------- */

const ONDE_SU = `
<svg class="onde onde-su" viewBox="0 0 1280 210" preserveAspectRatio="none">
  <defs>
    <linearGradient id="ga" x1="0" x2="1"><stop class="stopA" offset="0"/><stop class="stopB" offset="1"/></linearGradient>
    <linearGradient id="gb" x1="0" x2="1"><stop class="stopB" offset="0"/><stop class="stopA" offset="1"/></linearGradient>
  </defs>
  <path fill="url(#ga)" d="M0,0 H1280 V86 C1085,156 905,52 690,102 C470,152 215,62 0,118 Z"/>
  <path class="filo" d="M0,130 C215,74 470,164 690,114 C905,64 1085,168 1280,98"/>
  <path fill="url(#gb)" d="M0,0 H1280 V48 C1100,118 890,22 675,70 C450,119 205,30 0,78 Z"/>
  <path class="filo" d="M0,90 C205,42 450,131 675,82 C890,34 1100,130 1280,60"/>
  <path fill="url(#ga)" d="M0,0 H1280 V16 C1115,82 880,-4 655,38 C430,80 195,4 0,42 Z"/>
</svg>`;

const ONDE_GIU = `
<svg class="onde onde-giu" viewBox="0 0 1280 210" preserveAspectRatio="none">
  <defs>
    <linearGradient id="gc" x1="0" x2="1"><stop class="stopC" offset="0"/><stop class="stopD" offset="1"/></linearGradient>
    <linearGradient id="gd" x1="0" x2="1"><stop class="stopD" offset="0"/><stop class="stopC" offset="1"/></linearGradient>
  </defs>
  <path fill="url(#gc)" d="M0,0 H1280 V92 C1060,150 900,46 680,108 C460,168 200,60 0,124 Z"/>
  <path class="filo" d="M0,136 C200,72 460,180 680,120 C900,58 1060,162 1280,104"/>
  <path fill="url(#gd)" d="M0,0 H1280 V52 C1090,120 870,18 660,74 C440,130 210,28 0,82 Z"/>
  <path class="filo" d="M0,94 C210,40 440,142 660,86 C870,30 1090,132 1280,64"/>
  <path fill="url(#gc)" d="M0,0 H1280 V18 C1120,84 860,-6 640,42 C420,88 190,6 0,46 Z"/>
</svg>`;

const STRUTTURA = `
<div class="schermo" data-fase="tappo">
  ${ONDE_SU}${ONDE_GIU}
  <div class="granelli gsu"></div>
  <div class="granelli ggiu"></div>

  <div class="quadro q-tappo">
    <img class="marchio-grande" alt="">
    <p class="tappo-testo"></p>
  </div>

  <div class="quadro q-pronto">
    <div class="targa"><b class="squadra-nome"></b></div>
    <img class="marchio-angolo" alt="">
    <div class="orologio-grande">00:00</div>
  </div>

  <div class="quadro q-gioco">
    <img class="marchio-angolo" alt="">
    <div class="parola"><span></span></div>
    <div class="chip-tempo">00:00</div>
  </div>

  <div class="barra"><i></i></div>

  <div class="credito">
    <img src="__LOGO_SAM__" alt="Seri a Metà">
    <span>@sam.seriameta</span>
  </div>
</div>`;

function agganciaSchermo(radice, doc){
  radice.innerHTML = STRUTTURA;
  const s = radice.querySelector(".schermo");
  const rif = {
    doc, radice, schermo: s,
    imgGrande:  s.querySelector(".marchio-grande"),
    imgAngolo:  [...s.querySelectorAll(".marchio-angolo")],
    tappoTesto: s.querySelector(".tappo-testo"),
    squadraNome:s.querySelector(".squadra-nome"),
    orologio:   s.querySelector(".orologio-grande"),
    chip:       s.querySelector(".chip-tempo"),
    parola:     s.querySelector(".parola"),
    parolaTesto:s.querySelector(".parola span"),
    barra:      s.querySelector(".barra i"),
    ultimaVoce: undefined,
  };
  schermi.push(rif);
  tappoSporco = true; fontSporco = true;
  scala(rif);
  if(doc.fonts && doc.fonts.ready) doc.fonts.ready.then(riadattaTutti);
  return rif;
}

function scala(rif){
  const w = rif.doc === document ? rif.radice.clientWidth  : rif.doc.documentElement.clientWidth;
  const h = rif.doc === document ? rif.radice.clientHeight : rif.doc.documentElement.clientHeight;
  rif.schermo.style.setProperty("--k", Math.min(w/1280, h/720));
}
const scalaTutti = () => schermi.forEach(scala);
addEventListener("resize", scalaTutti);

function cssFont(){
  const f = cfg.tema.font;
  if(!f.dati) return "";
  return `@font-face{font-family:Utente;src:url("${f.dati}");font-display:block}`;
}

function applicaFont(doc){
  let st = doc.getElementById("fontUtente");
  if(!st){
    st = doc.createElement("style");
    st.id = "fontUtente";
    doc.head.appendChild(st);
  }
  st.textContent = cssFont();
}

function adatta(s){
  const box = s.parola, t = s.parolaTesto;
  if(!t.textContent) return;
  const max = Math.round(150 * (cfg.tema.font.scala / 100));
  let lo = 20, hi = Math.max(24, max), best = 20;
  while(lo <= hi){
    const m = (lo + hi) >> 1;
    t.style.fontSize = m + "px";
    if(t.offsetHeight <= box.clientHeight && t.scrollWidth <= box.clientWidth){ best = m; lo = m + 1; }
    else hi = m - 1;
  }
  t.style.fontSize = best + "px";
}

function riadattaTutti(){
  schermi.forEach(s => { s.ultimaVoce = undefined; });
  dipingi();
}

function faseCorrente(){
  const r = live;
  if(!r) return "tappo";
  if(r.mostraTappo || r.mostraFinale) return "tappo";
  if(r.iniziato && r.template !== "timer") return "gioco";
  return "pronto";
}

function dipingi(){
  const r = live;
  const fase = faseCorrente();
  const frazione = r ? r.restoMs / r.durataMs : 1;
  const sec = r ? r.restoMs / 1000 : 999;
  const avviso  = r && sec <= cfg.vista.sogliaGialla && sec > cfg.vista.sogliaRossa;
  const allarme = r && sec <= cfg.vista.sogliaRossa;
  const finito  = r && r.restoMs <= 0;
  const testo = r ? mmss(r.restoMs) : mmss(0);

  /* cosa mostra il quadro "tappo": tappo normale o schermata di fine */
  let logoT = cfg.tappo.mostraLogo ? cfg.tappo.logo : "";
  let testoT = cfg.tappo.testo;
  if(r && r.mostraFinale && r.finale.schermo === "custom"){
    logoT = r.finale.logo || "";
    testoT = r.finale.testo || "";
  }

  const t = cfg.tema;
  $("#statoTempo").textContent = r ? testo : "--:--";

  for(const s of schermi){
    const el = s.schermo;
    el.dataset.fase = fase;
    el.dataset.angolo = cfg.angolo.posizione;
    el.dataset.timer = cfg.vista.timerPosizione;
    el.classList.toggle("avviso", !!avviso);
    el.classList.toggle("allarme", !!allarme);
    el.classList.toggle("finito", !!finito);
    el.classList.toggle("senzaOnde", !t.onde);
    el.classList.toggle("senzaGranelli", !t.granelli);
    el.classList.toggle("senzaBarra", !t.barra);
    el.classList.toggle("senzaAngolo", !cfg.angolo.mostra);

    const st = el.style;
    st.setProperty("--sfondo", t.sfondo);
    st.setProperty("--testo", t.testo);
    st.setProperty("--giallo", t.giallo);
    st.setProperty("--rosso", t.rosso);
    st.setProperty("--altezzaOnde", t.altezzaOnde + "px");
    st.setProperty("--scalaLogo", cfg.tappo.scalaLogo / 100);
    st.setProperty("--scalaTappoTesto", cfg.tappo.scalaTesto / 100);
    st.setProperty("--scalaAngolo", cfg.angolo.scala / 100);
    st.setProperty("--scalaTimer", cfg.vista.timerScala / 100);
    st.setProperty("--peso", t.font.peso);
    st.setProperty("--corsivo", t.font.corsivo ? "italic" : "normal");
    st.setProperty("--maiuscolo", t.font.maiuscolo ? "uppercase" : "none");
    st.setProperty("--spaziatura", (t.font.spaziatura / 100) + "em");
    st.setProperty("--carattere", t.font.dati ? "Utente" : "TitoloBase");

    if(fase === "tappo" && !(r && r.mostraFinale)){
      const c = t.ondeColori;
      st.setProperty("--g1", c[0]); st.setProperty("--g2", c[1]);
      st.setProperty("--g3", c[2]); st.setProperty("--g4", c[3]);
      st.setProperty("--squadra", c[1]);
    } else if(r){
      const c = r.colore;
      st.setProperty("--squadra", c);
      st.setProperty("--g1", mescola(c, t.testo, .30));
      st.setProperty("--g2", c);
      st.setProperty("--g3", c);
      st.setProperty("--g4", mescola(c, t.sfondo, .45));
    }

    if(fontSporco) applicaFont(s.doc);

    if(tappoSporco){
      s.imgGrande.src = logoT || "";
      s.imgGrande.hidden = !logoT;
      s.imgAngolo.forEach(i => { i.src = cfg.angolo.logo || ""; i.hidden = !cfg.angolo.logo; });
      s.tappoTesto.textContent = testoT || "";
      s.squadraNome.textContent = r ? r.squadra : "";
    }

    s.orologio.textContent = testo;
    s.chip.textContent = testo;
    s.barra.style.width = Math.max(0, Math.min(1, frazione) * 100) + "%";

    let voce = "", classe = "parola";
    if(r && r.iniziato && r.template !== "timer"){
      const v = r.indice >= 0 ? r.elenco[r.indice] : null;
      if(!v){ voce = tr("Scaletta vuota"); classe = "parola vuota"; }
      else if(r.mostraRisposta){ voce = v.r || v.d; classe = "parola risposta"; }
      else voce = v.d;
    }
    s.parola.className = classe;
    if(s.ultimaVoce !== voce){ s.parolaTesto.textContent = voce; s.ultimaVoce = voce; adatta(s); }
  }
  tappoSporco = false; fontSporco = false;
}
