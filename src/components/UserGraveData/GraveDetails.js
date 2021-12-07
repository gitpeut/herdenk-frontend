import React, {useEffect, useState, useContext} from 'react';
import axios from "axios";
import {Link} from 'react-router-dom';
import backendHost from "../../helpers/backendHost";
import formatDate from "../../helpers/formatDate";
import './UserGraveData.css';
import {AuthContext} from "../../context/AuthContext";
import GraveDetailsAccessRequests from "./GraveDetailsAccessRequests";
import GraveDetailsCurrentAccess from "./GraveDetailsCurrentAccess";
import accessToImage from "../../helpers/accessToImage";
import GetFirstImage from "../GetFirstImage/GetFirstImage";


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


    async function deleteGrave() {
        try {
            const JWT = localStorage.getItem('herdenkToken');
            //Remove the request
            const URL = `http://${backendHost()}/api/v1/graves/${graveId}`;
            if (!window.confirm(`Wilt u echt het graf van  ${graveData.occupant} verwijderen?`)) return;

            const result = await axios.delete(URL, {
                headers:
                    {
                        Authorization: 'Bearer ' + JWT
                    }
            });
            login();
            setUpdate(result);
        } catch (e) {
            console.error(`Could not delete reaction ${e}`);
        }
    }


    return (
        <div key={`${graveId}54321`} className="profile-rowp">
            <div key={`${graveId}65432`} className="ug-div stone">

                <Link to={`/grave/${graveId}`}>
                    <GetFirstImage grave={{graveId: graveId, access: "OWNER"}}/>
                    {/*<img src={stone} className="ug-img" alt="stone" title={'Gemaakt op ' + graveData.date}*/}
                    {/*     key={`ug-${graveId}-stone`}/>*/}
                </Link>
                <div key={`${graveId}76543`} className="ug-occupant">
                    <button className="ug-button" id="delGrave" onClick={() => deleteGrave()}
                            key={`${graveId}87654`}>
                        <img className="ug-button-img" id="cancel-img" src={accessToImage('CANCEL')}
                             alt="Graf verwijderen"
                             title="Graf verwijderen" key={`delGrave-${graveId}-image`}/>
                    </button>
                </div>

                <span key={`${graveId}98765`} className="ug-occupant">{graveData.occupant}</span>

                {graveData.full &&
                <>
                    <GraveDetailsAccessRequests key={`${graveId}98765`} graveData={{...graveData}}
                                                setUpdate={setUpdate}/>
                    <GraveDetailsCurrentAccess key={`${graveId}19876`} graveData={{...graveData}} update={update}
                                               setUpdate={setUpdate}/>
                </>
                }


            </div>
        </div>

    );
}

export default GraveDetails;

