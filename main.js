Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
       <div class="product">
           <div class="product-image">
               <img :src="image" />
           </div>

           <div class="product-info">
               <h1>{{ title }}</h1>
               <p v-if="inStock">In Stock</p>
               <p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>
               <p v-show="onSale">{{ sale }}</p>
               <p>Shipping: {{ shipping }}</p>
               <ul>
                   <li v-for="detail in details">{{ detail }}</li>
               </ul>
               <div class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor: variant.variantColor }"
                    @mouseover="updateProduct(index)">

               </div>
               <button v-on:click="addToCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }">Add to cart</button>
               <button @click="removeFromCart">Remove from cart</button>
               
               <div class="cart">
                   <p>Cart({{ cart }})</p>
                </div>
           </div>
       </div>    
    `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            onSale: true,
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: "./assets/vmSocks-green.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "./assets/vmSocks-blue.jpg",
                    variantQuantity: 0
                }
            ],
            selectedVariant: 0,
            cart: 0
        }
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        removeFromCart() {
            this.cart -= 1
        },
        updateProduct(index) {
            this.selectedVariant = index
            console.log(index)
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale() {
            return this.brand + ' ' + this.product + ' are ' + (this.onSale?'':'not ') + 'on sale!'
        },
        shipping() {
            return this.premium ? "Free":2.99
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        premium: true
    }
})