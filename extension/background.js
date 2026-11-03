
// NEXCORE OPERATOR - Background
// Navigation et lecture locale des pages.

browser.runtime.onInstalled.addListener(() => {
  console.info("NEXCORE OPERATOR installé.");
});

browser.runtime.onMessage.addListener(async (message) => {

  // Récupérer l'onglet actif
  if (message?.type === "NEXCORE_GET_ACTIVE_TAB") {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true
    });
    return tabs[0] || null;
  }

  // Ouvrir une adresse web
  if (message?.type === "NEXCORE_OPEN_URL") {
    let parsed;

    try {
      parsed = new URL(message.url);
    } catch {
      throw new Error("Adresse invalide.");
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Seules les adresses HTTP et HTTPS sont autorisées.");
    }

    return browser.tabs.create({ url: parsed.href });
  }

  // Lire le contenu de la page active
  if (message?.type === "NEXCORE_READ_PAGE") {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true
    });

    const tab = tabs[0];

    if (!tab?.id || !tab.url) {
      throw new Error("Aucun onglet actif trouvé.");
    }

    if (!/^https?:\/\//i.test(tab.url)) {
      throw new Error("Cette page ne peut pas être lue.");
    }

    const results = await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => ({
        title: document.title,
        url: location.href,
        text: (document.body?.innerText || "").slice(0, 12000)
      })
    });

    return results?.[0]?.result || {
      title: "",
      url: tab.url,
      text: ""
    };
  }
});
