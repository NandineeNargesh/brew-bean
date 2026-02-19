/***********************
  CART STORAGE
************************/
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/***********************
  ADD TO CART
************************/
function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(i => i.name === item.name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push(item);
  }

  saveCart(cart);
  updateHeaderCartCount();
  renderCart(); // for sidebar / menu cart
  renderCartPage(); // for cart.html
  renderCheckoutPage(); // for checkout.html
}

/***********************
  HEADER COUNT
************************/
function updateHeaderCartCount() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);

  const title = document.querySelector(".header-cart_title span");
  if (title) title.innerText = `${totalQty} items`;
}

/***********************
  RENDER CART (Sidebar)
************************/
function renderCart() {
  const container = document.querySelector(".header-cart_wrap_container ol");
  if (!container) return;

  const cart = getCart();
  container.innerHTML = "";

  const visibleItems = cart.slice(0, 3); // only show 3 in sidebar

  visibleItems.forEach((item, index) => {
    container.innerHTML += `
      <li class="clearfix">
        <a href="#" class="widget-posts-img">
          <img src="${item.img}" class="respimg" alt="${item.name}">
        </a>
        <div class="widget-posts-descr">
          <a href="#" title="">${item.name}</a>
          <div class="widget-posts-descr_calc clearfix">
            ${item.qty} <span>x</span>
            $${(item.price * item.qty).toFixed(2)}
          </div>
        </div>
        <div class="clear-cart_button" data-index="${index}">
          <i class="fa-solid fa-xmark"></i>
        </div>
      </li>
    `;
  });

  // Show "+ X more" if overflow
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  if (cart.length > 3) {
    container.innerHTML += `<li class="more-items">+ ${cart.length - 3} more items</li>`;
  }

  const subtotalEl = document.querySelector(".header-cart_wrap_total_item span");
  if (subtotalEl) {
    const subtotal = cart.reduce((sum, i) => sum + i.qty * i.price, 0);
    subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
  }
}

/***********************
  CART PAGE (cart.html)
************************/
function renderCartPage() {
  const tbody = document.getElementById("cart-page-items");
  if (!tbody) return;

  const cart = getCart();
  let subtotal = 0;
  tbody.innerHTML = "";

  cart.forEach((item, index) => {
    const itemSubtotal = item.price * item.qty;
    subtotal += itemSubtotal;

    tbody.innerHTML += `
      <tr>
        <td>
          <img src="${item.img}" class="cart-img">
          <strong style="margin-left:10px;">${item.name}</strong>
        </td>
        <td>$${item.price.toFixed(2)}</td>
        <td>
          <button class="qty-btn" data-action="dec" data-index="${index}">-</button>
          <span style="margin:0 10px;">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-index="${index}">+</button>
        </td>
        <td>$${itemSubtotal.toFixed(2)}</td>
        <td>
          <i class="fa-solid fa-xmark remove-item"
             data-index="${index}"
             style="cursor:pointer;color:#d5a353;"></i>
        </td>
      </tr>
    `;
  });

  document.getElementById("summary-subtotal").innerText = `$${subtotal.toFixed(2)}`;
  document.getElementById("summary-total").innerText = `$${subtotal.toFixed(2)}`;
}

/***********************
  CHECKOUT PAGE (checkout.html)
************************/
function renderCheckoutPage() {
  const container = document.getElementById("order-items-list");
  const totalEl = document.getElementById("checkout-total");
  if (!container || !totalEl) return;

  const cart = getCart();
  let subtotal = 0;
  container.innerHTML = "";

  cart.forEach(item => {
    const itemSubtotal = item.price * item.qty;
    subtotal += itemSubtotal;

    container.innerHTML += `
      <div class="checkout-item" style="display:flex; justify-content:space-between; margin-bottom:10px;">
        <span>${item.name} x ${item.qty}</span>
        <span>$${itemSubtotal.toFixed(2)}</span>
      </div>
    `;
  });

  totalEl.innerText = `$${subtotal.toFixed(2)}`;
}

/***********************
  CART PAGE BUTTONS
************************/
document.addEventListener("click", e => {
  const cart = getCart();

  // Quantity buttons on cart page
  if (e.target.dataset.action === "inc") {
    cart[e.target.dataset.index].qty++;
    saveCart(cart);
    renderCartPage();
    renderCheckoutPage();
    renderCart();
  }

  if (e.target.dataset.action === "dec") {
    cart[e.target.dataset.index].qty--;
    if (cart[e.target.dataset.index].qty <= 0) {
      cart.splice(e.target.dataset.index, 1);
    }
    saveCart(cart);
    renderCartPage();
    renderCheckoutPage();
    renderCart();
  }

  // Remove item
  if (e.target.classList.contains("remove-item") || e.target.closest(".clear-cart_button")) {
    const idx = e.target.dataset.index ?? e.target.closest(".clear-cart_button").dataset.index;
    cart.splice(idx, 1);
    saveCart(cart);
    renderCartPage();
    renderCheckoutPage();
    renderCart();
  }
});

/***********************
  MENU CLICK HANDLERS
************************/
document.addEventListener("click", function (e) {

  /* NORMAL MENU + BUTTON */
  if (e.target.classList.contains("add-to-cart-trigger")) {
    const item = e.target.closest(".hero-menu-item, [data-name]");
    if (!item) return;

    const imgEl = item.querySelector("img");
    const imgSrc = imgEl ? imgEl.getAttribute("src") : "images/h-1-list-icon-img-7.jpg";

    const nameEl = item.querySelector("h6 a, h4 a");
    const priceEl = item.querySelector(".hero-menu-item-price");

    if (!nameEl || !priceEl) return;

    addToCart({
      name: nameEl.innerText.trim(),
      price: parseFloat(priceEl.innerText.replace("$", "")),
      qty: 1,
      img: imgSrc
    });
  }

  /* SPECIAL MENU OVERLAY */
  if (e.target.closest(".menu-overlay")) {
    const item = e.target.closest(".menu-item");
    if (!item) return;

    const imgEl = item.querySelector("img");
    const imgSrc = imgEl ? imgEl.getAttribute("src") : "images/h-1-list-icon-img-7.jpg";

    const nameEl = item.querySelector("h4 a");
    const priceEl = item.querySelector("[data-price]");

    addToCart({
      name: nameEl.innerText.trim(),
      price: priceEl ? parseFloat(priceEl.dataset.price) : 0,
      qty: 1,
      img: imgSrc
    });
  }
});

document.getElementById("final-order-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const userName = localStorage.getItem("userName");
    if (!userName) {
        alert("⚠️ Please Login first!"); // Agar toast kaam na kare toh alert dikhega
        return;
    }

    // Input fields ko sahi se target karna (IDs match hone chahiye)
    const orderData = {
        userName: userName,
        userEmail: document.querySelector('input[placeholder="Email Address *"]')?.value || "",
        userPhone: document.querySelector('input[placeholder="Phone Number *"]')?.value || "",
        items: getCart(),
        totalAmount: parseFloat(document.getElementById("checkout-total").textContent.replace('$', '')),
        orderType: document.getElementById("order-type").value,
        location: document.querySelector('input[placeholder="Table Number / Spot *"]')?.value || ""
    };

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (response.ok) {

          if (response.ok) {

    // SAVE ORDER LOCALLY
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push({
        email: orderData.userEmail,
        items: orderData.items,
        total: orderData.totalAmount,
        date: new Date().toLocaleString()
    });
    localStorage.setItem("orders", JSON.stringify(orders));

    showToast("✅ Order Placed Successfully!");
    localStorage.removeItem("cart");

    setTimeout(() => { window.location.href = "/"; }, 2000);
}


            // Try/Catch for Toast to prevent crashing
            try {
                showToast("✅ Order Placed Successfully!");
            } catch(e) {
                alert("✅ Order Placed Successfully!");
            }
            
            localStorage.removeItem("cart");
            setTimeout(() => { window.location.href = "/"; }, 2000);
        } else {
            console.error("Server Error:", result);
            alert("❌ Server Error: " + (result.message || "Unknown error"));
        }
    } catch (err) {
        console.error("Fetch Error:", err);
        alert("📡 Connection Error! Server might be down.");
    }
});

/***********************
  INIT
*************************/
updateHeaderCartCount();
renderCart();
renderCartPage();
renderCheckoutPage();
