'use strict';
(() => {
  const LESSONS = window.DEUTSCH_LESSONS || [];
  const LEVELS = ['A1', 'A2', 'B1', 'B2'];
  const LEVEL_NAMES = {A1:'Pemula',A2:'Dasar lanjutan',B1:'Menengah',B2:'Mandiri'};
  const STORAGE_KEY = 'deutschnest_progress_v1';
  const MAIN = document.getElementById('main-content');
  const icons = {home:'ic-home',lessons:'ic-book',cards:'ic-cards',practice:'ic-mic',profile:'ic-user',sound:'ic-sound',arrow:'ic-arrow',check:'ic-check',lock:'ic-lock',fire:'ic-fire',star:'ic-star',rotate:'ic-rotate',back:'ic-back',download:'ic-download',spark:'ic-spark'};
  const MENU = [{page:'home',label:'Beranda',icon:'home'},{page:'lessons',label:'Materi',icon:'lessons'},{page:'cards',label:'Kosakata',icon:'cards'},{page:'practice',label:'Berbicara',icon:'practice'},{page:'profile',label:'Profil',icon:'profile'}];
  const icon = (name) => `<svg class="ico" aria-hidden="true"><use href="#${icons[name] || icons.star}"></use></svg>`;
  const escape = (value) => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
  const attribute = escape;
  const today = () => { const d=new Date(); return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-'); };
  const BASE = {version:1,name:'',xp:0,completed:[],activities:[],reviews:{},rate:.86,dailyXP:{}};
  function sanitise(value){
    if (!value || typeof value !== 'object') return {...BASE,completed:[],activities:[],reviews:{}};
    const knownIDs = new Set(LESSONS.map(l=>l.id));
    const completed = Array.isArray(value.completed) ? [...new Set(value.completed.filter(v=>typeof v==='string'&&knownIDs.has(v)))] : [];
    const activities = Array.isArray(value.activities) ? [...new Set(value.activities.filter(v=>/^\d{4}-\d{2}-\d{2}$/.test(String(v))))].sort() : [];
    const reviews = {};
    if(value.reviews && typeof value.reviews==='object') for(const [k,v] of Object.entries(value.reviews)){
      if(/^([ab][12]-\d{2})__\d+$/.test(k) && v && typeof v==='object' && Number.isFinite(v.due)) reviews[k]={due:Math.max(0,v.due),stage:Math.min(5,Math.max(0,Number(v.stage)||0))};
    }
    const dailyXP={}; if(value.dailyXP && typeof value.dailyXP==='object'){for(const [date,n] of Object.entries(value.dailyXP)){if(/^\d{4}-\d{2}-\d{2}$/.test(date)&&Number.isFinite(Number(n)))dailyXP[date]=Math.max(0,Math.min(100000,Number(n)));}} return {version:1,name:String(value.name||'').slice(0,45),xp:Math.min(1000000,Math.max(0,Number(value.xp)||0)),completed,activities,reviews,rate:Math.max(.6,Math.min(1.15,Number(value.rate)||.86)),dailyXP};
  }
  function load(){try{return sanitise(JSON.parse(localStorage.getItem(STORAGE_KEY)))}catch{return sanitise(null)}}
  let user = load();
  let filterLevel='Semua', searchTerm='', quizChoices={}, quizSubmitted=false, quizScore=0, quizStep=0, quizReveal=false, quizAwarded=false;
  let reviewMode='due', cardRevealed=false, cardOffset=0;
  let phraseOffset=0, transcript='', transcriptStatus='', listening=false;
  let recognizer = null, deferredPrompt = null, toastTimer;
  const save = () => { try{localStorage.setItem(STORAGE_KEY,JSON.stringify(user))}catch{notify('Penyimpanan browser tidak tersedia. Ekspor progres sebagai cadangan.')} };
  const done = (id) => user.completed.includes(id);
  const completedCount = () => LESSONS.filter(l=>done(l.id)).length;
  const currentIndex = () => LESSONS.findIndex(l=>!done(l.id));
  const canOpen = (i) => i===0 || done(LESSONS[i-1].id) || done(LESSONS[i].id);
  const currentLesson = () => LESSONS[Math.max(0,currentIndex())] || LESSONS[LESSONS.length-1];
  const getLevel = () => currentIndex() === -1 ? 'B2' : currentLesson().level;
  const levelsDone = (level) => LESSONS.filter(l=>l.level===level && done(l.id)).length;
  const percent = () => Math.round(completedCount()/LESSONS.length*100);
  const wordCount = () => LESSONS.filter(l=>done(l.id)).reduce((s,l)=>s+l.words.length,0);
  const recordActivity = () => { if(!user.activities.includes(today()))user.activities.push(today()); };
  const earnXP = n => { user.xp+=n; user.dailyXP??={}; user.dailyXP[today()]=(user.dailyXP[today()]||0)+n; };
  const todayXP = () => user.dailyXP?.[today()]||0;
  const mascot = `<img class="mascot-img" src="./mascot.svg" alt="Fritzi, maskot rubah DeutschNest yang ceria">`;
  function streak(){
    let streak=0;const days=new Set(user.activities);const d=new Date();
    if(!days.has(today()))d.setDate(d.getDate()-1);
    for(let i=0;i<366;i++){const date=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');if(!days.has(date)) break;streak++;d.setDate(d.getDate()-1)}
    return streak;
  }
  function notify(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3600)}
  function route(){
    const parts=decodeURIComponent(location.hash.slice(1)||'home').split('/');
    if(parts[0]==='lesson' && LESSONS.some(l=>l.id===parts[1])) return {page:'lesson',id:parts[1]};
    return {page:MENU.some(item=>item.page===parts[0])?parts[0]:'home'};
  }
  function go(page,id){const next='#'+(page==='lesson'?'lesson/'+id:page); if(location.hash===next){render();window.scrollTo({top:0,behavior:'smooth'})}else location.hash=next;}
  function refreshNav(page){
    const active = page==='lesson'?'lessons':page;
    const navHtml=MENU.map(m=>`<button class="nav-link ${active===m.page?'active':''}" data-action="nav" data-page="${m.page}" ${active===m.page?'aria-current="page"':''}>${icon(m.icon)}<span>${m.label}</span></button>`).join('');
    const mobileHtml=MENU.map(m=>`<button class="mobile-tab ${active===m.page?'active':''}" data-action="nav" data-page="${m.page}" aria-label="${m.label}" ${active===m.page?'aria-current="page"':''}>${icon(m.icon)}<span>${m.label}</span></button>`).join('');
    document.getElementById('desktop-nav').innerHTML=navHtml;
    document.getElementById('mobile-nav').innerHTML=mobileHtml;
    document.getElementById('topbar-label').textContent=MENU.find(m=>m.page===active)?.label || 'Materi';
    document.getElementById('topbar-level').textContent='Level '+getLevel();
    document.getElementById('topbar-xp').textContent='⚡ '+user.xp+' XP';
    document.getElementById('topbar-streak').textContent='🔥 '+streak();
    document.getElementById('avatar-btn').textContent=(user.name.trim()[0]||'D').toUpperCase();
  }
  function stat(label,value,ic,note,color){return `<div class="stat-card ${color||''}"><div class="stat-top"><span class="stat-icon ${color||''}">${icon(ic)}</span><span class="stat-note">${note}</span></div><div class="stat-value">${value}</div><div class="stat-label">${label}</div></div>`}
  const UNIT_COLOR = {A1:'green',A2:'blue',B1:'purple',B2:'coral'};
  const UNIT_EMOJI = {A1:'🌱',A2:'🌊',B1:'🚀',B2:'🏆'};
  function levelCards(){return `<div class="roadmap">${LEVELS.map(l=>`<button class="roadmap-card ${UNIT_COLOR[l]} ${getLevel()===l?'active':''}" data-action="level-map" data-level="${l}"><span class="roadmap-top"><span class="roadmap-badge">${UNIT_EMOJI[l]} UNIT ${l}</span><span class="number">${levelsDone(l)}/8</span></span><h3>${l} <span>${LEVEL_NAMES[l]}</span></h3><div class="progress-track"><div class="progress-bar" style="width:${levelsDone(l)/8*100}%"></div></div></button>`).join('')}</div>`}
  function pathHTML(items,compact=false){return `<div class="learning-path ${compact?'path-compact':''}">${items.map(([l,i],pos)=>{
    const locked=!canOpen(i),finished=done(l.id),active=!locked&&!finished;
    const emoji = finished?'✓':locked?'🔒':pos%7===6?'🏆':pos%5===4?'💎':['★','⚡','📚','★','🎯'][pos%5];
    return `<div class="path-step ${['left','center','right','center'][pos%4]} ${finished?'finished':locked?'disabled':'current'}">
      ${active?`<div class="path-bubble">MULAI DI SINI <span class="bubble-arrow">▼</span></div>`:''}
      <button class="path-node ${finished?'is-done':locked?'is-locked':'is-active'}" aria-label="${escape(l.title)} ${locked?'terkunci':finished?'selesai':'siap dipelajari'}" data-action="open-lesson" data-id="${l.id}" ${locked?'disabled':''}><span>${emoji}</span></button>
      <div class="path-caption"><strong>${escape(l.title)}</strong><small>${l.level} · ${finished?'Selesai ✓':locked?'Terkunci':'Pelajaran '+(i+1)}</small></div>
    </div>`}).join('')}</div>`}
  function questCard(){const daily=todayXP(),goal=80;return `<div class="aside-card daily-quest"><div class="aside-title"><span>🎯</span><h3>Tantangan hari ini</h3></div><p>Selesaikan pelajaran atau ulangi kosakata untuk mengumpulkan XP.</p><div class="quest-row"><div class="quest-symbol">⚡</div><div class="quest-main"><strong>Kumpulkan 80 XP</strong><small>${Math.min(daily,goal)} / ${goal} XP hari ini</small><div class="progress-track"><div class="progress-bar" style="width:${Math.min(100,daily/goal*100)}%"></div></div></div></div>${daily>=goal?'<div class="quest-done">🎉 Hebat, target harianmu tercapai!</div>':'<div class="quest-foot">Setiap langkah kecil berarti. Weiter so!</div>'}</div>`}
  function renderHome(){
    const next=currentIndex()===-1?null:currentLesson();const first=next||LESSONS[LESSONS.length-1];
    const current=next?LESSONS.indexOf(next):LESSONS.length-1;
    const group=LESSONS.map((l,i)=>[l,i]).filter(([l])=>l.level===first.level);
    const hello=user.name.trim()?`Hallo, ${escape(user.name.trim())}!`:'Hallo, teman belajar!';
    return `<div class="homepage"><section class="hero"><div class="hero-copy"><span class="hero-kicker">🇩🇪 DEUTSCH MACHT SPAẞ!</span><h1>${hello}<br><span>Petualangan Jermanmu dimulai!</span></h1><p>Belajar sedikit demi sedikit, kumpulkan XP, dan jadilah makin percaya diri berbicara bahasa Jerman.</p><button class="btn hero-btn" data-action="nav" data-page="${next?'lesson':'lessons'}" data-id="${next?next.id:''}">${next?'LANJUT BELAJAR':'ULANGI MATERI'} ${icon('arrow')}</button></div><div class="hero-visual"><span class="mascot-speech">Hallo! 👋</span>${mascot}<span class="hero-daisy">✳</span></div></section>
      <div class="stats-strip">${stat('Total XP',`<span>⚡ ${user.xp}</span>`,'star','Terus bertambah!','yellow')}${stat('Streak',`<span>🔥 ${streak()}</span>`,'fire','hari berturut-turut','coral')}${stat('Pelajaran',`${completedCount()}<span class="stat-slash">/${LESSONS.length}</span>`,'book','sudah selesai','blue')}</div>
      <div class="dashboard-grid"><div class="main-column"><section class="path-section"><div class="unit-banner ${UNIT_COLOR[first.level]}"><div><span class="unit-pretitle">${UNIT_EMOJI[first.level]} UNIT ${LEVELS.indexOf(first.level)+1} • ${first.level}</span><h2>${first.level==='A1'?'Halo, dunia baru!':first.level==='A2'?'Mulai ngobrol lebih jauh':first.level==='B1'?'Semakin percaya diri':'Siap jadi mandiri!'}</h2><p>${LEVEL_NAMES[first.level]} · ${levelsDone(first.level)} dari 8 pelajaran selesai</p></div><span class="unit-banner-icon" aria-hidden="true">${UNIT_EMOJI[first.level]}</span></div>
        <div class="map-intro"><span>JALUR BELAJARMU</span><strong>${percent()}% selesai</strong></div>
        ${pathHTML(group,true)}<div class="path-end"><span>✨</span><strong>${currentIndex()===-1?'Semua pelajaran tuntas!':'Selesaikan unit ini untuk membuka petualangan selanjutnya!'}</strong><button class="text-link" data-action="nav" data-page="lessons">Lihat semua unit ${icon('arrow')}</button></div></section></div>
        <aside class="home-rail">${questCard()}<div class="aside-card tip-rail"><div class="aside-title"><span>💬</span><h3>Ungkapan hari ini</h3></div><div class="german-quote" lang="de">Übung macht den Meister.</div><p>Latihan membuat kita mahir.</p><button class="btn outline block" data-action="sound" data-text="Übung macht den Meister.">${icon('sound')} DENGARKAN</button></div><div class="aside-card progress-rail"><div class="aside-title"><span>🗺️</span><h3>Peta petualangan</h3></div>${levelCards()}</div></aside>
      </div></div>`;
  }
  function lessonTile(l,i){const locked=!canOpen(i);return `<article class="lesson-tile ${locked?'locked':''}"><div class="lesson-top"><span class="lesson-num">${l.level} · PELAJARAN ${String(i+1).padStart(2,'0')}</span><span class="pill ${done(l.id)?'mint':''}">${done(l.id)?'✓ Selesai':locked?'🔒 Terkunci':'⚡ Tersedia'}</span></div><div><h3>${escape(l.title)}</h3><p>${escape(l.subtitle)}</p></div><div class="lesson-bottom"><span class="muted" style="font-size:11px">📖 ${l.words.length} kosakata · 4 kuis</span><button class="btn sm ${locked?'ghost':'primary'}" data-action="open-lesson" data-id="${l.id}" ${locked?'disabled':''}>${locked?icon('lock'):done(l.id)?icon('check'):icon('arrow')}${locked?'Terkunci':done(l.id)?'Ulangi':'Mulai'}</button></div></article>`}
  function renderLessons(){const list=LESSONS.map((l,i)=>[l,i]).filter(([l])=>(filterLevel==='Semua'||l.level===filterLevel)&&`${l.title} ${l.subtitle} ${l.grammar}`.toLocaleLowerCase('id').includes(searchTerm.toLocaleLowerCase('id')));
    const simple=searchTerm.trim().length>0;
    return `<div class="eyebrow">🗺️ PETA PETUALANGAN</div><h1 class="page-title">Belajar seperti bermain! ✨</h1><p class="page-desc">Ikuti jalur untuk membuka 32 pelajaran. Pilih unit, dengarkan pengucapan, dan selesaikan kuis untuk memperoleh XP.</p><div class="toolbar"><div class="chips">${['Semua',...LEVELS].map(l=>`<button class="chip ${filterLevel===l?'active':''}" data-action="filter-level" data-level="${l}">${l==='Semua'?'🌈 Semua Unit':l}</button>`).join('')}</div><input class="search-input" id="search-lessons" placeholder="🔍 Cari materi..." value="${attribute(searchTerm)}" aria-label="Cari materi"></div>
    ${simple?`<div class="lesson-grid">${list.map(([l,i])=>lessonTile(l,i)).join('')||'<div class="empty-state"><p>Tidak ada materi yang cocok.</p></div>'}</div>`:`<div class="all-units">${LEVELS.filter(l=>filterLevel==='Semua'||filterLevel===l).map(level=>{const items=list.filter(([l])=>l.level===level);return `<section class="unit-stage"><div class="unit-banner ${UNIT_COLOR[level]}"><div><span class="unit-pretitle">${UNIT_EMOJI[level]} UNIT ${LEVELS.indexOf(level)+1} · LEVEL ${level}</span><h2>${{A1:'Mulai dari Halo!',A2:'Siap bicara sehari-hari',B1:'Berani mengungkapkan pendapat',B2:'Bahasa Jerman tingkat mandiri'}[level]}</h2><p>${LEVEL_NAMES[level]} · ${levelsDone(level)} dari 8 selesai</p></div><span class="unit-banner-icon">${UNIT_EMOJI[level]}</span></div>${pathHTML(items)}</section>`}).join('')}</div>`}`;
  }
  function quizQuestions(l){
    const selected=[0,Math.min(2,l.words.length-1),Math.min(4,l.words.length-1),Math.min(6,l.words.length-1)];
    return selected.map((wordIdx,qi)=>{
      const [de,id]=l.words[wordIdx];
      const optionPool = l.words.map(w=>w[1]).filter((x)=>x!==id);
      const alternatives = [...new Set(optionPool)].slice(qi,qi+3);
      for(const x of optionPool){if(alternatives.length>=3)break;if(!alternatives.includes(x))alternatives.push(x)}
      const opts=alternatives.slice(0,3);opts.splice(qi%4,0,id);
      return {de,id,opts};
    });
  }
  function renderQuiz(l){
    const questions=quizQuestions(l);
    if(quizSubmitted)return `<div class="quiz-card quiz-finish"><div class="finish-emoji">${quizScore>=3?'🎉':'💪'}</div><div class="finish-kicker">${quizScore>=3?'LEKTION ABGESCHLOSSEN!':'AYO COBA LAGI!'}</div><h3>${quizScore>=3?'Fantastisch! Kamu hebat!':'Jangan menyerah!'}</h3><p>${quizScore>=3?'Kamu berhasil membuka pelajaran berikutnya.':'Pelajari lagi kosakata di atas lalu ulangi kuis.'}</p><div class="finish-score"><strong>${quizScore}/4</strong><span>Jawaban benar</span></div>${quizScore>=3?`<div class="xp-reward">${quizAwarded?'⚡ +80 XP berhasil didapat!':'✨ Pelajaran ini sudah tercatat selesai'}</div>`:''}<div class="quiz-actions"><button class="btn outline" data-action="retry-quiz">${icon('rotate')} Ulangi</button>${quizScore>=3?`<button class="btn primary" data-action="next-lesson" data-id="${l.id}">PELAJARAN BERIKUTNYA ${icon('arrow')}</button>`:''}</div></div>`;
    const qi=quizStep,q=questions[qi],chosen=quizChoices[qi];
    return `<div class="quiz-card"><div class="quiz-progress-top"><span>SOAL ${qi+1} DARI ${questions.length}</span><strong>⚡ +80 XP</strong></div><div class="quiz-pips">${questions.map((_,i)=>`<span class="quiz-pip ${i<=qi?'filled':''}"></span>`).join('')}</div><div class="quiz-illustration">${['🗣️','🧠','💬','🎯'][qi]}</div><h3 class="quiz-title">Apa arti kata ini?</h3><div class="quiz-word" lang="de">${escape(q.de)} <button class="btn sound-round" data-action="sound" data-text="${attribute(q.de)}" aria-label="Dengarkan ${attribute(q.de)}">${icon('sound')}</button></div><div class="quiz-question"><div class="options">${q.opts.map((val,idx)=>{const selected=chosen===val,correct=quizReveal&&val===q.id,bad=quizReveal&&selected&&val!==q.id;return `<label class="answer-option ${selected?'selected':''} ${correct?'good':''} ${bad?'bad':''}"><input type="radio" name="question-${qi}" value="${attribute(val)}" data-question="${qi}" ${selected?'checked':''} ${quizReveal?'disabled':''}><span class="option-letter">${idx+1}</span><span>${escape(val)}</span>${correct?'<b>✓</b>':''}</label>`}).join('')}</div></div>${quizReveal?`<div class="quiz-hint ${chosen===q.id?'success':''}"><strong>${chosen===q.id?'🎉 Jawaban benar!':'📚 Kita pelajari bersama'}</strong><span>${chosen===q.id?'Sehr gut! Pertahankan!':`Jawabannya adalah: ${escape(q.id)}`}</span></div>`:''}<div class="quiz-actions">${quizReveal?`<button class="btn primary block" data-action="next-question">${qi===3?'LIHAT HASIL':'LANJUTKAN'} ${icon('arrow')}</button>`:`<button class="btn primary block" data-action="check-current" ${chosen===undefined?'disabled':''}>PERIKSA JAWABAN ${icon('check')}</button>`}</div></div>`;
  }
  function renderLesson(id){
    const i=LESSONS.findIndex(l=>l.id===id); if(i===-1)return renderLessons();
    const l=LESSONS[i];if(!canOpen(i))return `<div class="empty-state"><div class="symbol">🔒</div><h3>Pelajaran terkunci</h3><p>Selesaikan pelajaran sebelumnya untuk membukanya.</p><button class="btn primary" data-action="nav" data-page="lessons">Kembali ke materi</button></div>`;
    return `<div class="content-head"><button class="btn ghost sm" data-action="nav" data-page="lessons">${icon('back')} Semua materi</button><span class="pill ${done(id)?'mint':''}">${l.level} · ${done(id)?'Sudah selesai':'Sedang dipelajari'}</span></div><div class="lesson-banner"><div class="eyebrow">LEKTION ${i+1} · ${l.level}</div><h1>${escape(l.title)}</h1><p>${escape(l.subtitle)}. Pelajari dengan tenang, lalu uji pemahamanmu di akhir.</p></div>
    <section class="lesson-section"><h2>📚 Penjelasan guru</h2><div class="grammar-box"><p>${escape(l.grammar)}</p></div><div class="tip-box">💡 <strong>Tips:</strong> ${escape(l.tip)}</div></section>
    <section class="lesson-section"><div class="section-heading"><h2>🔤 Kosakata penting</h2><span class="hint">Ketuk ikon audio untuk mendengar</span></div><div class="vocab-grid">${l.words.map(([de,id])=>`<div class="vocab-item"><div><strong lang="de">${escape(de)}</strong><small>${escape(id)}</small></div><button class="btn icon-only" data-action="sound" data-text="${attribute(de)}" aria-label="Dengarkan ${attribute(de)}">${icon('sound')}</button></div>`).join('')}</div></section>
    <section class="lesson-section"><h2>💬 Contoh percakapan</h2><div class="panel">${l.dialog.map(([who,de,id])=>`<div class="dialogue-row"><div class="dialogue-avatar">${escape(who[0])}</div><div class="dialogue-content"><div class="who">${escape(who)}</div><div class="say" lang="de">${escape(de)}</div><div class="translation">${escape(id)}</div><button class="btn ghost sm" data-action="sound" data-text="${attribute(de)}">${icon('sound')} Putar suara</button></div></div>`).join('')}</div></section>
    <section class="lesson-section"><div class="section-heading"><h2>🎙️ Ayo ucapkan!</h2><span class="hint">Latih mulut dan telingamu</span></div><div class="panel"><p class="muted" style="margin:0 0 10px;font-size:12px">Dengarkan kalimat ini, lalu coba ucapkan dengan lantang.</p><div class="phrase-german" lang="de">${escape(l.speak)}</div><div class="settings-actions"><button class="btn primary sm" data-action="sound" data-text="${attribute(l.speak)}">${icon('sound')} Dengarkan</button><button class="btn ghost sm" data-action="open-practice" data-id="${l.id}">${icon('mic')} Latihan mikrofon</button></div></div></section>
    <section class="lesson-section"><div class="section-heading"><h2>📝 Kuis pemahaman</h2><span class="hint">Minimal 3 dari 4 benar</span></div>${renderQuiz(l)}</section>`;
  }
  function availableWords(){const idx=currentIndex();const accessible=idx===-1?LESSONS.length:idx+1;return LESSONS.slice(0,accessible).flatMap(l=>l.words.map(([de,id],i)=>({de,id,key:`${l.id}__${i}`,level:l.level,lesson:l.title})));}
  function cardQueue(){const words=availableWords();if(reviewMode==='all')return words;return words.filter(w=>(user.reviews[w.key]?.due||0)<=Date.now());}
  function renderCards(){const words=cardQueue(),w=words.length?words[cardOffset%words.length]:null;const countAll=availableWords().length;
    return `<div class="eyebrow">KARTU KOSAKATA</div><h1 class="page-title">Ingat lebih lama, belajar lebih cerdas.</h1><p class="page-desc">Balik kartu untuk melihat arti. Tandai kata yang sudah kamu ingat; kata yang sulit akan muncul lebih cepat dalam sesi ulang berikutnya.</p><div class="toolbar"><div class="chips"><button class="chip ${reviewMode==='due'?'active':''}" data-action="review-mode" data-mode="due">Untuk diulang (${availableWords().filter(w=>(user.reviews[w.key]?.due||0)<=Date.now()).length})</button><button class="chip ${reviewMode==='all'?'active':''}" data-action="review-mode" data-mode="all">Semua kartu (${countAll})</button></div><span class="muted" style="font-size:12px">${words.length} kartu tersedia</span></div>
    <div class="review-layout">${w?`<div><div class="flip-card ${cardRevealed?'revealed':''}" role="group" aria-label="Kartu kosakata"><span class="card-count">${cardOffset%words.length+1} / ${words.length} · ${w.level}</span><span class="eyebrow">${cardRevealed?'BAHASA INDONESIA':'BAHASA JERMAN'}</span><div class="card-title" lang="de">${escape(w.de)}</div>${cardRevealed?`<div class="revealed-meaning">${escape(w.id)}</div>`:`<small>Ketuk “Lihat arti” untuk membalik</small>`}<button class="btn sm" data-action="sound" data-text="${attribute(w.de)}">${icon('sound')} Dengarkan</button></div><div class="flash-actions">${cardRevealed?`<button class="btn ghost" data-action="rate-card" data-rating="again">Belum ingat</button><button class="btn primary" data-action="rate-card" data-rating="known">${icon('check')} Sudah ingat</button>`:`<button class="btn yellow" data-action="flip-card">Lihat arti ${icon('arrow')}</button>`}<button class="btn ghost" data-action="next-card">Lewati ${icon('arrow')}</button></div></div>`:`<div class="empty-state"><div class="symbol">🎉</div><h3>Semua kartu sudah ditinjau!</h3><p>Kembali lagi saat jadwal pengulangan tiba, atau buka semua kartu untuk berlatih bebas.</p><button class="btn primary" data-action="review-mode" data-mode="all">Lihat semua kartu</button></div>`}
    <aside class="panel"><div class="eyebrow">PANDUAN REVIEW</div><h2 style="margin:8px 0 14px">Ingat dengan pengulangan</h2><div class="review-tip"><p>1. Baca kosakata Jerman pada kartu.</p><p>2. Tebak artinya sebelum melihat jawaban.</p><p>3. Tandai <strong>Sudah ingat</strong> atau <strong>Belum ingat</strong>.</p><p>4. Ulangi ketika kartu masuk jadwal latihan berikutnya.</p></div><div class="notice">💡 Audio memakai suara Jerman dari browser atau perangkatmu. Ketersediaan aksen Jerman bergantung pada perangkat.</div></aside></div>`;
  }
  function practiceItems(){const i=Math.max(0,currentIndex());return LESSONS.slice(Math.max(0,i-5),Math.min(LESSONS.length,i+1)).map(l=>({de:l.speak,title:l.title,level:l.level,id:l.id}));}
  function renderPractice(){const list=practiceItems(),item=list[phraseOffset%list.length]||list[0];
    return `<div class="eyebrow">LATIHAN BERBICARA</div><h1 class="page-title">Bicara lebih percaya diri.</h1><p class="page-desc">Dengarkan kalimat Jerman, lalu ulangi dengan mikrofon. Browser akan menampilkan kata yang tertangkap, bukan nilai ketepatan aksen secara ilmiah.</p><div class="practice-layout"><div class="panel practice-center"><div class="practice-circle ${listening?'listening':''}">${icon('mic')}</div><span class="pill">${item.level} · ${escape(item.title)}</span><p class="practice-target" lang="de">${escape(item.de)}</p><p class="practice-subtitle">Latih pengucapanmu secara perlahan, kata per kata.</p><div class="practice-controls"><button class="btn ghost" data-action="sound" data-text="${attribute(item.de)}">${icon('sound')} Dengarkan</button><button class="btn primary" data-action="listen" ${listening?'disabled':''}>${icon('mic')} ${listening?'Mendengarkan…':'Mulai bicara'}</button></div>${transcript||transcriptStatus?`<div class="transcript-box"><strong>${escape(transcriptStatus||'Hasil transkripsi')}</strong>${transcript?`<span lang="de">${escape(transcript)}</span>`:''}</div>`:''}<div class="notice" style="text-align:left">ℹ️ Pengenalan suara memerlukan izin mikrofon dan browser yang mendukung. Beberapa browser memproses suara melalui server dan mungkin membutuhkan internet. Kecocokan teks bukan penilaian aksen.</div></div>
    <aside class="panel"><div class="eyebrow">PILIH KALIMAT</div><h2 style="margin:7px 0 15px">Materi latihan</h2><div class="phrase-list">${list.map((l,i)=>`<button class="phrase-select ${phraseOffset%list.length===i?'active':''}" data-action="select-phrase" data-index="${i}"><strong>${escape(l.level)} · ${escape(l.title)}</strong><br><span lang="de">${escape(l.de)}</span></button>`).join('')}</div></aside></div>`;
  }
  function renderProfile(){
    return `<div class="eyebrow">PROFIL PELAJAR</div><h1 class="page-title">Perjalananmu, aturanmu.</h1><p class="page-desc">Atur nama dan kecepatan suara. Data belajar tersimpan di browser pada perangkat ini — gunakan ekspor/impor untuk memindahkannya.</p>
    <div class="profile-grid"><section class="panel"><div class="profile-hero"><div class="profile-bubble">${escape((user.name.trim()[0]||'D').toUpperCase())}</div><div><h2>${escape(user.name.trim()||'Deutschlerner')}</h2><p>Pelajar bahasa Jerman · ${getLevel()}</p></div></div><div class="settings-section"><label for="profile-name" class="field-label">Nama panggilan</label><input id="profile-name" class="field setting-input" placeholder="Tulis namamu ..." value="${attribute(user.name)}" maxlength="45"><button class="btn primary" data-action="save-profile">${icon('check')} Simpan profil</button></div><div class="settings-section"><label for="voice-rate" class="field-label">Kecepatan pengucapan</label><div class="range-row"><span>🐢</span><input id="voice-rate" type="range" min="0.6" max="1.15" step="0.05" value="${user.rate}"><span id="voice-rate-label">${user.rate.toFixed(2)}×</span></div><button class="btn ghost sm" style="margin-top:12px" data-action="sound" data-text="Hallo! Wie geht es dir?">${icon('sound')} Tes suara Jerman</button></div></section>
    <section class="panel"><div class="eyebrow">HASIL BELAJAR</div><h2 style="margin:6px 0 20px">Statistik</h2><div class="progress-track"><div class="progress-bar" style="width:${percent()}%"></div></div><div class="progress-meta"><span>Progres selesai</span><span>${percent()}%</span></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:25px">${stat('Pelajaran',completedCount(),'book','','')}${stat('Kosakata selesai',wordCount(),'cards','','mint')}${stat('XP',user.xp,'star','','yellow')}${stat('Hari berturut',streak(),'fire','','mint')}</div></section></div>
    <div class="panel" style="margin-top:19px"><div class="eyebrow">CADANGAN & PRIVASI</div><h2 style="margin:7px 0 8px">Data belajarmu tetap milikmu</h2><p class="muted" style="font-size:12px;max-width:690px">Progres disimpan di penyimpanan lokal browser, tidak otomatis sinkron antara HP dan PC. Ekspor file JSON untuk memindahkan atau mencadangkannya. Jangan mengunggah file progres pribadimu ke repo publik.</p><div class="settings-actions"><button class="btn primary" data-action="export">${icon('download')} Ekspor progres</button><button class="btn ghost" data-action="import">${icon('rotate')} Impor progres</button><button class="btn ghost" data-action="install" id="install-app">📲 Pasang di HP</button></div><div class="notice">Jika tombol instalasi tidak didukung, buka website di browser HP lalu gunakan menu “Tambahkan ke Layar Utama” / “Add to Home Screen” (jika tersedia). Website dapat dibuka offline setelah pertama kali berhasil dimuat; fitur mikrofon belum tentu berfungsi offline.</div></div>`;
  }
  function render(){
    const r=route();refreshNav(r.page);
    MAIN.innerHTML = r.page==='home'?renderHome():r.page==='lessons'?renderLessons():r.page==='lesson'?renderLesson(r.id):r.page==='cards'?renderCards():r.page==='practice'?renderPractice():renderProfile();
  }
  function navigate(page,id){if(page==='lesson'&&!id)return;go(page,id)}
  function speak(text){
    if(!('speechSynthesis' in window)){notify('Browser ini belum mendukung text-to-speech.');return}
    const clean=String(text).replace('…','').trim();if(!clean)return;
    try{const synth=window.speechSynthesis;synth.cancel();const utt=new SpeechSynthesisUtterance(clean);utt.lang='de-DE';utt.rate=user.rate;utt.pitch=1;const voices=synth.getVoices(),german=voices.find(v=>/^de[-_]/i.test(v.lang))||voices.find(v=>v.lang.toLowerCase()==='de');if(german)utt.voice=german;utt.onerror=()=>notify('Audio tidak dapat diputar. Periksa pengaturan suara perangkat.');synth.speak(utt);}
    catch{notify('Audio gagal diputar di browser ini.')}
  }
  function normalText(s){return String(s).toLowerCase().normalize('NFC').replaceAll('ä','ae').replaceAll('ö','oe').replaceAll('ü','ue').replaceAll('ß','ss').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim()}
  function dist(a,b){const m=a.length,n=b.length;let prev=Array.from({length:n+1},(_,i)=>i);for(let i=1;i<=m;i++){const row=[i];for(let j=1;j<=n;j++)row[j]=Math.min(row[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));prev=row}return prev[n]}
  function listen(){
    const Recognize=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!Recognize){transcript='';transcriptStatus='Browser tidak mendukung pengenalan suara. Gunakan Chrome versi terbaru atau tetap berlatih dengan tombol Dengarkan.';render();return}
    if(listening)return;
    const items=practiceItems(),target=items[phraseOffset%items.length].de;
    transcript='';transcriptStatus='Mendengarkan… ucapkan kalimat sekarang.';listening=true;render();
    try{window.speechSynthesis?.cancel();recognizer=new Recognize();recognizer.lang='de-DE';recognizer.interimResults=false;recognizer.maxAlternatives=1;recognizer.continuous=false;
      recognizer.onresult=event=>{const spoken=event.results[0][0].transcript;const a=normalText(spoken),b=normalText(target);const similarity=1-dist(a,b)/Math.max(1,a.length,b.length);transcript=spoken;transcriptStatus=similarity>=.85?'Sangat cocok! Teks yang dikenali sesuai target.':similarity>=.55?'Cukup dekat. Coba dengarkan dan ulangi sekali lagi.':'Teks yang dikenali berbeda. Putar contohnya dan coba ulangi.';render();};
      recognizer.onerror=event=>{transcript='';transcriptStatus=event.error==='not-allowed'?'Izin mikrofon ditolak. Izinkan mikrofon pada browser.':event.error==='no-speech'?'Tidak ada suara terdeteksi. Coba bicara lebih dekat ke mikrofon.':'Pengenalan suara gagal: '+event.error;listening=false;render()};
      recognizer.onend=()=>{listening=false;recognizer=null;render()};recognizer.start();
    }catch{listening=false;transcriptStatus='Mikrofon tidak dapat dimulai. Coba lagi setelah memberi izin.';render()}
  }
  function stopListen(){if(recognizer){try{recognizer.abort()}catch{}}listening=false;recognizer=null}
  function rateCard(rating){const words=cardQueue();if(!words.length)return;const item=words[cardOffset%words.length];const previous=user.reviews[item.key]||{stage:0};const stage=rating==='known'?Math.min(5,previous.stage+1):0;const days=[1,1,3,7,14,30];const delay=rating==='known'?days[stage]*86400000:5*60000;user.reviews[item.key]={stage,due:Date.now()+delay};if(reviewMode==='due'){cardOffset=0;}else{cardOffset++}cardRevealed=false;earnXP(rating==='known'?3:1);recordActivity();save();render();notify(rating==='known'?'Sehr gut! Kartu dijadwalkan ulang.':'Tidak apa-apa, kata ini akan muncul lagi.');}
  function checkQuiz(){const l=LESSONS.find(x=>x.id===route().id);const qs=quizQuestions(l);if(qs.some((_,i)=>quizChoices[i]===undefined)){notify('Jawab semua 4 soal terlebih dahulu.');return}quizScore=qs.filter((q,i)=>quizChoices[i]===q.id).length;quizSubmitted=true;if(quizScore>=3&&!done(l.id)){quizAwarded=true;user.completed.push(l.id);earnXP(80);recordActivity();save();notify('Wunderbar! +80 XP dan pelajaran berikutnya terbuka!')}render()}
  function resetQuiz(){quizChoices={};quizSubmitted=false;quizScore=0;quizStep=0;quizReveal=false;quizAwarded=false}
  function onClick(event){const el=event.target.closest('[data-action]');if(!el)return;const a=el.dataset.action;
    if(a==='nav'){if(el.dataset.page==='lesson'){const i=LESSONS.findIndex(l=>l.id===el.dataset.id);if(i!==-1&&canOpen(i)){resetQuiz();navigate('lesson',el.dataset.id)}}else navigate(el.dataset.page);return}
    if(a==='open-lesson'){resetQuiz();navigate('lesson',el.dataset.id);return}
    if(a==='sound'){speak(el.dataset.text);return}
    if(a==='filter-level'){filterLevel=el.dataset.level;render();return}
    if(a==='level-map'){filterLevel=el.dataset.level;searchTerm='';navigate('lessons');render();return}
    if(a==='check-current'){if(quizChoices[quizStep]===undefined){notify('Pilih satu jawaban terlebih dahulu.');return}quizReveal=true;render();document.querySelector('.quiz-card')?.scrollIntoView({block:'center',behavior:'smooth'});return}
    if(a==='next-question'){if(quizStep>=3){checkQuiz();}else{quizStep++;quizReveal=false;render()}document.querySelector('.quiz-card')?.scrollIntoView({block:'start',behavior:'smooth'});return}
    if(a==='check-quiz'){checkQuiz();return}
    if(a==='retry-quiz'){resetQuiz();render();return}
    if(a==='next-lesson'){const i=LESSONS.findIndex(l=>l.id===el.dataset.id),next=LESSONS[i+1];resetQuiz();if(next)navigate('lesson',next.id);else navigate('home');return}
    if(a==='open-practice'){const idx=practiceItems().findIndex(p=>p.id===el.dataset.id);phraseOffset=idx===-1?0:idx;transcript='';transcriptStatus='';navigate('practice');return}
    if(a==='review-mode'){reviewMode=el.dataset.mode;cardOffset=0;cardRevealed=false;render();return}
    if(a==='flip-card'){cardRevealed=true;render();return}
    if(a==='next-card'){cardOffset++;cardRevealed=false;render();return}
    if(a==='rate-card'){rateCard(el.dataset.rating);return}
    if(a==='select-phrase'){stopListen();phraseOffset=Number(el.dataset.index)||0;transcript='';transcriptStatus='';render();return}
    if(a==='listen'){listen();return}
    if(a==='save-profile'){user.name=document.getElementById('profile-name').value.trim().slice(0,45);save();render();notify('Profil tersimpan. Viel Erfolg!');return}
    if(a==='export'){const json=JSON.stringify(user,null,2);const blob=new Blob([json],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='deutschnest-progres-'+today()+'.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),500);notify('Cadangan progres berhasil disiapkan.');return}
    if(a==='import'){document.getElementById('import-file').click();return}
    if(a==='install'){if(deferredPrompt){deferredPrompt.prompt();deferredPrompt.userChoice.then(()=>deferredPrompt=null);}else{notify('Gunakan menu browser → Tambahkan ke Layar Utama (jika tersedia).')}return}
  }
  function onChange(event){
    if(event.target.matches('input[data-question]')){const idx=Number(event.target.dataset.question);quizChoices[idx]=event.target.value;event.target.closest('.options').querySelectorAll('.answer-option').forEach(el=>el.classList.toggle('selected',!!el.querySelector('input:checked')));const check=event.target.closest('.quiz-card')?.querySelector('[data-action=check-current]');if(check)check.disabled=false;}
    if(event.target.id==='voice-rate'){user.rate=Number(event.target.value);document.getElementById('voice-rate-label').textContent=user.rate.toFixed(2)+'×';save()}
    if(event.target.id==='search-lessons'){searchTerm=event.target.value;const pos=event.target.selectionStart;render();const input=document.getElementById('search-lessons');if(input){input.focus();input.setSelectionRange(pos,pos)}}
    if(event.target.id==='import-file'){
      const file=event.target.files?.[0];if(!file)return;
      file.text().then(raw=>{let parsed;try{parsed=JSON.parse(raw)}catch{throw new Error('File bukan JSON yang valid')};if(!parsed||parsed.version!==1||!Array.isArray(parsed.completed))throw new Error('Format cadangan DeutschNest tidak valid');if(!window.confirm('Impor akan mengganti progres saat ini. Lanjutkan?'))return;user=sanitise(parsed);save();resetQuiz();go('profile');render();notify('Progres berhasil diimpor!')}).catch(err=>notify(err.message||'File tidak dapat dibaca')).finally(()=>{event.target.value=''});
    }
  }
  document.addEventListener('click',onClick);
  document.addEventListener('input',(e)=>{if(e.target.id==='search-lessons'||e.target.id==='voice-rate')onChange(e)});
  document.addEventListener('change',(e)=>{if(e.target.id==='import-file'||e.target.matches('input[data-question]'))onChange(e)});
  window.addEventListener('hashchange',()=>{stopListen();resetQuiz();render();window.scrollTo({top:0,behavior:'auto'})});
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e});
  if('serviceWorker'in navigator && (location.protocol==='https:'||location.hostname==='localhost')) navigator.serviceWorker.register('./sw.js').catch(()=>{});
  render();
})();
