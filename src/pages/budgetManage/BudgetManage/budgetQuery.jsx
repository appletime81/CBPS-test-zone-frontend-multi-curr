import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// day
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { TextField } from '@mui/material/index';

//api
import { getLevels } from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const BudgetQuery = ({ setListInfo, submarineCableList, queryApi, workTitleList }) => {
    const dispatch = useDispatch();
    const [submarineCable, setSubmarineCable] = useState('All'); //海纜名稱
    const [workTitle, setWorkTitle] = useState('All'); //海纜作業
    const [budget_fee_item_name, setBudget_fee_item_name] = useState(''); //項目名稱
    const [bBudget_fee_item_seq, setBudget_fee_item_seq] = useState(''); //費用項目
    const [budget_year, setBudget_year] = useState(dayjs().startOf('year')); //發票日期

    const initQuery = () => {
        setSubmarineCable('All');
        setWorkTitle('All');
        setBudget_fee_item_name('');
        setBudget_fee_item_seq('');
        setBudget_year(dayjs().startOf('year'));
    };

    const fetchData = useCallback(
        async (url, method = 'GET', body = null) => {
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}`
            };
            const options = {
                method,
                headers,
                ...(body && { body: JSON.stringify(body) })
            };
            try {
                const response = await fetch(url, options);
                return await response.json();
            } catch (error) {
                dispatch(setMessageStateOpen({ messageStateOpen: { isOpen: true, severity: 'error', message: '網路異常，請檢查網路連線或與系統窗口聯絡' } }));
                throw error;
            }
        },
        [dispatch]
    );

    const budgetQuery = async () => {
        let tmpArray = {};
        if (submarineCable !== 'All') {
            tmpArray.SubmarineCable = submarineCable;
        }
        if (workTitle !== 'All') {
            tmpArray.WorkTitle = workTitle;
        }
        if (budget_fee_item_name !== '') {
            console.log('budget_fee_item_name=>>', budget_fee_item_name);
            tmpArray.budget_fee_item_name = budget_fee_item_name;
        }
        if (bBudget_fee_item_seq !== '') {
            console.log('bBudget_fee_item_seq=>>', bBudget_fee_item_seq);
            tmpArray.bBudget_fee_item_seq = bBudget_fee_item_seq;
        }
        tmpArray.budget_year = dayjs(budget_year).format('YYYY').toString();
        queryApi.current = tmpArray;
        try {
            const budgetListData = await fetchData(getLevels, 'POST', tmpArray);
            console.log('budgetListData=>>', budgetListData);
            setListInfo(budgetListData || []);
        } catch (error) {
            console.error('Error fetching supplier list:', error);
        }
    };

    console.log('budget_year=>>', dayjs(budget_year).format('YYYY').toString());

    return (
        <MainCard title="預算費用條件查詢" sx={{ width: '100%' }}>
            <Grid container display="flex" justifyContent="center" alignItems="center" spacing={2}>
                {/* row1 */}
                <Grid item xs={2} sm={2} md={1} lg={1} display="flex">
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' }
                        }}
                    >
                        海纜名稱：
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇海纜名稱</InputLabel>
                        <Select size="small" value={submarineCable} label="填寫海纜名稱" onChange={(e) => setSubmarineCable(e.target.value)}>
                            <MenuItem value={'All'}>All</MenuItem>
                            {submarineCableList.map((i) => (
                                <MenuItem key={i} value={i}>
                                    {i}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2} sm={2} md={1} lg={1} display="flex">
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' }
                        }}
                    >
                        海纜作業：
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇海纜作業</InputLabel>
                        <Select size="small" value={workTitle} label="填寫海纜作業" onChange={(e) => setWorkTitle(e.target.value)}>
                            <MenuItem value={'All'}>All</MenuItem>
                            {workTitleList.map((i) => (
                                <MenuItem key={i.Title} value={i.Title}>
                                    {i.Title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2} sm={2} md={1} lg={1}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0rem', xl: '1.5rem' }
                        }}
                    >
                        年份：
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2}>
                    <FormControl>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                // inputFormat="YYYY/MM/DD"
                                views={['year']} // 只顯示年份選擇
                                value={budget_year}
                                onChange={(e) => {
                                    setBudget_year(e);
                                }}
                                renderInput={(params) => <TextField size="small" {...params} />}
                            />
                        </LocalizationProvider>
                    </FormControl>
                </Grid>
                <Grid item xs={6} sm={6} md={3} lg={3} />
                <Grid item xs={2} sm={2} md={1} lg={1}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' }
                        }}
                    >
                        項目序號：
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={bBudget_fee_item_seq}
                            size="small"
                            label="填寫項目序號"
                            onChange={(e) => setBudget_fee_item_seq(e.target.value)}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={2} sm={2} md={1} lg={1}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' }
                        }}
                    >
                        項目名稱：
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={budget_fee_item_name}
                            size="small"
                            label="填寫發票號碼"
                            onChange={(e) => setBudget_fee_item_name(e.target.value)}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={6} lg={6} display="flex" justifyContent="end" alignItems="center">
                    <Button sx={{ mr: '0.5rem' }} variant="contained" onClick={budgetQuery}>
                        查詢
                    </Button>
                    <Button variant="contained" onClick={initQuery}>
                        清除
                    </Button>
                </Grid>
            </Grid>
        </MainCard>
    );
};

BudgetQuery.propTypes = {
    setListInfo: PropTypes.func,
    partyList: PropTypes.array,
    submarineCableList: PropTypes.array,
    workTitleList: PropTypes.array,
    queryApi: PropTypes.object
};

export default BudgetQuery;
