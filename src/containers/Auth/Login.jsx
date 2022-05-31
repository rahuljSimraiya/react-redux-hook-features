import { useState } from 'react';
import { userLogin } from './../../services/authService.js';
import './Auth.css';
import AES from 'crypto-js/aes';

const SignIn = function () {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const credential = {
            uname: email,
            password: password,
        };
        await userLogin(credential)
            .then(function (response) {
                const resData = response.data;
                if (resData.STATUS == 'KO') {
                    if (resData.message == 'FORCE_TO_CHANGE_PASSWORD') {
                        if (typeof window !== 'undefined') {
                            window.localStorage.setItem(
                                'accessToken',
                                resData.session_token
                            );
                            window.localStorage.setItem(
                                'exaple_user',
                                JSON.stringify({ email: email })
                            );
                            const ciphertext = AES.encrypt(
                                email,
                                process.env.REACT_APP_USER_RESET_KEY
                            ).toString();
                            window.localStorage.setItem(
                                'user_reset_value',
                                ciphertext
                            );
                        }
                        location.href = '/reset-password';
                    } else {
                        setError(resData.message);
                    }
                } else {
                    if (typeof window !== 'undefined') {
                        window.localStorage.setItem(
                            'accessToken',
                            resData.session_token
                        );
                        window.localStorage.setItem(
                            'exaple_user',
                            JSON.stringify({ email: email })
                        );
                        location.href = '/home';
                    }
                }
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                setLoading(false);
            });
    };
    return (
        <div className="App">
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form onSubmit={(e) => handleSignIn(e)}>
                        <h3>Sign In</h3>
                        <div className="form-group">
                            <label>Email address</label>
                            <input
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                                placeholder="Enter email"
                                value={email}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control"
                                placeholder="Enter password"
                                value={password}
                            />
                        </div>
                        {loading ? (
                            <button
                                type="submit"
                                disabled
                                className="btn btn-primary btn-block form-control mt-3 border-radius-25"
                            >
                                loading...
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="btn btn-primary btn-block form-control mt-3 border-radius-25"
                            >
                                Login
                            </button>
                        )}
                        <p className="forgot-password text-right d-none">
                            Forgot <a href="#">password?</a>
                        </p>
                        {error && (
                            <div className="text-center text-danger">
                                {error}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
