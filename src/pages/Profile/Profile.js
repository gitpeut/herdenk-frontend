import React, {useContext, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {AuthContext} from "../context/AuthContext";
import axios from "axios";

function Profile() {
    const {loggedIn, userDetails} = useContext(AuthContext);

    return (
        <>
            {loggedIn &&
            <>
                <h2>Profielpagina</h2>
                <section>
                    <h2>Gegevens</h2>
                    <p><strong>Gebruikersnaam:</strong> {userDetails.fullName}</p>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                </section>
                <section>

                </section>
                <p>Terug naar de <Link to="/">Homepagina</Link></p>
            </>
            }
        </>
    );
}

export default Profile;