
/* ---------------------------------------------------------------------
   15. THE STORY
   --------------------------------------------------------------------- */
function nextHint() {
  const F = S.flags;
  if (!F.arrived) {
    if (!F.candyBag) return "Ayşe Teyze'nin kapısını çal. Evimizin sağındaki ilk ev!";
    if (!F.tickets) return 'Hasan Amca\'nın kapısını çal. Bilmecesini bilirsen sana bir hazine verecek!';
    return "Sokağın sonundaki Korku Treni'ne git. Kondüktöre biletleri göster!";
  }
  if (F.homeBack) return 'Eve git! Funda, Başak ve Duru sizi bekliyor.';
  if (F.skyDone) return "İstasyondaki Kondüktör Takırtı'ya git. Eve dönme vakti!";
  const L = F.lanterns;
  if (!L.mimi) return F.bandage ? "Sargıyı Mumya Mimi'ye ver!" : "Mumya Evi, kasabanın sol üstünde. Kavanozları önce Nehir dinlesin, doğru olanı Bade alsın!";
  if (!L.kurtul) return !streetLit() ? 'Karanlık Sokak, kasabanın sağ üstünde. Bade karanlıkta görür: üç lambayı yak!' : "Kurtul evlerin arasındaki dar aralıkta saklanıyor. Oraya sadece Nehir sığar!";
  if (!L.frenk) return !F.moved.junk ? "Hurdalık, meydanın sağında. Bade eski kırmızı arabayı itsin!" : !F.bolt ? 'Cıvata hurdaların arasında kayboldu. Nehir ses dalgalarıyla bulur!' : "Cıvatayı Frenk'e ver!";
  if (!L.cemile) {
    if (!F.cemileMet) return "Cadı Kulübesi, kasabanın sol altında. Cadı Cemile'nin süpürgesi kırık!";
    if (!F.moonDrop) return 'Ay ışığı damlası Cadı Kulübesi\'nde, en üst rafta. Bade uzanabilir!';
    if (!F.potion) return 'Tarif kitabını oku, iksiri kazanda yap!';
    if (!F.straw) return "Balkabağı Tarlası'nda altın saman saklı. Nehir'in ses dalgaları bulur!";
    return "İksiri ve altın samanı Cadı Cemile'ye ver!";
  }
  if (!L.hulya) return !F.moved.stone ? 'Mezarlıktaki mahzenin kapısını kocaman bir taş kapatıyor. Bade itebilir!' : !F.musicBox ? 'Mahzendeki müzik kutusu tavandaki kirişte. Nehir baş aşağı asılabilir!' : "Müzik kutusunu Hayalet Hülya'ya ver!";
  if (!L.selo) return !F.bone ? "Mezarlıkta gölgelerde bir hayalet köpek var, onu Bade görür. Kemiği nerede? Nehir'in ses dalgaları iz bulur!" : "Kemiği Selo'ya ver! Selo'yu Bade görebilir.";
  if (!L.pitir) return !F.bells || !F.notes ? 'Çalgı Sahnesi, Mumya Evi ile meydanın arasında. Çanlar ağacın tepesinde, nota kâğıdı sahnenin altında!' : "Çanları ve notayı Kara Kedi Pıtırcık'a ver!";
  if (!F.towerLit) return "Bütün fenerler tamam! Saat kulesindeki Büyük Fener'e git. Nehir ile Bade yan yana olsun!";
  return 'Helikopter pistine git. Pilot Pırpır sizi bekliyor!';
}
async function opening() {
  await scene(async () => {
    S.camTarget = { x: 80.5, y: 5.2 };
    await wait(0.5);
    await say('Kostümleriniz harika olmuş kızlar!', { speaker: SAY.funda });
    await say("Nehir'ciğim, o parıltılı kanatlarınla çok tatlı bir yarasa oldun!", { speaker: SAY.funda });
    await say("Bade'ciğim, minik dişlerin ve kırmızı astarlı pelerininle tam bir vampirsin!", { speaker: SAY.basak });
    await say('Vampirler karanlıkta görür! Hem de çok uzun boylu ve güçlüdür.', { speaker: SAY.Bade });
    await say('Yarasalar da ses dalgalarıyla gizli şeyleri bulur! Bir de dar yerlerden geçer, tavana baş aşağı asılır.', { speaker: SAY.Nehir });
    await say('Haydi, komşulara “Şeker mi, şaka mı?” demeye gidin. Birbirinizden hiç ayrılmayın, tamam mı?', { speaker: SAY.basak });
    await say('Ben de gelmek istiyorum! Ben de gelmek istiyorum!', { speaker: SAY.duru, loud: true });
    await say("Duru'cuğum, sen daha çok küçüksün. Dört yaşında bir kız gece Korku Treni'ne binmez. Sen bizimle evde kal, olur mu?", { speaker: SAY.basak });
    await say('Üzülme Duru! Sana bol bol şeker getireceğim, söz!', { speaker: SAY.Bade });
    await say("Sokağın sonundaki Korku Treni'ne de binebilirsiniz… biletiniz olursa!", { speaker: SAY.funda });
    S.camTarget = null;
    S.flags.introDone = true;
  });
  showToast('Aşağıdaki ÇIKIŞ kapısından sokağa çık.\nKomşuların kapısının önüne gidip Boşluk tuşuna bas!', 6);
}
function pickupFx(text, x, y) { Sound.play('pickup'); sparkle(x, y - 0.4); popup(text, x, y - 1.2, '#fff3c4', 24); updateHUD(); }
// used inside a scene: the friend hands over the lantern and goes to the square
async function giveLantern(key, x, y) {
  const F = S.flags;
  Sound.play('win'); sparkle(x, y - 0.8, '#ffb347', 26);
  S.gift = { x, y, k: 0 };
  await tween(0.9, (k) => { S.gift.k = k; });
  S.gift = null;
  F.lanterns[key] = true; F.lanternCount++; S.hearts = 3; S.hintTimer = 0; updateHUD();
  await say(`${F_NAME[key]} size balkabağı fenerini verdi! 🎃 (${F.lanternCount}/${N_L})\nKalpleriniz de doldu! ❤️❤️❤️`, { loud: false });
  S.leaving = { key, x, y, k: 0 };
  await tween(1.1, (k) => { S.leaving.k = k; });
  S.leaving = null;
  if (F.lanternCount === N_L) await say('Bütün fenerler tamam! 🎃', { speaker: SAY.Bade, loud: true });
  if (F.lanternCount % 2 === 0) saveCheckpoint();
}

async function interact(e) {
  const F = S.flags, c = P(), me = c.who, p = entPos(e);
  if (e.type === 'jar') { await scene(() => jarScene(e)); updateHUD(); return; }
  if (e.high && me === 'Nehir') {
    if (cooldown('high', 0.6)) { Sound.play('wrong'); showToast("Çok yüksek! Nehir yetişemiyor.\nQ tuşuna bas, Bade'ye geç. O uzun boylu!", 3.6); }
    return;
  }
  if (e.hang && me === 'Bade') {
    await scene(async () => {
      await say('Müzik kutusu tavandaki kirişe takılmış. Çok yüksek! Bade bile yetişemiyor.', { speaker: SAY.Bade });
      await say("Ama yarasalar uçar ve tavana baş aşağı asılır! Q tuşuna bas, Nehir'e geç.");
    });
    return;
  }
  switch (e.type) {
    // ---------------- HOME + NEIGHBOURS
    case 'mom':
      if (e.who === 'Funda') await scene(() => say(F.candyBag && F.tickets ? 'Biletleriniz de var! Korku Treni sokağın sonunda, sağda. İyi eğlenceler!' : 'Komşuların kapısını çalın. Kapının önüne gidip Boşluk tuşuna basın!', { speaker: SAY.funda }));
      else await scene(() => say(F.candyBag ? 'Şeker çantanızı sıkı tutun! Bu gece sokakta şekere bayılan garip yaratıklar varmış.' : "Ayşe Teyze'nin kapısını çalmayı unutmayın, en güzel şekerler onda!", { speaker: SAY.basak }));
      break;
    case 'duru':
      await scene(() => say(F.homeBack ? 'Şekerlerim nerede? Hi hi!' : 'Ben de büyüyünce vampir olacağım! Ya da yarasa! Ya da ikisi birden!', { speaker: SAY.duru }));
      break;
    case 'mirror':
      await scene(async () => {
        await say('Aynada bir vampir ile bir yarasa var… Aaa, bunlar biziz!', { speaker: SAY.Nehir });
        await say('Kırmızı astarlı pelerinim harika duruyor!', { speaker: SAY.Bade });
        await say('Benim kanatlarım da pırıl pırıl parlıyor!', { speaker: SAY.Nehir });
      });
      break;
    case 'knock': await scene(() => knockScene(e)); break;
    case 'bowl3':
      F.bowl3 = true; pickupFx('🍬🍬', p.x, p.y);
      await scene(async () => {
        await say('Bade parmak uçlarında yükseldi ve penceredeki kâseden iki şeker aldı. Mmm, çilekli!', { speaker: SAY.Bade });
        await say('Uzun boylu vampirler yükseğe uzanır! Yüksek bir şey görünce Bade\'yi çağırmayı unutma.');
      });
      break;
    case 'note3':
      F.note3 = true; Sound.play('sonar'); sparkle(p.x, p.y - 0.5, '#d7c4ff');
      await scene(async () => {
        await say('Bi-bip! Nehir\'in ses dalgaları çalının içinde bir şey buldu: katlanmış bir not!', { speaker: SAY.Nehir });
        await say('“Bu gece Canavar Kasabası\'nda Ay Festivali var. Ama ay kayboldu! Yardım edecek cesur çocuklar aranıyor. Korku Treni\'ne binin! — K.D.”');
        await say('Canavar Kasabası mı? K.D. de kim?', { speaker: SAY.Bade });
        await say('Gizli şeyleri ben bulurum! Bir yerde “bi-bip” sesi duyarsan bana geç.', { speaker: SAY.Nehir });
      });
      break;
    case 'kond': case 'trainGate': await scene(conductorScene); break;
    // ---------------- STATION + SQUARE
    case 'stationSign': await scene(() => say('CANAVAR KASABASI İSTASYONU\n“Nüfus: 66 canavar, 1 kara kedi, 0 korkak.”')); break;
    case 'info': await scene(() => say(e.text)); break;
    case 'drakos':
      await scene(async () => {
        if (F.lanternCount >= N_L && !F.towerLit) { await say("Yedi fener! Muhteşem! Şimdi saat kulesinin önündeki Büyük Fener'i yakın. Ama çok yüksekte…", { speaker: SAY.drakos }); await say('Bade, Nehir\'i omzuna alırsa belki yetişir! İkiniz yan yana olun.', { speaker: SAY.drakos }); }
        else if (F.towerLit) await say('Pilot Pırpır helikopter pistinde! Bulutların yanına uçun!', { speaker: SAY.drakos });
        else {
          await say(`Şu ana kadar ${F.lanternCount} fener topladınız. ${N_L - F.lanternCount} fener daha lazım!`, { speaker: SAY.drakos });
          await say('İpucu: ' + nextHint(), { speaker: SAY.drakos });
        }
      });
      break;
    case 'bora':
      S.hearts = 3; updateHUD(); Sound.play('pickup'); sparkle(c.x, c.y - 1, '#ff8fc4', 16);
      await scene(async () => {
        await say('Sıcak kakao! Hüüüp… Mis gibi! Kalpleriniz doldu! ❤️❤️❤️', { speaker: SAY.bora });
        if (once('boraJoke')) await say('Kakaoyu o kadar sıcak yapıyorum ki kabak kafam bile ısınıyor. Hah hah!', { speaker: SAY.bora });
      });
      break;
    case 'bigLantern': await scene(towerScene); break;
    case 'heli': await scene(skyScene); break;
    // ---------------- MUMYA MİMİ
    case 'mimi':
      if (F.bandage) {
        await scene(async () => {
          await say('Sargım! Yedek sargım! Teşekkürler kızlar!', { speaker: SAY.mimi, loud: true });
          S.spin = { x: p.x, y: p.y, k: 0 }; Sound.play('sparkle');
          await tween(1.2, (k) => { S.spin.k = k; });
          S.spin = null;
          await say('Mimi döne döne sarıldı. Şimdi pırıl pırıl, bembeyaz bir mumya!');
          await say('Festivalde dans ederken artık hiç çözülmem!', { speaker: SAY.mimi });
          await giveLantern('mimi', p.x, p.y);
        });
        break;
      }
      await scene(async () => {
        F.mimiMet = true;
        await say('Ah ah ahh! Sargılarım çözüldü… Bütün gece döne döne çözüldüm!', { speaker: SAY.mimi });
        await say('Yedek sargı rulom raftaki kavanozlardan birinde. Ama hangisinde, hatırlamıyorum. Hepsi birbirinin aynısı!', { speaker: SAY.mimi });
        await say('Kavanozlar çok yüksekte ama ben uzanırım!', { speaker: SAY.Bade });
        await say('Ben de ses dalgalarımla içlerini dinlerim. Hangisinden yumuşak ses gelirse sargı odur!', { speaker: SAY.Nehir });
      });
      showToast("Nehir ile kavanozların önünde Boşluk'a bas: ses dalgası gönderir.\nDoğru kavanozu bulunca Q ile Bade'ye geç, o alsın.", 6);
      break;
    // ---------------- KURT ADAM KURTUL
    case 'lamp': {
      F.lamps[e.n] = true; Sound.play('chime'); sparkle(p.x, p.y - 2, '#ffe9a8', 16);
      const n = [1, 2, 3].filter((k) => F.lamps[k]).length;
      if (n < 3) { showToast(`Bade yukarı uzanıp lambanın düğmesini çevirdi. Işık yandı! (${n}/3)\nKaranlıkta başka sönük lamba var mı?`, 4); break; }
      await scene(async () => {
        await say('Üçüncü lamba da yandı! Bütün sokak ışıl ışıl!', { speaker: SAY.Bade, loud: true });
        await say('Işıklar yandı… Ama ben hâlâ bu dar aralıktan çıkmaya korkuyorum. Biri yanıma gelip elimi tutsa…', { speaker: SAY.kurtul });
        await say("Ben o aralığa sığamam. Ama Nehir minicik! Q ile Nehir'e geç.", { speaker: SAY.Bade });
      });
      break;
    }
    case 'kurtul':
      await scene(async () => {
        if (streetLit()) {
          if (me === 'Bade') { await say("Kurtul evlerin arasındaki dar aralıkta büzülmüş. Ben oraya sığamam! Q ile Nehir'e geç.", { speaker: SAY.Bade }); return; }
          if (c.y > 17.4) { await say('Kurtul aralığın en dibinde büzülmüş. Elini tutmak için dar aralıktan içeri gir!', { speaker: SAY.Nehir }); return; }
          await kurtulBrave(); return;
        }
        F.kurtulMet = true;
        await say('Kim o?! Iıı… Lütfen korkutmayın beni!', { speaker: SAY.kurtul });
        await say('Ben Kurtul. Kurt adamım ama… karanlıktan çok korkuyorum. O yüzden bu dar aralığa saklandım.', { speaker: SAY.kurtul });
        await say('Sokağın üç lambası söndü. Onlar yanarsa belki çıkmaya cesaret ederim!', { speaker: SAY.kurtul });
        await say('Merak etme Kurtul! Ben vampirim, karanlıkta lambaları görürüm. Hepsini yakarız!', { speaker: SAY.Bade });
      });
      break;
    // ---------------- FRENK
    case 'frenk':
      await scene(async () => {
        if (F.bolt) {
          await say('Cıvatam! Hemen takayım… Tık!', { speaker: SAY.frenk, loud: true });
          Sound.play('click'); S.frenkFixed = true;
          await say('Başım dimdik oldu! Artık festivalde başım dönmeden dans edebilirim.', { speaker: SAY.frenk });
          await giveLantern('frenk', p.x, p.y);
          return;
        }
        if (F.moved.junk) { await say('Cıvatam o hurdaların arasında bir yerde… Ama minicik, ben bulamıyorum!', { speaker: SAY.frenk }); if (me === 'Bade') await say("Ben de göremiyorum. Q ile Nehir'e geç, onun ses dalgaları minik şeyleri bulur!", { speaker: SAY.Bade }); return; }
        F.frenkMet = true;
        await say('Merhaba… Ben Frenk. Boynumun cıvatası düştü. Başım hep yana kayıyor, bakın!', { speaker: SAY.frenk });
        await say('Cıvata şu eski kırmızı arabanın altına yuvarlandı! Hurdalığın sağ tarafında, görürsünüz. Ama araba çok ağır, ben itemiyorum.', { speaker: SAY.frenk });
        await say('Bir de balçıklara dikkat edin. Her şeye yapışırlar ama şekere bayılırlar!', { speaker: SAY.frenk });
        if (me === 'Nehir') await say("Araba çok ağır. Bade güçlüdür! Q ile Bade'ye geçelim.", { speaker: SAY.Nehir });
        else await say('Ben güçlüyüm! O kırmızı arabayı kenara iterim. 💪', { speaker: SAY.Bade });
      });
      break;
    case 'bolt':
      F.bolt = true; Sound.play('sonar'); pickupFx('🔩', p.x, p.y);
      await scene(() => say("Bi-bip! Ses dalgalarım hurdaların arasında minik bir şey buldu: Frenk'in cıvatası!", { speaker: SAY.Nehir }));
      break;
    case 'heavy':
      if (me === 'Nehir') { Sound.play('wrong'); await scene(() => say(`${e.name} çok ağır! Nehir itemiyor.\nBade güçlüdür. Q tuşuyla Bade'ye geç!`, { speaker: SAY.Nehir })); break; }
      await scene(async () => {
        const x0 = e.x, y0 = e.y; Sound.play('rumble'); shake(0.25);
        await tween(0.9, (k) => { e.dx = (e.to[0] - x0) * k; e.dy = (e.to[1] - y0) * k; });
        F.moved[e.id] = true; dust(e.to[0], e.to[1], 12);
        if (e.id === 'junk') await say("Bade eski kırmızı arabayı kenara itti. 💪\nAma cıvata nerede? Hurdaların arasında minicik bir şey kaybolmuş olmalı…", { speaker: SAY.Bade });
        else await say('Bade kocaman taşı kenara itti. 💪\nMahzenin kapısı açıldı!', { speaker: SAY.Bade });
      });
      break;
    // ---------------- CADI CEMİLE
    case 'cemile': await scene(cemileScene); break;
    case 'recipe':
      await scene(() => say('UÇAN SÜPÜRGE İKSİRİ\n1. 🐸 Kurbağa ayağı (lastik olanından!)\n2. 🦇 Yarasa tozu (yani mor şeker)\n3. 🌙 Ay ışığı damlası\nSonra kazanı üç kere karıştır!'));
      break;
    case 'cauldron': await scene(brewPotion); break;
    case 'moonDrop':
      F.moonDrop = true; pickupFx('🌙', p.x, p.y);
      await scene(() => say('Bade en üst rafa uzandı ve ışıl ışıl parlayan küçük şişeyi aldı: Ay ışığı damlası!', { speaker: SAY.Bade }));
      break;
    case 'scarecrow':
      await scene(async () => {
        await say('Korkuluğun şapkasına bir kâğıt iğnelenmiş:\n“Kabaklar sırayla yuvarlanır. Kabak geçince koş!”');
        await say('Korkuluk göz kırptı! …Yoksa bana mı öyle geldi?', { speaker: SAY.Nehir });
      });
      break;
    case 'straw':
      F.straw = true; Sound.play('sonar'); pickupFx('🌾', p.x, p.y);
      await scene(async () => {
        await say('Bi-bip! Ses dalgalarım kabakların arasında bir şey buldu: altın gibi parlayan bir tutam saman!', { speaker: SAY.Nehir });
      });
      break;
    // ---------------- HAYALET KÖPEK SELO
    case 'selo':
      await scene(async () => {
        if (F.bone) {
          await say('Hav hav hav! Selo kemiğini görünce havaya zıpladı ve üç kere fır döndü!', { speaker: SAY.selo, loud: true });
          await say('Hav! (Teşekkürler, der gibi elinizi yaladı. Hayalet dili gıdıkladı!)', { speaker: SAY.selo });
          await giveLantern('selo', p.x, p.y);
          return;
        }
        F.seloMet = true;
        await say('Mezar taşlarının gölgesinde bir şey kıpırdıyor… Bir hayalet köpek! Gölgelerde görünmez oluyor ama vampir gözleri onu görür.', { speaker: SAY.Bade });
        await say('Selo kuyruğunu sallıyor ama gözleri çok üzgün. Hav… hav…', { speaker: SAY.selo });
        await say('Bir şey mi kaybettin Selo?', { speaker: SAY.Bade });
        await say('Hav! (Kemiğimi kaybettim, der gibi bakıyor.)', { speaker: SAY.selo });
        await say("Yerde iz var mı acaba? Ben göremiyorum. Nehir'in ses dalgaları gizli izleri bulur!", { speaker: SAY.Bade });
      });
      break;
    case 'prints':
      Sound.play('sonar'); F.printsSeen = true;
      await scene(async () => {
        await say('Bi-bip! Minik pati izleri! Hafif hafif parlıyorlar. Çitteki küçük deliğe doğru gidiyorlar.', { speaker: SAY.Nehir });
        await say("Ben o delikten geçemem, çok uzunum. Ama sen küçüksün Nehir!", { speaker: SAY.Bade });
      });
      break;
    case 'kemik':
      await scene(async () => {
        await say('Zzz… Horrr… İskelet Kemik bahçe sandalyesinde mışıl mışıl uyuyor.');
        await say('Zzz… Selo yine bir şeyi… bahçeme gömdü… zzz… takır takır…', { speaker: SAY.kemik });
      });
      break;
    case 'dig':
      F.bone = true; Sound.play('sonar'); dust(p.x, p.y, 14, '#7a5a3a'); pickupFx('🦴', p.x, p.y);
      await scene(() => say("Bi-bip! Toprağın altında bir şey var! Nehir minik pençeleriyle kazdı… Bir kemik! Bu, Selo'nun kemiği olmalı!", { speaker: SAY.Nehir }));
      break;
    // ---------------- KARA KEDİ PITIRCIK
    case 'pitir':
      if (F.bells && F.notes) { await scene(songGame); break; }
      await scene(async () => {
        if (!F.pitirMet) {
          F.pitirMet = true;
          await say('Miyav! Ben Kara Kedi Pıtırcık, kasabanın müzisyeniyim.', { speaker: SAY.pitir });
          await say('Festivalde çanlarımla şarkı çalacaktım. Ama rüzgâr çanlarımı ağacın tepesine, nota kâğıdımı da sahnenin altına uçurdu!', { speaker: SAY.pitir });
          await say('Ağaç çok yüksek, sahnenin altındaki delik de minicik. Miyav…', { speaker: SAY.pitir });
          return;
        }
        const need = [!F.bells ? 'ağaçtaki çanlarım' : null, !F.notes ? 'sahnenin altındaki nota kâğıdım' : null].filter(Boolean);
        await say('Miyav! Hâlâ ' + need.join(' ve ') + ' lazım.', { speaker: SAY.pitir });
      });
      break;
    case 'bells':
      F.bells = true; Sound.play('chime'); pickupFx('🔔', p.x, p.y);
      await scene(() => say('Bade ağacın tepesine uzandı ve çanları dalından çözdü. Çın çın!', { speaker: SAY.Bade }));
      break;
    case 'notes':
      F.notes = true; pickupFx('📜', p.x, p.y);
      await scene(() => say('Nehir sahnenin altındaki minik delikten süründü… İşte nota kâğıdı! Biraz tozlu ama sağlam.', { speaker: SAY.Nehir }));
      break;
    // ---------------- HAYALET HÜLYA
    case 'hulya':
      if (F.musicBox) {
        await scene(async () => {
          await say('Müzik kutum! Teşekkürler kızlar!', { speaker: SAY.hulya, loud: true });
          [0, 2, 1, 3, 2, 0].forEach((n, i) => setTimeout(() => Sound.note(n), i * 300));
          await say('Kutunun kapağını açınca şarkım geri geldi. La la laaa… Huuuu! Festivalde bunu herkes için çalacağım.', { speaker: SAY.hulya });
          await giveLantern('hulya', p.x, p.y);
        });
        break;
      }
      await scene(async () => {
        F.hulyaMet = true; Sound.play('ghost');
        await say('Huuuu… Korkmayın, ben Hülya. Bu mahzenin hayaletiyim.', { speaker: SAY.hulya });
        await say('Müzik kutum tavandaki kirişe takıldı. Kapının önündeki taş yüzünden kimse yardıma gelemedi…', { speaker: SAY.hulya });
        if (me === 'Bade') await say("Kiriş çok yüksek. Ama Nehir yarasa! Q ile Nehir'e geçelim, o tavana asılabilir.", { speaker: SAY.Bade });
        else await say('Ben yarasayım! Kirişe uçup baş aşağı asılabilirim!', { speaker: SAY.Nehir });
      });
      break;
    case 'musicBox':
      await scene(async () => {
        await say('Ben yarasayım! Tavana uçabilirim!', { speaker: SAY.Nehir });
        S.hang = { k: 0, x: p.x, y: p.y };
        await tween(0.8, (k) => { S.hang.k = k; });
        Sound.play('bats');
        await say('Nehir kirişe uçtu ve yarasa gibi baş aşağı asıldı! Hop, müzik kutusunu kaptı!', { speaker: SAY.Nehir });
        await tween(0.6, (k) => { S.hang.k = 1 - k; });
        S.hang = null;
        F.musicBox = true; pickupFx('🎵', c.x, c.y);
        await say("Müzik kutusunu Hayalet Hülya'ya götürelim!", { speaker: SAY.Bade });
      });
      break;
    default: break;
  }
  updateHUD();
}
async function knockScene(e) {
  const F = S.flags, me = P().who;
  Sound.play('knock');
  if (e.n === 1) {
    if (F.candyBag) { await say('Yine mi geldiniz? Çantanız şekerle dolu ya! Haydi Korku Treni\'ne!', { speaker: SAY.ayse }); return; }
    await say('Tak tak tak!');
    await say('Kim o? Aaa, bir vampir ile bir yarasa! Ne güzel kostümler!', { speaker: SAY.ayse });
    const ch = await say('Haydi söyleyin bakalım…', { speaker: SAY.ayse, choices: ['Şeker mi, şaka mı? Şeker!', 'Şeker mi, şaka mı? Şaka!'] });
    if (ch === 0) await say('Şeker tabii ki! Al bakalım, kocaman bir çanta dolusu!', { speaker: SAY.ayse });
    else await say('Şaka mı? O zaman ben de bir şaka yapayım: Bu çantada hiç şeker yok!… Hah hah, şaka! Ağzına kadar dolu!', { speaker: SAY.ayse });
    F.candyBag = true; pickupFx('🍬', e.x, e.y);
    await say('Bu şekerleri iyi saklayın. Bu gece şekere bayılan garip yaratıklar dolaşıyormuş!', { speaker: SAY.ayse });
    await say('Şeker çantası çantana girdi! Gerekince Boşluk tuşuyla şeker atabilirsin.');
    F.knocked[1] = true; return;
  }
  if (e.n === 2) {
    if (F.tickets) { await say('Hazineyi aldınız! Tren sokağın sonunda, sağda. Yo ho ho!', { speaker: SAY.hasan }); return; }
    await say('Tak tak tak!');
    await say('Yo ho ho! Ben Korsan Hasan! Bilmecemi bilirseniz size bir hazine veririm.', { speaker: SAY.hasan });
    const opts = ['Baykuş', 'Yarasa', 'Kedi'];
    const ch = await say('Gündüz uyur, gece uçar. Baş aşağı asılır, karanlıkta yolunu sesle bulur. Bu ne?', { speaker: SAY.hasan, choices: opts });
    F.knocked[2] = true;
    if (ch !== 1) { Sound.play('wrong'); await say(`${opts[ch]} mı? Hımm, değil! Bir ipucu: Nehir'in kostümüne iyi bakın!`, { speaker: SAY.hasan }); await say('Kapıyı bir daha çalıp tekrar deneyebilirsin.'); return; }
    Sound.play('win');
    await say(me === 'Nehir' ? 'Yarasa! Yani ben!' : 'Yarasa! Tıpkı Nehir gibi!', { speaker: me === 'Nehir' ? SAY.Nehir : SAY.Bade, loud: true });
    F.tickets = true; pickupFx('🎟️', e.x, e.y);
    await say('Bildiniz! İşte hazinem: iki Korku Treni bileti! Ben o trenden çok korkuyorum, siz binin.', { speaker: SAY.hasan });
    await say('Tren sokağın sonunda, sağda. Kondüktöre biletleri gösterin!', { speaker: SAY.hasan });
    return;
  }
  // house 3: nobody home
  F.knocked[3] = true;
  await say('Tak tak tak… Kimse açmadı.');
  await say('Kapıda bir kâğıt var: “Evde yokuz. Şekerler pencerenin önünde, birer tane alın!”');
  if (!F.bowl3) await say(me === 'Nehir' ? 'Pencere çok yüksek… Bade, sen uzunsun! Q ile Bade\'ye geçelim.' : 'Pencere yüksek ama ben uzanırım!', { speaker: me === 'Nehir' ? SAY.Nehir : SAY.Bade });
}
async function conductorScene() {
  const F = S.flags;
  if (F.skyDone) {
    const ch = await say('Takır takır! Son tren kalkmak üzere. Anneleriniz sizi bekliyordur!', { speaker: SAY.kond, choices: ['Eve dönelim!', 'Biraz daha kalalım'] });
    if (ch === 0) await rideHome();
    return;
  }
  if (!F.tickets) {
    await say('Takır takır! Ben Kondüktör Takırtı. Korku Treni\'ne bilet olmadan binilmez!', { speaker: SAY.kond });
    await say('Biletleri kim mi satar? Kimse! Ama bu sokakta hazine dağıtan bir korsan varmış…', { speaker: SAY.kond });
    return;
  }
  if (!F.candyBag) {
    await say('Biletler tamam! Ama yanınızda hiç şeker yok mu? Cadılar Bayramı\'nda şekersiz yola çıkılmaz!', { speaker: SAY.kond });
    await say("Ayşe Teyze'nin kapısını çalın. Evinizin hemen yanındaki ev!", { speaker: SAY.kond });
    return;
  }
  await say('Takır takır! Biletler tamam, şekerler tamam!', { speaker: SAY.kond });
  const ch = await say('Haydi, binin bakalım! Bu tren çok özel bir yere gidiyor…', { speaker: SAY.kond, choices: ['Binelim!', 'Biraz sonra'] });
  if (ch !== 0) return;
  await rideTrain();
}
async function rideTrain() {
  const F = S.flags;
  F.ticketsGiven = true; updateHUD();
  Sound.play('train');
  await fadeOut(0.5, '8,5,18');
  S.ride = { t: 0 };
  await fadeIn(0.5);
  await say('Tren tıkır tıkır karanlık ormana daldı…');
  Sound.play('train');
  await say('Bade… Kondüktörün kostümü çok gerçekçi değil mi?', { speaker: SAY.Nehir });
  await say('Takır takır! Kostüm değil ki! Ben gerçek bir iskeletim. Ama korkmayın, çok iyi bir iskeletim!', { speaker: SAY.kond });
  await say('Vay canına! Demek Canavar Kasabası gerçekmiş!', { speaker: SAY.Bade, loud: true });
  Sound.play('ghost');
  await say('İleride kasabanın ışıkları görünüyor… Ama gökyüzünde ay yok. Eyvah eyvah!', { speaker: SAY.kond });
  await fadeOut(0.5, '8,5,18');
  S.ride = null;
  F.arrived = true;
  placeBoth(35.5, 16.7); P().dir = 'down';
  S.drakPos = { x: 38.2, y: 16.6 };
  S.area = ''; checkAreaTitle();
  await fadeIn(0.6);
  await wait(0.3);
  Sound.play('ghost');
  await say('Hoş geldiniz! Hoş geldiniz! Ben Kont Drakoş, Canavar Kasabası\'nın belediye başkanıyım.', { speaker: SAY.drakos });
  await say('O notu ben yazmıştım. K.D.: Kont Drakoş!', { speaker: SAY.drakos });
  await say('Bu gece Ay Festivali var. Ama bakın gökyüzüne: kara bulutlar ayı sakladı! Ay olmadan festival başlayamaz.', { speaker: SAY.drakos });
  await say('Meydandaki saat kulesinde Büyük Fener var. Onu yedi balkabağı feneriyle yakarsak ışığı bulutlara ulaşır.', { speaker: SAY.drakos });
  await say('Fenerler kasabadaki yedi arkadaşımızda. Ama hepsinin bir derdi var. Onlara yardım ederseniz fenerlerini size verirler!', { speaker: SAY.drakos });
  await say('Bir vampir ile bir yarasa… Bu iş tam bize göre!', { speaker: SAY.Bade });
  await say('Haydi, yedi fener bulalım!', { speaker: SAY.Nehir, loud: true });
  await say("Kasabanın haritasına M tuşuyla bakabilirsiniz. Kalpleriniz azalırsa meydandaki Kabak Kafa Bora'nın sıcak kakaosunu için!", { speaker: SAY.drakos });
  const d0 = { ...S.drakPos };
  await tween(1.6, (k) => { S.drakPos = { x: d0.x + (33.5 - d0.x) * k, y: d0.y + (29.4 - d0.y) * k, walk: true }; });
  S.drakPos = null;
  updateHUD();
  saveCheckpoint();
  setTimeout(() => { if (S.mode === 'play' && !S.dialog) showToast('Yedi canavar arkadaşı bul! M ile haritaya bak:\n❓ işaretleri yardım bekleyen arkadaşları gösterir.', 6); }, 1200);
}
async function rideHome() {
  const F = S.flags;
  Sound.play('train');
  await fadeOut(0.5, '8,5,18');
  S.ride = { t: 0, back: true };
  await fadeIn(0.5);
  await say('Tren tıkır tıkır ormanın içinden mahalleye geri döndü. Gökyüzünde kocaman ay parlıyor!');
  await say('Bütün canavar arkadaşlar istasyonda el salladı. Gürgür de gökyüzünden göz kırptı!', { speaker: SAY.Nehir });
  await say('Takır takır! Gelecek Cadılar Bayramı\'nda yine bekleriz!', { speaker: SAY.kond });
  await say("Duru'ya anlatacak o kadar çok şeyimiz var ki!", { speaker: SAY.Bade });
  await fadeOut(0.5, '8,5,18');
  S.ride = null;
  F.homeBack = true;
  placeBoth(34.5, 8.8); P().dir = 'left';
  S.area = ''; checkAreaTitle();
  saveCheckpoint(true);
  await fadeIn(0.6);
  showToast('Mahalleye döndünüz! Eve gidin, anneleriniz sizi bekliyor.', 6);
}
async function kurtulBrave() {
  const F = S.flags, k = ent('kurtul');
  if (F.lanterns.kurtul) return;
  await say('Nehir dar aralıktan içeri süzüldü ve Kurtul\'un titreyen elini tuttu. “Gel, ben yanındayım!”', { speaker: SAY.Nehir });
  await say('Işıklar yanıyor, bir de yanımda bir arkadaş var… Artık hiç korkmuyorum!', { speaker: SAY.kurtul, loud: true });
  Sound.play('howl'); S.howl = 2.5;
  await say('AUUUUUUU!', { speaker: SAY.kurtul, loud: true });
  await say('Ne güzel uludun Kurtul! Bütün kasaba duydu.', { speaker: SAY.Nehir });
  await say('Teşekkürler kızlar. Festivalde en güzel şarkıyı ben uluyacağım!', { speaker: SAY.kurtul });
  await giveLantern('kurtul', k.x, k.y);
}
async function jarScene(e) {
  const F = S.flags, me = P().who;
  const CONTENT = ['Fır fır! İçinden minik yarasalar uçtu!', 'İçinde eski, kokmuş bir çorap var. Iyy!', 'İçi kurabiye kırıntısıyla dolu. Bir mumya neden kurabiye saklar ki?'];
  if (me === 'Nehir') {
    Sound.play('sonar'); S.ring = { x: e.x, y: e.y, t: 0 };
    F.jarPinged[e.n] = true;
    if (e.n === F.jarRight) {
      await say('Bi-bip… Pof! Bu kavanozdan yumuşacık, pofuduk bir ses geldi. İçinde sargı var!', { speaker: SAY.Nehir });
      await say("Kavanoz çok yüksek. Q ile Bade'ye geç, bu kavanozu o alsın!");
    } else await say('Bi-bip… Tınnn! Bu kavanozdan boş bir ses geldi. Burada sargı yok.', { speaker: SAY.Nehir });
    return;
  }
  if (!F.jarPinged[F.jarRight]) {
    await say('Kavanozların hepsi birbirinin aynısı! Yanlışını açarsam içinde uyuyan yarasalar uyanır.', { speaker: SAY.Bade });
    await say("Önce Nehir ses dalgalarıyla dinlesin. Q ile Nehir'e geç!");
    return;
  }
  if (e.n !== F.jarRight) { await say(`Nehir'in bulduğu kavanoz bu değil. Onun kavanozu ${F.jarRight + 1} numaralı olan!`, { speaker: SAY.Bade }); return; }
  F.bandage = true; pickupFx('🧻', e.x, e.y);
  await say("Bade kavanoza uzandı ve kapağını açtı… İçinde bembeyaz bir sargı rulosu! Haydi, Mumya Mimi'ye götürelim.", { speaker: SAY.Bade });
}
async function cemileScene() {
  const F = S.flags, e = ent('cemile');
  if (F.potion && F.straw) {
    await say('İksir ve altın saman! İkisi de burada!', { speaker: SAY.cemile, loud: true });
    Sound.play('brew'); sparkle(86, 22, '#b28dff', 26);
    await say('Cemile süpürgesine altın samanı bağladı ve iksiri damlattı… Fışşş!');
    S.cemileFly = 1.6; Sound.play('ghost');
    await say('Vıııınnn! Süpürge yine uçuyor! Hi hi hiii!', { speaker: SAY.cemile, loud: true });
    await say('Teşekkürler kızlar! Festivalde gökyüzünde ilk ben uçacağım.', { speaker: SAY.cemile });
    S.cemileFly = 0;
    await giveLantern('cemile', e.x, e.y);
    return;
  }
  if (!F.cemileMet) {
    F.cemileMet = true;
    await say('Ah ah! Süpürgem kırıldı! Bu gece festivalde uçacaktım…', { speaker: SAY.cemile });
    await say('Onu tamir etmek için iki şey lazım: Balkabağı Tarlası\'ndaki altın saman ve Uçan Süpürge İksiri.', { speaker: SAY.cemile });
    await say('İksirin tarifi duvardaki kitabımda yazıyor. Malzemeleri kazana doğru sırayla atmalısınız.', { speaker: SAY.cemile });
    await say('Ay ışığı damlası da en üst rafta. Ben yetişemiyorum, boyum çok kısa!', { speaker: SAY.cemile });
    await say('Altın saman tarlada bir yerde saklı. Ama dikkat, kabaklarım bu gece çok yaramaz, yuvarlanıp duruyorlar!', { speaker: SAY.cemile });
    return;
  }
  const need = [!F.potion ? 'iksiri kazanda yapın (tarif kitapta)' : null, !F.straw ? 'tarladaki altın samanı bulun' : null].filter(Boolean);
  await say('Süpürgem için ' + need.join(' ve ') + '!', { speaker: SAY.cemile });
}
async function brewPotion() {
  const order = ['🐸 Kurbağa ayağı', '🦇 Yarasa tozu', '🌙 Ay ışığı damlası'];
  const opts = ['🌙 Ay ışığı damlası', '🐸 Kurbağa ayağı', '🦇 Yarasa tozu'];
  if (!S.flags.moonDrop) { await say('Kazan fokur fokur kaynıyor. Ama Ay ışığı damlası yok! Şişesi en üst rafta duruyor.', { speaker: SAY.Nehir }); return; }
  await say('Kazan fokur fokur kaynıyor. Malzemeleri tarifteki sırayla atalım!', { speaker: SAY.Bade });
  for (let i = 0; i < 3; i++) {
    const ch = await say(`Kazana ${i + 1}. olarak ne atalım?`, { choices: opts });
    if (opts[ch] !== order[i]) {
      Sound.play('wrong'); S.smoke = { t: 0 };
      await say('Pof! Kazandan pembe bir duman çıktı. Hapşuu!');
      await say('Sıra yanlış oldu. Duvardaki tarif kitabına bir daha bakalım!', { speaker: SAY.Nehir });
      return;
    }
    Sound.play('brew'); sparkle(81.9, 22.2, ['#7fe0a0', '#b28dff', '#fff3c4'][i], 12);
  }
  await say('Şimdi üç kere karıştır: Bir… iki… üç!');
  await wait(0.4); Sound.play('chime');
  S.flags.potion = true; pickupFx('🧪', 81.9, 22.6);
  await say('İksir oldu! Mor renkli, ışıl ışıl bir Uçan Süpürge İksiri!', { loud: true });
}
// Hülya's song: remember the notes (arrows), then press the same arrows
const ARROW = { up: '↑', down: '↓', left: '←', right: '→' };
const NOTE_OF = { up: 0, right: 1, down: 2, left: 3 };
function waitDir() { return new Promise((r) => { S.awaitDir = r; }); }
async function songGame() {
  const ch = await say('Çanlarım ve notam! Teşekkürler! Şimdi benimle şarkıyı çalar mısınız?', { speaker: SAY.pitir, choices: ['Çalalım!', 'Sonra'] });
  if (ch !== 0) return;
  await say('Bu oyun nasıl oynanır?\n1) Çanların üstünde oklar tek tek görünecek, her ok bir nota çalar. İyi bak ve sırasını aklında tut!\n2) Oklar bitince sıra sende: klavyendeki ok tuşlarına ( ← ↑ ↓ → ) aynı sırayla bas.');
  await say('Üç tur var: önce 3 nota, sonra 4 nota, en son 5 nota. Yanlış basarsan üzülme, tur yeniden başlar!');
  const rounds = [3, 4, 5], k0 = ent('pitir');
  for (let ri = 0; ri < rounds.length; ri++) {
    const len = rounds[ri];
    let ok = false;
    while (!ok) {
      const seq = []; for (let i = 0; i < len; i++) { let d; do { d = pick(['up', 'down', 'left', 'right']); } while (i > 0 && d === seq[i - 1] && Math.random() < 0.6); seq.push(d); }
      S.dance = { seq, shown: -1, phase: 'show', got: [], round: ri + 1, rounds: rounds.length, ax: k0.x + 3.2, ay: k0.y };
      await say(`${ri + 1}. tur: ${len} nota geliyor. Çanlara iyi bak!`, { speaker: SAY.pitir });
      showToast(`İyi bak! ${len} oku sırayla aklında tut… 👀`, len * 1.2 + 0.5);
      await wait(0.5);
      for (let i = 0; i < len; i++) { S.dance.shown = i; Sound.note(NOTE_OF[seq[i]]); await wait(1.0); S.dance.shown = -1; await wait(0.25); }
      S.dance.phase = 'input';
      showToast(`Şimdi sıra sende! Klavyedeki ok tuşlarına aynı sırayla bas.\n(${len} nota: ← ↑ ↓ →)`, 60);
      ok = true;
      for (let i = 0; i < len; i++) {
        const d = await waitDir();
        S.dance.got.push(d);
        if (d !== seq[i]) { ok = false; break; }
        Sound.note(NOTE_OF[d]);
      }
      hideToast();
      S.dance.phase = 'done';
      if (!ok) {
        Sound.play('wrong');
        S.dance.phase = 'answer';
        await say(`Hop! ${S.dance.got.length}. nota yanlış oldu. Doğrusu şuydu: ${seq.map((d) => ARROW[d]).join(' ')}\nÜzülme, bu turu bir daha deneyelim!`, { speaker: SAY.pitir });
      } else { Sound.play('checkpoint'); sparkle(k0.x, k0.y - 1); if (ri < rounds.length - 1) await say(`Harika! ${ri + 1}. turu geçtin! 🎶`, { speaker: SAY.pitir }); }
    }
  }
  S.dance = null;
  await say('Miyavvv! Şarkı tamam! Festivalde bu şarkıyı çanlarımla herkes için çalacağım.', { speaker: SAY.pitir, loud: true });
  await giveLantern('pitir', k0.x, k0.y);
}
