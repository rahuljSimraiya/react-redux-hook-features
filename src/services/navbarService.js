import axios from 'axios';

export const getCompanySkillSuggestion = () => {
    const accessToken = window.localStorage.getItem('accessToken' )
    return axios({
        method: 'get',
        url:
            process.env.REACT_APP_SERVER_API +
            'api/search-keywords?access_token=' +
            accessToken,
        responseType: 'json',
    });
};

export const addWatchlist = (suggestion) => {
    const accessToken = window.localStorage.getItem('accessToken' )
    let category = suggestion.type;
    let payload = {
        company_name: suggestion.name,
        company_ticker: suggestion.ticker,
    };
    return axios({
        method: 'POST',
        url:
            process.env.REACT_APP_SERVER_API +
            'api/watchlist/' +
            category +
            '?access_token=' +
            accessToken,
        data: payload,
        responseType: 'json',
    });
};
