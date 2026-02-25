import { Link } from "react-router-dom";
import "./Gallery.css";

const images = [
  { name: "example1.jpg", title: "Example 1", size: "large" },
  { name: "example2.jpg", title: "Example 2", size: "medium" },
  { name: "notches.jpg", title: "Notches", size: "medium" },
  { name: "bald+ergo.jpg", title: "Bald + Ergo", size: "medium" },
  { name: "ergo.jpg", title: "Ergo", size: "medium" },
  { name: "customer1.jpg", title: "Customer 1", size: "wide" },
  { name: "vend1.jpg", title: "Vend 1", size: "wide" },
];

export default function Gallery() {
  return (
    <div className="gallery-wrapper">
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

      {/* Nav */}
      <nav className="gallery-nav" style={{ position: "static" }}>
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
      <div className="gallery-container">
        <h1
          style={{
            textAlign: "center",
            marginBottom: "40px",
            color: "#ffffffff",
            marginTop: 0,
          }}
        >
          Gallery
        </h1>

        {/* Description Section */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
            color: "#cccccc",
            maxWidth: "600px",
            margin: "0 auto 40px auto",
          }}
        >
          <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
            With over 2 years of controller modding experience, I love both
            vending and modding—and I can do just about everything. A lot of
            this I worked on with my best friend, this wouldn't be possible
            without them :) Here are some pictures of our work and finally some
            happy customers!
          </p>
        </div>

        <div className="bento-grid">
          {images.map((img) => (
            <div key={img.name} className={`bento-item ${img.size}`}>
              <img
                src={`/img/${img.name}`}
                alt={img.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            marginTop: "60px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "30px",
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
          </div>
          <p style={{ color: "#999", fontSize: "0.9rem", margin: 0 }}>
            © 2025 MQMods
          </p>
        </footer>
      </div>
    </div>
  );
}
