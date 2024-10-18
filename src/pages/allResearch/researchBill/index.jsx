import { useState } from 'react';
import { Grid } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import ResearchBillQuery from './researchBillQuery';
import ResearchBillDataList from './researchBillDataList';
import ResearchBillDetail from './researchBillDetail';

const ResearchBill = () => {
    const [listInfo, setListInfo] = useState([]);
    const [detailInfo, setDetailInfo] = useState([]);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <ResearchBillQuery setListInfo={setListInfo} setDetailInfo={setDetailInfo} />
            </Grid>
            <Grid item xs={12}>
                <MainCard title="發票列表">
                    <ResearchBillDataList listInfo={listInfo} setDetailInfo={setDetailInfo} />
                </MainCard>
            </Grid>
            <Grid item xs={12}>
                <MainCard title="帳單列表">
                    <ResearchBillDetail detailInfo={detailInfo} />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default ResearchBill;
