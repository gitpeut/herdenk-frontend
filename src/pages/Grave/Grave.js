import React, {useEffect, useContext, useState} from 'react';
import axios from "axios";
import backendHost from "../../helpers/backendHost";
import {AuthContext} from "../../context/AuthContext";
import {useParams} from "react-router-dom";
import Reaction from "../../components/Reaction/Reaction";
import './Grave.css';
import PostReaction from "../../components/Reaction/PostReaction";
import flowers from "../../assets/png/bloemetjes.png";
import tear from "../../assets/png/tear192.png";


function Grave() {
    const {graveId} = useParams();
    const [graveData, setGraveData] = useState({});
    const [giftedFlowers, setGiftedFlowers] = useState([]);
    const [giftedTears, setGiftedTears] = useState([]);
    const [flowerError, setFlowerError] = useState(null);
    const [tearError, setTearError] = useState(null);
    const [graveUpdate, setGraveUpdate] = useState(null);
    const {loggedIn, user, userDetails} = useContext(AuthContext);
    const [canWrite, setCanWrite] = useState(false);

    useEffect(
        () => {
            async function waitForData() {
                await fetchGraveData();
            }

            waitForData();
        },
        [graveId, graveUpdate]
    );

    function calculateAccess(grave) {
        setGraveData(grave);

        // authority looks like this:
        // {
        //     "userId": 2,
        //     "graveId": 1,
        //     "authority": "OWNER" // can be NONE, PUBLIC, READ, WRITE, OWNER
        // }
        // each grave has an array of these, one per users/grave combo
        // if public (read) access is allowed, there is also a record for user 0,
        // with authority PUBLIC
        // need WRITE or OWNER to post reactions. gifts can be given by anyone.
        // ADMIN can technically write too, this is not enabled in the GUI,
        // it could be by testing on user === admin, but we don't

        const myrights = grave.authorities.filter(a => a.userId === userDetails.userId);
        if (myrights.length &&
            (myrights[0].authority === 'WRITE' || myrights[0].authority === 'OWNER')) setCanWrite(true);
    }

    async function fetchGraveData() {
        try {
            const graveURL = `http://${backendHost()}/api/v1/graves/${graveId}`;
            const JWT = localStorage.getItem('herdenkToken');
            const config = {headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + JWT}};

            const result = await axios.get(graveURL, config);

            calculateAccess(result.data);
        } catch (e) {
            console.error(`Could not get grave data ${e}`);
        }
    }

    async function sendGift(gift) {
        try {
            const reactionURL = `http://${backendHost()}/api/v1/reactions/token/${graveId}/${gift}`;
            const JWT = localStorage.getItem('herdenkToken');
            const config = {headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + JWT}};

            const result = await axios.post(reactionURL, '', config);
            // result is a one element array of reactions

            const reaction = result.data[0];
            if (reaction.type === 'FLOWER') setGiftedFlowers([...giftedFlowers, reaction.userName]);
            if (reaction.type === 'TEAR') setGiftedTears([...giftedTears, reaction.userName]);

        } catch (e) {
            console.error('Could not get grave data ', e.response ? e.response.data.message : e);
        }
    }

    function displayAWhile(message, gift) {
        if (gift === 'FLOWER') {
            setFlowerError(message);
            setTimeout(() => {
                setFlowerError(null)
            }, 8000);
        }
        if (gift === 'TEAR') {
            setTearError(message);
            setTimeout(() => {
                setTearError(null)
            }, 8000);
        }
    }

    async function postGift(e) {
        let gift = '';
        if (e.target.id === 'flowers') {
            gift = 'FLOWER';
            if (giftedFlowers.includes(user)) {
                displayAWhile(`${user} gaf al bloemen`, gift);
                return;
            }
        }
        if (e.target.id === 'tears') {
            gift = 'TEAR';
            if (giftedTears.includes(user)) {
                displayAWhile(`${user} heeft al een traan gelaten`, gift);
                return;
            }
        }
        if (gift === '') return;
        await sendGift(gift);
    }


    let first = 2;
    return (
        <>

            {loggedIn && graveData.occupantFullName &&
            <>
                <div className="grave-three">
                    <img src={flowers} className="grave-gift" alt="flowers"/>
                    <div id="flowers" className="grave-gifts" title="Klik om een bloemetje te delen" onClick={postGift}>

                        {giftedFlowers &&
                        giftedFlowers.map((user, index) => {
                                return (<img src={flowers}
                                             className="grave-gift"
                                             alt={`Bloemetje van ${user}`}
                                             title={user + ' gaf deze bloemen'}
                                             key={`flower-${user}-${index}`}/>);
                            }
                        )}
                        {flowerError &&
                        <p className="little-black">{flowerError}</p>
                        }
                    </div>
                    <div id="tears" className="grave-gifts" onClick={postGift} title="Klik om uw traan bij te zetten">
                        {giftedTears &&
                        giftedTears.map((user, index) => {
                                return (<img src={tear}
                                             className="grave-gift"
                                             alt={`${user} plengt een traan`}
                                             title={user + ' liet deze traan'}
                                             key={`tear-${user}-${index}`}/>);
                            }
                        )}
                        {tearError &&
                        <p className="little-black">{tearError}</p>
                        }

                    </div>
                    <img src={tear} className="grave-gift" alt="tears"/>
                </div>
                <div className="grave-title" key={`grave-${graveData.graveId}`}>{graveData.occupantFullName}</div>

                {graveData.reactions &&
                graveData.reactions.map((r) => {
                        if (first) first--;
                        return (<Reaction reaction={r} first={first} graveUpdater={setGraveUpdate}
                                          key={`reaction-${r.reactionId}`}/>);
                    }
                )
                }
                {canWrite &&
                < PostReaction graveId={graveData.graveId} graveUpdater={setGraveUpdate}/>
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

