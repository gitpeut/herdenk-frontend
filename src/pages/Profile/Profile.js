import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from "../../context/AuthContext";
import UserData from "../../components/UserData/UserData";
import UserGraveData from "../../components/UserGraveData/UserGraveData";
import "./Profile.css"

function Profile() {
    const {loggedIn, login} = useContext(AuthContext);
    const [update, setUpdate] = useState();

    useEffect(
        () => {
            login();
        }, [update]);

    return (
        <>
            {loggedIn &&
            <>
                <UserData/>
                <UserGraveData accessMode="OWNER" setUpdate={setUpdate} update={update}/>
            </>
            }
        </>
    );
}

export default Profile;