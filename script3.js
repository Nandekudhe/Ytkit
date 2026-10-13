/* ========================================================
   VISION PRODUCTS - UNIVERSAL CREATOR KIT SCRIPT
   High-converting logic, Razorpay redirect & tracking events
   ======================================================== */

// 1. MASTER CONFIGURATION
const CONFIG = {
  price: 99,
  // PASTE YOUR REAL RAZORPAY PAYMENT LINK BELOW:
  paymentUrl: "https://payments.cashfree.com/forms/YTkit", 
  
  // Primary 1:1 Creative Image Path
  productImage: "yt1.png",

  // Analytics Configurations
  metaPixelEnabled: true, // Will safely fire if Pixel script has valid ID
  ga4Enabled: false       // Disabled until configured
};

// 2. CONFIGURABLE PRODUCT DELIVERABLES
// Replace or tweak these cards with your exact kit contents anytime!
const PRODUCT_CONTENTS = [
  {
    icon: "🗂️",
    title: "Complete YouTube Starter Guide",
    benefit: "Everything from choosing your niche to launching your first YouTube video."
  },
  {
    icon: "✍️",
    title: "Premium Editing Assets Library",
    benefit: "5k+ Access backgrounds, music, overlays, transitions, templates & more."
  },
  {
    icon: "💡",
    title: "30-Day Creator Challenge",
    benefit: "A daily action plan to build, launch and grow your YouTube channel."
  },
  {
    icon: "📈",
    title: "Ready-to-Use Creator Templates",
    benefit: "Scripts, video ideas, AI prompts, thumbnail guides and content planners."
  }
];

// ========================================================
// CORE INITIALIZATION
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
  initProductOffer();
  renderProductContents();
  initCTAButtons();
  initFAQAccordion();
  initLightbox();
  initTrackingEvents();
});

// Update dynamic prices and image from CONFIG
function initProductOffer() {
  const priceDisplay = document.getElementById("display-price");
  if (priceDisplay) priceDisplay.textContent = CONFIG.price;

  const btnPrices = document.querySelectorAll(".btn-price");
  btnPrices.forEach(el => el.textContent = CONFIG.price);

  const heroImg = document.getElementById("hero-product-img");
  if (heroImg && CONFIG.productImage) {
    heroImg.src = CONFIG.productImage;
  }
}

// Render dynamic contents in Section 3
function renderProductContents() {
  const container = document.getElementById("product-contents-grid");
  if (!container) return;

  container.innerHTML = PRODUCT_CONTENTS.map(item => `
    <div class="content-card">
      <div class="content-card-icon">${item.icon}</div>
      <div class="content-card-text">
        <h3>${item.title}</h3>
        <p>${item.benefit}</p>
      </div>
    </div>
  `).join("");
}

// Bind all CTA buttons to InitiateCheckout + Redirect to Razorpay
function initCTAButtons() {
  const buyButtons = document.querySelectorAll(".js-buy-btn");

  buyButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      // 1. Fire InitiateCheckout ONLY ON CLICK
      if (typeof fbq === "function") {
        fbq('track', 'InitiateCheckout', {
          content_name: 'Universal Creator Kit',
          value: 99,
          currency: 'INR'
        });
      }

      // 2. Redirect smoothly to your payment link
      window.location.href = CONFIG.paymentUrl;
    });
  });
}


// FAQ Accordion functionality
function initFAQAccordion() {
  const faqButtons = document.querySelectorAll(".faq-question");

  faqButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains("active");

      // Optional: Close all other FAQ items for a clean single-open accordion
      document.querySelectorAll(".faq-item").forEach(other => {
        other.classList.remove("active");
        const otherBtn = other.querySelector(".faq-question");
        if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("active");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

// Image Lightbox for Section 4
function initLightbox() {
  const triggers = document.querySelectorAll(".js-lightbox-trigger");
  const modal = document.getElementById("lightboxModal");
  const modalImg = document.getElementById("lightboxImg");
  const overlay = document.getElementById("lightboxOverlay");
  const closeBtn = document.getElementById("lightboxClose");

  if (!modal || !modalImg) return;

  triggers.forEach(card => {
    card.addEventListener("click", () => {
      const imgSrc = card.getAttribute("data-preview");
      if (imgSrc) {
        modalImg.src = imgSrc;
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    modalImg.src = "";
  };

  if (overlay) overlay.addEventListener("click", closeModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}

// ========================================================
// TRACKING & ANALYTICS
// ========================================================
let hasFiredViewContent = false;

function initTrackingEvents() {
  // Fire ViewContent once on scroll past hero
  window.addEventListener("scroll", () => {
    if (!hasFiredViewContent && window.scrollY > 150) {
      trackViewContent();
      hasFiredViewContent = true;
    }
  }, { passive: true });
}

function trackViewContent() {
  if (typeof fbq === "function" && CONFIG.metaPixelEnabled) {
    fbq('track', 'ViewContent', {
      content_name: 'Universal Creator Kit',
      value: CONFIG.price,
      currency: 'INR'
    });
  }
}

function trackInitiateCheckout() {
  if (typeof fbq === "function" && CONFIG.metaPixelEnabled) {
    fbq('track', 'InitiateCheckout', {
      content_name: 'Universal Creator Kit',
      value: CONFIG.price,
      currency: 'INR'
    });
  }

  // Google Analytics 4 (if enabled)
  if (CONFIG.ga4Enabled && typeof gtag === "function") {
    gtag('event', 'begin_checkout', {
      value: CONFIG.price,
      currency: 'INR',
      items: [{ item_name: 'Universal Creator Kit', price: CONFIG.price }]
    });
  }
}
