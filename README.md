# Weather App

A responsive React and TypeScript weather app built with Vite.

## Features

- City search powered by GeoDB Cities
- Current conditions and a five-day OpenWeather forecast
- Weather data displayed in the selected city's local timezone
- Browser geolocation
- Favorite cities persisted across sessions
- Installable PWA with cached app assets and recently viewed weather
- Contact form powered by Formspree

## Local setup

1. Install dependencies:

<<<<<<< HEAD
   ```bash
   npm install
   ```

2. Create `.env` from `.env.example` and add the API keys:

   ```dotenv
   RAPIDAPI_KEY=your_rapidapi_key
   WEATHER_API_KEY=your_openweather_key
   ```

   Existing `VITE_RAPIDAPI_KEY` and `VITE_WEATHER_API_KEY` names are accepted
   locally for backwards compatibility, but the keys are never exposed to the
   browser bundle.

3. Start the development server:

   ```bash
   npm run dev
   ```

## Commands

```bash
npm run lint
npm test
npm run build
npm run preview
```

## Deployment

The repository includes Vercel serverless functions under `api/` and a
`vercel.json` SPA fallback. Configure these environment variables in Vercel:

- `RAPIDAPI_KEY`
- `WEATHER_API_KEY`

Do not prefix deployment secrets with `VITE_`; Vite-prefixed variables are
public client-side values.

For another hosting provider, deploy equivalent same-origin endpoints for
`GET /api/cities` and `GET /api/weather`.
=======
  _____________________________
Demo:

https://weather-app-two-omega-52.vercel.app/

