import { useState, useRef } from 'react';
import { Grid, Button } from '@mui/material';
// import { styled } from '@mui/material/styles';

// project import
import MainCard from 'components/MainCard';
import ResearchInvoiceQuery from './researchInvoiceQuery';
import ResearchInvoiceDataList from './researchInvoiceDataList';
import ResearchInvoiceDetail from './researchInvoiceDetail';

// redux
import { useSelector } from 'react-redux';

const ResearchInvoice = () => {
    const queryApi = useRef('/all');
    const [listInfo, setListInfo] = useState([]);
    const [datailInfo, setDetailInfo] = useState([]);

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
                    <ResearchInvoiceDetail datailInfo={datailInfo} />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default ResearchInvoice;
