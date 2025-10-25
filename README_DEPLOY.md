# 🎮 Indian Rummy - Deployment Ready!

This project is **configured for instant deployment** with automatic builds!

## ⚡ Quick Deploy (5 minutes)

### Why Two Platforms?

This app uses **WebSocket** for real-time gameplay. Vercel's serverless functions don't support persistent WebSocket connections, so we use:

- **Vercel** → Frontend (React app) ✅
- **Railway** → Backend (Node.js + Socket.io) ✅

Both **auto-deploy** from the same GitHub repo!

---

## 🚀 Deploy Instructions

### 1️⃣ Push to GitHub (if not already there)

```bash
git remote add origin https://github.com/YOUR_USERNAME/rummy.git
git branch -M main
git push -u origin main
```

### 2️⃣ Deploy Frontend to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. **Vercel auto-configures everything!** ✨
4. Add environment variable:
   - `REACT_APP_API_URL` = (leave empty, add after step 3)
5. Deploy!

### 3️⃣ Deploy Backend to Railway

1. Go to https://railway.app/new
2. Deploy from GitHub repo
3. Add environment variables:
   - `NODE_ENV` = `production`
   - `CLIENT_URL` = (your Vercel URL from step 2)
4. Generate domain

### 4️⃣ Connect Them

1. Update `REACT_APP_API_URL` in Vercel with your Railway URL
2. Redeploy Vercel

**Done!** 🎉

---

## 📁 Project Structure

```
rummy/
├── server/              # Backend (Railway)
│   ├── index.js        # Express + Socket.io server
│   └── gameLogic.js    # Game rules & rigged shuffling
├── client/             # Frontend (Vercel)
│   ├── src/
│   │   ├── App.js      # Main app
│   │   └── components/
│   ├── public/
│   └── package.json
├── vercel.json         # ✅ Vercel auto-config
├── railway.json        # ✅ Railway auto-config
└── package.json        # Backend dependencies
```

---

## 📚 Documentation

- **ONE_CLICK_DEPLOY.md** - Complete step-by-step guide
- **DEPLOY_QUICK.md** - Super quick reference
- **DEPLOYMENT.md** - Detailed guide with troubleshooting
- **SETUP.md** - Local development setup

---

## 🔧 Configuration Files

All deployment configuration is **already set up**:

✅ `vercel.json` - Frontend build config
✅ `railway.json` - Backend deployment config
✅ `Procfile` - Process configuration
✅ `.env.example` - Environment variable templates

Just import to Vercel/Railway and it works!

---

## 🎯 Features

- ✅ Real-time multiplayer gameplay
- ✅ Room-based system with unique codes
- ✅ Rigged system (room creator always wins)
- ✅ Step-by-step winning guide
- ✅ Responsive UI (web + mobile)
- ✅ Indian Rummy rules (13 cards)
- ✅ Auto-deploy on git push

---

## 💰 Cost

**100% FREE** with:
- Vercel: Free tier (perfect for frontend)
- Railway: $5 credit/month (plenty for this app)

---

## 🆘 Need Help?

See **ONE_CLICK_DEPLOY.md** for:
- Detailed instructions
- Troubleshooting guide
- Environment variable setup

---

## 🎮 How to Play

1. Create a room (get 6-digit code)
2. Share code with opponent
3. Both players join
4. Game starts automatically!
5. Room creator gets winning guidance 🏆

---

## ⚙️ Local Development

```bash
# Install dependencies
npm run install-all

# Run both frontend and backend
npm run dev

# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

---

## 🔄 Auto-Deploy Setup

After initial deployment:

```bash
git add .
git commit -m "Update game"
git push
```

✅ Vercel auto-deploys frontend
✅ Railway auto-deploys backend

---

Ready to deploy? Follow **ONE_CLICK_DEPLOY.md**! 🚀
