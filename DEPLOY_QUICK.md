# 🚀 Quick Deploy Guide

Deploy in 10 minutes! Backend on Railway, Frontend on Vercel.

## 📋 Before You Start

1. Push this code to GitHub
2. Sign up for Railway: https://railway.app
3. Sign up for Vercel: https://vercel.com

---

## 🔧 Step 1: Deploy Backend (Railway)

1. **Go to Railway** → Click "New Project" → "Deploy from GitHub"
2. **Select** your rummy repository
3. **Add Environment Variables**:
   ```
   NODE_ENV=production
   CLIENT_URL=https://TEMPORARILY-PUT-ANYTHING-HERE.com
   ```
4. **Generate Domain** in Settings tab
5. **Copy** your Railway URL: `https://xxx.up.railway.app`

✅ Backend deployed!

---

## 🎨 Step 2: Deploy Frontend (Vercel)

1. **Go to Vercel** → Click "New Project" → Import from GitHub
2. **Configure**:
   - Root Directory: `client`
   - Framework: Create React App
3. **Add Environment Variable**:
   ```
   REACT_APP_API_URL=https://YOUR-RAILWAY-URL.up.railway.app
   ```
   (Use the Railway URL from Step 1)
4. **Click Deploy**
5. **Copy** your Vercel URL: `https://xxx.vercel.app`

✅ Frontend deployed!

---

## 🔄 Step 3: Connect Them

1. **Go back to Railway** → Variables tab
2. **Update** `CLIENT_URL` to your Vercel URL:
   ```
   CLIENT_URL=https://your-app.vercel.app
   ```
3. Wait 1-2 minutes for Railway to redeploy

✅ Connected!

---

## ✅ Step 4: Test

1. Open your Vercel URL
2. Create a room
3. Open in incognito/new browser
4. Join with room code
5. Play the game!

---

## 🎯 That's It!

Your Indian Rummy game is now live! 🎮

**Share your deployed URL with friends!**

---

## 🆘 Problems?

### Can't connect?
- Check Railway logs for errors
- Verify environment variables match exactly
- No trailing slashes in URLs

### CORS errors?
- Make sure `CLIENT_URL` in Railway = Vercel URL
- Redeploy Railway after updating variables

### Full troubleshooting guide: See DEPLOYMENT.md

---

## 📍 Save These URLs

```
Backend:  https://______________________.up.railway.app
Frontend: https://______________________.vercel.app
```
