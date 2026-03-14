# Building Your Shelter Sessions APK

This guide walks you through building a standalone Android APK that you can install directly on your phone.

## What is EAS Build?

**EAS (Expo Application Services)** is Expo's cloud build service. It builds your app on Expo's servers, so you don't need:
- Android Studio installed
- A Mac for iOS builds
- Complex SDK setup
- Hours of configuration

You just run a command, wait ~10-15 minutes, and download your APK!

---

## Prerequisites

### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

### 2. Create Expo Account (Free)

If you don't have one:
1. Go to https://expo.dev
2. Sign up (free account gives you 30 builds/month)
3. Verify your email

---

## Step-by-Step Build Process

### Step 1: Login to EAS

```bash
eas login
```

Enter your Expo credentials when prompted.

**Check you're logged in:**
```bash
eas whoami
```

You should see your username.

### Step 2: Configure EAS Build

This creates the build configuration file:

```bash
eas build:configure
```

**What this does:**
- Creates `eas.json` in your project root
- Asks which platforms you want (select: Android)
- Sets up default build profiles

**Accept the defaults** - they're already optimized for APK builds.

### Step 3: Build Your APK

For your first build, use the **preview** profile (faster, good for testing):

```bash
eas build --platform android --profile preview
```

**What happens:**
1. ✅ EAS validates your project
2. ✅ Uploads your code to Expo's servers
3. ✅ Builds the APK in the cloud (~10-15 minutes)
4. ✅ Gives you a download link when done

**You'll see output like:**
```
✔ Build finished
https://expo.dev/accounts/YOUR_USERNAME/projects/shelter-sessions/builds/BUILD_ID
```

### Step 4: Download Your APK

**Option A: Direct Link (Easiest)**
- Click the link from Step 3
- Or visit: https://expo.dev/accounts/YOUR_USERNAME/projects/shelter-sessions/builds
- Find your latest build
- Click **"Download"** to get the `.apk` file

**Option B: QR Code**
- Scan the QR code shown in the terminal
- Download directly to your phone

---

## Installing on Your Phone

### Method 1: Direct Download (Recommended)

1. **On your phone**, open the build link from EAS
2. Tap **"Download"** - the APK downloads
3. Open the downloaded file
4. Android will ask: **"Install unknown apps?"**
   - Tap **"Settings"**
   - Enable **"Allow from this source"** (Chrome/Files app)
5. Tap **"Install"**
6. Done! App appears in your app drawer

### Method 2: Transfer via USB

1. Download APK to your computer
2. Connect phone via USB
3. Copy APK to `Phone/Download/` folder
4. On phone: Open **Files** app → **Downloads**
5. Tap the `.apk` file
6. Allow installation → Install

### Method 3: ADB (Developer Option)

If you have USB debugging enabled:

```bash
adb install path/to/shelter-sessions.apk
```

---

## Understanding Build Profiles

Your `eas.json` has two profiles:

### Preview Profile
```bash
eas build --platform android --profile preview
```

**Use for:**
- Testing on your device
- Quick iterations
- Development builds

**Pros:**
- Faster build (~10 min)
- Smaller file size
- Good for testing

### Production Profile
```bash
eas build --platform android --profile production
```

**Use for:**
- Final release version
- Sharing with others
- Publishing to Play Store

**Pros:**
- Fully optimized
- Smallest file size (~50-70 MB)
- Release-ready

---

## First Time Build Checklist

Before building:

- [ ] Run `npm run type-check` - ensure no TypeScript errors
- [ ] Test in Expo Go - make sure everything works
- [ ] Update `version` in `app.json` (e.g., "1.0.0" → "1.0.1" for updates)
- [ ] Commit all changes to git
- [ ] Run `eas whoami` - confirm you're logged in

---

## Updating Your App

When you make changes and want a new build:

1. **Update version in app.json:**
   ```json
   {
     "expo": {
       "version": "1.0.1"  // Increment this
     }
   }
   ```

2. **Rebuild:**
   ```bash
   eas build --platform android --profile preview
   ```

3. **Install new APK** (overwrites old version)

---

## Troubleshooting

### Build Failed: "Invalid credentials"

**Solution:**
```bash
eas logout
eas login
```

### Build Failed: "Validation error"

**Check:**
- Run `npm run type-check` to catch TypeScript errors
- Ensure `app.json` is valid JSON
- Make sure all imports exist

**Try:**
```bash
eas build --platform android --profile preview --clear-cache
```

### Can't Install APK: "App not installed"

**Cause:** Trying to downgrade version

**Solution:**
1. Uninstall old version first
2. Install new APK

OR

Update version number in `app.json` before building

### Build Stuck at "Waiting for build to complete"

**Solution:**
- Be patient (first build can take 15-20 minutes)
- Check build status: https://expo.dev/accounts/YOUR_USERNAME/projects/shelter-sessions/builds
- Cancel and retry: `Ctrl+C` then rebuild

---

## Advanced: What's in eas.json?

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

**Key points:**
- `buildType: "apk"` - Builds installable APK (not AAB for Play Store)
- Two profiles: preview (dev) and production (release)

---

## Build Commands Quick Reference

```bash
# Login
eas login

# Check who you're logged in as
eas whoami

# Build preview APK
eas build --platform android --profile preview

# Build production APK
eas build --platform android --profile production

# View build history
eas build:list

# Clear cache and rebuild
eas build --platform android --profile preview --clear-cache
```

---

## Adding New Content Without Rebuilding

One of the best features of your app: **you can add new topics without rebuilding!**

1. Add new JSON files to `public/topics/`
2. Update `public/topics/manifest.json`
3. Commit and push to GitHub
4. **Users tap "🔄 Check for New Topics"** in the app
5. New content downloads automatically!

No new APK needed. Your app stays up-to-date via GitHub Pages.

---

## Free Tier Limits

Expo's free tier includes:
- **30 builds per month**
- Unlimited projects
- Unlimited downloads
- All features except priority support

**Tips to stay within limits:**
- Test thoroughly in Expo Go before building
- Use preview builds during development
- Only create production builds for releases

---

## Next Steps After First Build

Once your APK is installed:

1. **Test all features:**
   - Browse topics
   - Read a session
   - Complete a quiz
   - Sync new topics
   - Dark mode toggle

2. **Check offline mode:**
   - Enable airplane mode
   - App should work 100%

3. **Test sync:**
   - Disable airplane mode
   - Tap "🔄 Check for New Topics"
   - Should see new content

4. **Share the APK:**
   - Send APK file to friends
   - Or share the Expo download link

---

## Cost Breakdown

**Free (what you're using):**
- Expo account: Free
- GitHub Pages: Free
- 30 builds/month: Free
- Unlimited app installs: Free

**Total cost:** $0

**Paid options (optional):**
- Expo Pro ($29/month): 60 builds/month + priority support
- Google Play Store: $25 one-time fee (if you want to publish)

---

## Support & Resources

- **EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **Troubleshooting:** https://docs.expo.dev/build-reference/troubleshooting/
- **Your builds:** https://expo.dev/accounts/YOUR_USERNAME/projects/shelter-sessions/builds
- **GitHub Issues:** https://github.com/anthropics/claude-code/issues

---

Ready to build? Run:

```bash
eas login
eas build --platform android --profile preview
```

Then grab a coffee - your APK will be ready in ~15 minutes! ☕
