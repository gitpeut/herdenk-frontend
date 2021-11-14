import React, {useContext} from 'react';
import './ToProfile.css'
import head from '../../assets/account.png';
import {AuthContext} from "../../context/AuthContext";
import {useLocation, Link} from "react-router-dom";

function ToProfile() {
    const {loggedIn} = useContext(AuthContext);
    let currentPath = useLocation().pathname;
    const sizeClass = 'ToProfile-small-only';
    const logoTitle = 'Persoonlijke gegevens';
    return (
        <>
            {loggedIn && !currentPath.endsWith('/profile') &&
            <Link to="/profile">
            <span className="ToProfile-div">
            <img src={head} className={sizeClass} alt="Personal page" title={logoTitle}/>
        </span>
            </Link>
            }
        </>
    );
}

export default ToProfile;