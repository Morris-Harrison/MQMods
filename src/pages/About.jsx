import { Link } from "react-router-dom";
import { useEffect } from "react";
import "./About.css";

export default function About() {
  useEffect(() => {
    // Disable scroll on About page only
    document.body.style.overflow = "hidden";

    // Restore scroll when leaving About page
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <div
      className="about-wrapper"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          padding: "20px",
          backgroundColor: "transparent",
          zIndex: 100,
          fontSize: "1.2rem",
        }}
      >
        <Link to="/" style={{ color: "#ffffff", textDecoration: "none" }}>
          home
        </Link>
        <Link to="/about" style={{ color: "#ffffff", textDecoration: "none" }}>
          about
        </Link>
        <Link
          to="/gallery"
          style={{ color: "#ffffff", textDecoration: "none" }}
        >
          gallery
        </Link>
        <Link
          to="/warranty"
          style={{ color: "#ffffff", textDecoration: "none" }}
        >
          warranty
        </Link>
      </nav>
      <video
        autoPlay
        loop
        muted
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(8px)",
        }}
      >
        <source src="/n0ne.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          pointerEvents: "none",
        }}
      />

      {/* Text Container */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#000000",
          borderRadius: "12px",
          padding: "40px",
          maxWidth: "800px",
          width: "90%",
          zIndex: 10,
          color: "#ffffff",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginTop: 0, marginBottom: "20px" }}>
          About MQMods
        </h1>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
          Soldering Professionaly for 5 Years, MQ is the engineer behind the
          controllers of n0ne, Matteo, Kirbykaze, and other players in the
          Ontario Super Smash Bros. scene.
        </p>

        <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
          Play as your best self; <a href="/">create your own controller.</a>
        </p>
      </div>
    </div>
  );
}
