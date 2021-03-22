import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/customers",
    name: "Home"
  },
  {
    path: "/customers",
    name: "customers",
    component: () => import("@/views/Customers/")
  },
  {
    path: "/customers/:id",
    name: "customerDetails",
    component: () => import("@/views/Customers/details.vue")
  },

  {
    path: "/categories",
    name: "categories",

    component: () => import("../views/Categories")
  },
  {
    path: "/categories/:id",
    name: "categoryDetails",
    component: () => import("@/views/Categories/details.vue")
  },
  {
    path: "/sorted-categories",
    name: "sortedCategories",

    component: () => import("../views/Categories/sorted-categories.vue")
  },
  {
    path: "/products",
    name: "products",

    component: () => import("../views/Products")
  },
  {
    path: "/products/:id",
    name: "productDetails",
    component: () => import("@/views/Products/details.vue")
  },
  {
    path: "*",
    name: "notFound",

    component: () => import("../views/NotFound.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
