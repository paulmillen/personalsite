import { writable } from 'svelte/store';

export const verbTable = writable({});
export const availableVerbs = writable([])
export const availableTenses = writable([])

export const fetchAndStoreVerbData = async (requestedVerbs = ['*']) => {
  const res = await window.fetch("/api/verbtable", {
    method: 'post',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(requestedVerbs)
  });

  if (res.status === 200) {
    const parsedRes = await res.json();
    verbTable.set(parsedRes.data.verbs);
    availableVerbs.set(Object.keys(parsedRes.data.verbs));
    availableTenses.set(parsedRes.data.availableTenses)
    return parsedRes
  } else {
    throw Error(`${res.status}: cannot fetch verb table`)
  }
}