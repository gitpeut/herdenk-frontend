import {useState} from "react";
import './Reaction.css';
import backendHost from "../../helpers/backendHost";
import formatDate from "../../helpers/formatDate";
import GetBlob from "../GetBlob/GetBlob";
import trash from "../../assets/png/trash.png";
import pen from "../../assets/png/edit.png"
import axios from "axios";
import useCheckReactionAccess from "../../customHooks/useCheckReactionAccess";

// {
//     "reactionId": 1,
//     "graveId": 3,
//     "userId": 3,
//     "userName": "Toffe Peer",
//     "type": "TEXT",
//     "creationDate": "2021-11-11T10:44:16.286+00:00",
//     "text": "Zing allemaal mee",
//     "mediaPath": null
// }


function Reaction({reaction, graveUpdater }) {
    const [errorMessage, setErrorMessage] = useState();
    const canChange = useCheckReactionAccess(reaction);

    if (reaction.type !== 'TEXT' && reaction.type !== 'MEDIA') return (<></>);

    const divClass = "r-div big";
    const imgClass = "r-img big";

    const NLDate = formatDate(reaction.creationDate);
    const reactionKey = `${reaction.reactionId}`;

    let imgURL = null;
    let mediaTitle  = null;

    if (reaction.mediaPath) {
        imgURL = `http://${backendHost()}${reaction.mediaPath}`;
        mediaTitle = reaction.mediaPath.split("/").pop();
    }

    function displayAWhile(message) {
        setErrorMessage( message );
        setTimeout(() => {
            setErrorMessage(null)
        }, 8000);
    }

    async function deleteReaction() {
        const reactionURL = `http://${backendHost()}/api/v1/reactions/${reaction.reactionId}`;
        const JWT = localStorage.getItem('herdenkToken');
        const config = {headers:{ Authorization: 'Bearer ' + JWT }};

        try {
                const result  = await axios.delete(reactionURL,config);
                if ( result ) {
                    graveUpdater(result.data)
                    console.log("response from server: ", result);
                }
       } catch (e) {
                displayAWhile("verwijderen mislukt");
        }
    }

    function updateReaction(){}

    return (
        <div className={divClass} key={reactionKey}>
            <div className="r-name-date top" key={`${reactionKey}1`}>
                <div className="little-letters" key={`${reactionKey}2`}>#{reaction.reactionId} {reaction.userName}</div>
                <div className="little-letters" key={`${reactionKey}3`}>{NLDate}</div>
                {errorMessage && <div className="little-red">{errorMessage}</div>}
                { canChange ?
                    <img src={trash} className="r-12x12" alt="delete reaction" title="verwijder deze reactie"
                     onClick={deleteReaction}/>
                     :
                    <div className="r-12x12" />
                }
            </div>
            {reaction.mediaPath &&
            <>
                <div className="r-center" key={`${reactionKey}28`}>
                    <GetBlob url={imgURL} classname={imgClass} blobKey={`blob-${reaction.reactionId}`}/>
                </div>
                <div className="img-title" key={`${reactionKey}27`}>
                    {mediaTitle}
                </div>
            </>
            }
            {reaction.text.length !== 0 &&
            <div key={`${reactionKey}4`} className="r-div text">
                {reaction.text}
            </div>
            }
            <div className="r-name-date bottom" key={`${reactionKey}5`}>
                { canChange ?
                    <img src={pen} className="r-12x12" alt="verander reaction" title="verander deze reactie"
                         onClick={updateReaction}/>
                    :
                    <div className="r-12x12" />
                }
            </div>

        </div>
    );

}

export default Reaction;