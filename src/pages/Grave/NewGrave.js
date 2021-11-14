import {useState} from 'react';
import axios from "axios";
import backendHost from "../../helpers/backendHost";
import {useForm} from "react-hook-form";
import {useHistory} from 'react-router-dom';
import '../../components/Reaction/Reaction.css'
import './Grave.css'

function NewGrave(){
    const [errorMessage,setErrorMessage] = useState();
    const [graveDetails, setGraveDetails] = useState( null );
    const history = useHistory();
    const {register, handleSubmit, formState: {errors}} = useForm({
        mode: "onBlur", // update errors when field goes out of focus
        defaultValues: {
            publicAccess: true,
        }
    });


    async function addGrave( occupantFullName, publicAccess ) {
        try {
            const JWT = localStorage.getItem('herdenkToken');
            const graveURL = `http://${backendHost()}/api/v1/graves`;

            const result = await axios.post(graveURL,
                {
                    'occupantFullName' : occupantFullName,
                    'publicAccess' : publicAccess,
                }
                ,{
                headers:
                    {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + JWT
                    }
            });
            console.log( 'result ', result );
            setGraveDetails( result.data );
            console.log( 'grave Details', graveDetails );
            return( result.data );

        } catch (e) {
            console.error(` ${e}`);
            if ( e.response ) {
                setErrorMessage( 'Graf kon niet worden gemaakt : ' + e.response.data );
            }else{
                setErrorMessage( 'Graf kon niet worden gemaakt, backend gaf een foutmelding'  );
            }
            return ( null );
        }
    }



    async function validateSubmit(data) {
        console.log('data', data);
        const details = await addGrave( data.occupantFullName, data.publicAccess );
        console.log('details', details);
        if ( details ){
            history.push(`/grave/${details.graveId}`);
        }
    }



    return (
        <>
        <h2>Maak een nieuw graf</h2>
        <form onSubmit={handleSubmit(validateSubmit)} className="grave-form">

            <label htmlFor="occupantFullName" className="grave-label">
                Naam op het graf
                <input className="grave-input"
                      {...register("occupantFullName", {
                              maxLength: {
                                  value: 64,
                                  message: "naam mag maximaal 64 tekens bevatten",
                              },
                          minLength: {
                              value: 4,
                              message: "naam moet minstens 4 tekens bevatten",
                          }
                          },
                      )}
                      id="occupantFullName"
                />
                {errors.occupantFullName && <p className="little-red">{errors.occupantFullName.message}</p>}
            </label>

            <label htmlFor="publicAccess" className="grave-label">
                Voor iedereen zichtbaar
                <input
                    className="grave-checkbox"
                    type="checkbox"
                       {...register("publicAccess")}
                       id="publicAccess"
                />
            </label>
            {errorMessage && <div className="little-red">{errorMessage}</div>}
            <div className="grave-right">
                <button type="submit" id="submit" className="r-submit">
                    <>
                        Maak
                    </>
                </button>

            </div>
        </form>
        </>
    );
}

export default NewGrave;