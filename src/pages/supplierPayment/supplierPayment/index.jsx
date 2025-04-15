import { useState, useRef } from 'react';
import { Grid, Button, Box, Tabs, Tab } from '@mui/material';

// project import
import CustomTabPanel from 'components/CustomTabPanel';
import MainCard from 'components/MainCard';
import ToPaymentDataList from './toPaymentDataList';
import PaymentedDataList from './paymentedDataList';
import SupplierPaymentQuery from './supplierPaymentQuery';

import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const SupplierPayment = () => {
    const [value, setValue] = useState(0);
    const queryApi = useRef('/Status=PAYING');
    const [cbToCn, setCbToCn] = useState({}); //勾選合併狀態
    const [isSend, setIsSend] = useState(false);
    const dispatch = useDispatch();
    const [listInfo, setListInfo] = useState([]);

    const handleChange = (event, newValue) => {
        setListInfo([]);
        setValue(newValue);
    };

    const a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`
        };
    };

    const supplierPaymentQuery = () => {
        fetch(queryApi.current, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setListInfo(data);
            })
            .catch((e) => {
                console.log('e1=>', e);
            });
    };

    const sendPaymentData = () => {
        if (Object.values(cbToCn).indexOf(true) > -1) {
            setIsSend(true); //打開的時候才會觸發合併API
        } else {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請至少勾選一筆發票項目'
                    }
                })
            );
        }
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <SupplierPaymentQuery setListInfo={setListInfo} queryApi={queryApi} value={value} />
            </Grid>
            <Grid item xs={12}>
                <MainCard title={value === 0 ? '待確認資料列表' : '已確認資料列表'}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'relative' }}>
                        <Tabs value={value} onChange={handleChange}>
                            <Tab label="待確認" {...a11yProps(0)} />
                            <Tab label="已確認" {...a11yProps(1)} />
                        </Tabs>
                        {value === 0 ? (
                            <>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    sx={{
                                        position: 'absolute',
                                        right: 5,
                                        top: 4
                                    }}
                                    onClick={() => {
                                        sendPaymentData();
                                    }}
                                >
                                    付款送出(進入函稿)
                                </Button>
                            </>
                        ) : null}
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <ToPaymentDataList
                            listInfo={listInfo}
                            cbToCn={cbToCn}
                            setCbToCn={setCbToCn}
                            isSend={isSend}
                            setIsSend={setIsSend}
                            supplierPaymentQuery={supplierPaymentQuery}
                            queryApi={queryApi.current}
                            setListInfo={setListInfo}
                        />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <PaymentedDataList listInfo={listInfo} />
                    </CustomTabPanel>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default SupplierPayment;
