import {Link} from "react-router-dom";

export default function Index(){
    return (
        <div>
            <Link to='/sign-in' >Sign in</Link>
            <Link to='/sign-up' >Sign Up</Link>
            <Link to='/app' >App</Link>
        </div>

    )
}