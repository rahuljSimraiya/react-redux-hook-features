import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { Card, Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './HistoricTable.css';
import BounceLoader from 'react-spinners/BounceLoader';
import {
    historicVendorsData,
    createCsv,
} from './../../services/historicDataService.js';
import { useSelector, useDispatch } from 'react-redux';

const override = css`
    display: block;
    margin: 0 auto;
`;

const getHistoricData = async (props) => {
    const skillKey = props.skillKey ? props.skillKey : { name: '', type: '' };
    let saasData = [];
    let loading = true;

    const populateVendorsHistoricData = async (vendor) => {
        loading = true;
        if (!vendor) {
            loading = false;
        }
        await historicVendorsData(vendor)
            .then(function (response) {
                saasData = response.data.changes;
                loading = false;
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    };
    if (skillKey.name) {
        await populateVendorsHistoricData(skillKey, 'all');
    } else {
        loading = false;
    }
    return { saasData, loading };
};

function SaasTable(props) {
    const dispatch = useDispatch();
    const { saasSearchValue, saasTableData } = useSelector((s) => s);

    const params = { ...props, skillKey: { name: saasSearchValue } };

    const [tableData, setTableData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(props.initialLoading);

    let columns = [
        {
            dataField: 'change_date',
            text: 'Change Date',
            sort: true,
            headerStyle: (col, colIdx) => {
                return { width: '200px' };
            },
        },
        { dataField: 'current_status', text: 'Current Status', sort: true },
        { dataField: 'org_alias', text: 'Org Alias', sort: true },
        { dataField: 'prev_status', text: 'Prev Status', sort: true },
    ];

    const handleDownload = (csvFileDataObj) => {
        csvFileDataObj.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });
        createCsv(csvFileDataObj, {
            skillKey: { name: saasSearchValue, type: 'saas' },
        });
    };

    const getJobHistricData = async (saasSearchValue) => {
        setLoading(true);
        params.skillKey = { name: saasSearchValue };
        const { saasData, loading } = await getHistoricData(params);
        dispatch({ type: 'SAAS_TABLE_DATA', saasTableData: saasData });
        setTableData(saasData);
        setLoading(loading);
    };

    useEffect(() => {
        if (saasSearchValue && !initialLoading)
            getJobHistricData(saasSearchValue);
        setInitialLoading(false);
    }, [saasSearchValue]);

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
                        {saasSearchValue &&
                            <div>SaaS Subscriptions for {saasSearchValue}</div>
                        }

                        <Button
                            onClick={() => handleDownload(saasTableData)}
                            className={`position-right custom-dark-mode ${
                                !tableData.length ? 'disabled' : ''
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
                        key="saasTable"
                        id="saasTable"
                        name="saasTable"
                        keyField="org_alias"
                        data={saasTableData}
                        columns={columns}
                        pagination={pagination}
                        sort={{ dataField: 'date', order: 'desc' }}
                    />
                )}
            </Card>
        </div>
    );
}

export default SaasTable;
