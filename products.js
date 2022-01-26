import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

let productModal = null;
let delProductModal = null;
// 先宣告 2 個 modal 避免 mounted 時噴錯

createApp({
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'otispath',
            products: [],
            isNew: false,
            editProduct: {
                imagesUrl: [],
            },
        }
    },
    mounted() {
        productModal = new bootstrap.Modal(document.querySelector('#productModal'), {
            keyboard: false
        });
        delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'), {
            keyboard: false
        });
        // 取出 Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)otisToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = token;
        this.checkAdmin();
    },
    methods: {
        checkAdmin() {
            axios.post(`${this.apiUrl}/api/user/check`)
                .then(res => {
                    this.getProductsData()
                })
                .catch(err => {
                    alert(err.data.message);
                    window.location = 'index.html';
                });
        },
        getProductsData() {
            axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
                .then(res => {
                    this.products = res.data.products;
                })
                .catch(err => {
                    alert(err.data.message);
                });
        },
        openModal(isNew, item) {
            if (isNew === 'delete') {
                this.editProduct = { ...item };
                delProductModal.show();
            } else if (isNew === 'new') {
                this.isNew = true;
                this.editProduct = { imagesUrl: [] }; // 清空 editProduct 的資料 
                productModal.show();
            } else if (isNew === 'edit') {
                this.isNew = false;
                this.editProduct = { ...item };
                productModal.show();
            }
        },
        updateProduct() {
            let act = '';
            let url = '';
            if (this.isNew) {
                act = 'post';
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            } else {
                act = 'put';
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.editProduct.id}`;
            };
            axios[act](url, { data: this.editProduct })
                .then(res => {
                    alert(res.data.message);
                    this.getProductsData();
                    productModal.hide();
                })
                .catch(err => {
                    alert(err.data.message);
                })
        },
        deleteProduct() {
            const id = this.editProduct.id;
            axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${id}`)
                .then(res => {
                    alert(res.data.message);
                    this.getProductsData();
                    delProductModal.hide();
                })
                .catch(err => {
                    alert(err.data.message);
                });
        },
        createImagesUrl(){
            this.editProduct.imagesUrl = [];
            this.editProduct.imagesUrl.push('');
        }
    }
}).mount("#app");