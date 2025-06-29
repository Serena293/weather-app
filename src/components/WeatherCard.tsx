import type { WeatherData, ForecastData } from "../types";

interface WeatherCardProps {
  data: WeatherData | null;
  forecast: ForecastData | null;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, forecast }) => {
  if (!data) return null;
  if (!forecast) return <p className="text-center mt-5">Loading forecast...</p>;

  const handleAddToFavorites = () => {
    console.log("City added to favorites!");
  };

  // Filtra le previsioni per oggi
  const today = new Date().getDate();
  const todayForecast = forecast.list.filter((item) => {
    const itemDate = new Date(item.dt_txt);
    return itemDate.getDate() === today;
  });

  // Estrai un'icona per ogni giorno futuro
  const dailyForecastMap = new Map<string, ForecastData["list"][0]>();
  forecast.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0]; // "2025-06-28"
    if (!dailyForecastMap.has(date)) {
      dailyForecastMap.set(date, item);
    }
  });
  const dailyForecasts = Array.from(dailyForecastMap.entries())
    .slice(1, 6) // salta oggi, mostra 5 giorni
    .map(([date, item]) => ({
      date,
      icon: item.weather[0].icon,
    }));

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  return (
    <section className="container">
      <div className="col-lg-3 col-md-6 my-5 p-4 bg-light shadow rounded position-relative">
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-outline-warning border-0 my-0 py-0"
            onClick={handleAddToFavorites}
            aria-label="Add to favorites"
          >
            <i className="bi bi-star fs-5"></i>
          </button>
        </div>

        <div className="mb-4">
          <h1 className="text-center fs-2 mb-1">{data.name}</h1>
          <p className="text-center text-secondary mb-0">
            {data.weather[0].description}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-center mb-2">
            <img
              src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt={data.weather[0].description}
            />
          </p>
          <h2 className="text-center fs-1 mb-0">
            {Math.round(data.main.temp)} °C
          </h2>
        </div>

        <div>
          <p className="mx-3">Today's forecast:</p>
          <div className="d-flex flex-row overflow-auto px-3 gap-3 scroll-container">
            {todayForecast.map((item) => (
              <div key={item.dt} className="text-center">
                <p className="my-0">
                  {new Date(item.dt_txt).getHours()}:00
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                  alt={item.weather[0].description}
                  style={{ width: "40px", height: "40px" }}
                />
                <p className="mb-0">{Math.round(item.main.temp)} °C</p>
              </div>
            ))}
          </div>
        </div>

        <div className="container text-center my-4">
          <div className="row g-3">
            <div className="col-6 col-md-3">
              <p className="mb-1 fw-medium">Wind</p>
              <p className="mb-0">{data.wind.speed} km/h</p>
            </div>
            <div className="col-6 col-md-3">
              <p className="mb-1 fw-medium">Pressure</p>
              <p className="mb-0">{data.main.pressure} hPa</p>
            </div>
            <div className="col-6 col-md-3">
              <p className="mb-1 fw-medium">Humidity</p>
              <p className="mb-0">{data.main.humidity} %</p>
            </div>
            <div className="col-6 col-md-3">
              <p className="mb-1 fw-medium">Feels like</p>
              <p className="mb-0">{Math.round(data.main.feels_like)} °C</p>
            </div>
          </div>
        </div>

        <div>
          <p className="ms-3 fw-semibold">Next five days forecast:</p>
          <div className="d-flex flex-row overflow-auto px-3 gap-3 text-center scroll-container">
            {dailyForecasts.map((item) => (
              <div key={item.date} className="flex-shrink-0 mb-3">
                <p className="mb-1">{getDayName(item.date)}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                  alt=""
                  style={{ width: "40px", height: "40px" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeatherCard;
