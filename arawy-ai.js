// ─── ARAWY IA · Claude API Integration ────────────────────────────────────────
// O mascote Arawy agora responde perguntas em tempo real sobre Guajajara

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
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: this.systemPrompt,
          messages: this.history
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const text = data.content?.map(b => b.type === 'text' ? b.text : '').join('') || 'Ara ara! Não consegui responder agora. 🦜';
      this.history.push({ role: 'assistant', content: text });
      return text;
    } catch (err) {
      console.error('[Arawy AI]', err);
      return `🦜 Ara ara! Estou sem conexão no momento. Mas posso te ajudar com o guia de pronúncia offline! Acesse a aba 🎵 Pronúncia para tirar suas dúvidas.`;
    }
  }
};

// ─── ARAWY CHAT UI ────────────────────────────────────────────────────────────
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
          <div style="color:var(--ara-light);font-size:.8rem">Especialista em língua Guajajara · powered by Claude</div>
        </div>
        <div style="margin-left:auto;width:8px;height:8px;border-radius:50%;background:var(--lime);box-shadow:0 0 6px var(--lime)"></div>
      </div>
      <p style="color:var(--cream);font-size:.87rem">Pergunte qualquer coisa sobre pronúncia, gramática, cultura ou vocabulário Guajajara!</p>
    </div>

    <div class="card" style="margin-bottom:.7rem;padding:.7rem">
      <div style="color:var(--clay);font-size:.78rem;margin-bottom:.5rem">💡 Sugestões:</div>
      <div style="display:flex;flex-wrap:wrap;gap:.4rem">
        ${[
          'Como pronuncio "xe"?',
          'O que significa Tekohaw?',
          'Como digo "Eu te amo" em Guajajara?',
          'Qual a diferença entre Guajajara e Tenetehára?',
          'Como funciona a ordem das palavras?',
          'Me ensine uma saudação'
        ].map(q => `<button onclick="sendToArawy('${q.replace(/'/g,"\\'")}')"
          style="padding:.35rem .7rem;background:rgba(36,102,176,.2);border:1px solid var(--ara-blue);
          border-radius:20px;color:var(--ara-light);font-size:.78rem;cursor:pointer;
          transition:all .2s" onmouseover="this.style.background='rgba(36,102,176,.4)'" onmouseout="this.style.background='rgba(36,102,176,.2)'">${q}</button>`).join('')}
      </div>
    </div>

    <div id="arawy-chat" style="max-height:400px;overflow-y:auto;display:flex;flex-direction:column;gap:.7rem;margin-bottom:.7rem;padding-right:.3rem">
      <div style="display:flex;gap:.6rem;align-items:flex-start">
        <div style="font-size:1.4rem;flex-shrink:0">🦜</div>
        <div style="background:rgba(36,102,176,.2);border:1px solid var(--ara-blue);border-radius:0 14px 14px 14px;padding:.7rem .9rem;flex:1">
          <div style="color:var(--cream);font-size:.9rem;line-height:1.6">
            Maraná! Sou Arawy, sua guia de Guajajara! 🦜<br>
            Pode me perguntar sobre pronúncia, gramática, cultura Tenetehára... qualquer coisa!<br>
            <span style="color:var(--clay);font-size:.8rem">Exemplo: "Como pronuncio a letra X em Guajajara?"</span>
          </div>
        </div>
      </div>
    </div>

    <div style="display:flex;gap:.5rem">
      <input id="arawy-input" type="text" placeholder="Pergunte algo sobre Guajajara..."
        style="flex:1;padding:.65rem .9rem;background:rgba(30,74,30,.7);border:1px solid var(--moss);
        border-radius:12px;color:var(--cream);font-size:.9rem;font-family:'Nunito',sans-serif;outline:none;"
        onkeydown="if(event.key==='Enter')sendToArawy()"
        onfocus="this.style.borderColor='var(--ara-light)'" onblur="this.style.borderColor='var(--moss)'">
      <button onclick="sendToArawy()"
        style="padding:.65rem 1rem;background:linear-gradient(135deg,var(--ara-blue),var(--sky));
        border:none;border-radius:12px;color:#fff;font-size:1rem;cursor:pointer;
        box-shadow:0 3px 10px rgba(36,102,176,.4);transition:transform .2s"
        onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">🦜</button>
    </div>
    <div style="color:var(--clay);font-size:.72rem;text-align:center;margin-top:.4rem">
      Requer internet · Respostas da IA podem conter imprecisões — consulte falantes nativos para confirmação
    </div>`;
}

async function sendToArawy(question) {
  const input = document.getElementById('arawy-input');
  const q = question || (input ? input.value.trim() : '');
  if (!q) return;
  if (input) input.value = '';

  const chat = document.getElementById('arawy-chat');
  if (!chat) return;

  // User bubble
  chat.insertAdjacentHTML('beforeend', `
    <div style="display:flex;justify-content:flex-end">
      <div style="background:rgba(30,74,30,.8);border:1px solid var(--moss);border-radius:14px 0 14px 14px;
        padding:.6rem .9rem;max-width:80%">
        <div style="color:var(--cream);font-size:.9rem">${q}</div>
      </div>
    </div>`);

  // Typing indicator
  const typingId = 'typing-' + Date.now();
  chat.insertAdjacentHTML('beforeend', `
    <div id="${typingId}" style="display:flex;gap:.6rem;align-items:flex-start">
      <div style="font-size:1.4rem;flex-shrink:0">🦜</div>
      <div style="background:rgba(36,102,176,.15);border:1px solid var(--ara-blue);border-radius:0 14px 14px 14px;padding:.7rem .9rem">
        <div class="loader-dots"><span></span><span></span><span></span></div>
      </div>
    </div>`);
  chat.scrollTop = chat.scrollHeight;

  const answer = await ArawyAI.ask(q);

  // Remove typing indicator
  const typing = document.getElementById(typingId);
  if (typing) typing.remove();

  // Answer bubble
  chat.insertAdjacentHTML('beforeend', `
    <div style="display:flex;gap:.6rem;align-items:flex-start">
      <div style="font-size:1.4rem;flex-shrink:0;animation:float 4s ease-in-out infinite">🦜</div>
      <div style="background:rgba(36,102,176,.2);border:1px solid var(--ara-blue);border-radius:0 14px 14px 14px;padding:.7rem .9rem;flex:1">
        <div style="color:var(--cream);font-size:.9rem;line-height:1.6">${answer.replace(/\n/g,'<br>')}</div>
      </div>
    </div>`);
  chat.scrollTop = chat.scrollHeight;

  // TTS the response
  speakGuajajara(answer.substring(0, 100), answer.substring(0, 100));
}

// Inject Arawy AI panel
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  const navTabs = document.getElementById('navTabs');

  if (app) {
    const div = document.createElement('div');
    div.className = 'panel';
    div.id = 'panel-arawy';
    div.innerHTML = renderArawyPanel();
    app.appendChild(div);
  }
  if (navTabs) {
    const btn = document.createElement('button');
    btn.className = 'nav-tab';
    btn.innerHTML = '🦜 Arawy IA';
    btn.onclick = () => showPanelExtra('arawy');
    navTabs.insertBefore(btn, navTabs.children[5] || null);
  }
});
