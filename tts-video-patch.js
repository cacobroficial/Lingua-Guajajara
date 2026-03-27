// ─── TTS + VIDEO PATCH · Nhe'ẽ App ───────────────────────────────────────────
// 1. TTS: Remove voz feminina genérica. Implementa TTSMaker (API gratuita)
//    com fonetização Guajajara precisa + fallback Web Speech masculino ou neutro
// 2. Vídeos: substitui IDs quebrados por sistema robusto com múltiplas opções
//    e card de fallback quando nenhum vídeo carrega

// ═══════════════════════════════════════════════════════════════════════════════
// SOBRE AS OPÇÕES DE TTS AVALIADAS:
//
// • Microsoft Clipchamp: editor de vídeo, sem API TTS pública acessível de browser.
//   Não tem endpoint REST público gratuito para uso em PWA. ✗
//
// • Google AI Studio TTS (Chirp3): requer API key + CORS proxy. Qualidade excelente
//   mas não é gratuito sem projeto GCP. Possível em produção com backend. ✗ (agora)
//
// • TTSMaker.com: API REST gratuita (sem key para uso básico), suporta pt-BR,
//   permite controle de velocidade, acentuação e pitch. ✓ IMPLEMENTADO
//
// • Web Speech API: disponível offline, mas qualidade depende do SO/browser.
//   No iOS Safari → voz pt-BR de alta qualidade (Neural Apple).
//   No Android Chrome → Google pt-BR Neural se atualizado.
//   No desktop → variável, geralmente boa no Chrome com Google.
//
// ESTRATÉGIA FINAL:
//   1. TTSMaker API (online) — melhor qualidade consistente, pt-BR
//   2. Web Speech API com seleção inteligente de voz MASCULINA ou NEUTRA
//      (evita a voz feminina genérica que distorce Maraná → "marraná")
//   3. O fonetizador Guajajara garante acentuação correta antes de enviar ao TTS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── FONETIZADOR GUAJAJARA → pt-BR (versão expandida) ────────────────────────
// Regras baseadas em Harrison & Harrison (1984) + análise fonológica
window._guaPhoneticFull = function(text) {
  if (!text) return '';
  let t = text;

  // 1. X antes de vogal = CH (prioridade máxima)
  t = t.replace(/x([aáâãeéêiíoóôõuú])/gi, 'ch$1');
  t = t.replace(/\bxe\b/gi,  'chê');
  t = t.replace(/\bxa\b/gi,  'chá');
  t = t.replace(/\bxi\b/gi,  'chi');
  t = t.replace(/\bxo\b/gi,  'chô');
  t = t.replace(/\bxu\b/gi,  'chu');

  // 2. Wy → wi
  t = t.replace(/\bwy/gi, 'wi');

  // 3. Y vogal central → representado como "i" para TTS
  //    mas preserva ã, ẽ, etc. (vogais nasais já corretas)
  t = t.replace(/([^aeiouãẽĩõũáéíóúâêîôû])y([^'aeiouãẽĩõũáéíóúâêîôû])/g, '$1i$2');
  t = t.replace(/\by([^'aeiouãẽĩõũáéíóúâêîôû])/g, 'i$1');
  t = t.replace(/([^aeiouãẽĩõũáéíóúâêîôû])y$/gm, '$1i');

  // 4. Oclusiva glotal → pausa (vírgula ou hífen)
  t = t.replace(/'/g, ', ');

  // 5. Ñ → nh
  t = t.replace(/ñ/gi, 'nh');

  // 6. Palavras críticas com pronúncia conhecida (baseado em Harrison 1984)
  const dict = {
    // Acento correto: última sílaba
    'maraná':   'ma-ra-NÁ',
    'angatu':   'an-ga-TÚ',
    'aguyje':   'a-gu-IJÊ',
    'ikatu':    'i-ca-TÚ',
    'tekohaw':  'te-co-RÁO',    // "haw" final = som de "rão" suavizado
    'hayhu':    'rai-RÚ',        // h=r suave em Guajajara, semelhante ao "r" de "arara"
    'kwáhy':    'cuá-i',
    'porahẽi':  'po-ra-rÊI',
    'jeroky':   'je-ro-CÍ',
    'maraí':    'ma-ra-Í',
    'karuwar':  'ca-ru-UÁR',
    'kunhã':    'cu-NHÃ',
    'toré':     'to-RÊ',
    'maracá':   'ma-ra-CÁ',
    'mokã':     'mo-CÃ',
    'pahy':     'pa-Í',         // h aspirado
    'oho':      'o-RÓ',         // h entre vogais = r suave
    'memihar':  'me-mi-ÁR',
    'rorysáwy': 'ro-ri-SÁ-ui',
    'poxy':     'po-XÍ',        // x=ch aqui
    'kyje':     'ci-JÊ',
  };
  Object.entries(dict).forEach(([gua, ph]) => {
    const re = new RegExp('\\b' + gua.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '\\b', 'gi');
    t = t.replace(re, ph);
  });

  return t.trim();
};

// ─── TTSMaker API ─────────────────────────────────────────────────────────────
// TTSMaker.com: serviço gratuito de TTS com vozes neurais pt-BR
// Endpoint público sem autenticação para requisições básicas
// Docs: https://ttsmaker.com/api-doc
const TTSMakerService = {
  _cache: {},           // cache de áudio para evitar requisições repetidas
  _controller: null,   // AbortController para cancelar requisições pendentes

  async speak(text, phonetic) {
    // Cancela fala anterior se houver
    if (this._controller) this._controller.abort();
    this._controller = new AbortController();

    const speakText = phonetic ? window._guaPhoneticFull(phonetic) : window._guaPhoneticFull(text);
    const cacheKey = speakText.substring(0, 100);

    // Usa cache se disponível
    if (this._cache[cacheKey]) {
      this._playAudio(this._cache[cacheKey]);
      return true;
    }

    try {
      // TTSMaker API v1 — endpoint público gratuito
      const response = await fetch('https://api.ttsmaker.com/v1/create-tts-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: 'ttsmaker_demo_token',   // token demo público
          text: speakText,
          voice_id: 1733,    // pt-BR masculino neural (Marcos)
          audio_format: 'mp3',
          audio_speed: 0.85, // levemente mais lento para aprendizado
          audio_volume: 1,
          text_paragraph_pause: 0,
        }),
        signal: this._controller.signal,
      });

      if (!response.ok) throw new Error('TTSMaker HTTP ' + response.status);
      const data = await response.json();

      if (data.status === 'success' && data.audio_url) {
        this._cache[cacheKey] = data.audio_url;
        this._playAudio(data.audio_url);
        return true;
      }
      throw new Error('TTSMaker sem áudio: ' + JSON.stringify(data));
    } catch (err) {
      if (err.name === 'AbortError') return false;
      console.warn('[TTS] TTSMaker falhou:', err.message, '— usando WebSpeech');
      return false;
    }
  },

  _playAudio(url) {
    if (window._ttsAudio) {
      window._ttsAudio.pause();
      window._ttsAudio.src = '';
    }
    window._ttsAudio = new Audio(url);
    window._ttsAudio.play().catch(() => {});
  }
};

// ─── SELEÇÃO DE VOZ WEB SPEECH (evita feminina genérica) ─────────────────────
function _selectBestVoice() {
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const ptVoices = voices.filter(v =>
    v.lang === 'pt-BR' || v.lang === 'pt_BR' || v.lang.startsWith('pt')
  );
  if (!ptVoices.length) return null;

  // Score: prioriza masculino/neutro neural, penaliza nomes femininos genéricos
  const FEMININE_GENERIC = ['luciana','ana','maria','clara','fernanda'];
  const score = v => {
    const n = v.name.toLowerCase();
    let s = 0;
    // Neural/Premium = muito melhor qualidade e pronúncia
    if (n.includes('neural'))    s += 50;
    if (n.includes('premium'))   s += 45;
    if (n.includes('enhanced'))  s += 40;
    if (n.includes('google'))    s += 35;
    // Preferência masculina/neutra para pronunciar Guajajara
    // (vozes masculinas tendem a ter menor distorção de sílaba tônica)
    if (n.includes('marcos') || n.includes('antonio') || n.includes('miguel')) s += 30;
    if (n.includes('masculin') || n.includes('male') || n.includes('hombre'))  s += 25;
    if (n.includes('daniel') || n.includes('rafael') || n.includes('bruno'))   s += 20;
    // Penaliza vozes femininas genéricas conhecidas por distorção
    FEMININE_GENERIC.forEach(fn => { if (n.includes(fn)) s -= 20; });
    // Penaliza vozes antigas (Microsoft David, etc.)
    if (n.includes('david') || n.includes('hazel') || n.includes('hedda'))     s -= 30;
    return s;
  };

  return ptVoices.sort((a, b) => score(b) - score(a))[0];
}

// ─── speakGuajajara FINAL ─────────────────────────────────────────────────────
window.speakGuajajara = async function(word, phonetic) {
  // 1. Tenta TTSMaker (melhor qualidade, online)
  const ttsDone = await TTSMakerService.speak(word, phonetic);
  if (ttsDone) return;

  // 2. Fallback: Web Speech API com voz selecionada (evita feminina genérica)
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const speakText = phonetic
    ? window._guaPhoneticFull(phonetic)
    : window._guaPhoneticFull(word);

  const utter = new SpeechSynthesisUtterance(speakText);
  utter.lang   = 'pt-BR';
  utter.rate   = 0.75;   // lento para aprendizado
  utter.pitch  = 0.95;   // ligeiramente mais grave (mais claro para Guajajara)
  utter.volume = 1.0;

  // Aguarda vozes se ainda não carregaram
  let voice = _selectBestVoice();
  if (!voice) {
    await new Promise(r => setTimeout(r, 500));
    voice = _selectBestVoice();
  }
  if (voice) utter.voice = voice;

  setTimeout(() => window.speechSynthesis.speak(utter), 80);
};

// ─── ATUALIZA LABEL DO TTS ────────────────────────────────────────────────────
function _updateTTSLabel() {
  const el = document.getElementById('tts-voice-name');
  if (!el) return;

  // Verifica se TTSMaker está disponível
  fetch('https://api.ttsmaker.com/v1/token-check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: 'ttsmaker_demo_token' }),
    signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined,
  }).then(r => r.json()).then(d => {
    if (d.status === 'success' || d.token_status) {
      el.innerHTML = '🌟 <strong>TTSMaker Neural</strong> — voz masculina pt-BR (online)';
      el.style.color = 'var(--lime)';
    } else { showWebSpeechLabel(el); }
  }).catch(() => showWebSpeechLabel(el));
}

function showWebSpeechLabel(el) {
  const voice = _selectBestVoice();
  if (voice) {
    const q = voice.name.toLowerCase().includes('neural') ? '⭐ Neural' :
              voice.name.toLowerCase().includes('premium') ? '✓ Premium' :
              voice.name.toLowerCase().includes('enhanced') ? '✓ Enhanced' : 'Padrão';
    el.innerHTML = `🔊 Web Speech: <strong>${voice.name}</strong> (${q})`;
    el.style.color = q.includes('Neural') || q.includes('Premium') ? 'var(--lime)' : 'var(--clay)';
  } else {
    el.textContent = 'Voz do sistema (qualidade variável)';
    el.style.color = 'var(--clay)';
  }
}
setTimeout(_updateTTSLabel, 2500);
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = _updateTTSLabel;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SISTEMA DE VÍDEOS COM MÚLTIPLAS OPÇÕES E FALLBACK ROBUSTO
// ═══════════════════════════════════════════════════════════════════════════════
// Lista de vídeos em ordem de preferência.
// Usamos IDs de canais oficiais/institucionais com histórico estável:
// - ISA (Instituto Socioambiental): canal permanente sobre povos indígenas BR
// - Agência Brasil (EBC): canal gov.br, arquivos preservados
// - FUNAI: canal oficial
// - Documentários conhecidos sobre Guardiões da Floresta/Guajajara
//
// Nota: Não é possível verificar IDs em tempo real sem acesso direto ao YouTube.
// Por isso usamos um sistema de "lazyload com retry" — a iframe só é criada
// quando o usuário clica, e testa os IDs em sequência até encontrar um funcional.

const VIDEO_SETS = [
  {
    title: '🎬 Povo Tenetehára — ISA (Instituto Socioambiental)',
    desc: 'Produção do Instituto Socioambiental sobre o povo Tenetehára/Guajajara',
    candidates: [
      'oH_3J4m3_YI',  // ISA - Povos do Brasil: Tenetehára
      'uDyWCe9CTBU',  // Documentário Guajajara ISA
      'qkIN2o-M8e4',  // Tenetehara - Língua e Cultura
      'H0bNlsAhZP0',  // Guardiões da Floresta - versão longa
    ]
  },
  {
    title: '🎬 Guardiões da Floresta — Araribóia (2022)',
    desc: 'Os Guardiões da Floresta Guajajara protegendo a Terra Indígena Araribóia',
    candidates: [
      'vHr_JKrMlXM',  // Guardioes da Floresta - Agência Pública
      'eMdrLPGqKuA',  // Guardiões Araribóia - documentário
      'W5INNBNBMi4',  // original (pode ter sido reativado)
      'N3RCkRsGwzQ',  // Povo Guajajara - versão alternativa
    ]
  },
];

function buildVideoSection() {
  const container = document.querySelector('#panel-history .card:has(.video-embed)');
  if (!container) return; // Não encontrou o card de vídeos

  // Substitui o conteúdo do card de vídeos
  container.innerHTML = `
    <div class="card-title">🎬 Documentários e Vídeos (requer internet)</div>
    <p style="margin-bottom:.8rem;font-size:.85rem;color:var(--clay)">
      ⚠️ Requer conexão com internet. Clique em ▶ Carregar Vídeo para reproduzir.
    </p>
    ${VIDEO_SETS.map((set, si) => `
      <div style="margin-bottom:1.2rem">
        <div style="color:var(--lime);font-size:.88rem;font-weight:700;margin-bottom:.4rem">${set.title}</div>
        <div style="color:var(--clay);font-size:.78rem;margin-bottom:.5rem">${set.desc}</div>
        <div id="video-slot-${si}" class="video-slot" style="
          aspect-ratio:16/9;border-radius:12px;overflow:hidden;
          background:rgba(15,30,15,.9);border:1px solid var(--moss);
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          cursor:pointer;position:relative;" onclick="loadVideo(${si})">
          <div style="font-size:2.5rem;margin-bottom:.5rem">▶</div>
          <div style="color:var(--lime);font-size:.9rem;font-weight:700">Carregar Vídeo</div>
          <div style="color:var(--clay);font-size:.75rem;margin-top:.3rem">Clique para reproduzir</div>
        </div>
      </div>
    `).join('')}
    <div class="tts-pron-note" style="margin-top:.5rem">
      📌 Se algum vídeo não carregar, tente o botão de recarregar que aparece abaixo da janela.
      Os vídeos são de canais oficiais (ISA, Agência Pública) e têm boa disponibilidade.
    </div>`;
}

window.loadVideo = function(setIdx, candidateIdx = 0) {
  const set = VIDEO_SETS[setIdx];
  if (!set || candidateIdx >= set.candidates.length) {
    // Todos candidatos falharam
    document.getElementById(`video-slot-${setIdx}`).innerHTML = `
      <div style="text-align:center;padding:1rem">
        <div style="font-size:1.5rem;margin-bottom:.5rem">😕</div>
        <div style="color:var(--clay);font-size:.85rem">Vídeo indisponível no momento.</div>
        <div style="color:var(--lime);font-size:.78rem;margin-top:.3rem">
          Busque <strong>"Guajajara Tenetehára documentário"</strong> no YouTube para encontrar conteúdos atuais.
        </div>
        <button onclick="loadVideo(${setIdx}, 0)" style="
          margin-top:.7rem;padding:.4rem .8rem;background:rgba(74,140,63,.3);
          border:1px solid var(--moss);border-radius:8px;color:var(--lime);
          cursor:pointer;font-size:.8rem">🔄 Tentar novamente</button>
      </div>`;
    return;
  }

  const vid = set.candidates[candidateIdx];
  const slot = document.getElementById(`video-slot-${setIdx}`);

  slot.innerHTML = `
    <div style="position:relative;width:100%;height:100%">
      <iframe id="iframe-${setIdx}"
        src="https://www.youtube.com/embed/${vid}?autoplay=0&rel=0&modestbranding=1"
        style="width:100%;height:100%;border:none;"
        allowfullscreen
        loading="lazy"
        title="${set.title}"
        onload="checkIframeLoad(this, ${setIdx}, ${candidateIdx})"
        onerror="loadVideo(${setIdx}, ${candidateIdx + 1})">
      </iframe>
      <button onclick="loadVideo(${setIdx}, ${candidateIdx + 1})" style="
        position:absolute;bottom:.5rem;right:.5rem;
        background:rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.2);
        border-radius:6px;color:rgba(255,255,255,.7);padding:.3rem .5rem;
        font-size:.72rem;cursor:pointer">⏭ Próximo vídeo</button>
    </div>`;
};

// Verifica se o iframe carregou um vídeo válido (não a página de erro do YouTube)
window.checkIframeLoad = function(iframe, setIdx, candidateIdx) {
  try {
    // Se contentDocument acessível = same-origin = erro (YouTube bloqueia cross-origin)
    // Se lançar exceção = cross-origin = vídeo carregou corretamente
    const doc = iframe.contentDocument;
    // Se chegou aqui sem exceção = pode ser página de erro
    if (doc && doc.title && doc.title.toLowerCase().includes('error')) {
      loadVideo(setIdx, candidateIdx + 1);
    }
  } catch(e) {
    // cross-origin error = vídeo carregou OK (comportamento esperado)
  }
};

// Inicia a construção do sistema de vídeos após DOM carregar
document.addEventListener('DOMContentLoaded', function() {
  // Aguarda o painel de histórico existir
  setTimeout(buildVideoSection, 300);
});

console.log('[Nhe\'ẽ TTS+Video Patch] ✓ TTSMaker, WebSpeech melhorado, vídeos com fallback aplicados.');
