const GAP=8, RADIUS_FIX=20, MIN_TOP=12, PADDING_SAFE=12, MIN_LIST_SPACE=140;
const initials = (name)=> name.split(/\s+/).slice(0,2).map(s=>s[0]?.toUpperCase()||"").join("");

function placeSheetAndResize(){
  const boardList = document.getElementById("boardList");
  const sheet  = document.getElementById("rankSheet");
  const podium = document.querySelector(".podium");
  const winner = document.querySelector(".winner");
  if (!boardList || !sheet || !podium || !winner) return;

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
  const gapY = parseFloat(cs.gap || cs.rowGap || 0) || 0;
  const handleH = sheet.querySelector('.sheet-handle')?.getBoundingClientRect().height || 0;

  const available = Math.max(MIN_LIST_SPACE, vh - desiredTop - winnerH - PADDING_SAFE);
  const inner = Math.max(100, available - padTop - padBottom - gapY - handleH);

  const board = document.querySelector(".board");
  if (board){
    board.style.maxHeight = `${inner}px`;
    board.style.overflowY = "auto";
  }
}

export function renderLeaderboard(data){
  const sorted = [...data];
  const [p1,p2,p3] = [sorted[0], sorted[1], sorted[2]];
  const rest = sorted.slice(3);

  const podium = document.querySelector(".podium");
  const winner = document.querySelector(".winner");
  const boardList = document.getElementById("boardList");
  const cards = podium.querySelectorAll(".podium-card");

  if (cards.length >= 3 && p1 && p2 && p3){
    const c2 = cards[0]; c2.querySelector(".avatar").textContent = initials(p2.name);
    c2.querySelector(".name").textContent = p2.name; c2.querySelector(".score-chip").textContent = p2.score;

    const c1 = cards[1]; c1.querySelector(".avatar").textContent = initials(p1.name);
    c1.querySelector(".name").textContent = p1.name; c1.querySelector(".score-chip").textContent = p1.score;

    const c3 = cards[2]; c3.querySelector(".avatar").textContent = initials(p3.name);
    c3.querySelector(".name").textContent = p3.name; c3.querySelector(".score-chip").textContent = p3.score;
  }

  winner.querySelector(".avatar-inline").textContent = initials(p1?.name || "-");
  winner.querySelector(".winner-name").textContent = p1?.name || "—";
  winner.querySelector(".winner-score").textContent = p1?.score ?? 0;

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

export function initSheetResize(){
  // throttle sederhana
  let rafId=null;
  const onResize=()=>{ if(rafId) return; rafId=requestAnimationFrame(()=>{ rafId=null; placeSheetAndResize(); }); };
  window.addEventListener("load", ()=>{ requestAnimationFrame(placeSheetAndResize); });
  window.addEventListener("resize", onResize);
}
