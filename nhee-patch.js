// ═══════════════════════════════════════════════════════════════════════════════
// NHEE-PATCH.JS  ·  Fixes: favicon, nav sync, TTS upgrade, inconsistencies
// Carregue DEPOIS de todos os outros scripts
// ═══════════════════════════════════════════════════════════════════════════════

// ─── 1. FAVICON DINÂMICO ──────────────────────────────────────────────────────
// Gera um favicon PNG via Canvas (arara-azul + fundo floresta).
// Substitui qualquer <link rel="icon"> e evita o spinner de "carregando".
(function patchFavicon() {
  try {
    const sz = 64;
    const c  = document.createElement('canvas');
    c.width  = sz;
    c.height = sz;
    const ctx = c.getContext('2d');

    // Fundo verde floresta arredondado
    const r = 14;
    ctx.beginPath();
    ctx.moveTo(r,0); ctx.lineTo(sz-r,0);
    ctx.quadraticCurveTo(sz,0,sz,r);
    ctx.lineTo(sz,sz-r); ctx.quadraticCurveTo(sz,sz,sz-r,sz);
    ctx.lineTo(r,sz); ctx.quadraticCurveTo(0,sz,0,sz-r);
    ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0);
    ctx.closePath();
    ctx.fillStyle = '#0f2a0f';
    ctx.fill();

    // Corpo arara
    ctx.fillStyle = '#2466b0';
    ctx.beginPath(); ctx.ellipse(32,39,13,16,0,0,Math.PI*2); ctx.fill();
    // Cabeça
    ctx.beginPath(); ctx.ellipse(32,22,11,10,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#3a7fd6';
    ctx.beginPath(); ctx.ellipse(32,22,8,7.5,0,0,Math.PI*2); ctx.fill();
    // Barriga creme
    ctx.fillStyle = '#f5e6c0';
    ctx.beginPath(); ctx.ellipse(32,42,7,9,0,0,Math.PI*2); ctx.fill();
    // Bico
    ctx.fillStyle = '#1a1a00';
    ctx.beginPath(); ctx.moveTo(26,26); ctx.quadraticCurveTo(23,30,27,28);
    ctx.quadraticCurveTo(26,26,26,26); ctx.fill();
    // Olhos
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(26,18,3.5,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(38,18,3.5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath(); ctx.arc(26,18,2,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(38,18,2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(27,17,0.8,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(39,17,0.8,0,Math.PI*2); ctx.fill();
    // Anel amarelo
    ctx.strokeStyle = '#f5b942'; ctx.lineWidth = 2; ctx.beginPath();
    ctx.moveTo(22,24); ctx.quadraticCurveTo(24,31,32,31);
    ctx.quadraticCurveTo(40,31,42,24); ctx.stroke();
    // Asas
    ctx.fillStyle = '#1a55a0';
    ctx.save(); ctx.translate(17,37); ctx.rotate(-0.26);
    ctx.beginPath(); ctx.ellipse(0,0,9,14,0,0,Math.PI*2); ctx.fill();
    ctx.restore();
    ctx.save(); ctx.translate(47,37); ctx.rotate(0.26);
    ctx.beginPath(); ctx.ellipse(0,0,9,14,0,0,Math.PI*2); ctx.fill();
    ctx.restore();
    // Cauda
    ctx.fillStyle = '#1a55a0';
    ctx.beginPath();
    ctx.moveTo(25,56); ctx.quadraticCurveTo(32,64,39,56);
    ctx.quadraticCurveTo(36,60,32,61); ctx.quadraticCurveTo(28,60,25,56);
    ctx.fill();

    const url = c.toDataURL('image/png');
    // Remove todos os favicons existentes e injeta novo
    document.querySelectorAll('link[rel*="icon"]').forEach(l => l.remove());
    const lnk = document.createElement('link');
    lnk.rel  = 'icon';
    lnk.type = 'image/png';
    lnk.href = url;
    document.head.appendChild(lnk);
    // Apple touch icon
    const apple = document.createElement('link');
    apple.rel  = 'apple-touch-icon';
    apple.href = url;
    document.head.appendChild(apple);
  } catch(e) { console.warn('[patch] favicon:', e); }
})();


// ─── 2. NAV UNIFICADO ─────────────────────────────────────────────────────────
// Problema: botões do HTML original não têm data-panel → showPanelExtra não
// consegue marcar ativo. Solução: percorre todos .nav-tab sem data-panel e
// atribui baseado no texto, depois unifica showPanel / showPanelExtra.

(function patchNav() {
  // Mapa texto → panel-id (cobre original + extras injetados depois)
  const TEXT_MAP = {
    '🏠 Início':      'home',
    '📜 História':    'history',
    '📚 Curso':       'course',
    '🎵 Pronúncia':   'pronunciation',
    '📖 Dicionário':  'dictionary',
    '🏆 Quiz':        'quiz',
    '🔁 Flashcards':  'flashcards',
    '🎤 Pronúncia':   'voice',          // label diferente → voice panel
    '✍️ Escrita':     'writing',
    '🗣️ Conversação': 'conversation',
    '📖 Histórias':   'stories',
    '🎮 Jogo':        'match',
    '📊 Progresso':   'profile',
    '🔔 Notif.':      'notif',
    '🦜 Arawy IA':    'arawy',
  };

  // Aguarda DOM completo (scripts extras podem ter adicionado mais botões)
  function applyDataPanel() {
    document.querySelectorAll('.nav-tab').forEach(btn => {
      const label = btn.textContent.trim();
      const id    = TEXT_MAP[label];
      if (id && !btn.getAttribute('data-panel')) {
        btn.setAttribute('data-panel', id);
      }
    });
  }

  // Roda imediatamente e de novo em 1 s (quando extras já carregaram)
  applyDataPanel();
  setTimeout(applyDataPanel, 1000);
  setTimeout(applyDataPanel, 2500);

  // Patch showPanel: adiciona data-panel aos botões estáticos e sincroniza drawer
  const _origShowPanel = window.showPanel;
  window.showPanel = function(id) {
    if (_origShowPanel) _origShowPanel(id);
    applyDataPanel();
    // Garante que TODOS os tabs com data-panel=id ficam ativos
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-panel') === id);
    });
    // Atualiza label mobile (showPanel original faz isso via labelMap, mas
    // só para 6 painéis — este bloco cobre os extras)
    const lbl = document.getElementById('navActiveLabel');
    if (lbl) {
      const found = document.querySelector(`.nav-tab[data-panel="${id}"]`);
      if (found) lbl.textContent = found.textContent.trim();
    }
    if (typeof closeNavDrawer === 'function') closeNavDrawer();
  };

  // Patch showPanelExtra: chama o mesmo fluxo do showPanel agora unificado
  window.showPanelExtra = function(id) {
  // Single authoritative definition — all extra panels
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

  const panel = document.getElementById('panel-' + id);
  if (panel) {
    panel.classList.add('active');
    // Re-render dynamic panels
    const renders = {
      profile:      () => typeof Progress !== 'undefined' ? Progress.renderProfilePanel() : '',
      flashcards:   () => typeof renderFlashcardsPanel   !== 'undefined' ? renderFlashcardsPanel()   : '',
      voice:        () => typeof renderVoicePracticePanel!== 'undefined' ? renderVoicePracticePanel() : '',
      writing:      () => typeof renderWritingPanel      !== 'undefined' ? renderWritingPanel()       : '',
      match:        () => typeof renderMatchPanel        !== 'undefined' ? renderMatchPanel()         : '',
      conversation: () => typeof renderConversationPanel !== 'undefined' ? renderConversationPanel()  : '',
      stories:      () => typeof renderStoriesPanel      !== 'undefined' ? renderStoriesPanel()       : '',
      notif:        () => typeof renderNotifPanel        !== 'undefined' ? renderNotifPanel()         : '',
      videos:       () => typeof renderVideosPanel       !== 'undefined' ? renderVideosPanel()        : '',
    };
    // Arawy: re-ancorar eventos em vez de re-renderizar (preserva histórico)
    if (id === 'arawy') {
      if (typeof _attachArawyEvents === 'function') _attachArawyEvents();
      if (typeof _checkArawyDot === 'function') setTimeout(_checkArawyDot, 300);
    } else if (renders[id]) {
      const html = renders[id]();
      if (html) panel.innerHTML = html;
    }
  }

  // Sync active tabs (both primary strip and drawer)
  document.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.toggle('active', t.getAttribute('data-panel') === id);
  });

  // Update mobile label
  const lbl = document.getElementById('navActiveLabel');
  if (lbl) {
    const found = document.querySelector('.nav-tab[data-panel="' + id + '"]');
    if (found) lbl.textContent = found.textContent.trim();
  }

  if (typeof closeNavDrawer === 'function') closeNavDrawer();
  window.scrollTo(0, 0);
};

// 4b. Lição: escapa aspas simples em palavras com apóstrofo (ex: "ko'i")
//     Problema: onclick="speakGuajajara('ko'i',...)" quebra o HTML
//     Solução já estava em showLesson mas vocab-extra.js não usava — patch centralizado
window._safeAttr = function(s) {
  return (s || '').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/"/g,'&quot;');
};

// 4c. Features-extra: renderDict chamada antes de allWords populado
//     Patch: re-init dict quando painel dicionário abre
const _origShowPanelNative = window.showPanel;
window.showPanel = function(id) {
  if (id === 'dictionary' && typeof allWords !== 'undefined' && allWords.length === 0) {
    if (typeof initDict === 'function') initDict();
  }
  if (_origShowPanelNative) _origShowPanelNative(id);
};

// 4d. features-extra tenta usar VOCAB antes do vocab-extra.js carregar módulos
//     Patch: re-render flashcards/writing se VOCAB mudou após DOMContentLoaded
window.addEventListener('load', function() {
  // Força merge se vocab-extra não rodou ainda
  if (typeof VOCAB_EXTRA !== 'undefined' && typeof VOCAB !== 'undefined') {
    Object.assign(VOCAB, VOCAB_EXTRA);
    if (typeof LEVELS !== 'undefined') {
      const bAdd = ['escola','clima','trabalho','cantos'];
      const iAdd = ['emocoes','plantas'];
      bAdd.forEach(k => { if (!LEVELS.basic.modules.includes(k)) LEVELS.basic.modules.push(k); });
      iAdd.forEach(k => { if (!LEVELS.inter.modules.includes(k)) LEVELS.inter.modules.push(k); });
    }
  }
});

// 4e. Arawy chat: speakPT chamada mas arawy-ai.js pode não ter redefinido
//     Garante que speakPT existe e usa speakGuajajara PT-BR
if (typeof window.speakPT === 'undefined') {
  window.speakPT = function(text) {
    if (!text) return;
    const t = text.substring(0, 200);
    if (window.responsiveVoice && window.responsiveVoice.voiceSupport()) {
      window.responsiveVoice.speak(t, 'Brazilian Portuguese Female', { rate: 0.88 });
    } else if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(t);
      u.lang = 'pt-BR'; u.rate = 0.88;
      const voices = window.speechSynthesis.getVoices().filter(v=>v.lang.startsWith('pt'));
      if (voices.length) u.voice = voices[0];
      setTimeout(() => window.speechSynthesis.speak(u), 80);
    }
  };
}

// 4f. Fecha drawer ao clicar fora — já existe em app.js mas reforça caso
//     o elemento #navWrapper seja criado depois
document.addEventListener('click', function(e) {
  const w = document.getElementById('navWrapper');
  if (w && !w.contains(e.target)) {
    if (typeof closeNavDrawer === 'function') closeNavDrawer();
  }
}, { passive: true });

// 4g. Estilo: garante que .nav-tabs-primary (desktop) usa flex-wrap corretamente
//     para as novas tabs injetadas pelos extras não causarem overflow
(function patchNavCSS() {
  const style = document.createElement('style');
  style.textContent = `
    /* Garante wrap correto das tabs desktop */
    #navTabs.nav-tabs-primary {
      flex-wrap: wrap !important;
      max-height: none !important;
      overflow: visible !important;
    }
    /* Drawer mobile: sempre mostra as extras */
    #navDrawerInner {
      grid-template-columns: 1fr 1fr !important;
    }
    /* Tab ativa mais visível no drawer */
    .nav-drawer .nav-tab.active {
      background: var(--urucum) !important;
      color: #fff !important;
      border-color: var(--clay) !important;
    }
    /* Garante que o topbar-mascot não sobreponha as tabs */
    .topbar-mascot { margin-left: auto; flex-shrink: 0; }

    /* Responsivo: mobile label mostra tab atual com ícone */
    .nav-active-label {
      font-size: .88rem !important;
    }

    /* TTS voice label no guia de pronúncia */
    #tts-voice-name {
      font-size: .8rem;
      color: var(--clay);
      font-style: italic;
    }

    /* Fix: vocab-card TTS button não sobrepõe texto em telas pequenas */
    .vocab-card { align-items: flex-start; }
    .tts-btn { flex-shrink: 0; margin-top: .2rem; }
  `;
  style.id = 'nhee-patch-css';
  document.head.appendChild(style);
})();


// ─── 5. ATUALIZA LABEL DO TTS NA TELA DE PRONÚNCIA ───────────────────────────
// A tela de pronúncia tem um span id="tts-voice-name" que mostra a voz atual.
// Este patch garante que ele seja criado se não existir.
(function patchPronunciationPanel() {
  function injectVoiceInfo() {
    const panels = document.querySelectorAll('#panel-pronunciation .card');
    if (!panels.length) return;
    const last = panels[panels.length - 1];
    if (document.getElementById('tts-voice-name')) return;
    const info = document.createElement('div');
    info.className = 'card';
    info.style.marginTop = '.8rem';
    info.innerHTML = `
      <div class="card-title" style="font-size:1rem">🔊 Motor de Voz Ativo</div>
      <div id="tts-voice-name" style="color:var(--clay);font-size:.85rem">
        Detectando voz disponível...
      </div>
      <div style="color:var(--clay);font-size:.78rem;margin-top:.4rem;line-height:1.5">
        📌 A pronúncia do Guajajara é gerada fonetizando o texto para pt-BR.<br>
        Para pronúncia 100% autêntica, áudios nativos Tenetehára são necessários.
      </div>
    `;
    last.parentNode.insertBefore(info, last.nextSibling);
    // Atualiza label agora
    setTimeout(() => {
      if (typeof updateVoiceLabel === 'function') updateVoiceLabel();
    }, 500);
  }
  // Tenta imediatamente e após carregamento
  setTimeout(injectVoiceInfo, 800);
  setTimeout(injectVoiceInfo, 3000);
})();


console.log('[Nhe\'ẽ Patch] ✓ Favicon, Nav, TTS, inconsistências — aplicados.');
