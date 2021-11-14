import React, {useContext,useEffect,useState} from 'react';
import {AuthContext} from "../../context/AuthContext";
import {Link} from 'react-router-dom';
import './UserGraveData.css';
import GraveSummary from "./GraveSummary";
import plus from "../../assets/png/plus.png";


function UserGraveData( {accessMode,update, setUpdate} ) {
    const {userDetails} = useContext(AuthContext);
    const [myGraveList, setMyGraveList] = useState([]);

    useEffect(
        () => {
            function getGraveNumbers() {
                const list = userDetails.authorities.filter( a => a.authority === accessMode );
                setMyGraveList(list);
            }
            if ( userDetails.authorities )getGraveNumbers();
        } ,[update, accessMode,userDetails ]);


    return (
        <>
            <h4>Mijn graven</h4>
            <div className="ug-row">
                {myGraveList.map((a) => {
                        return (<GraveSummary graveId={a.graveId} setUpdate={setUpdate} update={update} key={`summary-${a.graveId}`}/>);
                    }
                )}
                <Link to={`/newgrave`}>
                <img src={plus} className="ug-img-down" alt="Maak een graf" title="Maak een graf"/>
                </Link>
            </div>
        </>
    );
}

export default UserGraveData;