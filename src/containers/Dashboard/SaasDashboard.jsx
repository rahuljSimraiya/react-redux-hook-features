import React, { useEffect } from 'react';
import Navbar from './../Navbar/Navbar';
import SaasTable from '../HistoricTable/SaasTable';
import { Row, Col } from 'react-bootstrap';
import './Dashboard.css';
import { ReactComponent as LogoutSvg } from './../../assets/images/svgs/logout.svg';
import { useDispatch } from 'react-redux';

function Dashboard(props) {
    const dispatch = useDispatch();
    const handleLogout = () => {
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('exaple_user');
        window.location.href = '/';
    };

    useEffect(() => {
        dispatch({ type: 'SEARCH_KEY', searchkeyType: 'saas' });
    }, []);

    return (
        <div className="h-100">
            <Navbar />
            <Row className="aap-main-content">
                <Col lg={12}>
                    <SaasTable
                        id="saasTable"
                        name="saasTable"
                        key="saasTable"
                        initialLoading={true}
                    />
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
