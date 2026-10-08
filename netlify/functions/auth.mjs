// Parooliga sisselogimine adminile (/admin/) ilma GitHubi kontota.
//
// Sveltia CMS avab sisselogimisel hüpikakna aadressil /auth. See funktsioon
// näitab seal paroolivormi. Õige parooli korral annab ta Sveltiale GitHubi
// võtme (sama "authorizing / authorization" sõnumivahetus, mida kasutab
// tavaline GitHubi OAuth), ja Sveltia salvestab muudatused otse GitHubi repos.
//
// Netlify saidi seadetes (Site configuration → Environment variables) peavad olema:
//   ADMIN_PASSWORD   parool, millega toimetajad sisse logivad
//   GITHUB_TOKEN     fine-grained GitHubi võti, millel on ainult selle repo
//                    (jyrishestakov-design/kakerdaja-site) Contents: Read and write
// Parooli vahetamiseks muuda ADMIN_PASSWORD ja tee "Trigger deploy".

import { createHash, timingSafeEqual } from "node:crypto";

const sha = (s) => createHash("sha256").update(String(s)).digest();

const page = (body, status = 200) =>
  new Response(
    `<!doctype html><html lang="et"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Kakerdaja – sisselogimine</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#F6F1E6;color:#151412;font:17px/1.5 system-ui,sans-serif}
  main{width:min(92vw,340px);text-align:center}
  img{width:96px;margin:0 auto 8px;display:block}
  h1{font-size:1.3rem;margin:0 0 18px}
  input{width:100%;box-sizing:border-box;font:inherit;padding:12px 14px;border:1.5px solid #151412;border-radius:10px;background:#fff}
  button{margin-top:12px;width:100%;font:inherit;font-weight:700;padding:12px;border:0;border-radius:999px;background:#151412;color:#F6F1E6;cursor:pointer}
  .err{color:#B3172C;margin:0 0 12px}
  .stripe{position:fixed;left:0;right:0;top:0;height:7px;background:linear-gradient(90deg,#D7263D 0 14.3%,#F46036 0 28.6%,#F6C324 0 42.9%,#2E933C 0 57.1%,#1B6FC2 0 71.4%,#3A3D9C 0 85.7%,#7B2D8E 0)}
</style></head><body><div class="stripe"></div><main>${body}</main></body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-frame-options": "DENY" } }
  );

const form = (error = "") => `
  <img src="/images/logo/Kakerdaja_lind_must.svg" alt="">
  <h1>Kakerdaja admin</h1>
  ${error ? `<p class="err">${error}</p>` : ""}
  <form method="post">
    <input type="password" name="parool" placeholder="Parool" autocomplete="current-password" autofocus required>
    <button type="submit">Logi sisse</button>
  </form>`;

export default async (req) => {
  const expected = Netlify.env.get("ADMIN_PASSWORD");
  const token = Netlify.env.get("GITHUB_TOKEN");
  if (!expected || !token) {
    return page(`<h1>Admin pole veel seadistatud</h1><p>Netlify keskkonnamuutujad ADMIN_PASSWORD ja GITHUB_TOKEN on puudu.</p>`, 500);
  }

  if (req.method !== "POST") return page(form());

  const data = await req.formData().catch(() => null);
  const given = data?.get("parool") ?? "";
  if (!timingSafeEqual(sha(given), sha(expected))) {
    await new Promise((r) => setTimeout(r, 1500)); // aeglustab arvamist
    return page(form("Vale parool. Proovi uuesti."), 401);
  }

  // Sama protokoll, mida Sveltia/Decap ootavad OAuth-hüpikaknalt.
  const msg = JSON.stringify(
    "authorization:github:success:" + JSON.stringify({ token, provider: "github" })
  ).replace(/</g, "\\u003c");
  return page(`
  <p>Sisselogimine õnnestus…</p>
  <script>
    (function () {
      var origin = location.origin, done = false;
      window.addEventListener("message", function (e) {
        if (done || e.origin !== origin || e.data !== "authorizing:github") return;
        done = true;
        window.opener.postMessage(${msg}, origin);
      });
      if (window.opener) window.opener.postMessage("authorizing:github", origin);
      else document.querySelector("p").textContent = "Ava admin aadressil /admin/ ja logi sealt sisse.";
    })();
  </script>`);
};

export const config = { path: "/auth" };
