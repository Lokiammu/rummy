# ⚡ ONE-CLICK DEPLOYMENT GUIDE

Deploy your Indian Rummy game in **5 minutes** with automatic configuration!

---

## 🎯 Deployment Strategy

Since Vercel's serverless functions don't support WebSocket (Socket.io), we use:

- **Frontend on Vercel** ← One-click import from GitHub
- **Backend on Railway** ← One-click import from GitHub

Both platforms auto-deploy from the same GitHub repo!

---

## 🚀 STEP 1: Push to GitHub (One Time)

```bash
# If not already on GitHub, create a new repo at github.com
# Then run:

git remote add origin https://github.com/YOUR_USERNAME/rummy.git
git branch -M main
git push -u origin main
```

---

## 🎨 STEP 2: Deploy Frontend (Vercel)

### Import to Vercel

1. Go to **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Select your **rummy** repository
4. Vercel auto-detects the settings!

### ✅ Verify Auto-Configuration

Vercel should automatically set:
- **Framework**: Create React App
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `build`

### 🔧 Add Environment Variable

Before clicking Deploy:

1. Click **"Environment Variables"**
2. Add one variable:

```
Name:  REACT_APP_API_URL
Value: [Leave empty for now - we'll add after Step 3]
```

3. Click **"Deploy"**

### 📝 Save Your Vercel URL

After deployment completes (2-3 min), you'll get:
```
https://your-app-name.vercel.app
```
**Copy this URL!** ✏️

---

## 🔧 STEP 3: Deploy Backend (Railway)

### Import to Railway

1. Go to **https://railway.app/new**
2. Click **"Deploy from GitHub repo"**
3. Select your **rummy** repository
4. Railway auto-detects Node.js!

### 🔧 Add Environment Variables

Click **"Variables"** tab and add:

```
NODE_ENV=production
CLIENT_URL=https://your-app-name.vercel.app
```
*(Use your Vercel URL from Step 2)*

### 📝 Generate Domain

1. Go to **Settings** tab
2. Click **"Generate Domain"**
3. You'll get something like:
```
https://rummy-production-xxxx.up.railway.app
```
**Copy this URL!** ✏️

---

## 🔄 STEP 4: Connect Frontend & Backend

### Update Vercel

1. Go to **Vercel Dashboard** → Your project
2. Click **Settings** → **Environment Variables**
3. Edit `REACT_APP_API_URL`:
```
https://rummy-production-xxxx.up.railway.app
```
*(Use your Railway URL from Step 3)*

4. Click **"Redeploy"** button

### ✅ Done!

Wait 1-2 minutes for both to redeploy.

---

## 🎮 STEP 5: Test Your Game!

1. Open your Vercel URL: `https://your-app-name.vercel.app`
2. Click **"Create Room"**
3. Open in **incognito window**
4. Click **"Join Room"** with the code
5. **Play!** 🎉

---

## 🔄 Future Updates (Automatic!)

After initial setup, **any git push automatically deploys** to both platforms!

```bash
# Make changes
git add .
git commit -m "Update game"
git push

# ✅ Vercel auto-deploys frontend
# ✅ Railway auto-deploys backend
```

---

## 📋 Quick Reference

Fill this out during deployment:

```
GitHub Repo:    https://github.com/___________/___________
Vercel URL:     https://_____________________________.vercel.app
Railway URL:    https://_____________________________.up.railway.app

Environment Variables:
└─ Vercel:   REACT_APP_API_URL = [Railway URL]
└─ Railway:  CLIENT_URL = [Vercel URL]
```

---

## ❓ Why Not 100% on Vercel?

**Technical Limitation:**
- Vercel serverless functions are **stateless** and timeout after 10-60 seconds
- Socket.io needs **persistent WebSocket connections**
- These two don't work together 😞

**Solutions:**
1. ✅ **Current approach**: Vercel (frontend) + Railway (backend) - Best performance
2. ❌ Rewrite entire app without WebSockets (major work, worse user experience)
3. ❌ Use polling instead of WebSocket (laggy gameplay)

Railway's free tier ($5 credit/month) is perfect for this use case and supports WebSockets natively!

---

## 💡 Benefits of This Setup

✅ **One GitHub repo** for everything
✅ **Auto-deploy on push** (both platforms)
✅ **Free tiers** on both platforms
✅ **Perfect performance** (no compromises)
✅ **Automatic SSL** on both
✅ **Global CDN** for frontend

---

## 🎯 Complete Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created from GitHub repo
- [ ] Railway project created from GitHub repo
- [ ] Railway environment variables set (NODE_ENV, CLIENT_URL)
- [ ] Railway domain generated
- [ ] Vercel environment variable set (REACT_APP_API_URL)
- [ ] Both services redeployed with correct URLs
- [ ] Tested: Create room works
- [ ] Tested: Join room works
- [ ] Tested: Game plays smoothly

---

## 🆘 Troubleshooting

### "Can't connect to server"
- Check REACT_APP_API_URL in Vercel matches Railway URL exactly
- Ensure Railway service is running (check logs)

### "CORS error"
- Verify CLIENT_URL in Railway matches Vercel URL exactly
- No trailing slashes (/)
- Redeploy Railway after fixing

### "Build failed on Vercel"
- Ensure root directory is set to `client`
- Check that all dependencies are in client/package.json

### "Railway crashed"
- Check Railway logs for errors
- Verify NODE_ENV=production is set
- Ensure all server dependencies are in root package.json

---

## 📞 Need Help?

1. Check Railway logs: Dashboard → Your Project → Deployments
2. Check Vercel logs: Dashboard → Your Project → Deployments
3. Open browser console (F12) for frontend errors

---

## 🎉 Success!

Your game is now live with:
- ⚡ **Instant global access**
- 🔄 **Auto-deploy on every push**
- 💰 **Free hosting** (both platforms)
- 🎮 **Real-time multiplayer** that works!

Share your URL and play! 🎲
