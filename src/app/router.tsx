import { createBrowserRouter, Navigate } from "react-router"

import { LoginPage, redirectIfSignedIn, requireAdmin } from "@/features/auth"
import { DashboardPage } from "@/features/dashboard"
import { TransactionsPage } from "@/features/transactions"

import { AppLayout } from "./layouts/app-layout"
import { LoadingScreen } from "./loading-screen"
import { RootLayout } from "./layouts/root-layout"
import { NotFoundPage } from "./not-found-page"

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    HydrateFallback: LoadingScreen,
    children: [
      { path: "/login", loader: redirectIfSignedIn, Component: LoginPage },
      {
        path: "/",
        loader: requireAdmin,
        Component: AppLayout,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          {
            path: "dashboard",
            Component: DashboardPage,
            handle: { title: "Dashboard" },
          },
          {
            path: "transactions",
            Component: TransactionsPage,
            handle: { title: "Transactions" },
          },
          { path: "*", Component: NotFoundPage },
        ],
      },
    ],
  },
])
