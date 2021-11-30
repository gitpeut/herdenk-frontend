import {useState, useContext} from "react";
import flowers from "../../assets/png/bloemetjes.png";
import tear from "../../assets/png/tear192.png";
import backendHost from "../../helpers/backendHost";
import axios from "axios";
import {AuthContext} from "../../context/AuthContext";
import '../../pages/Grave/Grave.css'


function ShowGifts( {giftedFlowers, setGiftedFlowers, giftedTears, setGiftedTears, graveId, children} ) {
    const [flowerError, setFlowerError] = useState(null);
    const [tearError, setTearError] = useState(null);
    const {user} = useContext(AuthContext);

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


    async function postGift(e) {
        let gift = '';
        if (e.target.id === 'flowers' || e.target.alt === 'flowers') {
            gift = 'FLOWER';
            if (giftedFlowers.includes(user)) {
                displayAWhile(`${user} gaf al bloemen`, gift);
                return;
            }
        }
        if (e.target.id === 'tears' || e.target.alt === 'tears' ) {
            gift = 'TEAR';
            if (giftedTears.includes(user)) {
                displayAWhile(`${user} heeft al een traan gelaten`, gift);
                return;
            }
        }
        if (gift === '') return;
        await sendGift(gift);
    }



    return(
        <>
            <div className="grave-gift-title">
                {children}
            </div>
            <div className="grave-three">
                <div id="flowers" className="grave-gifts left" title="Klik om een bloemetje te delen" onClick={postGift}>

                    {giftedFlowers &&
                    giftedFlowers.map((user, index) => {
                            return (<img src={flowers}
                                         className="grave-gift"
                                         alt={`Bloemetje van ${user}`}
                                         title={user + ' gaf deze bloemen'}
                                         key={`flower-${user}-${index}`}/>);
                        }
                    )}
                </div>
                {flowerError &&
                <p className="gift-error">{flowerError}</p>
                }
                <img src={flowers} className="grave-gift add" alt="flowers" onClick={postGift}
                     title="Klik om een bloemetje te delen"/>


                <img src={tear} className="grave-gift add" alt="tears" onClick={postGift}
                     title="Klik om uw traan bij te zetten"/>
                {tearError &&
                <p className="gift-error">{tearError}</p>
                }

                <div id="tears" className="grave-gifts right" onClick={postGift} title="Klik om uw traan bij te zetten">
                    {giftedTears &&
                    giftedTears.map((user, index) => {
                            return (<img src={tear}
                                         className="grave-gift"
                                         alt={`${user} plengt een traan`}
                                         title={user + ' liet deze traan'}
                                         key={`tear-${user}-${index}`}/>);
                        }
                    )}

                </div>
            </div>
        </>
    );

}
export default ShowGifts;