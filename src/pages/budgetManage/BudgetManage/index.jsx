import { useEffect, useState, useRef, useCallback } from 'react';
import { Grid, Button } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import BudgetQuery from './budgetQuery';
import BudgetDataList from './budgetDataList';
import BudgetAdd from './budgetAdd';

// api
import { dropdownmenuParties, compareLiability, addLiabilityapi, dropdownmenuSubmarineCable, getWorkTitle, getCurrencyData, getLevels } from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const BudgetManage = () => {
    const dispatch = useDispatch();
    const [listInfo, setListInfo] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false); //新增編輯Liability
    const [submarineCableList, setSubmarineCableList] = useState([]); //海纜名稱下拉選單
    const [workTitleList, setWorkTitleList] = useState([]); //海纜作業下拉選單
    const [currencyListInfo, setCurrencyListInfo] = useState([]); //幣別下拉選單
    const [dialogAction, setDialogAction] = useState('');
    const [dataDetail, setDataDetail] = useState([]); //編輯項目

    const [partyList, setPartyList] = useState([]); //會員名稱下拉選單
    const queryApi = useRef({});

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
        setDialogAction('Add');
    };

    const handleDialogClose = () => setIsDialogOpen(false);

    const fetchQueryData = useCallback(
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
        try {
            const budgetListData = await fetchQueryData(getLevels, 'POST', queryApi.current);
            console.log('budgetListData=>>', budgetListData);
            setListInfo(budgetListData || []);
        } catch (error) {
            console.error('Error fetching supplier list:', error);
        }
    };

    //新增
    const addBudget = (list, setAdd) => {
        let tmpNumber = 0;
        list.forEach((e) => {
            tmpNumber = Number(e.LBRatio) + Number(tmpNumber);
        });
        console.log('tmpNumber=>>', tmpNumber.toFixed(10), tmpNumber.toFixed(10) !== '100.0000000000');
        if (tmpNumber.toFixed(10) !== '100.0000000000') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '攤分比例加總須等於100'
                    }
                })
            );
        }
        if (list.length > 0 && tmpNumber.toFixed(10) === '100.0000000000') {
            fetch(compareLiability, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? ''
                },
                body: JSON.stringify(list)
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log('compareLiability成功', data, data.compareResult);
                    if (data.compareResult.length > 0) {
                        dispatch(
                            setMessageStateOpen({
                                messageStateOpen: {
                                    isOpen: true,
                                    severity: 'error',
                                    message: '已增加此會員'
                                }
                            })
                        );
                    } else {
                        fetch(addLiabilityapi, {
                            method: 'POST',
                            headers: {
                                'Content-type': 'application/json',
                                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? ''
                            },
                            body: JSON.stringify(list)
                        })
                            .then((res) => res.json())
                            .then((data) => {
                                if (data.message === 'No same data') {
                                    dispatch(
                                        setMessageStateOpen({
                                            messageStateOpen: {
                                                isOpen: true,
                                                severity: 'success',
                                                message: '新增成功'
                                            }
                                        })
                                    );
                                    setAdd([]);
                                    handleDialogClose();
                                } else {
                                    dispatch(
                                        setMessageStateOpen({
                                            messageStateOpen: {
                                                isOpen: true,
                                                severity: 'error',
                                                message: data.alert_msg
                                            }
                                        })
                                    );
                                }
                            })
                            .catch(() => {
                                dispatch(
                                    setMessageStateOpen({
                                        messageStateOpen: {
                                            isOpen: true,
                                            severity: 'error',
                                            message: '網路異常，請檢查網路連線或與系統窗口聯絡'
                                        }
                                    })
                                );
                            });
                    }
                })
                .catch(() => {
                    dispatch(
                        setMessageStateOpen({
                            messageStateOpen: {
                                isOpen: true,
                                severity: 'error',
                                message: '網路異常，請檢查網路連線或與系統窗口聯絡'
                            }
                        })
                    );
                });
        }
    };

    const fetchData = useCallback(async () => {
        try {
            const [parties, workTitles, submarineCables, currencies] = await Promise.all([
                fetch(dropdownmenuParties).then((res) => res.json()),
                fetch(getWorkTitle, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({})
                }).then((res) => res.json()),
                fetch(dropdownmenuSubmarineCable).then((res) => res.json()),
                fetch(getCurrencyData).then((res) => res.json())
            ]);
            setPartyList(Array.isArray(parties) ? parties : []);
            setWorkTitleList(Array.isArray(workTitles) ? workTitles : []);
            setSubmarineCableList(Array.isArray(submarineCables) ? submarineCables : []);
            setCurrencyListInfo(Array.isArray(currencies) ? currencies : []);
        } catch (error) {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '網路異常，請檢查網路連線或與系統窗口聯絡'
                    }
                })
            );
        }
    }, [dispatch]);

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} display="flex" justifyContent="right">
                <Button sx={{ mr: '0.25rem' }} variant="contained" onClick={handleDialogOpen}>
                    + 新增費用項目
                </Button>
                <BudgetAdd
                    isDialogOpen={isDialogOpen}
                    handleDialogClose={handleDialogClose}
                    addBudget={addBudget}
                    submarineCableList={submarineCableList}
                    workTitleList={workTitleList}
                    currencyListInfo={currencyListInfo}
                    dialogAction={dialogAction}
                    dataDetail={dataDetail}
                    budgetQuery={budgetQuery}
                />
            </Grid>
            <Grid item xs={12}>
                <BudgetQuery setListInfo={setListInfo} partyList={partyList} submarineCableList={submarineCableList} queryApi={queryApi} workTitleList={workTitleList} />
            </Grid>
            <Grid item xs={12}>
                <MainCard title="預算費用項目查詢結果">
                    <BudgetDataList
                        listInfo={listInfo}
                        setIsDialogOpen={setIsDialogOpen}
                        setDataDetail={setDataDetail}
                        budgetQuery={budgetQuery}
                        setDialogAction={setDialogAction}
                    />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default BudgetManage;
