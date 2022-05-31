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

function JobsTable(props) {
    const dispatch = useDispatch();
    const { jobsFilterParams, jobTableData, jobTrends } = useSelector(
        (s) => s
    );
    const [isLoading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(props.initialLoading);

    let columns = [
        { dataField: 'date', text: 'Date', sort: true },
        {
            dataField: 'total_job_openings',
            text: 'Total job openings',
            sort: true,
        },
        {
            dataField: 'num_new_jobs_past_84_days',
            text: '# of new jobs past 84 days',
            sort: true,
        },
    ];

    const handleDownload = (csvFileDataObj) => {
        csvFileDataObj.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });
        createCsv(csvFileDataObj, {
            skillKey: { name: jobsFilterParams.companyName, type: 'jobs' },
        });
    };

    const getJobHistricData = () => {

        const jobsDataObj = [];
        const new_job_openings_keys = Object.keys(
            jobTrends.num_new_jobs_past_84_days
        );
        let previousJob = 0;
        new_job_openings_keys.map((value) => {
            const totalJobsOpenings =
            jobTrends.total_job_openings[value];
            const newJobs84Days =
            jobTrends.num_new_jobs_past_84_days[value];
            let progressColor = 'success';
            if (newJobs84Days < previousJob) progressColor = 'danger';
            previousJob = newJobs84Days;
            jobsDataObj.push({
                date: value,
                total_job_openings: totalJobsOpenings,
                num_new_jobs_past_84_days: newJobs84Days,
            });
        });
        dispatch({ type: 'JOB_TABLE_DATA', jobTableData: jobsDataObj });
        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
    }, [jobsFilterParams]);
    useEffect(() => {
        if (jobsFilterParams.ticker && !initialLoading){
            getJobHistricData();
        }else{
            setLoading(false);
        }
        setInitialLoading(false);
    }, [jobTrends]);

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
                            onClick={() => handleDownload(jobTableData)}
                            className={`position-right custom-dark-mode ${
                                !jobTableData.length ? 'disabled' : ''
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
                        key="jobsTable"
                        id="jobsTable"
                        name="jobsTable"
                        keyField="date"
                        data={jobTableData}
                        columns={columns}
                        pagination={pagination}
                        sort={{ dataField: 'date', order: 'desc' }}
                    />
                )}
            </Card>
        </div>
    );
}

export default JobsTable;
