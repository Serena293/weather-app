import type { Connect, Plugin } from "vite";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import {
  ApiServiceError,
  getCities,
  getWeatherBundle,
} from "./server/weather-api";

type LocalApiKeys = {
  rapidApiKey?: string;
  weatherApiKey?: string;
};

function writeJson(
  response: Parameters<Connect.NextHandleFunction>[1],
  status: number,
  payload: unknown
): void {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

function localApiPlugin(keys: LocalApiKeys): Plugin {
  const middleware: Connect.NextHandleFunction = async (
    request,
    response,
    next
  ) => {
    const requestUrl = new URL(
      request.url || "/",
      `http://${request.headers.host || "localhost"}`
    );

    if (!requestUrl.pathname.startsWith("/api/")) {
      next();
      return;
    }

    try {
      if (requestUrl.pathname === "/api/cities") {
        const cities = await getCities(
          requestUrl.searchParams.get("query") || "",
          keys.rapidApiKey
        );
        writeJson(response, 200, cities);
        return;
      }

      if (requestUrl.pathname === "/api/weather") {
        const weather = await getWeatherBundle(
          Number(requestUrl.searchParams.get("lat")),
          Number(requestUrl.searchParams.get("lon")),
          keys.weatherApiKey
        );
        writeJson(response, 200, weather);
        return;
      }

      writeJson(response, 404, { error: "API route not found." });
    } catch (error) {
      const status = error instanceof ApiServiceError ? error.status : 500;
      const message =
        error instanceof ApiServiceError
          ? error.message
          : "The weather service is currently unavailable.";
      writeJson(response, status, { error: message });
    }
  };

  return {
    name: "local-weather-api",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const keys = {
    rapidApiKey: env.RAPIDAPI_KEY || env.VITE_RAPIDAPI_KEY,
    weatherApiKey: env.WEATHER_API_KEY || env.VITE_WEATHER_API_KEY,
  };

  return {
    server: {
      host: true,
    },
    plugins: [
      localApiPlugin(keys),
      react(),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "Weather App",
          short_name: "Weather",
          description: "Current weather and a five-day city forecast",
          start_url: "/",
          display: "standalone",
          background_color: "#e0f4f8",
          theme_color: "#02143c",
          lang: "en",
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
        workbox: {
          globPatterns: [
            "**/*.{js,css,html,ico,png,jpg,jpeg,webp,svg,woff,woff2}",
          ],
          globIgnores: ["**/pwa-*.png"],
          maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
          navigateFallbackDenylist: [/^\/api\//],
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.pathname === "/api/weather",
              handler: "NetworkFirst",
              options: {
                cacheName: "weather-data",
                networkTimeoutSeconds: 4,
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 30 * 60,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: ({ url }) => url.pathname === "/api/cities",
              handler: "NetworkFirst",
              options: {
                cacheName: "city-searches",
                networkTimeoutSeconds: 4,
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 24 * 60 * 60,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),
    ],
  };
});
