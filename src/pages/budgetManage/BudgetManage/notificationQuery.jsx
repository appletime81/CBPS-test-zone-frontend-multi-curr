import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

import { TextField } from '@mui/material/index';

//api
import { getSysInvNotifyRule } from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

// ==============================|| SAMPLE PAGE ||============================== //

const NotificationQuery = ({
    setListInfo,
    partiesList,
    submarineCableList,
    value,
    workTitleList,
}) => {
    const dispatch = useDispatch();
    const [submarineCable, setSubmarineCable] = useState('All'); //海纜名稱
    const [workTitle, setWorkTitle] = useState('All'); //海纜作業
    const [partyNameQuery, setPartyNameQuery] = useState('All'); //會員名稱
    const [ruleName, setRuleName] = useState(''); //英文名稱
    const [ruleCName, setRuleCName] = useState(''); //中文名稱

    const initQuery = () => {
        setPartyNameQuery('All');
        setSubmarineCable('All');
        setWorkTitle('All');
        setRuleName('');
        setRuleCName('');
    };

    const notificationQuery = () => {
        let tmpObject = {};
        if (submarineCable && submarineCable !== 'All') {
            tmpObject.SubmarineCable = submarineCable;
        }
        if (workTitle && workTitle !== 'All') {
            tmpObject.WorkTitle = workTitle;
        }
        if (partyNameQuery && partyNameQuery !== 'All') {
            tmpObject.PartyName = partyNameQuery;
        }

        if (ruleName && ruleName !== '') {
            tmpObject.RuleName = ruleName;
        }
        if (ruleCName && ruleCName !== '') {
            tmpObject.RuleCName = ruleCName;
        }
        console.log('tmpArray=>>', tmpObject);
        fetch(getSysInvNotifyRule, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
            },
            body: JSON.stringify(tmpObject),
        })
            .then((res) => res.json())
            .then((data) => {
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
    };

    useEffect(() => {
        initQuery();
        setListInfo([]);
    }, [value]);

    return (
        <MainCard title="條件查詢" sx={{ width: '100%' }}>
            <Grid container display="flex" justifyContent="center" alignItems="center" spacing={2}>
                {/* row1 */}
                <Grid item md={1} lg={1} display="flex">
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' },
                        }}
                    >
                        海纜名稱：
                    </Typography>
                </Grid>
                <Grid item md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel size="small" id="billMilestone">
                            選擇海纜名稱
                        </InputLabel>
                        <Select
                            size="small"
                            value={submarineCable}
                            label="填寫海纜名稱"
                            onChange={(e) => setSubmarineCable(e.target.value)}
                        >
                            <MenuItem value={'All'}>All</MenuItem>
                            {submarineCableList.map((i) => (
                                <MenuItem key={i} value={i}>
                                    {i}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={1} lg={1} display="flex">
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' },
                        }}
                    >
                        海纜作業：
                    </Typography>
                </Grid>
                <Grid item md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel size="small" id="billMilestone">
                            選擇海纜作業
                        </InputLabel>
                        <Select
                            size="small"
                            value={workTitle}
                            label="填寫海纜作業"
                            onChange={(e) => setWorkTitle(e.target.value)}
                        >
                            <MenuItem value={'All'}>All</MenuItem>
                            {workTitleList.map((i) => (
                                <MenuItem key={i.Title} value={i.Title}>
                                    {i.Title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                {value === 0 ? (
                    <>
                        <Grid item md={1} lg={1} xl={1}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                    ml: { lg: '0.5rem', xl: '1.5rem' },
                                }}
                            >
                                會員名稱：
                            </Typography>
                        </Grid>
                        <Grid item md={2} lg={2} xl={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>選擇會員</InputLabel>
                                <Select
                                    value={partyNameQuery}
                                    label="會員名稱"
                                    onChange={(e) => setPartyNameQuery(e.target.value)}
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
                ) : null}
                <Grid item md={1} lg={1}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' },
                        }}
                    >
                        規則英文名稱：
                    </Typography>
                </Grid>
                <Grid item md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={ruleName}
                            size="small"
                            label="填寫規則名稱"
                            onChange={(e) => setRuleName(e.target.value)}
                        />
                    </FormControl>
                </Grid>
                {value === 1 ? (
                    <>
                        <Grid item md={1} lg={1} xl={1}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                    ml: { lg: '0.5rem', xl: '1.5rem' },
                                }}
                            >
                                規則中文名稱：
                            </Typography>
                        </Grid>
                        <Grid item md={2} lg={2}>
                            <FormControl fullWidth size="small">
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={ruleCName}
                                    size="small"
                                    label="填寫規則名稱"
                                    onChange={(e) => setRuleCName(e.target.value)}
                                />
                            </FormControl>
                        </Grid>
                    </>
                ) : (
                    <Grid item md={3} />
                )}
                {/* row2 */}
                <Grid item md={12} lg={12} display="flex" justifyContent="end" alignItems="center">
                    <Button sx={{ mr: '0.5rem' }} variant="contained" onClick={notificationQuery}>
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

NotificationQuery.propTypes = {
    setListInfo: PropTypes.func,
    // bmStoneList: PropTypes.array,
    partiesList: PropTypes.array,
    submarineCableList: PropTypes.array,
    workTitleList: PropTypes.array,
    queryApi: PropTypes.string,
};

export default NotificationQuery;
