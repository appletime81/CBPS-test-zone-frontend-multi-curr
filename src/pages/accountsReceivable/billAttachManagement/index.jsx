import { useState } from 'react';
import { Grid } from '@mui/material';
// project import
import MainCard from 'components/MainCard';
import IsSendDataList from './isSendDataList';
import ReceivableQuery from './receivableQuery';

const GenerateFeeAmount = () => {
    const [listInfo, setListInfo] = useState([]);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <ReceivableQuery setListInfo={setListInfo} />
            </Grid>
            <Grid item xs={12}>
                <MainCard title="帳單資料列表">
                    <IsSendDataList listInfo={listInfo} />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default GenerateFeeAmount;
