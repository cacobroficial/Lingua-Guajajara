// ─── FEATURES EXTRA · Nhe'ẽ App ──────────────────────────────────────────────
// Flashcards SRS, Progresso, Voz, Escrita, Notificações, Histórias

// ═══════════════════════════════════════════════════════════════════════════════
// 1. SISTEMA DE PROGRESSO & XP
// ═══════════════════════════════════════════════════════════════════════════════
const Progress = {
  _key: 'nhee_progress',

  get() {
    try {
      const d = JSON.parse(localStorage.getItem(this._key) || '{}');
      return {
        xp: d.xp || 0,
        level: d.level || 1,
        streak: d.streak || 0,
        lastDate: d.lastDate || null,
        wordsLearned: d.wordsLearned || [],
        modulesCompleted: d.modulesCompleted || [],
        quizHistory: d.quizHistory || [],
        totalQuizzes: d.totalQuizzes || 0,
        badges: d.badges || [],
        ...d
      };
    } catch { return { xp: 0, level: 1, streak: 0, lastDate: null, wordsLearned: [], modulesCompleted: [], quizHistory: [], totalQuizzes: 0, badges: [] }; }
  },

  save(data) {
    try { localStorage.setItem(this._key, JSON.stringify(data)); } catch {}
  },

  addXP(amount, reason) {
    const d = this.get();
    d.xp += amount;
    const newLevel = Math.floor(d.xp / 200) + 1;
    const leveledUp = newLevel > d.level;
    d.level = newLevel;
    this.save(d);
    this.showXPToast(amount, reason, leveledUp);
    return { xp: d.xp, level: d.level, leveledUp };
  },

  markWordLearned(wordId) {
    const d = this.get();
    if (!d.wordsLearned.includes(wordId)) {
      d.wordsLearned.push(wordId);
      this.save(d);
      this.addXP(5, 'Palavra aprendida!');
    }
  },

  completeModule(modKey) {
    const d = this.get();
    if (!d.modulesCompleted.includes(modKey)) {
      d.modulesCompleted.push(modKey);
      this.save(d);
      this.addXP(50, 'Módulo concluído!');
      this.checkBadges(d);
    }
  },

  updateStreak() {
    const d = this.get();
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (d.lastDate === today) return d.streak;
    if (d.lastDate === yesterday) {
      d.streak++;
    } else if (d.lastDate !== today) {
      d.streak = 1;
    }
    d.lastDate = today;
    this.save(d);
    if (d.streak > 1) this.addXP(10 * d.streak, `${d.streak} dias seguidos!`);
    return d.streak;
  },

  checkBadges(d) {
    const newBadges = [];
    if (d.wordsLearned.length >= 10 && !d.badges.includes('first10')) newBadges.push({ id: 'first10', name: '🌱 Primeiras 10 palavras', desc: 'Aprendeu 10 palavras!' });
    if (d.wordsLearned.length >= 50 && !d.badges.includes('fifty')) newBadges.push({ id: 'fifty', name: '🌿 Cinquenta palavras', desc: '50 palavras!' });
    if (d.wordsLearned.length >= 100 && !d.badges.includes('hundred')) newBadges.push({ id: 'hundred', name: '🌳 Cem palavras', desc: '100 palavras! Incrível!' });
    if (d.streak >= 7 && !d.badges.includes('week')) newBadges.push({ id: 'week', name: '🔥 7 dias seguidos', desc: 'Uma semana de prática!' });
    if (d.modulesCompleted.length >= 5 && !d.badges.includes('modules5')) newBadges.push({ id: 'modules5', name: '📚 5 módulos', desc: 'Completou 5 módulos!' });
    newBadges.forEach(b => {
      d.badges.push(b.id);
      this.showBadgeToast(b);
    });
    if (newBadges.length) this.save(d);
  },

  showXPToast(amount, reason, leveledUp) {
    const t = document.createElement('div');
    t.style.cssText = `position:fixed;bottom:6rem;left:50%;transform:translateX(-50%);
      background:var(--canopy);border:1px solid var(--sun);border-radius:20px;
      padding:.5rem 1.2rem;color:var(--sun);font-family:'Nunito',sans-serif;font-weight:800;
      font-size:.9rem;z-index:9999;animation:slideUp .4s ease;white-space:nowrap;
      box-shadow:0 4px 16px rgba(0,0,0,.4);`;
    t.textContent = `+${amount} XP ${reason ? '· ' + reason : ''}${leveledUp ? ' 🎉 Novo nível!' : ''}`;
    document.body.appendChild(t);
    setTimeout(() => t.style.opacity = '0', 1800);
    setTimeout(() => t.remove(), 2200);
  },

  showBadgeToast(badge) {
    const t = document.createElement('div');
    t.style.cssText = `position:fixed;bottom:8rem;left:50%;transform:translateX(-50%);
      background:linear-gradient(135deg,var(--sky),var(--ara-blue));border:1px solid var(--ara-light);
      border-radius:16px;padding:.8rem 1.4rem;color:#fff;font-family:'Nunito',sans-serif;
      font-size:.9rem;z-index:9999;text-align:center;white-space:nowrap;
      box-shadow:0 4px 20px rgba(36,102,176,.5);`;
    t.innerHTML = `<div style="font-size:1.2rem">${badge.name}</div><div style="opacity:.8;font-size:.8rem">${badge.desc}</div>`;
    document.body.appendChild(t);
    setTimeout(() => t.style.opacity = '0', 3000);
    setTimeout(() => t.remove(), 3500);
  },

  renderProfilePanel() {
    const d = this.get();
    const xpToNext = 200 - (d.xp % 200);
    const pct = Math.round(((d.xp % 200) / 200) * 100);
    return `
      <div class="card" style="background:linear-gradient(135deg,rgba(36,102,176,.25),rgba(15,42,15,.9));border-color:var(--ara-blue);text-align:center;padding:1.5rem">
        <div style="font-size:3rem;margin-bottom:.5rem">🦜</div>
        <div style="font-family:'Playfair Display',serif;font-size:1.8rem;color:var(--sun)">Nível ${d.level}</div>
        <div style="color:var(--lime);margin:.3rem 0">${d.xp} XP total · +${xpToNext} XP para próximo nível</div>
        <div style="background:rgba(74,140,63,.2);border-radius:10px;height:10px;margin:.5rem 0;overflow:hidden">
          <div style="background:linear-gradient(90deg,var(--moss),var(--lime));height:100%;width:${pct}%;border-radius:10px;transition:width .5s"></div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.7rem;margin:.8rem 0">
        <div class="card" style="text-align:center">
          <div style="font-size:1.8rem;font-weight:800;color:var(--sun)">${d.streak}</div>
          <div style="font-size:.78rem;color:var(--clay)">🔥 Dias seguidos</div>
        </div>
        <div class="card" style="text-align:center">
          <div style="font-size:1.8rem;font-weight:800;color:var(--lime)">${d.wordsLearned.length}</div>
          <div style="font-size:.78rem;color:var(--clay)">📖 Palavras</div>
        </div>
        <div class="card" style="text-align:center">
          <div style="font-size:1.8rem;font-weight:800;color:var(--ara-light)">${d.modulesCompleted.length}</div>
          <div style="font-size:.78rem;color:var(--clay)">✅ Módulos</div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">🏅 Conquistas</div>
        ${d.badges.length === 0
          ? '<p style="color:var(--clay);font-size:.87rem">Complete atividades para ganhar conquistas!</p>'
          : `<div style="display:flex;flex-wrap:wrap;gap:.5rem">${d.badges.map(bid => {
              const all = [
                {id:'first10',name:'🌱 10 palavras'},{id:'fifty',name:'🌿 50 palavras'},
                {id:'hundred',name:'🌳 100 palavras'},{id:'week',name:'🔥 7 dias'},
                {id:'modules5',name:'📚 5 módulos'}
              ];
              const b = all.find(x=>x.id===bid);
              return b ? `<span class="badge badge-green">${b.name}</span>` : '';
            }).join('')}</div>`
        }
      </div>
    `;
  }
};


// ═══════════════════════════════════════════════════════════════════════════════
// 2. FLASHCARDS COM REPETIÇÃO ESPAÇADA (SRS — algoritmo SM-2 simplificado)
// ═══════════════════════════════════════════════════════════════════════════════
const SRS = {
  _key: 'nhee_srs',

  getCards() {
    try { return JSON.parse(localStorage.getItem(this._key) || '{}'); } catch { return {}; }
  },

  saveCards(cards) {
    try { localStorage.setItem(this._key, JSON.stringify(cards)); } catch {}
  },

  getCard(id) {
    const cards = this.getCards();
    return cards[id] || { interval: 1, easeFactor: 2.5, dueDate: 0, reps: 0 };
  },

  // quality: 0=falhou, 1=difícil, 2=bom, 3=fácil
  review(id, quality) {
    const cards = this.getCards();
    let c = this.getCard(id);
    const now = Date.now();

    if (quality >= 2) {
      if (c.reps === 0) c.interval = 1;
      else if (c.reps === 1) c.interval = 6;
      else c.interval = Math.round(c.interval * c.easeFactor);
      c.reps++;
    } else {
      c.reps = 0;
      c.interval = 1;
    }
    c.easeFactor = Math.max(1.3, c.easeFactor + 0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02));
    c.dueDate = now + c.interval * 86400000;
    cards[id] = c;
    this.saveCards(cards);
    return c;
  },

  getDueCards(modKey) {
    const mod = (typeof VOCAB !== 'undefined' && VOCAB[modKey]) ? VOCAB[modKey] : null;
    if (!mod) return [];
    const cards = this.getCards();
    const now = Date.now();
    return mod.words.map((w, i) => {
      const id = `${modKey}_${i}`;
      const card = cards[id] || { interval: 1, dueDate: 0, reps: 0 };
      return { ...w, id, due: card.dueDate <= now, dueDate: card.dueDate, reps: card.reps };
    }).filter(c => c.due);
  },

  renderFlashcard(card, onRate) {
    const el = document.createElement('div');
    el.innerHTML = `
      <div style="perspective:800px;cursor:pointer;margin:1rem 0" id="fc-wrap" onclick="this.querySelector('.fc-inner').style.transform='rotateY(180deg)'">
        <div class="fc-inner" style="position:relative;width:100%;min-height:200px;transition:transform .5s;transform-style:preserve-3d">
          <div style="position:absolute;width:100%;backface-visibility:hidden;background:linear-gradient(135deg,rgba(30,74,30,.9),rgba(15,42,15,.95));border:1px solid var(--sun);border-radius:20px;padding:2rem;text-align:center">
            <div style="font-size:.8rem;color:var(--clay);margin-bottom:.8rem;letter-spacing:.1em">GUAJAJARA</div>
            <div style="font-family:'Playfair Display',serif;font-size:2rem;color:var(--sun)">${card.g}</div>
            <div style="color:var(--clay);font-style:italic;margin-top:.4rem">/${card.ph}/</div>
            <div style="color:var(--lime);font-size:.82rem;margin-top:.8rem">Toque para revelar →</div>
          </div>
          <div style="position:absolute;width:100%;backface-visibility:hidden;transform:rotateY(180deg);background:linear-gradient(135deg,rgba(36,102,176,.3),rgba(15,42,15,.95));border:1px solid var(--ara-blue);border-radius:20px;padding:2rem;text-align:center">
            <div style="font-size:.8rem;color:var(--clay);margin-bottom:.8rem;letter-spacing:.1em">PORTUGUÊS</div>
            <div style="font-family:'Playfair Display',serif;font-size:1.6rem;color:var(--cream)">${card.pt}</div>
            ${card.ex ? `<div style="color:var(--lime);font-size:.85rem;margin-top:.7rem;border-top:1px solid rgba(74,140,63,.3);padding-top:.7rem">${card.ex}</div>` : ''}
          </div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:.5rem;margin-top:.5rem">
        <button onclick="srsRateCard('${card.id}',0)" style="padding:.6rem .2rem;border-radius:10px;border:none;background:rgba(200,50,20,.3);color:#ff9977;font-size:.8rem;font-weight:700;cursor:pointer">😰<br>Falhou</button>
        <button onclick="srsRateCard('${card.id}',1)" style="padding:.6rem .2rem;border-radius:10px;border:none;background:rgba(180,120,0,.3);color:#ffcc77;font-size:.8rem;font-weight:700;cursor:pointer">😓<br>Difícil</button>
        <button onclick="srsRateCard('${card.id}',2)" style="padding:.6rem .2rem;border-radius:10px;border:none;background:rgba(40,120,40,.3);color:var(--lime);font-size:.8rem;font-weight:700;cursor:pointer">😊<br>Bom</button>
        <button onclick="srsRateCard('${card.id}',3)" style="padding:.6rem .2rem;border-radius:10px;border:none;background:rgba(36,102,176,.3);color:var(--ara-light);font-size:.8rem;font-weight:700;cursor:pointer">😄<br>Fácil</button>
      </div>
    `;
    return el;
  }
};

let srsQueue = [], srsCurrentIdx = 0, srsModKey = null;

function startSRS(modKey) {
  srsModKey = modKey;
  srsQueue = SRS.getDueCards(modKey);
  if (srsQueue.length === 0) {
    // If no due cards, use all words
    const mod = VOCAB[modKey];
    if (!mod) return;
    const cards = SRS.getCards();
    srsQueue = mod.words.map((w, i) => ({ ...w, id: `${modKey}_${i}` }));
  }
  srsQueue = shuffle(srsQueue);
  srsCurrentIdx = 0;
  showSRSCard();
}

function showSRSCard() {
  const container = document.getElementById('srs-container');
  if (!container) return;
  if (srsCurrentIdx >= srsQueue.length) {
    container.innerHTML = `
      <div class="card" style="text-align:center;padding:2rem">
        <div style="font-size:3rem">🎉</div>
        <div style="font-family:'Playfair Display',serif;color:var(--sun);font-size:1.4rem">Sessão concluída!</div>
        <div style="color:var(--lime);margin:.5rem 0">${srsQueue.length} flashcards revisados</div>
        <button class="btn-start" onclick="startSRS('${srsModKey}')" style="font-size:.9rem;padding:.6rem 1.5rem;margin-top:.8rem">Repetir →</button>
      </div>`;
    Progress.addXP(20 * srsQueue.length, 'Flashcards revisados!');
    return;
  }
  const card = srsQueue[srsCurrentIdx];
  const progress = `<div style="text-align:center;color:var(--lime);font-size:.85rem;margin-bottom:.5rem">${srsCurrentIdx+1} / ${srsQueue.length}</div>
    <div style="background:rgba(74,140,63,.2);border-radius:3px;height:4px;margin-bottom:.5rem;overflow:hidden">
      <div style="background:var(--lime);height:100%;width:${((srsCurrentIdx)/srsQueue.length)*100}%;transition:width .3s"></div>
    </div>`;
  container.innerHTML = progress;
  container.appendChild(SRS.renderFlashcard(card));
}

function srsRateCard(id, quality) {
  SRS.review(id, quality);
  if (quality >= 2) Progress.markWordLearned(id);
  srsCurrentIdx++;
  showSRSCard();
}

function renderFlashcardsPanel() {
  const allMods = typeof VOCAB !== 'undefined' ? Object.keys(VOCAB) : [];
  return `
    <div class="card" style="background:linear-gradient(135deg,rgba(36,102,176,.2),rgba(15,42,15,.9));border-color:var(--ara-blue)">
      <div class="card-title" style="color:var(--ara-light)">🦜 Arawy explica o SRS:</div>
      <p style="font-size:.87rem">"Repetição Espaçada é como a floresta cresce — devagarinho mas firme! Palavras que você erra aparecem mais vezes; as que acerta somem por dias. Assim você aprende de verdade!"</p>
    </div>
    <div id="srs-container">
      <div class="card">
        <div class="card-title">🔁 Escolha um módulo para revisar:</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.7rem;margin-top:.7rem">
          ${allMods.filter(k => VOCAB[k] && VOCAB[k].words).map(k => `
            <div class="module-btn" onclick="startSRS('${k}')">
              <span class="mod-icon">${VOCAB[k].name.split(' ')[0]}</span>
              <span class="mod-name">${VOCAB[k].name.replace(/^[^\s]+\s/,'')}</span>
              <span class="mod-count">${SRS.getDueCards(k).length} para revisar</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>`;
}


// ═══════════════════════════════════════════════════════════════════════════════
// 3. RECONHECIMENTO DE VOZ
// ═══════════════════════════════════════════════════════════════════════════════
const VoiceRec = {
  recognition: null,
  supported: false,
  listening: false,

  init() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { this.supported = false; return; }
    this.supported = true;
    this.recognition = new SR();
    this.recognition.lang = 'pt-BR';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
  },

  // Compare normalized phonetic similarity
  compareWords(spoken, target) {
    const normalize = s => s.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z\s]/g,'').trim();
    const sp = normalize(spoken);
    const tg = normalize(target);
    if (sp === tg) return 1.0;
    // Levenshtein distance
    const a = sp, b = tg;
    const m = a.length, n = b.length;
    const dp = Array.from({length:m+1},(_,i)=>Array.from({length:n+1},(_,j)=>i||j));
    for(let i=1;i<=m;i++) for(let j=1;j<=n;j++)
      dp[i][j] = a[i-1]===b[j-1] ? dp[i-1][j-1] : 1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
    const dist = dp[m][n];
    return Math.max(0, 1 - dist/Math.max(m,n));
  },

  listen(targetWord, targetPhonetic, onResult) {
    if (!this.supported || this.listening) return;
    this.listening = true;
    this.recognition.onresult = e => {
      this.listening = false;
      const spoken = e.results[0][0].transcript;
      const score = this.compareWords(spoken, targetPhonetic || targetWord);
      onResult({ spoken, score, ok: score >= 0.6 });
    };
    this.recognition.onerror = () => { this.listening = false; onResult({ error: true }); };
    this.recognition.onend = () => { this.listening = false; };
    this.recognition.start();
  }
};
VoiceRec.init();

function renderVoicePanel(word) {
  if (!word) return `<div class="card"><p>Selecione uma palavra para praticar a pronúncia.</p></div>`;
  return `
    <div class="card" style="text-align:center;padding:1.5rem">
      <div style="font-family:'Playfair Display',serif;font-size:2rem;color:var(--sun)">${word.g}</div>
      <div style="color:var(--clay);font-style:italic">/${word.ph}/</div>
      <div style="color:var(--cream);margin:.5rem 0">${word.pt}</div>
      <div style="display:flex;gap:.7rem;justify-content:center;margin:1rem 0">
        <button class="tts-btn" onclick="speakGuajajara('${word.g}','${word.ph}')" title="Ouvir">🔊</button>
        <button id="mic-btn" class="tts-btn" style="background:linear-gradient(135deg,var(--urucum),var(--terra))" onclick="startListening('${word.g}','${word.ph}')" title="Falar" ${!VoiceRec.supported ? 'disabled title="Microfone não disponível"' : ''}>🎤</button>
      </div>
      ${!VoiceRec.supported ? '<p style="color:var(--clay);font-size:.82rem">⚠️ Reconhecimento de voz não disponível neste dispositivo/navegador.</p>' : ''}
      <div id="voice-feedback" style="min-height:60px;margin-top:.5rem"></div>
    </div>`;
}

let voiceCurrentWord = null;
function startListening(word, phonetic) {
  const btn = document.getElementById('mic-btn');
  if (btn) { btn.textContent = '⏺'; btn.style.animation = 'pulseAra 1s infinite'; }
  VoiceRec.listen(word, phonetic, result => {
    if (btn) { btn.textContent = '🎤'; btn.style.animation = ''; }
    const fb = document.getElementById('voice-feedback');
    if (!fb) return;
    if (result.error) { fb.innerHTML = '<p style="color:var(--clay)">Não consegui ouvir. Tente novamente!</p>'; return; }
    const pct = Math.round(result.score * 100);
    const color = result.ok ? 'var(--lime)' : '#ff9977';
    const msg = result.ok ? '✅ Ótima pronúncia!' : '🔄 Continue praticando!';
    fb.innerHTML = `
      <div style="color:${color};font-weight:700;font-size:1rem">${msg}</div>
      <div style="color:var(--clay);font-size:.82rem">Você disse: "${result.spoken}"</div>
      <div style="background:rgba(74,140,63,.2);border-radius:4px;height:8px;margin:.5rem auto;width:80%;overflow:hidden">
        <div style="background:${color};height:100%;width:${pct}%;transition:width .5s"></div>
      </div>
      <div style="color:${color};font-size:.85rem">${pct}% de precisão</div>`;
    if (result.ok) Progress.addXP(15, 'Pronúncia correta!');
  });
}

function renderVoicePracticePanel() {
  const allWords = typeof VOCAB !== 'undefined' ?
    Object.values(VOCAB).flatMap(m => m.words||[]).filter(w=>w.g&&w.ph) : [];
  const random = allWords[Math.floor(Math.random()*allWords.length)];
  voiceCurrentWord = random;
  return `
    <div class="card" style="background:linear-gradient(135deg,rgba(201,74,26,.2),rgba(15,42,15,.9));border-color:var(--urucum)">
      <div class="card-title" style="color:var(--clay)">🎤 Pratique sua pronúncia</div>
      <p style="font-size:.87rem">Ouça a palavra, depois clique no 🎤 e fale em voz alta. Arawy vai avaliar sua pronúncia!</p>
    </div>
    ${renderVoicePanel(random)}
    <div class="card" style="margin-top:.8rem">
      <div class="card-title">📝 Escolher palavra para praticar:</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-top:.5rem;max-height:300px;overflow-y:auto">
        ${allWords.slice(0,30).map(w => `
          <div style="padding:.5rem;border:1px solid var(--moss);border-radius:8px;cursor:pointer;font-size:.85rem" 
               onclick="selectVoiceWord(${JSON.stringify(w).replace(/"/g,'&quot;')})">
            <span style="color:var(--sun);font-weight:700">${w.g}</span>
            <span style="color:var(--clay);font-size:.75rem"> · ${w.pt}</span>
          </div>`).join('')}
      </div>
    </div>`;
}

function selectVoiceWord(word) {
  voiceCurrentWord = word;
  const el = document.querySelector('#panel-voice .card:nth-child(2)');
  if (!el) return;
  el.outerHTML = renderVoicePanel(word);
}


// ═══════════════════════════════════════════════════════════════════════════════
// 4. EXERCÍCIOS DE ESCRITA
// ═══════════════════════════════════════════════════════════════════════════════
const WritingEx = {
  exercises: [],
  currentIdx: 0,
  score: 0,

  generateFillBlank(word) {
    // Remove a vowel or the last syllable
    const g = word.g;
    const blanked = g.replace(/[aeiouãẽĩõũáéíóú]/ig, (m, offset) => offset === g.search(/[aeiouãẽĩõũáéíóú]/i) ? '_' : m);
    return { type: 'fill', word, blanked, answer: word.g };
  },

  generateOrderSyllables(word) {
    const syllables = word.ph.split('-');
    if (syllables.length < 2) return null;
    return { type: 'order', word, syllables: shuffle(syllables), answer: word.ph, correct: syllables.join('-') };
  },

  generateTranslate(word) {
    return { type: 'translate', word, prompt: `Como se diz "${word.pt}" em Guajajara?`, answer: word.g };
  },

  start(modKey) {
    const mod = typeof VOCAB !== 'undefined' ? VOCAB[modKey] : null;
    if (!mod) return;
    const words = shuffle([...mod.words]).slice(0, 8);
    this.exercises = words.map((w, i) => {
      const types = [this.generateFillBlank(w), this.generateOrderSyllables(w), this.generateTranslate(w)].filter(Boolean);
      return types[i % types.length];
    });
    this.currentIdx = 0;
    this.score = 0;
    this.renderCurrent();
  },

  renderCurrent() {
    const el = document.getElementById('writing-container');
    if (!el) return;
    if (this.currentIdx >= this.exercises.length) {
      el.innerHTML = `
        <div class="card" style="text-align:center;padding:2rem">
          <div style="font-size:3rem">${this.score >= this.exercises.length*0.7 ? '🎉' : '🌱'}</div>
          <div style="font-family:'Playfair Display',serif;color:var(--sun);font-size:1.4rem">Exercícios concluídos!</div>
          <div style="color:var(--lime)">${this.score} / ${this.exercises.length} corretos</div>
        </div>`;
      Progress.addXP(10 * this.score, 'Exercícios de escrita!');
      return;
    }
    const ex = this.exercises[this.currentIdx];
    const pct = (this.currentIdx / this.exercises.length) * 100;
    let body = '';
    if (ex.type === 'fill') {
      body = `
        <div style="font-family:'Playfair Display',serif;font-size:1.3rem;color:var(--sun);text-align:center;margin:1rem 0">
          Complete a palavra Guajajara:
        </div>
        <div style="text-align:center;font-size:.9rem;color:var(--lime);margin-bottom:.5rem">${ex.word.pt}</div>
        <div style="font-size:1.5rem;text-align:center;color:var(--cream);margin:1rem 0;letter-spacing:.1em">${ex.blanked}</div>
        <input id="ex-input" type="text" placeholder="Digite a palavra completa..." 
          style="width:100%;padding:.7rem;background:rgba(30,74,30,.7);border:1px solid var(--moss);
          border-radius:10px;color:var(--cream);font-size:1rem;text-align:center;outline:none;"
          onkeydown="if(event.key==='Enter')checkWritingAnswer()">
        <button class="btn-start" onclick="checkWritingAnswer()" style="width:100%;margin-top:.7rem;font-size:.9rem">Verificar ✓</button>`;
    } else if (ex.type === 'order') {
      body = `
        <div style="font-family:'Playfair Display',serif;font-size:1.3rem;color:var(--sun);text-align:center;margin:1rem 0">
          Ordene as sílabas:
        </div>
        <div style="text-align:center;font-size:.9rem;color:var(--lime);margin-bottom:.5rem">${ex.word.pt} = ${ex.word.g}</div>
        <div id="syllable-area" style="display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;margin:1rem 0;min-height:50px;padding:.5rem;background:rgba(30,74,30,.3);border-radius:10px;border:1px dashed var(--moss)"></div>
        <div style="display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;margin:.5rem 0">
          ${ex.syllables.map((s,i)=>`<button onclick="addSyllable('${s}',this)" 
            style="padding:.4rem .8rem;background:rgba(36,102,176,.3);border:1px solid var(--ara-blue);
            border-radius:8px;color:var(--ara-light);cursor:pointer;font-size:.9rem">${s}</button>`).join('')}
        </div>
        <button class="btn-start" onclick="checkSyllableOrder('${ex.correct}')" style="width:100%;margin-top:.7rem;font-size:.9rem">Verificar ✓</button>`;
    } else {
      body = `
        <div style="font-family:'Playfair Display',serif;font-size:1.3rem;color:var(--sun);text-align:center;margin:1rem 0">${ex.prompt}</div>
        <input id="ex-input" type="text" placeholder="Escreva em Guajajara..."
          style="width:100%;padding:.7rem;background:rgba(30,74,30,.7);border:1px solid var(--moss);
          border-radius:10px;color:var(--cream);font-size:1rem;text-align:center;outline:none;"
          onkeydown="if(event.key==='Enter')checkWritingAnswer()">
        <button class="btn-start" onclick="checkWritingAnswer()" style="width:100%;margin-top:.7rem;font-size:.9rem">Verificar ✓</button>`;
    }
    el.innerHTML = `
      <div style="background:rgba(74,140,63,.2);border-radius:3px;height:4px;margin-bottom:.8rem;overflow:hidden">
        <div style="background:var(--lime);height:100%;width:${pct}%;transition:width .3s"></div>
      </div>
      <div style="text-align:center;color:var(--lime);font-size:.82rem;margin-bottom:.5rem">${this.currentIdx+1} / ${this.exercises.length}</div>
      <div class="card">${body}</div>
      <div id="writing-feedback" style="min-height:50px;margin-top:.5rem;text-align:center"></div>`;
  },

  check(answer) {
    const ex = this.exercises[this.currentIdx];
    const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
    const correct = norm(answer) === norm(ex.answer);
    const fb = document.getElementById('writing-feedback');
    if (fb) fb.innerHTML = correct
      ? `<div style="color:var(--lime);font-size:1rem;font-weight:700">✅ Correto! +5 XP</div>`
      : `<div style="color:#ff9977;font-size:.95rem">❌ Correto: <strong style="color:var(--sun)">${ex.answer}</strong></div>`;
    if (correct) { this.score++; Progress.markWordLearned(`${ex.word.g}`); }
    setTimeout(() => { this.currentIdx++; this.renderCurrent(); }, 1500);
  }
};

let syllableBuilt = [];
function addSyllable(syl, btn) {
  syllableBuilt.push(syl);
  btn.disabled = true;
  btn.style.opacity = '.4';
  const area = document.getElementById('syllable-area');
  if (area) area.innerHTML = syllableBuilt.map(s=>`<span style="padding:.3rem .6rem;background:rgba(36,102,176,.4);border-radius:6px;color:var(--ara-light)">${s}</span>`).join(' - ');
}
function checkSyllableOrder(correct) {
  const built = syllableBuilt.join('-');
  syllableBuilt = [];
  WritingEx.check(built);
}
function checkWritingAnswer() {
  const inp = document.getElementById('ex-input');
  if (inp) WritingEx.check(inp.value);
}

function renderWritingPanel() {
  const allMods = typeof VOCAB !== 'undefined' ? Object.keys(VOCAB) : [];
  return `
    <div class="card" style="background:linear-gradient(135deg,rgba(201,74,26,.15),rgba(15,42,15,.9));border-color:var(--urucum)">
      <div class="card-title" style="color:var(--clay)">✍️ Exercícios de Escrita</div>
      <p style="font-size:.87rem">Complete palavras, ordene sílabas e traduza frases. O melhor jeito de fixar o Guajajara!</p>
    </div>
    <div id="writing-container">
      <div class="card">
        <div class="card-title">Escolha um módulo:</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.7rem;margin-top:.7rem">
          ${allMods.filter(k=>VOCAB[k]&&VOCAB[k].words&&VOCAB[k].words.length>=4).map(k=>`
            <div class="module-btn" onclick="WritingEx.start('${k}')">
              <span class="mod-icon">${VOCAB[k].name.split(' ')[0]}</span>
              <span class="mod-name" style="font-size:.78rem">${VOCAB[k].name.replace(/^[^\s]+\s/,'').substring(0,20)}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}


// ═══════════════════════════════════════════════════════════════════════════════
// 5. MODO CONVERSAÇÃO
// ═══════════════════════════════════════════════════════════════════════════════
const Conversations = [
  {
    id: 'saudacao',
    title: '👋 Saudação na Aldeia',
    desc: 'Você chega à aldeia e encontra um ancião',
    turns: [
      { speaker: 'Ancião', text: 'Maraná! Mehe ku pe?', trans: 'Olá! Como vai você?' },
      { speaker: 'Você', options: [
        { text: 'Angatu! Xe rory mawy.', trans: 'Bem! Estou muito feliz.', correct: true },
        { text: 'Ani. Xe tuwér ywý.', trans: 'Não. Estou triste.', correct: false },
        { text: 'Xe eho.', trans: 'Vou embora.', correct: false },
      ]},
      { speaker: 'Ancião', text: 'Angatu! Xe r-er Karuípe. Nde r-er mehe?', trans: 'Ótimo! Meu nome é Karuípe. Qual é o seu nome?' },
      { speaker: 'Você', options: [
        { text: 'Xe r-er [seu nome].', trans: 'Meu nome é [seu nome].', correct: true },
        { text: 'Ani xe haywu.', trans: 'Não entendi.', correct: false },
        { text: 'Mamo pe?', trans: 'Onde está?', correct: false },
      ]},
      { speaker: 'Ancião', text: 'Angatu! Ikatu pe nde xe oka pe?', trans: 'Ótimo! Pode vir à minha casa?' },
      { speaker: 'Você', options: [
        { text: 'Ikatu! Kwáhy, xe ramuhã!', trans: 'Pode! Obrigado, meu ancião!', correct: true },
        { text: 'Eroho!', trans: 'Vá embora!', correct: false },
        { text: 'Amana ú.', trans: 'Está chovendo.', correct: false },
      ]},
    ]
  },
  {
    id: 'mercado',
    title: '🛒 No Mercado da Aldeia',
    desc: 'Você vai comprar alimentos na feira da aldeia',
    turns: [
      { speaker: 'Vendedora', text: 'Maraná! Mehe nde u?', trans: 'Olá! O que você quer comer/comprar?' },
      { speaker: 'Você', options: [
        { text: 'Manihĩ xe u ramo. Mehe iké?', trans: 'Quero mandioca. Quanto custa?', correct: true },
        { text: 'Ani. Xe hyhy.', trans: 'Não. Estou com fome.', correct: false },
        { text: 'Pira moko\'yr.', trans: 'Um peixe.', correct: false },
      ]},
      { speaker: 'Vendedora', text: 'Angatu! Manihĩ angatu mawy. Akajú u pe?', trans: 'Ótimo! A mandioca é muito boa. Quer caju também?' },
      { speaker: 'Você', options: [
        { text: 'Aé! Akajú rorysáwy xe.', trans: 'Sim! Amo caju.', correct: true },
        { text: 'Ani. Poxy xe.', trans: 'Não. Estou com raiva.', correct: false },
        { text: 'Amana.', trans: 'Chuva.', correct: false },
      ]},
      { speaker: 'Vendedora', text: 'Eroho angatu pe! Kwáhy!', trans: 'Vá bem! Obrigada!' },
      { speaker: 'Você', options: [
        { text: 'Aguyje mawy! Kwé aty!', trans: 'Muito obrigado! Até mais!', correct: true },
        { text: 'Ani kwáhy.', trans: 'De nada.', correct: false },
        { text: 'Xe eho.', trans: 'Vou embora.', correct: false },
      ]},
    ]
  },
  {
    id: 'floresta',
    title: '🌿 Visita à Floresta',
    desc: 'Um guia Tenetehára te leva para conhecer o mato',
    turns: [
      { speaker: 'Guia', text: 'Aipo kaá maraí, mbo\'e memihar.', trans: 'Esta é a planta medicinal, aprende, aprendiz.' },
      { speaker: 'Você', options: [
        { text: 'Mehe ha\'e?', trans: 'O que é isso?', correct: true },
        { text: 'Kyje xe.', trans: 'Estou com medo.', correct: false },
        { text: 'Eroho!', trans: 'Vá!', correct: false },
      ]},
      { speaker: 'Guia', text: 'Ka\'á mara\'í hé! Akã ywý-py omoera\'ú.', trans: 'É planta medicinal! Cura dor de cabeça.' },
      { speaker: 'Você', options: [
        { text: 'Angatu mawy! Xe haywu.', trans: 'Muito bom! Entendi.', correct: true },
        { text: 'Ani xe haywu.', trans: 'Não entendi.', correct: false },
        { text: 'Pira zapy.', trans: 'Pescar peixe.', correct: false },
      ]},
      { speaker: 'Guia', text: 'Angatu! Nde ñe\'ẽmbo\'e Guajajara angatu!', trans: 'Ótimo! Você está aprendendo Guajajara muito bem!' },
      { speaker: 'Você', options: [
        { text: 'Kwáhy! Xe hayhu Guajajara!', trans: 'Obrigado! Amo o Guajajara!', correct: true },
        { text: 'Xe poxy.', trans: 'Estou com raiva.', correct: false },
        { text: 'Mamo pe?', trans: 'Onde está?', correct: false },
      ]},
    ]
  }
];

let convState = { id: null, turn: 0, score: 0 };

function startConversation(id) {
  const conv = Conversations.find(c => c.id === id);
  if (!conv) return;
  convState = { id, turn: 0, score: 0 };
  renderConversationTurn(conv);
}

function renderConversationTurn(conv) {
  const el = document.getElementById('conv-container');
  if (!el) return;
  const turn = conv.turns[convState.turn];
  if (!turn) {
    el.innerHTML = `
      <div class="card" style="text-align:center;padding:2rem">
        <div style="font-size:3rem">🎉</div>
        <div style="font-family:'Playfair Display',serif;color:var(--sun);font-size:1.3rem">Conversa concluída!</div>
        <div style="color:var(--lime)">${convState.score} respostas corretas</div>
        <button class="btn-start" onclick="showConvMenu()" style="margin-top:1rem;font-size:.9rem">Outras conversas →</button>
      </div>`;
    Progress.addXP(30, 'Conversa completada!');
    return;
  }
  const history = conv.turns.slice(0, convState.turn).map(t => {
    if (t.speaker !== 'Você') return `
      <div style="display:flex;gap:.5rem;align-items:flex-start;margin-bottom:.7rem">
        <div style="width:32px;height:32px;border-radius:50%;background:var(--moss);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1rem">👴</div>
        <div style="background:rgba(30,74,30,.8);border:1px solid var(--moss);border-radius:0 14px 14px 14px;padding:.6rem .9rem;flex:1">
          <div style="color:var(--sun);font-weight:700;font-size:.85rem">${t.speaker}</div>
          <div style="color:var(--cream);font-size:.92rem">${t.text}</div>
          <div style="color:var(--clay);font-size:.78rem;font-style:italic">${t.trans}</div>
        </div>
      </div>`;
    return `
      <div style="display:flex;gap:.5rem;justify-content:flex-end;margin-bottom:.7rem">
        <div style="background:rgba(36,102,176,.3);border:1px solid var(--ara-blue);border-radius:14px 0 14px 14px;padding:.6rem .9rem;max-width:80%">
          <div style="color:var(--ara-light);font-size:.92rem">${t._chosen || ''}</div>
        </div>
      </div>`;
  }).join('');

  let currentBlock = '';
  if (turn.speaker !== 'Você') {
    currentBlock = `
      <div style="display:flex;gap:.5rem;align-items:flex-start">
        <div style="width:32px;height:32px;border-radius:50%;background:var(--moss);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1rem">👴</div>
        <div style="background:rgba(30,74,30,.8);border:1px solid var(--moss);border-radius:0 14px 14px 14px;padding:.6rem .9rem;flex:1">
          <div style="color:var(--sun);font-weight:700;font-size:.85rem">${turn.speaker}</div>
          <div style="color:var(--cream)">${turn.text}</div>
          <div style="color:var(--clay);font-size:.78rem;font-style:italic">${turn.trans}</div>
          <button class="tts-btn" style="margin-top:.4rem;width:30px;height:30px;font-size:.85rem" onclick="speakGuajajara('${turn.text.replace(/'/g,"\\'")}','${turn.text.replace(/'/g,"\\'")}')">🔊</button>
        </div>
      </div>
      <div style="text-align:center;margin:.8rem 0;color:var(--lime);font-size:.82rem">↓ Sua vez de responder:</div>
      ${turn.options ? '' : `<button class="btn-start" onclick="advanceConv()" style="width:100%;font-size:.9rem">Continuar →</button>`}`;
    if (turn.options) {
      // Auto-advance past NPC turn
      setTimeout(() => {
        convState.turn++;
        renderConversationTurn(conv);
      }, 500);
      currentBlock = `
        <div style="display:flex;gap:.5rem;align-items:flex-start">
          <div style="width:32px;height:32px;border-radius:50%;background:var(--moss);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1rem">👴</div>
          <div style="background:rgba(30,74,30,.8);border:1px solid var(--moss);border-radius:0 14px 14px 14px;padding:.6rem .9rem;flex:1">
            <div style="color:var(--sun);font-weight:700;font-size:.85rem">${turn.speaker}</div>
            <div style="color:var(--cream)">${turn.text}</div>
            <div style="color:var(--clay);font-size:.78rem;font-style:italic">${turn.trans}</div>
          </div>
        </div>`;
    }
  } else {
    currentBlock = `
      <div style="margin-top:.5rem">
        <div style="color:var(--lime);font-size:.85rem;margin-bottom:.5rem;text-align:center">Como você responde?</div>
        ${turn.options.map((opt, i) => `
          <button onclick="chooseConvOption(${i},'${conv.id}')" style="display:block;width:100%;text-align:left;
            padding:.7rem .9rem;margin-bottom:.5rem;background:rgba(30,74,30,.7);
            border:1px solid var(--moss);border-radius:12px;color:var(--cream);cursor:pointer;font-size:.88rem;
            transition:border-color .2s" onmouseover="this.style.borderColor='var(--sun)'" onmouseout="this.style.borderColor='var(--moss)'">
            <span style="color:var(--sun);font-weight:700">${opt.text}</span><br>
            <span style="color:var(--clay);font-size:.78rem;font-style:italic">${opt.trans}</span>
          </button>`).join('')}
      </div>`;
  }
  el.innerHTML = `
    <div style="max-height:350px;overflow-y:auto;margin-bottom:.5rem;padding-right:.3rem">${history}</div>
    ${currentBlock}`;
}

function chooseConvOption(idx, convId) {
  const conv = Conversations.find(c => c.id === convId);
  const turn = conv.turns[convState.turn];
  const opt = turn.options[idx];
  turn._chosen = opt.text;
  if (opt.correct) convState.score++;
  convState.turn++;
  renderConversationTurn(conv);
}

function showConvMenu() {
  const el = document.getElementById('conv-container');
  if (!el) return;
  el.innerHTML = Conversations.map(c => `
    <div class="card" style="cursor:pointer;margin-bottom:.7rem" onclick="startConversation('${c.id}')">
      <div class="card-title">${c.title}</div>
      <p style="font-size:.85rem">${c.desc}</p>
    </div>`).join('');
}

function renderConversationPanel() {
  return `
    <div class="card" style="background:linear-gradient(135deg,rgba(36,102,176,.2),rgba(15,42,15,.9));border-color:var(--ara-blue)">
      <div class="card-title" style="color:var(--ara-light)">🗣️ Modo Conversação</div>
      <p style="font-size:.87rem">Diálogos guiados com personagens Tenetehára! Escolha a resposta certa e aprenda Guajajara em contexto real.</p>
    </div>
    <div id="conv-container">
      ${Conversations.map(c => `
        <div class="card" style="cursor:pointer;margin-bottom:.7rem" onclick="startConversation('${c.id}')">
          <div class="card-title">${c.title}</div>
          <p style="font-size:.85rem">${c.desc}</p>
        </div>`).join('')}
    </div>`;
}


// ═══════════════════════════════════════════════════════════════════════════════
// 6. LEITOR DE HISTÓRIAS
// ═══════════════════════════════════════════════════════════════════════════════
const Stories = [
  {
    id: 'maira',
    title: '🌟 Maíra e a Criação do Mundo',
    level: 'Avançado 1',
    intro: 'Narrativa tradicional Tenetehára sobre o herói criador Maíra. Toque nas palavras sublinhadas para ver o significado.',
    paragraphs: [
      {
        text: 'Kwasé pe, tekohaw ani oiko. Maíra, awá porã, oho kaá pe ojeapó ywá ramo.',
        words: { 'Kwasé pe': 'Há muito tempo', 'tekohaw': 'a aldeia/mundo', 'ani oiko': 'não existia', 'Maíra': 'herói criador Tenetehára', 'awá porã': 'homem bonito/bom', 'oho': 'foi', 'kaá pe': 'na floresta', 'ojeapó': 'fez-se/criou', 'ywá ramo': 'para o céu' },
        trans: 'Há muito tempo, a aldeia não existia. Maíra, o homem bom, foi à floresta criar o céu.'
      },
      {
        text: 'A\'e ojeapó ko\'yr, amana ha\'e ará. Yandé ñeengar ojeapó a\'e r-epy.',
        words: { 'A\'e': 'Ele', 'ojeapó': 'criou', 'ko\'yr': 'o sol', 'amana': 'a chuva', 'ha\'e': 'e também', 'ará': 'o céu', 'Yandé': 'Nós (inclusivo)', 'ñeengar': 'família/parentes', 'r-epy': 'a partir de / criados por' },
        trans: 'Ele criou o sol, a chuva e o céu. Nossa família foi criada por ele.'
      },
      {
        text: 'Maíra oñe\'ẽng: "Tekohaw angatu peapo! Kaá moñangarã ani!" A\'e kwer oho ará pe.',
        words: { 'oñe\'ẽng': 'disse/falou', 'Tekohaw angatu': 'Vivam bem / Modo bom de ser', 'peapo': 'façam (vocês)', 'Kaá': 'A floresta/natureza', 'moñangarã ani': 'não destruam', 'kwer': 'depois/então', 'oho': 'foi', 'ará pe': 'para o céu' },
        trans: 'Maíra disse: "Vivam bem! Não destruam a floresta!" Então ele foi para o céu.'
      }
    ]
  },
  {
    id: 'arara',
    title: '🦜 Arawy e a Língua Perdida',
    level: 'Intermediário',
    intro: 'Um conto moderno sobre a importância de preservar a língua Tenetehára.',
    paragraphs: [
      {
        text: 'Arawy, yrywó porã, oñe\'ẽng Guajajara. A\'e hex memihar oikó oka pe.',
        words: { 'Arawy': 'nome da arara (nosso mascote!)', 'yrywó porã': 'pássaro bonito', 'oñe\'ẽng': 'falava', 'Guajajara': 'a língua Guajajara', 'hex': 'viu', 'memihar': 'aprendiz/criança', 'oikó': 'estava', 'oka pe': 'na casa' },
        trans: 'Arawy, o pássaro bonito, falava Guajajara. Ela viu uma criança que estava na casa.'
      },
      {
        text: 'Arawy oñe\'ẽng: "Maraná, xe memihar! Nde ñe\'ẽmbo\'e nhe\'ẽ yandé?" Memihar haywu ani.',
        words: { 'Maraná': 'Olá', 'xe memihar': 'meu aprendiz', 'Nde ñe\'ẽmbo\'e': 'você aprende', 'nhe\'ẽ yandé': 'nossa língua', 'haywu ani': 'não entendeu' },
        trans: 'Arawy disse: "Olá, meu aprendiz! Você aprende nossa língua?" A criança não entendeu.'
      },
      {
        text: 'Arawy oñe\'ẽng mawy: "Nhe\'ẽ yandé ñe\'ẽng porã hé! Ñe\'ẽmbo\'e! Ko\'i pe!" Memihar nhe\'ẽmbo\'e ko\'i.',
        words: { 'oñe\'ẽng mawy': 'disse muito / insistiu', 'Nhe\'ẽ yandé': 'Nossa língua', 'ñe\'ẽng porã hé': 'é fala bonita / bela', 'Ñe\'ẽmbo\'e': 'Aprenda!', 'Ko\'i pe': 'agora!', 'ko\'i': 'agora / hoje' },
        trans: 'Arawy disse com força: "Nossa língua é bela! Aprenda! Agora!" A criança aprendeu naquele dia.'
      }
    ]
  }
];

let storyGlossary = {};

function renderStoriesPanel() {
  return `
    <div class="card" style="background:linear-gradient(135deg,rgba(181,74,26,.15),rgba(15,42,15,.9));border-color:var(--clay)">
      <div class="card-title" style="color:var(--clay)">📖 Leitor de Histórias</div>
      <p style="font-size:.87rem">Contos tradicionais e modernos Tenetehára. Toque nas <u>palavras sublinhadas</u> para ver o significado em português!</p>
    </div>
    <div id="story-container">
      ${Stories.map(s => `
        <div class="card" style="cursor:pointer;margin-bottom:.7rem" onclick="openStory('${s.id}')">
          <div class="card-title">${s.title}</div>
          <div style="display:flex;gap:.5rem;margin:.3rem 0"><span class="badge badge-orange">${s.level}</span></div>
          <p style="font-size:.85rem">${s.intro}</p>
        </div>`).join('')}
    </div>
    <div id="story-tooltip" style="display:none;position:fixed;bottom:5rem;left:1rem;right:1rem;background:linear-gradient(135deg,var(--sky),var(--ara-blue));border-radius:12px;padding:.8rem 1rem;color:#fff;font-size:.88rem;z-index:300;box-shadow:0 4px 16px rgba(36,102,176,.5)">
      <div id="story-tooltip-content"></div>
      <button onclick="document.getElementById('story-tooltip').style.display='none'" style="position:absolute;top:.4rem;right:.6rem;background:none;border:none;color:rgba(255,255,255,.7);cursor:pointer;font-size:1rem">✕</button>
    </div>`;
}

function openStory(id) {
  const story = Stories.find(s => s.id === id);
  if (!story) return;
  storyGlossary = {};
  story.paragraphs.forEach(p => Object.assign(storyGlossary, p.words));
  const el = document.getElementById('story-container');
  el.innerHTML = `
    <div class="lesson-header">
      <button class="back-btn" onclick="showStoriesMenu()">← Histórias</button>
      <div class="lesson-title">${story.title}</div>
    </div>
    <div class="card" style="background:linear-gradient(135deg,rgba(181,74,26,.1),rgba(15,42,15,.9));border-color:var(--clay);font-size:.85rem;color:var(--clay);font-style:italic">${story.intro}</div>
    ${story.paragraphs.map((p, i) => `
      <div class="card">
        <div style="line-height:2;margin-bottom:.7rem">
          ${markupStoryText(p.text, p.words)}
        </div>
        <div style="border-top:1px solid rgba(74,140,63,.3);padding-top:.5rem;color:var(--clay);font-size:.83rem;font-style:italic">
          🇧🇷 ${p.trans}
        </div>
        <button class="tts-btn" style="margin-top:.5rem;width:32px;height:32px;font-size:.85rem" onclick="speakGuajajara('${p.text.replace(/'/g,"\\'")}','${p.text.replace(/'/g,"\\'")}')">🔊</button>
      </div>`).join('')}`;
}

function markupStoryText(text, words) {
  let result = text;
  Object.keys(words).sort((a,b)=>b.length-a.length).forEach(w => {
    const escaped = w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    result = result.replace(new RegExp(escaped,'g'),
      `<span class="story-word" onclick="showWordDef('${w.replace(/'/g,"\\'")}','${words[w].replace(/'/g,"\\'")}')">
        <u style="color:var(--sun);cursor:pointer;text-decoration-style:dotted">${w}</u>
      </span>`);
  });
  return result;
}

function showWordDef(word, def) {
  const t = document.getElementById('story-tooltip');
  const c = document.getElementById('story-tooltip-content');
  if (!t || !c) return;
  c.innerHTML = `<strong style="color:var(--sun)">${word}</strong> = ${def}`;
  t.style.display = 'block';
  speakGuajajara(word, word);
}

function showStoriesMenu() {
  const el = document.getElementById('story-container');
  el.innerHTML = Stories.map(s => `
    <div class="card" style="cursor:pointer;margin-bottom:.7rem" onclick="openStory('${s.id}')">
      <div class="card-title">${s.title}</div>
      <p style="font-size:.85rem">${s.intro}</p>
    </div>`).join('');
}


// ═══════════════════════════════════════════════════════════════════════════════
// 7. NOTIFICAÇÕES PUSH
// ═══════════════════════════════════════════════════════════════════════════════
const PushNotif = {
  async request() {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  },

  async scheduleDaily() {
    const granted = await this.request();
    if (!granted) return false;
    localStorage.setItem('nhee_notif', 'true');
    this.showNow(); // Show a preview
    return true;
  },

  showNow() {
    const allWords = typeof VOCAB !== 'undefined' ?
      Object.values(VOCAB).flatMap(m=>m.words||[]).filter(w=>w.g&&w.pt) : [];
    const word = allWords[Math.floor(Math.random() * allWords.length)];
    if (!word) return;
    try {
      new Notification('🦜 Arawy te espera!', {
        body: `Palavra do dia: ${word.g} = ${word.pt}\n/${word.ph}/`,
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🦜</text></svg>',
        tag: 'nhee-daily',
        renotify: true
      });
    } catch {}
  }
};

function renderNotifPanel() {
  const enabled = localStorage.getItem('nhee_notif') === 'true';
  return `
    <div class="card" style="background:linear-gradient(135deg,rgba(36,102,176,.2),rgba(15,42,15,.9));border-color:var(--ara-blue)">
      <div class="card-title" style="color:var(--ara-light)">🔔 Notificações Diárias</div>
      <p style="font-size:.87rem">Arawy te lembra de praticar todo dia com a palavra do dia Guajajara!</p>
      ${enabled
        ? `<div style="color:var(--lime);font-weight:700">✅ Notificações ativadas!</div>
           <button class="back-btn" style="margin-top:.7rem" onclick="PushNotif.showNow()">🔔 Ver notificação agora</button>`
        : `<button class="btn-start" onclick="enableNotifs()" style="font-size:.9rem;padding:.6rem 1.5rem">Ativar notificações 🔔</button>`
      }
    </div>
    <div class="card">
      <div class="card-title">📅 O que você recebe</div>
      <p style="font-size:.87rem;line-height:1.7">• Palavra do dia com pronúncia e exemplo<br>
      • Lembrete do streak diário<br>
      • Aviso quando novos módulos são adicionados<br>
      • Comemorações de conquistas</p>
    </div>`;
}

function enableNotifs() {
  PushNotif.scheduleDaily().then(ok => {
    if (ok) {
      document.querySelector('#panel-notif .card:first-child').innerHTML = `
        <div style="color:var(--lime);font-weight:700;font-size:1rem">✅ Notificações ativadas! Arawy vai te lembrar todo dia!</div>`;
    } else {
      alert('Notificações bloqueadas. Por favor, permita notificações nas configurações do navegador.');
    }
  });
}


// ═══════════════════════════════════════════════════════════════════════════════
// 8. MINI-JOGO: COMBINE IMAGENS (versão com emojis)
// ═══════════════════════════════════════════════════════════════════════════════
const MatchGame = {
  // Map vocabulary to emoji representations
  emojiMap: {
    'Manihĩ': '🍠', 'Pira': '🐟', 'Akajú': '🍊', 'Anana': '🍍', 'Beju': '🫓',
    'Jaguareté': '🐆', 'Tatú': '🦔', 'Kapiwara': '🦫', 'Arawy': '🦜', 'Mainumby': '🦋',
    'Kaá': '🌿', 'Y\'y': '💧', 'Ko\'yr': '☀️', 'Amana': '🌧️', 'Tataú': '🔥',
    'Oka': '🏠', 'Typé': '🛏️', 'Tapé': '🛤️', 'Mokã': '🌾', 'Tatapiré': '🔥',
    'Angatu': '👍', 'Rorysáwy': '😊', 'Hayhu': '❤️', 'Poxy': '😠', 'Kyje': '😨',
    'Mbo\'ehára': '👨‍🏫', 'Kuaxia r-ekó': '📚', 'Kirĩ': '✏️', 'Porahẽi': '🎵', 'Maracá': '🪘',
    'Ko\'yr asy': '🥵', 'Amana mawy': '⛈️', 'Ywytu': '💨', 'Tatarahy': '⚡', 'Wyrajuká': '🌈',
    'Pytãng': '🔴', 'Oby': '🟢', 'Tawá': '🟡', 'Hũ': '⚫', 'Morotĩ': '⚪',
  },

  cards: [], flipped: [], matched: 0, moves: 0, timer: null, seconds: 0,

  start(category) {
    const cat = typeof VOCAB !== 'undefined' ? VOCAB[category] : null;
    if (!cat) return;
    const mappable = cat.words.filter(w => this.emojiMap[w.g]);
    const pool = shuffle(mappable).slice(0, 6);
    if (pool.length < 3) {
      document.getElementById('match-game').innerHTML = `<div class="card"><p style="color:var(--clay)">Poucos emojis para esta categoria. Tente outra!</p></div>`;
      return;
    }
    this.cards = shuffle([
      ...pool.map((w,i) => ({ id: i, type: 'word', content: w.g, pairId: i })),
      ...pool.map((w,i) => ({ id: i+100, type: 'emoji', content: this.emojiMap[w.g], pairId: i, pt: w.pt }))
    ]);
    this.flipped = []; this.matched = 0; this.moves = 0; this.seconds = 0;
    clearInterval(this.timer);
    this.timer = setInterval(() => { this.seconds++; const t = document.getElementById('match-timer'); if(t) t.textContent = this.seconds+'s'; }, 1000);
    this.render();
  },

  render() {
    const el = document.getElementById('match-game');
    if (!el) return;
    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;margin-bottom:.7rem;color:var(--lime);font-size:.85rem">
        <span>Movimentos: <strong>${this.moves}</strong></span>
        <span id="match-timer">${this.seconds}s</span>
        <span>Pares: <strong>${this.matched}/${this.cards.length/2}</strong></span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem">
        ${this.cards.map(c => `
          <div onclick="MatchGame.flip(${c.id})" style="
            height:70px;border-radius:10px;display:flex;align-items:center;justify-content:center;
            cursor:pointer;font-size:${c.type==='emoji'?'1.8rem':'.82rem'};font-weight:700;
            border:1px solid ${this.matched > 0 && this._isPaired(c.id) ? 'var(--lime)' : 'var(--moss)'};
            background:${this._isFlipped(c.id) || this._isPaired(c.id) ? (c.type==='emoji'?'rgba(30,74,30,.9)':'rgba(36,102,176,.3)') : 'rgba(15,42,15,.8)'};
            color:${c.type==='word'?'var(--sun)':'var(--cream)'};
            transition:all .2s;text-align:center;padding:.2rem;line-height:1.2">
            ${this._isFlipped(c.id) || this._isPaired(c.id) ? c.content : '?'}
          </div>`).join('')}
      </div>`;
  },

  _isFlipped(id) { return this.flipped.includes(id); },
  _isPaired(id) {
    const c = this.cards.find(c=>c.id===id);
    return c && this._matchedPairs && this._matchedPairs.includes(c.pairId);
  },

  _matchedPairs: [],

  flip(id) {
    if (this.flipped.length >= 2) return;
    if (this.flipped.includes(id)) return;
    if (this._matchedPairs.includes(this.cards.find(c=>c.id===id)?.pairId)) return;
    this.flipped.push(id);
    this.render();
    if (this.flipped.length === 2) {
      this.moves++;
      const [a, b] = this.flipped.map(fid => this.cards.find(c=>c.id===fid));
      if (a.pairId === b.pairId && a.type !== b.type) {
        this._matchedPairs.push(a.pairId);
        this.matched++;
        this.flipped = [];
        Progress.addXP(10, 'Par encontrado!');
        if (this.matched === this.cards.length/2) {
          clearInterval(this.timer);
          setTimeout(() => {
            const el = document.getElementById('match-game');
            if (el) el.insertAdjacentHTML('beforeend', `
              <div class="card" style="text-align:center;margin-top:.8rem">
                <div style="font-size:2rem">🎉</div>
                <div style="color:var(--sun);font-weight:700">Todos os pares!</div>
                <div style="color:var(--lime)">${this.moves} movimentos · ${this.seconds}s</div>
              </div>`);
            Progress.addXP(30, 'Jogo completo!');
          }, 500);
        }
        this.render();
      } else {
        setTimeout(() => { this.flipped = []; this.render(); }, 900);
      }
    }
  }
};

function renderMatchPanel() {
  const cats = ['alimentos','animais','natureza','cores','emocoes','casa'];
  return `
    <div class="card" style="background:linear-gradient(135deg,rgba(245,185,66,.15),rgba(15,42,15,.9));border-color:var(--sun)">
      <div class="card-title" style="color:var(--sun)">🎮 Combine Palavra + Emoji</div>
      <p style="font-size:.87rem">Encontre os pares! Combine a palavra Guajajara com o emoji correto. Treine memória e vocabulário!</p>
    </div>
    <div class="card">
      <div class="card-title">Escolha uma categoria:</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.5rem;margin-top:.7rem">
        ${cats.map(k => {
          const mod = typeof VOCAB !== 'undefined' && VOCAB[k];
          if (!mod) return '';
          return `<div class="module-btn" onclick="MatchGame.start('${k}');document.getElementById('match-game').scrollIntoView({behavior:'smooth'})">
            <span class="mod-icon">${mod.name.split(' ')[0]}</span>
            <span class="mod-name" style="font-size:.72rem">${mod.name.replace(/^[^\s]+\s/,'').substring(0,12)}</span>
          </div>`;
        }).join('')}
      </div>
    </div>
    <div id="match-game" style="margin-top:.5rem"></div>`;
}


// ═══════════════════════════════════════════════════════════════════════════════
// INIT: INJECT NEW PANELS INTO DOM
// ═══════════════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Add new nav tabs
  const navTabs = document.getElementById('navTabs');
  if (navTabs) {
    const newTabs = [
      { id: 'flashcards', label: '🔁 Flashcards' },
      { id: 'voice', label: '🎤 Pronúncia' },
      { id: 'writing', label: '✍️ Escrita' },
      { id: 'conversation', label: '🗣️ Conversação' },
      { id: 'stories', label: '📖 Histórias' },
      { id: 'match', label: '🎮 Jogo' },
      { id: 'profile', label: '📊 Progresso' },
      { id: 'notif', label: '🔔 Notif.' },
    ];
    newTabs.forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'nav-tab';
      btn.textContent = t.label;
      btn.onclick = () => showPanelExtra(t.id);
      navTabs.appendChild(btn);
    });
  }

  // Add new panels to app
  const app = document.getElementById('app');
  if (app) {
    const panels = [
      { id: 'flashcards', render: renderFlashcardsPanel },
      { id: 'voice', render: renderVoicePracticePanel },
      { id: 'writing', render: renderWritingPanel },
      { id: 'conversation', render: renderConversationPanel },
      { id: 'stories', render: renderStoriesPanel },
      { id: 'match', render: renderMatchPanel },
      { id: 'profile', render: () => Progress.renderProfilePanel() },
      { id: 'notif', render: renderNotifPanel },
    ];
    panels.forEach(p => {
      const div = document.createElement('div');
      div.className = 'panel';
      div.id = `panel-${p.id}`;
      div.innerHTML = p.render();
      app.appendChild(div);
    });
  }

  // Update streak on open
  Progress.updateStreak();

  // Add XP slide-up keyframe if not present
  if (!document.getElementById('extra-styles')) {
    const style = document.createElement('style');
    style.id = 'extra-styles';
    style.textContent = `@keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`;
    document.head.appendChild(style);
  }
});

function showPanelExtra(id) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  const panel = document.getElementById(`panel-${id}`);
  if (panel) {
    panel.classList.add('active');
    // Re-render dynamic panels
    if (id === 'profile') panel.innerHTML = Progress.renderProfilePanel();
    if (id === 'flashcards') panel.innerHTML = renderFlashcardsPanel();
    if (id === 'voice') panel.innerHTML = renderVoicePracticePanel();
    if (id === 'writing') panel.innerHTML = renderWritingPanel();
    if (id === 'match') panel.innerHTML = renderMatchPanel();
    if (id === 'conversation') panel.innerHTML = renderConversationPanel();
    if (id === 'stories') panel.innerHTML = renderStoriesPanel();
    if (id === 'notif') panel.innerHTML = renderNotifPanel();
  }
  // Highlight the right tab
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(t => { if (t.textContent.toLowerCase().includes(id.substring(0,4).toLowerCase())) t.classList.add('active'); });
  window.scrollTo(0, 0);
}
