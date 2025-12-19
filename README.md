# Graffity Color Frontend

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Vue](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat&logo=vuedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat&logo=vite)

## 📖 About The Project

**Graffity Color** is a modern web application built with the **Vue 3** ecosystem and **TypeScript**. It utilizes **Vite** for a fast development experience and optimized production builds. The application features a robust UI based on Bootstrap 5, interactive dashboards with various charting libraries, map integrations, and comprehensive form handling.

## 🔗 Backend Repository

This repository hosts the **Frontend** client. The server-side logic, API endpoints, and database configurations can be found in the Backend repository linked below:

> **Backend Repository:** [https://github.com/santi1475/backend_graffity.git](https://github.com/santi1475/backend_graffity.git)

---

## 🛠️ Technologies & Stack

### Core Framework
* **[Vue 3](https://vuejs.org/)**: The progressive JavaScript framework.
* **[TypeScript](https://www.typescriptlang.org/)**: Strongly typed JavaScript.
* **[Vite](https://vitejs.dev/)**: Next Generation Frontend Tooling.
* **[Pinia](https://pinia.vuejs.org/)**: The intuitive store for Vue.js (State Management).
* **[Vue Router](https://router.vuejs.org/)**: The official router for Vue.js.

### UI & Styling
* **[Bootstrap 5](https://getbootstrap.com/)**: Powerful, extensible, and feature-packed frontend toolkit.
* **Bootstrap Vue Next**: Bootstrap components for Vue 3.
* **Sass**: CSS with superpowers.
* **SweetAlert2**: A beautiful, responsive, customizable replacement for JavaScript's popup boxes.

### Data Visualization & Charts
* **ApexCharts** & **Vue3-ApexCharts**: Interactive graphing library.
* **Chart.js**: Simple yet flexible JavaScript charting.
* **JustGage**: Handy library for generating and animating gauges.

### Maps
* **Leaflet**: Leading open-source JavaScript library for mobile-friendly interactive maps.
* **JsVectorMap**: A JavaScript library for creating interactive vector maps.
* **Vue3 Google Map**: Google Maps integration.

### Forms, Calendars & Utilities
* **@vuelidate**: Model-based validation for Vue.js.
* **Yup**: Schema builder for value parsing and validation.
* **FullCalendar**: The most popular JavaScript Calendar.
* **Axios**: Promise-based HTTP client for the browser.
* **Flatpickr**: Lightweight and powerful datetime picker.
* **VueUp Quill**: A Quill editor component for Vue 3.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (Version 20+ recommended)
* npm or yarn

### Installation

1.  **Clone the repository**
    ```sh
    git clone [https://github.com/your-username/graffity-color-front.git](https://github.com/your-username/graffity-color-front.git)
    cd graffity-color-front
    ```

2.  **Install dependencies**
    ```sh
    npm install
    # or if you use yarn
    yarn install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file in the root directory based on the `.env.example` (if available) to configure your backend API connection.

---

## 💻 Usage & Scripts

The `package.json` includes the following scripts for development and production:

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server using Vite. |
| `npm run build` | Runs `vue-tsc` for type checking and builds the application for production. |
| `npm run preview` | Locally preview the production build. |
| `npm run type-check`| Runs TypeScript type checking (`vue-tsc`). |
| `npm run format` | Formats the source code using Prettier. |

### Running Development Server
```sh
npm run dev
```

### Building for Production
```
npm run build
```
## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request