import React, { useEffect } from 'react';
import Navbar from './../Navbar/Navbar';
import JobsTable from '../HistoricTable/JobsTable';
import Watchlist from '../Watchlist/Watchlist';
import { Row, Col } from 'react-bootstrap';
import './Dashboard.css';
import { ReactComponent as LogoutSvg } from './../../assets/images/svgs/logout.svg';
import { useSelector, useDispatch } from 'react-redux';
import Jobs from './../Jobs/Jobs';

function Dashboard(props) {
    const dispatch = useDispatch();
    const { watchlist } = useSelector((state) => state);
    const handleLogout = () => {
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('exaple_user');
        window.location.href = '/';
    };

    const watchListAdded = (el) => {
        dispatch({
            type: 'WATCHLIST',
            watchlist: [
                ...watchlist,
                {
                    company_name: el.name,
                    company_ticker: el.ticker,
                    id: Math.random(),
                },
            ],
        });
    };

    useEffect(() => {
        dispatch({ type: 'SEARCH_KEY', searchkeyType: 'jobs' });
    }, []);

    return (
        <div className="h-100">
            <Navbar watchListAdded={(el) => watchListAdded(el)} />
            <Row className="aap-main-content">
                <Col lg={8}>
                    <Jobs initialLoading={true} />
                    <JobsTable
                        id="jobsTable"
                        name="jobsTable"
                        key="jobsTable"
                        initialLoading={true}
                    />
                </Col>
                <Col lg={4}>
                    <Watchlist />
                </Col>
            </Row>
            <button
                id="logout"
                className="logout-btn"
                onClick={() => handleLogout()}
            >
                <LogoutSvg />
            </button>
        </div>
    );
}

export default Dashboard;
