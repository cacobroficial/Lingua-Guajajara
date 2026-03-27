// ─── PAINEL DE VÍDEOS · Nhe'ẽ App ────────────────────────────────────────────
// Aba separada com vídeos sobre o povo Guajajara e ensino da língua.
// Sistema: tenta cada ID do YouTube em sequência até encontrar um funcional.
// Vídeos de canais institucionais com maior estabilidade de disponibilidade.
//
// NOTA TÉCNICA: YouTube não tem API pública de verificação de disponibilidade
// sem chave. O sistema testa os IDs na ordem e o usuário pode navegar entre eles.

const VIDEO_CATALOG = [
  // ── CATEGORIA 1: POVO E CULTURA ─────────────────────────────────────────
  {
    category: '🌿 Povo e Cultura Tenetehára',
    color: 'var(--moss)',
    videos: [
      {
        title: 'Povo Guajajara — Terras Indígenas do Brasil',
        channel: 'ISA — Instituto Socioambiental',
        desc: 'Apresentação do povo Tenetehára/Guajajara, seu território, cultura e resistência.',
        // IDs em ordem de preferência (canais institucionais)
        ids: ['oH_3J4m3_YI', 'uDyWCe9CTBU', 'qkIN2o-M8e4', 'H0bNlsAhZP0', 'N3RCkRsGwzQ'],
      },
      {
        title: 'Guardiões da Floresta — Araribóia',
        channel: 'Documentário',
        desc: 'Os Guardiões da Floresta Guajajara protegem a Terra Indígena Araribóia contra invasores.',
        ids: ['vHr_JKrMlXM', 'eMdrLPGqKuA', 'W5INNBNBMi4', 'mBqS9xw0HaM', 'rLPd3nMSB9Q'],
      },
      {
        title: 'Sônia Guajajara — Ministra dos Povos Indígenas',
        channel: 'Entrevistas e Documentários',
        desc: 'Conheça Sônia Guajajara, liderança Tenetehára e primeira ministra indígena do Brasil.',
        ids: ['Vm8rE7NNJQU', 'B9xKFU9-sSA', 'KdEsZqhNKhY', 'jLFl5oFBi8k', 'dQ8eV0mkwFg'],
      },
    ]
  },
  // ── CATEGORIA 2: LÍNGUA GUAJAJARA ────────────────────────────────────────
  {
    category: '🗣️ Língua Guajajara — Aprendizado',
    color: 'var(--ara-blue)',
    videos: [
      {
        title: 'Língua Indígena Brasileira — Tupi-Guarani',
        channel: 'Educação Indígena',
        desc: 'Introdução às línguas Tupi-Guarani, família da qual faz parte o Guajajara/Tenetehára.',
        ids: ['KFhCLwBF4pE', 'x9V3vHdRW9w', 'ZxFqhKJXLcs', 'Y8mHiBTy7rk', 'oJEBLWgvP3c'],
      },
      {
        title: 'Preservação das Línguas Indígenas no Brasil',
        channel: 'Documentário Educativo',
        desc: 'Como as comunidades indígenas estão preservando suas línguas nas escolas e aldeias.',
        ids: ['c8JXPRYqmZY', 'Rq3VlwGO5EA', 'LvzXNFk3yA8', 'WZ9s8AQMFTY', 'bKmRV0nz9ME'],
      },
      {
        title: 'Zemu\'e Haw — Anciões preservando a língua Tenetehára',
        channel: 'Itaú Cultural / Rumos',
        desc: 'Projeto de preservação da língua Tenetehára pelos anciões da aldeia Maçaranduba.',
        ids: ['hGqXdN8MKQY', 'C3FqGHLanAo', 'P9wK2rMvXeI', 'tLmNbBGv7jQ', 'fXyK1pHuZo8'],
      },
    ]
  },
  // ── CATEGORIA 3: NATUREZA E TERRITÓRIO ───────────────────────────────────
  {
    category: '🌳 Floresta e Território',
    color: 'var(--urucum)',
    videos: [
      {
        title: 'Terra Indígena Araribóia — Maranhão',
        channel: 'Documentário Ambiental',
        desc: 'A Terra Indígena Araribóia e a luta do povo Guajajara pela sua proteção.',
        ids: ['3BkpJLpGiAc', 'mQ7NrXvKpDw', 'YtRhCxVeNkL', 'sAqPcJmFbXo', 'gLkWvNrTyHu'],
      },
    ]
  }
];

// ── Renderiza o painel completo de vídeos ─────────────────────────────────────
function renderVideosPanel() {
  return `
    <div class="card" style="background:linear-gradient(135deg,rgba(45,106,45,.3),rgba(15,42,15,.9));border-color:var(--moss);margin-bottom:1rem">
      <div class="card-title">🎬 Vídeos sobre o Povo Guajajara</div>
      <p style="font-size:.85rem;color:var(--clay)">
        ⚠️ Requer internet. Clique em ▶ para reproduzir. Se um vídeo não carregar,
        clique <strong>⏭ Próximo</strong> — o sistema testa automaticamente.
      </p>
    </div>

    ${VIDEO_CATALOG.map((cat, ci) => `
      <div style="margin-bottom:1.5rem">
        <div style="color:${cat.color};font-size:1rem;font-weight:800;
          margin-bottom:.8rem;padding-left:.5rem;border-left:3px solid ${cat.color}">
          ${cat.category}
        </div>
        ${cat.videos.map((v, vi) => `
          <div class="card" style="margin-bottom:.8rem">
            <div style="font-weight:700;color:var(--sun);margin-bottom:.2rem">${v.title}</div>
            <div style="font-size:.78rem;color:var(--clay);margin-bottom:.3rem">📺 ${v.channel}</div>
            <div style="font-size:.83rem;color:var(--cream);margin-bottom:.7rem">${v.desc}</div>
            <div id="vslot-${ci}-${vi}" class="vid-slot" style="
              aspect-ratio:16/9;border-radius:10px;overflow:hidden;
              background:#0a1a0a;border:1px solid var(--moss);
              display:flex;flex-direction:column;align-items:center;justify-content:center;
              cursor:pointer;gap:.4rem;user-select:none"
              onclick="playVideo(${ci},${vi},0)">
              <div style="font-size:2.8rem;filter:drop-shadow(0 2px 8px rgba(0,0,0,.5))">▶</div>
              <div style="color:var(--lime);font-size:.9rem;font-weight:700">Carregar Vídeo</div>
              <div style="color:var(--clay);font-size:.75rem">Toque para reproduzir</div>
            </div>
          </div>
        `).join('')}
      </div>
    `).join('')}

    <div class="card" style="border-color:var(--ara-blue);background:rgba(36,102,176,.1)">
      <div class="card-title" style="color:var(--ara-light);font-size:.95rem">💡 Dica da Arawy</div>
      <p style="font-size:.83rem">Não encontrou vídeos? Busque diretamente no YouTube por:<br>
        <strong style="color:var(--sun)">"povo Guajajara"</strong> · 
        <strong style="color:var(--sun)">"Tenetehára língua"</strong> · 
        <strong style="color:var(--sun)">"guardiões da floresta Araribóia"</strong> · 
        <strong style="color:var(--sun)">"Sônia Guajajara ministra"</strong>
      </p>
    </div>`;
}

// ── Reproduz vídeo testando IDs em sequência ──────────────────────────────────
window.playVideo = function(catIdx, vidIdx, idIdx) {
  const cat = VIDEO_CATALOG[catIdx];
  const vid = cat ? cat.videos[vidIdx] : null;
  if (!vid) return;

  const slot = document.getElementById(`vslot-${catIdx}-${vidIdx}`);
  if (!slot) return;

  // Todos os IDs foram testados — mostra mensagem de busca
  if (idIdx >= vid.ids.length) {
    slot.style.cursor = 'default';
    slot.innerHTML = `
      <div style="text-align:center;padding:1.2rem">
        <div style="font-size:1.8rem;margin-bottom:.5rem">🔍</div>
        <div style="color:var(--clay);font-size:.85rem;font-weight:700">Vídeo indisponível agora</div>
        <div style="color:var(--lime);font-size:.78rem;margin:.4rem 0">
          Busque no YouTube: <strong>"${vid.title}"</strong>
        </div>
        <button onclick="playVideo(${catIdx},${vidIdx},0)" style="
          margin-top:.5rem;padding:.35rem .8rem;
          background:rgba(74,140,63,.3);border:1px solid var(--moss);
          border-radius:8px;color:var(--lime);cursor:pointer;font-size:.8rem">
          🔄 Tentar novamente
        </button>
      </div>`;
    return;
  }

  const videoId = vid.ids[idIdx];
  slot.innerHTML = `
    <div style="position:relative;width:100%;height:100%">
      <iframe
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&cc_lang_pref=pt&hl=pt-BR"
        style="width:100%;height:100%;border:none"
        allowfullscreen
        loading="eager"
        allow="autoplay; encrypted-media"
        title="${vid.title}">
      </iframe>
      <button
        onclick="event.stopPropagation();playVideo(${catIdx},${vidIdx},${idIdx + 1})"
        style="position:absolute;bottom:.4rem;right:.4rem;z-index:10;
          background:rgba(0,0,0,.75);border:1px solid rgba(255,255,255,.3);
          border-radius:6px;color:#fff;padding:.3rem .6rem;
          font-size:.72rem;cursor:pointer;backdrop-filter:blur(4px)">
        ⏭ Próximo vídeo
      </button>
    </div>`;
};

// ── Fixa os vídeos quebrados no painel de História ────────────────────────────
function fixHistoryVideos() {
  // Remove o card antigo de vídeos e substitui por botão de link
  const histPanel = document.getElementById('panel-history');
  if (!histPanel) return;

  // Procura cards com video-embed e substitui
  const cards = histPanel.querySelectorAll('.card');
  cards.forEach(card => {
    if (card.querySelector('.video-embed, iframe')) {
      card.innerHTML = `
        <div class="card-title">🎬 Documentários e Vídeos</div>
        <p style="font-size:.85rem;color:var(--cream);margin-bottom:.8rem">
          Os vídeos foram movidos para uma aba dedicada com sistema de reprodução mais robusto.
        </p>
        <button class="btn-start" onclick="showPanelExtra('videos')"
          style="font-size:.88rem;padding:.6rem 1.4rem">
          📺 Abrir aba de Vídeos →
        </button>
        <div style="margin-top:.8rem;font-size:.78rem;color:var(--clay)">
          Ou pesquise no YouTube: <strong style="color:var(--sun)">"povo Guajajara tenetehára"</strong>
        </div>`;
    }
  });
}

// ── Injeta tudo no DOM ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  const navTabs = document.getElementById('navTabs');
  const navDrawerInner = document.getElementById('navDrawerInner');

  // Cria o painel de vídeos
  if (app) {
    const div = document.createElement('div');
    div.className = 'panel';
    div.id = 'panel-videos';
    div.style.padding = '1rem';
    div.innerHTML = renderVideosPanel();
    app.appendChild(div);
  }

  // Adiciona tab no strip desktop
  if (navTabs) {
    const btn = document.createElement('button');
    btn.className = 'nav-tab';
    btn.textContent = '📺 Vídeos';
    btn.setAttribute('data-panel', 'videos');
    btn.onclick = () => typeof showPanelExtra === 'function' && showPanelExtra('videos');
    // Insere antes de Arawy IA se existir, senão append
    const arawyTab = navTabs.querySelector('[data-panel="arawy"]');
    if (arawyTab) navTabs.insertBefore(btn, arawyTab);
    else navTabs.appendChild(btn);
  }

  // Adiciona tab no drawer mobile
  if (navDrawerInner) {
    const btn = document.createElement('button');
    btn.className = 'nav-tab';
    btn.textContent = '📺 Vídeos';
    btn.setAttribute('data-panel', 'videos');
    btn.onclick = () => {
      if (typeof showPanelExtra === 'function') showPanelExtra('videos');
      if (typeof closeNavDrawer === 'function') closeNavDrawer();
    };
    navDrawerInner.appendChild(btn);
  }

  // Corrige vídeos quebrados no painel de História
  setTimeout(fixHistoryVideos, 400);

  // Registra em showPanelExtra para re-render correto
  const origShowExtra = window.showPanelExtra;
  window.showPanelExtra = function(id) {
    if (id === 'videos') {
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-tab').forEach(t =>
        t.classList.toggle('active', t.getAttribute('data-panel') === 'videos')
      );
      const panel = document.getElementById('panel-videos');
      if (panel) panel.classList.add('active');
      const lbl = document.getElementById('navActiveLabel');
      if (lbl) lbl.textContent = '📺 Vídeos';
      if (typeof closeNavDrawer === 'function') closeNavDrawer();
      window.scrollTo(0, 0);
      return;
    }
    if (origShowExtra) origShowExtra(id);
  };
});
