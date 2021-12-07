import React, {useEffect, useContext, useState} from 'react';
import axios from "axios";
import backendHost from "../../helpers/backendHost";
import {AuthContext} from "../../context/AuthContext";
import {useParams} from "react-router-dom";
import Reaction from "../../components/Reaction/Reaction";
import './Grave.css';
import ShowGifts from "../../components/GraveGifts/ShowGifts";


function Grave() {
    const {graveId} = useParams();
    const [graveData, setGraveData] = useState({});
    const [giftedFlowers, setGiftedFlowers] = useState([]);
    const [giftedTears, setGiftedTears] = useState([]);
    const [graveUpdate, setGraveUpdate] = useState(null);
    const {loggedIn} = useContext(AuthContext);
    const [canWrite, setCanWrite] = useState(false);
    const [canChange, setCanChange] = useState(false);

    useEffect(
        () => {

            async function calculateAccess() {
                try {
                    const graveURL = `http://${backendHost()}/api/v1/graves/summary/${graveId}`;
                    const JWT = localStorage.getItem('herdenkToken');
                    const config = {headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + JWT}};

                    const result = await axios.get(graveURL, config);

                    const authority = result.data.access;
                    if (authority === 'WRITE' || authority === 'OWNER') setCanWrite(true);
                    if (authority === 'OWNER') setCanChange(true);
                } catch (e) {
                    console.error(`Could not get authority for grave ${graveId}: ${e}`);
                }
            }

            function initGifts(grave) {

                let flowers = [];
                let tears = [];


                grave.reactions.forEach(r => {
                    if (r.type === 'FLOWER') flowers.push(r.userName);
                    if (r.type === 'TEAR') tears.push(r.userName);
                });

                setGiftedFlowers(flowers);
                setGiftedTears(tears);
            }


            async function fetchGraveData() {
                try {
                    const graveURL = `http://${backendHost()}/api/v1/graves/${graveId}`;
                    const JWT = localStorage.getItem('herdenkToken');
                    const config = {headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + JWT}};

                    const result = await axios.get(graveURL, config);

                    setGraveData(result.data);
                    await calculateAccess();
                    await initGifts(result.data);
                    return (result.data);

                } catch (e) {
                    console.error(`Could not get grave data ${e}`);
                }
                return null;
            }

            fetchGraveData();
        }, [graveId, graveUpdate]
    );


    return (
        <>

            {loggedIn && graveData.occupantFullName &&
            <>
                <ShowGifts key={`gifts${graveData.graveId}`}
                           giftedFlowers={giftedFlowers} setGiftedFlowers={setGiftedFlowers}
                           giftedTears={giftedTears} setGiftedTears={setGiftedTears} graveId={graveId}
                >
                    <div className="grave-title" key="grave">
                        {graveData.occupantFullName}
                    </div>
                </ShowGifts>

                {graveData.reactions &&
                graveData.reactions.map((r) => {
                        return (<Reaction reaction={r}
                                          graveUpdater={setGraveUpdate}
                                          isNew={false}
                                          graveCanChange={canChange}
                                          key={`reaction-${r.reactionId}`}/>);
                    }
                )
                }

                {canWrite &&
                <Reaction reaction={{graveId: graveData.graveId, reactionId: 'new', type: 'TEXT', text: ''}}
                          graveUpdater={setGraveUpdate}
                          isNew={true}
                          graveCanChange={true}
                          key={`reaction-new`}/>
                }
            </>
            }
            {(!loggedIn || !graveData.reactions) &&
            <h4>U heeft geen toegang tot dit graf</h4>
            }
        </>
    );
}


export default Grave;

