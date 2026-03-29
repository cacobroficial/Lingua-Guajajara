// ─── ARAWY IA · Versão Definitiva ────────────────────────────────────────────
// FIX: chips onclick usam data-attr em vez de onclick inline c/ JSON.stringify
// FIX: sendToArawy aceita string diretamente
// FIX: ArawyAI.ask — online prioritário, offline como fallback com aprendizado

// ─── BASE DE CONHECIMENTO OFFLINE ────────────────────────────────────────────
const ARAWY_KB = {
  // Alimentada por respostas online salvas + base fixa
  _saved: {},

  load() {
    try { this._saved = JSON.parse(localStorage.getItem('arawy_kb') || '{}'); } catch { this._saved = {}; }
  },

  save(question, answer) {
    this.load();
    const key = this._normalize(question);
    this._saved[key] = { answer, ts: Date.now() };
    const keys = Object.keys(this._saved);
    if (keys.length > 120) {
      const oldest = keys.sort((a,b) => (this._saved[a].ts||0) - (this._saved[b].ts||0))[0];
      delete this._saved[oldest];
    }
    try { localStorage.setItem('arawy_kb', JSON.stringify(this._saved)); } catch {}
  },

  find(question) {
    this.load();
    const q = this._normalize(question);
    // Exact
    if (this._saved[q]) return this._saved[q].answer;
    // Partial match
    for (const [k, v] of Object.entries(this._saved)) {
      if (q.includes(k.slice(0,20)) || k.includes(q.slice(0,20))) return v.answer;
    }
    return null;
  },

  _normalize(s) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().slice(0,80);
  }
};

// ─── RESPOSTAS OFFLINE FIXAS ──────────────────────────────────────────────────
const ARAWY_OFFLINE = [
  {
    keys: ['como pronuncio xe', 'pronuncia xe', 'pronunciar xe', 'som do x'],
    answer: `🦜 **"Xe"** = pronuncia-se **"CHÊ"** — igual ao CH do português!\n\n• CHÁ → xa em Guajajara\n• CHEgada → xe (= eu, meu)\n• CHUva → xu em Guajajara\n\n**Exemplos:**\n• *Xe ru* = "CHÊ-rú" = meu pai\n• *Xe sy* = "CHÊ-sí" = minha mãe\n• *Xe hayhu nde* = "CHÊ-rai-hú-ndê" = Eu te amo\n\n❌ NÃO é "kice", "ékss" nem "she" inglês. É o **CH** do português!`
  },
  {
    keys: ['tekohaw', 'aldeia', 'modo de ser', 'territorio'],
    answer: `🦜 **Tekohaw** (te-ko-**RAU**) é muito mais que "aldeia"!\n\nSignifica o **modo de ser e estar** do povo Tenetehára — território físico, espiritual e cultural ao mesmo tempo. Para os Guajajara, proteger o tekohaw é proteger a própria identidade.\n\n📌 O "haw" soa como "ráu" suavizado em pt-BR.\n\nOutras palavras de lugar:\n• *Oka* = casa (individual)\n• *Tapé* = caminho\n• *Tekohaw porã* = modo de vida bom`
  },
  {
    keys: ['eu te amo', 'como digo eu te amo', 'hayhu', 'amor', 'amar'],
    answer: `🦜 **"Eu te amo"** em Guajajara:\n\n**Xe hayhu nde**\nPronúncia: *CHÊ — rai-HÚ — ndê*\n\n• **Xe** (CHÊ) = eu / meu\n• **hayhu** (rai-HÚ) = amor, amar\n• **nde** (ndê) = você, te\n\n**Variações:**\n• *Xe hayhu nde mawy* = Eu te amo muito\n• *Hayhu!* = Amor! (exclamação carinhosa)\n• *Nde hayhu xe?* = Você me ama?\n\n💚 Acento sempre na última: hai-**HÚ**`
  },
  {
    keys: ['saudacoes', 'saudações', 'cumprimentar', 'ola', 'olá', 'bom dia'],
    answer: `🦜 **Saudações Tenetehára:**\n\n**Ao encontrar:**\n• *Maraná!* (ma-ra-**NÁ**) = Olá! Bom dia!\n• *Mehe ku pe?* (me-hê-ku-**PÊ**) = Como vai?\n• *Angatu!* (an-ga-**TU**) = Bem! Ótimo!\n\n**Apresentação:**\n• *Xe r-er [nome]* = Meu nome é [nome]\n• *Nde r-er mehe?* = Qual é o seu nome?\n\n**Despedida:**\n• *Kwé aty!* = Até logo!\n• *Aguyje!* (a-gu-**YÊ**) = Obrigado(a)!\n• *Eroho angatu pe!* = Vá bem!\n\n📌 Acento sempre na **última sílaba**!`
  },
  {
    keys: ['acento', 'tonicidade', 'silaba', 'sílaba', 'como funciona acento', 'onde cai acento'],
    answer: `🦜 **Tonicidade em Guajajara — regra principal:**\n\nAcento na **ÚLTIMA SÍLABA** — oposto do padrão português!\n\n**Exemplos:**\n• *Maraná* = ma-ra-**NÁ** ❌ não "MÁ-ra-na"\n• *Angatu* = an-ga-**TU** ❌ não "ÂN-ga-tu"\n• *Hayhu* = hai-**HÚ** ❌ não "HÁI-hu"\n• *Tekohaw* = te-ko-**RAU**\n• *Memihar* = me-mi-**HAR**\n• *Aguyje* = a-gu-**YÊ**\n\n💡 Dica: sempre enfatize a última sílaba. Isso muda completamente como os falantes nativos te entendem!`
  },
  {
    keys: ['tenetehara', 'tenetehára', 'povo', 'guajajara historia', 'historia povo', 'quem sao', 'conte sobre'],
    answer: `🦜 **Os Tenetehára — "Os verdadeiros seres humanos"**\n\n🌍 **Quem são:** Povo indígena do Maranhão e Pará. ~40.000 pessoas.\n\n📍 **Território:** Terra Indígena Araribóia, Caru, Cana-Brava (MA).\n\n🗣️ **Língua:** Guajajara (família Tupi-Guarani). Ativa e viva!\n\n⏳ **História:** Contato europeu ~1615. A "Revolta de Alto Alegre" (1901) foi a última guerra indígena oficial do Brasil.\n\n🌿 **Hoje:** Guardiões da Floresta protegem a Araribóia. Sônia Guajajara (ministra 2023-) é Tenetehára.\n\n📌 *Guajajara* = "donos do cocar" (nome externo). Eles preferem *Tenetehára* = "gente de verdade".`
  },
  {
    keys: ['kunha', 'kunhã', 'mulher', 'pronuncia kunha'],
    answer: `🦜 **Kunhã** (= mulher) = **"ku-NHÃ"**\n\nO "nh" é idêntico ao português (manhã, sonho). O "ã" é nasal como em "maçã". Simples!\n\n**Uso:**\n• *Kunhã porã* = mulher bonita\n• *Kunhã musak* = moça jovem\n• *Kunhã moko'yr* = uma mulher (só uma)`
  },
  {
    keys: ['numeros', 'números', 'contar', 'um dois tres', 'um dois três'],
    answer: `🦜 **Números Guajajara:**\n\n• *Moko'yr* (mo-ko-**ÎR**) = 1\n• *Mokõi* (mo-**KÕI**) = 2\n• *Mosapy* (mo-sa-**PÎ**) = 3\n• *Irundy* (i-run-**DÎ**) = 4\n• *Po* (**PO**) = 5 ("mão")\n• *Po moko'yr* = 6 (mão + 1)\n• *Po mokõi* = 7 (mão + 2)\n• *Mawy* = muitos\n\n📌 Sistema baseado na mão (quinário) — 5 = "mão"!`
  },
  {
    keys: ['familia', 'família', 'pai mae', 'mãe pai', 'parente'],
    answer: `🦜 **Família em Guajajara:**\n\n• *Xe ru* (CHÊ-rú) = meu pai\n• *Xe sy* (CHÊ-sí) = minha mãe\n• *Xe memyr* = meu filho/filha\n• *Xe ramuhã* = meu avô\n• *Xe ramyjár* = minha avó\n• *Xe r-ykér* = meu irmão mais novo\n• *Xe ywyr* = meu irmão mais velho\n\n💡 *Ñeengar* = família extensa / parentes (conceito central Tenetehára!)`
  },
  {
    keys: ['obrigado', 'aguyje', 'kwáhy', 'kwáhy', 'agradecer'],
    answer: `🦜 **Obrigado em Guajajara:**\n\n• *Aguyje!* (a-gu-**YÊ**) = Obrigado! (formal, reverente)\n• *Kwáhy* (kwá-i) = Obrigado (informal, cotidiano)\n\n📌 *Aguyje* é mais usado em contextos formais e cerimônias. Para o dia a dia, *kwáhy* é suficiente.`
  },
];

// ─── ARAWY AI OBJECT ──────────────────────────────────────────────────────────
const ArawyAI = {
  history: [],
  maxHistory: 10,

  systemPrompt: `Você é Arawy, uma arara-azul mágica especialista em língua Guajajara (Tenetehára).
App educacional "Nhe'ẽ" para ensinar Guajajara.

Pronúncia para PT-BR:
- "xe" = "CHÊ" (como chave, chá)
- "x" = CH do português
- "y" = vogal central ≈ "i" relaxado
- "nh" = igual ao nh do português (manhã)
- "'" = oclusiva glotal (pausa mínima)
- acento na última sílaba

Fontes: Harrison & Harrison (1984), Duarte (2007), SIL Tenetehára.
Se incerto: indique variação dialetal, sugira consultar falantes nativos.
Responda em português brasileiro, amigável, máx 180 palavras. Use emojis ocasionalmente 🦜`,

  async ask(question) {
    // Adiciona ao histórico
    this.history.push({ role: 'user', content: question });
    if (this.history.length > this.maxHistory * 2) {
      this.history = this.history.slice(-this.maxHistory * 2);
    }

    // 1. Tenta API online (prioritária)
    if (navigator.onLine) {
      try {
        const text = await this._callAPI();
        if (text && text.length > 10) {
          this.history.push({ role: 'assistant', content: text });
          // Salva para uso offline futuro
          ARAWY_KB.save(question, text);
          return text;
        }
      } catch (err) {
        console.warn('[Arawy] API falhou:', err.message);
      }
    }

    // 2. Fallback: knowledge base salvo de sessões anteriores
    const saved = ARAWY_KB.find(question);
    if (saved) {
      const reply = saved + '\n\n*[Resposta salva — modo offline]*';
      this.history.push({ role: 'assistant', content: reply });
      return reply;
    }

    // 3. Fallback: base offline fixa
    const offline = this._offlineLookup(question);
    this.history.push({ role: 'assistant', content: offline });
    return offline;
  },

  async _callAPI() {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        system: this.systemPrompt,
        messages: this.history,
      }),
      signal: AbortSignal.timeout ? AbortSignal.timeout(12000) : undefined,
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e.error?.message || `HTTP ${res.status}`);
    }
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('').trim();
  },

  _offlineLookup(question) {
    const q = question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Verifica base offline fixa
    for (const entry of ARAWY_OFFLINE) {
      for (const key of entry.keys) {
        const kn = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (q.includes(kn) || kn.includes(q.slice(0,15))) return entry.answer;
      }
    }

    // Busca no vocabulário do app
    if (typeof allWords !== 'undefined' && allWords.length > 0) {
      const terms = q.replace(/[^a-z0-9\s]/g,'').split(' ').filter(w => w.length > 2);
      for (const t of terms) {
        const m = allWords.find(w => {
          const g = (w.g||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
          const p = (w.pt||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
          return g === t || p === t || g.startsWith(t) || p.startsWith(t);
        });
        if (m) return `🦜 Encontrei no dicionário!\n\n**${m.g}** = ${m.pt}\nPronúncia: /${m.ph}/\n${m.ex ? '\n💬 *' + m.ex + '*' : ''}${m.note ? '\n📌 ' + m.note : ''}`;
      }
    }

    return `🦜 Modo offline ativo. Pergunte sobre:\n• Pronúncia: "Como pronuncio xe?"\n• Saudações, família, números, amor\n• O povo Tenetehára\n• Acento e gramática\n\nOu explore: 📚 Curso · 🎵 Pronúncia · 📖 Dicionário 🌿`;
  }
};

// ─── UTILIDADES ───────────────────────────────────────────────────────────────
function _formatMd(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--sun)">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em style="color:var(--lime)">$1</em>')
    .replace(/\n/g, '<br>');
}

function _checkArawyDot() {
  const dot = document.getElementById('arawy-status-dot');
  if (!dot) return;
  if (!navigator.onLine) {
    dot.style.background = 'var(--urucum)';
    dot.title = 'Offline — modo local';
    return;
  }
  fetch('https://api.anthropic.com/v1/models', {
    headers: {
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined,
  }).then(r => {
    const ok = r.status < 500;
    dot.style.background = ok ? 'var(--lime)' : 'var(--clay)';
    dot.style.boxShadow  = ok ? '0 0 6px var(--lime)' : '0 0 6px var(--clay)';
    dot.title = ok ? 'Online — IA ativa' : 'API indisponível';
  }).catch(() => {
    dot.style.background = 'var(--clay)';
    dot.title = 'Sem acesso à API';
  });
}

// ─── RENDER DO PAINEL ─────────────────────────────────────────────────────────
// FIX: sugestões usam data-q attr + event listener, sem JSON.stringify em onclick
function renderArawyPanel() {
  const suggestions = [
    'Como pronuncio "xe"?',
    'O que significa Tekohaw?',
    'Como digo "Eu te amo"?',
    'Saudações Guajajara',
    'Como funciona o acento?',
    'Conte sobre os Tenetehára',
  ];

  return `
    <div style="background:linear-gradient(135deg,rgba(36,102,176,.25),rgba(15,42,15,.9));
      border:1px solid var(--ara-blue);border-radius:16px;padding:1.2rem;margin-bottom:1rem">
      <div style="display:flex;align-items:center;gap:.8rem;margin-bottom:.5rem">
        <svg width="44" height="44" viewBox="0 0 110 110">
          <ellipse cx="55" cy="62" rx="22" ry="28" fill="#2466b0"/>
          <ellipse cx="55" cy="34" rx="18" ry="17" fill="#2466b0"/>
          <ellipse cx="55" cy="34" rx="13" ry="12" fill="#3a7fd6"/>
          <path d="M46 40 Q44 46 50 44 Q47 40 46 40Z" fill="#1a1a00"/>
          <circle cx="47" cy="30" r="5" fill="#fff"/><circle cx="47" cy="30" r="3" fill="#1a1a00"/><circle cx="48" cy="29" r="1" fill="#fff"/>
          <circle cx="63" cy="30" r="5" fill="#fff"/><circle cx="63" cy="30" r="3" fill="#1a1a00"/><circle cx="64" cy="29" r="1" fill="#fff"/>
          <path d="M42 38 Q44 50 55 50 Q66 50 68 38" stroke="#f5b942" stroke-width="2.5" fill="none"/>
          <ellipse cx="55" cy="68" rx="11" ry="14" fill="#f5e6c0"/>
        </svg>
        <div style="flex:1">
          <div style="color:var(--sun);font-weight:800;font-size:1.05rem">Arawy IA</div>
          <div style="color:var(--ara-light);font-size:.8rem">Especialista em Guajajara · powered by Claude</div>
        </div>
        <div id="arawy-status-dot"
          style="width:10px;height:10px;border-radius:50%;background:var(--clay);
          flex-shrink:0;transition:all .4s;cursor:help" title="Verificando..."></div>
      </div>
      <p style="color:var(--cream);font-size:.87rem">
        Pergunte sobre pronúncia, gramática, vocabulário ou cultura Guajajara!
        Funciona online e offline.
      </p>
    </div>

    <div class="card" style="margin-bottom:.7rem;padding:.8rem">
      <div style="color:var(--clay);font-size:.78rem;font-weight:700;margin-bottom:.6rem">
        💡 Sugestões — toque para perguntar:
      </div>
      <div id="arawy-chips" style="display:flex;flex-wrap:wrap;gap:.5rem">
        ${suggestions.map((s, i) => `
          <button
            class="arawy-chip"
            data-q="${s.replace(/"/g, '&quot;')}"
            style="padding:.4rem .85rem;background:rgba(36,102,176,.2);
              border:1px solid var(--ara-blue);border-radius:20px;
              color:var(--ara-light);font-size:.8rem;cursor:pointer;
              transition:background .2s;font-family:inherit;line-height:1.3;
              text-align:left"
            onmouseover="this.style.background='rgba(36,102,176,.4)'"
            onmouseout="this.style.background='rgba(36,102,176,.2)'"
          >${s}</button>`).join('')}
      </div>
    </div>

    <div id="arawy-chat"
      style="max-height:420px;overflow-y:auto;display:flex;flex-direction:column;
      gap:.7rem;margin-bottom:.7rem;scroll-behavior:smooth">
      <div style="display:flex;gap:.6rem;align-items:flex-start">
        <div style="font-size:1.4rem;flex-shrink:0">🦜</div>
        <div style="background:rgba(36,102,176,.2);border:1px solid var(--ara-blue);
          border-radius:0 14px 14px 14px;padding:.7rem .9rem;flex:1">
          <div style="color:var(--cream);font-size:.9rem;line-height:1.65">
            Maraná! Sou <strong style="color:var(--sun)">Arawy</strong> 🦜<br>
            Pergunte sobre pronúncia, vocabulário, cultura Guajajara.<br>
            <span style="color:var(--clay);font-size:.8rem">
              Funciono online e offline com respostas detalhadas.
            </span>
          </div>
        </div>
      </div>
    </div>

    <div style="display:flex;gap:.5rem">
      <input id="arawy-input" type="text"
        placeholder="Pergunte sobre Guajajara..."
        style="flex:1;padding:.65rem .9rem;background:rgba(30,74,30,.7);
          border:1px solid var(--moss);border-radius:12px;
          color:var(--cream);font-size:.9rem;font-family:inherit;outline:none;"
        onfocus="this.style.borderColor='var(--ara-light)'"
        onblur="this.style.borderColor='var(--moss)'">
      <button id="arawy-send-btn"
        style="padding:.65rem 1rem;background:linear-gradient(135deg,var(--ara-blue),var(--sky));
          border:none;border-radius:12px;color:#fff;font-size:1.1rem;cursor:pointer;
          box-shadow:0 3px 10px rgba(36,102,176,.4);">🦜</button>
    </div>
    <div style="color:var(--clay);font-size:.72rem;text-align:center;margin-top:.4rem">
      Respostas IA podem conter imprecisões — consulte falantes nativos para confirmação.
    </div>`;
}

// ─── EVENT HANDLING ───────────────────────────────────────────────────────────
// FIX: usa event delegation para chips — sem onclick inline problemático

function _attachArawyEvents() {
  // Chips — event delegation no container
  const chips = document.getElementById('arawy-chips');
  if (chips && !chips.dataset.bound) {
    chips.dataset.bound = '1';
    chips.addEventListener('click', e => {
      const btn = e.target.closest('.arawy-chip');
      if (btn) {
        const q = btn.getAttribute('data-q');
        if (q) sendToArawy(q);
      }
    });
  }

  // Send button
  const sendBtn = document.getElementById('arawy-send-btn');
  if (sendBtn && !sendBtn.dataset.bound) {
    sendBtn.dataset.bound = '1';
    sendBtn.addEventListener('click', () => sendToArawy());
  }

  // Input enter
  const input = document.getElementById('arawy-input');
  if (input && !input.dataset.bound) {
    input.dataset.bound = '1';
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') sendToArawy();
    });
  }
}

// ─── sendToArawy ─────────────────────────────────────────────────────────────
async function sendToArawy(question) {
  const input = document.getElementById('arawy-input');
  const q = (typeof question === 'string' && question.trim())
    ? question.trim()
    : (input ? input.value.trim() : '');
  if (!q) return;
  if (input) input.value = '';

  const chat = document.getElementById('arawy-chat');
  if (!chat) return;

  // Bolha usuário
  const ub = document.createElement('div');
  ub.style.cssText = 'display:flex;justify-content:flex-end';
  ub.innerHTML = `
    <div style="background:rgba(30,74,30,.8);border:1px solid var(--moss);
      border-radius:14px 0 14px 14px;padding:.6rem .9rem;max-width:85%">
      <div style="color:var(--cream);font-size:.9rem">${q.replace(/</g,'&lt;')}</div>
    </div>`;
  chat.appendChild(ub);

  // Typing indicator
  const tb = document.createElement('div');
  tb.id = 'arawy-typing';
  tb.style.cssText = 'display:flex;gap:.6rem;align-items:flex-start';
  tb.innerHTML = `
    <div style="font-size:1.4rem;flex-shrink:0">🦜</div>
    <div style="background:rgba(36,102,176,.15);border:1px solid var(--ara-blue);
      border-radius:0 14px 14px 14px;padding:.7rem .9rem">
      <div class="loader-dots"><span></span><span></span><span></span></div>
    </div>`;
  chat.appendChild(tb);
  chat.scrollTop = chat.scrollHeight;

  const answer = await ArawyAI.ask(q);

  const t = document.getElementById('arawy-typing');
  if (t) t.remove();

  // Bolha resposta
  const rb = document.createElement('div');
  rb.style.cssText = 'display:flex;gap:.6rem;align-items:flex-start';
  rb.innerHTML = `
    <div style="font-size:1.4rem;flex-shrink:0;animation:float 4s ease-in-out infinite">🦜</div>
    <div style="background:rgba(36,102,176,.2);border:1px solid var(--ara-blue);
      border-radius:0 14px 14px 14px;padding:.7rem .9rem;flex:1">
      <div style="color:var(--cream);font-size:.9rem;line-height:1.65">
        ${_formatMd(answer)}
      </div>
    </div>`;
  chat.appendChild(rb);
  chat.scrollTop = chat.scrollHeight;
}

// ─── INJEÇÃO NO DOM ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  const navTabs = document.getElementById('navTabs');
  const navDrawerInner = document.getElementById('navDrawerInner');

  // Cria painel
  if (app && !document.getElementById('panel-arawy')) {
    const div = document.createElement('div');
    div.className = 'panel';
    div.id = 'panel-arawy';
    div.style.padding = '1rem';
    div.innerHTML = renderArawyPanel();
    app.appendChild(div);
    setTimeout(_attachArawyEvents, 100);
    setTimeout(_checkArawyDot, 1500);
  }

  // Tab desktop
  function makeBtn(forDrawer) {
    const btn = document.createElement('button');
    btn.className = 'nav-tab';
    btn.textContent = '🦜 Arawy IA';
    btn.setAttribute('data-panel', 'arawy');
    btn.onclick = () => {
      if (typeof showPanelExtra === 'function') showPanelExtra('arawy');
      if (forDrawer && typeof closeNavDrawer === 'function') closeNavDrawer();
      setTimeout(_checkArawyDot, 300);
    };
    return btn;
  }
  if (navTabs && !navTabs.querySelector('[data-panel="arawy"]')) navTabs.appendChild(makeBtn(false));
  if (navDrawerInner && !navDrawerInner.querySelector('[data-panel="arawy"]')) navDrawerInner.appendChild(makeBtn(true));
});

// Reanexa eventos após re-render do painel
window._arawyRerender = function() {
  const panel = document.getElementById('panel-arawy');
  if (panel) panel.innerHTML = renderArawyPanel();
  setTimeout(_attachArawyEvents, 50);
  setTimeout(_checkArawyDot, 400);
};
