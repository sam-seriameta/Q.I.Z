#!/usr/bin/env python3
"""Unisce i sorgenti in un unico file HTML autonomo, che funziona anche offline."""

import base64
import json
import pathlib
import sys

RADICE = pathlib.Path(__file__).resolve().parent.parent
SRC = RADICE / "src"
TOOLS = RADICE / "tools"
DIST = RADICE / "dist"

VERSIONE = "1.0.0"

REPO = "https://github.com/sam-seriameta/Q.I.Z"


def leggi(percorso):
    return percorso.read_text(encoding="utf-8")


def costruisci():
    font = leggi(TOOLS / "font_b64.txt").strip()
    logo = leggi(TOOLS / "logo_segnaposto.txt").strip()
    logo_sam = leggi(TOOLS / "logo_sam.txt").strip()

    css_schermo = leggi(SRC / "schermo.css").replace("__FONT__", font)
    css_regia = leggi(SRC / "regia.css")

    js = "\n".join(
        leggi(SRC / n) for n in ["lingue.js", "app1.js", "app2.js", "app3.js"]
    )
    # suoni di fine round: ogni mp3 in tools/suoni diventa un tipo, col nome del file
    suoni = {p.stem: "data:audio/mpeg;base64," + base64.b64encode(p.read_bytes()).decode()
             for p in sorted((TOOLS / "suoni").glob("*.mp3"))}
    js = (js.replace('"__SUONI__"', json.dumps(suoni))
            .replace("__VERSIONE__", VERSIONE)
            .replace("__LOGO_SEGNAPOSTO__", logo)
            .replace("__LOGO_SAM__", logo_sam)
            .replace("__REPO__", REPO))

    # la pagina appena costruita non porta nessuna configurazione:
    # al primo avvio l'app parte dal tema neutro
    config = json.dumps({"versione": 1})

    html = leggi(SRC / "index.html")
    html = (html
            .replace("__CSS_REGIA__", css_regia)
            .replace("__CSS_SCHERMO__", css_schermo)
            .replace("__JS__", js)
            .replace("__CONFIG__", config)
            .replace("__VERSIONE__", VERSIONE)
            .replace("__REPO__", REPO))

    DIST.mkdir(exist_ok=True)
    uscita = DIST / "index.html"
    uscita.write_text(html, encoding="utf-8")
    print("scritto %s — %d KB" % (uscita, len(html.encode()) / 1024))
    return uscita


if __name__ == "__main__":
    sys.exit(0 if costruisci() else 1)
