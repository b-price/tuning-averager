import { useAuth } from '@clerk/clerk-react'
import { Outlet } from 'react-router-dom'

export default function SignedInLayout() {
    // const { userId, isLoaded } = useAuth()
    const { isLoaded } = useAuth()
    // const navigate = useNavigate()
    //
    // React.useEffect(() => {
    //     if (isLoaded && !userId) {
    //         navigate('/sign-in')
    //     }
    // }, [isLoaded])

    if (!isLoaded) return 'Loading.'

    return <Outlet />
}