
import {useState} from "react";
import './Reaction.css';
import backendHost from "../../helpers/backendHost";
import formatDate from "../../helpers/formatDate";
import GetBlob from "../GetBlob/GetBlob";
import trash from "../../assets/png/trash.png";
import axios from "axios";

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


function Reaction( {reaction, first, graveUpdater } ) {
    const [errorMessage,setErrorMessage] = useState();
    if ( reaction.type !== 'TEXT' && reaction.type !== 'MEDIA' ) return (<></>);

    let divClass = "r-div normal";
    let imgClass = "r-img normal";

    if ( first ){
        divClass = "r-div big";
        imgClass = "r-img big";
    }

    const NLDate = formatDate( reaction.creationDate );
    const reactionKey   = `reactionmain-${reaction.reactionId}`;

    let imgURL = null;
    if ( reaction.mediaPath ) {
        imgURL = `http://${backendHost()}${reaction.mediaPath}`;
        console.log('imgURL ', imgURL);
    }

    async function deleteReaction() {
        const reactionURL = `http://${backendHost()}/api/v1/reactions/${reaction.reactionId}`;
        const JWT = localStorage.getItem('herdenkToken');

        try {
             await axios
                .delete(reactionURL, {
                    headers:
                        {
                            Authorization: 'Bearer ' + JWT
                        }
                })
                .then(res => {
                    console.log("response from server: ", res);
                    graveUpdater( res );
                });
        }catch(e){
          setErrorMessage( "verwijderen mislukt");
        }
    }


    return (
        <div className={divClass} key={reactionKey}>
            <div className="r-name-date" key={`${reactionKey}-1`}>
                <div className="little-black" key={`${reactionKey}-2`}>{reaction.userName}</div>
                <div className="little-black" key={`${reactionKey}-3`}>{NLDate}</div>
                {errorMessage && <div className="little-red">{errorMessage}</div>}
                <img src={trash} className="r-12x12" alt="delete reaction" title="verwijder deze reactie" onClick={deleteReaction} />
            </div>
            <div className="r-center">
            { reaction.mediaPath &&
                <GetBlob url={imgURL} classname={imgClass} blobKey={`blob-${reaction.reactionId}`}/>
            }
            </div>
            <div key={`${reactionKey}-4`}>
                {reaction.text}
            </div>
        </div>
    );

}

export default Reaction;