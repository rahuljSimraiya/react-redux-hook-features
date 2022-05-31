import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import Menu from '../../components/Menu/Menu';
import './Navbar.css';
import {
    getCompanySkillSuggestion,
    addWatchlist,
} from './../../services/navbarService.js';
import logoImg from '../../assets/images/logo-white.png';
import { useSelector, useDispatch } from 'react-redux';

function Navbar(props) {
    const dispatch = useDispatch();
    const { searchkeyType, searchkeyValue, suggestionsList, jobsFilterParams } =
        useSelector((state) => state);

    const getSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        return inputLength === 0
            ? []
            : suggestionsList.filter((lang) => {
                  return (
                      lang.type == searchkeyType &&
                      (String(lang.name).toLowerCase().startsWith(inputValue) ||
                          String(lang.ticker)
                              .toLowerCase()
                              .startsWith(inputValue))
                  );
              });
    };

    const user = window.localStorage.getItem('exaple_user');
    const userParse = JSON.parse(user);
    const userPicture = userParse && userParse.picture ? userParse.picture : '';
    const [value, setValue] = useState('');
    const [getSuggestionStatus, setSuggestionEnable] = useState(true);
    const [suggestions, setSuggestions] = useState([]);

    const handleAddToWatchlist = async (e, suggestion) => {
        e.stopPropagation();
        e.target.style.display = 'none';
        setValue('');
        setSuggestions([]);
        addWatchlist(suggestion)
            .then(function (response) {
                props.watchListAdded(suggestion);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    };

    const getSuggestionValue = (suggestion) => {
        return suggestion.name;
    };

    const renderSuggestion = (suggestion) => (
        <div className="suggestion-wrap">
            <div className="suggestion-row">
                <div className="flex1">
                    <b className="text-capitalize">
                        {suggestion.name}{' '}
                        {suggestion.ticker
                            ? '( ' + suggestion.ticker + ' )'
                            : ''}{' '}
                    </b>{' '}
                </div>
                {suggestion.type == 'jobs' && (
                    <div className="suggst-bookmark" title="Add to Watchlist">
                        <svg
                            onClick={(e) => handleAddToWatchlist(e, suggestion)}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-bookmark"
                            viewBox="0 0 16 16"
                        >
                            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );

    const enableAutoSuggest = () => {
        setSuggestionEnable(false);
    };

    useEffect(() => {
        if (!suggestionsList.length) {
            const searchList = [];
            if (searchList.length) {
                setValue('');
                enableAutoSuggest();
                return false;
            }
            let dotCount = 0;
            const interval1 = setInterval(() => {
                dotCount++;
                setValue('.'.repeat((dotCount % 3) + 1));
            }, 500);
            getCompanySkillSuggestion()
                .then(function (response) {
                    clearInterval(interval1);
                    setValue('');
                    const job_keys = Object.keys(response.data['jobs']);
                    job_keys.map((job_key) => {
                        const jd = response.data['jobs'][job_key];
                        searchList.push({
                            name: job_key,
                            type: 'jobs',
                            ticker: jd.ticker,
                        });
                    });
                    response.data['skills'].map((name) => {
                        searchList.push({ name, type: 'skills' });
                    });
                    response.data['vendors'].map((name) => {
                        searchList.push({ name, type: 'saas' });
                    });
                    enableAutoSuggest();
                    dispatch({
                        type: 'SUGGESTIONS_LIST',
                        suggestionsList: searchList,
                    });
                })
                .catch(function (error) {
                    clearInterval(interval1);
                    setValue('');
                })
                .then(function () {
                    // always executed
                });
        } else {
            enableAutoSuggest();
        }
    }, []);

    const onChange = (event, { newValue }) => {
        setValue(newValue);
    };

    const onSuggestionSelected = (e, v) => {
        if (searchkeyType == 'jobs')
            dispatch({
                type: 'JOBS_FILTER_PARAMS',
                jobsFilterParams: {
                    ...jobsFilterParams,
                    ticker: v.suggestion.ticker,
                    companyName: v.suggestion.name,
                    filter: "all",
                    showChild: "false",
                },
            });
        if (searchkeyType == 'skills')
            dispatch({
                type: 'SKILL_SEARCH_VALUE',
                skillSearchValue: v.suggestion.name,
            });
        if (searchkeyType == 'saas')
            dispatch({
                type: 'SAAS_SEARCH_VALUE',
                saasSearchValue: v.suggestion.name,
            });
    };

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    const onSuggestionsFetchRequested = ({ value }) => {
        setSuggestions(getSuggestions(value));
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
        placeholder: 'Find Jobs, Skills',
        value: value,
        onChange: onChange,
        className: 'input-control line-height-32',
        disabled: getSuggestionStatus,
    };

    const logo = (
        <div className="logo">
            <NavLink to="/home">
                <img src={logoImg} />
            </NavLink>
        </div>
    );
    const searchBar = (
        <div className="SearchBarContainer">
            <div className="flex-grow-input">
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                    onSuggestionSelected={onSuggestionSelected}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                />
            </div>
        </div>
    );
    const userIcon = userPicture ? (
        <div className="userIcon">
            <img
                src={userPicture}
                style={{ width: '100%', borderRadius: '25px' }}
            />
        </div>
    ) : (
        <div className="userIcon without-image">
            {userParse ? userParse.email.substring(0, 2).toUpperCase() : ''}
        </div>
    );
    return (
        <div className="row header-nav">
            <div className="col-lg-12 d-none d-sm-block">
                <div className="nav-wrapper">
                    <div className="nav-left">
                        {logo}
                        <Menu />
                        {searchBar}
                    </div>
                    <div className="nav-right">{userIcon}</div>
                </div>
            </div>
            <div className="col-lg-12 d-block d-sm-none">
                <div className="nav-wrapper">
                    <div className="nav-left">
                        {logo}
                        <Menu />
                    </div>
                    <div className="nav-right">
                        {searchBar}
                        {userIcon}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
