import { useState } from 'react';
import { changePassword } from './../../services/authService.js';
import './Auth.css';
import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';

const SignIn = function () {
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const ciphertext = window.localStorage.getItem('user_reset_value');
    let email = '';
    if (ciphertext) {
        const user_reset_value = AES.decrypt(
            ciphertext,
            process.env.REACT_APP_USER_RESET_KEY
        ).toString(encUtf8);
        email = user_reset_value;
    }

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        let access_token = '';
        if (typeof window !== 'undefined') {
            access_token = window.localStorage.getItem('accessToken');
        }
        const credential = {
            uname: email,
            password: password,
            access_token: access_token,
        };
        await changePassword(credential)
            .then(function (response) {
                const resData = response.data;
                if (resData.STATUS == 'KO') {
                    setError(resData.message);
                } else {
                    window.localStorage.removeItem('user_reset_value');
                    location.href = '/home';
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
                        <h3>Change Password</h3>
                        <div className="form-group">
                            <input
                                type="hidden"
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                                placeholder="Enter email"
                                value={email}
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
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
                                className="btn btn-primary btn-block form-control mt-3"
                            >
                                loading...
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="btn btn-primary btn-block form-control mt-3"
                            >
                                Submit
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
