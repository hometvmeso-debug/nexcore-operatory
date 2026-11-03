browser.runtime.onInstalled.addListener(() => {
  console.log("NEXCORE OPERATOR est prêt.");
});

browser.runtime.onMessage.addListener(async (message) => {
  if (message?.type === "NEXCORE_GET_ACTIVE_TAB") {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true
    });
    return tabs[0] || null;
  }

  if (message?.type === "NEXCORE_OPEN_URL") {
    let url;

    try {
      url = new URL(message.url);
    } catch {
      throw new Error("Adresse invalide.");
    }

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Adresse non autorisée.");
    }

    return browser.tabs.create({ url: url.href });
  }

  if (message?.type === "NEXCORE_READ_PAGE") {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true
    });

    const tab = tabs[0];

    if (!tab?.id || !tab.url?.startsWith("http")) {
      throw new Error("Aucune page web accessible.");
    }

    const results = await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => ({
        title: document.title,
        url: location.href,
        text: (document.body?.innerText || "").slice(0, 12000)
      })
    });

    return results?.[0]?.result || null;
  }
});
