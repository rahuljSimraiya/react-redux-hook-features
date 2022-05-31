import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import BounceLoader from 'react-spinners/BounceLoader';
import { Card } from 'react-bootstrap';
import {
    Chart as SkillChartJS,
    CategoryScale as SkillCategoryScale,
    LinearScale as SkillLinearScale,
    PointElement as SkillPointElement,
    LineElement as SkillLineElement,
    Title as SkillTitle,
    Tooltip as SkillTooltip,
    Legend as SkillLegend,
} from 'chart.js';
import SkillChart from 'react-apexcharts';
import './skills.css';
import {
    skillsSeries,
    skillsOptions,
    getJobSkillTrends,
} from './../../services/skillDataService.js';

import { reloadIfTokenExpire } from './../../services/common.js';
import { useSelector, useDispatch } from 'react-redux';

SkillChartJS.register(
    SkillCategoryScale,
    SkillLinearScale,
    SkillPointElement,
    SkillLineElement,
    SkillTitle,
    SkillTooltip,
    SkillLegend
);

const override = css`
    display: block;
    margin: 0 auto;
`;

function Skills(props) {
    const dispatch = useDispatch();
    const { skillTrends, skillSearchValue } = useSelector((s) => s);
    const filterParam = { name: skillSearchValue, type: 'skills' };
    const [skillChartOptions, setSkillChartOptions] = useState({
        ...skillsOptions,
    });
    const [skillsData, setSkillsData] = useState([...skillsSeries]);
    const [loading, setLoading] = useState(false);
    const [wait, setWait] = useState(true);
    const [initialLoading, setInitialLoading] = useState(props.initialLoading);

    const callSkillsData = (searchkeyValue1) => {
        filterParam.name = searchkeyValue1;
        setLoading(true);
        getJobSkillTrends(filterParam).then(function (response) {
            dispatch({ type: 'SKILL_TRENDS', skillTrends: response.data });
            setLoading(false);
        });
    };
    useEffect(() => {
        if (skillSearchValue && !initialLoading)
            callSkillsData(skillSearchValue);
        setInitialLoading(false);
    }, [skillSearchValue]);

    useEffect(() => {
        if (Object.keys(skillTrends).length) {
            reloadIfTokenExpire(skillTrends);
            let jobsDates;
            let series1 = [...skillsSeries];
            let options1 = { ...skillsOptions };
            series1[0].name = '% of companies (84 day moving average';
            series1[1].name = '% of job openings (84 day moving average)';
            const keys = Object.keys(skillTrends);

            jobsDates = keys;
            options1.xaxis.categories = jobsDates;
            series1[0].data = keys.map((e) => {
                if (
                    skillTrends[e]['% of companies (84 day moving average)'] ||
                    0
                ) {
                    return skillTrends[e][
                        '% of companies (84 day moving average)'
                    ].toFixed(2);
                }
                return 0;
            });
            series1[0].data = series1[0].data.filter((e) => e > 0);
            series1[1].data = keys.map((e) => {
                if (
                    skillTrends[e][
                        '% of job openings (84 day moving average)'
                    ] ||
                    0
                ) {
                    return skillTrends[e][
                        '% of job openings (84 day moving average)'
                    ].toFixed(2);
                }
                return 0;
            });
            series1[1].data = series1[1].data.filter((e) => e > 0);
            setSkillChartOptions(options1);
            setSkillsData(series1);
        }
    }, [skillTrends]);

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
                                {skillSearchValue && (
                                    <div>
                                        <span className="text-capitalize">
                                            {skillSearchValue}
                                        </span>
                                        <div className="text-muted xs-small">
                                            % of companies mentioning the skill
                                            in a job opening per day (84 day
                                            moving avg)
                                        </div>
                                    </div>
                                )}
                            </h2>
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
                            <SkillChart
                                key="skillsChart"
                                name="skillsChart"
                                id="skillsChart"
                                options={skillChartOptions}
                                series={skillsData}
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

export default Skills;
