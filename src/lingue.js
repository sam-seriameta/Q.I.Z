/* Le chiavi sono le stringhe italiane: in italiano non serve nessun dizionario. */

const LINGUE = {
  en: {
    /* struttura della pagina */
    "Preparazione":"Setup",
    "Schermo esterno":"External screen",
    "Apri schermo esterno":"Open external screen",
    "Chiudi":"Close",
    "Trascina la finestra sul secondo monitor, poi premi F lì dentro per il pieno schermo.":
      "Drag the window to your second monitor, then press F inside it for fullscreen.",
    "Aspetto":"Appearance",
    "Squadre":"Teams",
    "Giochi":"Games",
    "Tasti":"Keys",
    "Il tuo file":"Your file",
    "Aggiungi gioco":"Add game",
    "Salva":"Save",
    "Scarica una copia":"Download a copy",
    "Riprendi da un file":"Load from a file",
    "Regia":"Control",
    "In diretta":"Live",
    "Altro":"More",
    "Correggi il tempo":"Adjust the time",
    "Imposta":"Set",
    "Scaletta":"Running order",
    "Lingua":"Language",
    "Istruzioni passo passo":"Step-by-step instructions",
    "Versione":"Version",

    /* stato della regia */
    "Nessun round attivo":"No round running",
    "Avvia un round dalla colonna a sinistra":"Start a round from the left column",
    "Schermata di fine":"End screen",
    "Round finito, schermo sul tappo":"Round over, screen on the holding card",
    "Schermo esterno sul tappo":"External screen on the holding card",
    "In attesa, timer a schermo pieno":"Waiting, timer fullscreen",
    "In pausa sulla risposta":"Paused on the answer",
    "In corsa":"Running",
    "In pausa":"Paused",
    "Round solo timer":"Timer-only round",
    "Scaletta vuota":"Empty running order",
    "risposta a schermo":"answer on screen",
    "risposta":"answer",
    "poi":"next",
    "ultima voce":"last item",
    "Premi %s per partire":"Press %s to start",

    /* comandi */
    "Avvia":"Start",
    "Ferma":"Stop",
    "Azzera":"Reset",
    "Indietro":"Back",
    "Avanti":"Forward",
    "Inizio":"Start over",
    "Tappo":"Holding card",
    "Chiudi round":"End round",

    /* scorciatoie */
    "Avvia / ferma il tempo":"Start / stop the clock",
    "Azzera il tempo":"Reset the clock",
    "Aggiungi 5 secondi":"Add 5 seconds",
    "Togli 5 secondi":"Remove 5 seconds",
    "Torna all'inizio":"Back to the first item",
    "Mostra il tappo":"Show the holding card",
    "Chiudi il round":"End the round",
    "Attivi solo a round avviato, sia da qui che dalla finestra esterna. Clicca un tasto per rimapparlo.":
      "Active only while a round is running, both here and in the external window. Click a key to remap it.",
    "premi…":"press…",
    "Spazio":"Space",
    "Invio":"Enter",

    /* tema */
    "COLORI":"COLOURS",
    "Sfondo":"Background",
    "Testo":"Text",
    "Timer sotto soglia":"Timer below threshold",
    "Timer agli ultimi secondi":"Timer in the last seconds",
    "Sfondo e testo hanno poco contrasto (%s:1). Da lontano si legge male.":
      "Background and text have low contrast (%s:1). Hard to read from a distance.",
    "DECORAZIONI":"DECORATION",
    "Onde colorate sopra e sotto":"Coloured waves top and bottom",
    "Colori delle onde, da sinistra a destra":"Wave colours, left to right",
    "Altezza delle onde":"Wave height",
    "Granelli negli angoli":"Halftone dots in the corners",
    "Barra del tempo sul bordo":"Time bar along the edge",
    "CARATTERE":"TYPEFACE",
    "Carica un font…":"Load a font…",
    "Torna al carattere base":"Back to the built-in typeface",
    "In uso: %s":"In use: %s",
    "Dimensione massima delle parole":"Maximum size of the words",
    "Spessore":"Weight",
    "Spaziatura tra le lettere":"Letter spacing",
    "Corsivo":"Italic",
    "Tutto maiuscolo":"All caps",
    "TAPPO":"HOLDING CARD",
    "Carica il logo…":"Load the logo…",
    "Rimetti il logo SAM":"Restore the SAM logo",
    "Togli il logo":"Remove the logo",
    "Mostra il logo sul tappo":"Show the logo on the holding card",
    "Dimensione del logo":"Logo size",
    "Scritta sul tappo":"Caption on the holding card",
    "Dimensione della scritta":"Caption size",
    "es. Torniamo tra poco":"e.g. Back shortly",
    "LOGO NELL'ANGOLO":"CORNER LOGO",
    "Carica…":"Load…",
    "Usa lo stesso del tappo":"Use the same as the holding card",
    "Mostra il logo sulle slide":"Show the logo on the slides",
    "Posizione":"Position",
    "Dimensione":"Size",
    "In alto a destra":"Top right",
    "In alto a sinistra":"Top left",
    "In basso a destra":"Bottom right",
    "In basso a sinistra":"Bottom left",
    "In basso al centro":"Bottom centre",
    "TIMER":"TIMER",
    "Posizione sulle slide con le parole":"Position on the word slides",
    "Cambia colore sotto i":"Change colour below",
    "Ultimi secondi sotto i":"Final seconds below",
    "FINE ROUND, PER TUTTI I GIOCHI":"END OF ROUND, FOR EVERY GAME",
    "Lo schermo esterno":"The external screen",
    "Torna al tappo":"Back to the holding card",
    "Resta sull'ultima schermata":"Stays on the last screen",
    "Suono":"Sound",
    "Nessuno":"None",
    "Bip":"Beep",
    "Campana":"Bell",
    "Buzzer":"Buzzer",
    "Colpo di scena":"Dramatic hit",
    "Conto alla rovescia":"Countdown",
    "Nessuna squadra":"No team",
    "Nessuna squadra (colori del tema)":"No team (theme colours)",
    "NOME DELLA SQUADRA":"TEAM NAME",
    "Posizione prima che parta il round":"Position before the round starts",
    "A sinistra":"Left",
    "Al centro":"Centre",
    "A destra":"Right",
    "I TUOI SUONI":"YOUR SOUNDS",
    "Nome del suono":"Sound name",
    "Ascolta":"Listen",
    "Aggiungi un suono…":"Add a sound…",
    "Quel file non è un audio.":"That file is not audio.",
    "Il suono è troppo grande: tienilo sotto i 5 MB.":"The sound is too large: keep it under 5 MB.",
    "Mp3, wav, ogg… Tienili brevi: finiscono dentro il file salvato. Poi li scegli qui sopra o nel singolo gioco.":
      "Mp3, wav, ogg… Keep them short: they end up inside the saved file. Then pick them above or in a single game.",
    "Torna all'ultimo salvataggio":"Back to the last save",
    "Torna all'originale":"Back to the original",
    "Ci sono modifiche non ancora salvate.":"There are unsaved changes.",
    "Hai cambiato l'aspetto originale.":"You changed the original look.",

    /* temi, sfondo, transizioni */
    "Notte":"Night",
    "Alto contrasto":"High contrast",
    "Carta":"Paper",
    "TEMI PRONTI":"READY-MADE THEMES",
    "Cambia colori e decorazioni. Poi puoi ritoccare tutto qui sotto.":
      "Changes colours and decorations. You can fine-tune everything below.",
    "TEMA PER":"THEME FOR",
    "Tutti i giochi (tema generale)":"All games (main theme)",
    "usa il generale":"uses the main one",
    "Crea un tema per questo gioco":"Create a theme for this game",
    "Torna al tema generale":"Back to the main theme",
    "Copia il tema da un altro gioco":"Copy the theme from another game",
    "Questo gioco usa il tema generale.":"This game uses the main theme.",
    "Questo gioco ha un tema suo.":"This game has its own theme.",
    "Modifica l'aspetto":"Edit appearance",
    "Tappo, loghi, timer e suono valgono per tutti i giochi.":
      "Holding card, logos, timer and sound apply to every game.",
    "Risposta nel colore della squadra":"Answer in the team colour",
    "Colore della risposta":"Answer colour",
    "IMMAGINE DI SFONDO":"BACKGROUND IMAGE",
    "Carica un'immagine…":"Upload an image…",
    "Cambia immagine…":"Change image…",
    "Togli l'immagine":"Remove the image",
    "Velo del colore di sfondo sopra l'immagine":"Background-colour veil over the image",
    "Una foto o una texture dietro a tutte le slide.":"A photo or texture behind every slide.",
    "TRANSIZIONE TRA LE PAROLE":"TRANSITION BETWEEN WORDS",
    "Nessuna":"None",
    "Dissolvenza":"Fade",
    "Scorrimento dal basso":"Slide up",
    "Volume":"Volume",

    /* squadre */
    "Nome squadra":"Team name",
    "Aggiungi squadra":"Add team",
    "Elimina":"Delete",
    "Squadra":"Team",
    "Squadra %s":"Team %s",
    "Senza nome":"Unnamed",

    /* giochi e round */
    "Gioco %s":"Game %s",
    "Nome del gioco":"Game name",
    "es. Indovina la parola":"e.g. Guess the word",
    "%s round":"%s rounds",
    "Sposta su":"Move up",
    "Sposta giù":"Move down",
    "Elimina il gioco":"Delete the game",
    "Elimina il round":"Delete the round",
    "Avvia questo round":"Start this round",
    "Aggiungi round":"Add round",
    "Avvia round":"Start round",
    "Duplica":"Duplicate",
    "Durata":"Length",
    "Template":"Template",
    "Template predefinito dei round":"Default template for rounds",
    "Come il gioco (%s)":"Same as the game (%s)",
    "Solo timer":"Timer only",
    "Timer e parole":"Timer and words",
    "Parole e risposte":"Words and answers",
    "solo timer":"timer only",
    "Mentre è a schermo la risposta, il tempo":"While the answer is on screen, the clock",
    "Continua a scorrere":"Keeps running",
    "Si ferma finché non vado avanti":"Stops until I move on",
    "A tempo scaduto lo schermo esterno":"When time runs out the external screen",
    "Come gli altri giochi":"Same as the other games",
    "Mostra una schermata sua":"Shows a screen of its own",
    "Immagine di fine…":"End image…",
    "Togli":"Remove",
    "Scritta di fine":"End caption",
    "es. Tempo scaduto":"e.g. Time's up",
    "Suono di fine":"End sound",
    "%s voce":"%s item",
    "%s voci":"%s items",
    "Voci del round, una per riga":"Round items, one per line",
    "Una per riga, con la risposta dopo la barra: domanda | risposta":
      "One per line, answer after the bar: question | answer",

    /* file */
    "Salvato alle %s.":"Saved at %s.",
    "Copia scaricata.":"Copy downloaded.",
    "Configurazione ripresa dal file.":"Settings loaded from the file.",
    "Modifiche non ancora scritte nel file. Premi Salva.":
      "Changes not written to the file yet. Press Save.",
    "Il tuo browser non può riscrivere il file aperto: ne ha scaricato uno nuovo. Sostituisci il vecchio con quello appena scaricato.":
      "Your browser cannot rewrite the open file, so it downloaded a new one. Replace the old file with the one you just got.",
    "Su questo browser il pulsante Salva scarica un file nuovo da mettere al posto del vecchio.":
      "On this browser Save downloads a new file that you put in place of the old one.",
    "In quel file non ho trovato nessuna configurazione.":"No settings found in that file.",
    "La configurazione in quel file è illeggibile.":"The settings in that file are unreadable.",
    "In questo browser c'è una versione più recente, del %s, che non è mai stata scritta nel file.":
      "This browser holds a newer version, from %s, that was never written to the file.",
    "Recupera":"Restore",
    "Ignora":"Ignore",
    "Pagina HTML":"HTML page",
    "Il browser ha bloccato la finestra. Consenti i popup per questa pagina e riprova.":
      "The browser blocked the window. Allow pop-ups for this page and try again.",
  },
};

let LINGUA = "it";
function linguaAttiva(){ return LINGUA; }
function impostaLingua(L){
  LINGUA = (L === "en") ? "en" : "it";
  if(typeof cfg === "object" && cfg) cfg.lingua = LINGUA;
}

function tr(chiave, ...valori){
  const L = linguaAttiva();
  let s = chiave;
  if(L !== "it" && LINGUE[L] && LINGUE[L][chiave] != null) s = LINGUE[L][chiave];
  valori.forEach(v => { s = s.replace("%s", v); });
  return s;
}

function tOpz(oggetto){
  const r = {};
  for(const k in oggetto) r[k] = tr(oggetto[k]);
  return r;
}

function locale(){ return linguaAttiva() === "en" ? "en-GB" : "it-IT"; }

function traduciPagina(){
  document.documentElement.lang = linguaAttiva();
  document.querySelectorAll("[data-t]").forEach(e => { e.textContent = tr(e.dataset.t); });
  document.querySelectorAll("[data-tp]").forEach(e => { e.placeholder = tr(e.dataset.tp); });
  document.title = linguaAttiva() === "en"
    ? "Q.I.Z — timer and words for live games"
    : "Q.I.Z — timer e parole per giochi dal vivo";
}
