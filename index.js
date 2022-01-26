import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

createApp({
    data(){
        return{
            apiUrl:'https://vue3-course-api.hexschool.io/v2',
            user:{
                username:'',
                password:''
            },
        }
    },
    methods:{
        login(){
            const api =  `${this.apiUrl}/admin/signin`;
            axios.post(api,this.user)
            .then(res => {
                // 在 res.data 找到 token,expired 並設置 cookie
                const {token,expired} = res.data;
                document.cookie = `otisToken=${token};expires=${new Date(expired)}; path=/`;
                window.location = 'products.html';
            })
            .catch(err => {
                console.log(err);
                alert(err.data.message)
            })
        }
    }
}).mount('#app')