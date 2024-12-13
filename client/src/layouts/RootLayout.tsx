import '../App.css'
import { Outlet } from 'react-router-dom'
import {ClerkProvider, SignedIn, SignedOut} from '@clerk/clerk-react'
import TopBar from "../components/TopBar.tsx";
import ErrorBoundary from "../components/ErrorBoundary.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
}

export default function RootLayout() {

    return (
        <ErrorBoundary>
            <ClerkProvider
                publishableKey={PUBLISHABLE_KEY}
            >
                <header className="header">
                    <SignedIn>
                        <TopBar loggedIn={true} linkURL='/settings' />
                    </SignedIn>
                    <SignedOut>
                        <TopBar loggedIn={false} />
                    </SignedOut>
                </header>
                <main>
                    <Outlet />
                </main>
            </ClerkProvider>
        </ErrorBoundary>

    )
}