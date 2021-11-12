import React, {useContext,useEffect,useState} from 'react';
import {AuthContext} from "../../context/AuthContext";
import './UserGraveData.css';
import GraveSummary from "./GraveSummary";

function UserGraveData( {accessMode} ) {
    const {userDetails} = useContext(AuthContext);
    const [myGraveList, setMyGraveList] = useState([]);

    useEffect(
        () => {
            function getGraveNumbers() {
                console.log( "Getting grave numbers");

                const list = userDetails.authorities.filter( a => a.authority === accessMode );
                setMyGraveList(list);
            }
            if ( userDetails.authorities )getGraveNumbers();
        } ,[ userDetails.authorities, accessMode ]);


    return (
        <>
            <h4>Mijn graven</h4>
            <div className="ug-row">
                {myGraveList.map((a) => {
                        return (<GraveSummary graveId={a.graveId} key={`summary-${a.graveId}`}/>);
                    }
                )}
            </div>
        </>
    );
}

export default UserGraveData;