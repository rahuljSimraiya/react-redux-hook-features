import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import BounceLoader from 'react-spinners/BounceLoader';
import { Card, Button } from 'react-bootstrap';
import './Watchlist.css';
import {
    getWatchlist,
    removeWatchlist,
} from './../../services/watchlistService.js';
import { reloadIfTokenExpire } from './../../services/common.js';
import { useSelector, useDispatch } from 'react-redux';

const override = css`
    display: block;
    margin: 0 auto;
`;

function Watchlist(props) {
    const dispatch = useDispatch();
    const { jobsFilterParams, watchlist, watchlistUpdated } = useSelector(
        (state) => state
    );
    const [loading, setLoading] = useState(true);
    const removeFromWatchlist = (e, el) => {
        e.target.parentNode.style.display = 'none';
        removeWatchlist(el)
            .then(function (response) {
                reloadIfTokenExpire(response.data);
                dispatch({ type: 'WATCHLIST_UPDATED', watchlistUpdated: true });
            })
            .catch(function (error) {
                console.log(error);
            })
    };

    useEffect(() => {
        if (!watchlist.length || watchlistUpdated) {
            setLoading(true);
            getWatchlist()
                .then(function (response) {
                    reloadIfTokenExpire(response.data);
                    dispatch({
                        type: 'WATCHLIST',
                        watchlist: response.data.results,
                    });
                    setLoading(false);
                    dispatch({
                        type: 'WATCHLIST_UPDATED',
                        watchlistUpdated: false,
                    });
                })
                .catch(function (error) {
                    console.log(error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);
    const onWatchlistSelected = (el) => {
        dispatch({
            type: 'JOBS_FILTER_PARAMS',
            jobsFilterParams: {
                ...jobsFilterParams,
                ticker: el.company_ticker,
                companyName: el.company_name,
                filter: "all",
                showChild: "false",
            },
        });
    };
    return (
        <div>
            <Card className="box">
                <Card.Body>
                    <Card.Title>
                        <h2 className="heading">My watchlist </h2>
                    </Card.Title>
                    <div className="listScrool">
                        {loading ? (
                            <BounceLoader
                                color={'#36D7B7'}
                                css={override}
                                size={50}
                            />
                        ) : (
                            watchlist &&
                            watchlist.map((el) => (
                                <div
                                    key={el.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '15px',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <div className="starting-char">T</div>
                                        <div
                                            onClick={() =>
                                                onWatchlistSelected(el)
                                            }
                                            className="ticker-pipe"
                                            title={el.company_ticker}
                                        >
                                            {el.company_name}
                                            <br />
                                            <div className="text-muted small">
                                                {el.company_ticker}
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={(e) =>
                                            removeFromWatchlist(e, el)
                                        }
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Watchlist;
