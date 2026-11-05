// ETC PHOTOS — update the settings below before publishing.
const ETC_CONFIG = {
  contactEmail: "etcphotosuk@gmail.com",
  instagramUrl: "https://www.instagram.com/etc_photo5/",
  youtubeUrl: "https://www.youtube.com/channel/UCl51-y6dp1DD_OerDpfEDQw",
  tiktokUrl: "https://www.tiktok.com/@etc_photos"
};

const body = document.body;
const themeButton = document.querySelector(".theme-toggle");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const loader = document.querySelector(".loader");

window.addEventListener("load", () => {
  window.setTimeout(() => loader?.classList.add("done"), 450);
});

document.querySelector("#year").textContent = new Date().getFullYear();

// Theme preference
const savedTheme = localStorage.getItem("etc-theme");
if (savedTheme === "light") body.classList.remove("dark-mode");
else body.classList.add("dark-mode");
themeButton?.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  localStorage.setItem("etc-theme", body.classList.contains("dark-mode") ? "dark" : "light");
});

// Mobile navigation
menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
}));

// Reveal sections as they enter the viewport
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else revealItems.forEach(item => item.classList.add("visible"));

// Car collection selector — delegated click handling keeps the controls reliable.
document.addEventListener("click", event => {
  const button = event.target.closest("[data-car-filter]");
  if (!button) return;
  const selected = button.dataset.carFilter;
  document.querySelectorAll("[data-car-filter]").forEach(option => {
    const active = option === button;
    option.classList.toggle("active", active);
    option.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll("[data-car-collection]").forEach(collection => {
    const hide = selected !== "all" && collection.dataset.carCollection !== selected;
    collection.classList.toggle("car-hidden", hide);
    collection.setAttribute("aria-hidden", String(hide));
  });
});

// Gallery filters
const galleryItems = [...document.querySelectorAll(".gallery-item")];
document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    galleryItems.forEach(item => item.classList.toggle("is-hidden", filter !== "all" && item.dataset.category !== filter));
  });
});

// Accessible image viewer and slideshow
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector("figcaption");
const counter = lightbox.querySelector(".lightbox-counter");
const slideButton = lightbox.querySelector(".slideshow-toggle");
let currentIndex = 0;
let slideTimer = null;
let visibleGallery = () => galleryItems.filter(item => !item.classList.contains("is-hidden") && !item.closest("[data-car-collection]")?.classList.contains("car-hidden"));
function showImage(index) {
  const items = visibleGallery();
  if (!items.length) return;
  currentIndex = (index + items.length) % items.length;
  const item = items[currentIndex];
  lightboxImage.src = item.dataset.image;
  lightboxImage.alt = item.querySelector("img").alt;
  lightboxCaption.textContent = item.dataset.caption;
  counter.textContent = String(currentIndex + 1).padStart(2, "0") + " / " + String(items.length).padStart(2, "0");
}
function openLightbox(index) {
  showImage(index);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lightbox.querySelector(".lightbox-close").focus();
}
function closeLightbox() {
  stopSlideshow();
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
function stopSlideshow() {
  if (slideTimer) window.clearInterval(slideTimer);
  slideTimer = null;
  slideButton.textContent = "PLAY SLIDESHOW";
}
galleryItems.forEach(item => item.addEventListener("click", () => openLightbox(visibleGallery().indexOf(item))));
lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showImage(currentIndex - 1));
lightbox.querySelector(".lightbox-next").addEventListener("click", () => showImage(currentIndex + 1));
slideButton.addEventListener("click", () => {
  if (slideTimer) stopSlideshow();
  else {
    slideButton.textContent = "PAUSE SLIDESHOW";
    slideTimer = window.setInterval(() => showImage(currentIndex + 1), 3000);
  }
});
document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") showImage(currentIndex + 1);
  if (event.key === "ArrowLeft") showImage(currentIndex - 1);
});
lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });

// Enquiry form: opens the visitor's email app with their message.
document.querySelector("#contact-form").addEventListener("submit", event => {
  event.preventDefault();
  const status = document.querySelector(".form-status");
  if (ETC_CONFIG.contactEmail === "YOUR_EMAIL_HERE" || !ETC_CONFIG.contactEmail.includes("@")) {
    status.textContent = "The form is ready. Add your real contact email in script.js to receive enquiries.";
    return;
  }
  const data = new FormData(event.currentTarget);
  const subject = encodeURIComponent("ETC PHOTOS enquiry — " + data.get("project"));
  const message = encodeURIComponent(
    "Name: " + data.get("name") + "\nEmail: " + data.get("email") +
    "\nProject: " + data.get("project") + "\n\n" + data.get("message")
  );
  window.location.href = "mailto:" + ETC_CONFIG.contactEmail + "?subject=" + subject + "&body=" + message;
  status.textContent = "Your email app should open with your enquiry ready.";
});

// Apply the configured social profile links
const socialUrls = {
  instagram: ETC_CONFIG.instagramUrl,
  youtube: ETC_CONFIG.youtubeUrl,
  tiktok: ETC_CONFIG.tiktokUrl
};
Object.entries(socialUrls).forEach(([platform, url]) => {
  const link = document.querySelector(`[data-social="${platform}"]`);
  if (link && url) link.href = url;
});
