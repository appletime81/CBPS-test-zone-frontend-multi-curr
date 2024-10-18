import { useEffect, useState, useRef } from 'react';

// material-ui
import { Grid } from '@mui/material';
// project import
import MainCard from 'components/MainCard';
import InvoiceQuery from './invoiceQuery';
import InvoiceDataList from './invoiceDataList';

const InvoiceWorkManage = () => {
    const [listInfo, setListInfo] = useState([]);
    const [page, setPage] = useState(0); //分頁Page

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <MainCard sx={{ width: '100%' }}>
                    <Grid container display="flex" spacing={2}>
                        <Grid item xs={12}>
                            <InvoiceQuery setListInfo={setListInfo} />
                        </Grid>
                    </Grid>
                </MainCard>
            </Grid>
            <Grid item xs={12}>
                <MainCard title="發票資料列表" sx={{ width: '100%' }}>
                    <Grid container display="flex" spacing={2}>
                        <Grid item xs={12}>
                            <InvoiceDataList listInfo={listInfo} page={page} setPage={setPage} />
                        </Grid>
                    </Grid>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default InvoiceWorkManage;
