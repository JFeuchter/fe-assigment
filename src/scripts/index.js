//import '../styles/index.scss';
let global_product_loaded = {};

/**
 * Start all needed functions
 */
document.addEventListener("DOMContentLoaded", function (){
    onClickEventsInit();
    loadNextProducts("1");
    startCart();
})

/**
 * Add onclick events to needed elements
 */
function onClickEventsInit() {
    //Add onclick event to open cart
    document.querySelector("#openCart")?.addEventListener("click", evt => {
        if (typeof evt.currentTarget.dataset.openModal !== "undefined") {
            openModal("#" + evt.currentTarget.dataset.openModal);
        }
    });
}

/**
 * Start Session Cart if it does not exist
 */
function startCart() {
    let cartValue = sessionStorage.getItem( "cart" );
    let cartObj = JSON.parse( cartValue );
    if (Object.keys(cartObj).length === 0) {
        var cart = {};
        var jsonStr = JSON.stringify( cart );
        sessionStorage.setItem( "cart", jsonStr );
    } else {
        buildCart(false);
    }
}

/**
 * Add product to Cart
 * @param product_id
 */
function addToCart(product_id) {
    let cartValue = sessionStorage.getItem( "cart" );
    let cartObj = JSON.parse( cartValue );

    fetch(`http://localhost:5000/products/${product_id}`)
        .then((response) => response.json())
        .then((data) => {
            if (typeof data !== "undefined") {
                if (cartObj.hasOwnProperty(data.id)) {
                    //product already in cart product
                    cartObj[data.id]["qty"] = cartObj[data.id]["qty"] + 1;
                } else {
                    //product not in cart yet
                    cartObj[data.id] = {};
                    cartObj[data.id]["image"] = data.thumbnail;
                    cartObj[data.id]["title"] = data.title;
                    cartObj[data.id]["price"] = data.price;
                    cartObj[data.id]["qty"] = 1;
                }

                var jsonStr = JSON.stringify( cartObj );
                sessionStorage.setItem( "cart", jsonStr );

                buildCart(true);
            } else {
                alert("No Product found");
            }
        });
}

/**
 * Remove Items from cart
 * @param product_id
 */
function removeItemFromCart(product_id) {
    let cartValue = sessionStorage.getItem( "cart" );
    let cartObj = JSON.parse( cartValue );
    if (cartObj.hasOwnProperty(product_id)) {
        delete cartObj[product_id];
    } else {
        alert("Error when removing product not in cart?");
    }

    var jsonStr = JSON.stringify( cartObj );
    sessionStorage.setItem( "cart", jsonStr );

    buildCart(true);
}

/**
 * Build cart
 * @param openCart
 */
function buildCart(openCart = false) {
    let cartValue = sessionStorage.getItem( "cart" );
    let cartObj = JSON.parse( cartValue );
    let cart_item_html_string_template = `
        <div class="cart_item">
            <div class="product_img">
                <img src="{{img_src}}" alt="{{img_alt}}">
            </div>
            <div class="product_info">
                <div class="product_title">
                    {{product_title}}
                </div>
                <div class="product_price">
                    {{product_price}}
                </div>
                <div class="product_qty">
                    Qty: <span>{{item_qty}}</span>
                </div>
            </div>
            <div class="product_atc_btn" onclick="removeItemFromCart('{{product_id}}')">
                Remove
            </div>
        </div>`;

    document.querySelector(".cart_items_wrapper").innerHTML = "";

    for (const key in cartObj) {
        let item = cartObj[key];
        let wrapper_element = document.createElement("div");
        let new_item = cart_item_html_string_template
        new_item = new_item.replace("{{img_src}}", item.image);
        new_item = new_item.replace("{{img_alt}}", item.title);
        new_item = new_item.replace("{{product_title}}", item.title);
        new_item = new_item.replace("{{product_price}}", `$ ${(item.price * item.qty).toFixed(2)}`);
        new_item = new_item.replace("{{item_qty}}", item.qty);
        new_item = new_item.replace("{{product_id}}", key);

        wrapper_element.innerHTML = new_item;

        document.querySelector(".cart_items_wrapper").appendChild(wrapper_element.querySelector(".cart_item"));
    }

    if (openCart) {
        openModal("#cart_modal");
    }
}

/**
 * Load First products to page
 */
function loadNextProducts(page) {
    let load_more_btn = document.querySelector(".load_more_button");

    load_more_btn.setAttribute("disabled", "disabled");

    let product_html_string_template = `
        <div class="product_item">
            <div class="product_img">
                <img src="{{img_src}}" alt="{{img_alt}}">
            </div>
            <div class="product_info">
                <div class="product_title">
                    {{product_title}}
                </div>
                <div class="product_price">
                    {{product_price}}
                </div>
            </div>
            <div class="product_atc_btn" onclick="addToCart('{{product_id}}');">
                ADD TO CART
            </div>
        </div>`;

    fetch(`http://localhost:5000/products?_page=${page}&_limit=6`)
        .then((response) => response.json())
        .then((data) => {
            if (typeof data !== "undefined" && data.length >= 1) {
                let wrapper_element = document.createElement("div");
                data.forEach(product => {
                    let new_product = product_html_string_template
                    new_product = new_product.replace("{{img_src}}", product.images[0]);
                    new_product = new_product.replace("{{img_alt}}", product.title);
                    new_product = new_product.replace("{{product_title}}", product.title);
                    new_product = new_product.replace("{{product_price}}", `$ ${(product.price).toFixed(2)}`);
                    new_product = new_product.replace("{{product_id}}", product.id);

                    wrapper_element.innerHTML = new_product;

                    document.querySelector(".product_container").appendChild(wrapper_element.querySelector(".product_item"));
                });

                let next_page_int = parseInt(page) + 1;
                document.querySelector(".load_more_button").setAttribute("data-page", `${next_page_int}`);
                load_more_btn.removeAttribute("disabled");
            } else {
                alert("No more Products");
            }
        });
}

/**
 * Open modal given by element id.
 * @param element_id
 */
function openModal(element_id) {
    document.querySelector(element_id)?.classList.add("is_open");
}

/**
 * Close Modal
 * @param element_id
 */
function closeModal(element_id) {
    document.querySelector(element_id)?.classList.remove("is_open");
}