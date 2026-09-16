# Torolalana Feno amin'ny Famoahana (Guide de Déploiement : Vercel & Render)

Ity rafitra ity dia efa namboarina sy nalamina manokana mba ho azo alefa mivantana (**100% prêt au déploiement**) any amin'ny **Vercel** na any amin'i **Render**.

---

## 🚀 Safidy 1 : Famoahana any amin'i VERCEL (Recommandé ho an'ny Serverless)

Vercel dia mandray mivantana ny Frontend Vite sy ny API Serverless amin'ny alalan'ny rakitra `vercel.json` sy `api/index.ts` efa voaomana.

### Dingana arahina (Étapes sur Vercel) :

1. **Apetraho amin'ny GitHub ny kaody (Push sur GitHub) :**
   ```bash
   git add .
   git commit -m "Fanomanana ho an'ny Vercel sy Render"
   git push origin main
   ```

2. **Midira ao amin'ny Vercel :**
   - Mandehana ao amin'ny [vercel.com](https://vercel.com) ary midira (Sign in).
   - Tsindrio ny **"Add New..."** ➔ **"Project"**.
   - Safidio ny repository GitHub misy ity tetikasa ity ary tsindrio ny **"Import"**.

3. **Fikirakirana (Project Configuration) :**
   - **Framework Preset :** Vite *(ho hitan'ny Vercel ho azy)*.
   - **Root Directory :** `./` *(avelao amin'izao)*.
   - **Build Command :** `npm run build` *(na avelao ny default)*.
   - **Output Directory :** `dist` *(efa voafaritra ao anaty `vercel.json`)*.

4. **Environment Variables (Zava-dehibe) :**
   Ao amin'ny fizarana **"Environment Variables"**, ampidiro :
   - `GEMINI_API_KEY` : Ny fanalahidy Gemini API anao (avy amin'ny Google AI Studio).

5. **Deploy :**
   - Tsindrio ny bokotra **"Deploy"**.
   - Rehefa afaka 1 hatramin'ny 2 minitra dia hisy rohy ofisialy (ohatra: `https://plateforme-scolaire-madagascar.vercel.app`) azon'ny rehetra idirana.

---

## 🚢 Safidy 2 : Famoahana any amin'i RENDER (Full-Stack Node.js Service)

Render dia mampandeha mivantana ny server Express Node.js miaraka amin'ny Frontend amin'ny seranana voafaritra. Efa voaomana ao amin'ny tetikasa ny rakitra `render.yaml`.

### Fomba 1 : Amin'ny alalan'ny Blueprint (1-Click Deploy)
1. Midira ao amin'ny [dashboard.render.com](https://dashboard.render.com).
2. Tsindrio ny **"New +"** ➔ **"Blueprint"**.
3. Ampifandraiso amin'ny GitHub misy ny tetikasanao.
4. Hitan'i Render avy hatrany ny `render.yaml` :
   - Ampidiro fotsiny ny `GEMINI_API_KEY`.
   - Tsindrio ny **"Apply"**.

### Fomba 2 : Amin'ny alalan'ny Web Service tsotra (Manuel)
1. Ao amin'ny Render Dashboard, tsindrio ny **"New +"** ➔ **"Web Service"**.
2. Ampifandraiso ny repository GitHub.
3. Fenoy ireto masontsivana ireto :
   - **Name :** `plateforme-scolaire-madagascar` (na anarana tianao)
   - **Runtime :** `Node`
   - **Build Command :** `npm run build`
   - **Start Command :** `npm start`
   - **Plan Type :** `Free`
4. Ao amin'ny **"Environment Variables"**, ampio :
   - `NODE_ENV` = `production`
   - `PORT` = `3000` (na avelao i Render hametraka azy)
   - `GEMINI_API_KEY` = *Ny Gemini API Key anao*
5. Tsindrio ny **"Create Web Service"**.

---

## 🔒 Fanamarihana momba ny Firebase (Auth & Firestore Database)

- Ny rakitra `firebase-applet-config.json` dia efa tafiditra ao anatin'ny tetikasa ary efa mifandray mivantana amin'ny Firebase Firestore sy Authentication.
- Noho izany, na any amin'i Vercel na any amin'i Render dia mandeha avy hatrany ny fisoratana anarana, ny fidirana (login), ary ny fitehirizana ny naotin'ny mpianatra.
- Raha te hampiasa projet Firebase vaovao ianao any aoriana, soloy fotsiny ny sandan'ny `firebase-applet-config.json` na ampiasao ny `import.meta.env`.

---

## 🧪 Fanamarinana aorian'ny fandefasana (Vérification)

Rehefa tafapetraka ny tranonkala :
1. Sokafy ny rohy nomena (URL).
2. Mandehana amin'ny `/api/health` mba hanamarinana fa miasa tsara ny Backend (`{"status":"ok",...}`).
3. Andramo ny mamorona fanontaniana sy manao fanadinana.
4. Andramo ny misoratra anarana sy miditra mba hanamarinana ny Firebase.
