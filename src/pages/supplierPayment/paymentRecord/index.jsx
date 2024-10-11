import { useState } from 'react';
import { Grid } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import ToPaymentDataList from './toPaymentDataList';
import SupplierPaymentQuery from './supplierPaymentQuery';

const SupplierPayment = () => {
    const [listInfo, setListInfo] = useState([]);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <SupplierPaymentQuery setListInfo={setListInfo} />
            </Grid>
            <Grid item xs={12}>
                <MainCard title={`付款紀錄列表`}>
                    <ToPaymentDataList listInfo={listInfo} />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default SupplierPayment;
