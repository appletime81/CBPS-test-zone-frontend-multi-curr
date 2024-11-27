import { useState, useRef, useEffect } from 'react';
import { Grid, Button } from '@mui/material';
// import { styled } from '@mui/material/styles';

// project import
import MainCard from 'components/MainCard';
import CreditBalanceQuery from './creditBalanceQuery';
import CreditBalanceDataList from './creditBalanceDataList';
import CreditBalanceAdd from './creditBalanceAdd';

// api
import {
    dropdownmenuParties,
    submarineCableInfoList,
    getWorkTitle,
    getCurrencyData,
} from 'components/apis';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const CreditBalance = () => {
    const dispatch = useDispatch();
    const queryApi = useRef('/all');
    const [listInfo, setListInfo] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [submarineCableList, setSubmarineCableList] = useState([]); //海纜名稱下拉選單
    const [partiesList, setPartiesList] = useState([]); //會員下拉選單
    const [currencyListInfo, setCurrencyListInfo] = useState([]); //幣別下拉選單
    const [workTitleList, setWorkTitleList] = useState([]); //海纜作業下拉選單

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    useEffect(() => {
        //海纜名稱
        fetch(submarineCableInfoList, {
            method: 'GET',
        })
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
        fetch(getCurrencyData, {
            method: 'GET',
            Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setCurrencyListInfo(data);
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
                <Button sx={{ mr: '0.25rem' }} variant="contained" onClick={handleDialogOpen}>
                    + 新增Credit Balance
                </Button>
                <CreditBalanceAdd
                    handleDialogClose={handleDialogClose}
                    isDialogOpen={isDialogOpen}
                    partiesList={partiesList}
                    submarineCableList={submarineCableList}
                    currencyListInfo={currencyListInfo}
                    workTitleList={workTitleList}
                    queryApi={queryApi.current}
                    setListInfo={setListInfo}
                />
            </Grid>
            <Grid item xs={12}>
                <CreditBalanceQuery
                    setListInfo={setListInfo}
                    partiesList={partiesList}
                    submarineCableList={submarineCableList}
                    workTitleList={workTitleList}
                    queryApi={queryApi}
                />
            </Grid>
            <Grid item xs={12}>
                <MainCard title="Credit Balance資料列表">
                    <CreditBalanceDataList listInfo={listInfo} setIsDialogOpen={setIsDialogOpen} />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default CreditBalance;
