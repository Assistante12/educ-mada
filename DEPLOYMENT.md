# Torolalana Feno amin'ny Famoahana (Guide de Déploiement : Vercel & Render)

Ity rafitra ity dia efa namboarina sy nalamina manokana mba ho azo alefa mivantana (**100% prêt au déploiement**) any amin'ny **Vercel** na any amin'i **Render**.

---

## 🔑 ZAVA-DEHIBE HO AN'I VERCEL (https://educ-mada.vercel.app/) : Fampandehanana ny Firebase Auth

Rehefa voa-déployer ao amin'ny Vercel ny tranonkala (`https://educ-mada.vercel.app/`), dia misy **dingana 2 tsotra sy haingana** (latsaky ny 1 minitra) tsy maintsy atao ao amin'ny **Firebase Console** mba hahamatihanina sy hahafahana mampiasa ny fidirana amin'ny **Google** sy ny **Email** :

### 1. Fampidirana ny Domaine Vercel ao amin'ny Authorized Domains (Ho an'ny Google Sign-In)
Manakana ny fidirana amin'ny Google OAuth ny navigateur raha tsy tafiditra ao amin'ny lisitry ny Authorized Domains ny domain anao :
1. Sokafy mivantana ny Firebase Console :
   👉 **[https://console.firebase.google.com/project/effortless-rainfall-gf38q/authentication/settings](https://console.firebase.google.com/project/effortless-rainfall-gf38q/authentication/settings)**
2. Tsindrio ny tab **"Settings"** (eo ambony ankavanana) ➔ **"Authorized domains"**.
3. Tsindrio ny bokotra manga **"Add domain"**.
4. Ampidiro ao ny :
   ```
   educ-mada.vercel.app
   ```
5. Tsindrio ny **"Save"**.
> **Vokatr'izany :** Mandeha 100% avy hatrany ny fidirana amin'ny Google (« Midira amin'ny Google ») eo no ho eo tsy misy fahadisoana intsony !

---

### 2. Famelomana ny Email/Password ao amin'ny Sign-in Providers (Ho an'ny Fisoratana anarana amin'ny Email)
Ao amin'ny Firebase vaovao dia tsy maintsy velomina (activer) ny safidy Email/Password :
1. Sokafy mivantana ny Sign-in providers ao amin'ny Firebase Console :
   👉 **[https://console.firebase.google.com/project/effortless-rainfall-gf38q/authentication/providers](https://console.firebase.google.com/project/effortless-rainfall-gf38q/authentication/providers)**
2. Ao amin'ny **"Sign-in method"**, kitiho ny **"Email/Password"**.
3. Velomy (kitiho ho mavitrika / **Enable**) ny safidy voalohany : **"Email/Password"**.
4. Tsindrio ny **"Save"**.
> **Vokatr'izany :** Afaka mamorona kaonty amin'ny alalan'ny adiresy mailaka sy tenimiafina avy hatrany ny mpianatra rehetra !

---

### 3. Fitaovana Vonjy Maika : « Mode Local / Hors-ligne » (Efa nampidirina ao anaty App)
Raha mbola tsy vita ireo fanovana ao amin'ny Firebase Console ireo, na ho an'ireo mpianatra manana fahasahiranana amin'ny Internet :
- Efa nampidirina ao amin'ny fampiharana ny **« Mode Local »**.
- Afaka tsindrina avy hatrany ny **"Mode Local"** na **"Tohizo amin'ny Mode Local"** ao amin'ny Modal fidirana.
- Tsy mila tenimiafina ary tsy misy erreur mihitsy : voatahiry ao amin'ny navigateur avy hatrany ny naoty sy ny fivoaran'ny mpianatra, ary afaka ampifandraisina amin'ny Google na Firebase any aoriana.

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
   - Rehefa afaka 1 hatramin'ny 2 minitra dia hisy rohy ofisialy (ohatra: `https://educ-mada.vercel.app`) azon'ny rehetra idirana.

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
- Efa napetraka sy navoaka ao amin'ny Firebase Firestore ihany koa ny **Security Rules** (`firestore.rules`) hahafahan'ny mpianatra mamaky lesona sy mitahiry ny naotiny soa aman-tsara.
