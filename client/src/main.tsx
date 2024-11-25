import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import RootLayout from "./layouts/RootLayout.tsx";
import SignInPage from "./routes/SignInPage.tsx";
import SignUpPage from "./routes/SignUpPage.tsx";
import SignedInLayout from "./layouts/SignedInLayout.tsx";
import TARouter from "./components/TARouter.tsx";
import Settings from "./components/Settings.tsx";
import Index from "./routes/Index.tsx";

const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            { path: '/', element: <Index /> },
            { path: '/sign-in', element: <SignInPage /> },
            { path: '/sign-up', element: <SignUpPage /> },
            {
                element: <SignedInLayout />,
                path: 'app',
                children: [
                    { path: '/app', element: <TARouter />},
                    // { path: '/app/settings', element: <Settings />}
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
