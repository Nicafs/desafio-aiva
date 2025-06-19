# AIVA Challenge — React Admin Panel

Welcome to the AIVA Challenge!  
This project is a modern, fully-typed React + TypeScript admin panel, designed for technical evaluation and real-world scalability. It demonstrates best practices in architecture, componentization, state management, API integration, and automated testing.

---

## 🚀 **Tech Stack**

- **React 18** (with functional components & hooks)
- **TypeScript** (strict typing everywhere)
- **Vite** (fast dev/build tool)
- **Material UI (MUI)** (UI components & theming)
- **React Query** (data fetching, caching, mutations)
- **Zustand** (global state management for auth)
- **Zod** (schema validation for forms)
- **React Hook Form** (form state & validation)
- **Jest + React Testing Library** (unit tests)
- **Axios** (HTTP client)
- **ESLint & Prettier** (code quality & formatting)

---

## 🗂️ **Project Structure**

```
src/
  api/             # Axios config
  assets/          # Static assets (images, etc)
  auth/            # Authentication components
  components/      # Shared UI components (Layout, Loading, PageError, etc)
  hooks/           # Custom React hooks (data fetching, filtering, etc)
  pages/           # Main app pages (Home, Product, User, NotFound)
  routes/          # App routes
  services/        # API service layers
  store/           # Zustand stores
  theme/           # MUI theme customization
  types/           # TypeScript types/interfaces
  utils/           # Utility functions
```

---

## 📄 **Pages Overview**

### **Home**

- Product catalog with filtering and sorting.
- Filter by category (sidebar), sort by title, price, or category.
- Responsive product cards with image, description, price, and category.
- Loading skeletons and empty state handling.

### **Product**

- Admin grid for managing products.
- Add, edit, and delete products (with confirmation).
- Product form with validation (title, price, description, image URL, category).
- Inline feedback for errors and loading.
- Uses dialogs for create/edit.

### **User**

- Admin grid for managing users.
- Add, edit, and filter users by name, email, and role.
- User form with validation (name, email, password, role, avatar URL).
- Table with sorting and pagination.
- Inline feedback for errors and loading.

### **NotFound**

- Friendly 404 page for unmatched routes.

---

## 🧑‍💻 **How to Run Locally**

### **1. Clone the repository**

```sh
git clone https://github.com/Nicafs/desafio-aiva
cd desafio-aiva
```

### **2. Install dependencies**

```sh
npm install
# or
yarn
```

### **3. Configure environment variables**

Create a `.env` file based on the example below:

```sh
cp .env.example .env
```

Example `.env.example`:
```
VITE_API_URL=https://your-api-url.com
```

### **4. Start the development server**

```sh
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) (default Vite port).

### **5. Run tests**

```sh
npm test
# or
yarn test
```

---

## 🛠️ **Configuration**

- **API endpoints** are configured in `src/api/axios.ts` and `src/services/`.
- **Theme customization** is in `src/theme/theme.ts`.
- **Environment variables** (if needed) can be set in a `.env` file.

---

## 🧪 **Testing**

- All main components and pages have unit tests using Jest and React Testing Library.
- Run `npm test` to execute the test suite.
- Mocks are used for API and store dependencies.

---

## ✨ **Features & Highlights**

- **Type-safe**: All code is written in TypeScript with strict types.
- **Modern UI**: Material UI with custom theming.
- **Reusable components**: Sidebar, Header, Dialogs, Cards, Tables, etc.
- **Form validation**: Zod + React Hook Form for robust validation.
- **API integration**: Axios + React Query for efficient data fetching and caching.
- **State management**: Zustand for authentication state.
- **Responsive**: Layout adapts to different screen sizes.
- **Error handling**: User-friendly error and loading states everywhere.
- **Testing**: High coverage with unit tests.

---

## 🌐 **Production URL**

The project is deployed and available at:  
**[https://desafio-aiva.vercel.app]**  
_(replace with your actual deploy URL)_

---

## ⚡ **Why Vite?**

Vite was chosen for this project because it offers a lightning-fast development experience, instant hot module replacement, and optimized builds out of the box. Its simplicity and performance make it ideal for modern React + TypeScript applications, especially when compared to older tools like CRA or Webpack.

---

## 📚 **Extra Notes**

- All UI text is in English.
- The project is ready for further extension (e.g., i18n, more entities, etc).
- Follows best practices for code style, structure, and maintainability.

---

## 👤 **Author**

- [Nicollas Santos]
- [nicollas.comp@gmail.com]
- [LinkedIn: [https://www.linkedin.com/in/nicollas-santos-front-end] / GitHub: [https://github.com/Nicafs]

---

## 📢 **Feedback**

If you have any questions or suggestions, feel free to open an issue or contact me directly!

Good luck with your evaluation and thank you for reviewing this project!