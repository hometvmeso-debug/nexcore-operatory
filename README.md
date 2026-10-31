# NEXCORE OPERATOR — Android + Firefox (fresh project)

Version 1.0.0 — clean starter project. No Cloudworker, Cloudflare, or hosted automation backend.

## What this project contains

- `docs/`: static dashboard intended for GitHub Pages.
- `extension/`: Firefox WebExtension source (Manifest V3) for Android-compatible browser actions.
- Google API integration scaffold with OAuth configuration placeholders.
- Local-first design: browser actions run in the user's Firefox session. The GitHub Pages site only serves static files.

## Important deployment distinction

GitHub Pages hosts the **website**. It does not install or run a Firefox extension.
For Firefox Android distribution, package and submit the extension to Mozilla Add-ons (AMO), or use Mozilla's supported development/testing workflow. Firefox Android generally installs extensions from AMO; a GitHub ZIP is source code, not an installable signed add-on.

## 1. Publish the website on GitHub Pages

1. Create a new GitHub repository named `nexcore-operator`.
2. Upload the contents of this project, keeping the `docs/` folder.
3. In repository Settings → Pages, select **Deploy from a branch**.
4. Select `main` and `/site`, then Save.
5. Your site will appear at `https://YOUR-USERNAME.github.io/nexcore-operator/`.

The dashboard works without Google credentials. Google features remain disabled until OAuth is configured.

## 2. Configure Google APIs

1. Open Google Cloud Console and create a project.
2. Enable only the APIs you need (Gmail API, Drive API, Calendar API, Sheets API, Docs API).
3. Configure the OAuth consent screen.
4. Create an OAuth 2.0 **Web application** client.
5. Add your GitHub Pages origin to Authorized JavaScript origins, e.g.
   `https://YOUR-USERNAME.github.io`
6. Copy the client ID into `docs/config.js`.
7. Review Google's current verification, test-user, and sensitive-scope requirements before requesting broad access.

This starter uses Google Identity Services token flow from the hosted website. Access tokens stay in page memory and are not written to local storage. Do not put a client secret in frontend code.

## 3. Firefox Android extension

The extension source is in `extension/`. It currently provides safe, user-initiated tab inspection and navigation. It does not silently click, submit forms, read passwords, or bypass site protections.

To distribute it to Firefox Android users, follow Mozilla's current AMO submission/signing process. For initial development, use Mozilla's documented temporary/debug installation workflow where supported. Do not expect the GitHub Pages site to install the add-on automatically.

## 4. Safety model

- Navigation is initiated by the user.
- Page text is read only after an explicit action from the extension.
- Form filling is not implemented in this starter.
- Sending messages, publishing, deleting, purchases, and form submission must require a clear confirmation step in future versions.
- Google access is limited to scopes explicitly configured and consented to by the user.

## Project structure

```text
NEXCORE-OPERATOR/
├── README.md
├── docs/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── config.js
└── extension/
    ├── manifest.json
    ├── background.js
    ├── popup.html
    ├── popup.css
    ├── popup.js
    └── icons/
```

## Roadmap

1. Publish the static dashboard.
2. Configure Google OAuth and one API at a time.
3. Package/sign the Firefox extension through AMO.
4. Add explicit-confirmation form filling and approved browser actions.
