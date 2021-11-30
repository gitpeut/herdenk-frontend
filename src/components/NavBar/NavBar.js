import React, {useContext} from 'react';
import {useLocation, useHistory, Link} from 'react-router-dom';
import {AuthContext} from "../../context/AuthContext";
import ShowLogo from "../Logo/Logo";
import ToProfile from "../ToProfile/ToProfile";
import './NavBar.css';

function NavBar() {
    const history = useHistory();
    const {logout, loggedIn, user} = useContext(AuthContext);
    let currentPath = useLocation().pathname;
    return (
        <nav>
            <Link to="/">
                <ShowLogo size="small-logo-only"/>
            </Link>
            <div>
                {!loggedIn && !currentPath.endsWith("/signin") &&
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
                    <p className="little-black">Ingelogd als {user}</p>
                    <button
                        type="button"
                        onClick={() => {
                            logout();
                            history.push('/');
                        }}
                    >
                        Log uit
                    </button>
                </>
                }
                <ToProfile/>
            </div>
        </nav>
    );
}

export default NavBar;