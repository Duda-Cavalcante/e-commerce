import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import StoreProductsView from '@/views/StoreProductsView';
import StoreProductView from '@/views/StoreProductView';
import StoreCart from '@/views/StoreCart';
import AuthPage from '@/views/AuthPage';
import LoginView from '@/views/LoginView';
import StoreCheckout from '@/views/StoreCheckout';
import NewAccount from '@/views/NewAccount';

const routes = [
  { path: '/', component: HomeView },
  { path: '/loja/:slug/produtos', component: StoreProductsView },
  { path: '/loja/:slug/produtos/:produto_id', component: StoreProductView },
  { path: '/loja/:slug/carrinho', component: StoreCart },
  { path: '/loja/:slug/valida_usuario', component: AuthPage },
  { path: '/loja/:slug/login', component: LoginView },
  { path: '/loja/:slug/checkout', component: StoreCheckout },
  { path: '/loja/:slug/nova_conta', component: NewAccount },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;


