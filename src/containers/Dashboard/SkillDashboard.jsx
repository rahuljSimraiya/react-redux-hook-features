import React, { useEffect } from 'react';
import Navbar from './../Navbar/Navbar';
import SkillsTable from '../HistoricTable/SkillsTable';
import { Row, Col } from 'react-bootstrap';
import './Dashboard.css';
import { ReactComponent as LogoutSvg } from './../../assets/images/svgs/logout.svg';
import { useDispatch } from 'react-redux';
import Skills from './../Skills/Skills';

function Dashboard(props) {
    const dispatch = useDispatch();
    const handleLogout = () => {
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('exaple_user');
        window.location.href = '/';
    };

    useEffect(() => {
        dispatch({ type: 'SEARCH_KEY', searchkeyType: 'skills' });
    }, []);

    return (
        <div className="h-100">
            <Navbar />
            <Row className="aap-main-content">
                <Col lg={12}>
                    <Skills initialLoading={true} />
                    <SkillsTable
                        id="skillsTable"
                        name="skillsTable"
                        key="skillsTable"
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
