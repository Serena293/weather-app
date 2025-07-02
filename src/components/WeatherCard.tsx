import type { ForecastData, WeatherCardProps } from "../types";

const WeatherCard: React.FC<WeatherCardProps> = ({
  data,
  forecast,
  onRemove,
  onToggleFavorite,
  isFavorite,
}) => {
  if (!data) return null;
  if (!forecast) return <p className="text-center mt-5">Loading forecast...</p>;

  // Funzione per ottenere il percorso dell'icona locale
  const getLocalIcon = (iconCode: string) => {
    try {
      return new URL(`../assets/icons/${iconCode}.png`, import.meta.url).href;
    } catch (e) {
      console.error(`Icon not found: ${iconCode}.png`);
      return new URL(`../assets/icons/01d.png`, import.meta.url).href; // Icona di fallback
    }
  };

  // Filtra le previsioni per oggi
  const now = new Date();
  const todayForecast = forecast.list.filter((item) => {
    const itemDate = new Date(item.dt_txt);
    return itemDate.getDate() === now.getDate();
  });

  // Previsioni giornaliere (un dato per giorno)
  const dailyForecastMap = new Map<string, ForecastData["list"][0]>();
  const currentHour = now.getHours();

  forecast.list.forEach((item) => {
    const itemDate = new Date(item.dt_txt);
    // Prendiamo le previsioni delle 12:00 o la prima disponibile dopo le 12:00
    if (itemDate.getHours() >= 12 || (itemDate.getDate() !== now.getDate() && itemDate.getHours() > 0)) {
      const dateKey = itemDate.toISOString().split('T')[0];
      if (!dailyForecastMap.has(dateKey)) {
        dailyForecastMap.set(dateKey, item);
      }
    }
  });

  // Otteniamo i prossimi 5 giorni (incluso oggi se siamo prima delle 12:00)
  const dailyForecasts = Array.from(dailyForecastMap.entries())
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .slice(0, 5)
    .map(([date, item]) => ({
      date,
      icon: item.weather[0].icon,
      temp: Math.round(item.main.temp)
    }));

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <section className="h-100">
      <div className="my-3 p-3 bg-primary shadow rounded position-relative h-100 d-flex flex-column">
        {/* Header con pulsanti */}
        <div className="d-flex justify-content-end gap-2"> 
          <button onClick={onToggleFavorite} className="btn btn-primary fs-4 p-1">
            {isFavorite ? "⭐" : "☆"}
          </button>
          {onRemove && (
            <button
              className="btn btn-close p-1"
              aria-label="Remove card"
              onClick={onRemove}
            ></button>
          )}
        </div>

        {/* Contenuto principale */}
        <div className="flex-grow-1">
          <div className="mb-3">
            <h1 className="text-center fs-4 mb-1">{data.name}</h1>
            <p className="text-center text-dark mb-0">
              {data.weather[0].description}
            </p>
          </div>

          <div className="mb-3">
            <p className="text-center mb-2">
              <img
                src={getLocalIcon(data.weather[0].icon)}
                alt={data.weather[0].description}
                className="img-fluid"
                style={{ maxWidth: "80px" }}
              />
            </p>
            <h2 className="text-center fs-3 mb-0">
              {Math.round(data.main.temp)} °C
            </h2>
          </div>

          {/* Forecast oggi */}
          <div className="mb-3">
            <p className="mx-2 mb-2">Today's forecast:</p>
            <div className="d-flex overflow-auto px-2 gap-2 scroll-container pb-2">
              {todayForecast.map((item) => (
                <div key={item.dt} className="text-center flex-shrink-0">
                  <p className="my-0 small">{new Date(item.dt_txt).getHours()}:00</p>
                  <img
                    src={getLocalIcon(item.weather[0].icon)}
                    alt={item.weather[0].description}
                    style={{ width: "40px", height: "40px" }}
                    className="img-fluid"
                  />
                  <p className="mb-0 small">{Math.round(item.main.temp)} °C</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dati meteo */}
          <div className="mb-3">
            <div className="row row-cols-2 g-2 text-center">
              {[
                { label: "Wind", value: `${data.wind.speed} km/h` },
                { label: "Pressure", value: `${data.main.pressure} hPa` },
                { label: "Humidity", value: `${data.main.humidity} %` },
                { label: "Feels like", value: `${Math.round(data.main.feels_like)} °C` },
              ].map((item, index) => (
                <div className="col" key={index}>
                  <p className="mb-0 small fw-medium">{item.label}</p>
                  <p className="mb-0 small">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Previsioni 5 giorni */}
          <div>
            <p className="ms-2 mb-2 small fw-semibold">Next days:</p>
            <div className="d-flex overflow-auto px-2 gap-2 text-center scroll-container pb-2">
              {dailyForecasts.map((item) => {
                const forecastDate = new Date(item.date);
                const isToday = forecastDate.getDate() === now.getDate();
                
                return (
                  <div 
                    key={item.date} 
                    className={`flex-shrink-0 mx-3 px-1 ${isToday ? 'border border-primary rounded p-1' : ''}`}
                  >
                    <p className="mb-1 small">
                      {isToday ? 'Today' : getDayName(item.date)}
                    </p>
                    <img
                      src={getLocalIcon(item.icon)}
                      alt=""
                      style={{ width: "40px", height: "40px" }}
                      className="img-fluid"
                    />
                    <p className="mb-0 small">{item.temp} °C</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeatherCard;