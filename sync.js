// 가족 기기끼리 기록을 맞추는 부분 (Firebase Firestore)
const C = window.APP_CONFIG || {};
const V = "10.12.2";
async function start() {
  if (!C.firebase || !C.firebase.apiKey) { window.onCloudStatus && window.onCloudStatus(false); return; }
  const { initializeApp } = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`);
  const { getAuth, signInAnonymously } = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`);
  const { getFirestore, doc, onSnapshot, setDoc } = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`);
  const app = initializeApp(C.firebase);
  await signInAnonymously(getAuth(app));
  let fid = null; try { fid = JSON.parse(localStorage.getItem("praiseFamily") || "null"); } catch (e) {}
  if (!fid) fid = await window.askFamily();
  const ref = doc(getFirestore(app), "families", fid);
  window.cloud = { push: (S) => setDoc(ref, { json: JSON.stringify(S), savedAt: S.savedAt || Date.now() }) };
  onSnapshot(ref, (snap) => {
    window.onCloudStatus(true);
    if (snap.exists()) window.onCloud(snap.data());
    else { try { const L = JSON.parse(localStorage.getItem("praiseBankA") || "null"); if (L) window.cloud.push(L); } catch (e) {} }
  }, () => window.onCloudStatus(false));
}
start().catch(() => window.onCloudStatus && window.onCloudStatus(false));
