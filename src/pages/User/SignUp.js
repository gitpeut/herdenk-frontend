import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useForm} from "react-hook-form";
import axios from "axios";
import entropy from "../helpers/entropy";
import matchEmail from "../helpers/matchEmail";
import backendHost from "../helpers/backendHost";
import './Sign.css'

function SignUp() {
    const [submitMessage, setSubmitMessage] = useState(null);
    const {register, handleSubmit, formState: {errors}} = useForm({
        mode: "onBlur", // update errors when field goes out of focus
        defaultValues: {
            email: "",
            password: "",
            fullName: "",
        },
    });

    async function postRegistration(data) {
        const rc = {success: false, JWT: null, result: null};
        try {

            rc.result = await axios.post(`http://${backendHost()}/api/v1/register`, data);
            rc.success = true;

            return (rc);
        } catch (e) {
            if ( e.response ) {
                 rc.result = e.response.data;
            }
            return (rc);
        }
    }


    async function validateSubmit(data) {
        let message = '';
        if (!matchEmail(data.email)) {
            message = 'Email adres is ongeldig';
        }

        if (entropy(data.password) < 3.1) { // minimal 3, now set to 0 for testing purposes
            message += (message === '') ? 'Het password is te zwak' : ' en het password is te zwak';
        }
        if (message !== '') {
            setSubmitMessage(message);
        } else {
            const rc = await postRegistration({
                email: data.email,
                password: data.password,
                fullName: data.username,
            });

            setSubmitMessage(rc.success ? 'U bent geregistreerd' : rc.result);

        }
    }


    return (
        <>
            <h1>Registreren</h1>
            <p className="sign-text">Voordat u een virtueel graf of een andere herinnering kunt bekijken
               of maken, moet u zich registreren. U kunt daarna inloggen met uw email adres
               en uw wachtwoord. Dat wordt niet getoond aan andere gebruikers, alleen uw
               zelf gekozen gebruikersnaam.
            </p>
            <form className="sign-form" onSubmit={handleSubmit(validateSubmit)}>
                <label htmlFor="email">email
                    {/*Type to email, supplies a rough test on email address validity in the browser*/}
                    <input

                        type="email"
                        {...register("email", {
                                required: "email is een verplicht veld",
                                minLength: {
                                    value: 6,
                                    message: "email adres moet minstens 6 tekens bevatten",
                                }
                            },
                        )}
                        id="email"
                    />
                    {errors.email && <p className="little-red">{errors.email.message}</p>}
                </label>

                <label htmlFor="password">password
                    <input
                        type="password"
                        {...register("password", {
                                required: "password is een verplicht veld",
                                minLength: {
                                    value: 8,
                                    message: "password moet minstens 8 tekens bevatten",
                                }
                            },
                        )}

                        id="password"
                    />
                    {errors.password && <p className="little-red">{errors.password.message}</p>}
                </label>

                <label htmlFor="username">gebruikersnaam
                    <input
                        type="text"
                        {...register("username", {
                                required: "username is een verplicht veld",
                                minLength: {
                                    value: 4,
                                    message: "username moet minstens 4 tekens bevatten",
                                }
                            },
                        )}

                        id="username"
                    />
                    {errors.username && <p className="little-red">{errors.username.message}</p>}
                </label>

                <button type="submit" id="submit">
                    Registreren
                </button>
                {submitMessage && <p className="little-red">{submitMessage}</p>}
            </form>
            <p className="sign-text">Je kunt <Link to="/signin">hier</Link> inloggen</p>
        </>
    );
}

export default SignUp;