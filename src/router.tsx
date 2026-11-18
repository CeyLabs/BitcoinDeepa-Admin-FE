import { createBrowserRouter, Navigate } from "react-router"

import { AppLayout } from "@/components/layout/app-layout"
import { RootLayout } from "@/components/layout/root-layout"
import { DashboardPage } from "@/pages/dashboard"
import { LoginPage } from "@/pages/login"
import { NotFoundPage } from "@/pages/not-found"

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      { path: "/login", Component: LoginPage },
      {
        path: "/",
        Component: AppLayout,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: "dashboard", Component: DashboardPage },
          { path: "*", Component: NotFoundPage },
        ],
      },
    ],
  },
])
