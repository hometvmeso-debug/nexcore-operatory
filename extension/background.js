// NEXCORE background worker: minimal by design.
// Future browser actions should be user-initiated and permission-scoped.
browser.runtime.onInstalled.addListener(() => {
  console.info("NEXCORE OPERATOR installed.");
});

browser.runtime.onMessage.addListener(async (message) => {
  if (message?.type === "NEXCORE_GET_ACTIVE_TAB") {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    return tabs[0] || null;
  }
  if (message?.type === "NEXCORE_OPEN_URL" && typeof message.url === "string") {
    let parsed;
    try { parsed = new URL(message.url); } catch { throw new Error("Adresse invalide."); }
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Seules les adresses HTTP et HTTPS sont autorisées.");
    }
    return browser.tabs.create({ url: parsed.href });
  }
});
