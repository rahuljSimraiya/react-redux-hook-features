import axios from 'axios';

export const historicJobsData = (ticker, jobType) => {
    const accessToken = window.localStorage.getItem('accessToken' )
    return axios({
        method: 'get',
        url:
            process.env.REACT_APP_SERVER_API +
            `api/jobs-opening-trends.csv?ticker=${ticker}&job_type=${jobType}&access_token=` +
            accessToken,
        responseType: 'json',
    });
};
export const historicSkillsData = (technology) => {
    const accessToken = window.localStorage.getItem('accessToken' )
    return axios({
        method: 'get',
        url:
            process.env.REACT_APP_SERVER_API +
            `api/skills-opening-trend?technology=${technology}&access_token=` +
            accessToken,
        responseType: 'json',
    });
};

export const historicVendorsData = (vendor) => {
    const accessToken = window.localStorage.getItem('accessToken' )
    return axios({
        method: 'get',
        url:
            process.env.REACT_APP_SERVER_API +
            `api/vendors?vendor=${vendor.name}&access_token=` +
            accessToken,
        responseType: 'json',
    });
};
export const createCsv = (csvFileDataObj, props) => {
    if (!csvFileDataObj.length) return false;
    let csvFileData = [];
    let csv = '';
    if(props.skillKey.type == 'jobs'){
        csvFileData = csvFileDataObj.map((e) => [
            e.date,
            e.total_job_openings,
            e.num_new_jobs_past_84_days,
        ]);
        csv = 'Date, TOTAL JOB OPENINGS, NUM OF NEW JOBS PAST 84 DAYS \n';
    }
    else if(props.skillKey.type == 'saas'){
        csvFileData = csvFileDataObj.map((e) => [
            e.change_date,
            e.current_status,
            e.org_alias,
            e.prev_status,
        ]);
        csv = 'Change Date, Current Status, Org Alias, Prev Status \n';
    }else{
        csvFileData = csvFileDataObj.map((e) => [
            e.date,
            e['% of companies (84 day moving average)'],
            e['% of job openings (84 day moving average)'],
            e['number of companies'],
            e['number of job openings'],
            e['total companies'],
            e['total job openings'],
        ]);
        csv = 'Date,% of companies,% of job openings,Companies,Job Openings,Total companies,Total job openings\n';
    }


    csvFileData.forEach(function (row) {
        csv += row.join(',');
        csv += '\n';
    });
    let hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    let fileName = props.skillKey.name ? props.skillKey.name + ' ' : '';
    if (fileName) {
        fileName = fileName[0].toUpperCase() + fileName.slice(1);
    }
    fileName += 'Historical Data.csv';
    hiddenElement.download = fileName;
    hiddenElement.click();
};
