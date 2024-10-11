import { useEffect, useState, useRef } from 'react';
import { Grid, Button, Box, Tabs, Tab } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import CustomTabPanel from 'components/CustomTabPanel';
import ToCombineDataList from './toCombineDataList';
import ToDeductDataList from './toDeductDataList';
import DeductedDataList from './deductedDataList';
import SignedDataList from './signedDataList';
import InvalidatedDataList from './invalidatedDataList';

import ReceivableQuery from './receivableQuery';
import { queryToCombineInvo, queryToDecutBill, quertDeductedData } from 'components/apis';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const GenerateFeeAmount = () => {
    const [value, setValue] = useState(0);
    const [listInfo, setListInfo] = useState([]);
    const dispatch = useDispatch();
    const queryApi = useRef('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [cbToCn, setCbToCn] = useState({}); //勾選合併狀態
    const handleChange = (event, newValue) => {
        setListInfo([]);
        setValue(newValue);
        if (value !== 0) {
            initList();
        }
    };

    const a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };
    const handleDialogOpen = () => {
        if (Object.values(cbToCn).indexOf(true) > -1) {
            setIsDialogOpen(true); //打開的時候才會觸發合併API
        } else {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請至少勾選一筆發票項目',
                    },
                }),
            );
        }
    };

    const initList = () => {
        setCbToCn({});
    };

    //初始化查詢
    const receivableQueryInit = () => {
        let tmpQuery = '';
        if (queryApi.current !== '' && value === 0) {
            tmpQuery = queryToCombineInvo + '/Status=TO_MERGE';
        } else if (queryApi.current !== '' && value === 1) {
            tmpQuery = queryToDecutBill + '/Status=INITIAL​';
        } else if (queryApi.current !== '' && value === 2) {
            tmpQuery = quertDeductedData + '/Status=RATED';
        } else if (queryApi.current !== '' && value === 3) {
            tmpQuery = queryToDecutBill + '/Status=SIGNED';
        } else if (queryApi.current !== '' && value === 4) {
            tmpQuery = queryToDecutBill + '/Status=INVALID';
        } else {
            tmpQuery = queryApi.current;
        }
        fetch(tmpQuery, {
            method: 'GET',
            Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.length > 0) {
                    setListInfo(data);
                } else {
                    setListInfo([]);
                    dispatch(
                        setMessageStateOpen({
                            messageStateOpen: {
                                isOpen: true,
                                severity: 'info',
                                message: '查無資料',
                            },
                        }),
                    );
                }
            })
            .catch(() => {
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'error',
                            message: '網路異常，請檢查網路連線或與系統窗口聯絡',
                        },
                    }),
                );
            });
    };

    useEffect(() => {
        queryApi.current = '';
    }, [value]);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <ReceivableQuery value={value} setListInfo={setListInfo} queryApi={queryApi} />
            </Grid>
            <Grid item xs={12}>
                <MainCard
                    title={`${
                        value === 0
                            ? '待合併'
                            : value === 1
                            ? '待抵扣'
                            : value === 2
                            ? '已抵扣'
                            : value === 3
                            ? '已簽核'
                            : '已作廢'
                    }帳單資料列表`}
                >
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'relative' }}>
                        <Tabs value={value} onChange={handleChange}>
                            <Tab label="待合併" {...a11yProps(0)} />
                            <Tab label="待抵扣" {...a11yProps(1)} />
                            <Tab label="已抵扣" {...a11yProps(2)} />
                            <Tab label="已簽核" {...a11yProps(3)} />
                            <Tab label="已作廢" {...a11yProps(4)} />
                        </Tabs>
                        {value === 0 ? (
                            <Button
                                color="primary"
                                variant="contained"
                                sx={{
                                    position: 'absolute',
                                    right: 0,
                                    top: 4,
                                }}
                                onClick={handleDialogOpen}
                            >
                                + 合併帳單
                            </Button>
                        ) : null}
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <ToCombineDataList
                            handleDialogClose={handleDialogClose}
                            isDialogOpen={isDialogOpen}
                            dataList={listInfo}
                            cbToCn={cbToCn}
                            setCbToCn={setCbToCn}
                            receivableQuery={receivableQueryInit}
                            initList={initList}
                        />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <ToDeductDataList
                            dataList={listInfo}
                            receivableQuery={receivableQueryInit}
                        />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                        <DeductedDataList
                            dataList={listInfo}
                            receivableQuery={receivableQueryInit}
                        />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={3}>
                        <SignedDataList dataList={listInfo} receivableQuery={receivableQueryInit} />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={4}>
                        <InvalidatedDataList dataList={listInfo} />
                    </CustomTabPanel>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default GenerateFeeAmount;
