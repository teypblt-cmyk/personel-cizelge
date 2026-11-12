/* Personel Çizelgesi kalıcı testleri.
   Uygulamanın gerçek index.html dosyasını başsız bir tarayıcıda açar (internet kapalı, sahte veri) ve
   dağıtım kurallarını, Aİ komutlarını, Görev Planlama'yı ve izin eşleşmesini denetler.
   Çalıştırma:  node tests/run.js   (playwright gerekir) */
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

const NAMES = ['Abdullah Şahin', 'Akif Balı', 'Muhammed Daşçı', 'Arif Özhan', 'Yıldıray Çobanoğlu', 'Muhammet Akıncı', 'Mustafa Kandemir', 'Aykut Karaca', 'Batuhan Pehlivan', 'Barbaros Zerey', 'Eyüp Bulut', 'Burak Gürel', 'Yusuf Yılmaz', 'Muhammed Önler', 'Emrah Ak', 'Oğuzhan Toprakçı', 'Melike Akbulut'];

/* Sayfada çalışır: temiz bir örnek veri kurar. Okullar: Bahçelievler A1..A4, Yenibosna B1..B4. Noktalar: Bahçelievler "Yaya Sokak" (1 kişi), Yenibosna "Fatih Caddesi" (3) ve "Ahmet Yesevi Mahmutbey" (3). */
function setupInPage(names) {
  authed = true; hideLogin();
  document.querySelectorAll('.csov').forEach(function (x) { x.remove() });
  S.names = names.slice();
  for (var w = 0; w < S.w.length; w++) for (var p = 0; p < N; p++) for (var d = 0; d < 7; d++) S.w[w][p][d] = '';
  S.gl = {}; S.gp = {}; S.ri = {}; S.ex = {}; S.en = {}; S.evtd = {}; S.evt = ''; S.xcodes = []; S.co = {}; S.nl = {};
  S.gi = { s: [[], []], t: [[], []] }; S.nid = 0; delete S.ag; agInit();
  var T = { A: [], B: [] };
  ['A1', 'A2', 'A3', 'A4'].forEach(function (n) { var id = nid(); S.gi.s[0].push({ id: id, t: 'Bah ' + n, off: false }); T.A.push(id) });
  ['B1', 'B2', 'B3', 'B4'].forEach(function (n) { var id = nid(); S.gi.s[1].push({ id: id, t: 'Yen ' + n, off: false }); T.B.push(id) });
  T.yaya = nid(); S.gi.t[0].push({ id: T.yaya, t: 'Yaya Sokak', off: false });
  T.fatih = nid(); S.gi.t[1].push({ id: T.fatih, t: 'Fatih Caddesi', off: false });
  T.yesevi = nid(); S.gi.t[1].push({ id: T.yesevi, t: 'Ahmet Yesevi Mahmutbey', off: false });
  S.ag.pn = {}; S.ag.pn[T.yaya] = 1; S.ag.pn[T.fatih] = 3; S.ag.pn[T.yesevi] = 3;
  S.ag.ps = {}; S.ag.pairs = []; S.ag.dp = {}; S.ag.fx = {}; S.ag.au = {};
  window.T = T; window.D = 1; /* test günü: Salı (hafta içi) */
  /* Planlayıcıyı doğrudan çağırmak için yardımcı */
  window.plan = function (opt) {
    var o = Object.assign({ sef: [null, null], nB: 4, nY: 13, sefS: [true, true], sefT: [true, true], both: [true, true], mode: 'cift', fix: [], pn: S.ag.pn, ps: S.ag.ps, nos: {}, pairs: [] }, opt || {});
    var pl = agPlan(window.D, o), out = { reg: pl.reg, warn: pl.warn, sch: {}, pt: {}, B: [], Y: [] };
    Object.keys(pl.gp).forEach(function (k) { var a = k.split('|'); (a[2] === 's' ? out.sch : out.pt)[a[4]] = pl.gp[k].slice() });
    for (var q = 0; q < N; q++) { if (pl.reg[q] === '1') out.B.push(q); if (pl.reg[q] === '2') out.Y.push(q) }
    return out;
  };
  save(); show(); buildGV();
  return T;
}

const tests = [];
const test = (name, fn) => tests.push({ name, fn });
const eq = (a, b, msg) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error((msg || 'eşit değil') + ': ' + JSON.stringify(a) + ' ≠ ' + JSON.stringify(b)) };
const ok = (c, msg) => { if (!c) throw new Error(msg || 'koşul sağlanmadı') };

/* ---------- Sürüm ---------- */
test('sürüm numarası başlıkta ve önbellek dosyasında aynı', async () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'), sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  const vs = [...html.matchAll(/class="appv">v([\d.]+)</g)].map(m => m[1]);
  ok(vs.length >= 1, 'başlıkta sürüm yok'); ok(vs.every(v => v === vs[0]), 'başlıktaki sürümler farklı: ' + vs);
  const m = sw.match(/cizelge-v([\d.]+)/); ok(m, 'sw.js içinde sürüm yok'); eq(m[1], vs[0], 'sw.js sürümü farklı');
});

/* ---------- Planlayıcı ---------- */
test('bölge sayıları tutar ve izinliler dağıtılmaz', async (p) => {
  const r = await p.evaluate(() => { S.w[wk][5][D] = 'I'; S.w[wk][6][D] = 'R'; return plan({ nB: 4, nY: 11 }) });
  eq(r.B.length, 4); eq(r.Y.length, 11); ok(r.B.indexOf(5) < 0 && r.Y.indexOf(5) < 0 && r.Y.indexOf(6) < 0, 'izinli dağıtılmış');
});

test('sabit noktadaki kişi okula yazılmaz; tek kişilik bölgede okullar destekle dolar', async (p) => {
  const r = await p.evaluate(() => { S.ag.ps[T.yaya] = true; var x = plan({ nB: 1, nY: 16 }); x.T = T; return x });
  eq(r.B.length, 1); const b = r.B[0];
  eq(r.pt[r.T.yaya], [b], 'sabit noktada bölgenin kişisi yok');
  r.T.A.forEach(id => { ok(r.sch[id] && r.sch[id].length === 1, 'Bahçelievler okulu boş: ' + id); ok(r.sch[id][0] !== b, 'sabit noktadaki kişi okula yazılmış') });
  eq(r.warn, [], 'uyarı çıktı');
});

test('bölgenin kendi kişileri okulu önce alır, artan okul destekle dolar', async (p) => {
  const r = await p.evaluate(() => { var x = plan({ nB: 3, nY: 14 }); x.T = T; return x });
  const own = r.T.A.filter(id => r.B.indexOf(r.sch[id][0]) > -1).length;
  eq(own, 3, 'Bahçelievler kişileri 3 okul almadı'); eq(r.T.A.filter(id => r.Y.indexOf(r.sch[id][0]) > -1).length, 1, 'destek sayısı yanlış');
});

test('çift okul işaretliyse tek kişide birleşir, işaret kalkınca ayrılır', async (p) => {
  const r = await p.evaluate(() => { var a = plan({ nB: 2, nY: 15, pairs: [[T.A[0], T.A[1]]] }), b = plan({ nB: 2, nY: 15, pairs: [] }); return { a: a, b: b, T: T } });
  eq(r.a.sch[r.T.A[0]], r.a.sch[r.T.A[1]], 'işaretli çift ayrı kişilerde');
  ok(r.b.sch[r.T.A[0]][0] !== r.b.sch[r.T.A[1]][0], 'işaretsiz çift aynı kişide');
});

test('çift okul destek gelen kişide de birlikte kalır', async (p) => {
  const r = await p.evaluate(() => { S.ag.ps[T.yaya] = true; var x = plan({ nB: 1, nY: 16, pairs: [[T.A[0], T.A[1]]] }); x.T = T; return x });
  eq(r.sch[r.T.A[0]], r.sch[r.T.A[1]], 'destekte çift ayrıldı'); ok(r.Y.indexOf(r.sch[r.T.A[0]][0]) > -1, 'çifti Yenibosna kişisi almadı');
});

test('şef "nokta Yok" ve "okul Yok" ise hiçbir göreve yazılmaz', async (p) => {
  const r = await p.evaluate(() => plan({ nB: 4, nY: 13, sef: [null, 1], fix: [{ p: 1, r: 1, s: false, sid: null, id: null, chief: true }] }));
  ok(r.Y.indexOf(1) > -1, 'şef bölgede değil');
  Object.keys(r.sch).concat(Object.keys(r.pt)).forEach(k => ok((r.sch[k] || r.pt[k]).indexOf(1) < 0, 'şef göreve yazılmış: ' + k));
});

test('elle yazılan kişi yazıldığı noktada kalır', async (p) => {
  const r = await p.evaluate(() => { var x = plan({ fix: [{ p: 7, r: 1, s: null, sid: null, id: T.yesevi, chief: false }] }); x.T = T; return x });
  ok(r.pt[r.T.yesevi].indexOf(7) > -1, 'elle yazılan noktada değil'); eq(r.pt[r.T.yesevi].length, 3, 'nokta kişi sayısı tutmadı');
});

test('"okul Yok" denen kişi okul almaz ama noktaya yazılabilir', async (p) => {
  const r = await p.evaluate(() => plan({ fix: [{ p: 8, r: 1, s: false, sid: null, id: 'auto', chief: false }] }));
  Object.keys(r.sch).forEach(k => ok(r.sch[k].indexOf(8) < 0, 'okul yazıldı'));
});

test('destek: daha önce desteğe gitmiş kişi yerine gitmemiş olan seçilir', async (p) => {
  const r = await p.evaluate(() => {
    /* Geçmiş (önceki gün): Yenibosna'dan 3..15 numaralı herkes bir kez Bahçelievler'in A1 okuluna desteğe gitmiş, yalnız 16 gitmemiş.
       Bugün destek isteyen okul A4; o okula kimse gitmediği için seçimi yalnızca destek sayısı belirler. */
    var d0 = D - 1; for (var q = 3; q < 16; q++) S.w[wk][q][d0] = '2';
    var lk = lkey(wk, d0, 's', 0); S.gl[lk] = [T.A[0]]; S.gp[pkey(wk, d0, 's', 0, T.A[0])] = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    var fix = []; [0, 1, 2].forEach(function (q) { fix.push({ p: q, r: 0, s: null, sid: null, id: 'auto', chief: false }) });
    for (var q2 = 3; q2 < 17; q2++) fix.push({ p: q2, r: 1, s: null, sid: null, id: 'auto', chief: false });
    var x = plan({ nB: 3, nY: 14, fix: fix }); x.T = T; return x
  });
  const borrowed = r.T.A.map(id => r.sch[id][0]).filter(q => r.Y.indexOf(q) > -1);
  eq(borrowed.length, 1); eq(borrowed[0], 16, 'desteğe daha önce giden seçildi');
});

/* ---------- Aİ komutları ---------- */
test('komut: "<nokta> <isimler> çalışacak" ve "ekle"', async (p) => {
  const r = await p.evaluate(() => { var a = agPointCmd(D, 'Ahmet Yesevi Akif Aykut ve Oğuzhan çalışacak'), b = agPointCmd(D, "Akif'i de Ahmet Yesevi Mahmut Bey'e ekle"), c = agPointCmd(D, 'Yaya sokak Arif çalışacak gerisi sende'); return { a: a, b: b, c: c, rest: agRestCmd('Yaya sokak Arif çalışacak gerisi sende'), T: T } });
  eq(r.a.id, r.T.yesevi); eq(r.a.ppl, [1, 7, 15]); ok(!r.a.add);
  eq(r.b.id, r.T.yesevi); eq(r.b.ppl, [1]); ok(r.b.add, 'ekle modu algılanmadı');
  eq(r.c.id, r.T.yaya); eq(r.c.ppl, [3]); ok(r.rest, '"gerisi sende" algılanmadı');
});

test('komut: okul / nokta / görev yazma, bölge ve şef', async (p) => {
  const r = await p.evaluate(() => ({ s: agNoCmd("Eyüp'e okul yazma"), t: agNoCmd("Eyüp'e nokta yazma"), g: agNoCmd("Eyüp'e görev yazma"), c: agNoCmd('Bahçelievlerin şefi Abdullah Şahin görev verme'), n: agNoCmd("Eyüp'ün Aykut'la yerini değiştir") }));
  eq([r.s.k, r.t.k, r.g.k], ['s', 't', 'g']); eq(r.s.ppl, [10]);
  eq(r.c.k, 'g'); eq(r.c.ppl, [0]); eq(r.c.r, 0); ok(r.c.chief, 'şef algılanmadı'); eq(r.n, null, 'yer değiştir cümlesi yazma sanıldı');
});

test('komut: göreli sayı ve isim eşleştirme', async (p) => {
  const r = await p.evaluate(() => ({ c: agCountCmd("Abdullah Şahin'in yanına Bahçelievler'de en az çalışmış iki kişiyi ver"), y: agCountCmd('Yenibosnaya 2 kişi daha ekle'), abs: agCountCmd('Bahçelievler 3 kişi olsun'), two: agTwo("Muhammet Daşçı ile Aykut'un yerini değiştir"), amb: agTwo('muhammet ile aykut yer değiştir') }));
  eq([r.c.r, r.c.n], [0, 2]); eq(r.c.ppl, [0]); eq([r.y.r, r.y.n], [1, 2]); eq(r.abs, null, 'doğrudan sayı göreli sanıldı');
  eq(r.two, [2, 7]); ok(r.amb.length > 2, 'belirsiz isim tek kişiye eşlendi');
});

test('yer değiştir: bölge, okul ve nokta karşılıklı değişir', async (p) => {
  const r = await p.evaluate(() => {
    S.w[wk][2][D] = '1'; S.w[wk][7][D] = '2';
    S.gl[lkey(wk, D, 's', 0)] = [T.A[0]]; S.gp[pkey(wk, D, 's', 0, T.A[0])] = [2];
    S.gl[lkey(wk, D, 't', 1)] = [T.fatih]; S.gp[pkey(wk, D, 't', 1, T.fatih)] = [7, 5];
    agSwap(D, 2, 7);
    return { m: [S.w[wk][2][D], S.w[wk][7][D]], sch: S.gp[pkey(wk, D, 's', 0, T.A[0])], pt: S.gp[pkey(wk, D, 't', 1, T.fatih)] }
  });
  eq(r.m, ['2', '1']); eq(r.sch, [7]); eq(r.pt.slice().sort(), [2, 5]);
});

/* ---------- Aİ penceresi (uçtan uca) ---------- */
const openAi = async (p) => { await p.evaluate(() => { document.querySelectorAll('.csov').forEach(x => x.remove()); agOpen(D) }); await p.waitForTimeout(150) };
const setB = async (p, v) => { await p.evaluate((v) => { var nb = document.querySelector('#agnb'); nb.value = v; nb.dispatchEvent(new Event('input', { bubbles: true })) }, v) };
const preview = async (p) => { await p.locator('.agpv').click(); await p.waitForTimeout(200); return await p.evaluate(() => (S.ag.fx[wk + '|' + D] || []).map(f => ({ p: f.p, r: f.r, sid: f.sid || null, more: (f.more || []).map(m => m.id), id: f.id, pv: f.pv, s: f.s }))) };
const cmd = async (p, t) => { await p.fill('#agvt', t); await p.locator('.agsend').click(); await p.waitForTimeout(200) };

test('Aİ: önizle listeyi doldurur; sayı değişince elle yapılan kalır, gerisi yeniden dağıtılır', async (p) => {
  await openAi(p); await setB(p, 4); const a = await preview(p);
  eq(a.filter(f => f.r === 0).length, 4);
  const keep = a.filter(f => f.r === 0)[0].p;
  await cmd(p, NAMES[keep] + ' okul yazma');
  await setB(p, 3); const b = await preview(p);
  const B = b.filter(f => f.r === 0); eq(B.length, 3, 'Bahçelievler 3 olmadı');
  const k = B.find(f => f.p === keep); ok(k, 'elle değiştirilen kişi bölgeden çıktı'); eq(k.s, false, 'elle "okul yok" korunmadı');
});

test('Aİ: Uygula sonrası yeniden açılışta da sayı değişince yeniden dağıtılır', async (p) => {
  await openAi(p); await setB(p, 4); await preview(p); await p.locator('.agok').click(); await p.waitForTimeout(200);
  const marks = await p.evaluate(() => { var n = 0; for (var q = 0; q < N; q++) if (S.w[wk][q][D] === '1') n++; return n }); eq(marks, 4, 'Uygula bölgeleri yazmadı');
  await openAi(p); await setB(p, 2); const b = await preview(p);
  eq(b.filter(f => f.r === 0).length, 2, 'yeniden açılışta sayı uygulanmadı');
});

test('Aİ: çift okul kutusu önizlemeden sonra kaldırılınca okullar ayrılır', async (p) => {
  await p.evaluate(() => { S.ag.pairs = [[T.A[0], T.A[1]]]; S.ag.dp[wk + '|' + D] = [T.A[0] + '+' + T.A[1]]; save() });
  await openAi(p); await setB(p, 2); const a = await preview(p);
  const T = await p.evaluate(() => T);
  ok(a.some(f => [f.sid].concat(f.more).includes(T.A[0]) && [f.sid].concat(f.more).includes(T.A[1])), 'işaretliyken birleşmedi');
  await p.locator('.agpr input').first().uncheck(); await p.waitForTimeout(100); const b = await preview(p);
  ok(!b.some(f => [f.sid].concat(f.more).includes(T.A[0]) && [f.sid].concat(f.more).includes(T.A[1])), 'kutu kalkınca hâlâ aynı kişide');
});

test('Aİ: nokta komutu tam kadro yapar, kişi sayısını eşitler', async (p) => {
  await openAi(p); await setB(p, 4); await preview(p);
  await cmd(p, 'Ahmet Yesevi Akif Aykut Batuhan Eyüp çalışacak');
  const r = await p.evaluate(() => ({ on: (S.ag.fx[wk + '|' + D] || []).filter(f => f.id === T.yesevi).map(f => f.p).sort((a, b) => a - b), pn: S.ag.pn[T.yesevi] }));
  eq(r.on, [1, 7, 8, 10]); eq(r.pn, 4, 'kişi sayısı eşitlenmedi');
});

test('Aİ: uygulanmamış elle girişler kapatıp açınca kaybolmaz', async (p) => {
  await openAi(p); await cmd(p, 'Bahçelievlerin şefi Abdullah Şahin görev verme');
  await openAi(p);
  const f = await p.evaluate(() => (S.ag.fx[wk + '|' + D] || []).filter(f => f.p === 0)[0] || null);
  ok(f, 'kayıt kayboldu'); eq([f.r, f.chief, f.s, f.id], [0, true, false, null]);
});

test('Aİ: önizlemede isme dokununca "neden" gerekçesi açılır', async (p) => {
  await openAi(p); await setB(p, 3); await preview(p);
  const b = p.locator('.agprev .agrb').first(); ok(await b.count(), 'önizlemede satır yok');
  ok(await p.locator('.agprev .agwhy').first().isHidden(), 'gerekçe baştan açık');
  await b.click(); const w = await p.locator('.agprev .agwhy').first().innerText();
  ok(/gün çalıştı/.test(w) && /(gitti|gitmedi)/.test(w), 'gerekçe metni eksik: ' + w);
});

/* ---------- Görev Planlama ---------- */
test('Görev Planlama: P noktaları Aİ dağıtımına girmez, sayım kendi içinde, hareketli sayılmaz', async (p) => {
  const r = await p.evaluate(() => {
    var sab = nid(); S.gi.t[1].push({ id: sab, t: 'Mahmutbey Cad. No:73', off: false, ev: true });
    var mot = nid(); S.gi.t[1].push({ id: mot, t: 'Yesevi akşam', off: false, ev: true, mv: true });
    var d0 = D - 1; S.gl[lkey(wk, d0, 't', 1)] = [T.fatih]; S.gp[pkey(wk, d0, 't', 1, T.fatih)] = [9];
    S.gp[pkey(wk, d0, 'e', 1, sab)] = [9]; S.gp[pkey(wk, d0, 'e', 1, mot)] = [9]; S.gp[pkey(wk, D, 'e', 1, sab)] = [9];
    var st = evStats(D);
    return { inPlan: agItems(D, 't', 1).indexOf(sab) > -1 || agItems(D, 't', 1).indexOf(mot) > -1, C: st.C[9], Tt: st.T[9], ozet: pvFacts().filter(f => f.p === 9 && f.v.tur === 'Nokta').length }
  });
  ok(!r.inPlan, 'P noktası gündüz dağıtımına girdi'); eq(r.C, 1, 'geçmiş toplam yanlış'); eq(r.Tt, 1); eq(r.ozet, 3, 'Özet: gündüz 1 + sabit P 2 olmalı');
});

test('Görev Planlama: WhatsApp metni açıklama kalın, kodlar, not; gündüz listesine karışmaz', async (p) => {
  const r = await p.evaluate(() => {
    var a = nid(); S.gi.t[1].push({ id: a, t: 'Mahmutbey Cad. Muhtarlık', off: false, ev: true });
    S.ex = {}; S.ex[pkey(wk, D, 'e', 1, a)] = ['30/81']; S.gp[pkey(wk, D, 'e', 1, a)] = [9];
    S.evtd = {}; S.evtd[wk + '|' + D] = 'Ekipler 21:00 - 23:00'; S.en = {}; S.en[wk + '|' + D] = 'Not satırı';
    return { ev: evText(wk, D), day: buildText(wk, D) }
  });
  const L = r.ev.split('\n'); eq(L[0], '*Ekipler 21:00 - 23:00*'); ok(r.ev.includes('30/81'), 'ekip dışı kod yok'); ok(r.ev.includes(NAMES[9].split(' ')[0]) || r.ev.toLocaleUpperCase('tr').includes(NAMES[9].split(' ')[0].toLocaleUpperCase('tr')), 'personel yok');
  eq(L[L.length - 1], '*NOT:* Not satırı'); ok(!r.day.includes('30/81') && !r.day.includes('Not satırı'), 'gündüz listesine karıştı');
});

test('Görev Planlama: sayım tablosu herkesi tek ekranda, az gidenden çoğa gösterir', async (p) => {
  await p.evaluate(() => { var a = nid(); S.gi.t[1].push({ id: a, t: 'Mahmutbey Cad. No:73', off: false, ev: true }); S.gp[pkey(wk, D - 1, 'e', 1, a)] = [3, 4]; S.gp[pkey(wk, D, 'e', 1, a)] = [4]; S.w[wk][5][D] = 'I'; save(); buildGV(); evSayim(D) });
  await p.waitForTimeout(350);
  const r = await p.evaluate(() => { var ls = [...document.querySelectorAll('.evsyl li')]; var b = document.querySelector('.evsy').getBoundingClientRect(); return { n: ls.length, nums: ls.map(l => +l.querySelector('.n').textContent), last: ls[ls.length - 1].querySelector('.nm').textContent, lv: ls.filter(l => l.classList.contains('lv')).length, fits: b.bottom <= innerHeight + 1, bb: b.top+'-'+b.bottom+'/'+innerHeight } });
  eq(r.n, 17); ok(r.nums.every((v, i) => i === 0 || r.nums[i - 1] <= v), 'sıralı değil'); eq(r.nums[16], 2, 'bugün dahil toplam yanlış'); ok(/Yıldıray/.test(r.last)); eq(r.lv, 1); ok(r.fits, 'tablo tek ekrana sığmıyor '+r.bb);
});

/* ---------- İzin eşleşmesi ---------- */
test('izin eşleşmesi: sunucu hesabı uygulanır, geçmiş günler değişmez', async (p) => {
  const r = await p.evaluate(() => {
    var now = new Date(), cw = -1; for (var w = 0; w < S.w.length; w++) { var a = isoD(w, 0), b = isoD(w, 6), t = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2); if (a <= t && t <= b) cw = w }
    var staff = [{ id: 8, name: S.names[7] }], srv = {}, last = S.w.length - 1;
    for (var w2 = 0; w2 < S.w.length; w2++) srv[w2] = [0, 1, 2, 3, 4, 5, 6].map(function (i) { return { ds: isoD(w2, i), fixed: [], ok: (w2 === 0 || w2 === last) && i === 6 ? [{ staff_id: 8, type: 'I' }] : [] } });
    izinBirlestir(staff, [], {}, srv);
    var today = new Date().toISOString().slice(0, 10);
    return { past: S.w[0][7][6], pastIsPast: isoD(0, 6) < today, fut: S.w[last][7][6], futIsFuture: isoD(last, 6) >= today }
  });
  if (r.pastIsPast) eq(r.past, '', 'geçmiş gün değiştirildi');
  if (r.futIsFuture) eq(r.fut, 'I', 'gelecek güne izin yazılmadı');
  ok(r.pastIsPast || r.futIsFuture, 'test haftaları uygun değil');
});

(async () => {
  const srv = http.createServer((req, res) => { const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html'); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end() } res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); res.end(fs.readFileSync(f)) });
  await new Promise(r => srv.listen(0, '127.0.0.1', r)); const port = srv.address().port;
  const browser = await chromium.launch(); let fail = 0; const only = process.argv[2];
  for (const t of tests) {
    if (only && !t.name.includes(only)) continue;
    const ctx = await browser.newContext({ viewport: { width: 430, height: 900 }, serviceWorkers: 'block' }), page = await ctx.newPage(), errs = [];
    page.on('pageerror', e => errs.push(e.message));
    await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
    try {
      await page.goto('http://127.0.0.1:' + port + '/index.html'); await page.waitForTimeout(300);
      await page.evaluate(setupInPage, NAMES);
      await t.fn(page);
      if (errs.length) throw new Error('sayfa hatası: ' + errs.join(' | '));
      console.log('  ✓ ' + t.name);
    } catch (e) { fail++; console.log('  ✗ ' + t.name + '\n      ' + String(e.message).split('\n')[0]) }
    await ctx.close();
  }
  await browser.close(); srv.close();
  console.log(fail ? '\n' + fail + ' test BAŞARISIZ' : '\nTüm testler geçti (' + tests.filter(t => !only || t.name.includes(only)).length + ')');
  process.exit(fail ? 1 : 0);
})();
