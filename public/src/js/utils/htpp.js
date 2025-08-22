const BASE_URL = ""; 

export async function get(path, { params = {}, headers = {}, cache="no-store" } = {}) {
  const url = new URL(path, BASE_URL || window.location.origin);
  Object.entries(params).forEach(([k,v]) => url.searchParams.set(k, v));
  const res = await fetch(url, { headers, cache });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res.json();
}
