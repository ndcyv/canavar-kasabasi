# Builds the online Canavar Kasabası (public/index.html + public/engine.js)
# from the single-player game sources in reference/ plus the multiplayer bridge.
# Run: python3 scripts/build.py
from pathlib import Path
p = Path(__file__).resolve().parent.parent
ref = p / 'reference'
js = ''.join((ref / f).read_text() for f in ['c1.js', 'engine.js', 'paper.js', 'c2a.js', 'c2b.js', 'c2c.js', 'c3a.js', 'c3b.js'])
def patch(old, new, count=1):
    global js
    n = js.count(old)
    assert n == count, (old[:90], n)
    js = js.replace(old, new)
patch("const OWNER = '__OWNER__';", "const OWNER = window.MULTIPLAYER_NAME || 'Nehir';")
# lines about switching that need a different wording online (the rest are rewritten by the bridge)
patch("Nehir ile kavanozların önünde Boşluk'a bas: ses dalgası gönderir.\\nDoğru kavanozu bulunca Q ile Bade'ye geç, o alsın.",
      "Nehir kavanozların önünde Boşluk'a basınca ses dalgası gönderir.\\nDoğru kavanozu Bade alır.")
patch("Yarasa sürüsü vampiri çimdikledi! Ay!\\nQ ile Nehir'e geç: yarasalar Nehir'i çok sever.", "Yarasa sürüsü vampiri çimdikledi! Ay!\\nYarasalardan uzak dur. Nehir'i ise hiç ısırmazlar.")
patch("await say(\"Yarasaların yanından geçerken Q ile Nehir'e geç. Yarasalar Nehir'e hiç dokunmaz!\");", "await say(\"Bade, yarasaların yanından dikkatlice geç. Yarasalar Nehir'e hiç dokunmaz!\");")
patch("\\nM tuşu: harita · Q tuşu: kuzen değiştir", "\\nM tuşu: harita")
patch("  const kk = `<span><kbd>Q</kbd> ${S.active === 'Nehir' ? \"Bade'ye\" : \"Nehir'e\"} geç</span><span><kbd>M</kbd> Harita</span><span><kbd>Boşluk</kbd> İncele</span>`;",
      "  const kk = '<span><kbd>M</kbd> Harita</span><span><kbd>Boşluk</kbd> İncele</span><span>📻 Telsiz açık</span>';")
# timers remember whose scene they belong to (schedule is defined in the bridge)
js = js.replace('setTimeout(', 'schedule(')
bridge = (p / 'scripts/engine-bridge.js').read_text()
i = js.rindex('})();')
js = js[:i] + bridge + '\n' + js[i:]
(p / 'public/engine.js').write_text(js)

css = (ref / 'style.css').read_text(); body = (ref / 'body.html').read_text()
def hpatch(old, new):
    global body
    assert old in body, old[:80]
    body = body.replace(old, new)
hpatch('<div id="wrap" lang="tr">', '<div id="wrap" lang="tr">\n  <div id="connection" role="status" aria-live="polite">Bağlanıyor…</div>')
hpatch('<div id="title" class="overlay">', '<div id="title" class="overlay" hidden>')
hpatch('<div id="stage">', '''<div id="stage">
    <section id="lobby" class="overlay"><div class="card">
      <h2>Canavar Kasabası · Birlikte</h2><p class="tag">Vampir Bade ile Yarasa Nehir aynı gecede!</p>
      <p>Biriniz yeni oda kursun ve oda kodunu kuzenine söylesin.<br>Diğeriniz aynı kodu yazıp kendi kahramanını seçsin.</p>
      <form id="join"><label>Kahramanın <select id="player-name"><option>Nehir</option><option>Bade</option></select></label>
      <label>Oda kodu <input id="room-code" maxlength="8" autocomplete="off" placeholder="Yeni oda için boş bırak"></label>
      <button class="big" type="submit">KATIL</button></form><p id="join-error" role="alert"></p>
      <p class="hand">Oklar: yürü · Boşluk: incele, konuş · M: harita</p>
    </div></section>''')
hpatch('<span><kbd>Q</kbd> Nehir ↔ Bade</span>', '<span>📻 Uzaktaysanız telsizle konuşursunuz</span>')
hpatch('<button id="btn-intro" class="big" type="button">BAŞLAYALIM! (Boşluk)</button>', '<p class="together">Her biriniz kendi kahramanını yönetir. Biri yükseğe uzanamazsa, karanlıkta göremezse ya da gizli bir şeyi bulamazsa, oyun kuzenine telsizle haber verir ve haritasında 📍 işareti çıkar. Trene, kuleye ve helikoptere birlikte binersiniz!</p>\n        <button id="btn-intro" class="big" type="button">BAŞLAYALIM! (Boşluk)</button>')
hpatch('<button id="btn-restart" type="button">↺ BAŞTAN BAŞLA</button>', '<button id="btn-restart" type="button">↺ ORTAK OYUNU SIFIRLA</button>')
hpatch('  <div id="util">', '  <div id="scene-note" role="status"></div>\n  <div id="util">')
css += '''
#connection { color: #f5e9cc; font: 600 14px/1.5 var(--font-ui); margin-bottom: 8px; min-height: 22px; }
#lobby { z-index: 20; }
#lobby label { display: block; margin: .7em 0; }
#lobby input, #lobby select { font: inherit; padding: .5em; border-radius: 8px; background: #fffaf0; color: var(--ink); border: 1px solid var(--paper-edge); max-width: 100%; }
#join-error { color: #a13225; }
#intro { z-index: 15; }
#wrap { width: min(1200px, 100%, calc((100dvh - 120px) * 1.6)); }
#scene-note { color: #eacb91; font: 14px/1.5 var(--font-ui); text-align: center; min-height: 21px; margin-top: 8px; }
'''
title = '<title>Canavar Kasabası – Nehir ve Bade</title>'
html = f'<!doctype html>\n<html lang="tr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n{title}\n<style>\n{css}</style>\n</head>\n<body>\n{body}<script src="/engine.js"></script><script type="module" src="/multiplayer.js"></script></body></html>\n'
(p / 'public/index.html').write_text(html)
print('built', len(js), len(html))
