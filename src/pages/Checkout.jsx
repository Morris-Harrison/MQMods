import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Checkout.css";

const STRIPE_SURCHARGE_RATE = 0.07;

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    additionalContact: "",
    email: "",
    rumble: "",
  });

  // Calculate effective price for a mod
  function calculateEffectivePrice(category, mod, currentCart) {
    const tournamentMode = localStorage.getItem("tournamentMode") === "true";
    const oemMode = localStorage.getItem("oemMode") === "true";

    let price = tournamentMode ? mod.tournament : mod.standard;

    if (category === "Grey Stick") {
      if (
        mod.id === "wavedash_notches" &&
        currentCart["Grey Stick"] &&
        currentCart["Grey Stick"].some((m) => m.id === "firefox_notches")
      ) {
        price = 0;
      }
      if (mod.id === "oem_notches") {
        const notchIDs = [
          "wavedash_notches",
          "bottom_notch",
          "firefox_notches",
        ];
        const selectedNotches = currentCart["Grey Stick"]
          ? currentCart["Grey Stick"].filter((m) => notchIDs.includes(m.id))
          : [];
        if (
          selectedNotches.length === 1 &&
          (selectedNotches[0].id === "wavedash_notches" ||
            selectedNotches[0].id === "bottom_notch") &&
          !selectedNotches.some((m) => m.id === "firefox_notches")
        ) {
          price = 15;
        } else {
          price = 30;
        }
      }
    }

    return price;
  }

  // Update cart with effective prices
  function updateCartEffectivePrices(currentCart) {
    const updatedCart = { ...currentCart };
    for (const category in updatedCart) {
      if (!Array.isArray(updatedCart[category])) continue;
      updatedCart[category].forEach((mod) => {
        let effective = calculateEffectivePrice(category, mod, updatedCart);
        mod.effectivePrice = effective;
        mod.standard = effective;
        mod.tournament = effective;
      });
    }
    return updatedCart;
  }

  // Calculate cart total
  function calculateCartTotal(currentCart) {
    let total = 0;
    for (let category in currentCart) {
      if (!Array.isArray(currentCart[category])) continue;
      currentCart[category].forEach((mod) => {
        total += calculateEffectivePrice(category, mod, currentCart);
      });
    }
    return total;
  }

  // Initialize cart from localStorage
  useEffect(() => {
    localStorage.setItem("tournamentMode", "true");
    let loadedCart = JSON.parse(localStorage.getItem("cart") || "{}");
    loadedCart = updateCartEffectivePrices(loadedCart);
    setCart(loadedCart);
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all required fields are filled
    if (!formData.name.trim() || !formData.email.trim() || !formData.rumble.trim()) {
      alert("Please fill out all required fields.");
      return;
    }
    
    // Determine service type
    const oemMode = localStorage.getItem("oemMode") === "true";
    const motherboardMode = localStorage.getItem("motherboardMode") === "true";
    let serviceType = "Phob";
    
    if (oemMode && !motherboardMode) {
      serviceType = "OEM";
    } else if (motherboardMode) {
      serviceType = "OEM to Phob Send In";
    }
    
    // Show success popup
    alert("Order submitted successfully! We will contact you soon. Please proceed with payment.");
  };

  // Handle Stripe payment
  const handleStripePayment = async () => {
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("API Error Response:", text);
        alert(`Error: ${text}`);
        return;
      }

      const data = await response.json();
      console.log("Session created:", data);
      if (data.sessionUrl) {
        // Redirect to Stripe checkout
        window.location.href = data.sessionUrl;
      } else {
        alert("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  // Render cart items
  const renderCartItems = () => {
    if (!cart || Object.keys(cart).length === 0) {
      return <p>No items in your cart.</p>;
    }

    let total = 0;
    const rows = [];

    for (let category in cart) {
      if (!Array.isArray(cart[category])) continue;
      const items = cart[category];

      items.forEach((item, idx) => {
        const effectivePrice =
          item.effectivePrice !== undefined
            ? item.effectivePrice
            : calculateEffectivePrice(category, item, cart);
        total += effectivePrice;

        rows.push(
          <tr key={`${category}-${idx}`}>
            {idx === 0 && (
              <td rowSpan={items.length}>
                <strong>{category}</strong>
              </td>
            )}
            <td>{item.name}</td>
            <td>${effectivePrice.toFixed(2)}</td>
          </tr>
        );
      });
    }

    const fee = total * STRIPE_SURCHARGE_RATE;
    const grandTotal = total + fee;

    return (
      <>
        <table className="cart-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Mod Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
        <div className="totals">
          <div className="total">Subtotal: ${total.toFixed(2)}</div>
          <div className="total">Stripe fee (7%): ${fee.toFixed(2)}</div>
          <div className="total total-grand">
            <strong>Grand total (CAD): ${grandTotal.toFixed(2)}</strong>
          </div>
        </div>
      </>
    );
  };

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

      <img
        src="/img/mqmods.png"
        alt="mqmods"
        id="mqtext"
        style={{
          height: "auto",
          width: "110%",
          marginLeft: "-75px",
          display: "block",
        }}
      />

      {/* ORDER SUMMARY SECTION */}
      <section className="order-summary">
        <h2>Your Order</h2>
        <div id="orderDetails">{renderCartItems()}</div>
      </section>

      {/* CONTACT / PAYMENT OPTIONS SECTION */}
      <section className="option-section">
        <h3>Contact & Shipping Info</h3>
        <form
          id="checkoutForm"
          className="contact-form"
          onSubmit={handleFormSubmit}
        >
          <label htmlFor="name">Tag / Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          ></textarea>

          <label htmlFor="additionalContact">
            Additional Contact (Discord, Twitter, etc.):
          </label>
          <input
            type="text"
            id="additionalContact"
            name="additionalContact"
            value={formData.additionalContact}
            onChange={handleInputChange}
          />

          <label htmlFor="email">Email (Required):</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="rumble">Do you want rumble?!? (Required):</label>
          <input
            type="text"
            id="rumble"
            name="rumble"
            value={formData.rumble}
            onChange={handleInputChange}
            required
          />

          <button type="submit">Submit Order</button>
        </form>
      </section>

      {/* STRIPE PAYMENT SECTION */}
      <div className="option-section" id="option-stripe">
        <h3>Pay with Stripe</h3>
        <p>
          This option uses Stripe to process your payment (credit card, Google
          Pay, Apple Pay, etc.) with tax applied at 13%.
        </p>
        <div id="payment-element"></div>
        <button
          id="submit-payment"
          className="stripe-button"
          onClick={handleStripePayment}
        >
          Submit Payment
        </button>
        <div id="payment-message"></div>
      </div>

      <script src="https://js.stripe.com/v3/"></script>

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
