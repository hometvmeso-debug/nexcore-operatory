const $ = (id) => document.getElementById(id);

async function refreshTab() {
  try {
    const tab = await browser.runtime.sendMessage({ type: "NEXCORE_GET_ACTIVE_TAB" });
    $("tab-title").textContent = tab?.title || "Titre indisponible";
    $("tab-url").textContent = tab?.url || "Adresse indisponible";
    $("status").textContent = "Informations de l'onglet actualisées.";
  } catch (error) {
    $("status").textContent = "Erreur : " + error.message;
  }
}

$("inspect").addEventListener("click", refreshTab);

$("open").addEventListener("click", async () => {
  const raw = $("url").value.trim();
  if (!raw) {
    $("status").textContent = "Saisis une adresse web.";
    return;
  }
  const normalized = /^https?:\\/\\//i.test(raw) ? raw : "https://" + raw;
  try {
    await browser.runtime.sendMessage({ type: "NEXCORE_OPEN_URL", url: normalized });
    $("status").textContent = "Nouvel onglet ouvert.";
  } catch (error) {
    $("status").textContent = "Impossible d'ouvrir : " + error.message;
  }
});

refreshTab();
