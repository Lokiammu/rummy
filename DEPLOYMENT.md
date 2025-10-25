# Deployment Guide - Indian Rummy Game

This guide walks you through deploying the backend on **Railway** and the frontend on **Vercel**.

## Architecture Overview

- **Backend (Railway)**: Node.js server with Socket.io for WebSocket connections
- **Frontend (Vercel)**: React application with static hosting
- **Communication**: Frontend connects to backend via WebSocket

## Prerequisites

- GitHub account
- Railway account (free tier available at https://railway.app)
- Vercel account (free tier available at https://vercel.com)
- Git installed locally

---

## Part 1: Deploy Backend to Railway

### Step 1: Push Code to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add -A

# Commit
git commit -m "Prepare for deployment"

# Add remote (replace with your GitHub repo)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main
```

### Step 2: Create Railway Project

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account
5. Select your **rummy** repository
6. Railway will automatically detect it's a Node.js project

### Step 3: Configure Environment Variables

1. In Railway dashboard, click on your project
2. Go to **"Variables"** tab
3. Add the following environment variables:

```
NODE_ENV=production
PORT=3001
CLIENT_URL=https://your-app.vercel.app
```

**Note**: You'll update `CLIENT_URL` after deploying the frontend

### Step 4: Get Your Railway Backend URL

1. In Railway dashboard, go to **"Settings"** tab
2. Click **"Generate Domain"** under "Domains"
3. You'll get a URL like: `https://your-app-name.up.railway.app`
4. **Save this URL** - you'll need it for the frontend

### Step 5: Update CLIENT_URL

1. Once you have your Vercel frontend URL (from Part 2)
2. Go back to Railway dashboard → Variables
3. Update `CLIENT_URL` to your Vercel URL
4. Railway will automatically redeploy

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Deploy from GitHub

1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select the **rummy** repository

### Step 2: Configure Build Settings

Vercel should auto-detect React, but verify:

- **Framework Preset**: Create React App
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### Step 3: Add Environment Variable

1. Before deploying, click **"Environment Variables"**
2. Add:

```
Name: REACT_APP_API_URL
Value: https://your-railway-app.up.railway.app
```

**Replace** with your actual Railway backend URL from Part 1, Step 4

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. You'll get a URL like: `https://your-app.vercel.app`

### Step 5: Update Railway CLIENT_URL

1. Go back to Railway dashboard
2. Update `CLIENT_URL` environment variable to your Vercel URL
3. Wait for Railway to redeploy

---

## Part 3: Verify Deployment

### Test Your Deployed App

1. Open your Vercel URL: `https://your-app.vercel.app`
2. Click **"Create Room"**
3. Enter your name → Room code should appear
4. Open the same URL in an incognito/private window
5. Click **"Join Room"**
6. Enter the room code
7. Game should start!

### Check WebSocket Connection

Open browser console (F12) and check for:
- ✅ No CORS errors
- ✅ Socket connection established
- ✅ "Room created" or "Player joined" messages

---

## Troubleshooting

### CORS Errors

**Symptoms**: Console shows CORS policy errors

**Solution**:
1. Verify `CLIENT_URL` in Railway matches your Vercel URL exactly
2. Ensure no trailing slash in URL
3. Redeploy Railway after updating environment variables

### WebSocket Connection Failed

**Symptoms**: Players can't connect, game doesn't start

**Solution**:
1. Check `REACT_APP_API_URL` in Vercel points to Railway URL
2. Ensure Railway backend is running (check logs)
3. Verify PORT is set to 3001 in Railway

### Frontend Shows Blank Page

**Symptoms**: White screen on Vercel deployment

**Solution**:
1. Check Vercel build logs for errors
2. Verify root directory is set to `client`
3. Clear Vercel cache and redeploy

### Railway Backend Crashes

**Symptoms**: Railway shows "Crashed" status

**Solution**:
1. Check Railway logs for errors
2. Verify all dependencies are in package.json
3. Ensure NODE_ENV is set to "production"

---

## Environment Variables Reference

### Railway (Backend)

| Variable | Value | Description |
|----------|-------|-------------|
| NODE_ENV | production | Enables production mode |
| PORT | 3001 | Server port (auto-assigned by Railway) |
| CLIENT_URL | https://your-app.vercel.app | Frontend URL for CORS |

### Vercel (Frontend)

| Variable | Value | Description |
|----------|-------|-------------|
| REACT_APP_API_URL | https://your-app.up.railway.app | Backend URL for Socket.io |

---

## Updating Your App

### Update Backend

```bash
# Make changes to server files
git add .
git commit -m "Update backend"
git push

# Railway auto-deploys from GitHub
```

### Update Frontend

```bash
# Make changes to client files
git add .
git commit -m "Update frontend"
git push

# Vercel auto-deploys from GitHub
```

---

## Cost Breakdown

### Railway Free Tier
- $5 credit per month
- Includes 500 hours
- WebSocket support included
- Auto-sleep after inactivity

### Vercel Free Tier
- 100 GB bandwidth per month
- Unlimited projects
- Automatic SSL
- Perfect for static React apps

**Total Cost**: FREE for moderate usage

---

## Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to Vercel project → Settings → Domains
2. Add your domain (e.g., `rummy.yourdomain.com`)
3. Follow DNS configuration instructions
4. Update `CLIENT_URL` in Railway

### Add Custom Domain to Railway

1. Go to Railway project → Settings → Domains
2. Add custom domain
3. Configure DNS records
4. Update `REACT_APP_API_URL` in Vercel

---

## Production Checklist

Before going live:

- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured correctly
- [ ] WebSocket connection working
- [ ] Tested room creation and joining
- [ ] Tested complete gameplay flow
- [ ] Checked browser console for errors
- [ ] Verified mobile responsiveness
- [ ] SSL certificates active (automatic)

---

## Monitoring

### Railway Logs

View real-time logs:
1. Railway dashboard → Your project
2. Click **"Deployments"** tab
3. View logs for errors and debugging

### Vercel Analytics

Enable analytics:
1. Vercel dashboard → Your project
2. Go to **"Analytics"** tab
3. Track page views and performance

---

## Support & Resources

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Socket.io Docs**: https://socket.io/docs/v4/

---

## Quick Reference URLs

After deployment, save these URLs:

```
Backend (Railway): https://your-app-name.up.railway.app
Frontend (Vercel): https://your-app.vercel.app
GitHub Repo: https://github.com/YOUR_USERNAME/YOUR_REPO
```

---

## Security Notes

This application contains intentional game-rigging logic where the room creator always wins. This is for educational/entertainment purposes only.

**Do NOT use for**:
- Real money gambling
- Competitive tournaments
- Any scenario requiring fair play

---

## Next Steps

1. Deploy backend to Railway (Part 1)
2. Deploy frontend to Vercel (Part 2)
3. Test the deployment (Part 3)
4. Share your deployed app URL!

Your Indian Rummy game will be live and accessible worldwide! 🎮🌍
