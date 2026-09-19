# Q.I.Z — timer e parole per giochi dal vivo

Un file HTML solo. Regia su un monitor, schermo proiettato sull'altro.
Niente account, niente server, niente rete: doppio clic e funziona.

**[Apri l'app](https://sam-seriameta.github.io/Q.I.Z/)** · **[Istruzioni](ISTRUZIONI.md)** · **[Instructions in English](INSTRUCTIONS.md)**

---

## A cosa serve

Serve a chi conduce un gioco a squadre davanti a un pubblico e ha bisogno di
due cose che di solito non stanno insieme: un conto alla rovescia grande e
leggibile dal fondo della sala, e delle parole o domande che compaiono una
alla volta quando decide lui.

Gli strumenti che esistono fanno l'una o l'altra cosa. I timer da palco
contano e basta, le piattaforme tipo quiz vogliono che il pubblico risponda
dal telefono. Qui invece il pubblico guarda lo schermo e tu comandi tutto
dalla tastiera.

## Cosa fa

- **Timer grande**, comandato a mano: parte, si ferma, si azzera
- **Correzione in corsa**: se sbagli a premere aggiungi o togli secondi senza far ripartire il round
- **Tre template**: solo timer; timer e parole; parole e risposte, dove la risposta si rivela al tuo comando
- **Giochi e round**: i round stanno dentro i giochi, si riordinano, si duplicano
- **Un colore per squadra**, che tinge grafica, targhetta e barra del tempo; oppure round senza squadra, con i colori del tema
- **Temi pronti** da cui partire, poi tutto personalizzabile: colori, immagine di sfondo, loghi, carattere, transizioni tra le parole, posizione di timer e nome della squadra
- **Un aspetto diverso per ogni gioco**, se ne hai più di uno
- **Torna indietro**: ogni impostazione dell'aspetto si riporta all'ultimo salvataggio con un clic
- **Suono di fine round** e schermata di chiusura, diversi per ogni gioco: dodici suoni pronti, tra cui buzzer e ding da quiz televisivo, più quelli che carichi tu
- **Italiano e inglese**
- **Funziona offline**: nessuna connessione, nessun account, nessun dato raccolto

## Come funziona il salvataggio

Non c'è nessun file di configurazione da gestire. Premi **Salva** e la tua
configurazione viene scritta dentro l'HTML stesso: quel file diventa il tuo
programma, con le tue squadre, i tuoi giochi e la tua grafica già dentro.

Su Chrome ed Edge il pulsante riscrive il file aperto. Su Firefox e Safari ne
scarica uno nuovo da mettere al posto del vecchio.

## Aggiornamenti

Una copia scaricata resta com'è. Quando esce una versione nuova, aprila dal
sito, apri il menu **Altro** e premi **Riprendi da un file**: la tua
configurazione si trasferisce. Le funzioni arrivate dopo partono spente, il
resto resta com'era.

## Sviluppo

I sorgenti stanno in `src/`. La build unisce tutto, incorpora carattere e
immagini e scrive `dist/index.html`, che è insieme il sito e il file da
scaricare:

```
python3 tools/build.py
```

## Licenza

MIT: fai quello che vuoi, anche usarlo per lavoro. Il carattere incorporato è
DejaVu, ridistribuibile.
I suoni di fine round Arcade, Sax, Steel drum, Pizzicato e Colpo di scena
vengono dai Music Jingles di [Kenney](https://kenney.nl), in pubblico dominio (CC0).
Buzzer TV, Ding ding e Conto alla rovescia sono sintetizzati da
`tools/suoni/sintetizza.sh`. Il Gong è un colpo tagliato dalla registrazione
[Chinese Gong](https://commons.wikimedia.org/wiki/File:240382_the-very-real-horst_chinese-gong-finish-session-2014-06-10-29-143.wav)
di the_very_Real_Horst, in pubblico dominio (CC0).

---

## Chi l'ha fatto

**Seri a Metà**, collettivo comico sardo. L'app è gratis: se
ti è servita, l'unica cosa che ti chiediamo è di darci un'occhiata.

- Instagram (https://www.instagram.com/sam.seriameta/)
- TikTok (https://www.tiktok.com/@seriameta)
- YouTube (https://www.youtube.com/@SeriaMet%C3%A0)
- Twitch (https://www.twitch.tv/seriameta)

---

<a name="english"></a>
## English

A single HTML file: control panel on one monitor, projected screen on the
other. No account, no server, no network, nothing collected.

Large hand-driven countdown, live clock correction that does not restart the
round, three round templates (timer only; timer and words; words and answers),
rounds grouped into games, a colour per team (or none, keeping the theme
colours). Start from a ready-made theme, then customise everything: colours,
background image, logos, typeface, word transitions, a separate look per game,
and a one-click reset of any setting to the last save. Twelve built-in end
sounds, including TV-quiz buzzers and dings, plus your own. Interface in
Italian and English.

Press **Save** and your setup is written back into the HTML file itself, so
that file becomes your program. See **[INSTRUCTIONS.md](INSTRUCTIONS.md)**.

MIT licensed. Made by Seri a Metà.
