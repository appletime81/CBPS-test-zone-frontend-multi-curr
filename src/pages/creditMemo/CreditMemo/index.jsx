import { useState } from 'react';
import { Grid } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import CreditMemoDataList from './creditMemoDataList';
import CreditMemoQuery from './creditMemoQuery';

const CreditMemo = () => {
    const [listInfo, setListInfo] = useState([]);
    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <CreditMemoQuery setListInfo={setListInfo} />
            </Grid>
            <Grid item xs={12}>
                <MainCard title="Credit Memo資料列表">
                    <CreditMemoDataList listInfo={listInfo} />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default CreditMemo;
