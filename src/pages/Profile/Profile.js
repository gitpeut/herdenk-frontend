import React, {useContext} from 'react';
import {AuthContext} from "../../context/AuthContext";
import UserData from "../../components/UserData/UserData";
import UserGraveData from "../../components/UserGraveData/UserGraveData";
import "./Profile.css"

function Profile() {
    const {loggedIn} = useContext(AuthContext);

    return (
        <>
            {loggedIn &&
                <>
                <UserData />
                <UserGraveData accessMode="OWNER"/>
                </>
            }
        </>
    );
}

export default Profile;