import axios from 'axios';

export const userLogin = (userData) => {
    return axios({
        method: 'post',
        url:
            process.env.REACT_APP_SERVER_API +
            'api/login/',
        data:userData,
        responseType: 'json',
    });
};

export const changePassword = (postData) => {
    return axios({
        method: 'post',
        url:
            process.env.REACT_APP_SERVER_API +
            'api/change-password/?session_token=' + postData.access_token,
        data: {
            "uname": postData.uname,
            "password": postData.password
        },
        responseType: 'json',
    });
};
