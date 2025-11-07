# Longevity Protocol Tracker
## Complete Installation Guide for iPhone 16

Welcome to your personal 12-Month Integrated Longevity Protocol Tracker! This Progressive Web App (PWA) is specifically designed for your iPhone 16 and works completely offline.

---

## 📱 INSTALLATION INSTRUCTIONS FOR IPHONE 16

### Method 1: Using GitHub Pages (Recommended - Easiest)

#### Step 1: Upload Files to GitHub
1. Go to [GitHub.com](https://github.com) and sign in (create a free account if needed)
2. Click the **"+"** button in the top right → **"New repository"**
3. Name it: `longevity-tracker`
4. Make it **Public**
5. Check **"Add a README file"**
6. Click **"Create repository"**

#### Step 2: Upload Your App Files
1. In your new repository, click **"Add file"** → **"Upload files"**
2. Upload these files from your computer:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `manifest.json`
3. Click **"Commit changes"**

#### Step 3: Enable GitHub Pages
1. Go to **Settings** (top menu in your repository)
2. Scroll down to **"Pages"** (left sidebar)
3. Under "Source", select **"main"** branch
4. Click **"Save"**
5. Wait 2-3 minutes for deployment
6. Your app will be live at: `https://YOUR-USERNAME.github.io/longevity-tracker`

#### Step 4: Install on iPhone 16
1. **Open Safari** on your iPhone (must use Safari, not Chrome)
2. Go to your GitHub Pages URL: `https://YOUR-USERNAME.github.io/longevity-tracker`
3. Tap the **Share button** (square with arrow pointing up)
4. Scroll down and tap **"Add to Home Screen"**
5. Name it "Longevity" or your preferred name
6. Tap **"Add"**
7. The app icon will appear on your home screen!

---

### Method 2: Using a Simple Web Server (For Advanced Users)

If you have access to any web hosting service:

1. Upload all files to your web host
2. Access the URL in Safari on your iPhone
3. Follow Step 4 from Method 1 above

---

### Method 3: Local Testing (Temporary - Requires Computer)

#### Using Python (Mac/Linux):
```bash
cd /path/to/longevity-tracker
python3 -m http.server 8000
```

#### Then on iPhone:
1. Make sure your iPhone is on the same Wi-Fi network as your computer
2. Find your computer's IP address
3. In Safari, go to: `http://YOUR-COMPUTER-IP:8000`
4. Follow installation steps from Method 1, Step 4

**Note:** This method only works while your computer's server is running.

---

## 🎯 FIRST-TIME SETUP

### When You First Open the App:

1. **Set Your Start Date**
   - Go to Settings (bottom right icon)
   - Enter your protocol start date
   - This calculates your current week and phase

2. **Configure Current Week**
   - If you're not starting at Week 1, set your current week
   - The app will automatically determine your phase

3. **Add Accountability Partner** (Optional)
   - Enter your accountability partner's email
   - This reminds you of your external commitment

4. **Review Safety Protocols**
   - Go to Health tab
   - Review the safety reminders for your conditions

---

## 💪 HOW TO USE THE APP

### TODAY TAB (Home)
- **Current Phase Card**: Shows your current training phase and progress
- **Today's Workout**: Displays scheduled workout for today
- **Health Metrics**: Quick view of BP, weight, streaks
- **Daily Habits**: Tap each habit to mark complete

### WORKOUT TAB
- **Start Workout**: Begin today's scheduled workout
- **Select Exercises**: Choose from safe, pre-filtered exercises
- **Track Sets**: Log weight, reps, and RPE for each set
- **Complete**: Save your workout to history

### PROGRESS TAB
- **Strength**: View workout stats and PR tracking
- **Health**: Blood pressure and weight trends
- **Behavior**: Streaks for habits and compliance

### HEALTH TAB
- **Log Metrics**: Daily BP, weight, smoke/alcohol status
- **View History**: See all past entries
- **Safety Reminders**: Always visible

### SETTINGS TAB
- **Update Profile**: Adjust start date and current week
- **Data Management**: Export/import your data
- **Backup**: Download JSON file of all your data

---

## 🏋️ WORKOUT TRACKING GUIDE

### Starting a Workout:
1. Tap **"Start Workout"** on Today tab
2. App loads appropriate exercises for your current phase
3. Select exercises (all pre-filtered for safety)
4. Tap **"Begin Workout"**

### During Workout:
1. For each set, enter:
   - **Weight** (in lbs)
   - **Reps** (number completed)
   - **RPE** (1-10 scale - how hard it felt)

2. **CRITICAL SAFETY REMINDERS:**
   - ⚠️ Exhale during exertion (never hold breath)
   - ⚠️ Stop immediately if you feel sharp pain
   - ⚠️ If gout flare occurs, cease all exercise

3. Tap **"+ Add Set"** if you need extra sets
4. Tap **"Complete Workout"** when finished

### The App Automatically:
- Filters out dangerous exercises (barbell squats, deadlifts, twisting)
- Provides only scoliosis-safe alternatives
- Tracks your progress over time
- Marks your workout habit as complete

---

## 🩺 HEALTH METRICS TRACKING

### Daily Logging:
1. Tap **"Log Metrics"** button
2. Enter today's data:
   - Blood Pressure (systolic/diastolic)
   - Body Weight
   - Check smoke-free day (if applicable)
   - Check alcohol-free day (if applicable)

### Why This Matters:
- BP tracking essential for monitoring HBP management
- Weight tracking shows body composition changes
- Compliance tracking for accountability
- Streak tracking for motivation

### Frequency:
- **Blood Pressure**: Daily, preferably same time each day
- **Weight**: 2-3 times per week (same time, after waking)
- **Compliance**: Daily checkboxes

---

## ✅ HABIT TRACKING

### Default Habits:
1. 🏋️ Complete Workout
2. 🏃 3x10 Cardio (if scheduled)
3. 🩺 Blood Pressure Check
4. 💧 3-4L Water Intake
5. 🚭 Smoke-Free Day
6. 🍺 Alcohol-Free Day
7. 🧘 15-20 Min Stretching

### How It Works:
- Habits reset daily at midnight
- Tap each item to mark complete
- Green checkmark appears when done
- Completion % shown in Progress tab

---

## 📊 UNDERSTANDING YOUR PHASES

### Phase Zero (Weeks 1-4)
- **MANDATORY medical clearance required**
- Light mobility and habit formation
- NO heavy training until cleared
- Focus: Cessation protocols

### Foundation (Weeks 1-12)
- 3 full-body workouts per week
- RPE 4-6 (very manageable)
- 12-15 reps per set
- Focus: Form and consistency

### Strength Endurance (Weeks 13-24)
- 4 workouts per week (upper/lower split)
- RPE 6-7 (moderate challenge)
- 8-12 reps per set
- Focus: Building work capacity

### Accelerated Hypertrophy (Weeks 25-32)
- 3 full-body workouts (Heavy/Light/Moderate)
- RPE 7-8 (challenging but controlled)
- Reverse pyramid sets
- Focus: Muscle growth

### Integration & Longevity (Weeks 33-52)
- 4 workouts per week (undulating)
- RPE varies 5-8
- Mixed rep ranges
- Focus: Sustainability and mobility

---

## 🚨 SAFETY PROTOCOLS (CRITICAL)

### ALWAYS AVOID:
- ❌ Barbell Back Squats (high axial load)
- ❌ Conventional Deadlifts (asymmetric loading risk)
- ❌ Russian Twists (twisting motion)
- ❌ Heavy bent-over rows with barbell

### ALWAYS USE INSTEAD:
- ✅ Goblet Squats
- ✅ Dumbbell RDLs
- ✅ Pallof Press
- ✅ Single-arm Dumbbell Rows

### BREATHING (High Blood Pressure):
- **EXHALE on exertion** (lifting phase)
- **INHALE on lowering** (eccentric phase)
- **NEVER hold your breath** (Valsalva maneuver)

### GOUT FLARE PROTOCOL:
- **STOP all exercise immediately**
- Ice the affected joint
- Rest until flare subsides
- Resume light activity only after clearance

---

## 💾 DATA & BACKUP

### Automatic Saving:
- All data saves automatically to your iPhone
- No internet required after installation
- Data persists even if you close the app

### Manual Backup (Recommended Monthly):
1. Go to Settings tab
2. Tap **"Export Data"**
3. Save the JSON file to iCloud or email to yourself
4. This creates a complete backup

### Restoring Data:
1. Go to Settings tab
2. Tap **"Import Data"**
3. Select your backup JSON file
4. All data will be restored

---

## 🔧 TROUBLESHOOTING

### App Not Loading:
1. Make sure you installed via Safari (not Chrome)
2. Check that you're using the correct URL
3. Clear Safari cache: Settings → Safari → Clear History
4. Try reinstalling from home screen

### Data Not Saving:
1. Check Safari settings → Privacy → Allow local storage
2. Make sure you have storage space on iPhone
3. Export data as backup, then clear and re-import

### Workout Not Tracking:
1. Make sure you fill in at least Reps for each set
2. Tap "Complete Workout" to save
3. Check that you're not in Low Power Mode

### Icons Not Showing:
1. You need to create simple icon files (see below)
2. Or the app will work fine without custom icons

---

## 🎨 CREATING APP ICONS (OPTIONAL)

If you want custom icons:

1. Use any icon generator website
2. Create 192x192 and 512x512 PNG images
3. Save as `icon-192.png` and `icon-512.png`
4. Upload to same location as your other files

Or simply use emojis - the app works perfectly without custom icons!

---

## 📈 TRACKING YOUR PROGRESS

### Weekly Review:
- Check Progress tab every Sunday
- Review workout consistency
- Check health metric trends
- Adjust intensity as needed

### Monthly Milestones:
- Export data backup
- Review with accountability partner
- Assess if phase goals are being met
- Celebrate wins!

---

## 🆘 SUPPORT & SAFETY

### Medical Concerns:
- **This app is a tracking tool only**
- Always consult your physician for medical advice
- Stop immediately if you experience:
  - Chest pain or pressure
  - Severe shortness of breath
  - Dizziness or lightheadedness
  - Sharp joint pain

### App Issues:
- Export your data first (backup)
- Try clearing app data and reinstalling
- Your exported backup can restore everything

---

## 🎯 SUCCESS TIPS

### For Adherence:
1. **Set a consistent time** for workouts
2. **Use the habit tracker daily** - it's your accountability
3. **Log health metrics immediately** after measuring
4. **Share progress** with your accountability partner
5. **Celebrate small wins** - every workout counts

### For Safety:
1. **Always warm up** 5-10 minutes
2. **Monitor blood pressure** before intense sessions
3. **Stay hydrated** 3-4L water daily
4. **Listen to your body** - rest when needed
5. **Follow the substitutions** - they're there for a reason

### For Progress:
1. **Progressive overload** - small increases weekly
2. **Track RPE honestly** - it guides intensity
3. **Review the trends** not just daily numbers
4. **Stay consistent** - 80% of success is showing up
5. **Trust the process** - 52 weeks is a marathon

---

## 📱 APP FEATURES SUMMARY

✅ **100% Offline** - No internet needed after install
✅ **Exercise Safety Filter** - Only shows safe exercises
✅ **Automatic Phase Detection** - Knows where you are in program
✅ **Comprehensive Tracking** - Workouts, health, habits
✅ **Progress Analytics** - Strength, health, behavior trends
✅ **Data Export/Import** - Full backup capability
✅ **iPhone Optimized** - Perfect for iPhone 16
✅ **Dark Theme** - Easy on the eyes, professional look
✅ **No Account Required** - All data stays on your device
✅ **Privacy First** - Nothing is shared or uploaded

---

## 🏁 READY TO START

1. **Install the app** using Method 1 above
2. **Complete first-time setup** in Settings
3. **Review safety protocols** in Health tab
4. **Start Today** - log today's metrics
5. **Begin your journey** - 52 weeks to transformation

Remember: This is an integrated protocol. Success requires:
- **80% Behavioral Change** (habits, compliance)
- **20% Optimized Training** (the app handles this)

Your accountability matters. Your safety matters. Your consistency matters.

**Let's build your longevity together.**

---

## 📞 QUICK REFERENCE

| Feature | Location | Purpose |
|---------|----------|---------|
| Start Workout | Today Tab | Begin exercise session |
| Log BP | Health Tab | Track blood pressure |
| Mark Habits | Today Tab | Daily compliance |
| View Progress | Progress Tab | See trends |
| Backup Data | Settings Tab | Export to file |
| Change Phase | Settings Tab | Update week |

---

**Version 1.0.0**  
**Last Updated: November 2024**  
**Designed specifically for your 12-Month Integrated Longevity Protocol**

*This app is a tool to support your protocol. Always prioritize medical clearance and safety protocols outlined in your manual.*
