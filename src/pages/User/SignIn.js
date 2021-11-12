import React, {useState, useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {AuthContext} from "../context/AuthContext";
import {useForm} from "react-hook-form";
import axios from "axios";
import backendHost from "../helpers/backendHost";
import './Sign.css';

function SignIn() {
    // import relevanet hook-form functions and set initial values to empty
    const {register, handleSubmit, formState: {errors}} = useForm({
        mode: "onBlur",
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const [loginError, setLoginError] = useState(null);
    const {loggedIn, login} = useContext(AuthContext);
    const history = useHistory();

    async function postLogin(email, password) {
        const rc = {success: false, JWT: null, result: null};
        try {
            rc.result = await axios.post(`http://${backendHost()}/api/v1/login`, {email: email, password: password});

            rc.success = true;
            localStorage.setItem('herdenkToken', rc.result.data.jwt);

            return (rc);
        } catch (e) {
            if ('response' in e) rc.result = e.response.data;
            return (rc);
        }
    }

    async function validateSubmit(data) {
        const rc = await postLogin(data.email, data.password);
        if (rc.success) {
            await login();
            history.push('/profile');
        } else {
            setLoginError(rc.result);
        }
    }

    return (
        <>
            <h1>Inloggen</h1>
            <p className="sign-text">
                Heeft u nog geen account? Registreert u zich dan <Link to="/signup">hier</Link>
            </p>

            {!loggedIn &&
            <form className="sign-form" onSubmit={handleSubmit(validateSubmit)}>

                <label htmlFor="email">email
                    <input
                        type="email"
                        {...register("email", {
                            required: "email adres is verplicht",
                        })
                        }
                        id="email"
                    />
                    {errors.email && <p className="little-red">{errors.email.message}</p>}
                </label>

                <label htmlFor="password">password
                    <input
                        type="password"
                        {...register("password", {
                            required: "password is verplicht"
                        })
                        }
                        id="password"
                    />
                    {errors.password && <p className="little-red">{errors.password.message}</p>}
                </label>

                <button type="submit">
                    Inloggen
                </button>
                {loginError && <p className="little-red">{loginError}</p>}
            </form>
            }

            {loggedIn &&
            <p> U bent al ingelogd. Log eerst uit als u opnieuw wilt inloggen.</p>
            }

        </>
    );
}

export default SignIn;