async function initializePaymentComplete() {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');

  const detailsDiv = document.getElementById('session-details');

  if (!sessionId) {
    detailsDiv.innerText = "No session ID found.";
    return;
  }

  // OPTIONAL: If you have a backend endpoint to fetch session details, use it here.
  try {
    const response = await fetch(`/api/session-status?session_id=${sessionId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch session details.");
    }
    const session = await response.json();

    // Display session details
    detailsDiv.innerHTML = `
      <p><strong>Session ID:</strong> ${session.id}</p>
      <p><strong>Payment Status:</strong> ${session.payment_status}</p>
      <p><strong>Total Amount:</strong> $${(session.amount_total / 100).toFixed(2)}</p>
      <p><strong>Customer Email:</strong> ${session.customer_email || "N/A"}</p>
    `;
  } catch (error) {
    console.error("Error fetching session details:", error);
    detailsDiv.innerText = `Payment complete. Your session ID: ${sessionId}`;
  }
}

initializePaymentComplete();
