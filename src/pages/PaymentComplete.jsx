import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './PaymentComplete.css';

export default function PaymentComplete() {
  const [searchParams] = useSearchParams();
  const [sessionDetails, setSessionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setError('No session ID found.');
      setLoading(false);
      return;
    }

    const fetchSessionDetails = async () => {
      try {
        const response = await fetch(`/api/session-status?session_id=${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch session details.');
        }
        const session = await response.json();
        setSessionDetails(session);
      } catch (err) {
        console.error('Error fetching session details:', err);
        setError(`Payment complete. Your session ID: ${sessionId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [searchParams]);

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

      <section className="payment-section">
        <h2>Payment Complete</h2>
        <p>Thank you for your payment! Your order has been processed successfully.</p>
        
        {loading && (
          <div id="session-details">
            <p>Loading order details...</p>
          </div>
        )}

        {error && (
          <div id="session-details">
            <p>{error}</p>
          </div>
        )}

        {sessionDetails && (
          <div id="session-details">
            <p><strong>Session ID:</strong> {sessionDetails.id}</p>
            <p><strong>Payment Status:</strong> {sessionDetails.payment_status}</p>
            <p><strong>Total Amount:</strong> ${(sessionDetails.amount_total / 100).toFixed(2)}</p>
            {sessionDetails.customer_email && (
              <p><strong>Customer Email:</strong> {sessionDetails.customer_email}</p>
            )}
          </div>
        )}

        <Link to="/" style={{ color: "#5a4fcf", textDecoration: "none", fontSize: "1.1rem" }}>
          Return Home
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
