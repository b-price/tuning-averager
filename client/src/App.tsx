import './App.css'
import TARouter from "./components/TARouter.tsx";
import { ClerkProvider } from '@clerk/clerk-react';


function App() {

    const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

    if (!PUBLISHABLE_KEY) {
        throw new Error("Missing Publishable Key")
    }
  return (
      <>
          <TARouter />


      </>
  )
}

export default App
