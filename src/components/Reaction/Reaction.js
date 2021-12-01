import {useState} from "react";
import './Reaction.css';
import backendHost from "../../helpers/backendHost";
import formatDate from "../../helpers/formatDate";
import GetBlob from "../GetBlob/GetBlob";
import trash from "../../assets/png/trash.png";
import pen from "../../assets/png/edit.png";
import none from "../../assets/png/none.png";
import axios from "axios";
import useCheckReactionAccess from "../../customHooks/useCheckReactionAccess";
import foto from "../../assets/png/foto.png";
import nofoto from "../../assets/png/nofoto.png";
import good from "../../assets/png/good.png";

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
    const [isNew, setIsNew]               = useState( reaction.reactionId === 'new' );
    const [updateActive, setUpdateActive] = useState( isNew );
    const [updateImage, setUpdateImage]   = useState(null);
    const [fileName, setFileName]         = useState(null);
    const [mediaPath, setMediaPath]       = useState( reaction.mediaPath );

    let newReaction = reaction;

    const canChange = useCheckReactionAccess(reaction);

    if (reaction.type !== 'TEXT' && reaction.type !== 'MEDIA') return (<></>);

    const divClass = "r-div big";
    const imgClass = "r-img big";

    const NLDate = formatDate(isNew ?'':reaction.creationDate);
    const reactionKey = `${reaction.reactionId}`;

    let imgURL = null;
    let mediaTitle  = null;

    if ( reaction.mediaPath ) {
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

    function auto_grow() {
        const element = document.getElementById(`${reactionKey}textarea` );
        element.style.height = "6px";
        element.style.height = ( element.scrollHeight ) + 'px';
    }

    function addImage( e ){
            setUpdateImage( e.target.files[0] );
            setFileName(e.target.files[0].name);
            setMediaPath(e.target.files[0].name);
    }

    function removeImage(){
        setUpdateImage( null );
        setFileName( null );
        setMediaPath(null);
    }


    function activateUpdate(){
        const txtArea   = document.getElementById(`${reactionKey}textarea`);
        const txtPlain  = document.getElementById(`${reactionKey}text`);

        if ( !updateActive){
            txtArea.value = newReaction.text;
            txtArea.style.height = txtPlain.scrollHeight + "px";
        }else{ // cancel
            // reset values to original reaction
            txtArea.value = reaction.text;
            setUpdateImage( null);
            setFileName(null);
            setMediaPath( reaction.mediaPath);

            newReaction = reaction; //remove  cancelled changes
        }
        if( !isNew )setUpdateActive( !updateActive );
    }

    async function submitUpdate( formData ) {

        const rc = {success: false, result: null};

        try {
            const JWT = localStorage.getItem('herdenkToken');
            const config = {headers: {'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + JWT}};

            if (isNew ) {
                const URL = `http://${backendHost()}/api/v1/reactions/grave/${reaction.graveId}`;
                rc.result = await axios.post(URL, formData, config);
            }else{
                const URL = `http://${backendHost()}/api/v1/reactions/${reaction.reactionId}`;
                rc.result = await axios.put(URL, formData, config);
            }

            rc.success = true;
            return( rc );
        } catch (e) {
            if ( e.response) {
                rc.success = false;
                rc.result = e.response.data;
            }
            return (rc);
        }
    }


    async function prepareUpdate(){

        // before the textarea is made visible, the original text is copied in. So, no
        // extra checks necessary on validity.
        const textElement = document.getElementById(`${reactionKey}textarea`);

        newReaction.text  = textElement.value;
        newReaction.type  = 'TEXT';
        newReaction.mediaPath = mediaPath;

        if ( updateImage ) {
            newReaction.type      = 'MEDIA';
        }

        const formData = new FormData();
        formData.append('reaction', new Blob([JSON.stringify( newReaction)], {
            type: "application/json"
        }));
        if (newReaction.type === 'MEDIA') {
            formData.append(
                "media",
                updateImage,
                fileName
            );
        }

        const rc = await submitUpdate( formData );
        if ( !rc.success ){
            displayAWhile( 'Update mislukt' );
            console.error( rc.result);
            activateUpdate()
        }else{

            const txtArea  = document.getElementById(`${reactionKey}textarea`);
            txtArea.value = '';

            setUpdateImage( null);
            setFileName(null);
            setMediaPath( isNew?null:reaction.mediaPath);

            newReaction = reaction; //remove  cancelled changes

            if( !isNew )setUpdateActive(false);
        }
        graveUpdater(rc.result);
    }



    return (
        <div className={divClass} key={reactionKey}>
            <div className="r-name-date top" key={`${reactionKey}1`}>
                <div className="little-letters" key={`${reactionKey}2`}>#{reaction.reactionId} {reaction.userName}</div>
                <div className="little-letters" key={`${reactionKey}3`}>{NLDate}</div>
                {errorMessage && <div className="r-above">{errorMessage}</div>}
                { (canChange && !isNew) ?
                    <img src={trash} className="r-12x12" alt="delete reaction" title="verwijder deze reactie"
                     onClick={deleteReaction}/>
                     :
                    <div className="r-12x12" />
                }
            </div>

            { updateActive && updateImage &&
                <>
                <div className="r-center" key={`${reactionKey}288`}>
                   <img src={URL.createObjectURL(updateImage)}
                     className={imgClass} alt="kan het plaatje niet laten zien.Kies een ander formaat" />
                </div>
                <div className="img-title" key={`${reactionKey}277`}>
                    {fileName}
                </div>
                </>
            }

            { !updateImage && mediaPath &&
                <>
                    <div className="r-center" key={`${reactionKey}28`}>
                        <GetBlob url={imgURL} classname={imgClass} blobKey={`blob-${reactionKey}`}/>
                    </div>
                    <div className="img-title" key={`${reactionKey}27`}>
                        {mediaTitle}
                    </div>
                </>
            }

            <div key={`${reactionKey}4`} className={`r-div text ${updateActive?"r-noshow":""}`} id={`${reactionKey}text`}>
                {reaction.text}
            </div>

            <textarea className={`r-textarea r-div text ${updateActive?"":"r-noshow"}`}
                      id={`${reactionKey}textarea`}
                      onChange={() => auto_grow()}
            />

            <div className="r-name-date bottom" key={`${reactionKey}5`}>
                { canChange && !updateActive &&
                    <img src={pen} className="r-12x12" alt="verander reactie" title="verander deze reactie"
                         onClick={activateUpdate}/>
                    }
                { canChange &&  updateActive &&
                <>
                    { mediaPath &&
                    <button id="nofoto" className="r-submit">
                        <img src={nofoto} className="r-16x16" alt="cancel" title="Foto verwijderen"
                             onClick={removeImage}/>
                    </button>
                    }

                    <label htmlFor={`${reactionKey}media`}
                       title={ reaction.type === 'MEDIA'?'Foto vervangen':'Foto toevoegen'}
                       className="r-submit">

                    <input className="r-hidden" type="file"
                           id={`${reactionKey}media`}
                           onChange={addImage}
                            />
                    <img src={foto} className="r-16x16" alt="camera" />
                </label>

                <button id="cancel" className="r-submit">
                <img src={none} className="r-12x12" alt="cancel" title="wijzigingen ongedaan maken"
                         onClick={activateUpdate}/>
                </button>

                <button type="submit" id="submit" className="r-submit">
                    <>
                    <img src={good} className="r-12x12" alt="submit" title="reactie bijwerken"
                        onClick={prepareUpdate}/>
                    </>
                </button>
                </>
                }
                { !canChange &&
                    <div className="r-12x12" />
                }

            </div>

        </div>
    );

}

export default Reaction;