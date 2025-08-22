import { getLeaderboard } from "./services/leaderboardService.js";
import { renderLeaderboard, initSheetResize } from "./components/leaderboardView.js";

function toast(msg,type){
  const el=document.getElementById("snackbar"); if(!el) return;
  el.textContent=msg; el.className="snackbar"+(type?` ${type}`:"");
  el.classList.add("show");
  setTimeout(()=>el.classList.remove("show"),2200);
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const data = await getLeaderboard();
    renderLeaderboard(data);
  } catch (e) {
    console.error(e);
    toast("Gagal memuat data.","warn");
  }
  initSheetResize();

  // atur CSS var untuk gap seperti versi sebelumnya
  const board = document.querySelector(".board-wrapper-full");
  if (board) {
    const padTop = parseFloat(getComputedStyle(board).paddingTop) || 10;
    document.documentElement.style.setProperty("--podium-board-gap", padTop + "px");
  }
});
