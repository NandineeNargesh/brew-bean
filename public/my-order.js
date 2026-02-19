async function loadUserHistory() {
  const container = document.getElementById("orderContainer");

  const dummy = [
    {item:"Cappuccino", amount:200, status:"Delivered"},
    {item:"Espresso", amount:150, status:"Preparing"}
  ];

  dummy.forEach(order => {
    container.innerHTML += `
      <div class="order-card">
        <h3>${order.item}</h3>
        <p>Amount: ₹${order.amount}</p>
        <p>Status: ${order.status}</p>
      </div>
    `;
  });
}

window.onload = loadUserHistory;
