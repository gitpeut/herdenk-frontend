import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import './UserGraveData.css';
import GraveDetails from "./GraveDetails";
import plus from "../../assets/png/plus.png";
import backendHost from "../../helpers/backendHost";
import axios from "axios";


function UserGraveData({update, setUpdate}) {
    const [myGraveList, setMyGraveList] = useState([]);

    useEffect(
        () => {
            async function getGraves() {
                await getGraveList();
            }

            getGraves();
        }, [update]);

    async function getGraveList() {
        try {
            const JWT = localStorage.getItem('herdenkToken');
            const URL = `http://${backendHost()}/api/v1/users/me`;
            const config = {headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + JWT}};

            const result = await axios.get(URL, config);

            const list = result.data.authorities.filter(a => a.authority === 'OWNER');
            setMyGraveList(list);

        } catch (e) {
            if (e.response) {
                console.log(' Error getting graves ', e.response.data);
            }
            console.log(' Error getting gravelist');
        }
    }


    return (
        <>
            <h4>Mijn graven</h4>
            <Link to={`/newgrave`}>
                <button className="ug-button" id="newGrave"
                        key={`8new`}>
                    <img className="ug-button-img" id="newGrave-img" src={plus}
                         alt="Nieuw graf maken"
                         title="Maak een nieuw graf" key={`8new-image`}/>
                </button>
            </Link>
            <div className="ug-row" key="graveRow">
                {myGraveList.map((a) => {
                        return (<GraveDetails graveId={a.graveId} setUpdate={setUpdate} update={update}
                                              key={`summary-${a.graveId}`}/>);
                    }
                )}

            </div>
        </>
    );
}

export default UserGraveData;