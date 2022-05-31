import axios from 'axios';

export const getWatchlist = () => {
    const accessToken = window.localStorage.getItem('accessToken' )
    return axios({
        method: 'get',
        url:
            process.env.REACT_APP_SERVER_API +
            'api/watchlist/jobs?access_token=' +
            accessToken,
        responseType: 'json',
    });
};

export const removeWatchlist = (el) => {
    const accessToken = window.localStorage.getItem('accessToken' )
    return axios({
        method: 'DELETE',
        url:
            process.env.REACT_APP_SERVER_API +
            'api/watchlist/jobs?id=' +
            el.id +
            '&access_token=' +
            accessToken,
        responseType: 'json',
    });
};
