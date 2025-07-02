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

  // Filtra le previsioni per oggi
  const today = new Date().getDate();
  const todayForecast = forecast.list.filter((item) => {
    const itemDate = new Date(item.dt_txt);
    return itemDate.getDate() === today;
  });

  const dailyForecastMap = new Map<string, ForecastData["list"][0]>();
  forecast.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!dailyForecastMap.has(date)) {
      dailyForecastMap.set(date, item);
    }
  });
  const dailyForecasts = Array.from(dailyForecastMap.entries())
    .slice(1, 6)
    .map(([date, item]) => ({
      date,
      icon: item.weather[0].icon,
    }));

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  return (
 <section className="h-100"> {/* Aggiunto h-100 per altezza piena */}
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
    <div className="flex-grow-1"> {/* Permette alla card di espandersi */}
      <div className="mb-3">
        <h1 className="text-center fs-4 mb-1">{data.name}</h1>
        <p className="text-center text-secondary mb-0">
          {data.weather[0].description}
        </p>
      </div>

      <div className="mb-3">
        <p className="text-center mb-2">
          <img
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
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
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
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
        <p className="ms-2 mb-2 small fw-semibold">Next five days:</p>
        <div className="d-flex overflow-auto px-2 gap-2 text-center scroll-container pb-2">
          {dailyForecasts.map((item) => (
            <div key={item.date} className="flex-shrink-0">
              <p className="mb-1 small">{getDayName(item.date)}</p>
              <img
                src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                alt=""
                style={{ width: "40px", height: "40px" }}
                className="img-fluid"
              />
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
