import { useEffect, useState } from 'react';
import { Grid, Button, Box, Tabs, Tab } from '@mui/material';
// import { styled } from '@mui/material/styles';

// project import
import CustomTabPanel from 'components/CustomTabPanel';
import MainCard from 'components/MainCard';
import RuleAdd from './ruleAdd';
import MemberBillDataList from './memberBillDataList';
import InvoiceNotificationDataList from './invoiceNotificationDataList';
import BillNotificationDataList from './billNotificationDataList';
import NotificationQuery from './notificationQuery';

// api
import {
    dropdownmenuSubmarineCable,
    dropdownmenuParties,
    getSysInvNotifyRule,
    getWorkTitle,
} from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const Information = () => {
    const dispatch = useDispatch();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [listInfo, setListInfo] = useState([]);
    const [partiesList, setPartiesList] = useState([]); //會員名稱下拉選單
    const [submarineCableList, setSubmarineCableList] = useState([]); //海纜名稱下拉選單
    const [value, setValue] = useState(0);
    const [workTitleList, setWorkTitleList] = useState([]); //海纜作業下拉選單

    const handleAddRuleOpen = () => {
        setIsDialogOpen(true);
    };

    const handleAddRuleClose = () => {
        setIsDialogOpen(false);
    };

    const a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    };

    const handleChange = (event, newValue) => {
        setListInfo([]);
        setValue(newValue);
    };

    const initQuery = () => {
        let tmpArray = {};
        if (value === 1 || value === '1') {
            fetch(getSysInvNotifyRule, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
                },
                body: JSON.stringify(tmpArray),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log('initQuery=>>', data);
                    setListInfo(data);
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
        }
    };

    useEffect(() => {
        fetch(dropdownmenuSubmarineCable, { method: 'GET' })
            .then((res) => res.json())
            .then((data) => {
                setSubmarineCableList(data);
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
        fetch(dropdownmenuParties, { method: 'GET' })
            .then((res) => res.json())
            .then((data) => {
                setPartiesList(data);
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
        fetch(getWorkTitle, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
            },
            body: JSON.stringify({}),
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setWorkTitleList(data);
                } else {
                    setWorkTitleList([]);
                }
            })
            .catch(() => {
                setWorkTitleList([]);
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
        fetch(getWorkTitle, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
            },
            body: JSON.stringify({}),
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setWorkTitleList(data);
                } else {
                    setWorkTitleList([]);
                }
            })
            .catch(() => {
                setWorkTitleList([]);
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
    }, []);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} display="flex" justifyContent="right">
                <Button sx={{ mr: '0.25rem' }} variant="contained" onClick={handleAddRuleOpen}>
                    + 新增提醒通知規則
                </Button>
                <RuleAdd
                    isDialogOpen={isDialogOpen}
                    handleAddRuleClose={handleAddRuleClose}
                    value={value}
                    partiesList={partiesList}
                    submarineCableList={submarineCableList}
                    action={'Add'}
                    initQuery={initQuery}
                    workTitleList={workTitleList}
                />
            </Grid>
            <Grid item xs={12}>
                <NotificationQuery
                    setListInfo={setListInfo}
                    partiesList={partiesList}
                    submarineCableList={submarineCableList}
                    value={value}
                    workTitleList={workTitleList}
                />
            </Grid>
            <Grid item xs={12}>
                <MainCard title="通知列表">
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'relative' }}>
                        <Tabs value={value} onChange={handleChange}>
                            <Tab label="會員帳單" {...a11yProps(0)} />
                            <Tab label="發票內部通知" {...a11yProps(1)} />
                            <Tab label="帳單內部通知" {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <MemberBillDataList listInfo={listInfo} />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <InvoiceNotificationDataList
                            listInfo={listInfo}
                            partiesList={partiesList}
                            submarineCableList={submarineCableList}
                            initQuery={initQuery}
                        />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                        <BillNotificationDataList listInfo={listInfo} />
                    </CustomTabPanel>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default Information;
