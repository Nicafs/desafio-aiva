import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "../components/Layout/Layout";
import Loading from "../components/Loading";

// Lazy-loaded pages
const Home = lazy(() => import("../pages/Home/Home"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));
const User = lazy(() => import("../pages/User/User"));
const Product = lazy(() => import("../pages/product/Product/Product"));
const UserForm = lazy(() => import("../pages/User/UserForm/UserForm"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading fullscreen />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "home",
        element: (
          <Suspense fallback={<Loading fullscreen />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "products",
        element: (
          <Suspense fallback={<Loading fullscreen />}>
            <Product />
          </Suspense>
        ),
      },
      {
        path: "users",
        element: (
          <Suspense fallback={<Loading fullscreen />}>
            <User />
          </Suspense>
        ),
      },
      {
        path: "user/:id",
        element: (
          <Suspense fallback={<Loading fullscreen />}>
            <UserForm />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<Loading fullscreen />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
