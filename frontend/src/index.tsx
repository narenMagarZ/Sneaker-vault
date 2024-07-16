import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./app";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Product from "./components/customer/product";
import Layout from "./layout";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from "@apollo/client";
import Cart from "./components/customer/cart";
import { Provider } from "react-redux";
import store from "./store";
import ProtectedRoute from "./components/customer/protectedRoute";
import Checkout from "./components/checkout";
import Order from "./components/order";
import PublicRoutes from "./components/publicRoutes";
import OrderConfirmation from "./components/orderConfirmation";

const CustomerSignIn = lazy(() => import("./components/customer/signIn"));
const CustomerJoinUs = lazy(() => import("./components/customer/joinUs"));
const Collections = lazy(() => import("./components/customer/collections"));
const Profile = lazy(() => import("./components/customer/profile"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/collections",
        element: <Collections />,
      },
      {
        path: "/product/:id",
        element: <Product />,
      },
      {
        path: "/cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/order",
        element: (
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>
        ),
      },
      {
        path:'/order-confirm/:id',
        element:(
          <ProtectedRoute>
            <OrderConfirmation/>
          </ProtectedRoute>
        )
      }
    ],
  },
  {
    path: "signin",
    element: <CustomerSignIn />,
  },
  {
    path: "joinus",
    element: <CustomerJoinUs />,
  },
  {
    path: "checkout/:id",
    element: (
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    ),
  },
]);
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:5000/graphql",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")?.trim()}`,
    },
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getProducts: {
            keyArgs: false,
            merge(existing, incoming) {
              if (!existing) return incoming;
              return {
                metaData: incoming.metaData,
                products: [...existing.products, ...incoming.products],
              };
            },
          },
        },
      },
    },
  }),
});

root.render(
  <React.StrictMode>
    <Provider store={store()}>
      <ApolloProvider client={client}>
        <Suspense fallback={<div>loading...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </ApolloProvider>
    </Provider>
  </React.StrictMode>,
);
