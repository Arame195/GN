// envelope open
  const envelope = document.getElementById('envelope');
  const sealBtn = document.getElementById('sealBtn');
  function openEnvelope(){
    envelope.classList.add('opening');
    setTimeout(()=> envelope.classList.add('hidden'), 1100);
  }
  sealBtn.addEventListener('click', openEnvelope);
  sealBtn.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') openEnvelope(); });

  // build calendar for June 2026, highlight 7th
  const calGrid = document.getElementById('calGrid');
  const dows = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  dows.forEach(d=>{
    const el = document.createElement('div');
    el.className='dow'; el.textContent=d; calGrid.appendChild(el);
  });
  // June 1 2026 is a Monday
  const firstWeekday = 5; // Mon = 0 offset
  const daysInMonth = 31;
  for(let i=0;i<firstWeekday;i++){
    const blank = document.createElement('div');
    calGrid.appendChild(blank);
  }
  for(let d=1; d<=daysInMonth; d++){
    const el = document.createElement('div');
    el.className = 'day' + (d===8 ? ' marked' : '');
    el.textContent = d;
    calGrid.appendChild(el);
  }

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold:0.15 });
  revealEls.forEach(el=>io.observe(el));

  // countdown to 7 June 2026, 15:00
  const target = new Date('2026-06-07T15:00:00');
  function tick(){
    const now = new Date();
    let diff = Math.max(0, target - now);
    const d = Math.floor(diff/86400000); diff -= d*86400000;
    const h = Math.floor(diff/3600000); diff -= h*3600000;
    const m = Math.floor(diff/60000); diff -= m*60000;
    const s = Math.floor(diff/1000);
    document.getElementById('cd-d').textContent = String(d).padStart(2,'0');
    document.getElementById('cd-h').textContent = String(h).padStart(2,'0');
    document.getElementById('cd-m').textContent = String(m).padStart(2,'0');
    document.getElementById('cd-s').textContent = String(s).padStart(2,'0');
  }
  tick(); setInterval(tick, 1000);

  // rsvp form (visual only — no backend wired up)
  document.getElementById('rsvpForm').addEventListener('submit', function(e){
    e.preventDefault();
    document.getElementById('rsvp-note').classList.add('show');
    this.reset();
  });

  