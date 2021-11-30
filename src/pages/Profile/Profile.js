import React, {useContext, useState} from 'react';
import {AuthContext} from "../../context/AuthContext";
import UserData from "../../components/UserData/UserData";
import UserGraveData from "../../components/UserGraveData/UserGraveData";
import "./Profile.css"

function Profile() {
    const {loggedIn} = useContext(AuthContext);
    const [update, setUpdate] = useState();


    return (
        <>
            {loggedIn &&
            <>
                <UserData/>
                <UserGraveData setUpdate={setUpdate} update={update}/>
            </>
            }
        </>
    );
}

export default Profile;