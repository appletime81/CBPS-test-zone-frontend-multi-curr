import { useState } from 'react';
import { Grid } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import ResearchInvoiceQuery from './researchInvoiceQuery';
import ResearchInvoiceDataList from './researchInvoiceDataList';
import ResearchInvoiceDetail from './researchInvoiceDetail';

const ResearchInvoice = () => {
    const [listInfo, setListInfo] = useState([]);
    const [detailInfo, setDetailInfo] = useState([]);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <ResearchInvoiceQuery setListInfo={setListInfo} setDetailInfo={setDetailInfo} />
            </Grid>
            <Grid item xs={12}>
                <MainCard title="帳單列表">
                    <ResearchInvoiceDataList listInfo={listInfo} setDetailInfo={setDetailInfo} />
                </MainCard>
            </Grid>
            <Grid item xs={12}>
                <MainCard title="發票列表">
                    <ResearchInvoiceDetail detailInfo={detailInfo} />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default ResearchInvoice;
