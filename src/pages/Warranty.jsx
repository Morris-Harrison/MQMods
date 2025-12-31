import { Link } from "react-router-dom";
import { useEffect } from "react";
import "./Warranty.css";

export default function Warranty() {
  useEffect(() => {
    // Disable scroll on Warranty page only
    document.body.style.overflow = "hidden";

    // Restore scroll when leaving Warranty page
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <div
      className="warranty-wrapper"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Logo HUD */}
      <Link
        to="/"
        style={{
          position: "fixed",
          top: "20px",
          left: "100px",
          zIndex: 2000,
          textDecoration: "none",
        }}
      >
        <img src="/img/Logo.png" alt="Logo" style={{ height: "160px", width: "auto" }} />
      </Link>

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
      {/* Background Image */}
      <img
        src="/img/warranty.jpg"
        alt="warranty background"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(8px)",
        }}
      />
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
          Warranty
        </h1>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
          I’m pretty chill with most of this stuff, so just email or dm me if
          you have any issue and I’ll try to work it out with you. I have a few
          rules just to CYA and because shit happens.
          <br></br>
          <br></br>I ship with signature on delivery. If you ship to me for
          warranty or mods and the package gets lost, I won’t assume
          responsibility.
          <br></br>
          <br></br>6 months warranty for the most part. Things have regular wear
          and tear and some of them ain’t my fault. Stickbox, pots, and gates
          will wear. Paracords are easy to break on your own so I only offer 3
          months warranty on those. I fix in person or shipped to me.
          <br></br>
          <br></br>
          No refunds. Warranty or replacement only. Commissions are pricey and
          it’s hard to find another buyer in a not so big market. And you get a
          good controller from me always, no need to refund.
          <br></br>
          <br></br>
          Orders take 1-2 months after placement. Depending on complexity (some
          of y’all get everything) can take at most 3 months. I have an option
          to skip the queue for $$. Shipping is on top of the base cost.
        </p>
      </div>

      {/* Footer Socials */}
      <footer
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          zIndex: 10,
        }}
      >
        <a
          href="https://discord.com/users/139913959087013888"
          target="_blank"
          rel="noopener noreferrer"
          style={{ opacity: 0.7, transition: "opacity 0.3s ease" }}
          onMouseEnter={(e) => (e.target.style.opacity = 1)}
          onMouseLeave={(e) => (e.target.style.opacity = 0.7)}
        >
          <img
            src="/img/discord.png"
            alt="Discord"
            style={{ height: "48px", width: "48px" }}
          />
        </a>
        <a
          href="https://x.com/mqmods"
          target="_blank"
          rel="noopener noreferrer"
          style={{ opacity: 0.7, transition: "opacity 0.3s ease" }}
          onMouseEnter={(e) => (e.target.style.opacity = 1)}
          onMouseLeave={(e) => (e.target.style.opacity = 0.7)}
        >
          <img
            src="/img/x.png"
            alt="Twitter"
            style={{ height: "48px", width: "48px" }}
          />
        </a>
        <a
          href="mailto:mqphobgcc@gmail.com"
          style={{ opacity: 0.7, transition: "opacity 0.3s ease" }}
          onMouseEnter={(e) => (e.target.style.opacity = 1)}
          onMouseLeave={(e) => (e.target.style.opacity = 0.7)}
        >
          <img
            src="/img/mail.png"
            alt="Email"
            style={{ height: "48px", width: "48px" }}
          />
        </a>
      </footer>{" "}
    </div>
  );
}
