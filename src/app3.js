/* ---------------- mattoncini per i pannelli ---------------- */

function el(tag, props, ...figli){
  const e = document.createElement(tag);
  Object.assign(e, props || {});
  figli.flat().forEach(f => f != null && e.append(f));
  return e;
}

function campo(testoEtichetta, dentro){
  const d = el("div", {className:"campo"});
  if(testoEtichetta) d.append(el("label", {textContent: testoEtichetta}));
  d.append(dentro);
  return d;
}

function inpTesto(valore, segnaposto, alCambio){
  const i = el("input", {type:"text", value: valore || "", placeholder: segnaposto || ""});
  i.oninput = () => alCambio(i.value);
  return i;
}

function inpColore(valore, alCambio){
  const i = el("input", {type:"color", value: valore});
  i.oninput = () => alCambio(i.value);
  return i;
}

function rigaColore(testoEtichetta, valore, alCambio){
  const r = el("div", {className:"riga-squadra"});
  r.append(inpColore(valore, alCambio), el("span", {textContent: testoEtichetta}));
  return r;
}

function cursore(testoEtichetta, valore, min, max, passo, suffisso, alCambio){
  const d = el("div", {className:"campo"});
  d.append(el("label", {textContent: testoEtichetta}));
  const riga = el("div", {className:"cursore"});
  const i = el("input", {type:"range", min, max, step:passo, value:valore});
  const o = el("output", {textContent: valore + suffisso});
  i.oninput = () => { o.textContent = i.value + suffisso; alCambio(+i.value); };
  riga.append(i, o);
  d.append(riga);
  return d;
}

function spunta(testoEtichetta, valore, alCambio){
  const l = el("label", {className:"spunta"});
  const c = el("input", {type:"checkbox", checked: !!valore});
  c.onchange = () => alCambio(c.checked);
  l.append(c, el("span", {textContent: testoEtichetta}));
  return l;
}

function scelta(testoEtichetta, opzioni, valore, alCambio){
  const s = el("select");
  Object.entries(opzioni).forEach(([v, t]) => {
    const o = el("option", {value:v, textContent:t});
    if(v === valore) o.selected = true;
    s.append(o);
  });
  s.onchange = () => alCambio(s.value);
  return campo(testoEtichetta, s);
}

function chiediFile(accetta, alLetto, comeTesto){
  const i = el("input", {type:"file", accept:accetta});
  i.style.display = "none";
  document.body.append(i);
  i.onchange = () => {
    const f = i.files[0];
    if(f){
      const fr = new FileReader();
      fr.onload = () => alLetto(fr.result, f.name);
      comeTesto ? fr.readAsText(f) : fr.readAsDataURL(f);
    }
    i.remove();
  };
  i.click();
}

function bottoncino(t, titolo, fn, spento){
  const b = el("button", {textContent:t, title:titolo, disabled:!!spento});
  b.onclick = e => { e.stopPropagation(); fn(); };
  return b;
}

function blocco(o){
  const d = el("div", {className:"pieghevole" + (o.aperto ? " aperto" : "")});
  if(o.colore) d.style.borderLeft = "4px solid " + o.colore;
  const t = el("div", {className:"testata"});
  t.append(el("span", {className:"freccia", textContent:"▶"}),
           el("span", {className:"titolo-b", textContent:o.titolo}));
  if(o.pallini){
    const w = el("div");
    w.style.cssText = "display:flex;gap:4px;flex:none";
    o.pallini.forEach(c => {
      const p = el("span", {className:"pallino"});
      p.style.background = c;
      w.append(p);
    });
    t.append(w);
  }
  t.append(el("span", {className:"sommario", textContent:o.sommario || ""}));
  (o.azioni || []).forEach(b => t.append(b));
  t.onclick = o.apri;
  d.append(t);
  if(o.aperto) d.append(el("div", {className:"corpo"}, o.corpo()));
  return d;
}

function aggiorna(){ tappoSporco = true; dipingi(); segnaModifica(); }

/* ---------------- pannello aspetto ---------------- */

function disegnaTema(){
  const t = cfg.tema;
  const box = $("#temaBlocco");
  box.innerHTML = "";
  const p = [];

  p.push(el("h2", {textContent:tr("COLORI")}));
  p.push(rigaColore(tr("Sfondo"), t.sfondo, v => { t.sfondo = v; aggiorna(); }));
  p.push(rigaColore(tr("Testo"), t.testo, v => { t.testo = v; aggiorna(); }));
  p.push(rigaColore(tr("Timer sotto soglia"), t.giallo, v => { t.giallo = v; aggiorna(); }));
  p.push(rigaColore(tr("Timer agli ultimi secondi"), t.rosso, v => { t.rosso = v; aggiorna(); }));

  const c = contrasto(t.sfondo, t.testo);
  if(c < 4.5){
    p.push(el("p", {className:"avviso",
      textContent: tr("Sfondo e testo hanno poco contrasto (%s:1). Da lontano si legge male.", c.toFixed(1))}));
  }

  p.push(el("h2", {textContent:tr("DECORAZIONI")}));
  p.push(spunta(tr("Onde colorate sopra e sotto"), t.onde, v => { t.onde = v; aggiorna(); disegnaTema(); }));
  if(t.onde){
    const g = el("div", {className:"duo3"});
    t.ondeColori.forEach((col, i) => g.append(inpColore(col, v => { t.ondeColori[i] = v; aggiorna(); })));
    p.push(campo(tr("Colori delle onde, da sinistra a destra"), g));
    p.push(cursore(tr("Altezza delle onde"), t.altezzaOnde, 60, 260, 5, " px",
      v => { t.altezzaOnde = v; aggiorna(); }));
  }
  p.push(spunta(tr("Granelli negli angoli"), t.granelli, v => { t.granelli = v; aggiorna(); }));
  p.push(spunta(tr("Barra del tempo sul bordo"), t.barra, v => { t.barra = v; aggiorna(); }));

  p.push(el("h2", {textContent:tr("CARATTERE")}));
  const b = el("div", {className:"bottoni"});
  b.append(el("button", {textContent:tr("Carica un font…"), onclick: () =>
    chiediFile(".woff,.woff2,.ttf,.otf,font/*", (dati, nome) => {
      t.font.dati = dati; t.font.nome = nome;
      fontSporco = true; riadattaTutti(); segnaModifica(); disegnaTema();
    })}));
  if(t.font.dati){
    b.append(el("button", {className:"quieto", textContent:tr("Torna al carattere base"), onclick: () => {
      t.font.dati = ""; t.font.nome = "";
      fontSporco = true; riadattaTutti(); segnaModifica(); disegnaTema();
    }}));
  }
  p.push(b);
  if(t.font.nome) p.push(el("p", {className:"nota", textContent: tr("In uso: %s", t.font.nome)}));
  p.push(cursore(tr("Dimensione massima delle parole"), t.font.scala, 40, 160, 5, " %",
    v => { t.font.scala = v; riadattaTutti(); segnaModifica(); }));
  p.push(cursore(tr("Spessore"), t.font.peso, 100, 900, 100, "",
    v => { t.font.peso = v; riadattaTutti(); segnaModifica(); }));
  p.push(cursore(tr("Spaziatura tra le lettere"), t.font.spaziatura, -5, 20, 1, "",
    v => { t.font.spaziatura = v; riadattaTutti(); segnaModifica(); }));
  p.push(spunta(tr("Corsivo"), t.font.corsivo, v => { t.font.corsivo = v; riadattaTutti(); segnaModifica(); }));
  p.push(spunta(tr("Tutto maiuscolo"), t.font.maiuscolo, v => { t.font.maiuscolo = v; riadattaTutti(); segnaModifica(); }));

  p.push(el("h2", {textContent:tr("TAPPO")}));
  const bt = el("div", {className:"bottoni"});
  bt.append(el("button", {textContent:tr("Carica il logo…"), onclick: () =>
    chiediFile("image/*", dati => { cfg.tappo.logo = dati; cfg.tappo.mostraLogo = true; aggiorna(); disegnaTema(); })}));
  bt.append(el("button", {className:"quieto", textContent:tr("Rimetti il logo SAM"), onclick: () => {
    cfg.tappo.logo = LOGO_SAM; aggiorna(); disegnaTema();
  }}));
  bt.append(el("button", {className:"quieto", textContent:tr("Togli il logo"), onclick: () => {
    cfg.tappo.logo = LOGO_SEGNAPOSTO; aggiorna(); disegnaTema();
  }}));
  p.push(bt);
  p.push(spunta(tr("Mostra il logo sul tappo"), cfg.tappo.mostraLogo,
    v => { cfg.tappo.mostraLogo = v; aggiorna(); }));
  p.push(cursore(tr("Dimensione del logo"), cfg.tappo.scalaLogo, 30, 220, 5, " %",
    v => { cfg.tappo.scalaLogo = v; aggiorna(); }));
  p.push(campo(tr("Scritta sul tappo"), inpTesto(cfg.tappo.testo, tr("es. Torniamo tra poco"),
    v => { cfg.tappo.testo = v; aggiorna(); })));
  p.push(cursore(tr("Dimensione della scritta"), cfg.tappo.scalaTesto, 40, 200, 5, " %",
    v => { cfg.tappo.scalaTesto = v; aggiorna(); }));

  p.push(el("h2", {textContent:tr("LOGO NELL'ANGOLO")}));
  const ba = el("div", {className:"bottoni"});
  ba.append(el("button", {textContent:tr("Carica…"), onclick: () =>
    chiediFile("image/*", dati => { cfg.angolo.logo = dati; aggiorna(); })}));
  ba.append(el("button", {className:"quieto", textContent:tr("Usa lo stesso del tappo"), onclick: () => {
    cfg.angolo.logo = cfg.tappo.logo; aggiorna();
  }}));
  p.push(ba);
  p.push(spunta(tr("Mostra il logo sulle slide"), cfg.angolo.mostra, v => { cfg.angolo.mostra = v; aggiorna(); }));
  p.push(scelta(tr("Posizione"), {
    "alto-destra":tr("In alto a destra"), "alto-sinistra":tr("In alto a sinistra"),
    "basso-destra":tr("In basso a destra"), "basso-sinistra":tr("In basso a sinistra"),
  }, cfg.angolo.posizione, v => { cfg.angolo.posizione = v; aggiorna(); }));
  p.push(cursore(tr("Dimensione"), cfg.angolo.scala, 40, 260, 5, " %", v => { cfg.angolo.scala = v; aggiorna(); }));

  p.push(el("h2", {textContent:tr("TIMER")}));
  p.push(scelta(tr("Posizione sulle slide con le parole"), {
    "basso-destra":tr("In basso a destra"), "basso-sinistra":tr("In basso a sinistra"),
    "alto-destra":tr("In alto a destra"), "centro-basso":tr("In basso al centro"),
  }, cfg.vista.timerPosizione, v => { cfg.vista.timerPosizione = v; aggiorna(); }));
  p.push(cursore(tr("Dimensione"), cfg.vista.timerScala, 50, 180, 5, " %",
    v => { cfg.vista.timerScala = v; aggiorna(); }));
  p.push(cursore(tr("Cambia colore sotto i"), cfg.vista.sogliaGialla, 3, 60, 1, " s",
    v => { cfg.vista.sogliaGialla = v; aggiorna(); }));
  p.push(cursore(tr("Ultimi secondi sotto i"), cfg.vista.sogliaRossa, 1, 30, 1, " s",
    v => { cfg.vista.sogliaRossa = v; aggiorna(); }));

  p.push(el("h2", {textContent:tr("FINE ROUND, PER TUTTI I GIOCHI")}));
  p.push(scelta(tr("Lo schermo esterno"), {tappo:tr("Torna al tappo"), resta:tr("Resta sull'ultima schermata")},
    cfg.finale.schermo, v => { cfg.finale.schermo = v; segnaModifica(); }));
  p.push(scelta(tr("Suono"), {nessuno:tr("Nessuno"), bip:tr("Bip"), campana:tr("Campana"), buzzer:tr("Buzzer")},
    cfg.suono.tipo, v => { cfg.suono.tipo = v; suona(v, cfg.suono.volume); segnaModifica(); }));
  p.push(cursore(tr("Volume"), cfg.suono.volume, 0, 100, 5, " %",
    v => { cfg.suono.volume = v; segnaModifica(); }));
  box.append(...inSchede(p));
}

/* spezza una lista di elementi in schede, una per ogni titolo h2 */
function inSchede(lista){
  const schede = [];
  lista.forEach(e => {
    if(e.tagName === "H2" || !schede.length) schede.push(el("section", {className:"scheda"}));
    schede[schede.length-1].append(e);
  });
  return schede;
}

/* ---------------- squadre ---------------- */

function disegnaRubrica(){
  const box = $("#rubricaBlocco");
  box.innerHTML = "";
  const p = [];
  cfg.rubrica.forEach((sq, i) => {
    const d = el("div");
    const riga = el("div", {className:"riga-squadra"});
    const col = inpColore(sq.colore, v => { sq.colore = v; coloreCambiato(sq); });
    const nome = inpTesto(sq.nome, tr("Nome squadra"), v => {
      sq.nome = v;
      if(live && live.squadraId === sq.id){ live.squadra = v; tappoSporco = true; dipingi(); disegnaRegia(); }
      segnaModifica();
    });
    nome.onblur = () => { disegnaGiochi(); disegnaRubrica(); };
    const via = el("button", {className:"quieto", textContent:"✕", title:tr("Elimina")});
    via.onclick = () => {
      if(cfg.rubrica.length <= 1) return;
      cfg.rubrica.splice(i,1);
      cfg.giochi.forEach(g => g.round.forEach(x => {
        if(!squadraDi(x.squadraId) || x.squadraId === sq.id) x.squadraId = cfg.rubrica[0].id;
      }));
      disegnaRubrica(); disegnaGiochi(); segnaModifica();
    };
    riga.append(col, nome, via);
    const tav = el("div", {className:"tavolozza"});
    COLORI.forEach(c => {
      const b = el("button", {title:c});
      b.style.background = c;
      b.onclick = () => { sq.colore = c; col.value = c; coloreCambiato(sq); };
      tav.append(b);
    });
    d.append(riga, tav);
    p.push(d);
  });
  const b = el("div", {className:"bottoni"});
  b.style.marginTop = "12px";
  b.append(el("button", {textContent:tr("Aggiungi squadra"), onclick: () => {
    cfg.rubrica.push({id:nuovoId(), nome:tr("Squadra %s", cfg.rubrica.length+1),
                      colore:COLORI[cfg.rubrica.length % COLORI.length]});
    disegnaRubrica(); disegnaGiochi(); segnaModifica();
  }}));
  p.push(b);
  box.append(el("section", {className:"scheda"}, p));
}

function coloreCambiato(sq){
  if(live && live.squadraId === sq.id){ live.colore = sq.colore; dipingi(); disegnaRegia(); }
  disegnaRubrica(); disegnaGiochi(); segnaModifica();
}

/* ---------------- giochi e round ---------------- */

function sposta(lista, i, d){
  const j = i + d;
  if(j < 0 || j >= lista.length) return;
  [lista[i], lista[j]] = [lista[j], lista[i]];
  disegnaGiochi(); segnaModifica();
}

function disegnaGiochi(){
  const box = $("#giochi");
  box.innerHTML = "";
  cfg.giochi.forEach((g, gi) => {
    box.append(blocco({
      titolo: g.nome || tr("Senza nome"),
      sommario: tr("%s round", g.round.length) + " · " + tr(TEMPLATE[g.template || "parole"]).toLowerCase(),
      aperto: g.aperto,
      apri: () => { g.aperto = !g.aperto; disegnaGiochi(); },
      azioni: [
        bottoncino("↑", tr("Sposta su"),  () => sposta(cfg.giochi, gi, -1), gi === 0),
        bottoncino("↓", tr("Sposta giù"), () => sposta(cfg.giochi, gi, 1),  gi === cfg.giochi.length-1),
        bottoncino("✕", tr("Elimina il gioco"), () => {
          if(cfg.giochi.length <= 1) return;
          cfg.giochi.splice(gi,1); disegnaGiochi(); segnaModifica();
        }),
      ],
      corpo: () => {
        const p = [];
        const nome = inpTesto(g.nome, tr("es. Indovina la parola"), v => {
          g.nome = v;
          if(live && live.gi === gi){ live.gioco = v; disegnaRegia(); }
          segnaModifica();
        });
        nome.onblur = () => disegnaGiochi();
        p.push(campo(tr("Nome del gioco"), nome));

        p.push(scelta(tr("Template predefinito dei round"), tOpz(TEMPLATE), g.template || "parole",
          v => { g.template = v; disegnaGiochi(); segnaModifica(); }));

        if((g.template || "parole") === "risposte" ||
           g.round.some(x => x.template === "risposte")){
          p.push(scelta(tr("Mentre è a schermo la risposta, il tempo"),
            {continua:tr("Continua a scorrere"), ferma:tr("Si ferma finché non vado avanti")},
            g.timerRisposta || "continua", v => { g.timerRisposta = v; segnaModifica(); }));
        }

        g.finale = g.finale || {schermo:"predefinito", logo:"", testo:""};
        p.push(scelta(tr("A tempo scaduto lo schermo esterno"), {
          predefinito:tr("Come gli altri giochi"), tappo:tr("Torna al tappo"),
          resta:tr("Resta sull'ultima schermata"), custom:tr("Mostra una schermata sua"),
        }, g.finale.schermo, v => { g.finale.schermo = v; disegnaGiochi(); segnaModifica(); }));

        if(g.finale.schermo === "custom"){
          const b = el("div", {className:"bottoni"});
          b.append(el("button", {textContent:tr("Immagine di fine…"), onclick: () =>
            chiediFile("image/*", dati => { g.finale.logo = dati; aggiorna(); })}));
          if(g.finale.logo) b.append(el("button", {className:"quieto", textContent:tr("Togli"), onclick: () => {
            g.finale.logo = ""; aggiorna(); disegnaGiochi();
          }}));
          p.push(b);
          p.push(campo(tr("Scritta di fine"), inpTesto(g.finale.testo, tr("es. Tempo scaduto"),
            v => { g.finale.testo = v; aggiorna(); })));
        }

        g.suono = g.suono || {tipo:"predefinito"};
        p.push(scelta(tr("Suono di fine"), {
          predefinito:tr("Come gli altri giochi"), nessuno:tr("Nessuno"),
          bip:tr("Bip"), campana:tr("Campana"), buzzer:tr("Buzzer"),
        }, g.suono.tipo, v => {
          g.suono.tipo = v;
          if(v !== "predefinito" && v !== "nessuno") suona(v, cfg.suono.volume);
          segnaModifica();
        }));

        const gruppo = el("div", {className:"gruppo"});
        gruppo.style.marginTop = "12px";
        g.round.forEach((sc, ri) => gruppo.append(schedaRound(g, gi, sc, ri)));
        p.push(gruppo);

        const b = el("div", {className:"bottoni"});
        b.append(el("button", {textContent:tr("Aggiungi round"), onclick: () => {
          g.round.push({squadraId:cfg.rubrica[0].id, secondi:90, voci:"", template:"eredita", aperto:true});
          disegnaGiochi(); segnaModifica();
        }}));
        p.push(b);
        return p;
      },
    }));
  });
}

function schedaRound(g, gi, sc, ri){
  const sq = squadraDi(sc.squadraId);
  const tpl = templateDi(g, sc);
  const n = vociDi(sc.voci).length;
  const riassunto = scriviTempo(sc.secondi) + " · " +
    (tpl === "timer" ? tr("solo timer") : tr(n === 1 ? "%s voce" : "%s voci", n));

  return blocco({
    titolo: sq ? sq.nome : "—",
    colore: sq ? sq.colore : "transparent",
    sommario: riassunto,
    aperto: sc.aperto,
    apri: () => { sc.aperto = !sc.aperto; disegnaGiochi(); },
    azioni: [
      Object.assign(bottoncino("▶", tr("Avvia questo round"), () => avviaRound(gi, ri)), {className:"gioca"}),
      bottoncino("↑", tr("Sposta su"),  () => sposta(g.round, ri, -1), ri === 0),
      bottoncino("↓", tr("Sposta giù"), () => sposta(g.round, ri, 1),  ri === g.round.length-1),
      bottoncino("✕", tr("Elimina il round"), () => { g.round.splice(ri,1); disegnaGiochi(); segnaModifica(); }),
    ],
    corpo: () => {
      const p = [];
      const duo = el("div", {className:"duo"});
      const s = el("select");
      cfg.rubrica.forEach(x => {
        const o = el("option", {value:x.id, textContent:x.nome || tr("Senza nome")});
        if(x.id === sc.squadraId) o.selected = true;
        s.append(o);
      });
      s.onchange = () => { sc.squadraId = s.value; disegnaGiochi(); segnaModifica(); };

      /* tempo libero: qualunque valore, in secondi o in mm:ss, validato all'uscita */
      const t = el("input", {type:"text", value:scriviTempo(sc.secondi), placeholder:"1:30"});
      t.onblur = () => {
        const v = leggiTempo(t.value);
        sc.secondi = v && v > 0 ? v : sc.secondi;
        t.value = scriviTempo(sc.secondi);
        disegnaGiochi(); segnaModifica();
      };
      t.onkeydown = e => { if(e.key === "Enter") t.blur(); };

      duo.append(campo(tr("Squadra"), s), campo(tr("Durata"), t));
      p.push(duo);

      p.push(scelta(tr("Template"), Object.assign(
        {eredita: tr("Come il gioco (%s)", tr(TEMPLATE[g.template || "parole"]).toLowerCase())}, tOpz(TEMPLATE)),
        sc.template || "eredita", v => { sc.template = v; disegnaGiochi(); segnaModifica(); }));

      if(tpl !== "timer"){
        const voci = el("textarea", {value: sc.voci});
        voci.oninput = () => { sc.voci = voci.value; segnaModifica(); };
        voci.onblur = () => disegnaGiochi();
        p.push(campo(tpl === "risposte"
          ? tr("Una per riga, con la risposta dopo la barra: domanda | risposta")
          : tr("Voci del round, una per riga"), voci));
      }

      const b = el("div", {className:"bottoni"});
      b.style.marginTop = "10px";
      b.append(el("button", {className:"forte", textContent:tr("Avvia round"), onclick: () => avviaRound(gi, ri)}));
      b.append(el("button", {textContent:tr("Duplica"), onclick: () => {
        g.round.splice(ri+1, 0, JSON.parse(JSON.stringify(sc)));
        disegnaGiochi(); segnaModifica();
      }}));
      p.push(b);
      return p;
    },
  });
}

/* ---------------- tasti ---------------- */

function disegnaTasti(){
  const box = $("#tastiBlocco");
  box.innerHTML = "";
  const t = el("table", {className:"tasti"});
  for(const [chiave, etichetta] of FUNZIONI){
    const riga = el("tr");
    const td2 = el("td");
    td2.style.textAlign = "right";
    const b = el("button", {className:"quieto"});
    const k = el("kbd");
    if(inAscolto === chiave){ k.className = "ascolto"; k.textContent = tr("premi…"); }
    else k.textContent = nomeTasto(cfg.tasti[chiave]);
    b.append(k);
    b.onclick = () => { inAscolto = inAscolto === chiave ? null : chiave; disegnaTasti(); };
    td2.append(b);
    riga.append(el("td", {textContent: tr(etichetta)}), td2);
    t.append(riga);
  }
  box.append(el("section", {className:"scheda"}, t, el("p", {className:"nota",
    textContent:tr("Attivi solo a round avviato, sia da qui che dalla finestra esterna. Clicca un tasto per rimapparlo.")})));
}

/* ---------------- salvataggio dentro il file stesso ---------------- */

const CHIAVE = "regia-quiz";
let manico = null;
let rimando = null;

function mostraAvviso(sel, testo, bottoni){
  const a = $(sel);
  a.innerHTML = "";
  a.hidden = false;
  a.append(el("div", {textContent:testo}));
  (bottoni || []).forEach(b => a.append(b));
}

function nota(testo){ $("#notaSalva").textContent = testo; }

function segnaModifica(){
  clearTimeout(rimando);
  rimando = setTimeout(() => {
    cfg.salvatoIl = Date.now();
    try{ localStorage.setItem(CHIAVE, JSON.stringify(cfg)); }catch(e){}
    nota(tr("Modifiche non ancora scritte nel file. Premi Salva."));
  }, 400);
}

function generaHTML(){
  const clone = document.documentElement.cloneNode(true);
  ["temaBlocco","rubricaBlocco","giochi","tastiBlocco","anteprima","voci"].forEach(id => {
    const e = clone.querySelector("#" + id);
    if(e) e.innerHTML = "";
  });
  clone.querySelectorAll(".avviso").forEach(e => { e.innerHTML = ""; e.setAttribute("hidden",""); });
  clone.querySelectorAll("details").forEach(d => d.removeAttribute("open"));
  const f = clone.querySelector("#fontUtente");
  if(f) f.remove();
  const o = clone.querySelector("#ora"); if(o) o.textContent = "—";
  const q = clone.querySelector("#poi"); if(q) q.textContent = "";
  const ns = clone.querySelector("#notaSalva"); if(ns) ns.textContent = "";
  cfg.salvatoIl = Date.now();
  const dati = JSON.stringify(cfg).replace(/</g, "\\u003c");
  clone.querySelector("#configurazione").textContent = dati;
  return "<!doctype html>\n" + clone.outerHTML;
}

function scarica(testo, nomeFile){
  const a = el("a", {href: URL.createObjectURL(new Blob([testo], {type:"text/html"})),
                     download: nomeFile || "regia-quiz.html"});
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

async function salva(){
  const testo = generaHTML();
  try{ localStorage.setItem(CHIAVE, JSON.stringify(cfg)); }catch(e){}
  if(window.showSaveFilePicker){
    try{
      if(!manico){
        manico = await window.showSaveFilePicker({
          suggestedName: "regia-quiz.html",
          types: [{description:tr("Pagina HTML"), accept:{"text/html":[".html"]}}],
        });
      }
      const w = await manico.createWritable();
      await w.write(testo);
      await w.close();
      nota(tr("Salvato alle %s.", new Date().toLocaleTimeString(locale())));
      return;
    }catch(e){
      if(e && e.name === "AbortError") return;
      manico = null;
    }
  }
  scarica(testo);
  nota(tr("Il tuo browser non può riscrivere il file aperto: ne ha scaricato uno nuovo. " +
          "Sostituisci il vecchio con quello appena scaricato."));
}

function importaDaHTML(testo){
  const m = testo.match(/<script[^>]*id="configurazione"[^>]*>([\s\S]*?)<\/script>/);
  if(!m){ mostraAvviso("#avvisoPopup", tr("In quel file non ho trovato nessuna configurazione.")); return; }
  try{
    applicaConfig(JSON.parse(m[1].replace(/\\u003c/g, "<")));
    $("#avvisoPopup").hidden = true;
    nota(tr("Configurazione ripresa dal file."));
  }catch(e){
    mostraAvviso("#avvisoPopup", tr("La configurazione in quel file è illeggibile."));
  }
}

function applicaConfig(nuovo){
  impostaLingua(nuovo.lingua || linguaAttiva());
  const base = configBase();
  cfg = Object.assign(base, nuovo);
  cfg.tema = Object.assign(base.tema, nuovo.tema || {});
  cfg.tema.font = Object.assign(base.tema.font, (nuovo.tema || {}).font || {});
  cfg.tappo = Object.assign(base.tappo, nuovo.tappo || {});
  cfg.angolo = Object.assign(base.angolo, nuovo.angolo || {});
  cfg.vista = Object.assign(base.vista, nuovo.vista || {});
  cfg.suono = Object.assign(base.suono, nuovo.suono || {});
  cfg.finale = Object.assign(base.finale, nuovo.finale || {});
  cfg.tasti = Object.assign(base.tasti, nuovo.tasti || {});
  if(!Array.isArray(cfg.rubrica) || !cfg.rubrica.length) cfg.rubrica = base.rubrica;
  if(!Array.isArray(cfg.giochi) || !cfg.giochi.length) cfg.giochi = base.giochi;
  cfg.giochi.forEach(g => {
    if(!Array.isArray(g.round)) g.round = [];
    g.round.forEach(x => { if(!squadraDi(x.squadraId)) x.squadraId = cfg.rubrica[0].id; });
  });
  live = null;
  tappoSporco = fontSporco = true;
  cfg.lingua = linguaAttiva();
  $("#selLingua").value = linguaAttiva();
  traduciPagina(); aggiornaLink();
  disegnaTema(); disegnaRubrica(); disegnaGiochi(); disegnaTasti(); disegnaRegia();
  riadattaTutti();
}

/* ---------------- collegamenti ---------------- */

function aggiornaLink(){
  const a = $("#linkIstruzioni");
  if(a) a.href = REPO + "/blob/HEAD/" + (linguaAttiva() === "en" ? "INSTRUCTIONS.md" : "ISTRUZIONI.md");
}

$("#selLingua").onchange = e => {
  impostaLingua(e.target.value);
  traduciPagina();
  aggiornaLink();
  disegnaTema(); disegnaRubrica(); disegnaGiochi(); disegnaTasti(); disegnaRegia();
  tappoSporco = true; dipingi();
  segnaModifica();
};

function mostraPannello(id){
  document.querySelectorAll("[data-pannello]").forEach(b => {
    const on = b.dataset.pannello === id;
    b.setAttribute("aria-selected", on);
    $("#" + b.dataset.pannello).hidden = !on;
  });
}
document.querySelectorAll("[data-pannello]").forEach(b => { b.onclick = () => mostraPannello(b.dataset.pannello); });

/* il menu Altro si chiude dopo una scelta o con un clic fuori */
document.addEventListener("click", e => {
  const m = $(".menu");
  if(!m.contains(e.target) || e.target.closest(".menuTendina")) m.open = false;
});

$("#btnApri").onclick = apriFinestra;
$("#btnChiudi").onclick = chiudiFinestra;
$("#btnNuovoGioco").onclick = () => {
  cfg.giochi.forEach(g => g.aperto = false);
  cfg.giochi.push({
    id:nuovoId(), nome: tr("Gioco %s", cfg.giochi.length + 1), aperto:true,
    template:"parole", timerRisposta:"continua",
    finale:{schermo:"predefinito", logo:"", testo:""}, suono:{tipo:"predefinito"},
    round:[{squadraId:cfg.rubrica[0].id, secondi:90, voci:"", template:"eredita", aperto:false}],
  });
  disegnaGiochi(); segnaModifica();
};
$("#btnSalva").onclick = salva;
$("#btnScaricaCopia").onclick = () => { scarica(generaHTML()); nota(tr("Copia scaricata.")); };
$("#btnImporta").onclick = () => chiediFile(".html,text/html", testo => importaDaHTML(testo), true);

$("#cAvvia").onclick    = avviaFerma;
$("#cReset").onclick    = azzera;
$("#cAvanti").onclick   = avanti;
$("#cIndietro").onclick = indietro;
$("#cInizio").onclick   = tornaInizio;
$("#cTappo").onclick    = alternaTappo;
$("#cFine").onclick     = chiudiRound;
$("#cMeno").onclick     = () => correggi(-10);
$("#cMeno5").onclick    = () => correggi(-5);
$("#cPiu5").onclick     = () => correggi(5);
$("#cPiu").onclick      = () => correggi(10);
$("#cImponi").onclick   = () => { imponiTempo(leggiTempo($("#cEsatto").value)); $("#cEsatto").value = ""; };
$("#cEsatto").onkeydown = e => { if(e.key === "Enter") $("#cImponi").click(); };

/* ---------------- avvio ---------------- */

(function partenza(){
  try{
    const dentro = JSON.parse(document.getElementById("configurazione").textContent);
    if(dentro && dentro.versione){
      impostaLingua(dentro.lingua || LINGUA);
      applicaConfigSilenzioso(dentro);
    }
  }catch(e){}
  if(!cfg.lingua) impostaLingua((navigator.language || "it").toLowerCase().startsWith("it") ? "it" : "en");
  $("#selLingua").value = linguaAttiva();
  traduciPagina();
  aggiornaLink();

  mostraPannello("pGiochi");
  agganciaSchermo($("#anteprima"), document);
  disegnaTema(); disegnaRubrica(); disegnaGiochi(); disegnaTasti(); disegnaRegia(); dipingi();
  new ResizeObserver(scalaTutti).observe($("#anteprima"));

  try{
    const salvato = JSON.parse(localStorage.getItem(CHIAVE) || "null");
    if(salvato && salvato.salvatoIl > (cfg.salvatoIl || 0) + 1000){
      const quando = new Date(salvato.salvatoIl).toLocaleString(locale());
      const si = el("button", {className:"forte", textContent:tr("Recupera")});
      si.onclick = () => { applicaConfig(salvato); $("#avvisoRecupero").hidden = true; };
      const no = el("button", {className:"quieto", textContent:tr("Ignora")});
      no.onclick = () => { $("#avvisoRecupero").hidden = true; };
      mostraAvviso("#avvisoRecupero",
        tr("In questo browser c'è una versione più recente, del %s, che non è mai stata scritta nel file.", quando),
        [si, no]);
    }
  }catch(e){}

  if(!window.showSaveFilePicker){
    nota(tr("Su questo browser il pulsante Salva scarica un file nuovo da mettere al posto del vecchio."));
  }
})();

function applicaConfigSilenzioso(nuovo){
  const base = configBase();
  cfg = Object.assign(base, nuovo);
  cfg.tema = Object.assign(base.tema, nuovo.tema || {});
  cfg.tema.font = Object.assign(base.tema.font, (nuovo.tema || {}).font || {});
  cfg.tappo = Object.assign(base.tappo, nuovo.tappo || {});
  cfg.angolo = Object.assign(base.angolo, nuovo.angolo || {});
  cfg.vista = Object.assign(base.vista, nuovo.vista || {});
  cfg.suono = Object.assign(base.suono, nuovo.suono || {});
  cfg.finale = Object.assign(base.finale, nuovo.finale || {});
  cfg.tasti = Object.assign(base.tasti, nuovo.tasti || {});
}
