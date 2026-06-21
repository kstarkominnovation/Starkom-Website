# K'STARKOM INNOVATIONS — Website Setup Guide

## 📁 Project Structure

```
kstarkom/
├── index.html
├── style.css
├── script.js
├── firebase.js
├── assets/
│   ├── logo.png               ← Your company logo
│   ├── team/
│   │   ├── kishore.jpg        ← Team member photos
│   │   └── ...
│   └── projects/
│       ├── accitrack.jpg
│       ├── devboard.jpg
│       ├── devboard_proof.jpg
│       ├── agribot1.jpg
│       ├── agribot2.jpg
│       ├── acoustic.jpg
│       ├── acoustic_proof.jpg
│       ├── lift.jpg
│       ├── smarthome1.jpg
│       ├── smarthome2.jpg
│       └── attendance.jpg
```

---

## ⚙️ Step 1 — VS Code Setup

1. Install **VS Code**: https://code.visualstudio.com
2. Install the **Live Server** extension:
   - Open Extensions tab (Ctrl+Shift+X)
   - Search "Live Server" by Ritwick Dey → Install
3. Open the `kstarkom/` folder in VS Code: `File → Open Folder`
4. Right-click `index.html` → **"Open with Live Server"**
5. Your site opens at `http://127.0.0.1:5500`

> **Important:** You MUST use Live Server (not file://) because the site uses
> ES6 modules (`type="module"` in the script tag). Opening index.html directly
> in a browser will fail with a CORS error.

---

## 🔥 Step 2 — Firebase Setup

### 2a. Add your images to Firebase Storage

1. Go to https://console.firebase.google.com
2. Select your project `k-starkom-website`
3. In the left menu → **Storage** → Get Started
4. Upload your images and copy their **download URLs**

### 2b. Add Projects to Firestore

1. In Firebase Console → **Firestore Database** → Create database
2. Start in **test mode** (you can add security rules later)
3. Click **"Start collection"** → Name it: `projects`
4. Add a document for each project. Fields:

| Field         | Type    | Example                          |
|---------------|---------|----------------------------------|
| title         | string  | AcciTrack                        |
| domain        | string  | IoT / Safety                     |
| description   | string  | A real-time accident detection…  |
| technologies  | array   | ["ESP32", "GPS", "GSM"]          |
| mainImage     | string  | https://firebasestorage… (URL)   |
| presented     | string  | St Joseph Engineering College    |
| proofImage    | string  | https://firebasestorage… (URL)   |
| extraImages   | array   | ["https://…img1", "https://…img2"] |

> **Leave `presented` and `proofImage` blank/absent** for projects that don't have them.
> The website automatically hides those sections if the fields are missing.

### 2c. Add Team to Firestore

Click **"Start collection"** → Name it: `team`

| Field    | Type   | Example                        |
|----------|--------|--------------------------------|
| name     | string | Kishore K                      |
| role     | string | Founder & Embedded Lead        |
| image    | string | https://firebasestorage… (URL) |
| linkedin | string | https://linkedin.com/in/…      |

---

## 🖼️ Step 3 — Add Your Logo

Place your logo file at:
```
assets/logo.png
```
Recommended size: **512×512px** PNG with transparent background.

---

## 🌐 Step 4 — Deploy (Optional)

### Option A: Firebase Hosting (Recommended)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Option B: Netlify
- Drag and drop your `kstarkom/` folder at https://netlify.com/drop

---

## ✏️ Updating Content After Deployment

**To add a new project:** Go to Firebase Console → Firestore → `projects` collection → Add document.
**The website updates automatically — no code changes needed.**

**To add a team member:** Go to Firebase Console → Firestore → `team` collection → Add document.

---

## 🐛 Common Issues

| Problem | Fix |
|---------|-----|
| Blank page / CORS error | Use Live Server, not file:// |
| Images not showing | Check image URLs in Firebase Storage |
| Firebase error in console | Check your config in firebase.js |
| Projects not loading | The site falls back to demo data — check Firestore collection name is exactly `projects` |

---

## 📧 Contact Form

The contact form currently simulates sending (with a 1.4s delay). To make it
actually send emails, integrate one of these:

- **EmailJS** (free, no backend): https://emailjs.com
- **Formspree** (free tier): https://formspree.io
- **Firebase Functions** (custom backend)

---

## 🔒 Firestore Security Rules (for production)

In Firebase Console → Firestore → Rules, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /team/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
