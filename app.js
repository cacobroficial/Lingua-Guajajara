// ─── NHE'Ẽ APP · Guajajara Language Learning ─────────────────────────────────
// Fontes: Harrison & Harrison (1947, 1984), UD Corpus Tenetehára, FUNAI, SIL

// ─── SPLASH CANVAS ANIMATION ─────────────────────────────────────────────────
(function initCanvas() {
  const canvas = document.getElementById('splash-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], leaves = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Fireflies / stars
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * 9999, y: Math.random() * 9999,
      r: Math.random() * 2.5 + .5,
      a: Math.random(),
      da: (Math.random() - .5) * .02,
      dx: (Math.random() - .5) * .3,
      dy: (Math.random() - .5) * .3,
      c: Math.random() > .5 ? '#7ec850' : '#f5b942'
    });
  }

  // Falling leaves
  function makeLeaf() {
    return {
      x: Math.random() * 9999,
      y: -30,
      r: Math.random() * 12 + 6,
      vx: (Math.random() - .5) * 1.2,
      vy: Math.random() * .8 + .3,
      rot: Math.random() * Math.PI * 2,
      drot: (Math.random() - .5) * .04,
      a: Math.random() * .6 + .3,
      c: ['#2d6a2d','#4a8c3f','#7ec850','#c94a1a','#f5b942'][Math.floor(Math.random()*5)]
    };
  }
  for (let i = 0; i < 12; i++) {
    const l = makeLeaf(); l.y = Math.random() * 9999; leaves.push(l);
  }

  function drawLeaf(ctx, leaf) {
    ctx.save();
    ctx.translate(leaf.x, leaf.y);
    ctx.rotate(leaf.rot);
    ctx.globalAlpha = leaf.a;
    ctx.fillStyle = leaf.c;
    ctx.beginPath();
    ctx.ellipse(0, 0, leaf.r, leaf.r * .5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, W, H);
    frame++;

    // particles
    for (const p of particles) {
      p.x += p.dx; p.y += p.dy;
      p.a += p.da;
      if (p.a <= 0 || p.a >= 1) p.da *= -1;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.save();
      ctx.globalAlpha = p.a * .7;
      ctx.fillStyle = p.c;
      ctx.shadowColor = p.c;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // leaves
    for (const l of leaves) {
      l.x += l.vx + Math.sin(frame * .01 + l.x) * .3;
      l.y += l.vy;
      l.rot += l.drot;
      if (l.y > H + 40) { Object.assign(l, makeLeaf()); l.x = Math.random() * W; }
      drawLeaf(ctx, l);
    }
  }
  animate();
})();

// ─── APP INIT ─────────────────────────────────────────────────────────────────
function startApp() {
  document.getElementById('splash').classList.add('hidden');
  document.getElementById('app').classList.add('visible');
  setTimeout(() => {
    document.getElementById('splash').style.display = 'none';
    setTimeout(() => arawySpeak('welcome'), 2000);
  }, 900);
}

function showPanel(id) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  const panel = document.getElementById('panel-' + id);
  if (panel) panel.classList.add('active');
  const tab = document.querySelector(`.nav-tab[data-panel="${id}"]`);
  if (tab) tab.classList.add('active');
  window.scrollTo(0, 0);
}

// ─── TTS ENGINE (PT-BR adjusted for Guajajara sounds) ─────────────────────────
function speakGuajajara(word, phonetic) {
  if (!window.speechSynthesis) { alert('TTS não disponível neste dispositivo.'); return; }
  window.speechSynthesis.cancel();
  const text = phonetic || word;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'pt-BR';
  utter.rate = 0.78;
  utter.pitch = 1.05;
  // Try to find a pt-BR voice
  const voices = window.speechSynthesis.getVoices();
  const ptVoice = voices.find(v => v.lang === 'pt-BR') || voices.find(v => v.lang.startsWith('pt'));
  if (ptVoice) utter.voice = ptVoice;
  window.speechSynthesis.speak(utter);
}

// Ensure voices are loaded (guard: speechSynthesis ausente em alguns navegadores móveis)
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

// ─── ARAWY GUIDE ──────────────────────────────────────────────────────────────
const arawyMessages = {
  greeting:  "Maraná! (Olá!) Toque nos botões 🔊 para ouvir qualquer palavra. Posso te ajudar com pronúncia, significados e gramática!",
  welcome:   "Maraná! Bem-vindo ao Nhe'ẽ! Sou Arawy, sua arara-guia. Comece pela história do povo ou vá direto ao curso. Boa jornada! 🌿",
  pron_xe:   "💡 'Xe' = CHÊ. Como 'chave' ou 'chá' do português, com o 'e' fechado. É o prefixo de posse/sujeito da 1ª pessoa!",
  pron_y:    "💡 'Y' em Guajajara é uma vogal central — quase um 'i' mas com a boca um pouco mais relaxada, levemente entre 'i' e 'u'. Y'y = água!",
  pron_nasal:"💡 Vogais nasais (ã, ẽ, ĩ) são muito importantes em Guajajara! Mudam o significado completamente. Treine: 'kunhã' (ku-nhã) = mulher.",
  quiz_good: "Ara ara! 🎉 Muito bem! Continue assim, você está aprendendo o Guajajara!",
  quiz_bad:  "Não desanime! Os Tenetehára dizem: 'A língua se aprende com paciência, como se cultiva a roça.' Tente novamente! 🌱",
  help:      "Posso te ajudar com: pronúncia (vá em 🎵 Pronúncia), vocabulário (📖 Dicionário), ou pratique com o 🏆 Quiz! O que prefere?"
};

function arawySpeak(key) {
  const msg = arawyMessages[key] || arawyMessages.help;
  document.getElementById('guide-text').innerHTML = msg;
  document.getElementById('guide-bubble').classList.add('visible');
}
function toggleGuide() {
  const b = document.getElementById('guide-bubble');
  if (b.classList.contains('visible')) { b.classList.remove('visible'); }
  else { arawySpeak('help'); }
}
function closeGuide() { document.getElementById('guide-bubble').classList.remove('visible'); }

// ─── VOCABULARY DATABASE ──────────────────────────────────────────────────────
// Fonte: Harrison & Harrison (1947, 1984), Duarte (2007), Correa da Silva (1997)
// Nota: pronúncias adaptadas para falantes de PT-BR

const VOCAB = {

  // ── BÁSICO ────────────────────────────────────────────────────────────────
  saudacoes: {
    name: "👋 Saudações", level: "basic",
    words: [
      { g: "Maraná",       ph: "ma-ra-NÁ",     pt: "Olá / Bom dia", ex: "Maraná, xe ramuhã! = Olá, meu avô!" },
      { g: "Mehe ku pe?",  ph: "me-hê-ku-pê",   pt: "Como vai você? / Tudo bem?", ex: "Mehe ku pe? — Angatu! = Como vai? — Bem!" },
      { g: "Angatu",       ph: "an-ga-TU",       pt: "Bem / Bom / Está bom", ex: "Xe angatu = Eu estou bem" },
      { g: "Ikatu",        ph: "i-ka-TU",        pt: "Pode ser / Está bem / Ok", note:"Resposta afirmativa polida" },
      { g: "Xe awá",       ph: "shê-a-WÁ",       pt: "Eu sou (+ nome) / Minha identidade" },
      { g: "Mehe nipe?",   ph: "me-hê-ni-PÊ",    pt: "De onde você é?", ex: "Mehe nipe? — Aldeia Araribóia" },
      { g: "Eroho",        ph: "e-ro-HO",         pt: "Vá / Tchau (para quem vai)", ex: "Eroho! Angatu pe! = Vá! Vá bem!" },
      { g: "Enho",         ph: "ê-nho",           pt: "Venha / Venha cá", ex: "Enho! = Venha!" },
      { g: "Kwáhy",        ph: "kwá-hî",          pt: "Obrigado / Gratidão", note: "Expressão de gratidão informal" },
      { g: "Aguyje",       ph: "a-gu-YÊ",         pt: "Obrigado / Perfeito (formal)", note: "Forma mais formal e reverente de agradecer" },
      { g: "Ani",          ph: "a-NÍ",            pt: "Não / Negação", ex: "Ani! = Não!" },
      { g: "Aé",           ph: "a-ÊH",            pt: "Sim / É isso", ex: "Aé, angatu! = Sim, está bem!" },
      { g: "Mamo eho?",    ph: "ma-mo-e-HO",      pt: "Para onde você vai?", ex: "Mamo eho? — Xe eho aldeia pe." },
      { g: "Ko'i",         ph: "ko-Í",             pt: "Agora / Neste momento" },
      { g: "Ko'i pe maraná", ph: "ko-í-pê-ma-ra-NÁ", pt: "Bom dia (lit. agora bom)" },
      { g: "Pyhyn pe maraná", ph: "pî-hîn-pê-ma-ra-NÁ", pt: "Boa noite (lit. noite bem)" },
      { g: "Xe r-er",      ph: "shê-r-êr",         pt: "Meu nome é...", ex: "Xe r-er Paulo = Meu nome é Paulo" },
      { g: "Nde r-er",     ph: "ndê-r-êr",         pt: "Seu nome é... / Como você se chama?" },
      { g: "Kwé pe",       ph: "kwê-PÊ",           pt: "Até logo / Até mais" },
    ]
  },

  familia: {
    name: "👨‍👩‍👧 Família", level: "basic",
    words: [
      { g: "Xe ru",        ph: "shê-RÚ",       pt: "Meu pai", note: "xe = meu (1ª p.) + ru = pai" },
      { g: "Xe sy",        ph: "shê-SÍ",        pt: "Minha mãe", note: "sy = mãe, pronuncia-se 'sí'" },
      { g: "Xe memyr",     ph: "shê-me-MÎR",    pt: "Meu filho / Minha filha", ex: "Xe memyr angatu = Meu filho está bem" },
      { g: "Xe r-ykér",    ph: "shê-rî-KÊR",    pt: "Meu irmão mais novo" },
      { g: "Xe ywyr",      ph: "shê-î-WÎR",     pt: "Meu irmão mais velho (hom. fala)" },
      { g: "Xe aky",       ph: "shê-a-KÎ",       pt: "Minha irmã mais velha (mulher fala)" },
      { g: "Xe ramuhã",    ph: "shê-ra-mu-HÃ",   pt: "Meu avô", ex: "Xe ramuhã haikwé = Meu avô é sábio" },
      { g: "Xe ramyjár",   ph: "shê-ra-mî-JÁR",  pt: "Minha avó" },
      { g: "Xe manó",      ph: "shê-ma-NÓ",       pt: "Meu esposo / Minha esposa (cônjuge)" },
      { g: "Xe mymyr-ywá", ph: "shê-mî-mîr-î-WÁ", pt: "Meus filhos (plural)" },
      { g: "Xe karaiw",    ph: "shê-ka-ra-IW",    pt: "Meu primo / parente próximo" },
      { g: "Xe kymywer",   ph: "shê-kî-mî-WÊR",  pt: "Meu cunhado / cunhada" },
      { g: "Xe pyhyhar",   ph: "shê-pî-hî-HAR",  pt: "Meu sobrinho / sobrinha" },
      { g: "Memihar",      ph: "me-mi-HAR",        pt: "Criança / aprendiz (carinhoso)", ex: "Xe memihar = meu aprendiz / meu filho adotivo" },
      { g: "Kunhã musak",  ph: "ku-nhã-mu-SAK",   pt: "Moça / jovem mulher" },
      { g: "Awá porã",     ph: "a-wá-po-RÃ",       pt: "Homem bonito / bom rapaz", note: "porã = bonito/bom" },
      { g: "Ñeengar",      ph: "nhê-en-GAR",        pt: "Parentes / família extensa", note: "conceito central na cultura Tenetehára" },
      { g: "Xe mir",       ph: "shê-MÍR",           pt: "Meu bebê / minha criança pequena" },
      { g: "Xe rypar",     ph: "shê-rî-PAR",        pt: "Meu sogro / minha sogra" },
      { g: "Penhé ñeengar",ph: "pe-nhê-nhê-en-GAR", pt: "Nossa família (toda)" },
    ]
  },

  numeros: {
    name: "🔢 Números", level: "basic",
    words: [
      { g: "Moko'yr",      ph: "mo-ko-ÎR",      pt: "Um (1)", note: "Sistema de contagem original vai até 3; para mais usa-se 'muitos'" },
      { g: "Mokõi",        ph: "mo-kõi",          pt: "Dois (2)" },
      { g: "Mosapy",       ph: "mo-sa-PÎ",        pt: "Três (3)" },
      { g: "Irundy",       ph: "i-run-DÎ",         pt: "Quatro (4)" },
      { g: "Po",           ph: "PO",               pt: "Cinco (5) — 'mão'", note: "Literalmente 'mão' — sistema quinário" },
      { g: "Po moko'yr",   ph: "po-mo-ko-ÎR",     pt: "Seis (5+1)", note: "Sistema aditivo baseado na mão" },
      { g: "Po mokõi",     ph: "po-mo-kõi",        pt: "Sete (5+2)" },
      { g: "Po mosapy",    ph: "po-mo-sa-PÎ",      pt: "Oito (5+3)" },
      { g: "Po irundy",    ph: "po-i-run-DÎ",      pt: "Nove (5+4)" },
      { g: "Po mokõi (ambos)", ph: "po-mo-kõi-am-BÔS", pt: "Dez (10) — 'as duas mãos'", note: "Lit. 'duas mãos'" },
      { g: "Mawy",         ph: "ma-WÎ",             pt: "Muitos / Muito (quantidade grande)" },
      { g: "Mira mawy",    ph: "mi-ra-ma-WÎ",       pt: "Muitas pessoas" },
      { g: "Moko'yr té",   ph: "mo-ko-ÎR-TÊ",      pt: "Apenas um / Somente um" },
      { g: "Ani ha'e",     ph: "a-ni-ha-Ê",          pt: "Nenhum / Nada" },
      { g: "Po oho",       ph: "po-o-HO",            pt: "Onze em diante (lit. mão vai...)", note: "Contagem continua aditivamente" },
    ]
  },

  cores: {
    name: "🎨 Cores", level: "basic",
    words: [
      { g: "Pytãng",       ph: "pî-TÃNG",      pt: "Vermelho", ex: "Pytãng hé = É vermelho" },
      { g: "Sasy",         ph: "sa-SÎ",          pt: "Azul / Verde (azul-verde)", note: "O Guajajara usa uma palavra para o espectro azul-verde" },
      { g: "Oby",          ph: "o-BÎ",           pt: "Verde (folha viva)", ex: "Kaá oby = Folha verde" },
      { g: "Tawá",         ph: "ta-WÁ",           pt: "Amarelo", ex: "Ko'yr tawá = Sol amarelo" },
      { g: "Hũ",           ph: "HŨ",              pt: "Preto / Escuro", note: "Tom nasal forte" },
      { g: "Morotĩ",       ph: "mo-ro-TĨ",        pt: "Branco / Claro", ex: "Morotĩ pukú = Longo branco" },
      { g: "Pinĩ",         ph: "pi-NĨ",           pt: "Malhado / Pintado (várias cores)" },
      { g: "Pykasé",       ph: "pî-ka-SÊ",        pt: "Cinza" },
      { g: "Itá hũ",       ph: "i-tá-HŨ",         pt: "Preto como pedra (intensificador)" },
      { g: "Tawá syk",     ph: "ta-wá-SÎK",       pt: "Laranja (amarelo queimado)" },
    ]
  },

  corpo: {
    name: "🫀 Corpo Humano", level: "basic",
    words: [
      { g: "Akã",          ph: "a-KÃ",          pt: "Cabeça", ex: "Xe akã ywý = Minha cabeça dói" },
      { g: "Esá",          ph: "e-SÁ",            pt: "Olho / Olhos" },
      { g: "Nambi",        ph: "nam-BI",           pt: "Orelha / Ouvido" },
      { g: "Tĩ",           ph: "TĨ",               pt: "Nariz" },
      { g: "Juru",         ph: "ju-RÚ",             pt: "Boca", ex: "Xe juru kwer = Minha boca está seca" },
      { g: "Ñe'ẽ / Kanê", ph: "nhê-ê / ka-NÊ",   pt: "Língua (órgão) / Língua (idioma)" },
      { g: "Py",           ph: "PÎ",               pt: "Pé / Perna", ex: "Xe py ywý = Meu pé dói" },
      { g: "Po",           ph: "PO",               pt: "Mão / Braço", note: "Mesmo radical para mão/número 5" },
      { g: "Kyje",         ph: "kî-JÊ",            pt: "Costas" },
      { g: "Rywy",         ph: "rî-WÎ",             pt: "Barriga / Ventre", ex: "Xe rywy hihí = Estou com fome (lit. minha barriga chora)" },
      { g: "Hupe",         ph: "hu-PÊ",             pt: "Pele / Couro" },
      { g: "Kang",         ph: "KANG",              pt: "Osso" },
      { g: "Tuwér",        ph: "tu-WÊR",            pt: "Coração" },
      { g: "Tuwér ywý",    ph: "tu-wêr-î-WÎ",      pt: "Tristeza (lit. coração dói)" },
    ]
  },

  natureza: {
    name: "🌿 Natureza", level: "basic",
    words: [
      { g: "Kaá",          ph: "ka-Á",          pt: "Mato / Floresta / Folha", note: "Raiz importante: kaá = natureza vegetal" },
      { g: "Y'y",          ph: "Î-Î (c/pausa)", pt: "Água / Rio", note: "O apóstrofo = pausa glotal. Um dos sons mais distintos!" },
      { g: "Ko'yr",        ph: "ko-ÎR",          pt: "Sol", ex: "Ko'yr kwak = O sol nasceu" },
      { g: "Pyhyn",        ph: "pî-HÎN",          pt: "Noite / Escuridão" },
      { g: "Pituna",       ph: "pi-tu-NA",         pt: "Madrugada / Amanhecer" },
      { g: "Ará",          ph: "a-RÁ",             pt: "Céu / Dia", ex: "Ará porã = Dia bonito" },
      { g: "Amana",        ph: "a-ma-NA",           pt: "Chuva", ex: "Amana ú = A chuva veio / Está chovendo" },
      { g: "Ita",          ph: "i-TÁ",              pt: "Pedra / Rocha" },
      { g: "Yw",           ph: "ÎW",                pt: "Terra / Solo / Chão" },
      { g: "Tataú",        ph: "ta-ta-Ú",           pt: "Fogo", note: "Raiz 'tata' comum no Tupi" },
      { g: "Tatá",         ph: "ta-TÁ",             pt: "Brasa / Fogo pequeno" },
      { g: "Hu'y",         ph: "hu-Î",               pt: "Vento / Brisa" },
      { g: "Yrywó",        ph: "î-rî-WÓ",            pt: "Pássaro (genérico)" },
      { g: "Yrywó porã",   ph: "î-rî-wó-po-RÃ",     pt: "Pássaro bonito / papagaio" },
      { g: "Manga",        ph: "man-GA",               pt: "Árvore grande / fruta manga (empréstimo)" },
      { g: "Itá syk",      ph: "i-tá-SÎK",            pt: "Cachoeira (lit. pedra que desce água)" },
      { g: "Para",         ph: "pa-RA",                pt: "Mar / Rio grande", note: "Cognato com 'Pará'" },
      { g: "Ywytu",        ph: "î-wî-TU",              pt: "Vento forte / Tempestade" },
      { g: "Pira",         ph: "pi-RA",                pt: "Peixe (genérico)" },
      { g: "Mym",          ph: "MÎM",                  pt: "Bicho / Animal pequeno" },
    ]
  },

  alimentos: {
    name: "🍎 Alimentos", level: "basic",
    words: [
      { g: "Manihĩ",       ph: "ma-ni-HĨ",      pt: "Mandioca / Macaxeira", note: "Alimento base dos Tenetehára. Raiz cognata do PT 'mandioca'" },
      { g: "Manihĩ'i",     ph: "ma-ni-hĩ-Í",     pt: "Farinha de mandioca (grossa)" },
      { g: "Beju",         ph: "be-JÚ",           pt: "Beiju (tapioca)", note: "Palavra de origem Tupi presente no PT" },
      { g: "Pira",         ph: "pi-RA",            pt: "Peixe (alimento)", ex: "Xe u pira = Eu como peixe" },
      { g: "Sy'y",         ph: "sÎ-Î",             pt: "Mel de abelha nativa" },
      { g: "Akajú",        ph: "a-ka-JÚ",           pt: "Caju", note: "Palavra de origem Tupi, passou para o PT" },
      { g: "Anana",        ph: "a-na-NA",           pt: "Abacaxi / Ananás", note: "Outro empréstimo Tupi para PT" },
      { g: "Karáwatá",     ph: "ka-rá-wa-TÁ",      pt: "Macaxeira / Aipim (var.)" },
      { g: "Kaukau",       ph: "kau-KAU",            pt: "Bebida fermentada de mandioca (cauim)", note: "Bebida ritual tradicional" },
      { g: "Moqueado",     ph: "mo-kê-a-DO",         pt: "Carne moqueada (assada em grelha)", note: "Técnica culinária Tenetehára" },
      { g: "Kwyr",         ph: "KWÎR",               pt: "Gordura / Óleo vegetal" },
      { g: "Xipó",         ph: "shí-PÓ",             pt: "Cipó (usado em alimentos, medicina)" },
      { g: "U",            ph: "Ú",                  pt: "Comer / Comida (verbo)", ex: "Xe u = Eu como; A'e u = Ele come" },
      { g: "Ú",            ph: "Ú (tom alto)",        pt: "Fruta / Alimento pronto para comer", note: "Tom diferente de 'u' (comer)" },
      { g: "Wy'y",         ph: "wÎ-Î",               pt: "Água de beber / Bebida", ex: "Xe wy'y = Minha bebida/água" },
      { g: "Kyse",         ph: "kî-SÊ",               pt: "Faca / Instrumento de corte" },
      { g: "Kará",         ph: "ka-RÁ",               pt: "Inhame" },
      { g: "Mamão",        ph: "ma-MÃO",               pt: "Mamão (empréstimo do PT, mas muito usado)", note: "Originalmente 'mamão' veio do Tupi 'mamão'" },
      { g: "Kurumi",       ph: "ku-ru-MI",              pt: "Menino (que ainda mama) / bebê" },
      { g: "Xe hyhy",      ph: "shê-hî-HÎ",            pt: "Estou com fome (lit. minha [barriga] grita)" },
    ]
  },

  animais: {
    name: "🐾 Animais", level: "basic",
    words: [
      { g: "Jaguareté",    ph: "ja-gua-re-TÊ",   pt: "Onça-pintada / Jaguar", note: "Palavra Tupi que deu origem ao PT 'jaguar'" },
      { g: "Tatú",         ph: "ta-TÚ",           pt: "Tatu", note: "Palavra Tupi que entrou no PT" },
      { g: "Kapiwara",     ph: "ka-pi-wa-RA",      pt: "Capivara", note: "Do Tupi 'capivara' = comedor de mato" },
      { g: "Arawy",        ph: "a-ra-WÎ",           pt: "Arara", note: "Nome do nosso mascote!" },
      { g: "Arahy",        ph: "a-ra-HÎ",           pt: "Arara azul (específica)" },
      { g: "Mainumby",     ph: "mai-num-BÎ",        pt: "Beija-flor", note: "Palavra Tupi: 'o que beija as flores'" },
      { g: "Jakaré",       ph: "ja-ka-RÊ",           pt: "Jacaré / Crocodilo", note: "Outro empréstimo do Tupi para o PT" },
      { g: "Kururi",       ph: "ku-ru-RI",            pt: "Sapo / Rã" },
      { g: "Memby",        ph: "mem-BÎ",              pt: "Filhote de animal" },
      { g: "Tembekuá",     ph: "tem-be-kuÁ",          pt: "Anta" },
      { g: "Jandaia",      ph: "jan-da-IA",           pt: "Periquito / Jandaia", note: "Palavra de origem Tupi" },
      { g: "Pirá",         ph: "pi-RÁ",               pt: "Peixe (genérico)", ex: "Pirá pukú = Peixe comprido" },
      { g: "Piraíba",      ph: "pi-ra-Í-ba",          pt: "Piraíba (peixe gigante amazônico)" },
      { g: "Miyra",        ph: "mi-ÎRA",               pt: "Passarinho / Ave pequena" },
      { g: "Jy",           ph: "JÎ",                   pt: "Formiga (raiz)" },
      { g: "Jy'u",         ph: "jÎ-Ú",                pt: "Formiga grande (tocandira)" },
      { g: "Kwarywyra",    ph: "kwa-rî-wî-RA",        pt: "Urubu / Abutre" },
      { g: "Maruwá",       ph: "ma-ru-WÁ",             pt: "Macaco genérico" },
      { g: "Kaí",          ph: "ka-Í",                 pt: "Macaco prego", note: "Palavra Tupi" },
      { g: "Syrykywy",     ph: "sî-rî-kî-WÎ",         pt: "Cobra / Serpente" },
    ]
  },

  casa: {
    name: "🏡 Casa e Aldeia", level: "basic",
    words: [
      { g: "Oka",          ph: "o-KA",           pt: "Casa / Habitação", ex: "Xe oka = Minha casa" },
      { g: "Oka porã",     ph: "o-ka-po-RÃ",      pt: "Casa bonita / bem feita" },
      { g: "Tapé",         ph: "ta-PÊ",            pt: "Caminho / Estrada", ex: "Tapé porã = Bom caminho" },
      { g: "Tekohaw",      ph: "te-ko-HAW",         pt: "Aldeia / Comunidade / Território", note: "Palavra central: 'modo de ser e estar do povo'" },
      { g: "Ywyrá",        ph: "î-wî-RÁ",           pt: "Madeira / Árvore (para construção)" },
      { g: "Typé",         ph: "tî-PÊ",              pt: "Rede de dormir (item essencial Tenetehára)" },
      { g: "Tatapiré",     ph: "ta-ta-pi-RÊ",        pt: "Fogão / Fogueira doméstica" },
      { g: "Xipó",         ph: "shí-PÓ",              pt: "Cipó (usado na construção)" },
      { g: "Meruwyra",     ph: "me-ru-wî-RA",         pt: "Porta / Entrada da casa" },
      { g: "Jeju",         ph: "je-JÚ",               pt: "Telhado / Cobertura" },
      { g: "Mokã",         ph: "mo-KÃ",               pt: "Roça / Plantação", note: "Central na vida Tenetehára" },
      { g: "Taperé",       ph: "ta-pe-RÊ",             pt: "Rua da aldeia / centro comunitário" },
      { g: "Ka'a moká",    ph: "ka-a-mo-KÁ",          pt: "Beira da floresta / mato próximo" },
    ]
  },

  tempo: {
    name: "⏰ Tempo", level: "basic",
    words: [
      { g: "Ko'i",         ph: "ko-Í",           pt: "Agora / Hoje (este momento)" },
      { g: "Ko ára",       ph: "ko-á-RA",         pt: "Hoje (este dia)" },
      { g: "Amõ ára",      ph: "a-mõ-á-RA",       pt: "Amanhã / Outro dia" },
      { g: "Ko'yr",        ph: "ko-ÎR",            pt: "Sol (e também 'dia com sol')" },
      { g: "Pyhyn",        ph: "pî-HÎN",           pt: "Noite" },
      { g: "Pituna",       ph: "pi-tu-NA",          pt: "Madrugada / De manhã bem cedo" },
      { g: "Kwasé",        ph: "kwa-SÊ",            pt: "Muito tempo atrás / Antigamente" },
      { g: "Amõ ára kwasé",ph: "a-mõ-á-ra-kwa-SÊ", pt: "Há muito tempo" },
      { g: "Ko'i pe",      ph: "ko-Í-pê",           pt: "Neste exato momento" },
      { g: "Uwí",          ph: "u-WÍ",               pt: "Ano / Temporada (ciclo de chuvas)" },
      { g: "Amana ára",    ph: "a-ma-na-á-RA",       pt: "Tempo de chuva / Inverno amazônico" },
      { g: "Ko'yr ará",    ph: "ko-ÎR-á-RA",         pt: "Tempo seco / Verão amazônico" },
    ]
  },

  // ── INTERMEDIÁRIO ─────────────────────────────────────────────────────────
  verbos: {
    name: "⚡ Verbos Essenciais", level: "inter",
    words: [
      { g: "U",            ph: "Ú",              pt: "Comer", ex: "Xe u manihĩ = Eu como mandioca" },
      { g: "Wy'y u",       ph: "wÎ-Î-Ú",         pt: "Beber água / Beber", ex: "Xe wy'y u = Eu bebo água" },
      { g: "Oho",          ph: "o-HO",            pt: "Ir / Foi (3ª p.)", ex: "A'e oho tekohaw pe = Ele foi para a aldeia" },
      { g: "Eho",          ph: "e-HO",             pt: "Ir (imperativo/2ª p.)", ex: "Eho! = Vá!" },
      { g: "U",            ph: "Ú",               pt: "Vir / Chegou (com contexto)", note: "Depende do contexto: 'u' pode ser comer ou vir" },
      { g: "Apo",          ph: "a-PO",             pt: "Fazer / Trabalhar", ex: "Xe apo = Eu faço/trabalho" },
      { g: "Hex",          ph: "HÊSH",             pt: "Ver / Olhar", ex: "Xe hex nde = Eu te vejo" },
      { g: "Nupã",         ph: "nu-PÃ",            pt: "Bater / Golpear (físico ou construir)" },
      { g: "Moñe'ẽng",     ph: "mo-nhê-Ẽng",       pt: "Falar / Contar história", ex: "Xe moñe'ẽng = Eu falo/conto" },
      { g: "Moñe'ẽng-aty", ph: "mo-nhê-ẽng-a-TÎ",  pt: "Conversar / Dialogar" },
      { g: "Momokyr",      ph: "mo-mo-KÎR",         pt: "Lavar / Limpar" },
      { g: "Mokantar",     ph: "mo-kan-TAR",         pt: "Cantar / Celebrar com canto" },
      { g: "Kyty",         ph: "kÎ-TÎ",              pt: "Cortar / Colher (roça)" },
      { g: "Ywyrá kyty",   ph: "î-wî-rá-kÎ-TÎ",     pt: "Cortar madeira / Derrubar árvore" },
      { g: "Mano",         ph: "ma-NO",               pt: "Morrer / Morto", note: "Palavra importante para entender frases" },
      { g: "Mim",          ph: "MIM",                 pt: "Esconder / Guardar" },
      { g: "Pytywõ",       ph: "pî-tî-WÕ",            pt: "Ajudar / Auxiliar", ex: "Xe pytywõ nde = Eu te ajudo" },
      { g: "Enõĩ",         ph: "e-nõ-Ĩ",              pt: "Chamar / Convocar" },
      { g: "Meꞌẽ",         ph: "me-Ẽ",                pt: "Dar / Oferecer", ex: "Xe me'ẽ nde = Eu te dou" },
      { g: "Gwãhẽ",        ph: "gwã-HẼ",               pt: "Chegar / Arribar" },
    ]
  },

  pronomes: {
    name: "🙋 Pronomes e Possessivos", level: "inter",
    words: [
      { g: "Xe",           ph: "SHỆÊ",           pt: "Eu / Meu (1ª p. singular)", note: "Prefixo de sujeito E posse" },
      { g: "Nde",          ph: "NDÊE",            pt: "Tu / Você / Teu (2ª p. singular)" },
      { g: "A'e",          ph: "a-Ê",             pt: "Ele / Ela / Seu (3ª p. singular)" },
      { g: "Ure",          ph: "u-RÊ",            pt: "Nós (exclusivo — sem incluir você)", note: "Distinção inclusivo/exclusivo é importante!" },
      { g: "Yandé",        ph: "yan-DÊ",           pt: "Nós (inclusivo — eu e você)", note: "Inclui o interlocutor!" },
      { g: "Penhé",        ph: "pe-NHÊ",           pt: "Vocês / Vós (2ª p. plural)" },
      { g: "Awé",          ph: "a-WÊ",             pt: "Eles / Elas (3ª p. plural)" },
      { g: "Xe r-",        ph: "shê-r-",            pt: "Meu/Minha (antes de vogal)", note: "Xe r-esá = meu olho" },
      { g: "Nde r-",       ph: "ndê-r-",            pt: "Teu/Tua (antes de vogal)" },
      { g: "I-",           ph: "I-",                pt: "Dele/Dela (prefixo de 3ª p.)", ex: "I-ru = pai dele" },
      { g: "Xe",           ph: "shê",               pt: "Meu (antes de consoante)", ex: "Xe ru = meu pai; Xe sy = minha mãe" },
    ]
  },

  conversacao: {
    name: "💬 Conversação Prática", level: "inter",
    words: [
      { g: "Mamo pe nde oka?", ph: "ma-mo-pê-ndê-o-KA",  pt: "Onde fica sua casa?" },
      { g: "Mehe nde ming?",   ph: "me-hê-ndê-MING",      pt: "Quantos anos você tem?" },
      { g: "Xe moing X uwí",   ph: "shê-mo-ing-X-u-WÍ",   pt: "Eu tenho X anos" },
      { g: "Nde moñe'ẽng?",    ph: "ndê-mo-nhê-ẼNG",       pt: "Você fala (Guajajara)?" },
      { g: "Xe moñe'ẽng iky",  ph: "shê-mo-nhê-ẽng-i-KÎ",  pt: "Eu falo um pouco" },
      { g: "Momo pe?",         ph: "mo-mo-PÊ",              pt: "Onde está? / Para onde?" },
      { g: "Mehe ha'e?",       ph: "me-hê-ha-Ê",            pt: "O que é isso?" },
      { g: "Aipo",             ph: "ai-PO",                  pt: "Isso / Este aqui", ex: "Aipo manihĩ = Isso é mandioca" },
      { g: "Pype",             ph: "pÎ-PÊ",                  pt: "Dentro / Neste lugar" },
      { g: "Mehe ku iké?",     ph: "me-hê-ku-i-KÊ",          pt: "Quanto custa? / Qual o preço?" },
      { g: "Kwé aty",          ph: "kwê-a-TÎ",                pt: "Depois / Mais tarde" },
      { g: "Ko'i aty",         ph: "ko-í-a-TÎ",               pt: "Logo agora / Já já" },
      { g: "Xe ndé pytywõ",    ph: "shê-ndê-pî-tî-WÕ",        pt: "Eu posso te ajudar" },
      { g: "Nde pytywõ xe?",   ph: "ndê-pî-tî-wõ-shê",        pt: "Você pode me ajudar?" },
      { g: "Ikatu!",           ph: "i-ka-TU",                  pt: "Pode! / Claro! / Sim, pode!" },
    ]
  },

  saude: {
    name: "💊 Saúde e Corpo", level: "inter",
    words: [
      { g: "Xe ywý",        ph: "shê-î-WÎ",       pt: "Estou com dor / Dói (lit. meu [algo] dói)" },
      { g: "Akã ywý",       ph: "a-kã-î-WÎ",       pt: "Dor de cabeça (cabeça dói)" },
      { g: "Rywy ywý",      ph: "rî-wî-î-WÎ",      pt: "Dor de barriga" },
      { g: "Mara",          ph: "ma-RA",             pt: "Doença / Enfermidade" },
      { g: "Mara ywý",      ph: "ma-ra-î-WÎ",       pt: "A doença dói / Estou doente" },
      { g: "Mara'í",        ph: "ma-ra-Í",           pt: "Remédio / Medicina (lit. pequena doença — que cura)" },
      { g: "Ka'á mara'í",   ph: "ka-á-ma-ra-Í",      pt: "Planta medicinal (mato remédio)", note: "Os Tenetehára têm vasto conhecimento de plantas medicinais" },
      { g: "Pahy",          ph: "pa-HÎ",              pt: "Pajé / Xamã (curador espiritual)" },
      { g: "Pahy mara'í",   ph: "pa-hî-ma-ra-Í",      pt: "Cura do pajé / tratamento espiritual" },
      { g: "Xe porãhý",     ph: "shê-po-rã-HÎ",       pt: "Estou bem / Me sinto bem" },
      { g: "Angatu ndé",    ph: "an-ga-tu-NDÊ",        pt: "Você está bem?" },
    ]
  },

  tradicoes: {
    name: "🪶 Tradições e Cultura", level: "inter",
    words: [
      { g: "Moñe'ẽng-retá", ph: "mo-nhê-ẽng-re-TÁ",  pt: "Narrativa tradicional / Mito", note: "A transmissão oral é central na cultura Tenetehára" },
      { g: "Toré",           ph: "to-RÊ",               pt: "Dança tradicional Toré / Ritual", note: "Dança sagrada dos Tenetehára" },
      { g: "Maracá",         ph: "ma-ra-KÁ",             pt: "Maracá (chocalho cerimonial)", note: "Instrumento musical ritual" },
      { g: "Pahy",           ph: "pa-HÎ",                pt: "Pajé / Xamã" },
      { g: "Maraí",          ph: "ma-ra-Í",              pt: "Canto ritual / Rezado" },
      { g: "Tekohaw porã",   ph: "te-ko-haw-po-RÃ",     pt: "Vida boa / Modo de ser bom", note: "Conceito central da cosmovisão Tenetehára" },
      { g: "Karuwar",        ph: "ka-ru-WAR",             pt: "Espírito dos mortos / Ancestral", note: "Importante na cosmologia Tenetehára" },
      { g: "Maíra",          ph: "ma-Í-ra",               pt: "Herói mítico / Criador (Tupi-Guarani)", note: "Figura mitológica central" },
      { g: "Mokã aty",       ph: "mo-kã-a-TÎ",            pt: "Mutirão / Trabalho coletivo na roça", note: "Prática comunitária essencial" },
      { g: "Pindoba",        ph: "pin-DO-ba",              pt: "Palmeira (símbolo da resistência Tenetehára)" },
    ]
  },

  // ── AVANÇADO 1 ────────────────────────────────────────────────────────────
  gramatica: {
    name: "📐 Gramática Básica", level: "adv1",
    words: [
      { g: "A- (prefixo)",    ph: "A-",             pt: "Prefixo de 1ª pessoa: a-ho = eu vou; a-u = eu como" },
      { g: "Ere- (prefixo)",  ph: "e-RE-",           pt: "Prefixo de 2ª pessoa: ere-ho = você vai" },
      { g: "O- (prefixo)",    ph: "O-",              pt: "Prefixo de 3ª pessoa: o-ho = ele/ela foi" },
      { g: "-te (ênfase)",    ph: "-TÊ",              pt: "Partícula enfática: angatu-te = muito bom mesmo" },
      { g: "-pe (locativo)",  ph: "-PÊ",              pt: "Sufixo locativo: aldeia pe = na aldeia" },
      { g: "-wy (origem)",    ph: "-WÎ",              pt: "Sufixo de origem: kaá-wy = da floresta" },
      { g: "Hé (cópula)",     ph: "HÊ",               pt: "É / Ser (cópula predicativa)", ex: "Awá hé = É gente/pessoa" },
      { g: "-kwer (passado)", ph: "-KWER",             pt: "Sufixo de passado/concluso", ex: "O-ho-kwer = ele já foi" },
      { g: "-ramo (propósito)",ph: "-ra-MO",           pt: "Para / Com objetivo de", ex: "Eho tekohaw-ramo = Vá para a aldeia" },
      { g: "Ani (negação)",   ph: "a-NÍ",              pt: "Negação: Ani a-ho = Não vou" },
    ]
  },

  espiritual: {
    name: "🌟 Espiritualidade", level: "adv1",
    words: [
      { g: "Ñe'ẽng",          ph: "nhê-ÊNG",         pt: "Alma / Espírito pessoal", note: "Conceito central: a palavra-alma que cada pessoa carrega" },
      { g: "Maíra",           ph: "ma-Í-ra",          pt: "Maíra — herói criador / deus solar" },
      { g: "Karuwar aty",     ph: "ka-ru-war-a-TÎ",   pt: "Assembleia dos espíritos ancestrais" },
      { g: "Zepé tataú",      ph: "ze-pê-ta-ta-Ú",    pt: "Fogo sagrado do ritual" },
      { g: "Tekohaw angatu",  ph: "te-ko-haw-an-ga-TU",pt: "Viver bem / Ser bem-estar pleno", note: "Filosofia de vida Tenetehára" },
      { g: "Ñande reko",      ph: "nhân-de-re-KO",     pt: "Nosso modo de ser / Nossa cultura" },
      { g: "Pahy retá",       ph: "pa-hî-re-TÁ",       pt: "Terra do pajé / Espaço sagrado" },
    ]
  },

  // ── AVANÇADO 2 ────────────────────────────────────────────────────────────
  textos: {
    name: "📜 Textos Autênticos", level: "adv2",
    words: [
      { g: "Ko'yt pe, xe ru oho kaá pe, pira zapy-ramo.", ph: "(texto)",
        pt: "Hoje de manhã, meu pai foi ao mato para pescar.", note: "Exemplo de frase narrativa completa" },
      { g: "A'e gwãhẽ tekohaw pe, amana ywý-mo.", ph: "(texto)",
        pt: "Ele chegou à aldeia quando a chuva estava caindo.", note: "Uso de subordinação temporal" },
      { g: "Xe ramuhã moñe'ẽng-retá nde-pé — iké!", ph: "(texto)",
        pt: "Meu avô contou uma história para você — ouça!", note: "Imperativo + narrativa" },
      { g: "Ñande tekohaw angatu-te, kwasé pe ha'e ko ára pe.", ph: "(texto)",
        pt: "Nossa aldeia é muito boa, tanto no passado quanto hoje.", note: "Comparação temporal" },
    ]
  }
};

// ─── COURSE NAVIGATION ────────────────────────────────────────────────────────
const LEVELS = {
  basic: {
    title: "🌱 Nível Básico",
    modules: ['saudacoes','familia','numeros','cores','corpo','natureza','alimentos','animais','casa','tempo']
  },
  inter: {
    title: "🌿 Nível Intermediário",
    modules: ['verbos','pronomes','conversacao','saude','tradicoes']
  },
  adv1: {
    title: "🔥 Avançado 1",
    modules: ['gramatica','espiritual']
  },
  adv2: {
    title: "⭐ Avançado 2",
    modules: ['textos']
  }
};

let currentLevel = null;

function showLevel(level) {
  currentLevel = level;
  document.getElementById('course-home').style.display = 'none';
  document.getElementById('level-display').style.display = 'block';
  document.getElementById('lesson-display').style.display = 'none';
  document.getElementById('level-title').textContent = LEVELS[level].title;

  const grid = document.getElementById('modules-grid');
  grid.innerHTML = '';
  LEVELS[level].modules.forEach(modKey => {
    const mod = VOCAB[modKey];
    if (!mod) return;
    const btn = document.createElement('div');
    btn.className = 'module-btn';
    btn.innerHTML = `
      <span class="mod-icon">${mod.name.split(' ')[0]}</span>
      <span class="mod-name">${mod.name.replace(/^[^\s]+\s/, '')}</span>
      <span class="mod-count">${mod.words.length} palavras</span>
    `;
    btn.onclick = () => showLesson(modKey);
    grid.appendChild(btn);
  });
}

function backToCourse() {
  document.getElementById('course-home').style.display = 'block';
  document.getElementById('level-display').style.display = 'none';
  document.getElementById('lesson-display').style.display = 'none';
}

function backToLevel() {
  document.getElementById('level-display').style.display = 'block';
  document.getElementById('lesson-display').style.display = 'none';
}

function showLesson(modKey) {
  const mod = VOCAB[modKey];
  document.getElementById('level-display').style.display = 'none';
  document.getElementById('lesson-display').style.display = 'block';
  document.getElementById('lesson-title').textContent = mod.name;

  const list = document.getElementById('vocab-list');
  list.innerHTML = mod.words.map((w, i) => `
    <div class="vocab-card">
      <div class="vocab-main">
        <div class="vocab-word">${w.g}</div>
        <div class="vocab-pron">/${w.ph}/</div>
        <div class="vocab-pt">🇧🇷 ${w.pt}</div>
        ${w.ex ? `<div class="vocab-example">💬 ${w.ex}</div>` : ''}
        ${w.note ? `<div class="vocab-note">📌 ${w.note}</div>` : ''}
      </div>
      <button class="tts-btn" onclick="speakGuajajara('${w.g.replace(/'/g,"\\'")}','${(w.ph||w.g).replace(/'/g,"\\'")}')" title="Ouvir pronúncia">🔊</button>
    </div>
  `).join('');
}

// ─── DICTIONARY ───────────────────────────────────────────────────────────────
let allWords = [];

function initDict() {
  allWords = [];
  for (const [cat, mod] of Object.entries(VOCAB)) {
    if (!mod.words) continue;
    mod.words.forEach(w => allWords.push({ ...w, cat: mod.name, catKey: cat }));
  }
  renderDict(allWords.slice(0, 40));
}

function renderDict(words) {
  const el = document.getElementById('dict-results');
  if (!el) return;
  if (words.length === 0) {
    el.innerHTML = '<div style="text-align:center;color:var(--clay);padding:1rem">Nenhum resultado encontrado</div>';
    return;
  }
  el.innerHTML = words.map(w => `
    <div class="dict-entry" onclick="speakGuajajara('${w.g.replace(/'/g,"\\'")}','${(w.ph||w.g).replace(/'/g,"\\'")}')">
      <div class="dict-gua">${w.g} <span style="font-size:.8rem;color:var(--clay)">🔊</span></div>
      <div class="dict-pt">${w.pt}</div>
      ${w.ph ? `<div style="font-size:.8rem;font-style:italic;color:var(--clay)">/${w.ph}/</div>` : ''}
      <div class="dict-cat">${w.cat}</div>
    </div>
  `).join('');
}

function searchDict(q) {
  if (!q.trim()) { renderDict(allWords.slice(0, 40)); return; }
  const lq = q.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  const results = allWords.filter(w => {
    const g = (w.g||'').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    const p = (w.pt||'').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    return g.includes(lq) || p.includes(lq);
  });
  renderDict(results);
}

function filterDict(type) {
  if (type === 'all') { renderDict(allWords.slice(0, 40)); return; }
  const map = { substantivo: ['casa','natureza','animais','alimentos','corpo'], verbo: ['verbos'], expressao: ['saudacoes','conversacao'] };
  const cats = map[type] || [];
  const results = allWords.filter(w => cats.includes(w.catKey));
  renderDict(results);
}

// ─── QUIZ ENGINE ──────────────────────────────────────────────────────────────
let quizState = { words: [], idx: 0, score: 0, answered: false };

function startQuiz(modKey) {
  const mod = VOCAB[modKey];
  if (!mod) return;
  let pool = [...mod.words].filter(w => w.g && w.pt);
  if (pool.length < 4) pool = [...pool, ...allWords.filter(w => w.catKey !== modKey)].slice(0, 10);
  pool = shuffle(pool);
  quizState = { words: pool.slice(0, 10), idx: 0, score: 0, answered: false };
  document.getElementById('quiz-setup').style.display = 'none';
  document.getElementById('quiz-active').style.display = 'block';
  document.getElementById('quiz-result').style.display = 'none';
  renderQuizQ();
}

function renderQuizQ() {
  const { words, idx } = quizState;
  if (idx >= words.length) { showQuizResult(); return; }
  const w = words[idx];
  const pct = (idx / words.length) * 100;
  document.getElementById('quiz-bar').style.width = pct + '%';
  document.getElementById('quiz-counter').textContent = `${idx + 1} / ${words.length}`;
  document.getElementById('quiz-q').textContent = `O que significa "${w.g}"?`;
  document.getElementById('quiz-feedback').innerHTML = '';

  // Wrong options
  const wrongs = shuffle(allWords.filter(x => x.pt !== w.pt && x.pt)).slice(0, 3).map(x => x.pt);
  const opts = shuffle([w.pt, ...wrongs]);

  const optsEl = document.getElementById('quiz-opts');
  optsEl.innerHTML = opts.map((o, i) => `
    <button class="quiz-opt" onclick="answerQuiz(this, '${o.replace(/'/g,"\\'")}', '${w.pt.replace(/'/g,"\\'")}')">${o}</button>
  `).join('');
  quizState.answered = false;
}

function answerQuiz(el, chosen, correct) {
  if (quizState.answered) return;
  quizState.answered = true;
  const opts = document.querySelectorAll('.quiz-opt');
  opts.forEach(o => {
    if (o.textContent === correct) o.classList.add('correct');
    else if (o === el && chosen !== correct) o.classList.add('wrong');
    o.disabled = true;
  });
  const fb = document.getElementById('quiz-feedback');
  if (chosen === correct) {
    quizState.score++;
    fb.innerHTML = '<span style="color:var(--lime);font-size:1.1rem">✅ Correto! Ara ara!</span>';
    speakGuajajara(quizState.words[quizState.idx].g, quizState.words[quizState.idx].ph);
  } else {
    fb.innerHTML = `<span style="color:#ff9977;font-size:1rem">❌ Era: <strong style="color:var(--sun)">${correct}</strong></span>`;
  }
  setTimeout(() => { quizState.idx++; renderQuizQ(); }, 1800);
}

function showQuizResult() {
  document.getElementById('quiz-active').style.display = 'none';
  document.getElementById('quiz-result').style.display = 'block';
  const s = quizState.score, t = quizState.words.length;
  const pct = s / t;
  document.getElementById('quiz-score-text').textContent = `${s} / ${t}`;
  document.getElementById('quiz-emoji').textContent = pct >= .8 ? '🎉' : pct >= .5 ? '🌿' : '🌱';
  document.getElementById('quiz-score-msg').textContent =
    pct >= .8 ? 'Excelente! Você está dominando o Guajajara!' :
    pct >= .5 ? 'Bom progresso! Continue praticando, memihar!' :
    'Continue tentando! A língua se aprende com paciência. 🌱';
  if (pct >= .8) arawySpeak('quiz_good');
  else arawySpeak('quiz_bad');
}

function resetQuiz() {
  document.getElementById('quiz-setup').style.display = 'block';
  document.getElementById('quiz-result').style.display = 'none';
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── SERVICE WORKER REGISTER ──────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
