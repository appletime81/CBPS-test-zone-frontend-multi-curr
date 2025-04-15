import { useEffect, useState, useRef } from 'react';
import { Grid, Button } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import CurrencyQuery from './currencyQuery';
import CurrencyDataList from './currencyDataList';
import CurrencyAdd from './currencyAdd';
import CurrencyManage from './currencyManage';

// api
import { getWorkTitle, dropdownmenuSubmarineCable, dropdownmenuParties, getCurrencyExchangeData, getCurrencyData } from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const LiabilityManage = () => {
    const dispatch = useDispatch();
    const [listInfo, setListInfo] = useState([]);
    const [dialogAction, setDialogAction] = useState('');
    const [currencyListInfo, setCurrencyListInfo] = useState([]);

    const [editItem, setEditItem] = useState({}); //編輯項目

    const [partyList, setPartyList] = useState([]); //會員名稱下拉選單
    const [submarineCableList, setSubmarineCableList] = useState([]); //海纜名稱下拉選單
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
    const [isAddCurrencyOpen, setIsAddCurrencyOpen] = useState(false); //新增編輯Currency
    const lBRawID = useRef(0); //LBRawID
    const [workTitleList, setWorkTitleList] = useState([]); //海纜作業下拉選單

    const queryApi = useRef({});

    const getCurrencyDataFun = () => {
        fetch(getCurrencyData, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('data=>>', data);
                if (Array.isArray(data)) {
                    setCurrencyListInfo(data);
                }
            })
            .catch((e) => console.log('e1=>', e));
    };

    const handleCurrencyManageOpen = () => {
        setIsCurrencyOpen(true);
    };

    const handleCurrencyManageClose = () => {
        setIsCurrencyOpen(false);
    };

    const handleAddCurrencyOpen = () => {
        setIsAddCurrencyOpen(true);
        setDialogAction('Add');
    };

    const handleAddCurrencyClose = () => {
        setIsAddCurrencyOpen(false);
    };

    //編輯
    const editlistInfoItem = () => {
        let tmpArray = listInfo[editItem];
        if (tmpArray) {
            lBRawID.current = tmpArray?.LBRawID;
        }
    };

    //儲存編輯
    const currencyQuery = () => {
        fetch(getCurrencyExchangeData, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            },
            body: JSON.stringify(queryApi.current)
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setListInfo(data);
                } else {
                    setListInfo([]);
                }
            })
            .catch((e) => console.log('e1=>', e));
    };

    useEffect(() => {
        if (editItem >= 0) {
            editlistInfoItem();
            setIsAddCurrencyOpen(true);
        }
    }, [editItem]);

    useEffect(() => {
        fetch(dropdownmenuSubmarineCable, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setSubmarineCableList(data);
            })
            .catch((e) => console.log('e1=>', e));
        fetch(dropdownmenuParties, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setPartyList(data);
            })
            .catch((e) => console.log('e1=>', e));
        // 海纜作業
        fetch(getWorkTitle, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            },
            body: JSON.stringify({})
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
                            message: '網路異常，請檢查網路連線或與系統窗口聯絡'
                        }
                    })
                );
            });
        getCurrencyDataFun();
    }, []);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} display="flex" justifyContent="right">
                <Button sx={{ mr: '0.25rem' }} variant="contained" onClick={handleCurrencyManageOpen}>
                    $ 貨幣管理
                </Button>
                <Button sx={{ mr: '0.25rem' }} variant="contained" onClick={handleAddCurrencyOpen}>
                    + 新增貨幣與匯率資料
                </Button>
                <CurrencyManage
                    handleCurrencyManageClose={handleCurrencyManageClose}
                    isCurrencyOpen={isCurrencyOpen}
                    currencyListInfo={currencyListInfo}
                    setCurrencyListInfo={setCurrencyListInfo}
                    getCurrencyDataFun={getCurrencyDataFun}
                />
                <CurrencyAdd
                    handleAddCurrencyClose={handleAddCurrencyClose}
                    isAddCurrencyOpen={isAddCurrencyOpen}
                    currencyListInfo={currencyListInfo}
                    submarineCableList={submarineCableList}
                    editItem={editItem}
                    currencyQuery={currencyQuery}
                    dialogAction={dialogAction}
                    workTitleList={workTitleList}
                />
            </Grid>
            <Grid item xs={12}>
                <CurrencyQuery
                    listInfo={listInfo}
                    setListInfo={setListInfo}
                    currencyListInfo={currencyListInfo}
                    partyList={partyList}
                    submarineCableList={submarineCableList}
                    queryApi={queryApi}
                />
            </Grid>
            <Grid item xs={12}>
                <MainCard title="貨幣與匯率資料列表">
                    <CurrencyDataList
                        listInfo={listInfo}
                        setDialogAction={setDialogAction}
                        setIsAddCurrencyOpen={setIsAddCurrencyOpen}
                        setEditItem={setEditItem}
                        setListInfo={setListInfo}
                        currencyQuery={currencyQuery}
                    />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default LiabilityManage;
