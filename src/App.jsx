import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Warranty from "./pages/Warranty";
import Checkout from "./pages/Checkout";
import PaymentComplete from "./pages/PaymentComplete";
import Cancel from "./pages/Cancel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/warranty" element={<Warranty />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-complete" element={<PaymentComplete />} />
        <Route path="/cancel" element={<Cancel />} />
      </Routes>
    </Router>
  );
}

export default App;
