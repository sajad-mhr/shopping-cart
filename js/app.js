const productData = [
  {
    id: 1,
    productName: "iphone 11",
    productPrice: 24000000,
    productImage: "assets/images/img-iphone-11.jpg",
  },
  {
    id: 2,
    productName: "iphone 12 Promax",
    productPrice: 49000000,
    productImage: "assets/images/img-iphone-12-promax.jpg",
  },
  {
    id: 3,
    productName: "iphone 13 ch",
    productPrice: 32000000,
    productImage: "assets/images/img-iphone-13-ch.jpg",
  },
  {
    id: 4,
    productName: "iphone 13 pro",
    productPrice: 45000000,
    productImage: "assets/images/img-iphone-13-pro.jpg",
  },
  {
    id: 5,
    productName: "iphone 13 Promax",
    productPrice: 48500000,
    productImage: "assets/images/img-iphone-13-promax.jpg",
  },
  {
    id: 6,
    productName: "iphone 14 pro",
    productPrice: 55500000,
    productImage: "assets/images/img-iphone-14-pro.jpg",
  },
  {
    id: 7,
    productName: "iphone 7 plus",
    productPrice: 20000000,
    productImage: "assets/images/img-iphone-7-plus.jpg",
  },
  {
    id: 8,
    productName: "iphone SE 2020",
    productPrice: 15000000,
    productImage: "assets/images/img-iphone-SE-2020.jpg",
  },
];

const $ = document;
const productList = $.getElementById("product-list");
const navBar = $.querySelector(".my-navbar");
const cartContainer = $.getElementById("cart-container");
const cartEmpty = $.querySelector(".cart-empty");
const myToast = $.querySelector(".my-toast");
const toastMessage = $.getElementById("toast-message");
const toastClose = $.getElementById("toast-close");
const sumPrice = $.getElementById("sum-price");
let timeOut = null;
let cart = [];

// Get the data and display on the page
function renderData(allData, dataContainer) {
  dataContainer.innerHTML = "";

  allData.forEach(function (prod) {
    let element = `
      <div class="product-card col-lg-3 col-md-4 col-sm-6 border p-2">
        <div class="right-card-prod">
          <img src="${prod.productImage}" alt="iphone-11">
          <h4>${prod.productName}</h4>
        </div>
          <h6>${prod.productPrice.toLocaleString("en-US")}</h6>
          <button onclick="addToCart(${prod.id})" class="mb-2">
            افزودن به سبد خرید
          </button>
      </div>
  `;
    dataContainer.insertAdjacentHTML("beforeend", element);
  });
}

// show and hide toast message
function showToast(message, bgcolor) {
  myToast.classList.remove("hidden-toast");
  myToast.classList.add("show-toast");
  toastMessage.innerHTML = message;
  myToast.style.backgroundColor = bgcolor;
}

function hiddenToast() {
  myToast.classList.add("hidden-toast");
  myToast.classList.remove("show-toast");
}

// Making each item in the shopping cart
function createCartItems(cart) {
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartEmpty.classList.add("show");
    cartEmpty.classList.remove("hidden");
  } else {
    cartEmpty.classList.remove("show");
    cartEmpty.classList.add("hidden");
    cart.forEach(function (item) {
      let cartElem = `
  <div class="card-cart">
    <div class="right-card">
      <img src="${item.productImage}" alt="iphone-11" />
      <span>${item.productName}</span>
    </div>
    <span>${item.productPrice.toLocaleString("en-US")} تومان</span>
    <input type="number" oninput="changeQty(${
      item.id
    },event)" id="qty-input" min="1" max="9" value="${item.productQty}" />
    <div class="left-card">
      <button onclick="removeFromCart(${item.id})">
      <i class="fas fa-trash"></i>
      </button>
    </div>
  </div>
        `;
      cartContainer.insertAdjacentHTML("beforeend", cartElem);
    });
  }
}

// Set shopping cart in local storage
function setToLocalStorage(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}
// Get shopping cart in local storage
function getFromLocalStorage() {
  let getCart = JSON.parse(localStorage.getItem("cart"));
  if (getCart) {
    cart = getCart;
  } else {
    cart = [];
  }
  createCartItems(cart);
  priceCalculate(cart);
}

// Add to cart function
function addToCart(prodId) {
  clearTimeout(timeOut);
  // find product with id
  let findProduct = productData.filter(function (prod) {
    return prod.id === prodId;
  });

  // Checking the presence of the product in the shopping cart
  let hasInCart = cart.some(function (item) {
    return item.id === prodId;
  });
  if (!hasInCart) {
    window.scrollTo(0, $.body.scrollHeight);
    findProduct.forEach(function (item) {
      // create product object
      let productObject = {
        id: item.id,
        productName: item.productName,
        productImage: item.productImage,
        productPrice: item.productPrice,
        productQty: 1,
      };
      cart.push(productObject);
      showToast(`${item.productName} به سبد خرید اضافه شد`, "green");
      console.log(myToast.className);
    });
    setToLocalStorage(cart);
    createCartItems(cart);
  } else {
    showToast("این محصول در سبد خرید شما وجود دارد", "red");
  }
  timeOut = setTimeout(hiddenToast, 4000);
  priceCalculate(cart);
}

// Function to change the number of each shopping cart product in local storage
function changeQty(prodId, event) {
  let getCart = JSON.parse(localStorage.getItem("cart"));
  let qty = Number(event.target.value);
  cart = getCart;
  cart.forEach(function (item) {
    if (item.id === prodId) {
      item.productQty = qty;
    }
  });
  priceCalculate(cart);
  setToLocalStorage(cart);
}

// Remove product from cart
function removeFromCart(prodId) {
  let getCart = JSON.parse(localStorage.getItem("cart"));
  cart = getCart;

  let findProd = cart.findIndex(function (prod) {
    return prod.id === prodId;
  });

  cart.splice(findProd, 1);
  setToLocalStorage(cart);
  priceCalculate(cart);
  createCartItems(cart);

  // let newCart = cart.filter(function(prod){
  //   return prod.id !== prodId
  // })

  // setToLocalStorage(newCart);
  // priceCalculate(newCart);
  // createCartItems(newCart);
}

// Calculate the price of the shopping cart
function priceCalculate(cart) {
  let sum = 0;
  for (let i = 0; i < cart.length; i++) {
    sum += cart[i].productPrice * cart[i].productQty;
  }
  sumPrice.innerHTML = "قیمت کل: " + sum.toLocaleString("en-US");
}

function fixedNavbar() {
  if (window.scrollY > 0) {
    navBar.classList.add("fixed");
  } else {
    navBar.classList.remove("fixed");
  }
}

window.addEventListener("scroll", fixedNavbar);
toastClose.addEventListener("click", function () {
  hiddenToast();
  clearTimeout(timeOut);
});
window.addEventListener("load", getFromLocalStorage);
renderData(productData, productList);
