import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import {AuthContext} from "../../context/AuthContext";

function UserData() {
    const {userDetails} = useContext(AuthContext);

    return (
        <>
                <h4>Gegevens</h4>

                <section>
                    <div className="profile-rowp">
                        <div className="profile-cold">Gebruikersnaam:</div>
                        <div className="profile-cold">{userDetails.fullName}</div>
                    </div>
                    <div className="profile-rowp">
                        <div className="profile-cold">Email:</div>
                        <div className="profile-cold">{userDetails.email}</div>
                    </div>
                    <Link to="/signup">Gegevens wijzigen</Link>
                </section>
        </>
    );
}

export default UserData;