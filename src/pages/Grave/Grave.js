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
    const [oldReactionLength, setOldReactionLength] = useState(0);
    const [flowerError, setFlowerError] = useState(null);
    const [tearError, setTearError] = useState(null);
    const [graveUpdate, setGraveUpdate] = useState(null);
    let flowerList = [];
    let tearList = [];
    const {loggedIn, user} = useContext(AuthContext);


    useEffect(
        () => {
            async function fetchData() {
                let result = {};
                try {
                    const graveURL = `http://${backendHost()}/api/v1/graves/${graveId}`;
                    const JWT = localStorage.getItem('herdenkToken');
                    result = await axios.get(graveURL, {
                        headers:
                            {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + JWT
                            }
                    });
                    setGraveData(result.data);
                } catch (e) {
                    console.error(`Could not get grave data ${e}`);
                }
            }

            if (graveId) fetchData();
        },
        [graveId, graveUpdate]
    );

    async function postGift(e) {
        let gift = '';
        if (e.target.id === 'flowers') {
            gift = 'FLOWER';
            if (giftedFlowers.includes(user)) {
                flowerError ? setFlowerError(null) : setFlowerError(user + ' gaf al bloemen');
                return;
            }
        }
        if (e.target.id === 'tears') {
            gift = 'TEAR';
            if (giftedTears.includes(user)) {
                tearError ? setTearError(null) : setTearError(user + ' heeft al tranen geplengd');
                return;
            }
        }
        if (gift === '') return;

        const reactionURL = `http://${backendHost()}/api/v1/reactions/token/${graveId}/${gift}`;
        const JWT = localStorage.getItem('herdenkToken');

        try {
            await axios
                .post(reactionURL, '', {
                    headers:
                        {
                            Authorization: 'Bearer ' + JWT
                        }
                })
                .then(res => {
                    console.log("token response from server: ", res);
                    const reaction = res.data[0];

                    if (reaction.type === 'FLOWER') setGiftedFlowers([...giftedFlowers, reaction.userName]);
                    if (reaction.type === 'TEAR') setGiftedTears([...giftedTears, reaction.userName]);
                    console.log(giftedFlowers);
                });
        } catch (e) {
            console.log(`Verzenden van ${gift} mislukt`);
        }
    }

    // convoluted way to avoid 'too many re-renders' when processing gifts
    // one non-state array that is filled by the database reactions when
    // reactions of the grave are loaded  is compared to a state array that
    // is updated real time,without necessarily being updated by loading the grave.
    // Also if the number of reactions loaded from the database is the same
    // as the previous load, nothing happens.

    if (graveData.reactions) {
        if (graveData.reactions.length !== oldReactionLength) {
            flowerList = [];
            tearList = [];
            graveData.reactions.map(r => {
                if (r.type === 'FLOWER') flowerList.push(r.userName);
                if (r.type === 'TEAR') tearList.push(r.userName);
                return r.reactionId;
            });
            setOldReactionLength(graveData.reactions.length);
            if (flowerList.length > giftedFlowers.length) {
                setGiftedFlowers(flowerList);
            }

            if (tearList.length > giftedTears.length) setGiftedTears(tearList);
        }
    }

    let first = 2;
    return (
        <>

            {loggedIn &&
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
                        return (<Reaction reaction={r} first={first} key={`reaction-${r.reactionId}`} />);
                    }
                )
                }
                <PostReaction graveId={graveData.graveId} graveUpdater={setGraveUpdate}/>
            </>
            }
        </>
    );
}


export default Grave;

