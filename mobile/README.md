# Azdoc Mobile App

React Native mobile app built with Expo for the Azdoc platform.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo Go app on your mobile device (for testing)
- iOS Simulator (Mac only) or Android Emulator

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the mobile directory:
```
EXPO_PUBLIC_API_URL=http://localhost:8080
```

For testing on a physical device, replace `localhost` with your computer's IP address.

## Running the App

### Start the development server:
```bash
npm start
```

### Run on specific platforms:
```bash
# iOS
npm run ios

# Android  
npm run android

# Web (experimental)
npm run web
```

## Project Structure

```
mobile/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts (Auth, etc.)
│   ├── navigation/     # Navigation configuration
│   ├── screens/        # Screen components
│   ├── services/       # API services
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   └── constants/      # App constants
├── assets/             # Images, fonts, etc.
├── App.tsx            # App entry point
└── app.json           # Expo configuration
```

## Features Implemented

- ✅ User authentication (login/register)
- ✅ JWT token management with secure storage
- ✅ Guest session support
- ✅ Chat interface with streaming responses
- ✅ Multiple chat sessions
- ✅ User profile management
- ✅ Tab navigation
- ⏳ File upload capability
- ⏳ Multi-language support
- ⏳ Push notifications

## API Configuration

The app connects to the Spring Boot backend. Make sure:
1. Backend is running on port 8080
2. CORS is configured to allow requests from Expo
3. Update `EXPO_PUBLIC_API_URL` if backend is on a different host/port

## Building for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

See [Expo documentation](https://docs.expo.dev/build/introduction/) for detailed build instructions.