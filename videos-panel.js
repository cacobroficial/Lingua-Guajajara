// ─── PAINEL DE VÍDEOS · Nhe'ẽ App ────────────────────────────────────────────
// Vídeos verificados: TV Cultura (embed real) + Netflix link + buscas guiadas

const VERIFIED_VIDEOS = [
  {
    id: 'roda-viva',
    title: '🎙️ Roda Viva — Sônia Guajajara (TV Cultura, 2023)',
    channel: 'TV Cultura • Programa completo 1h30',
    desc: 'A líder indígena e ministra dos Povos Indígenas fala sobre o povo Tenetehára, território, língua, resistência e direitos. Entrevistada por jornalistas especializados.',
    badge: '✅ Verificado · TV Cultura',
    type: 'cultura_play',
    src: 'https://culturaplay.tvcultura.com.br/embeds/698-roda-viva-sonia-guajajara-20-03-2023/embed',
  },
  {
    id: 'somos-guardioes',
    title: '🎬 Somos Guardiões (Netflix, 2023)',
    channel: 'Dir. Edivan Guajajara · Prod. Leonardo DiCaprio',
    desc: 'Documentário premiado que acompanha Marçal Guajajara e os Guardiões da Floresta na defesa da Terra Indígena Araribóia. Vencedor do Festival de São Paulo e Raindance.',
    badge: '🏆 Premiado internacionalmente',
    type: 'netflix',
    netflix: 'https://www.netflix.com/title/81737597',
    trailer: 'https://www.youtube.com/watch?v=9oNUaTPHBMk',
  },
  {
    id: 'search-historia',
    title: '🔍 Buscar: História do Povo Guajajara',
    channel: 'YouTube',
    desc: 'Busca guiada por vídeos sobre história, cultura e cotidiano do povo Tenetehára.',
    badge: '🔗 Busca direta no YouTube',
    type: 'search',
    query: 'povo Guajajara Tenetehára história cultura documentário',
  },
  {
    id: 'search-lingua',
    title: '🔍 Buscar: Língua Guajajara',
    channel: 'YouTube',
    desc: 'Vídeos sobre o aprendizado e preservação da língua Guajajara.',
    badge: '🔗 Busca direta no YouTube',
    type: 'search',
    query: 'língua Guajajara Tenetehára aprender palavras educação indígena',
  },
];

function renderVideosPanel() {
  return `
    <div class="card" style="background:linear-gradient(135deg,rgba(45,106,45,.3),rgba(15,42,15,.9));border-color:var(--moss)">
      <div class="card-title">🎬 Vídeos — Povo Guajajara</div>
      <p style="font-size:.82rem;color:var(--clay)">
        Fontes verificadas. Requer internet para reproduzir.
      </p>
    </div>
    ${VERIFIED_VIDEOS.map(v => renderVideoCard(v)).join('')}
    <div class="card" style="border-color:var(--ara-blue);background:rgba(36,102,176,.08)">
      <div class="card-title" style="color:var(--ara-light);font-size:.9rem">🦜 Arawy sugere</div>
      <p style="font-size:.82rem">Busque também:
        <strong style="color:var(--sun)">"povo Guajajara"</strong> ·
        <strong style="color:var(--sun)">"Somos Guardiões"</strong> ·
        <strong style="color:var(--sun)">"Sônia Guajajara"</strong>
      </p>
    </div>`;
}

function renderVideoCard(v) {
  let action = '';
  if (v.type === 'cultura_play') {
    action = `
      <div id="vslot-${v.id}" style="aspect-ratio:16/9;border-radius:10px;overflow:hidden;
        background:#0a1a0a;border:1px solid var(--moss);display:flex;flex-direction:column;
        align-items:center;justify-content:center;cursor:pointer;gap:.4rem"
        onclick="loadCulturaPlay('${v.id}','${v.src}')">
        <div style="font-size:2.5rem">▶</div>
        <div style="color:var(--lime);font-size:.88rem;font-weight:700">Carregar vídeo</div>
        <div style="color:var(--clay);font-size:.75rem">TV Cultura — clique para reproduzir</div>
      </div>`;
  } else if (v.type === 'netflix') {
    action = `
      <div style="display:flex;gap:.6rem;flex-wrap:wrap">
        <a href="${v.netflix}" target="_blank" rel="noopener"
          style="padding:.6rem 1.2rem;background:#e50914;border:none;border-radius:10px;
          color:#fff;font-weight:700;font-size:.88rem;text-decoration:none;
          display:inline-flex;align-items:center;gap:.4rem">▶ Assistir na Netflix</a>
        <a href="${v.trailer}" target="_blank" rel="noopener"
          style="padding:.6rem 1.2rem;background:rgba(255,0,0,.2);
          border:1px solid rgba(255,0,0,.4);border-radius:10px;color:#ff6666;
          font-weight:700;font-size:.88rem;text-decoration:none">🎬 Trailer</a>
      </div>`;
  } else if (v.type === 'search') {
    const url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(v.query);
    action = `
      <a href="${url}" target="_blank" rel="noopener"
        style="display:inline-flex;align-items:center;gap:.5rem;padding:.6rem 1.2rem;
        background:rgba(255,0,0,.15);border:1px solid rgba(255,0,0,.3);border-radius:10px;
        color:#ff8888;font-weight:700;font-size:.88rem;text-decoration:none">
        🔍 Buscar no YouTube
      </a>`;
  }
  return `
    <div class="card" style="margin-bottom:.8rem">
      <div style="font-weight:800;color:var(--sun);font-size:.95rem;margin-bottom:.2rem">${v.title}</div>
      <div style="font-size:.75rem;color:var(--clay);margin-bottom:.3rem">📺 ${v.channel}</div>
      <span style="display:inline-block;font-size:.72rem;padding:.2rem .6rem;border-radius:20px;
        background:rgba(74,140,63,.2);color:var(--lime);border:1px solid var(--moss);
        margin-bottom:.5rem">${v.badge}</span>
      <p style="font-size:.83rem;color:var(--cream);margin-bottom:.7rem">${v.desc}</p>
      ${action}
    </div>`;
}

window.loadCulturaPlay = function(id, src) {
  const slot = document.getElementById('vslot-' + id);
  if (!slot) return;
  slot.style.cursor = 'default';
  slot.innerHTML = `<iframe src="${src}" style="width:100%;height:100%;border:none"
    allowfullscreen allow="autoplay; encrypted-media"
    title="Roda Viva Sônia Guajajara TV Cultura"></iframe>`;
};

// ─── INJEÇÃO NO DOM ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  const navTabs = document.getElementById('navTabs');
  const navDrawerInner = document.getElementById('navDrawerInner');

  if (app && !document.getElementById('panel-videos')) {
    const div = document.createElement('div');
    div.className = 'panel';
    div.id = 'panel-videos';
    div.style.padding = '1rem';
    div.innerHTML = renderVideosPanel();
    app.appendChild(div);
  }

  function makeBtn(forDrawer) {
    const btn = document.createElement('button');
    btn.className = 'nav-tab';
    btn.textContent = '📺 Vídeos';
    btn.setAttribute('data-panel', 'videos');
    btn.onclick = () => {
      if (typeof showPanelExtra === 'function') showPanelExtra('videos');
      if (forDrawer && typeof closeNavDrawer === 'function') closeNavDrawer();
    };
    return btn;
  }
  if (navTabs && !navTabs.querySelector('[data-panel="videos"]'))
    navTabs.insertBefore(makeBtn(false), navTabs.querySelector('[data-panel="arawy"]') || null);
  if (navDrawerInner && !navDrawerInner.querySelector('[data-panel="videos"]'))
    navDrawerInner.appendChild(makeBtn(true));

  // Atualiza card de vídeos no painel História
  setTimeout(() => {
    const hist = document.getElementById('panel-history');
    if (!hist) return;
    hist.querySelectorAll('.card').forEach(card => {
      if (card.querySelector('iframe, .video-embed, .vid-slot') ||
          card.textContent.includes('Documentários e Vídeos') ||
          card.textContent.includes('movidos para')) {
        card.innerHTML = `
          <div class="card-title">🎬 Documentários e Vídeos</div>
          <p style="font-size:.85rem;color:var(--cream);margin-bottom:.8rem">
            Vídeos verificados sobre o povo Guajajara — incluindo o Roda Viva com
            Sônia Guajajara (TV Cultura) e o documentário "Somos Guardiões" (Netflix).
          </p>
          <button class="btn-start"
            onclick="if(typeof showPanelExtra==='function')showPanelExtra('videos')"
            style="font-size:.88rem;padding:.6rem 1.4rem">📺 Ver Vídeos →</button>`;
      }
    });
  }, 500);
});
