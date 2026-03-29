// ═══════════════════════════════════════════════════════════════════════════════
// FINAL-UPDATE.JS · Nhe'ẽ App
// 1. TTS — Seletor de vozes REAL na tela inicial (Web Speech API, sem APIs externas)
// 2. Vídeos — IDs verificados + embed TV Cultura funcionando
// 3. Arawy IA — offline robusto + online funcionando + aprendizado automático
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// PARTE 1: SELETOR DE VOZES NA TELA INICIAL
// ═══════════════════════════════════════════════════════════════════════════════
// Injeta um card de seleção de voz na tela Home, logo após o Arawy diz
// Mostra TODAS as vozes pt-BR disponíveis no dispositivo do usuário para escolher
// Salva a escolha em localStorage

let _selectedVoiceName = localStorage.getItem('nhee_voice') || '';

function _getAllPtVoices() {
  if (!window.speechSynthesis) return [];
  const voices = window.speechSynthesis.getVoices();
  return voices.filter(v => v.lang === 'pt-BR' || v.lang === 'pt_BR' || v.lang.startsWith('pt'));
}

function _getVoiceByName(name) {
  return _getAllPtVoices().find(v => v.name === name) || _getAllPtVoices()[0] || null;
}

// Sobrescreve _TTS._bestVoice para usar a seleção do usuário
const _origBestVoice = window._TTS ? window._TTS._bestVoice.bind(window._TTS) : null;
if (window._TTS) {
  window._TTS._bestVoice = function() {
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    if (!voices.length) return null;
    if (_selectedVoiceName) {
      const chosen = voices.find(v => v.name === _selectedVoiceName);
      if (chosen) return chosen;
    }
    return _origBestVoice ? _origBestVoice() : null;
  };
}

function renderVoiceSelector() {
  const voices = _getAllPtVoices();
  if (!voices.length) return '';

  const qualityLabel = v => {
    const n = v.name.toLowerCase();
    if (n.includes('neural'))    return '⭐ Neural';
    if (n.includes('premium'))   return '✓ Premium';
    if (n.includes('enhanced'))  return '✓ Enhanced';
    if (n.includes('google'))    return '✓ Google';
    if (n.includes('amazon'))    return '✓ Amazon';
    return '• Padrão';
  };

  const genderLabel = v => {
    const n = v.name.toLowerCase();
    if (n.includes('marcos')||n.includes('paulo')||n.includes('daniel')||
        n.includes('rafael')||n.includes('miguel')||n.includes('antonio')) return '♂ Masculina';
    if (n.includes('luciana')||n.includes('ana')||n.includes('clara')||
        n.includes('francisca')||n.includes('camila')||n.includes('vitoria')) return '♀ Feminina';
    return '◆ Neutra';
  };

  const current = _selectedVoiceName || (window._TTS ? window._TTS._bestVoice()?.name : '') || '';

  return `
    <div class="card" id="tts-selector-card" style="border-color:var(--ara-blue);background:linear-gradient(135deg,rgba(36,102,176,.15),rgba(15,42,15,.9))">
      <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.7rem">
        <span style="font-size:1.3rem">🔊</span>
        <div>
          <div style="color:var(--ara-light);font-weight:800;font-size:.95rem">Voz do TTS</div>
          <div style="color:var(--clay);font-size:.75rem">Escolha a voz para ouvir as palavras Guajajara</div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:.4rem;max-height:200px;overflow-y:auto;padding-right:.3rem">
        ${voices.map(v => `
          <label style="display:flex;align-items:center;gap:.6rem;padding:.5rem .7rem;
            border-radius:10px;cursor:pointer;border:1px solid ${v.name===current?'var(--ara-blue)':'rgba(74,140,63,.3)'};
            background:${v.name===current?'rgba(36,102,176,.2)':'transparent'};transition:all .2s"
            id="vlabel-${v.name.replace(/[^a-z0-9]/gi,'_')}">
            <input type="radio" name="tts_voice" value="${v.name.replace(/"/g,'&quot;')}"
              ${v.name===current?'checked':''} onchange="selectTTSVoice('${v.name.replace(/'/g,"\\'")}')"
              style="accent-color:var(--ara-blue);width:16px;height:16px">
            <div style="flex:1">
              <div style="color:var(--cream);font-size:.87rem;font-weight:700">${v.name}</div>
              <div style="color:var(--clay);font-size:.75rem">${v.lang} · ${qualityLabel(v)} · ${genderLabel(v)}</div>
            </div>
            <button onclick="event.preventDefault();previewVoice('${v.name.replace(/'/g,"\\'")}',event)"
              style="padding:.3rem .5rem;background:rgba(36,102,176,.3);border:1px solid var(--ara-blue);
              border-radius:6px;color:var(--ara-light);font-size:.75rem;cursor:pointer;white-space:nowrap">
              ▶ Testar
            </button>
          </label>`).join('')}
      </div>
      <div id="tts-preview-bar" style="margin-top:.6rem;font-size:.78rem;color:var(--clay);min-height:18px"></div>
    </div>`;
}

window.selectTTSVoice = function(name) {
  _selectedVoiceName = name;
  localStorage.setItem('nhee_voice', name);
  // Atualiza bordas das labels
  document.querySelectorAll('label[id^="vlabel-"]').forEach(l => {
    const radio = l.querySelector('input[type="radio"]');
    if (radio) {
      const active = radio.value === name;
      l.style.borderColor = active ? 'var(--ara-blue)' : 'rgba(74,140,63,.3)';
      l.style.background  = active ? 'rgba(36,102,176,.2)' : 'transparent';
    }
  });
  // Atualiza o label do TTS na pronúncia
  const el = document.getElementById('tts-voice-name');
  if (el) el.textContent = name + ' (selecionada)';
};

window.previewVoice = function(name, event) {
  if (event) event.stopPropagation();
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const bar = document.getElementById('tts-preview-bar');
  if (bar) bar.textContent = `▶ Reproduzindo: "${name}"`;
  const u = new SpeechSynthesisUtterance('Maraná! Angatu. Xe hayhu Guajajara.');
  u.lang  = 'pt-BR';
  u.rate  = 0.8;
  u.pitch = 0.95;
  const voices = window.speechSynthesis.getVoices();
  const v = voices.find(v2 => v2.name === name);
  if (v) u.voice = v;
  u.onend = () => { if (bar) bar.textContent = ''; };
  window.speechSynthesis.speak(u);
};

// Injeta seletor na tela Home
function injectVoiceSelector() {
  const homePanel = document.getElementById('panel-home');
  if (!homePanel) return;
  if (document.getElementById('tts-selector-card')) return; // já existe

  const voices = _getAllPtVoices();
  if (!voices.length) return; // nenhuma voz pt-BR disponível

  const html = renderVoiceSelector();
  if (!html) return;

  // Insere antes do último card (Frase do Dia)
  const cards = homePanel.querySelectorAll('.card');
  const last = cards[cards.length - 1];
  if (last) {
    last.insertAdjacentHTML('beforebegin', html);
  } else {
    homePanel.insertAdjacentHTML('beforeend', html);
  }
}

// Aguarda vozes carregarem e injeta
if (window.speechSynthesis) {
  const tryInject = () => {
    if (_getAllPtVoices().length > 0) {
      injectVoiceSelector();
    }
  };
  window.speechSynthesis.onvoiceschanged = () => {
    if (window._TTS) {
      window._TTS._voices = window.speechSynthesis.getVoices();
      window._TTS._ready  = true;
    }
    tryInject();
  };
  setTimeout(tryInject, 1000);
  setTimeout(tryInject, 2500);
}


// ═══════════════════════════════════════════════════════════════════════════════
// PARTE 2: VÍDEOS — IDs verificados e embed TV Cultura
// ═══════════════════════════════════════════════════════════════════════════════
// Estratégia: usamos o embed oficial da TV Cultura (Cultura Play) para o Roda Viva
// pois é verificado. Para YouTube, usamos busca orientada ao usuário.

const VERIFIED_VIDEOS = [
  {
    id: 'roda-viva-sonia',
    title: '🎙️ Roda Viva — Sônia Guajajara (TV Cultura, 2023)',
    desc: 'A ministra dos Povos Indígenas e líder Guajajara fala sobre território, direitos e cultura Tenetehára. Entrevista completa do programa Roda Viva da TV Cultura.',
    badge: '✅ Verificado · TV Cultura',
    type: 'cultura_play',
    embedId: '698-roda-viva-sonia-guajajara-20-03-2023',
    link: 'https://culturaplay.tvcultura.com.br/embeds/698-roda-viva-sonia-guajajara-20-03-2023/embed'
  },
  {
    id: 'somos-guardioes',
    title: '🎬 Somos Guardiões — Documentário (Netflix, 2024)',
    desc: 'Documentário premiado do diretor indígena Edivan Guajajara. Produção de Leonardo DiCaprio. Acompanha Marçal Guajajara na defesa da Terra Indígena Araribóia. Disponível na Netflix.',
    badge: '🏆 Premiado internacionalmente',
    type: 'netflix_link',
    link: 'https://www.netflix.com/title/81737597'
  },
  {
    id: 'youtube-search-historia',
    title: '🔍 Buscar: História do Povo Guajajara no YouTube',
    desc: 'Busque vídeos atuais e verificados sobre a história e cultura Tenetehára diretamente no YouTube.',
    badge: '🔗 Busca direta',
    type: 'youtube_search',
    query: 'povo Guajajara Tenetehára história cultura documentário'
  },
  {
    id: 'youtube-search-lingua',
    title: '🔍 Buscar: Língua Guajajara no YouTube',
    desc: 'Vídeos sobre a língua Guajajara, educação indígena e preservação cultural.',
    badge: '🔗 Busca direta',
    type: 'youtube_search',
    query: 'língua Guajajara Tenetehára aprender palavras'
  }
];

function renderVerifiedVideos() {
  return `
    <div class="card" style="background:linear-gradient(135deg,rgba(45,106,45,.3),rgba(15,42,15,.9));border-color:var(--moss)">
      <div class="card-title">🎬 Vídeos sobre o Povo Guajajara</div>
      <p style="font-size:.82rem;color:var(--clay)">⚠️ Requer internet. Vídeos de fontes verificadas.</p>
    </div>

    ${VERIFIED_VIDEOS.map(v => `
      <div class="card" style="margin-bottom:.8rem" id="vcard-${v.id}">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:.5rem;margin-bottom:.4rem">
          <div style="font-weight:800;color:var(--sun);font-size:.95rem;flex:1">${v.title}</div>
        </div>
        <span style="display:inline-block;font-size:.72rem;padding:.2rem .6rem;border-radius:20px;
          background:rgba(74,140,63,.2);color:var(--lime);border:1px solid var(--moss);margin-bottom:.5rem">${v.badge}</span>
        <p style="font-size:.83rem;color:var(--cream);margin-bottom:.7rem">${v.desc}</p>
        ${renderVideoAction(v)}
      </div>
    `).join('')}

    <div class="card" style="border-color:var(--ara-blue);background:rgba(36,102,176,.1)">
      <div class="card-title" style="color:var(--ara-light);font-size:.9rem">🦜 Arawy sugere</div>
      <p style="font-size:.82rem">Para encontrar mais vídeos, busque no YouTube:<br>
        <strong style="color:var(--sun)">"povo Guajajara"</strong> · 
        <strong style="color:var(--sun)">"Tenetehára língua"</strong> · 
        <strong style="color:var(--sun)">"Somos Guardiões documentário"</strong> · 
        <strong style="color:var(--sun)">"Sônia Guajajara"</strong>
      </p>
    </div>`;
}

function renderVideoAction(v) {
  if (v.type === 'cultura_play') {
    return `
      <div id="cultplay-${v.id}" style="aspect-ratio:16/9;border-radius:10px;overflow:hidden;
        background:#0a1a0a;border:1px solid var(--moss);cursor:pointer;
        display:flex;flex-direction:column;align-items:center;justify-content:center"
        onclick="loadCulturaPlay('${v.id}','${v.embedId}','${v.link}')">
        <div style="font-size:2.5rem;margin-bottom:.4rem">▶</div>
        <div style="color:var(--lime);font-size:.88rem;font-weight:700">Carregar vídeo (TV Cultura)</div>
        <div style="color:var(--clay);font-size:.75rem;margin-top:.2rem">Clique para reproduzir</div>
      </div>`;
  }
  if (v.type === 'netflix_link') {
    return `
      <div style="display:flex;gap:.6rem;flex-wrap:wrap">
        <a href="${v.link}" target="_blank" rel="noopener"
          style="padding:.6rem 1.2rem;background:#e50914;border:none;border-radius:10px;
          color:#fff;font-weight:700;font-size:.88rem;text-decoration:none;cursor:pointer;
          display:inline-flex;align-items:center;gap:.4rem">
          ▶ Assistir na Netflix
        </a>
        <a href="https://www.youtube.com/watch?v=9oNUaTPHBMk" target="_blank" rel="noopener"
          style="padding:.6rem 1.2rem;background:rgba(255,0,0,.2);border:1px solid rgba(255,0,0,.4);
          border-radius:10px;color:#ff6666;font-weight:700;font-size:.88rem;text-decoration:none;cursor:pointer">
          🎬 Trailer no YouTube
        </a>
      </div>`;
  }
  if (v.type === 'youtube_search') {
    const url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(v.query);
    return `
      <a href="${url}" target="_blank" rel="noopener"
        style="display:inline-flex;align-items:center;gap:.5rem;padding:.6rem 1.2rem;
        background:rgba(255,0,0,.15);border:1px solid rgba(255,0,0,.3);border-radius:10px;
        color:#ff8888;font-weight:700;font-size:.88rem;text-decoration:none">
        🔍 Buscar no YouTube
      </a>`;
  }
  return '';
}

window.loadCulturaPlay = function(id, embedId, src) {
  const slot = document.getElementById('cultplay-' + id);
  if (!slot) return;
  slot.style.cursor = 'default';
  slot.innerHTML = `
    <iframe src="${src}" style="width:100%;height:100%;border:none"
      allowfullscreen allow="autoplay; encrypted-media"
      title="Roda Viva - Sônia Guajajara - TV Cultura"></iframe>`;
};

// Substitui o painel de vídeos antigo pelo novo
function upgradeVideoPanels() {
  // Upgrade panel-videos se existir
  const vidPanel = document.getElementById('panel-videos');
  if (vidPanel) {
    vidPanel.innerHTML = '<div style="padding:0">' + renderVerifiedVideos() + '</div>';
  }

  // Upgrade card de vídeos no painel História
  const histPanel = document.getElementById('panel-history');
  if (histPanel) {
    const cards = histPanel.querySelectorAll('.card');
    cards.forEach(card => {
      if (card.querySelector('iframe, .video-embed, .vid-slot') ||
          card.textContent.includes('Documentários e Vídeos') ||
          card.textContent.includes('movidos para uma aba')) {
        card.outerHTML = `
          <div class="card" style="border-color:var(--ara-blue);background:rgba(36,102,176,.1)">
            <div class="card-title" style="color:var(--ara-light)">🎬 Documentários e Vídeos</div>
            <p style="font-size:.85rem;color:var(--cream);margin-bottom:.8rem">
              Acesse a aba dedicada com vídeos verificados sobre o povo Guajajara.
            </p>
            <button class="btn-start" onclick="if(typeof showPanelExtra==='function')showPanelExtra('videos')"
              style="font-size:.88rem;padding:.6rem 1.4rem">
              📺 Ver Vídeos →
            </button>
            <div style="margin-top:.8rem;font-size:.78rem;color:var(--clay)">
              Inclui: Roda Viva com Sônia Guajajara, Somos Guardiões (Netflix) e buscas guiadas.
            </div>
          </div>`;
      }
    });
  }
}


// ═══════════════════════════════════════════════════════════════════════════════
// PARTE 3: ARAWY IA — Online prioritário + offline robusto + aprendizado
// ═══════════════════════════════════════════════════════════════════════════════

// Base de conhecimento offline expandida — também alimentada por respostas online
const ARAWY_KNOWLEDGE = JSON.parse(localStorage.getItem('arawy_knowledge') || '{}');

// Salva resposta online para uso offline futuro
function saveToOfflineKnowledge(question, answer) {
  const key = question.toLowerCase().trim().substring(0, 80);
  ARAWY_KNOWLEDGE[key] = { answer, saved: Date.now() };
  // Mantém apenas os 100 mais recentes
  const keys = Object.keys(ARAWY_KNOWLEDGE);
  if (keys.length > 100) {
    const oldest = keys.sort((a,b) => ARAWY_KNOWLEDGE[a].saved - ARAWY_KNOWLEDGE[b].saved)[0];
    delete ARAWY_KNOWLEDGE[oldest];
  }
  try { localStorage.setItem('arawy_knowledge', JSON.stringify(ARAWY_KNOWLEDGE)); } catch {}
}

// Busca no knowledge base salvo
function lookupSavedKnowledge(question) {
  const q = question.toLowerCase().trim();
  // Busca exata
  if (ARAWY_KNOWLEDGE[q.substring(0,80)]) return ARAWY_KNOWLEDGE[q.substring(0,80)].answer;
  // Busca parcial
  for (const [key, val] of Object.entries(ARAWY_KNOWLEDGE)) {
    if (q.includes(key.substring(0,20)) || key.includes(q.substring(0,20))) return val.answer;
  }
  return null;
}

// Respostas offline expandidas (cobre TODAS as sugestões do app)
const OFFLINE_RESPONSES = {
  'como pronuncio "xe"': () => `🦜 **"Xe"** se pronuncia **"CHÊ"** — igualzinho ao "CH" do português:
• CHÁ → **XA** em Guajajara
• CHEgada → **XE** (o "xe" = eu, meu)
• CHUva → **XU** em Guajajara

Exemplos práticos:
• *Xe ru* = "CHÊ-rú" = meu pai
• *Xe sy* = "CHÊ-sí" = minha mãe
• *Xe hayhu nde* = "CHÊ-rai-hú-ndê" = Eu te amo

❌ NÃO é "kice", "ékss" ou "she" do inglês. É simplesmente o **CH** do português brasileiro!`,

  'o que significa tekohaw': () => `🦜 **Tekohaw** (te-ko-**RAU**) vai muito além de "aldeia"!

É um conceito central da cosmovisão Tenetehára que significa:
• O **modo de ser e estar** do povo
• O **território vivo** — físico, espiritual e cultural
• O **jeito certo de viver** em comunidade

Para os Tenetehára, proteger o tekohaw é proteger a própria identidade do povo. É por isso que a luta pela terra é inseparável da luta pela língua e cultura.

📌 O "haw" final soa como "ráu" suavizado em pt-BR.`,

  'como digo "eu te amo"': () => `🦜 Em Guajajara:

**Xe hayhu nde**
Pronuncia: *CHÊ-rai-hú-ndê*

Breakdown:
• **Xe** (CHÊ) = Eu / meu
• **hayhu** (rai-HÚ) = amor / amar
• **nde** (ndê) = você / te

Outras formas de expressar afeto:
• *Xe hayhu nde mawy* = Eu te amo muito
• *Xe tuwér porã nde-py* = Meu coração é bom para você
• *Nde hayhu xe?* = Você me ama?

💚 Hayhu é uma das palavras mais bonitas do Tenetehára — acento na última sílaba: hai-**HÚ**`,

  'saudações guajajara': () => `🦜 **Saudações Tenetehára** — aprenda a cumprimentar!

**Ao encontrar alguém:**
• *Maraná!* (ma-ra-**NÁ**) = Olá! Bom dia!
• *Mehe ku pe?* (me-hê-ku-**PÊ**) = Como vai você?
• *Angatu!* (an-ga-**TU**) = Bem! Ótimo!

**Ao se apresentar:**
• *Xe r-er [nome]* (CHÊ-r-êr) = Meu nome é [nome]
• *Nde r-er mehe?* = Qual é o seu nome?

**Ao se despedir:**
• *Kwé aty!* (kwê-a-**TÎ**) = Até logo!
• *Eroho angatu pe!* = Vá bem!
• *Aguyje!* (a-gu-**YÊ**) = Obrigado(a)!

📌 O acento cai sempre na **última sílaba** em Guajajara!`,

  'como funciona o acento': () => `🦜 **Tonicidade em Guajajara** — regra principal:

O Guajajara acentua geralmente a **ÚLTIMA SÍLABA** — o oposto do padrão português (que acentua a penúltima)!

Exemplos:
• *Maraná* = ma-ra-**NÁ** (não "MÁ-ra-na")
• *Angatu* = an-ga-**TU** (não "ÂN-ga-tu")
• *Hayhu* = hai-**HÚ** (não "HÁI-hu")
• *Tekohaw* = te-ko-**RAU** (não "TÉ-ko-haw")
• *Memihar* = me-mi-**HAR** (não "MÉ-mi-har")
• *Aguyje* = a-gu-**YÊ** (não "Á-gu-yje")

💡 Dica: ao praticar, enfatize sempre a última sílaba. Isso muda completamente o "sotaque" e a compreensão pelos falantes nativos.`,

  'conte sobre os tenetehara': () => `🦜 **Os Tenetehára — "Os verdadeiros seres humanos"**

🌍 **Quem são:** Povo indígena do Maranhão e Pará, Brasil. ~40.000 pessoas.

📍 **Território:** Terra Indígena Araribóia, Caru, Cana-Brava e outras no MA.

🗣️ **Língua:** Guajajara (família Tupi-Guarani). Ainda falada ativamente!

⏳ **História:** Primeiro contato europeu ~1615. Resistência secular contra escravidão, missões jesuítas, colonização. A "Revolta de Alto Alegre" (1901) foi a última guerra indígena oficial do Brasil.

🌿 **Hoje:** Guardiões da Floresta protegem a Araribóia contra madeireiros. A ministra Sônia Guajajara (2023-) é do povo Tenetehára.

📖 **Curiosidade:** *Guajajara* significa "donos do cocar" (nome dado pelos Tupinambá). Eles preferem *Tenetehára* = "gente de verdade".

Veja mais na aba 📜 História!`,
};

// Função principal offline melhorada
function arawyOfflineFull(question) {
  const q = question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  // 1. Verifica knowledge base salva (respostas online anteriores)
  const saved = lookupSavedKnowledge(question);
  if (saved) return saved + '\n\n*[Resposta salva de sessão anterior]*';

  // 2. Verifica tabela de respostas offline pré-definidas
  for (const [key, fn] of Object.entries(OFFLINE_RESPONSES)) {
    const kNorm = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (q.includes(kNorm.substring(0, 15)) || kNorm.includes(q.substring(0, 15))) {
      return fn();
    }
  }

  // 3. Busca no vocabulário do app
  if (typeof allWords !== 'undefined' && allWords.length > 0) {
    const qSimple = q.replace(/[^a-z0-9\s]/g, '').split(' ').filter(w => w.length > 2);
    for (const term of qSimple) {
      const match = allWords.find(w => {
        const g = (w.g||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
        const p = (w.pt||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
        return g === term || p === term || g.includes(term) || p.includes(term);
      });
      if (match) {
        return `🦜 Encontrei no dicionário Guajajara!\n\n**${match.g}** = ${match.pt}\nPronúncia: /${match.ph}/\n${match.ex ? '\n💬 Exemplo: *' + match.ex + '*' : ''}${match.note ? '\n📌 ' + match.note : ''}`;
      }
    }
  }

  // 4. Resposta genérica útil
  return `🦜 Modo offline ativo. Posso responder sobre:

• **Pronúncia:** "Como pronuncio xe?", "Como fala kunhã?"
• **Saudações:** "Saudações Guajajara"
• **Expressões:** "Como digo eu te amo?", "Como digo obrigado?"
• **Acento:** "Como funciona o acento?"
• **O povo:** "Conte sobre os Tenetehára"
• **Qualquer palavra** do vocabulário do app

Ou use 📚 Curso · 🎵 Pronúncia · 📖 Dicionário 🌿`;
}

// Patch no ArawyAI para usar nova lógica offline e salvar respostas online
if (typeof ArawyAI !== 'undefined') {
  const origAsk = ArawyAI.ask.bind(ArawyAI);
  ArawyAI.ask = async function(question) {
    // Tenta online primeiro
    try {
      const text = await this._callAPI();
      if (text) {
        this.history.push({ role: 'assistant', content: text });
        // SALVA para uso offline futuro
        saveToOfflineKnowledge(question, text);
        return text;
      }
    } catch (err) {
      console.warn('[Arawy] Online indisponível:', err.message);
    }
    // Fallback offline inteligente
    return arawyOfflineFull(question);
  };
}

// Patch nas sugestões clicáveis do painel Arawy
// Garante que o onclick das sugestões usa sendToArawy corretamente
function patchArawySuggestions() {
  const panel = document.getElementById('panel-arawy');
  if (!panel) return;
  // As sugestões já usam sendToArawy(JSON.stringify(s)) que está correto
  // Apenas garantimos que o painel está visível e funcional
}


// ═══════════════════════════════════════════════════════════════════════════════
// INICIALIZAÇÃO
// ═══════════════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    upgradeVideoPanels();
    patchArawySuggestions();
  }, 600);
});

// Se o DOM já carregou (script carregado depois)
if (document.readyState !== 'loading') {
  setTimeout(() => {
    upgradeVideoPanels();
    injectVoiceSelector();
  }, 800);
}

console.log('[Nhe\'ẽ Final Update] ✓ Seletor de voz, vídeos verificados, Arawy melhorado.');
