import React, {useContext} from 'react';
import {useHistory, Link} from 'react-router-dom';
import {AuthContext} from "../../context/AuthContext";
import ShowLogo from "../Logo/Logo";
import './NavBar.css';

function NavBar() {
    const history = useHistory();
    let {logout, loggedIn, user} = useContext(AuthContext);


    return (
        <nav>
            <Link to="/">
                <ShowLogo size="small-logo-only"/>
            </Link>

            <div>
                {!loggedIn && !window.location.href.endsWith("/signin") &&
                <>
                    <button
                        type="button"
                        onClick={() => history.push('/signin')}
                    >
                        Log in
                    </button>
                </>
                }
                {loggedIn &&
                <>
                    <p className="little-black">Logged in as {user}</p>
                    <button
                        type="button"
                        onClick={() => {
                            logout();
                            history.push('/');
                        }}
                    >
                        Log out
                    </button>
                </>
                }
            </div>
        </nav>
    );
}

export default NavBar;