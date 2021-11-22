import React, {useEffect, useState, useContext} from 'react';
import axios from "axios";
import {Link} from 'react-router-dom';
import backendHost from "../../helpers/backendHost";
import formatDate from "../../helpers/formatDate";
import './UserGraveData.css';
import stone from '../../assets/png/stone_white.png';
import PermissionLine from './PermissionLine';
import cancel from "../../assets/png/cancel.png";
import {AuthContext} from "../../context/AuthContext";
import GraveDetailsAccess from "./GraveDetailsAccess";

function GraveDetails({graveId, update, setUpdate}) {
    const [graveData, setGraveData] = useState({});
    const {login} = useContext(AuthContext);

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

                    const key = `grave-${result.data.graveId}`;
                    const occupant = result.data.occupantFullName;
                    const NLDate = formatDate(result.data.creationDate);

                    setGraveData({key: key, date: NLDate, occupant: occupant, full: result.data});

                } catch (e) {
                    console.error(`Could not get grave data ${e}`);
                }
            }

            if (graveId) getGrave(graveId);
        }, [graveId, update]);


    let first = true;
    let displayHeader = true;
    return (
        <div key={`ugpdiv${graveId}`} className="profile-rowp">
            <div key={`ugpsub${graveId}`} className="ug-div">


                <Link to={`/grave/${graveId}` }>
                    <img src={stone} className="ug-img" alt="stone" title={'Gemaakt op ' + graveData.date}
                         key={`ug-${graveId}-stone`}/>
                </Link>
                <div key={`ugdiv1${graveId}`} className="ug-occupant">
                    <button className="ug-button" id="delGrave" onClick={() => deleteGrave()}
                            key={`delGrave-${graveId}`}>
                        <img className="ug-button-img" id="cancel-img" src={cancel} alt="Graf verwijderen"
                             title="Graf verwijderen" key={`delGrave-${graveId}-image`}/>
                    </button>
                </div>

                <span key={`ugdiv2${graveId}`} className="ug-occupant">{graveData.occupant}</span>

                <GraveDetailsAccess graveData={graveData} setUpdate={setUpdate} />
                {/*<ul key={`ugpul${graveId}`} className="ug-ul">*/}

                {/*    {graveData.full &&*/}
                {/*    graveData.full.reactions.map((r) => {*/}
                {/*            if (r.type === 'READ' || r.type === 'WRITE') {*/}
                {/*                if (first) {*/}
                {/*                    displayHeader = true;*/}
                {/*                    first = false;*/}
                {/*                } else {*/}
                {/*                    displayHeader = false;*/}
                {/*                }*/}
                {/*                return (*/}
                {/*                    <>*/}
                {/*                        {displayHeader &&*/}
                {/*                         <li key={0} className="ug-permission-li">Access requests</li>*/}
                {/*                        }*/}
                {/*                        <PermissionLine key={r.reactionId} reaction={r}*/}
                {/*                                        parentUpdater={setUpdate}/>*/}
                {/*                    </>*/}
                {/*                )*/}
                {/*            } else {*/}
                {/*                return null;*/}
                {/*            }*/}
                {/*        }*/}
                {/*    )}*/}
                {/*</ul>*/}
            </div>
        </div>
    );
}

export default GraveDetails;
