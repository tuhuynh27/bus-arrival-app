# SG Bus Arrival

**A modern PWA for real‑time bus timings in Singapore.**

SG Bus Arrival lets you pin your favourite bus stops and see live arrival times on mobile or desktop. The app sends push alerts and can be installed to your home screen.

For commuters who live near a bus station and want an easy way to plan the trip from home to office and back, SG Bus Arrival cuts out the extra steps of using Google Maps. Pin your usual stops and check timings instantly.

## Features

- **Live data** from [arrivelah2.busrouter.sg](https://arrivelah2.busrouter.sg)
- **Push notifications** when your bus is approaching
- **Add favourites** and choose the services to track
- **Light & dark themes** with automatic system detection
- **Weather forecast** for the next few hours

## Tech Stack

- [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query) for data fetching
- Service worker via [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- Netlify Functions for notifications and settings storage

## Getting Started

### Prerequisites

- Node.js 22+
- [pnpm](https://pnpm.io/) (or npm)

### Installation

```bash
# clone the repo
git clone <repo-url>
cd bus-arrival-app

# install dependencies
pnpm install

# copy environment variables
cp .env.example .env
# edit .env with your VAPID and JWT keys
```

### Development

Start the dev server and open <http://localhost:5173>:

```bash
pnpm run dev
```

### Running Tests

```bash
pnpm test
```

### Production Build

```bash
pnpm run build
```

The static files are written to `dist/`. Deploy to any static host or Netlify (see `netlify.toml`).

## Data Sources

- Real-time bus arrivals from [arrivelah2.busrouter.sg](https://arrivelah2.busrouter.sg) (Singapore LTA DataMall)
- Weather data from [Open-Meteo](https://open-meteo.com)

## Contributing

Bug reports and pull requests are welcome. Please fork the repository and open a PR.

## License

[MIT](LICENSE)

## Acknowledgements

Built with [shadcn/ui](https://ui.shadcn.com/) components and [Lucide](https://lucide.dev/) icons. Made with ❤️ for Singapore commuters.

