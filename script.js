// Navbar toggle
const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");

if (bar) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}
if (close) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}

// Cart display on cart.html
function displayCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItems = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  let total = 0;

  if (!cartItems || !totalEl) return;

  cartItems.innerHTML = '';

  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Your cart is empty.</p>';
    totalEl.textContent = 'Total: KES 0';
    return;
  }

  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    cartItems.innerHTML += `
      <div class="cart-item">
        <p><strong>${item.name}</strong></p>
        <p>Price: KES ${item.price}</p>
        <p>Quantity: ${item.quantity}</p>
        <p>Subtotal: KES ${subtotal}</p>
        <hr>
      </div>
    `;
  });

  totalEl.textContent = `Total: KES ${total}`;
}

function proceedToCheckout() {
  window.location.href = "checkout.html";
}

window.onload = displayCart;

// Add to cart from product page
document.addEventListener("DOMContentLoaded", () => {
  const addToCartBtn = document.getElementById("addToCartBtn");

  addToCartBtn?.addEventListener("click", () => {
    const name = document.getElementById("productName")?.textContent.trim();
    const priceText = document.getElementById("productPrice")?.textContent.trim();
    const price = parseFloat(priceText.replace("KES", "").trim());
    const image = document.getElementById("MainImg")?.getAttribute("src");
    const size = document.getElementById("productSize")?.value;
    const quantity = parseInt(document.getElementById("productQty")?.value) || 1;

    if (size === "Select Size") {
      alert("Please select a size before adding to cart.");
      return;
    }

    const product = {
      name,
      price,
      image,
      size,
      quantity
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Product added to cart!");
  });
});

// Clear cart
document.addEventListener("DOMContentLoaded", () => {
  const clearCartBtn = document.getElementById("clearCartBtn");

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      const confirmClear = confirm("Are you sure you want to clear your cart?");
      if (confirmClear) {
        localStorage.removeItem("cart");
        alert("Cart has been cleared!");
        location.reload();
      }
    });
  }
});

// Order summary on checkout page
document.addEventListener("DOMContentLoaded", () => {
  const summaryDiv = document.getElementById("orderSummary");
  if (!summaryDiv) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    summaryDiv.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let total = 0;
  let summaryHTML = '<ul>';
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    summaryHTML += `
      <li>
        <span>${item.name} (${item.size}) x ${item.quantity}</span>
        <span>KES ${itemTotal.toFixed(2)}</span>
      </li>
    `;
  });
  summaryHTML += '</ul>';
  summaryHTML += `<div class="total"><span>Total:</span><span>KES ${total.toFixed(2)}</span></div>`;

  summaryDiv.innerHTML = summaryHTML;
});

// Checkout form submission via EmailJS
document.addEventListener("DOMContentLoaded", () => {
  const checkoutForm = document.getElementById("checkoutForm");
  if (!checkoutForm) return;

  emailjs.init("EU07F_GLQLkjgRG9L"); // Make sure this is your actual public key

  checkoutForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("checkoutEmail").value.trim();
    const phone = document.getElementById("checkoutPhone").value.trim();
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!email || !phone || cart.length === 0) {
      alert("Please fill in all fields and ensure your cart is not empty.");
      return;
    }

    const orderDetails = cart.map(item =>
      `${item.quantity}x ${item.name} (${item.size}) - KES ${item.price}`
    ).join("\n");

    const ref = "REF-" + Math.floor(Math.random() * 1000000);

    const templateParams = {
  user_email: email,          // <-- matches {{user_email}} in template
  user_phone: phone,          // <-- matches {{user_phone}}
  order_ref: ref,             // <-- matches {{order_ref}}
  order_details: orderDetails // <-- matches {{order_details}}
};

    console.log("Sending to:", email);
    console.log("Template params:", templateParams);

    emailjs.send("service_yuralkh", "template_3mspdgl", templateParams)
      .then(() => {
        alert("Order successfully sent! Check your email.");
        localStorage.removeItem("cart");
        window.location.href = "thankyou.html";
      }, (error) => {
        alert("Failed to send order. Please try again.");
        console.error(error);
      });
  });
});
