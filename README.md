# SG Bus Arrival

A modern, mobile-first Progressive Web App (PWA) for real-time bus arrival tracking in Singapore, built with React, TypeScript, and shadcn/ui.

## Features

- 📱 **Mobile-first Design**: Optimized for mobile devices with touch-friendly interface
- 🚌 **Real-time Bus Arrivals**: Track bus arrivals at multiple stops using live Singapore LTA data
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS v4
- 🌓 **Dark/Light Theme**: Manual theme switching with system preference support
- 📍 **Station Management**: Add and configure your favorite bus stops and routes
- 🔔 **Smart Notifications**: Web Push alerts when buses are approaching
- 💾 **Offline Storage**: Your settings and favorite stops are saved locally
- 🔄 **Auto-refresh**: Automatic data updates using TanStack Query
- 📲 **PWA Support**: Install as a mobile app with offline caching
- 🚀 **Fast Loading**: Bundled with comprehensive Singapore bus stop and route data

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State Management**: TanStack Query + Local Storage hooks
- **Build Tool**: Vite
- **PWA**: vite-plugin-pwa with Workbox (custom service worker via injectManifest)
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Data Source**: arrivelah2.busrouter.sg API (Singapore LTA)

## Getting Started

### Prerequisites

- Node.js 22+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bus
```

2. Install dependencies:
```bash
pnpm install
```

3. Copy `.env.example` to `.env` and fill in the VAPID keys used for Web Push:
```bash
cp .env.example .env
# edit .env and set VITE_VAPID_PUBLIC_KEY, VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY
```

4. Start the development server:
```bash
pnpm run dev
```

5. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
pnpm run build
```

The built files will be in the `dist` directory.

### Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production  
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

## Usage

### Adding Bus Stations

1. Go to the **Settings** tab
2. Enter a station ID or search by name in the "Add Bus Station" section
3. Click the + button to add the station
4. For each station, add the bus numbers you want to track

### Getting Notifications

- Tap the bell icon (🔔) on any bus card to schedule an alert
- The app uses Web Push via Netlify Functions and the service worker to notify you about approaching buses
- Works on modern browsers including iOS Safari 16.4+

### Theme Switching

- Use the theme toggle in Settings to switch between light and dark modes
- The app respects your system preference by default

### PWA Installation

- Visit the app in a supported browser
- Use "Add to Home Screen" or "Install App" option
- The app will work offline with cached bus stop data

## Data Sources

- **Real-time Bus Arrivals**: [arrivelah2.busrouter.sg](https://arrivelah2.busrouter.sg) (Singapore LTA DataMall)
- **Bus Stop Data**: Comprehensive Singapore bus stop database (bundled)
- **Bus Route Data**: Complete Singapore bus service information (bundled)

## Architecture

The app uses a modern React architecture with:
- Component-based UI using shadcn/ui
- TanStack Query for server state management
- Custom hooks for local storage persistence
- PWA with service worker for offline functionality
- TypeScript for type safety

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Icons by [Lucide](https://lucide.dev/)
- Bus data from Singapore's Land Transport Authority
- API provided by [arrivelah2.busrouter.sg](https://arrivelah2.busrouter.sg)
- Made with ❤️ for Singapore commuters
