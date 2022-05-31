import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import BounceLoader from 'react-spinners/BounceLoader';
import { Dropdown } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import {
    Chart as JobChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import JobChart from 'react-apexcharts';
import './jobs.css';
import {
    jobsSeries,
    jobsOptions,
    getJobSkillTrends,
} from './../../services/skillDataService.js';

import { reloadIfTokenExpire } from './../../services/common.js';
import { useSelector, useDispatch } from 'react-redux';

JobChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const override = css`
    display: block;
    margin: 0 auto;
`;

function Jobs(props) {
    const dispatch = useDispatch();
    const { jobTrends, jobsFilterParams } = useSelector((s) => s);
    const [jobChartOptions, setJobChartOptions] = useState({ ...jobsOptions });
    const [jobsData, setJobsData] = useState([...jobsSeries]);
    const [loading, setLoading] = useState(false);
    const [wait, setWait] = useState(true);
    const [initialLoading, setInitialLoading] = useState(props.initialLoading);

    const callJobsData = (jobsFilterParams) => {
        setLoading(true);
        getJobSkillTrends(jobsFilterParams).then(function (response) {
            dispatch({ type: 'JOB_TRENDS', jobTrends: response.data });
            setLoading(false);
        });
    };

    const handleFilterChange = (filter) => {
        dispatch({
            type: 'JOBS_FILTER_PARAMS',
            jobsFilterParams: { ...jobsFilterParams, filter: filter },
        });
    };

    const handleFilterShowChildChange = (showChild) => {
        dispatch({
            type: 'JOBS_FILTER_PARAMS',
            jobsFilterParams: { ...jobsFilterParams, showChild },
        });
    };
    useEffect(() => {
        if (jobsFilterParams.ticker && !initialLoading)
            callJobsData(jobsFilterParams);
        setInitialLoading(false);
    }, [jobsFilterParams]);

    useEffect(() => {
        if ('total_job_openings' in jobTrends) {
            reloadIfTokenExpire(jobTrends);
            let jobsDates;
            let series1 = [...jobsSeries];
            let options1 = { ...jobsOptions };
            series1[0].name = '# of total job openings';
            series1[0].data = Object.values(jobTrends.total_job_openings);
            if(jobsFilterParams.filter != 'all'){
                series1[0].data = [];
            }
            series1[1].name = '# of new job openings (84 day trailing sum)';
            series1[1].data = Object.values(
                jobTrends.num_new_jobs_past_84_days
            );
            jobsDates = Object.keys(jobTrends.num_new_jobs_past_84_days);
            options1.xaxis.categories = jobsDates;
            setJobChartOptions(options1);
            setJobsData(series1);
        }
    }, [jobTrends]);

    setTimeout(() => {
        setWait(false);
    }, 100);

    return (
        <div>
            <Card className="box">
                <Card.Body>
                    <Card.Title>
                        <div className="skill-data-header-wrapper">
                            <h2 className="heading">
                                {jobsFilterParams.companyName && (
                                    <div>
                                        <span className="text-capitalize">
                                            {jobsFilterParams.companyName}
                                        </span>
                                        <div className="text-muted xs-small">
                                            Number of total and new job openings
                                            (trailing 84 day sum)
                                        </div>
                                    </div>
                                )}
                            </h2>
                            <div className="header-right">
                                <div className="skill-data-header">
                                    <span className="text-muted xs-small">
                                        Acquired Companies:
                                    </span>
                                    <Dropdown
                                        className="dropdown-select"
                                        onSelect={(showChild) =>
                                            handleFilterShowChildChange(
                                                showChild
                                            )
                                        }
                                    >
                                        <Dropdown.Toggle
                                            className="dropdown-select"
                                            disabled={jobsFilterParams.ticker ? false : true}
                                        >
                                            {jobsFilterParams.showChild ==
                                            'true'
                                                ? 'Include'
                                                : 'Exclude'}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item eventKey="true">
                                                Include
                                            </Dropdown.Item>
                                            <Dropdown.Item eventKey="false">
                                                Exclude
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div className="skill-data-header rvlr-ml-8">
                                    <span className="text-muted xs-small">
                                        Job Type:
                                    </span>
                                    <Dropdown
                                        className="dropdown-select"
                                        onSelect={(filter) =>
                                            handleFilterChange(filter)
                                        }
                                    >
                                        <Dropdown.Toggle
                                            className="dropdown-select"
                                            disabled={jobsFilterParams.ticker ? false : true}
                                        >
                                            {jobsFilterParams.filter
                                                ? jobsFilterParams.filter
                                                : 'Choose type..'}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item eventKey="all">
                                                All
                                            </Dropdown.Item>
                                            <Dropdown.Item eventKey="sales">
                                                Sales
                                            </Dropdown.Item>
                                            <Dropdown.Item eventKey="engineering">
                                                Engineering
                                            </Dropdown.Item>
                                            <Dropdown.Item eventKey="customer success">
                                                Customer Success
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </Card.Title>

                    <div className="skill-data-chart">
                        {(loading || wait) && (
                            <BounceLoader
                                color={'#36D7B7'}
                                css={override}
                                size={50}
                            />
                        )}
                        {!loading && !wait && (
                            <JobChart
                                key="jobsChart"
                                name="jobsChart"
                                id="jobsChart"
                                options={jobChartOptions}
                                series={jobsData}
                                type="line"
                                width="100%"
                                height="400"
                            />
                        )}
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Jobs;
