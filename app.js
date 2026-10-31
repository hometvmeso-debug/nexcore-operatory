(() => {
  const $ = (id) => document.getElementById(id);
  let tokenClient = null;
  let accessToken = null;

  const configured = () => {
    const id = window.NEXCORE_CONFIG?.googleClientId || "";
    return id && !id.startsWith("REPLACE_");
  };

  function setGoogleStatus(message, connected = false) {
    $("google-status").textContent = message;
    $("connect-google").disabled = connected;
    $("disconnect-google").disabled = !connected;
  }

  $("connect-google").addEventListener("click", () => {
    if (!configured()) {
      setGoogleStatus("Ajoute ton client ID OAuth Google dans site/config.js, puis redéploie.");
      return;
    }
    if (!window.google?.accounts?.oauth2) {
      setGoogleStatus("Le service Google Identity n'est pas encore chargé. Réessaie dans quelques secondes.");
      return;
    }
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: window.NEXCORE_CONFIG.googleClientId,
      scope: "openid email profile",
      callback: (response) => {
        if (response.error) {
          setGoogleStatus("Connexion refusée ou échouée : " + response.error);
          return;
        }
        accessToken = response.access_token;
        setGoogleStatus("Google connecté pour cette session. Aucun jeton n'est enregistré sur disque.", true);
      }
    });
    tokenClient.requestAccessToken({ prompt: "consent" });
  });

  $("disconnect-google").addEventListener("click", () => {
    if (accessToken && window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(accessToken, () => {});
    }
    accessToken = null;
    tokenClient = null;
    setGoogleStatus("Déconnecté.");
  });

  $("prepare-task").addEventListener("click", () => {
    const value = $("task").value.trim();
    if (!value) {
      $("task-result").textContent = "Écris une instruction pour commencer.";
      return;
    }
    const urlMatch = value.match(/https?:\\/\\/\\S+/i);
    $("task-result").textContent = urlMatch
      ? "Adresse détectée : " + urlMatch[0] + " — ouvre l'extension NEXCORE dans Firefox pour lancer la navigation."
      : "Instruction reçue. Cette version ne lance pas encore d'action automatique : les commandes seront ajoutées après validation du moteur local.";
  });

  $("clear-task").addEventListener("click", () => {
    $("task").value = "";
    $("task-result").textContent = "Instruction effacée.";
  });
})();
