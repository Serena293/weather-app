import React from "react";
import edinburghImg from "../assets/edinburgh.jpg";
import projectImg from "../assets/project.png";

const About = () => {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">About Me</h1>

      <div className="row align-items-center mb-5">
        <div className="col-md-4 text-center">
          <img
            src={projectImg}
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
            src={edinburghImg}
            alt="Edinburgh city"
            className="img-fluid rounded img-size"
          />
        </div>
      </div>

      <div className="row align-items-center">
        <div className="col-md-4 text-center">
          <img
            src="https://via.placeholder.com/150"
            alt="Cooking passion"
            className="img-fluid rounded img-size"
          />
        </div>
        <div className="col-md-8">
          <p>
            I have many passions, and cooking is definitely in my top three. I
            will soon start working on my own cooking website so that I can
            share my passion and hopefully collect useful feedback.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
