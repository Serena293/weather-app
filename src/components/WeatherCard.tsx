import type { WeatherCardProps } from "../types";
import {
  formatCityHour,
  formatWindSpeed,
  getDayName,
  getForecastDisplay,
} from "../utils/weather";

const iconModules = import.meta.glob<string>("../assets/icons/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});

function getLocalIcon(iconCode: string): string {
  return (
    iconModules[`../assets/icons/${iconCode}.png`] ||
    iconModules["../assets/icons/unknown.png"] ||
    iconModules["../assets/icons/01d.png"]
  );
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  data,
  forecast,
  onRemove,
  onToggleFavorite,
  isFavorite,
}) => {
  if (!data || !forecast) return null;

  const { todayForecast, dailyForecasts } = getForecastDisplay(forecast);
  const headingId = `weather-${data.coord.lat}-${data.coord.lon}`;

  return (
    <section
      className="h-100 px-2 px-md-0"
      aria-labelledby={headingId}
    >
      <div className="weather-card my-3 p-3 bg-primary shadow rounded h-100 d-flex flex-column">
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            onClick={onToggleFavorite}
            className="btn btn-primary fs-4 p-1"
            aria-label={
              isFavorite ? `Remove ${data.name} from favorites` : `Add ${data.name} to favorites`
            }
            aria-pressed={Boolean(isFavorite)}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span>
          </button>
          {onRemove && (
            <button
              type="button"
              className="btn btn-close p-1"
              aria-label={`Remove ${data.name} weather card`}
              onClick={onRemove}
            />
          )}
        </div>

        <div className="flex-grow-1">
          <div className="mb-3">
            <h2 id={headingId} className="text-center fs-4 mb-1">
              {data.name}
            </h2>
            <p className="text-center text-dark mb-0 text-capitalize">
              {data.weather[0]?.description}
            </p>
          </div>

          <div className="mb-3 text-center">
            <img
              src={getLocalIcon(data.weather[0]?.icon || "unknown")}
              alt={data.weather[0]?.description || "Current weather"}
              className="img-fluid"
              width={80}
              height={80}
            />
            <p className="fs-3 fw-semibold mb-0">
              {Math.round(data.main.temp)} °C
            </p>
          </div>

          <div className="mb-4">
            <p className="mx-2 mb-2">Today's forecast:</p>
            {todayForecast.length > 0 ? (
              <div className="d-flex overflow-auto px-2 gap-3 pb-2">
                {todayForecast.map((item) => (
                  <div key={item.dt} className="text-center flex-shrink-0 px-2">
                    <p className="my-0 small fw-semibold">
                      {formatCityHour(item.dt, forecast.city.timezone)}
                    </p>
                    <img
                      src={getLocalIcon(item.weather[0]?.icon || "unknown")}
                      alt={item.weather[0]?.description || "Hourly forecast"}
                      width={45}
                      height={45}
                      className="img-fluid my-1"
                    />
                    <p className="mb-0 small">
                      {Math.round(item.main.temp)} °C
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="small text-center mb-0">
                No more forecasts are available for today.
              </p>
            )}
          </div>

          <div className="mb-3">
            <div className="row row-cols-2 g-2 text-center">
              {[
                { label: "Wind", value: formatWindSpeed(data.wind.speed) },
                { label: "Pressure", value: `${data.main.pressure} hPa` },
                { label: "Humidity", value: `${data.main.humidity} %` },
                {
                  label: "Feels like",
                  value: `${Math.round(data.main.feels_like)} °C`,
                },
              ].map((item) => (
                <div className="col" key={item.label}>
                  <p className="mb-0 small fw-medium">{item.label}</p>
                  <p className="mb-0 small">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="ms-2 mb-2 small fw-semibold">Next days:</p>
            <div className="d-flex overflow-auto px-2 gap-4 text-center pb-2">
              {dailyForecasts.map((item) => (
                <div key={item.date} className="flex-shrink-0 px-1">
                  <p className="mb-1 small">{getDayName(item.date)}</p>
                  <img
                    src={getLocalIcon(item.icon)}
                    alt={item.description}
                    width={40}
                    height={40}
                    className="img-fluid"
                  />
                  <p className="mb-0 small">{item.temp} °C</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeatherCard;
