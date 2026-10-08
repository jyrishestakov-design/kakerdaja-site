# Kakerdaja koduleht

Segarahvatantsurühma Kakerdaja veebileht — Hugo + Sveltia CMS (sama ülesehitus nagu Sandra Jõgeva lehel).

## Sisu muutmine

- **Veebis:** ava `https://kakerdaja.netlify.app/admin/`, vajuta „Sign In with GitHub“ ja sisesta avanevas aknas **Kakerdaja admini parool**. GitHubi kontot pole vaja. Salvestus läheb otse GitHubi ja Netlify avaldab uue versiooni ~1 minutiga.
- **Arvutis:** topeltklõps `Ava admin.command` → vali sisselogimisel „Work with Local Repository“ ja see kaust. Kui valmis, topeltklõps `Salvesta muudatused.command`.

Admini jaotised: **Uudised**, **Esinemised**, **Lehed** (Meist, Galerii, Tule tantsima, Kontakt), **Avaleht**, **Saidi seaded ja kontaktid**, **Menüü**, **Kujundus**.

## Admini parooli seadistus (Netlify)

Netlify → saidi Site configuration → Environment variables:

- `ADMIN_PASSWORD` — admini parool (vahetamiseks muuda ja tee „Trigger deploy“)
- `GITHUB_TOKEN` — GitHubi fine-grained token: Repository access → ainult `jyrishestakov-design/kakerdaja-site`, Permissions → Contents: Read and write

Sisselogimise loogika: `netlify/functions/auth.mjs`.

## Täita (puuduvad andmed)

Adminis „Saidi seaded ja kontaktid“: juhendaja, e-post, telefon, proovide aeg ja koht, Facebooki link.
Adminis „Esinemised“: 2012. aastast hilisemad ja tulevased esinemised.

## Sisu päritolu

- Vanad postitused ja esinemised 2008–2012: albukakerdaja.blogspot.com
- Üldinfo: yksmyts.weebly.com (MTÜ Kultuuri- ja Haridusselts Üksmüts)
- Rahvarõivaste toetus: Järva Teataja, 8.01.2026
- Logo vektor: Jüri-Illimar Reinberg-Šestakov, okt 2026 (originaaljoonistusest)

## Arendus

```bash
hugo server
```
