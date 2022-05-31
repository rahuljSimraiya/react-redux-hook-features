import axios from 'axios';

export const series = [
    {
        name: 'Total Jobs',
        type: 'line',
        data: [],
    },
    {
        name: 'New Jobs',
        type: 'line',
        data: [],
    },
];

export const jobsSeries = [
    {
        name: 'Total Jobs',
        type: 'line',
        data: [],
    },
    {
        name: 'New Jobs',
        type: 'line',
        data: [],
    },
];
export const skillsSeries = [
    {
        name: 'Total Jobs',
        type: 'line',
        data: [],
    },
    {
        name: 'New Jobs',
        type: 'line',
        data: [],
    },
];
export const options = {
    chart: {
        height: 300,
        type: 'line',
        stacked: false,
        toolbar: {
            enabled: false,
        },
        dropShadow: {
            enabled: true,
            opacity: 0.1,
        },
        zoom: {
            enabled: false,
        },
    },
    colors: ['#0000FF', '#FF0000', 'rgba(119, 119, 142, 0.05)'],
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: 'smooth',
        width: [3, 3, 0],
        dashArray: [0, 4],
        lineCap: 'round',
    },
    grid: {
        padding: {
            left: 0,
            right: 0,
        },
        strokeDashArray: 3,
    },
    markers: {
        size: 0,
        hover: {
            size: 0,
        },
    },
    xaxis: {
        type: 'month',
        categories: [],
        axisBorder: {
            show: false,
            color: 'rgba(119, 119, 142, 0.08)',
        },
        labels: {
          rotate: -20,
          rotateAlways: false,
          hideOverlappingLabels: true,
          offsetX: 20,
          formatter: function (e) {
              return e;
          },
       },
    },
    yaxis: [
       {
           title: {
               text: 'Total Jobs',
           },
       },
       {
           opposite: true,
           title: {
               text: 'New Jobs',
           },
       },
    ],
    fill: {
        gradient: {
            inverseColors: false,
            shade: 'light',
            type: 'vertical',
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100],
        },
    },
    tooltip: {
        show: false,
    },
    legend: {
        position: 'top',
        show: true,
    },
 };

export const jobsOptions = {...options}
export const skillsOptions = {...options}

export const getJobSkillTrends = (trend) => {
    const accessToken = window.localStorage.getItem('accessToken' )
    let url =
        process.env.REACT_APP_SERVER_API +
        `api/jobs-opening-trends.csv?ticker=${trend.ticker}&job_type=${trend.filter}&show_child=${trend.showChild}&access_token=` +
        accessToken;
    if (trend.type == 'skills') {
        url =
            process.env.REACT_APP_SERVER_API +
            `api/skills-opening-trend?technology=${trend.name}&access_token=` +
            accessToken;
    }
    return axios({
        method: 'get',
        url: url,
        responseType: 'json',
    });
};
