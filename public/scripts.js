
document.getElementById("subscribe-form").addEventListener("submit", function(e) {
    e.preventDefault(); // prevent form reload

    const email = document.getElementById("subscribe-email").value.trim();

    if (email === "") {
        showToast("⚠️ Please enter your email");
        return;
    }

     showToast("✅ Subscribed successfully!");
    
    // clear input
    document.getElementById("subscribe-email").value = "";
});

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000); // hide after 3 seconds
}
/* ✅ Contact Form */
document.getElementById("submit_cnt").addEventListener("click", function(e) {
    e.preventDefault();

    const name = document.getElementById("name2").value.trim();
    const email = document.getElementById("email2").value.trim();
    const msg = document.getElementById("comments2").value.trim();

    if (!name || !email || !msg) {
        showToast("⚠️ Please fill all required fields");
        return;
    }

    
    showToast("✅ Message sent successfully!");

    // Clear inputs
    document.getElementById("name2").value = "";
    document.getElementById("email2").value = "";
    document.getElementById("comments2").value = "";
});


document.querySelector(".single-open-hours .btn").addEventListener("click", function() {
    // Hide contact form and show reservation form
    document.getElementById("contactform").style.display = "none";
    document.getElementById("reservationform").style.display = "block";

    // Replace heading text
    const heading = document.getElementById("form-heading");
    heading.innerHTML = `
        <h4>Book Your Spot Now</h4>
        <h2>Table Reservation</h2>
    `;

    // Toast feedback
    showToast("📅 Table reservation form opened");
});

// Reservation form submit button
// ✅ Professional Reservation Form Submission
document.getElementById("reservationform").addEventListener("submit", async function(e) {
    e.preventDefault(); // Stop the page from reloading

    // Collect data from the input fields
    const formData = {
        rname: document.getElementById('rname').value.trim(),
        rdate: document.getElementById('rdate').value,
        rtime: document.getElementById('rtime').value,
        rpeople: document.getElementById('rpeople').value,
        rnotes: document.getElementById('rnotes').value.trim()
    };

    // Basic Validation
    if (!formData.rname || !formData.rdate || !formData.rtime || !formData.rpeople) {
        showToast("⚠️ Please fill all required fields");
        return;
    }

    try {
        // Sending the data to your Node.js server
        const response = await fetch('/book-table', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            showToast("✅ Reservation Successful! See you soon.");
            document.getElementById('reservationform').reset();
            
            // Optional: Switch back to contact form after 2 seconds
            setTimeout(() => {
                document.getElementById("reservationform").style.display = "none";
                document.getElementById("contactform").style.display = "block";
                document.getElementById("form-heading").innerHTML = `
                    <h4>Still Have questions?</h4>
                    <h2>Get in Touch</h2>
                `;
            }, 2000);

        } else {
            showToast("❌ Reservation Failed. Please try again.");
        }
    } catch (error) {
        console.error("Network Error:", error);
        showToast("📡 Server connection error");
    }
});

// Get the cart button and the cart container
        const cartButton = document.querySelector('.cart-btn');
        const cartContainer = document.querySelector('.header-cart_wrap');
        const closeButton = document.querySelector('.close-cart');

         cartButton.addEventListener('click', () => {
             cartContainer.classList.toggle('vis-cart');
        });

        // Add a click event listener to the close button
        closeButton.addEventListener('click', () => {
            // This removes the 'vis-cart' class to hide the cart.
            cartContainer.classList.remove('vis-cart');
        });
        
         document.addEventListener('click', (event) => {
            const isClickInside = cartButton.contains(event.target) || cartContainer.contains(event.target);
            if (!isClickInside) {
                cartContainer.classList.remove('vis-cart');
            }
        });
  
document.addEventListener('DOMContentLoaded', () => {
    const tabsMenu = document.querySelector('.tabs-menu');
    const tabs = document.querySelectorAll('.tab-content');

    // Hide all tabs except the first one
    tabs.forEach((tab, index) => {
        if (index !== 0) {
            tab.style.display = 'none';
        }
    });

    tabsMenu.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target.closest('li');
        if (!target) return;

        document.querySelectorAll('.tabs-menu li').forEach(li => li.classList.remove('current'));
        target.classList.add('current');

        const tabId = target.querySelector('a').getAttribute('href');

        // Hide all tab content
        tabs.forEach(tab => {
            tab.style.display = 'none';
        });

        // Show the selected tab content
        const activeTab = document.querySelector(tabId);
        if (activeTab) {
            activeTab.style.display = 'grid';
        }
    });
});

// Handle Add to Cart clicks
document.querySelectorAll(".menu-item .menu-overlay").forEach(item => {
  item.addEventListener("click", function() {
    const productName = this.closest(".menu-item").querySelector("h4 a").innerText;
    showToast(`🛒 ${productName} added to cart`);
  });
});


// 


document.addEventListener("DOMContentLoaded", () => {
    const authModal = document.getElementById("auth-modal");
    
    // 1. Show floating page after 1 second if NO user is saved
    if (!localStorage.getItem("userToken")) {
        setTimeout(() => {
            authModal.style.display = "flex";
        }, 1000);
    }

    // 2. Switch between Login and Signup
    document.getElementById("to-login").addEventListener("click", () => {
        document.getElementById("signup-form").style.display = "none";
        document.getElementById("login-form").style.display = "block";
        document.getElementById("auth-title").innerText = "Welcome Back";
    });

    document.getElementById("to-signup").addEventListener("click", () => {
        document.getElementById("login-form").style.display = "none";
        document.getElementById("signup-form").style.display = "block";
        document.getElementById("auth-title").innerText = "Welcome to Brew&Bean";
    });

    // 3. Close modal
    document.getElementById("close-auth").addEventListener("click", () => {
        authModal.style.display = "none";
    });
});
/* ==========================================
   ✅ FINAL AUTHENTICATION LOGIC (FRONTEND)
   ========================================== */

// 1. Initial Load Logic
document.addEventListener("DOMContentLoaded", () => {
    // Check if user is already logged in
    updateHeader();

    const authModal = document.getElementById("auth-modal");
    
    // Auto-show popup after 1 second ONLY if user is not logged in
    if (!localStorage.getItem("userToken")) {
        setTimeout(() => {
            if (authModal) authModal.style.display = "flex";
        }, 1000);
    }

    // Toggle between forms in the modal
    const toLogin = document.getElementById("to-login");
    const toSignup = document.getElementById("to-signup");

    if (toLogin) {
        toLogin.addEventListener("click", () => {
            document.getElementById("signup-form").style.display = "none";
            document.getElementById("login-form").style.display = "block";
            document.getElementById("auth-title").innerText = "Welcome Back";
        });
    }

    if (toSignup) {
        toSignup.addEventListener("click", () => {
            document.getElementById("login-form").style.display = "none";
            document.getElementById("signup-form").style.display = "block";
            document.getElementById("auth-title").innerText = "Welcome to Brew&Bean";
        });
    }

    // Close Modal Button
    const closeAuth = document.getElementById("close-auth");
    if (closeAuth) {
        closeAuth.addEventListener("click", () => {
            authModal.style.display = "none";
        });
    }
});

// ✅ Signup Logic: Auto-switch to Login
document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (response.ok) {
            showToast("✅ Account Created! Loading Login...");
            // AUTO-SWITCH logic
            setTimeout(() => {
                document.getElementById("signup-form").style.display = "none";
                document.getElementById("login-form").style.display = "block";
                document.getElementById("auth-title").innerText = "Welcome Back";
            }, 1000);
        } else {
            const data = await response.json();
            showToast("⚠️ " + data.message);
        }
    } catch (error) { showToast("📡 Connection error"); }
});

// ✅ Login Logic: Auto-hide and Land on Site
document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("userToken", "active");
            localStorage.setItem("userName", data.userName);
            localStorage.setItem("userEmail", email);


            // CRITICAL: This hides the popup immediately
            document.getElementById("auth-modal").style.display = "none"; 
            
            updateHeader(); 
            showToast(`👋 Welcome back, ${data.userName}!`);
        } else {
            showToast("❌ " + data.message);
        }
    } catch (error) { showToast("📡 Connection error"); }
});
function updateHeader() {
    const container = document.getElementById("auth-btn-container");
    const userName = localStorage.getItem("userName"); //
    if (!container) return;

    if (userName) {
        container.innerHTML = `
            <div class="top-header-reser_btn show-rb btn-g" id="logout-trigger" style="margin:0 !important; float:none !important;">
                <span>Hi, ${userName} <i class="fa-solid fa-right-from-bracket" style="margin-left:8px;"></i></span>
            </div>
        `;
        document.getElementById("logout-trigger").onclick = () => {
            localStorage.clear(); //
            location.reload();
        };
    } else {
        container.innerHTML = `
            <div class="top-header-reser_btn show-rb btn-g" id="login-trigger" style="margin:0 !important; float:none !important;">
                <span>Login / Sign Up <i class="fa-solid fa-user" style="margin-left:8px;"></i></span>
            </div>
        `;
        document.getElementById("login-trigger").onclick = () => {
            document.getElementById("auth-modal").style.display = "flex"; //
        };
    }


}

document.addEventListener("DOMContentLoaded", () => {

  const profileBtn = document.getElementById("profileBtn");
  const email = localStorage.getItem("userEmail");
  const name = localStorage.getItem("userName");
  const userDisplay = document.getElementById("userDisplay");

  /* SHOW NAME */
  if (email === "admin@gmail.com") {
      userDisplay.innerText = "Admin";
  } else if (name) {
      userDisplay.innerText = name;
  } else {
      userDisplay.innerText = "Guest";
  }

  /* PROFILE BUTTON CLICK */
  profileBtn.onclick = () => {
      if (email === "admin@gmail.com") {
          window.location.href = "admin.html";
      } else {
          window.location.href = "my-orders.html";
      }
  };

});

function openDashboard() {
    window.location.href = "admin-dashboard.html";
}


/* LOGOUT */
function logout() {
  localStorage.clear();
  location.reload();
}


function openProfile() {

    // try multiple possible keys (safe fix)
    const userEmail =
        localStorage.getItem("loggedInUserEmail") ||
        localStorage.getItem("userEmail") ||
        localStorage.getItem("loggedInUser") ||
        localStorage.getItem("email");

    if (!userEmail) {
        alert("Please login first!");
        return;
    }

    // ADMIN CHECK
    if (userEmail === "admin@gmail.com") {
        window.location.href = "/admin-dashboard.html";
    } else {
        window.location.href = "/user-profile.html";
    }
}

