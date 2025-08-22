import { get } from "../utils/htpp.js";

export function fetchLeaderboard() {

  return get("/public/src/data/leaderboard.json", { cache: "no-store" });
}
