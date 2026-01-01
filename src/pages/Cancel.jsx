import { Link } from 'react-router-dom';
import './Cancel.css';

export default function Cancel() {
  return (
    <>
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
        <img
          src="/img/Logo.png"
          alt="Logo"
          style={{ height: "160px", width: "auto" }}
        />
      </Link>

      <nav
        style={{
          position: "static",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
        <Link to="/gallery" style={{ color: "#ffffff", textDecoration: "none" }}>
          gallery
        </Link>
        <Link to="/warranty" style={{ color: "#ffffff", textDecoration: "none" }}>
          warranty
        </Link>
      </nav>

      <img
        src="/img/mqmods.png"
        alt="mqmods"
        id="mqtext"
        style={{ height: "auto", width: "120%", marginLeft: "-75px", display: "block" }}
      />

      <section className="cancel-section">
        <h2>Payment Canceled</h2>
        <p>Your payment has been canceled. If this was a mistake, please try again or contact us.</p>
        <Link to="/checkout" className="return-button">
          Return to Checkout
        </Link>
      </section>

      <footer
        style={{
          marginTop: "40px",
          textAlign: "center",
          fontSize: "40px",
          color: "#ffffffff",
          paddingBottom: "20px",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ marginBottom: "16px" }}>2025 MQMods</div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "32px",
            marginTop: "16px",
            alignItems: "center",
          }}
        >
          <a
            href="https://discord.com/users/139913959087013888"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              transition: "opacity 0.3s",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
            title="Discord"
          >
            <img
              src="/img/discord.png"
              alt="Discord"
              style={{ height: "48px", width: "48px", display: "block" }}
            />
          </a>
          <a
            href="https://x.com/mqmods"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              transition: "opacity 0.3s",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
            title="Twitter"
          >
            <img
              src="/img/x.png"
              alt="Twitter"
              style={{ height: "48px", width: "48px", display: "block" }}
            />
          </a>
          <a
            href="mailto:mqphobgcc@gmail.com"
            style={{
              transition: "opacity 0.3s",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
            title="Email"
          >
            <img
              src="/img/mail.png"
              alt="Email"
              style={{ height: "48px", width: "48px", display: "block" }}
            />
          </a>
        </div>
      </footer>
    </>
  );
}
