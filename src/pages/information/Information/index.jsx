import { useEffect, useState } from 'react';
import {
    Grid,
    Button,
    Box,
    Tabs,
    Tab,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';

// project import
import CustomTabPanel from 'components/CustomTabPanel';
import MainCard from 'components/MainCard';
import SupplierDataList from './supplierDataList';
import PartyDataList from './partyDataList';
import SubmarineCableDataList from './submarineCableDataList';
import CBPBankAccount from './cBPBankAccount';

//api
import {
    submarineCableInfoList,
    supplierNameDropDownUnique,
    submarineCables,
    suppliers,
    getPartiesInfoList,
    parties,
    corporates,
} from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const Information = () => {
    const dispatch = useDispatch();
    const [value, setValue] = useState(0);
    const [submarineCableList, setSubmarineCableList] = useState([]); //海纜名稱下拉選單
    const [supNmList, setSupNmList] = useState([]); //供應商下拉選單
    const [submarineCable, setSubmarineCable] = useState('All'); //海纜名稱
    const [workTitle, setWorkTitle] = useState('All'); //海纜作業
    const [supplierName, setSupplierName] = useState('All'); //供應商
    const [partyName, setPartyName] = useState('All'); //會員
    const [partiesList, setPartiesList] = useState([]); //會員下拉選單
    const [infoList, setInfoList] = useState();
    const handleChange = (event, newValue) => {
        setInfoList([]);
        setValue(newValue);
    };

    const a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    };

    const handleQuery = () => {
        let tmpQuery = '/view';
        let tmpObject = {};
        if (submarineCable && submarineCable !== 'All' && value === 0) {
            tmpObject.CableName = submarineCable;
        }
        if (submarineCable && submarineCable !== 'All' && value !== 0) {
            tmpObject.SubmarineCable = submarineCable;
        }
        if (workTitle && workTitle !== 'All' && value !== 0) {
            tmpObject.WorkTitle = workTitle;
        }
        if (supplierName && supplierName !== 'All' && value === 1) {
            tmpObject.SupplierName = supplierName;
        }
        if (partyName && partyName !== 'All' && value === 2) {
            tmpObject.PartyName = partyName;
        }
        if (value === 0) {
            tmpQuery = submarineCables + tmpQuery;
            fetch(tmpQuery, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
                },
                body: JSON.stringify(tmpObject),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log('data=>>', data);
                    if (Array.isArray(data)) {
                        setInfoList(data);
                    } else {
                        setInfoList([]);
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
        } else if (value === 1) {
            tmpQuery = suppliers + tmpQuery;
            fetch(tmpQuery, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
                },
                body: JSON.stringify(tmpObject),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log('data=>>', data);
                    if (Array.isArray(data)) {
                        setInfoList(data);
                    } else {
                        setInfoList([]);
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
        } else if (value === 2) {
            tmpQuery = parties + tmpQuery;
            fetch(tmpQuery, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
                },
                body: JSON.stringify(tmpObject),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log('data=>>', data);
                    if (Array.isArray(data)) {
                        setInfoList(data);
                    } else {
                        setInfoList([]);
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
        } else {
            tmpQuery = corporates + tmpQuery;
            fetch(tmpQuery, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
                },
                body: JSON.stringify(tmpObject),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log('data=>>', data);
                    if (Array.isArray(data)) {
                        setInfoList(data);
                    } else {
                        setInfoList([]);
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
        }
    };

    const initQuery = () => {
        setSubmarineCable('All');
        setWorkTitle('All');
        setSupplierName('All');
        setPartyName('All');
    };

    useEffect(() => {
        fetch(supplierNameDropDownUnique, {
            method: 'GET',
            Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('data=>>', data);
                if (Array.isArray(data)) {
                    setSupNmList(data);
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
        //海纜名稱
        fetch(submarineCableInfoList, { method: 'GET' })
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
        //會員名稱
        fetch(getPartiesInfoList, { method: 'GET' })
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
    }, []);

    useEffect(() => {
        initQuery();
    }, [value]);

    return (
        <Grid container spacing={1} id="tableContainer">
            <Grid item xs={12}>
                <MainCard title="基本資料查詢" sx={{ width: '100%' }}>
                    <Grid
                        container
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Grid item md={1} lg={1}>
                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                    ml: { lg: '0.5rem', xl: '1.5rem' },
                                }}
                            >
                                海纜名稱：
                            </Typography>
                        </Grid>
                        <Grid item sm={2} md={2} lg={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>選擇海纜名稱</InputLabel>
                                <Select
                                    value={submarineCable}
                                    label="海纜名稱"
                                    size="small"
                                    onChange={(e) => setSubmarineCable(e.target.value)}
                                >
                                    <MenuItem value={'All'}>All</MenuItem>
                                    {submarineCableList.map((i) => (
                                        <MenuItem key={i.CableName} value={i.CableName}>
                                            {i.CableName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {value === 1 || value === 2 || value === 3 ? (
                            <>
                                <Grid item md={1} lg={1}>
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                            ml: { lg: '0.5rem', xl: '1.5rem' },
                                        }}
                                    >
                                        海纜作業：
                                    </Typography>
                                </Grid>
                                <Grid item sm={2} md={2} lg={2}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>選擇海纜作業</InputLabel>
                                        <Select
                                            value={workTitle}
                                            label="海纜作業"
                                            onChange={(e) => setWorkTitle(e.target.value)}
                                        >
                                            <MenuItem value={'All'}>All</MenuItem>
                                            <MenuItem value={'Upgrade'}>Upgrade</MenuItem>
                                            <MenuItem value={'Construction'}>Construction</MenuItem>
                                            <MenuItem value={'O&M'}>O&M</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </>
                        ) : (
                            <Grid item xs={3} sm={3} md={3} lg={3} />
                        )}
                        {value === 1 ? (
                            <>
                                <Grid item md={1} lg={1}>
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                            ml: { lg: '0.5rem', xl: '1.5rem' },
                                        }}
                                    >
                                        供應商：
                                    </Typography>
                                </Grid>
                                <Grid item sm={2} md={2} lg={2}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>選擇供應商</InputLabel>
                                        <Select
                                            value={supplierName}
                                            label="供應商"
                                            onChange={(e) => setSupplierName(e.target.value)}
                                        >
                                            <MenuItem value={'All'}>All</MenuItem>
                                            {supNmList.map((i) => (
                                                <MenuItem key={i} value={i}>
                                                    {i}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </>
                        ) : value === 2 ? (
                            <>
                                <Grid item md={1} lg={1}>
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                            ml: { lg: '0.5rem', xl: '1.5rem' },
                                        }}
                                    >
                                        會員名稱：
                                    </Typography>
                                </Grid>
                                <Grid item lg={2}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>選擇會員名稱</InputLabel>
                                        <Select
                                            value={partyName}
                                            label="會員"
                                            onChange={(e) => setPartyName(e.target.value)}
                                        >
                                            <MenuItem value={'All'}>All</MenuItem>
                                            {partiesList.map((i) => (
                                                <MenuItem key={i} value={i}>
                                                    {i}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </>
                        ) : (
                            <Grid item lg={3} />
                        )}
                        <Grid item lg={3} />
                        <Grid item lg={12} display="flex" justifyContent="end" alignItems="center">
                            <Button sx={{ mr: '0.5rem' }} variant="contained" onClick={handleQuery}>
                                查詢
                            </Button>
                            <Button variant="contained" onClick={initQuery}>
                                清除
                            </Button>
                        </Grid>
                    </Grid>
                </MainCard>
            </Grid>
            <Grid item xs={12}>
                <MainCard title="資料列表" sx={{ width: '100%' }}>
                    <Box
                        sx={{ p: 0, borderBottom: 1, borderColor: 'divider', position: 'relative' }}
                    >
                        <Tabs value={value} onChange={handleChange}>
                            <Tab sx={{ p: 0 }} label="海纜代號" {...a11yProps(0)} />
                            <Tab sx={{ p: 0 }} label="供應商" {...a11yProps(1)} />
                            <Tab sx={{ p: 0 }} label="會員" {...a11yProps(2)} />
                            <Tab sx={{ p: 0 }} label="聯盟金融帳戶" {...a11yProps(3)} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <SubmarineCableDataList infoList={infoList} setInfoList={setInfoList} />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <SupplierDataList infoList={infoList} setInfoList={setInfoList} />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                        <PartyDataList infoList={infoList} setInfoList={setInfoList} />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={3}>
                        <CBPBankAccount infoList={infoList} setInfoList={setInfoList} />
                    </CustomTabPanel>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default Information;
