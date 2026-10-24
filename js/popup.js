document.addEventListener("DOMContentLoaded", () => {

    let cart = JSON.parse(localStorage.getItem("cartData")) || [];

    const cartIcon = document.getElementById("cart-icon");
    const curtCount = document.getElementById("curt-count");
    const orderModal = document.getElementById("order-modal");
    const closeOrderBtn = orderModal ? orderModal.querySelector(".close-btn") : null;
    const cartItemsList = document.getElementById("cart-items-list");
    const totalPriceEl = document.getElementById("total-price");
    const clearCartBtn = document.getElementById("clear-cart-btn");
    const checkoutForm = document.getElementById("checkout-form");

    const openSearchBtn = document.getElementById("open-search-btn");
    const searchModal = document.getElementById("search-modal");
    const closeSearchBtn = searchModal ? searchModal.querySelector(".close-search-btn") : null;
    const modalSearchInput = document.getElementById("modal-search-input");
    const searchResultsList = document.getElementById("search-results-list");

    const menuItems = [
        { id: 1, name: "Vuna-kishuri", price: 120, img: "img/vuna-kishuri.webp" },
        { id: 2, name: "Beef kala-vuna", price: 280, img: "img/kala-vuna.webp" },
        { id: 3, name: "Beef Nehari", price: 250, img: "img/nehari.webp" },
        { id: 4, name: "Shahi-porata", price: 20, img: "img/porota.webp" },
        { id: 5, name: "Chicken Biryani", price: 220, img: "img/briani.webp" },
        { id: 6, name: "Chicken rost", price: 150, img: "img/chicken rost.webp" },
        { id: 7, name: "Special Mutton", price: 150, img: "img/mutton.webp" },
        { id: 8, name: "Special Salad", price: 100, img: "img/salad.webp" }
    ];

    function saveCartToStorage() {
        localStorage.setItem("cartData", JSON.stringify(cart));
    }

    const cartWithUpdatedImages = cart.map(item => {
        const menuItem = menuItems.find(menuItem => menuItem.name.toLowerCase() === item.name.toLowerCase());
        return menuItem && item.img !== menuItem.img ? { ...item, img: menuItem.img } : item;
    });
    if (cartWithUpdatedImages.some((item, index) => item !== cart[index])) {
        cart = cartWithUpdatedImages;
        saveCartToStorage();
    }

    function addToCart(productName, price, productImg) {
        if (!productName || !price) return;

        if (!productImg) {
            const foundItem = menuItems.find(item => item.name.toLowerCase() === productName.toLowerCase());
            productImg = foundItem ? foundItem.img : "";
        }

        const existingItem = cart.find(item => item.name === productName);

        if (existingItem) {
            existingItem.quantity += 1;
            if (!existingItem.img) existingItem.img = productImg;
        } else {
            cart.push({
                name: productName,
                price: parseFloat(price),
                quantity: 1,
                img: productImg
            });
        }

        saveCartToStorage();
        updateCartUI();
    }

    function updateCartUI() {
        if (!curtCount || !totalPriceEl || !cartItemsList) return;

        const totalItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
        curtCount.textContent = totalItemsCount;

        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        totalPriceEl.textContent = totalPrice;

        if (cart.length === 0) {
            cartItemsList.innerHTML = `<p style="text-align:center; padding:10px;">Your cart is empty!</p>`;
        } else {
            cartItemsList.innerHTML = cart.map((item, index) => {

                const matchedMenu = menuItems.find(m => m.name.toLowerCase() === item.name.toLowerCase());
                const itemImg = matchedMenu ? matchedMenu.img : item.img;

                return `
                    <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid #ddd; gap: 10px;">
                        <div style="display:flex; align-items:center; gap: 10px;">
                            ${itemImg ? `<img class="cart-item-image" src="${itemImg}" alt="${item.name}">` : ''}
                            <div>
                                <strong style="font-size: 14px;">${item.name}</strong><br>
                                <small>${item.price} TK x ${item.quantity} = <b>${item.price * item.quantity} TK</b></small>
                            </div>
                        </div>
                        <div style="display:flex; align-items:center; gap:6px;">
                            <button class="qty-btn" onclick="changeQuantity(${index}, -1)" style="padding: 2px 8px; cursor:pointer;">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="changeQuantity(${index}, 1)" style="padding: 2px 6px; cursor:pointer;">+</button>
                            <button class="remove-btn" onclick="removeFromCart(${index})" style="background:#ff4d4d; color:white; border:none; padding:4px 6px; border-radius:4px; cursor:pointer; margin-left:5px;">&times;</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    window.changeQuantity = function (index, delta) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCartToStorage();
        updateCartUI();
    };

    window.removeFromCart = function (index) {
        cart.splice(index, 1);
        saveCartToStorage();
        updateCartUI();
    };

    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", () => {
            cart = [];
            localStorage.removeItem("cartData");
            updateCartUI();
        });
    }

    if (cartIcon && orderModal) {
        cartIcon.addEventListener("click", () => {
            orderModal.style.display = "block";
        });
    }

    if (closeOrderBtn && orderModal) {
        closeOrderBtn.addEventListener("click", () => {
            orderModal.style.display = "none";
        });
    }

    if (openSearchBtn && searchModal) {
        openSearchBtn.addEventListener("click", () => {
            searchModal.style.display = "block";
            renderSearchResults(menuItems);
        });
    }

    if (closeSearchBtn && searchModal) {
        closeSearchBtn.addEventListener("click", () => {
            searchModal.style.display = "none";
        });
    }

    window.addEventListener("click", (event) => {
        if (orderModal && event.target === orderModal) orderModal.style.display = "none";
        if (searchModal && event.target === searchModal) searchModal.style.display = "none";
    });

    const menuBoxes = document.querySelectorAll(".box-con .box");
    menuBoxes.forEach(box => {
        const orderBtn = box.querySelector("button");
        const productNameEl = box.querySelector(".product h3");
        const priceEl = box.querySelector(".product p");
        const imgEl = box.querySelector(".product img");

        const productName = productNameEl ? productNameEl.innerText.trim() : "";
        const priceText = priceEl ? priceEl.innerText : "0";
        const price = priceText.replace(/[^0-9]/g, '');
        const productImg = imgEl ? imgEl.getAttribute("src") : "";

        if (orderBtn) {
            orderBtn.addEventListener("click", () => {
                addToCart(productName, price, productImg);
            });
        }
    });

    if (modalSearchInput) {
        modalSearchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            const filtered = menuItems.filter(item => item.name.toLowerCase().includes(query));
            renderSearchResults(filtered);
        });
    }

    function renderSearchResults(items) {
        if (!searchResultsList) return;

        if (items.length === 0) {
            searchResultsList.innerHTML = `<p style="padding: 10px; text-align:center;">No dishes found!</p>`;
            return;
        }

        searchResultsList.innerHTML = items.map(item => `
            <div class="search-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="search-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price} TK</p>
                </div>
                <button class="search-add-btn" data-name="${item.name}" data-price="${item.price}" data-img="${item.img}"
                        style="background-color: #4E7F4E; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
                    Add to Cart
                </button>
            </div>
        `).join('');

        document.querySelectorAll(".search-add-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const name = e.target.getAttribute("data-name");
                const price = e.target.getAttribute("data-price");
                const img = e.target.getAttribute("data-img");

                addToCart(name, price, img);
                if (searchModal) searchModal.style.display = "none";
            });
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();

            if (cart.length === 0) {
                alert("Your cart is empty! Please add some items first.");
                return;
            }

            const name = document.getElementById("name").value;
            const address = document.getElementById("address").value;

            alert(`Thank you, ${name}!\nYour order has been placed successfully.\nWe will deliver to: ${address}`);

            cart = [];
            localStorage.removeItem("cartData");
            updateCartUI();
            checkoutForm.reset();
            if (orderModal) orderModal.style.display = "none";
        });
    }

    updateCartUI();


    const orderNowBtn = document.querySelectorAll(".order-now");
    orderNowBtn.forEach(function(Btn) {
        Btn.addEventListener('click', function () {
            Swal.fire({
              
                text: 'Item added to cart!',
                icon: 'success',
                iconColor: '#09f309',
                timer: 2000,
                showConfirmButton: false,
                customClass:{
                    popup:'alert'
                }
           


            });
        });
    })
})
