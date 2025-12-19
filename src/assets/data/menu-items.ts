import type { MenuItemType } from "@/types/menu";

export const MENU_ITEMS: MenuItemType[] = [
  {
    key: "main",
    label: "Menu / Grafity",
    isTitle: true,
  },
  {
    key: "dashboards",
    icon: "iconoir-home-simple",
    label: "Dashboards",
    children: [
      {
        key: "dashboard-analytics",
        label: "Analytics",
        route: { name: "dashboards.analytics" },
        parentKey: "dashboards",
      },
      {
        key: "dashboard-ecommerce",
        label: "Ecommerce",
        route: { name: "dashboards.ecommerce" },
        parentKey: "dashboards",
      },
    ],
  },
  {
    key: "Accesos",
    label: "ACCESS",
    isTitle: true,
  },
  {
    key: "roles",
    icon: "fas fa-unlock",
    label: "Roles y Permisos",
    route: { name: "access.roles" },
    parentKey: "roles",
  },
  {
    key: "usuarios",
    icon: "fas fa-users",
    label: "Usuarios",
    route: { name: "dashboards.ecommerce" },
    parentKey: "usuarios",
  },
  {
    key: "Comercial",
    label: "COMERCIAL",
    isTitle: true,
  },
  {
    key: "categories",
    icon: "fas fa-life-ring",
    label: "Categorias",
    route: { name: "dashboards.ecommerce" },
    parentKey: "categories",
  },
  {
    key: "products",
    label: "Productos",
    isTitle: false,
    icon: "fas fa-qrcode",
    children: [
      {
        key: "register_product",
        label: "Registrar",
        route: { name: "dashboards.ecommerce" },
        parentKey: "products",
      },
      {
        key: "list_products",
        label: "Listar",
        route: { name: "dashboards.ecommerce" },
        parentKey: "products",
      },
    ],
  },
  {
    key: "clients",
    icon: "fas fa-user-plus",
    label: "Clientes",
    route: { name: "dashboards.ecommerce" },
    parentKey: "clients",
  },
  {
    key: "sales",
    label: "Ventas",
    isTitle: false,
    icon: "fas fa-money-check-alt",
    children: [
      {
        key: "register_sale",
        label: "Registrar",
        route: { name: "dashboards.ecommerce" },
        parentKey: "sales",
      },
      {
        key: "list_sales",
        label: "Listar",
        route: { name: "dashboards.ecommerce" },
        parentKey: "sales",
      },
    ],
  },
  // {
    //   key: "page-authentication",
    //   label: "Authentication",
    //   isTitle: false,
    //   icon: "iconoir-fingerprint-lock-circle",
    //   children: [
    //     {
    //       key: "login",
    //       label: "Log In",
    //       route: { name: "auth.sign-in" },
    //       parentKey: "page-authentication",
    //     },
    //     {
    //       key: "register",
    //       label: "Register",
    //       route: { name: "auth.register" },
    //       parentKey: "page-authentication",
    //     },
    //     {
    //       key: "reset-pass",
    //       label: "Re-Password",
    //       route: { name: "auth.reset-pass" },
    //       parentKey: "page-authentication",
    //     },
    //     {
    //       key: "lock-screen",
    //       label: "Lock Screen",
    //       route: { name: "auth.lock-screen" },
    //       parentKey: "page-authentication",
    //     },
    //     {
    //       key: "maintenance",
    //       label: "Maintenance",
    //       route: { name: "auth.maintenance" },
    //       target: "_blank",
    //       parentKey: "page-authentication",
    //     },
    //     {
    //       key: "error-404",
    //       label: "Error 404",
    //       route: { name: "error.404" },
    //       parentKey: "page-authentication",
    //     },
    //     {
    //       key: "error-500",
    //       label: "Error 500",
    //       route: { name: "error.500" },
    //       parentKey: "page-authentication",
    //     },
    //   ],
  // },
];
