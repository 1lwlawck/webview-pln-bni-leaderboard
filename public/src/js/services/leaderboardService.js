import { fetchLeaderboard } from "../api/leaderboardApi.js";

export async function getLeaderboard() {
  const data = await fetchLeaderboard();
  if (!Array.isArray(data) || data.length < 1) throw new Error("Data tidak valid");
  return [...data].sort((a,b)=> b.score - a.score || a.name.localeCompare(b.name));
}
