import edinburgh from "../assets/edinburgh.jpg";
import project from "../assets/project.png";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="container py-5 bg-secondary">
      <h1 className="text-center mb-4">About Me</h1>

      <div className="row align-items-center mb-5">
        <div className="col-md-4 text-center">
          <img
            src={project}
            alt="Project illustration"
            className="img-fluid rounded img-size"
          />
        </div>
        <div className="col-md-8">
          <p>
            My name is Serena, and I am studying to become a web developer. This
            is one of my first projects, developed using TypeScript, React with
            Vite, Bootstrap, the OpenWeather API, and RapidAPI. I also used PWA
            technologies to ensure you can download the app on your phone and
            use it offline. You can check out my{" "}
            <a
              href="https://portfolio-one-nu-17.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none fw-bold text-black"
            >
              portfolio
            </a>
            .
          </p>
        </div>
      </div>

      <div className="row align-items-center mb-5">
        {" "}
        <div className="col-md-8 order-md-1">
          <p>
            I have recently moved to Edinburgh, where the weather is very
            unpredictable. While I look for a job, I am enjoying this great city
            and its stunning surroundings.
          </p>
        </div>
        <div className="col-md-4 text-center order-md-2">
          <img
            src={edinburgh}
            alt="Edinburgh city"
            className="img-fluid rounded img-size"
          />
        </div>
      </div>
      <div className="d-flex align-content-start">
        {" "}
        <button
          className="btn btn-outline-secondary bg-dark text-white"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default About;
