# RallyLive Net - Expo Go Version

This is the mobile version of RallyLive Net built with Expo and React Native, designed to work with Expo Go for easy testing and development.

## Features

- 🏁 Live rally results and standings
- 📅 Rally calendar with upcoming and past events
- 📰 Latest rally news from rallylive.net
- 📱 Native mobile experience
- 🔄 Pull-to-refresh functionality
- 📊 Stage and overall results tables

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device

### Installation

1. Navigate to the RallyLiveExpo directory:
   ```bash
   cd RallyLiveExpo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Scan the QR code with Expo Go app on your device

## Testing with Expo Go

1. **Install Expo Go** on your mobile device:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Connect your device**:
   - Scan the QR code displayed in the terminal or browser
   - Make sure your device and computer are on the same network

4. **Test the app**:
   - Navigate through different screens
   - Test pull-to-refresh functionality
   - Check rally results and calendar

## Project Structure

```
RallyLiveExpo/
├── app/                    # App screens (Expo Router)
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Home screen
│   ├── calendar.tsx       # Calendar screen
│   └── rally/[rid]/[stage_no].tsx  # Rally results screen
├── components/            # Reusable components
│   ├── RallySlider.tsx   # Rally carousel
│   ├── LiveRallies.tsx   # Live rallies list
│   └── RallyNews.tsx     # News component
├── types/                # TypeScript type definitions
└── assets/              # Images and other assets
```

## Key Features

### Rally Slider
- Horizontal scrollable cards showing current rallies
- Live status indicators
- Stage information and results

### Rally Results
- Stage and overall standings
- Tabbed interface for easy navigation
- Driver information with flags and car details

### Calendar
- Monthly view of rally events
- Upcoming and past events separation
- Direct navigation to rally results

### News Integration
- Latest news from rallylive.net
- Featured images and excerpts
- External link opening

## API Integration

The app integrates with several rallylive.net APIs:
- Live results API
- Stage times API
- Overall standings API
- Rally itinerary API
- Events calendar API
- WordPress news API

## Styling

- Uses React Native Paper for Material Design components
- Custom theme with rally-inspired colors
- Responsive design for different screen sizes
- Consistent spacing and typography

## Performance Considerations

- Lazy loading of images
- Efficient data fetching with proper error handling
- Pull-to-refresh for data updates
- Optimized list rendering

## Troubleshooting

### Common Issues

1. **Network Error**: Ensure your device and computer are on the same network
2. **QR Code Not Scanning**: Try refreshing the Expo development server
3. **App Crashes**: Check the console for error messages and ensure all dependencies are installed

### Development Tips

- Use `npm start -- --clear` to clear the cache if you encounter issues
- Enable "Debug Remote JS" in Expo Go for better debugging
- Use React Native Debugger for advanced debugging

## Building for Production

To build the app for production:

```bash
# Build for Android
expo build:android

# Build for iOS
expo build:ios
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with Expo Go
5. Submit a pull request

## License

This project is licensed under the MIT License.