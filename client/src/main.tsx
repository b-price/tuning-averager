import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import RootLayout from "./layouts/RootLayout.tsx";
import SignInPage from "./routes/SignInPage.tsx";
import SignUpPage from "./routes/SignUpPage.tsx";
import SignedInLayout from "./layouts/SignedInLayout.tsx";
import Initialize from "./components/Initialize.tsx";
import Settings from "./components/Settings.tsx";


const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            { path: '/sign-in', element: <SignInPage /> },
            { path: '/sign-up', element: <SignUpPage /> },
            {
                element: <SignedInLayout />,
                path: '',
                children: [
                    { path: '/', element: <Initialize />},
                    { path: '/settings', element: <Settings />}
                ]
            }
        ]
    }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>

          <RouterProvider router={router} />

  </StrictMode>,
)
