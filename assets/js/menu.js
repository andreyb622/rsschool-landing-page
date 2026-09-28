const IMAGE_PATH = "../assets/images/menu-images/";
const PRODUCTS_PATH = "./../data/products.json";
const MOBILE_CARD_LIMIT = 4;
const MOBILE_MAX_WIDTH = 768;

const catalog = document.querySelector(".catalog");
const tabs = document.querySelector(".tabs");
const cardTemplate = document.querySelector("#card-template");
const loadMoreBtn = document.querySelector(".load-more");
const modal = document.querySelector(".modal");
const modalImage = modal.querySelector(".modal__image");
const modalTitle = modal.querySelector("#modal-title");
const modalDescription = modal.querySelector(".modal__description");
const modalPrice = modal.querySelector(".modal__price");
const sizeOptions = modal.querySelector('[data-options="size"]');
const additiveOptions = modal.querySelector('[data-options="additives"]');

const CATEGORIES = {
  coffee: "coffee",
  tea: "tea",
  dessert: "dessert",
};

let products = [];
let activeCategory = CATEGORIES.coffee;
let activeProduct = null;
let selectedSize = "s";
let selectedAdditives = [];

function isMobile() {
  return window.innerWidth <= MOBILE_MAX_WIDTH;
}

function getProductImage(product) {
  return `${IMAGE_PATH}${product.image}`;
}

function createCard(product, isHidden) {
  const cardClone = cardTemplate.content.cloneNode(true);
  const card = cardClone.querySelector(".card");
  const image = card.querySelector("img");
  const title = card.querySelector("h2");
  const description = card.querySelector("p");
  const price = card.querySelector(".card__price");

  card.dataset.name = product.name;
  image.src = getProductImage(product);
  image.alt = product.name;
  title.textContent = product.name;
  description.textContent = product.description;
  price.textContent = `$${product.price}`;

  if (isHidden) {
    card.classList.add("is-hidden");
  }

  return cardClone;
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

function getTotalPrice() {
  const basePrice = Number(activeProduct.price);
  const sizePrice = Number(activeProduct.sizes[selectedSize]["add-price"]);
  const additivePrice = selectedAdditives.reduce((sum, index) => {
    return sum + Number(activeProduct.additives[index]["add-price"]);
  }, 0);

  return (basePrice + sizePrice + additivePrice).toFixed(2);
}

function createOptionButton(label, caption, isActive) {
  const button = document.createElement("button");
  const badge = document.createElement("span");
  const buttonText = document.createTextNode(` ${caption}`);

  button.type = "button";
  button.className = "modal__option";
  button.classList.toggle("is-active", isActive);
  badge.textContent = label;

  button.append(badge, buttonText);
  return button;
}

function renderSizeOptions() {
  const sizes = Object.entries(activeProduct.sizes);
  sizeOptions.replaceChildren(
    ...sizes.map(([key, value]) => {
      const button = createOptionButton(
        key.toUpperCase(),
        value.size,
        selectedSize === key,
      );
      button.dataset.size = key;
      return button;
    }),
  );
}

function renderAdditiveOptions() {
  additiveOptions.replaceChildren(
    ...activeProduct.additives.map((additive, index) => {
      const button = createOptionButton(
        index + 1,
        additive.name,
        selectedAdditives.includes(index),
      );
      button.dataset.additive = String(index);
      return button;
    }),
  );
}

function updateModalPrice() {
  modalPrice.textContent = `$${getTotalPrice()}`;
}

function openModal(product) {
  activeProduct = product;
  selectedSize = "s";
  selectedAdditives = [];

  modalImage.src = getProductImage(product);
  modalImage.alt = product.name;
  modalTitle.textContent = product.name;
  modalDescription.textContent = product.description;

  renderSizeOptions();
  renderAdditiveOptions();
  updateModalPrice();

  document.body.style.overflow = "hidden";
  modal.showModal();
}

function closeModal() {
  document.body.style.overflow = "";
  activeProduct = null;
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

  catalog.addEventListener("click", (event) => {
    const card = event.target.closest(".card");

    if (!card) {
      return;
    }

    const product = products.find((item) => item.name === card.dataset.name);

    if (product) {
      openModal(product);
    }
  });

  sizeOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-size]");

    if (!button) {
      return;
    }

    selectedSize = button.dataset.size;
    renderSizeOptions();
    updateModalPrice();
  });

  additiveOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-additive]");

    if (!button) {
      return;
    }

    const index = Number(button.dataset.additive);

    if (selectedAdditives.includes(index)) {
      selectedAdditives = selectedAdditives.filter((item) => item !== index);
    } else {
      selectedAdditives.push(index);
    }

    renderAdditiveOptions();
    updateModalPrice();
  });

  loadMoreBtn.addEventListener("click", loadMore);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.close();
    }
  });
  modal.addEventListener("close", closeModal);

  let wasMobile = isMobile();

  window.addEventListener("resize", () => {
    const nowMobile = isMobile();

    if (nowMobile === wasMobile) {
      return;
    }

    wasMobile = nowMobile;
    renderCategory(activeCategory);
  });
}

initMenu();
