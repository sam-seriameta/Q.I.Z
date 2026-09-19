#!/bin/sh
# Suoni da quiz televisivo, sintetizzati con ffmpeg: nessuna licenza di terzi.
# Rigenera gli mp3 in questa cartella: sh tools/suoni/sintetizza.sh
cd "$(dirname "$0")"
fai(){  # nome durata espressione
  ffmpeg -v error -y -f lavfi -i "aevalsrc='$3':s=44100:d=$2" \
    -af "lowpass=f=9000,loudnorm=I=-15:TP=-1.5" -ac 1 -ar 44100 -b:a 64k "$1.mp3"
}
# buzzer da risposta sbagliata: due onde quadre stonate, attacco secco
fai buzzer-tv 0.95 "0.35*(sgn(sin(2*PI*98*t))+sgn(sin(2*PI*104*t)))*min(1,t/0.004)*min(1,max(0,(0.95-t)/0.04))"
# ding ding da risposta giusta: due colpi di campanello
B='exp(-4*X)*(sin(2*PI*1568*X)+0.45*exp(-6*X)*sin(2*PI*4327*X)+0.2*exp(-12*X)*sin(2*PI*8467*X))*min(1,X/0.002)'
D1=$(echo "$B" | sed 's/X/t/g'); D2=$(echo "$B" | sed 's/X/(t-0.2)/g')
fai ding-ding 1.5 "0.5*($D1+gte(t,0.2)*$D2)"
# conto alla rovescia: tre bip e uno lungo più acuto
P='(sin(2*PI*F*t)+0.3*sin(2*PI*3*F*t))'
fai countdown 1.9 "0.45*(between(mod(t,0.4),0,0.12)*lt(t,1.2)*$(echo "$P" | sed 's/F/880/g')+between(t,1.2,1.85)*$(echo "$P" | sed 's/F/1760/g'))*min(1,max(0,(1.85-t)/0.03))"
