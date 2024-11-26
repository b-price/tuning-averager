import './App.css'
import TARouter from "./components/TARouter.tsx";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";


function App() {
  return (
      <>
          <header>
              <SignedOut>
                  <SignInButton/>
              </SignedOut>
              <SignedIn>
                  <TARouter/>
                  <UserButton/>
              </SignedIn>
          </header>
      </>
  )
}

export default App
