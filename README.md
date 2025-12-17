<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Apex - AI-Powered Habit Tracker

<div align="center">
<img width="1200" height="475" alt="Apex Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

Transform your life with Apex: an AI-driven habit tracker that generates personalized routines and provides expert coaching to help you achieve your goals.

## Features

- **AI-Generated Routines**: Get custom daily habits based on your goals using Google Gemini AI.
- **Expert Chat Coach**: Chat with "Apex Guru" for motivation and advice.
- **Progress Tracking**: Visualize your consistency with charts and streaks.
- **Journaling**: Log your thoughts and track mood.
- **To-Do Lists**: Manage tasks alongside habits.
- **Responsive Design**: Works on mobile and desktop.

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **AI**: Google Gemini 1.5 Flash
- **Charts**: Recharts
- **Build Tool**: Vite
- **Icons**: Lucide React

## Run Locally

**Prerequisites:** Node.js (v18+ recommended)

1. Clone the repo:
   ```bash
   git clone https://github.com/whynotsanty/apex-app.git
   cd apex-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment:
   - Copy `.env` and add your Google Gemini API key:
     ```
     VITE_API_KEY=your_actual_api_key_here
     ```

4. Run the app:
   ```bash
   npm run dev
   ```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deploy

The app is ready for deployment on modern hosting platforms.

### Netlify (Recommended)
1. Connect your GitHub repo to Netlify.
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Environment variables:
   - Add `VITE_API_KEY` with your Gemini API key.
4. Deploy!

### Vercel
1. Import your repo on Vercel.
2. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Environment variables:
   - Add `VITE_API_KEY`.
4. Deploy!

### GitHub Pages
1. Enable GitHub Pages in repo settings.
2. Use a workflow (already configured in `.github/workflows/deploy.yml`).
3. Add `VITE_API_KEY` to repo secrets.

## Contributing

Feel free to open issues or PRs for improvements!

## Mobile App (Android)

The app is now a PWA and can be wrapped as a native Android app using Capacitor.

### Prerequisites
- Android Studio installed
- Java JDK 11+

### Build Android App
1. Install Capacitor dependencies:
   ```bash
   npm install
   ```

2. Build the web app:
   ```bash
   npm run build
   ```

3. Add Android platform:
   ```bash
   npm run cap:add:android
   ```

4. Sync web assets:
   ```bash
   npm run cap:sync
   ```

5. Open in Android Studio:
   ```bash
   npm run cap:open:android
   ```

6. In Android Studio, build the APK (Build > Build Bundle(s)/APK(s) > Build APK).

### Publish to Google Play Store
1. Create a Google Play Console account.
2. Create a new app in Play Console.
3. Upload the signed APK.
4. Fill in store listing, screenshots, etc.
5. Submit for review.

**Note**: For production, consider using a backend for API keys to avoid exposing them in the app.
