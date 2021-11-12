import React, {useEffect,useState} from 'react';
import axios from "axios";
import {Link} from 'react-router-dom';
import backendHost from "../../helpers/backendHost";
import formatDate from "../../helpers/formatDate";
import './UserGraveData.css';
import stone from '../../assets/png/stone_white.png';

function GraveSummary( {graveId} ) {
    const [graveData, setGraveData] = useState({});

    useEffect(
        () => {
            async function getGrave(graveId) {
                try {
                    const JWT = localStorage.getItem('herdenkToken');
                    const graveURL = `http://${backendHost()}/api/v1/graves/${graveId}`;

                    const result = await axios.get(graveURL, {
                        headers:
                            {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + JWT
                            }
                    });

                    const key = `grave-${ result.data.graveId}`;
                    const occupant = result.data.occupantFullName;
                    const NLDate = formatDate( result.data.creationDate );

                    setGraveData( { key: key, date: NLDate, occupant: occupant } );
                } catch (e) {
                    console.error(`Could not get grave data ${e}`);

                }
            }

            if (graveId) getGrave(graveId);
        }, [graveId]);

    return (
        <div className="profile-rowp" >
            <div className="ug-div">
                <Link to={`/grave/${graveId}`}>
                <img src={stone} className="ug-img" alt="stone" title={'Gemaakt op ' + graveData.date}/>
                </Link>
                <div className="ug-occupant">{graveData.occupant}</div>
            </div>
        </div>
    );
}

export default GraveSummary;