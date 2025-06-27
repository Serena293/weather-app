const WeatherCard = () => {
  return (
    <section className="container">
    <div className="col-lg-3 col-md-6 my-5 p-4 shadow rounded bg-light">
      <div className="mb-4">
        <h1 className="text-center fs-2 mb-1">Portobello</h1>
        <p className="text-center text-secondary mb-0">
          It never rains in Portobello
        </p>
      </div>

      <div className="mb-4">
        <p className="text-center mb-2">
          <i className="bi bi-brightness-high-fill fs-1 text-warning"></i>
        </p>
        <h2 className="text-center fs-1 mb-0">22 °C</h2>
      </div>

      <div>
        <p className="mx-3">Today's forecast:</p>
        <div className="d-flex flex-row overflow-auto px-3 gap-3 scroll-container">
          <div className="text-center">
            <p className="my-0">14:00</p>
            <i className="bi bi-brightness-high-fill fs-1 text-warning"></i>
          </div>
          <div className="text-center">
            <p className="my-0">15:00</p>
            <i className="bi bi-brightness-high-fill fs-1 text-warning"></i>
          </div>
          <div className="text-center">
            <p className="my-0">16:00</p>
            <i className="bi bi-brightness-high-fill fs-1 text-warning"></i>
          </div>
          <div className="text-center">
            <p className="my-0">17:00</p>
            <i className="bi bi-brightness-high-fill fs-1 text-warning"></i>
          </div>
          <div className="text-center">
            <p className="my-0">18:00</p>
            <i className="bi bi-brightness-high-fill fs-1 text-warning"></i>
          </div>
          <div className="text-center">
            <p className="my-0">19:00</p>
            <i className="bi bi-brightness-high-fill fs-1 text-warning"></i>
          </div>
          <div className="text-center">
            <p className="my-0">20:00</p>
            <i className="bi bi-brightness-high-fill fs-1 text-warning"></i>
          </div>
        </div>
      </div>

      <div className="container text-center my-4">
        <div className="row g-3">
          <div className="col-6 col-md-3">
            <p className="mb-1 fw-medium">Wind</p>
            <p className="mb-0">10 km/h</p>
          </div>
          <div className="col-6 col-md-3">
            <p className="mb-1 fw-medium">UV index</p>
            <p className="mb-0">2</p>
          </div>
          <div className="col-6 col-md-3">
            <p className="mb-1 fw-medium">Chance of rain</p>
            <p className="mb-0">2%</p>
          </div>
          <div className="col-6 col-md-3">
            <p className="mb-1 fw-medium">Feels like</p>
            <p className="mb-0">23 °C</p>
          </div>
        </div>
      </div>

      <div>
        <p className="ms-3 fw-semibold">Next five days forecast:</p>
      <div className="d-flex flex-row overflow-auto px-3 gap-3 text-center scroll-container">
  {["Friday", "Saturday", "Sunday", "Monday", "Tuesday"].map(
    (day, idx) => (
      <div key={idx} className="flex-shrink-0 mb-3">
        <p className="mb-1">{day}</p>
        <i className="bi bi-brightness-high-fill fs-2 text-warning"></i>
      </div>
    )
  )}
</div>

      </div>
    </div>
    </section>
  );
};

export default WeatherCard;
