// ─── ARAWY IA · Claude API Integration ────────────────────────────────────────
// Fix CORS: usa header 'anthropic-dangerous-direct-browser-access' + fallback offline

const ArawyAI = {
  history: [],
  maxHistory: 10,

  systemPrompt: `Você é Arawy, uma arara-azul mágica e especialista em língua Guajajara (Tenetehára).
Você está integrada ao app educacional "Nhe'ẽ" para ensinar a língua indígena Guajajara.

Seu papel:
- Responder dúvidas de pronúncia de palavras Guajajara para falantes de português brasileiro
- Explicar gramática e estrutura da língua Tenetehára
- Dar exemplos de uso de palavras e frases
- Fornecer contexto cultural sobre o povo Tenetehára
- Motivar o aprendiz de forma carinhosa e encorajadora

Sobre pronúncia para falantes do PT-BR:
- "xe" = "CHÊ" (como chave, chá)
- "x" em Guajajara = som de "CH" do português
- "y" = vogal central, aproximada como "i" relaxado
- "nh" = igual ao "nh" do português (manhã, sonho)
- "'" (apóstrofo) = oclusiva glotal — pausa mínima
- acento na última sílaba geralmente

Fontes: Harrison & Harrison (1984), Duarte (2007), SIL Tenetehára materials.
Se não souber algo com certeza, diga que pode haver variação dialetal e sugira consultar falantes nativos.

Responda sempre em português brasileiro, de forma amigável, usando emojis ocasionalmente 🦜
Seja concisa mas completa. Máximo 150 palavras por resposta.
Ocasionalmente inclua a palavra Guajajara relevante no contexto da resposta.`,

  async ask(question) {
    this.history.push({ role: 'user', content: question });
    if (this.history.length > this.maxHistory * 2) {
      this.history = this.history.slice(-this.maxHistory * 2);
    }
    try {
      const text = await this._callAPI();
      if (text) { this.history.push({ role: 'assistant', content: text }); return text; }
    } catch (err) {
      console.warn('[Arawy AI]', err.message);
    }
    const fallback = this._offlineFallback(question);
    this.history.push({ role: 'assistant', content: fallback });
    return fallback;
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
    if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.error?.message||`HTTP ${res.status}`); }
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return (data.content||[]).filter(b=>b.type==='text').map(b=>b.text).join('').trim();
  },

  _offlineFallback(question) {
    const q = question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    if (/\bxe\b/.test(q)||q.includes('pronunci'))
      return `🦜 **"Xe"** = **"CHÊ"** — igual a chá, chave, cheio!\n\n• Xe ru = CHÊ-rú (meu pai)\n• Xe sy = CHÊ-sí (minha mãe)\n\n📌 Veja a aba 🎵 Pronúncia!`;
    if (q.includes('kunha')||q.includes('mulher'))
      return `🦜 **Kunhã** = **"ku-NHÃ"**\nO "nh" é igual ao português (manhã). "ã" nasal como maçã. Simples! 🌿`;
    if (q.includes('agua')||q.includes('água')||q.includes("y'y"))
      return `🦜 **Y'y** (água) = **"Î—Î"** com pausa entre os dois sons.\nO apóstrofo = mini-pausa (oclusiva glotal). Único no Guajajara!`;
    if (q.includes('ola')||q.includes('olá')||q.includes('salud'))
      return `🦜 Saudações:\n• **Maraná!** = Olá! (ma-ra-NÁ)\n• **Angatu!** = Bem! (an-ga-TU)\n• **Aguyje!** = Obrigado! (a-gu-YÊ)`;
    if (q.includes('familia')||q.includes('pai')||q.includes('mae')||q.includes('mãe'))
      return `🦜 Família:\n• Xe ru = meu pai (CHÊ-rú)\n• Xe sy = minha mãe (CHÊ-sí)\n• Xe memyr = meu filho/a\n• Xe ramuhã = meu avô`;
    if (q.includes('amor')||q.includes('amar')||q.includes('hayhu'))
      return `🦜 **Hayhu** = amor (hai-HÚ)\n💚 Xe hayhu nde = Eu te amo\nAcento na última: hai-**HÚ**!`;
    if (q.includes('numero')||q.includes('número')||q.includes('contar'))
      return `🦜 Números:\n• Moko'yr = 1 • Mokõi = 2 • Mosapy = 3\n• Po = 5 ("mão") • Mawy = muitos\nSistema quinário baseado na mão!`;
    if (typeof allWords!=='undefined'&&allWords.length>0) {
      const qn = q.replace(/[^a-z0-9\s]/g,'');
      const m = allWords.find(w=>{
        const g=(w.g||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
        const p=(w.pt||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
        return g.includes(qn)||p.includes(qn);
      });
      if (m) return `🦜 **${m.g}** = ${m.pt}\nPronúncia: /${m.ph}/${m.ex?'\nEx: '+m.ex:''}${m.note?'\n📌 '+m.note:''}`;
    }
    return `🦜 Modo offline ativo.\n\nPergunte sobre: pronúncia (xe, sy, y'y...), saudações, família, números, cores, ou o povo Tenetehára.\n\nOu use 📚 Curso · 🎵 Pronúncia · 📖 Dicionário 🌿`;
  }
};

function _formatArawyText(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g,'<strong style="color:var(--sun)">$1</strong>')
    .replace(/\*(.+?)\*/g,'<em style="color:var(--lime)">$1</em>')
    .replace(/\n/g,'<br>');
}

function _checkArawyDot() {
  const dot = document.getElementById('arawy-status-dot');
  if (!dot) return;
  if (!navigator.onLine) { dot.style.background='var(--urucum)'; dot.title='Offline'; return; }
  fetch('https://api.anthropic.com/v1/messages', {
    method:'POST',
    headers:{'Content-Type':'application/json','anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
    body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:5,messages:[{role:'user',content:'hi'}]}),
    signal: typeof AbortSignal.timeout==='function' ? AbortSignal.timeout(5000) : undefined,
  }).then(r=>{
    const ok=r.status<500;
    dot.style.background=ok?'var(--lime)':'var(--clay)';
    dot.style.boxShadow=ok?'0 0 6px var(--lime)':'0 0 6px var(--clay)';
    dot.title=ok?'Online — IA ativa':'API indisponível';
  }).catch(()=>{ dot.style.background='var(--clay)'; dot.title='Sem acesso à API'; });
}

function renderArawyPanel() {
  return `
    <div style="background:linear-gradient(135deg,rgba(36,102,176,.25),rgba(15,42,15,.9));border:1px solid var(--ara-blue);border-radius:16px;padding:1.2rem;margin-bottom:1rem">
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
        <div>
          <div style="color:var(--sun);font-weight:800;font-size:1.05rem">Arawy IA</div>
          <div style="color:var(--ara-light);font-size:.8rem">Especialista em Guajajara · powered by Claude</div>
        </div>
        <div id="arawy-status-dot" style="margin-left:auto;width:10px;height:10px;border-radius:50%;background:var(--clay);transition:all .4s" title="Verificando..."></div>
      </div>
      <p style="color:var(--cream);font-size:.87rem">Pergunte sobre pronúncia, gramática, vocabulário ou cultura Tenetehára!</p>
    </div>

    <div class="card" style="margin-bottom:.7rem;padding:.7rem">
      <div style="color:var(--clay);font-size:.78rem;margin-bottom:.5rem">💡 Sugestões:</div>
      <div style="display:flex;flex-wrap:wrap;gap:.4rem">
        ${['Como pronuncio "xe"?','O que significa Tekohaw?','Como digo "Eu te amo"?',
           'Saudações Guajajara','Como funciona o acento?','Conte sobre os Tenetehára']
          .map(s=>`<button onclick="sendToArawy(${JSON.stringify(s)})"
            style="padding:.35rem .7rem;background:rgba(36,102,176,.2);border:1px solid var(--ara-blue);
            border-radius:20px;color:var(--ara-light);font-size:.78rem;cursor:pointer;transition:background .2s"
            onmouseover="this.style.background='rgba(36,102,176,.4)'"
            onmouseout="this.style.background='rgba(36,102,176,.2)'">${s}</button>`).join('')}
      </div>
    </div>

    <div id="arawy-chat" style="max-height:420px;overflow-y:auto;display:flex;flex-direction:column;gap:.7rem;margin-bottom:.7rem;scroll-behavior:smooth">
      <div style="display:flex;gap:.6rem;align-items:flex-start">
        <div style="font-size:1.4rem;flex-shrink:0">🦜</div>
        <div style="background:rgba(36,102,176,.2);border:1px solid var(--ara-blue);border-radius:0 14px 14px 14px;padding:.7rem .9rem;flex:1">
          <div style="color:var(--cream);font-size:.9rem;line-height:1.65">
            Maraná! Sou <strong style="color:var(--sun)">Arawy</strong>! 🦜 Pergunte sobre pronúncia, vocabulário ou cultura Guajajara.<br>
            <span style="color:var(--clay);font-size:.8rem">Funciono online e offline.</span>
          </div>
        </div>
      </div>
    </div>

    <div style="display:flex;gap:.5rem">
      <input id="arawy-input" type="text" placeholder="Pergunte sobre Guajajara..."
        style="flex:1;padding:.65rem .9rem;background:rgba(30,74,30,.7);border:1px solid var(--moss);
        border-radius:12px;color:var(--cream);font-size:.9rem;font-family:'Nunito',sans-serif;outline:none;"
        onkeydown="if(event.key==='Enter')sendToArawy()"
        onfocus="this.style.borderColor='var(--ara-light)'" onblur="this.style.borderColor='var(--moss)'">
      <button onclick="sendToArawy()"
        style="padding:.65rem 1rem;background:linear-gradient(135deg,var(--ara-blue),var(--sky));
        border:none;border-radius:12px;color:#fff;font-size:1.1rem;cursor:pointer;
        box-shadow:0 3px 10px rgba(36,102,176,.4);transition:transform .15s"
        onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1)'">🦜</button>
    </div>
    <div style="color:var(--clay);font-size:.72rem;text-align:center;margin-top:.5rem">
      Respostas da IA podem conter imprecisões — consulte falantes nativos para confirmação.
    </div>`;
}

async function sendToArawy(question) {
  const input = document.getElementById('arawy-input');
  const q = (typeof question==='string'&&question) || (input?input.value.trim():'');
  if (!q) return;
  if (input) input.value = '';

  const chat = document.getElementById('arawy-chat');
  if (!chat) return;

  const userBubble = document.createElement('div');
  userBubble.style.cssText = 'display:flex;justify-content:flex-end';
  userBubble.innerHTML = `<div style="background:rgba(30,74,30,.8);border:1px solid var(--moss);border-radius:14px 0 14px 14px;padding:.6rem .9rem;max-width:85%"><div style="color:var(--cream);font-size:.9rem">${q.replace(/</g,'&lt;')}</div></div>`;
  chat.appendChild(userBubble);

  const typingEl = document.createElement('div');
  typingEl.id = 'arawy-typing';
  typingEl.style.cssText = 'display:flex;gap:.6rem;align-items:flex-start';
  typingEl.innerHTML = `<div style="font-size:1.4rem;flex-shrink:0">🦜</div><div style="background:rgba(36,102,176,.15);border:1px solid var(--ara-blue);border-radius:0 14px 14px 14px;padding:.7rem .9rem"><div class="loader-dots"><span></span><span></span><span></span></div></div>`;
  chat.appendChild(typingEl);
  chat.scrollTop = chat.scrollHeight;

  const answer = await ArawyAI.ask(q);

  const t = document.getElementById('arawy-typing');
  if (t) t.remove();

  const resBubble = document.createElement('div');
  resBubble.style.cssText = 'display:flex;gap:.6rem;align-items:flex-start';
  resBubble.innerHTML = `<div style="font-size:1.4rem;flex-shrink:0;animation:float 4s ease-in-out infinite">🦜</div><div style="background:rgba(36,102,176,.2);border:1px solid var(--ara-blue);border-radius:0 14px 14px 14px;padding:.7rem .9rem;flex:1"><div style="color:var(--cream);font-size:.9rem;line-height:1.65">${_formatArawyText(answer)}</div></div>`;
  chat.appendChild(resBubble);
  chat.scrollTop = chat.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  const navTabs = document.getElementById('navTabs');
  const navDrawerInner = document.getElementById('navDrawerInner');

  if (app) {
    const div = document.createElement('div');
    div.className = 'panel';
    div.id = 'panel-arawy';
    div.innerHTML = renderArawyPanel();
    app.appendChild(div);
    setTimeout(_checkArawyDot, 1800);
  }

  function makeArawyBtn(forDrawer) {
    const btn = document.createElement('button');
    btn.className = 'nav-tab';
    btn.textContent = '🦜 Arawy IA';
    btn.setAttribute('data-panel', 'arawy');
    btn.onclick = () => {
      if (typeof showPanelExtra==='function') showPanelExtra('arawy');
      if (forDrawer && typeof closeNavDrawer==='function') closeNavDrawer();
      setTimeout(_checkArawyDot, 500);
    };
    return btn;
  }
  if (navTabs) navTabs.appendChild(makeArawyBtn(false));
  if (navDrawerInner) navDrawerInner.appendChild(makeArawyBtn(true));
});
