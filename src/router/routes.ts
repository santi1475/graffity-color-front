import path from "path";

const setTitle = (title: string) => {
  return title
    ? `${title} | Graffity_color - Responsive Admin Dashboard Template`
    : "Graffity_color | Responsive Admin Dashboard Template";
};

const authRoutes = [
  {
    path: "/auth/sign-in",
    name: "auth.sign-in",
    meta: {
      title: setTitle("Sign In"),
      authLogin: true,
    },
    component: () => import("@/views/auth/login.vue"),
  }
  // {
  //   path: "/products",
  //   name: "products",
  //   meta: {
  //     title: setTitle("Products"),
  //     authRequired: true,
  //     permission: 'all',
  //   },
  //   component: () => import("@/views/dashboards/ecommerce/index.vue"), //cabiar
  // }
  // {
  //   path: "/auth/register",
  //   name: "auth.register",
  //   meta: {
  //     title: setTitle("Register"),
  //   },
  //   component: () => import("@/views/auth/register.vue"),
  // },
  // {
  //   path: "/auth/reset-pass",
  //   name: "auth.reset-pass",
  //   meta: {
  //     title: setTitle("Reset Password"),
  //   },
  //   component: () => import("@/views/auth/reset-pass.vue"),
  // },
  // {
  //   path: "/auth/lock-screen",
  //   name: "auth.lock-screen",
  //   meta: {
  //     title: setTitle("Lock Screen"),
  //   },
  //   component: () => import("@/views/auth/lock-screen.vue"),
  // },
  // {
  //   path: "/auth/maintenance",
  //   name: "auth.maintenance",
  //   meta: {
  //     title: setTitle("Maintenance"),
  //   },
  //   component: () => import("@/views/auth/maintenance.vue"),
  // },
];

const errorRoutes = [
  {
    path: "/auth/error-404",
    name: "error.404",
    meta: {
      title: setTitle("Error 404"),
    },
    component: () => import("@/views/auth/error-404.vue"),
  },
  {
    path: "/auth/error-500",
    name: "error.500",
    meta: {
      title: setTitle("Error 500"),
    },
    component: () => import("@/views/auth/error-500.vue"),
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/auth/error-404",
  },
];

const dashboardRoutes = [
  {
    path: "/",
    name: "dashboards.analytics",
    meta: {
      title: setTitle("Analytics"),
      authRequired: true,
      permission: 'all',
    },
    component: () => import("@/views/dashboards/analytics/index.vue"),
  },
  {
    path: "/dashboards/ecommerce",
    name: "dashboards.ecommerce",
    meta: {
      title: setTitle("Ecommerce"),
      authRequired: true,
      permission: 'all',
    },
    component: () => import("@/views/dashboards/ecommerce/index.vue"),
  },
];

const accesRoutes = [
  {
    path: "/roles-permisos",
    name: "access.roles",
    meta: {
      title: setTitle("Roles y Permisos"),
      authRequired: true,
      permission: 'list_role',
    },
    component: () => import("@/views/roles/index.vue"), 
  },
  {
    path: "/users",
    name: "access.users",
    meta: {
      title: setTitle("Usuarios"),
      authRequired: true,
      permission: 'list_user',
    },
    component: () => import("@/views/users/index.vue"), 
  }
];
const comercialRoutes = [
  {
    path: "/categories",
    name: "categories.index",
    meta: {
      title: setTitle("Categorías"),
      authRequired: true,
      permission: 'list_categorie',
    },
    component: () => import("@/views/categories/index.vue"), 
  },
  {
    path: "/company",
    name: "company.index",
    meta: {
      title: setTitle("Empresa"),
      authRequired: true,
      permission: 'all',
    },
    component: () => import("@/views/company/index.vue"), 
  },
  {
    path: "/products/marcas",
    name: "products.marcas",
    meta: {
      title: setTitle("Registro de Marca"),
      authRequired: true,
      permission: 'register_product',
    },
    component: () => import("@/views/product/marcas.vue"), 
  },
  {
    path: "/products/register",
    name: "products.register",
    meta: {
      title: setTitle("Registro de Producto"),
      authRequired: true,
      permission: 'register_product',
    },
    component: () => import("@/views/product/register.vue"), 
  },
  {
    path: "/products",
    name: "products.list",
    meta: {
      title: setTitle("Lista de Productos"),
      authRequired: true,
      permission: 'list_product',
    },
    component: () => import("@/views/product/index.vue"), 
  }
]


export const allRoute = [
  ...authRoutes,
  ...errorRoutes,
  ...dashboardRoutes,
  ...accesRoutes,
  ...comercialRoutes,
];
