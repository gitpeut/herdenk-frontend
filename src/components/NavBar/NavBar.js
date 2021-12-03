import React, {useContext} from 'react';
import {useLocation, useHistory, Link} from 'react-router-dom';
import {AuthContext} from "../../context/AuthContext";
import ShowLogo from "../Logo/Logo";
import ToProfile from "../ToProfile/ToProfile";
import './NavBar.css';
import login from '../../assets/png/login.png';
import loguit from '../../assets/png/logout.png';

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
                    <img src={login}
                         className="loginout"
                         alt="login"
                         title="log in"
                         onClick={() => history.push('/signin')}
                    />
                </>
                }
                {loggedIn &&
                <>
                    <div className="nav-row">
                        <ToProfile/>
                        <img src={loguit}
                             className="loginout"
                             alt="logout"
                             title="log uit"
                             onClick={() => {
                                 logout();
                                 history.push('/');
                             }}
                        />
                    </div>
                    <div className="nav-small">Ingelogd als {user}</div>
                </>
                }

            </div>
        </nav>
    );
}

export default NavBar;