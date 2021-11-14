import {useState} from 'react';
import axios from "axios";
import backendHost from "../../helpers/backendHost";
import {useForm} from "react-hook-form";
import './Reaction.css';
import foto from '../../assets/png/foto.png';

function PostReaction({graveId, graveUpdater}) {
    const [errorMessage, setErrorMessage] = useState();
    const {register, handleSubmit, setValue} = useForm({
        mode: "onBlur",
        reValidateMode: 'onBlur',
        defaultValues: {
            text: '',
            media: '',
        },// update errors when field goes out of focus
    });


    async function validateSubmit(data) {

        console.log('data', data);

        let mediaType = 'TEXT';
        let mediaPath = null;

        if (data.media.length > 0) {
            mediaType = 'MEDIA';
            mediaPath = data.media[0].name;
        }
        const reaction = {
            graveId: graveId,
            text: data.text,
            type: mediaType,
            mediaPath: mediaPath,
        }

        const formData = new FormData();
        formData.append('reaction', new Blob([JSON.stringify(reaction)], {
            type: "application/json"
        }));
        if (mediaType === 'MEDIA') {
            formData.append(
                "media",
                data.media[0],
                data.media[0].name
            );
        }

        const reactionURL = `http://${backendHost()}/api/v1/reactions/grave/${graveId}`;
        const JWT = localStorage.getItem('herdenkToken');

        try {
            await axios
                .post(reactionURL, formData, {
                    headers:
                        {
                            'Content-Type': 'multipart/form-data',
                            Authorization: 'Bearer ' + JWT
                        }
                })
                .then(res => {
                    console.log("response from server: ", res);
                    try {
                        //reset form fields on successful submit
                        setValue('text', '', {shouldValidate: false});
                        setValue('media', '', {shouldValidate: false});
                    } catch (e) {
                        console.log('set value failed', e);
                    }
                    graveUpdater(res.data);
                });
        } catch (e) {
            setErrorMessage('Verzenden mislukt');
        }

    }


    return (
        <form onSubmit={handleSubmit(validateSubmit)} className="r-div normal" encType="multipart/form-data">
            Deel uw gedachten:
            <textarea className="r-textarea" rows="10" cols="66" wrap="soft"
                      {...register("text", {
                              maxLength: {
                                  value: 2040,
                                  message: "text mag maximaal 2040 tekens bevatten",
                              },

                          },
                      )}
                      id="text"
            />
            <div className="r-name-date">

                <label htmlFor="media" title="Stuur een foto mee">
                    <input className="r-hidden" type="file" {...register("media")} id="media"/>
                    <img src={foto} className="r-50x50" alt="camera"/>
                </label>
                {errorMessage && <div className="little-red">{errorMessage}</div>}
                <button type="submit" id="submit" className="r-submit">
                    <>
                        Verstuur
                    </>
                </button>
            </div>
        </form>
    );

}

export default PostReaction;

