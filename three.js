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


  // rsvp form (visual only — no backend wired up)

  
  const form = document.getElementById("rsvpForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const button = form.querySelector("button");

    button.disabled = true;
    button.textContent = "Отправляем...";

    const data = {
        name: document.getElementById("name").value,
        attend: document.querySelector('input[name="attend"]:checked').value,
        side: document.querySelector('input[name="side"]:checked').value,
        guests: document.getElementById("guests").value
    };

    try {
        const response = await fetch("https://proud-art-0acc.rwgjsrz5pk.workers.dev/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error();

        document.getElementById("rsvp-note").style.display = "block";

        form.reset();

    } catch (err) {
        alert("Ошибка отправки 😢");
    }

    button.disabled = false;
    button.textContent = "Отправить";
});