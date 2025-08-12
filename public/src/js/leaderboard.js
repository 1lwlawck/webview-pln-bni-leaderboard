(function () {
  const boardList = document.getElementById("boardList");
  const sheet  = document.getElementById("rankSheet");
  const podium = document.querySelector(".podium");
  const winner = document.querySelector(".winner");
  const selectedPeriod = document.getElementById("selectedPeriod");
  const periodOptions = document.querySelectorAll(".period-option");
  const periodTrigger = document.getElementById("periodTrigger");
  const modalEl = document.getElementById("periodModal");
  if (!boardList || !sheet || !podium || !winner || !selectedPeriod || !modalEl) return;

  const periodModal = bootstrap.Modal.getOrCreateInstance(modalEl);

  const FILES = {
    "2025-10-11": "src/data/okt-nov-2025.json",
    "2025-09-10": "src/data/sep-okt-2025.json",
    "2025-08-09": "src/data/agu-sep-2025.json"
  };

  const GAP=8, RADIUS_FIX=20, MIN_TOP=12, PADDING_SAFE=12, MIN_LIST_SPACE=140;
  const initials = (name)=> name.split(/\s+/).slice(0,2).map(s=>s[0]?.toUpperCase()||"").join("");

function placeSheetAndResize(){
  const vh = window.innerHeight;
  const podiumBottom = podium.getBoundingClientRect().bottom;
  const desiredTop = Math.max(MIN_TOP, Math.round(podiumBottom - RADIUS_FIX + GAP));
  const currentTop = sheet.getBoundingClientRect().top;
  let offset = desiredTop - currentTop; if (offset < 0) offset = 0;
  sheet.style.transform = `translateY(${offset}px)`;

  const winnerH = winner.getBoundingClientRect().height || 0;
  const cs = getComputedStyle(sheet);
  const padTop = parseFloat(cs.paddingTop) || 0;
  const padBottom = parseFloat(cs.paddingBottom) || 0;
  const gapY = parseFloat(cs.gap || cs.rowGap || 0) || 0; // <— baru
  const handleH = sheet.querySelector('.sheet-handle')?.getBoundingClientRect().height || 0; // <— baru

  const available = Math.max(MIN_LIST_SPACE, vh - desiredTop - winnerH - PADDING_SAFE);
  const inner = Math.max(100, available - padTop - padBottom - gapY - handleH); // <— disesuaikan

  const board = document.querySelector(".board");
  if (board){
    board.style.maxHeight = `${inner}px`;
    board.style.overflowY = "auto";
  }
}


  function render(data){
    const sorted = [...data].sort((a,b)=> b.score - a.score || a.name.localeCompare(b.name));
    const [p1,p2,p3] = sorted.slice(0,3);
    const rest = sorted.slice(3);

    const cards = podium.querySelectorAll(".podium-card");
    if (cards.length >= 3){
      const c2 = cards[0]; c2.querySelector(".avatar").textContent = initials(p2.name);
      c2.querySelector(".name").textContent = p2.name; c2.querySelector(".score-chip").textContent = p2.score;

      const c1 = cards[1]; c1.querySelector(".avatar").textContent = initials(p1.name);
      c1.querySelector(".name").textContent = p1.name; c1.querySelector(".score-chip").textContent = p1.score;

      const c3 = cards[2]; c3.querySelector(".avatar").textContent = initials(p3.name);
      c3.querySelector(".name").textContent = p3.name; c3.querySelector(".score-chip").textContent = p3.score;
    }

    winner.querySelector(".avatar-inline").textContent = initials(p1.name);
    winner.querySelector(".winner-name").textContent = p1.name;
    winner.querySelector(".winner-score").textContent = p1.score;

    boardList.innerHTML = rest.map((d,i)=>`
      <div class="item">
        <div class="left">
          <div class="rank">${i+4}</div>
          <div class="avatar-sm">${initials(d.name)}</div>
          <div class="who">${d.name}</div>
        </div>
        <div class="score">${d.score}</div>
      </div>
    `).join("");

    requestAnimationFrame(placeSheetAndResize);
  }

  let _snackTimer=null;
  function toast(msg,type){
    const el=document.getElementById("snackbar"); if(!el) return;
    el.textContent=msg; el.className="snackbar"+(type?` ${type}`:"");
    el.classList.add("show"); clearTimeout(_snackTimer);
    _snackTimer=setTimeout(()=>el.classList.remove("show"),2200);
  }

  async function loadPeriod(val){
    const url = FILES[val];
    if(!url){ console.warn("No file for key:", val); return; }
    try{
      const r = await fetch(url,{cache:"no-store"});
      if(!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      if(!Array.isArray(data) || data.length < 3) throw new Error("Data tidak valid");
      render(data);
    }catch(e){
      console.error(e); toast("Gagal memuat data periode.","warn");
    }
  }

  window.addEventListener("load", ()=>{
    const active = document.querySelector(".period-option.active");
    if (active) loadPeriod(active.dataset.value);
    requestAnimationFrame(placeSheetAndResize);
  });

  window.addEventListener("resize", placeSheetAndResize);

  periodTrigger.addEventListener("click", ()=>{
    periodModal.show();
  });

  modalEl.addEventListener("shown.bs.modal", ()=>{
    periodTrigger.setAttribute("aria-expanded","true");
  });
  modalEl.addEventListener("hidden.bs.modal", ()=>{
    periodTrigger.setAttribute("aria-expanded","false");
    document.querySelectorAll(".modal-backdrop").forEach(b=>b.remove());
    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("paddingRight");
    periodTrigger.focus();
  });

  // CHANGE period
  periodOptions.forEach(opt=>{
    opt.addEventListener("click", ()=>{
      periodOptions.forEach(o=>o.classList.remove("active"));
      opt.classList.add("active");

      const label = (opt.firstChild?.nodeType === Node.TEXT_NODE)
        ? opt.firstChild.nodeValue.trim()
        : opt.textContent.trim();
      selectedPeriod.textContent = label;

      loadPeriod(opt.dataset.value);

      periodModal.hide();

      toast(`Periode diubah ke: ${label}`, "success");
    });
  });
})();
