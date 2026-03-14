# Building Shelter Sessions APK

This guide will walk you through building and installing the Shelter Sessions app on your Android device.

## Prerequisites

- Node.js and npm installed
- Expo CLI installed (`npm install -g expo-cli`)
- EAS CLI installed (`npm install -g eas-cli`)
- Expo account (free, create at expo.dev)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Login to Expo

```bash
eas login
```

Enter your Expo credentials when prompted.

## Step 3: Configure EAS Build

Run the configuration command:

```bash
eas build:configure
```

This will create an `eas.json` file. Accept the defaults.

## Step 4: Build the APK

For a development build (faster, for testing):

```bash
eas build --platform android --profile preview
```

For a production build (optimized, for distribution):

```bash
eas build --platform android --profile production
```

**What happens:**
- Builds are done on Expo's servers (no local Android Studio needed!)
- Takes ~10-15 minutes
- You'll get a link to download the APK when complete

## Step 5: Download the APK

When the build finishes, you'll see a link like:

```
✔ Build finished
https://expo.dev/accounts/USERNAME/projects/shelter-sessions/builds/BUILD_ID
```

1. Click the link or visit https://expo.dev/accounts/mikisegall/projects/shelter-sessions/builds
2. Find your latest build
3. Click "Download" to get the .apk file

## Step 6: Install on Your Phone

### Method 1: Direct Download (Easiest)
1. Open the Expo build link on your phone
2. Download the APK directly
3. Open the downloaded file
4. Android will ask "Install unknown apps?" → Allow
5. Tap "Install"

### Method 2: Transfer via USB
1. Download APK to your computer
2. Connect phone via USB
3. Copy APK to phone's Download folder
4. On phone: Open "Files" app → Downloads
5. Tap the APK file
6. Allow installation from this source
7. Tap "Install"

### Method 3: adb (Developer Option)
```bash
# Connect phone via USB with USB debugging enabled
adb install path/to/shelter-sessions.apk
```

## Step 7: First Launch

1. Open "Shelter Sessions" app
2. Grant any permissions requested
3. App will work 100% offline
4. When online, tap "🔄 Check for New Topics" to sync

## Updating Content

To add new topics:

1. Add JSON files to `public/topics/`
2. Update `public/topics/manifest.json`
3. Commit and push to GitHub
4. **First time only**: Enable GitHub Pages
   - Make repository public: `gh repo edit mikisegall/shelter-sessions --visibility public`
   - Go to Settings → Pages → Source: main branch → Save
   - Wait ~1 minute for deployment
5. Users tap "Check for New Topics" to download

## Troubleshooting

### Build Failed
- Check `eas.json` exists
- Ensure you're logged in: `eas whoami`
- Try: `eas build --clear-cache --platform android`

### Can't Install APK
- Enable "Install from Unknown Sources" in Android settings
- Security & Privacy → Install unknown apps → Chrome/Files → Allow

### App Crashes on Launch
- Check Expo Go SDK matches: Should be SDK 54
- Rebuild with: `eas build --platform android --profile preview --clear-cache`

### Sync Not Working
- Check internet connection
- Verify GitHub Pages is enabled
- Check manifest URL in `src/services/sync/contentSync.ts`

## Quick Reference Commands

```bash
# Check if logged in
eas whoami

# Build preview APK
eas build --platform android --profile preview

# Build production APK
eas build --platform android --profile production

# View build status
eas build:list

# Type check before building
npm run type-check

# Run locally first
npm start
```

## Production Checklist

Before building for distribution:

- [ ] Update version in `app.json`
- [ ] Test all features work offline
- [ ] Test sync downloads new topics
- [ ] Run `npm run type-check`
- [ ] Test on physical device via Expo Go
- [ ] Build production APK
- [ ] Install and test production build
- [ ] Verify app icon and splash screen

## EAS Build Configuration

The `eas.json` file should look like:

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

## Notes

- **No Android Studio needed** - EAS builds in the cloud
- **Free tier**: 30 builds/month for free Expo accounts
- **Build time**: ~10-15 minutes per build
- **APK size**: ~50-70 MB for production
- **Offline-first**: App works 100% without internet
- **Content updates**: Via GitHub Pages, no app rebuild needed

Happy learning! 📚
