import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { Card, Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './HistoricTable.css';
import BounceLoader from 'react-spinners/BounceLoader';
import { createCsv } from './../../services/historicDataService.js';
import { useSelector, useDispatch } from 'react-redux';

const override = css`
    display: block;
    margin: 0 auto;
`;

function SkillsTable(props) {
    const dispatch = useDispatch();
    const { skillSearchValue, skillTableData, skillTrends } = useSelector(
        (s) => s
    );
    const [isLoading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(props.initialLoading);

    let columns = [
        {
            dataField: 'date',
            text: 'Date',
            sort: true,
            headerStyle: (col, colIdx) => {
                return { width: '100px' };
            },
        },
        {
            dataField: '% of companies (84 day moving average)',
            text: '% of companies 84 days',
            sort: true,
        },
        {
            dataField: '% of job openings (84 day moving average)',
            text: '% of job openings 84 days',
            sort: true,
        },
        { dataField: 'number of companies', text: 'Companies', sort: true },
        {
            dataField: 'number of job openings',
            text: 'Job Openings',
            sort: true,
        },
        { dataField: 'total companies', text: 'Total companies', sort: true },
        {
            dataField: 'total job openings',
            text: 'Total job openings',
            sort: true,
        },
    ];

    const handleDownload = (csvFileDataObj) => {
        csvFileDataObj.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });
        createCsv(csvFileDataObj, {
            skillKey: { name: skillSearchValue, type: 'skills' },
        });
    };

    const getSkillHistricData = () => {
        const skillsDataObj = [];
        const new_skills_openings_keys = Object.keys(skillTrends);
        new_skills_openings_keys.map((date, index) => {
            const row = skillTrends[date];
            skillsDataObj.push({
                date: date,
                '% of companies (84 day moving average)':
                    row['% of companies (84 day moving average)'],
                '% of job openings (84 day moving average)':
                    row['% of job openings (84 day moving average)'],
                'number of companies': row['number of companies'],
                'number of job openings': row['number of job openings'],
                'total companies': row['total companies'],
                'total job openings': row['total job openings'],
            });
        });
        dispatch({ type: 'SKILL_TABLE_DATA', skillTableData: skillsDataObj });
        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
    }, [skillSearchValue]);

    useEffect(() => {
        if (skillSearchValue && !initialLoading) {
            getSkillHistricData();
        } else {
            setLoading(false);
        }
        setInitialLoading(false);
    }, [skillTrends]);

    const pagination = paginationFactory({
        page: 1,
        showTotal: true,
        sizePerPage: 50,
    });

    return (
        <div style={{ marginTop: 30 }}>
            <Card className="box">
                {
                    <h2 className="heading relative">
                        Historic Data{' '}
                        <Button
                            onClick={() => handleDownload(skillTableData)}
                            className={`position-right custom-dark-mode ${
                                !skillTableData.length ? 'disabled' : ''
                            }`}
                        >
                            Download Data
                        </Button>{' '}
                    </h2>
                }
                {isLoading && (
                    <BounceLoader color={'#36D7B7'} css={override} size={50} />
                )}
                {!isLoading && (
                    <BootstrapTable
                        key="skillsTable"
                        id="skillsTable"
                        name="skillsTable"
                        keyField="date"
                        data={skillTableData}
                        columns={columns}
                        pagination={pagination}
                        sort={{ dataField: 'date', order: 'desc' }}
                    />
                )}
            </Card>
        </div>
    );
}

export default SkillsTable;
