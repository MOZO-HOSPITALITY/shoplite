import { createRouter, createWebHistory } from 'vue-router';
import CartView from './views/CartView.vue';
import CheckoutView from './views/CheckoutView.vue';
import HomeView from './views/HomeView.vue';
import NotFoundView from './views/NotFoundView.vue';
import OrderView from './views/OrderView.vue';
import ProductView from './views/ProductView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/products/:id(\\d+)', name: 'product', component: ProductView, props: (route) => ({ id: Number(route.params.id) }) },
    { path: '/cart', name: 'cart', component: CartView },
    { path: '/checkout', name: 'checkout', component: CheckoutView },
    { path: '/orders/:id', name: 'order', component: OrderView, props: true },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.path === from.path) return false;
    return { top: 0 };
  },
});
