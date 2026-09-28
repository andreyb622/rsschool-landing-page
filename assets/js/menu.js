const IMAGE_PATH = "../assets/images/menu-images/";
const PRODUCTS_PATH = "./../data/products.json";
const MOBILE_CARD_LIMIT = 4;
const MOBILE_MAX_WIDTH = 768;

const catalog = document.querySelector(".catalog");
const tabs = document.querySelector(".tabs");
const cardTemplate = document.querySelector("#card-template");
const loadMoreBtn = document.querySelector(".load-more");

const CATEGORIES = {
  coffee: "coffee",
  tea: "tea",
  dessert: "dessert",
};

let products = [];
let activeCategory = CATEGORIES.coffee;
let isExpanded = false;

function isMobile() {
  return window.innerWidth < MOBILE_MAX_WIDTH;
}

function getProductImage(product) {
  return `${IMAGE_PATH}${product.image}`;
}

function createCard(product, isHidden) {
  const card = cardTemplate.content.cloneNode(true);
  const image = card.querySelector("img");
  const title = card.querySelector("h2");
  const description = card.querySelector("p");
  const price = card.querySelector(".card__price");

  image.src = getProductImage(product);
  image.alt = product.name;
  title.textContent = product.name;
  description.textContent = product.description;
  price.textContent = `$${product.price}`;
  if (isHidden) {
    card.querySelector(".card").classList.add("is-hidden");
  }

  return card;
}

function renderCategory(category) {
  const items = products.filter((product) => product.category === category);
  const limit = isMobile() ? MOBILE_CARD_LIMIT : items.length;
  const isHiddenLoadMoreBtn = items.length <= limit;

  catalog.replaceChildren(...items.map((e, i) => createCard(e, i >= limit)));
  if (isHiddenLoadMoreBtn) {
    hideLoadMoreBtn();
  } else {
    showLoadMoreBtn();
  }
}

function hideLoadMoreBtn() {
  loadMoreBtn.classList.add("is-hidden");
}

function showLoadMoreBtn() {
  loadMoreBtn.classList.remove("is-hidden");
}

function loadMore() {
  catalog.querySelectorAll(".card.is-hidden").forEach((card) => {
    card.classList.remove("is-hidden");
  });
  hideLoadMoreBtn();
}

function setActiveTab(category) {
  tabs.querySelector(".is-active").classList.remove("is-active");
  tabs.querySelector(`[data-tab="${category}"]`).classList.add("is-active");
  activeCategory = category;
  renderCategory(activeCategory);
}

async function initMenu() {
  const response = await fetch(PRODUCTS_PATH);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  products = await response.json();

  activeCategory = CATEGORIES.coffee;
  renderCategory(activeCategory);

  tabs.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      setActiveTab(tab.dataset.tab);
    });
  });

  loadMoreBtn.addEventListener("click", loadMore);
}

initMenu();
