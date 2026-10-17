# ⚡ ShortsBuddy Creator Hub

A fast, modern, and 100% free content planner and viral script studio built for **YouTube Shorts** and **Instagram Reels** creators.

---

## 🌟 Key Features

- **Dashboard Metrics**: Real-time counter tracking your shorts production pipeline across **Ideas Backlog**, **Scripts Ready**, **In Editing**, and **Published**.
- **Interactive Content Planner**: Dual-mode pipeline with interactive **Kanban Board** and **List View**. Move video cards between stages with a single click.
- **Clickable Script Ready Hub**: Click the "Scripts Ready" summary card to immediately view all ready-to-shoot videos with complete script breakdowns (Hook, Scenes, Voiceover, Ending) and action buttons (**Move to In Editing**, **Copy Script**, **Edit**).
- **Retention-Engineered Script Studio**:
  - **⚡ Hook (0-3s)**: Stop the scroll before viewers swipe away.
  - **🎬 Scene-by-Scene Visual Plan**: Notes for camera angles, b-roll, and text overlays.
  - **🎙️ Voiceover / Narration**: Live speech duration calculator (words per second estimator tuned for Shorts).
  - **🔄 Ending & CTA**: Loop back to the hook to drive watch-time algorithms.
- **Viral Helper & Niche Vault**: Built-in high-retention hooks, title formulas, and hashtag packs for:
  - 💀 **Horror & Mystery**
  - 😂 **Comedy & Relatable**
  - 🐾 **Animals & Pets**
  - 🧠 **Facts & Mind-Benders**
  - 📖 **Storytelling & History**
- **100% Free & Offline Persistence**: Automatically saves everything directly in your browser's `localStorage`. Content stays safe across page reloads and browser restarts.
- **Data Backup & Restore**: Download all your video plans as a `.json` backup file or restore previously saved plans anytime.
- **Teleprompter Copy Helper**: 1-click script export ready for teleprompter apps or mobile copy-paste.

---

## 🚀 How to Run Locally

### Method 1: One-Click Windows Launcher (Easiest)
1. Double-click the **`preview.bat`** file in this folder.
2. It will automatically start a local server and open `http://localhost:8000` in your default browser.

### Method 2: Manual Terminal
Run this in PowerShell or Command Prompt inside this folder:
```bash
python -m http.server 8000
```
Then visit: **http://localhost:8000**

---

## 🌐 Free Public Deployment Guide

Because ShortsBuddy Creator Hub is built with pure, modern static web technologies (HTML5, CSS3, ES6 JavaScript) and uses relative asset paths (`css/...`, `js/...`), it can be hosted **100% free with zero monthly costs, zero paid APIs, and automatic free SSL (HTTPS)**.

Here are the top 3 recommended free hosting options:

---

### Option 1: Netlify Drop (Easiest — No Git or Coding Required)
*Recommended if you want your website live in 30 seconds without installing Git.*

1. Go to **[https://app.netlify.com/drop](https://app.netlify.com/drop)** in your web browser.
2. Sign up or log in for a free Netlify account (no credit card needed).
3. Drag and drop the **`shortbuddy`** folder from your desktop into the upload box on Netlify.
4. Netlify will publish your site in seconds and give you a free public link like `https://shortsbuddy-hub.netlify.app`.
5. *(Optional)* Go to **Site settings > Change site name** to choose a custom name.

---

### Option 2: GitHub Pages (Developer Standard — 100% Free Forever)
*Recommended for permanent version control and free custom domains.*

1. Create a free account at **[GitHub.com](https://github.com)** if you don't have one.
2. Create a new repository named `shortsbuddy` (set it to **Public**).
3. Open your terminal in this project folder and run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of ShortsBuddy Creator Hub"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/shortsbuddy.git
   git push -u origin main
   ```
4. On GitHub, go to your repository:
   - Click **Settings** ➔ **Pages** (in the left sidebar).
   - Under **Build and deployment > Source**, select **Deploy from a branch**.
   - Select the **`main`** branch and the **`/ (root)`** folder, then click **Save**.
5. Within 1 to 2 minutes, your website will be live at:
   `https://YOUR_USERNAME.github.io/shortsbuddy/`

*(Note: The included `.nojekyll` file ensures that GitHub Pages serves all assets directly without Jekyll processing).*

---

### Option 3: Vercel (Fastest Global Edge Delivery)
*Recommended for blazing-fast loading speeds on mobile.*

1. Go to **[https://vercel.com](https://vercel.com)** and sign up for a free Hobby account.
2. Click **Add New Project** ➔ import your GitHub repository.
3. Leave all build settings at default (Framework: **Other**, Root Directory: `./`).
4. Click **Deploy**.
5. Vercel will deploy your site to a global CDN with a URL like `https://shortsbuddy.vercel.app`.

---

## 💾 How Data Saving Works on the Live Website

- **100% Private & Client-Side:** ShortsBuddy stores all data in the user's browser using `window.localStorage`.
- **No Cloud Database Required:** You do not need to pay for Firebase, Supabase, or AWS databases.
- **Backup & Export:** Users can export their plans as a `.json` file at any time by clicking the **💾** icon in the header.

---

## 📁 Project Structure

```text
shortbuddy/
├── index.html          # Main HTML5 application, dashboard, modals & SEO meta tags
├── css/
│   └── style.css       # Dark-mode styling, glassmorphism, responsive grid & animations
├── js/
│   ├── templates.js    # Viral hooks, title formulas & hashtags for all 5 niches
│   ├── storage.js      # LocalStorage manager, starter samples & JSON backup/restore
│   └── app.js          # Interactive UI controller, script calculators & Kanban management
├── preview.bat         # 1-click Windows local server launcher
├── .nojekyll           # Ensures GitHub Pages serves static files directly
├── .gitignore          # Prevents tracking temporary OS files
└── README.md           # Documentation and free deployment instructions
```
