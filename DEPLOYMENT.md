# PythonAnywhere Deployment Guide

This guide walks you through setting up automated deployment for the TIMS Taxonomy application on PythonAnywhere's free tier using GitHub Actions.

## Prerequisites

- A [PythonAnywhere](https://www.pythonanywhere.com) free account
- A GitHub repository for this project
- Git installed on your local machine

## Overview

The deployment system works as follows:
1. You push code to the `main` branch on GitHub
2. GitHub Actions triggers a workflow
3. The workflow sends a secure webhook to your PythonAnywhere app
4. The webhook endpoint validates the request and runs `deploy.sh`
5. The deployment script pulls the latest code, updates dependencies, and reloads the app

## Setup Instructions

### 1. PythonAnywhere Setup

#### 1.1 Clone Repository

```bash
cd /home/timstaxonomy
git clone https://github.com/yourusername/timstaxonomy.git mysite
cd mysite
```

#### 1.2 Create Virtual Environment

```bash
cd /home/timstaxonomy
mkvirtualenv timstaxonomy --python=python3.10
```

#### 1.3 Install Dependencies

```bash
cd /home/timstaxonomy/mysite
workon timstaxonomy
pip install -r requirements.txt
```

#### 1.3 Configure Environment Variables

Create a `.env` file in your project directory:
#### 1.4 Create Environment File

Create a `.env` file in the project root (`/home/timstaxonomy/mysite/.env`):

```bash
WEBHOOK_SECRET=your_generated_secret_here
FLASK_ENV=production
```

**Generate a secure webhook secret:**
```bash
openssl rand -hex 32
```

Save and exit (Ctrl+X, then Y, then Enter).

#### 1.4 Set Up Web App

1. Go to the **Web** tab in PythonAnywhere dashboard
2. Click **Add a new web app**
3. Choose **Manual configuration** (not Flask)
4. Select **Python 3.10**
5. Click through to create the app

#### 1.5 Configure WSGI File

Click on the WSGI configuration file link (`/var/www/timstaxonomy_pythonanywhere_com_wsgi.py`) and replace its contents with:

```python
import sys
import os

# Add your project directory to the sys.path
project_home = '/home/timstaxonomy/mysite'
if project_home not in sys.path:
    sys.path = [project_home] + sys.path

# Load environment variables
from dotenv import load_dotenv
load_dotenv(os.path.join(project_home, '.env'))

# Import your Flask app
from app import app as application
```

#### 1.6 Configure Virtual Environment

In the Web tab, set the **Virtualenv** path to:
```
/home/timstaxonomy/.virtualenvs/timstaxonomy
```

#### 1.7 Configure Static Files

Add a static files mapping:
- URL: `/static/`
- Directory: `/home/timstaxonomy/mysite/static/`

#### 1.8 Reload the Web App

Click the green **Reload** button at the top of the Web tab.

#### 1.10 Make Deploy Script Executable

```bash
chmod +x /home/timstaxonomy/mysite/deploy.sh
```

### 2. GitHub Repository Setup

#### 2.1 Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

**Secret 1:**
- Name: `WEBHOOK_SECRET`
- Value: The same secure string you used in your `.env` file

**Secret 2:**
- Name: `PYTHONANYWHERE_URL`
- Value: `https://timstaxonomy.pythonanywhere.com`

#### 2.2 Commit and Push

Ensure all the deployment files are committed:

```bash
git add .
git commit -m "Add deployment infrastructure"
git push origin main
```

### 3. Testing the Deployment

#### 3.1 Test Locally (Optional)

You can test the webhook endpoint locally:

```bash
# Generate a test signature
PAYLOAD='{"test":"deployment"}'
SECRET="your-webhook-secret"
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.* //')

# Send test request
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=$SIGNATURE" \
  -d "$PAYLOAD" \
  http://localhost:5001/webhook/deploy
```

#### 3.2 Test GitHub Actions

1. Make a small change to your code (e.g., update README.md)
2. Commit and push to the `main` branch
3. Go to **Actions** tab in your GitHub repository
4. Watch the workflow run
5. Check your PythonAnywhere app to verify the changes

#### 3.3 Check Deployment Logs

On PythonAnywhere, view the deployment log:

```bash
cat ~/deployment.log
```

## Troubleshooting

### Webhook Returns 401 Error

**Problem:** Invalid signature or missing webhook secret.

**Solution:**
- Verify `WEBHOOK_SECRET` matches in both `.env` file and GitHub secrets
- Ensure the secret has no extra spaces or newlines
- Check PythonAnywhere error logs: **Web** tab → **Error log**

### Deployment Script Fails

**Problem:** Git pull fails or dependencies can't install.

**Solution:**
- Check if you have uncommitted changes: `git status`
- Reset to remote state: `git reset --hard origin/main`
- Manually run: `pip install -r requirements.txt`
- Check deployment log: `cat ~/deployment.log`

### App Doesn't Reload

**Problem:** WSGI file not found or incorrect path.

**Solution:**
- Verify WSGI file path in `deploy.sh` matches your actual file
- Manually reload from PythonAnywhere Web tab
- Check the WSGI file path is `/var/www/timstaxonomy_pythonanywhere_com_wsgi.py`

### GitHub Actions Workflow Fails

**Problem:** Secrets not configured or incorrect URL.

**Solution:**
- Verify both secrets are set in GitHub repository settings
- Check `PYTHONANYWHERE_URL` doesn't have trailing slash
- View workflow logs in GitHub Actions tab for detailed error

## PythonAnywhere Free Tier Limitations

- **One web app only**: You can only host one web application
- **Daily CPU quota**: Limited CPU seconds per day (resets at UTC midnight)
- **No SSH access**: Use Bash console for command-line access
- **No scheduled tasks**: Free tier doesn't support cron jobs
- **Manual reload required**: If `deploy.sh` can't find WSGI file, reload manually from Web tab

## Manual Deployment

If automated deployment isn't working, you can deploy manually:

```bash
cd ~/timstaxonomy
git pull origin main
source ~/.virtualenvs/timstaxonomy/bin/activate
pip install -r requirements.txt
# Then reload from Web tab
```

## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use strong webhook secrets** - Generate with `openssl rand -hex 32`
3. **Keep dependencies updated** - Regularly update `requirements.txt`
4. **Monitor logs** - Check deployment and error logs regularly

## Next Steps

- Set up custom domain (requires paid PythonAnywhere account)
- Add database support if needed
- Configure HTTPS (automatic on PythonAnywhere)
- Set up monitoring and alerts

## Support

- **PythonAnywhere Help**: https://help.pythonanywhere.com
- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Flask Documentation**: https://flask.palletsprojects.com

---

**Created by:** TIMS Taxonomy Team  
**Last Updated:** February 2026
