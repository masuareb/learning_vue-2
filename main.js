Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        }
    },
    template: `
        <div>
            <span class="tab" v-for="(tab, index) in tabs" :key="index"
                @click="selectedTab = tab"
                :class="{ activeTab: selectedTab === tab }">{{ tab }}</span>

           <div v-show="selectedTab === 'Review'">
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                    </li>
                </ul>
           </div>
           <div v-show="selectedTab === 'Make a Review'">
                <product-review @review-submitted="addReview"></product-review>
           </div>
           
        </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})

Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" placeholder="name">
            </p>
            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review"></textarea>
            </p>
            
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>
            
            <p>
                <input type="submit" value="Submit">
            </p>
            <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors">{{ error }}</li>
                </ul>
            </p>
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            }
            else {
                if (!this.name) this.errors.push("name required.")
                if (!this.review) this.errors.push("Review required.")
                if (!this.rating) this.errors.push("Rating required")
            }
        }
    }
})

Vue.component('product-details', {
    props: {
        details: Array,
        required: true
    },
    template: `
               <ul>
                   <li v-for="detail in details">{{ detail }}</li>
               </ul>
    `
})

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
               <product-details :details="details"></product-details>
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
               
           </div>
           <product-tabs :reviews="reviews"></product-tabs>
           
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
            reviews: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index
            console.log(index)
        },
        addReview(productReview) {
            this.reviews.push(productReview)
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
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        removeCart(id) {
            this.cart.splice(this.cart.indexOf(id), 1)
        }
    }
})