import { useEffect, useState, useRef } from 'react';
import { Grid, Button } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import CurrencyQuery from './currencyQuery';
import CurrencyDataList from './currencyDataList';
import CurrencyAdd from './currencyAdd';
import CurrencyManage from './currencyManage';

// api
import {
    billMilestoneLiabilityList,
    dropdownmenuSubmarineCable,
    partiesLiabilityList,
    queryLiability,
    compareLiability,
    addLiabilityapi,
    getCurrencyExchangeData,
    getCurrencyData,
} from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const LiabilityManage = () => {
    const dispatch = useDispatch();
    const [listInfo, setListInfo] = useState([]);
    const [dialogAction, setDialogAction] = useState('');
    const [currencyListInfo, setCurrencyListInfo] = useState([]);

    const [billMilestone, setBillMilestone] = useState(''); //計帳段號
    const [workTitle, setWorkTitle] = useState(''); //海纜作業
    const [submarineCable, setSubmarineCable] = useState(''); //海纜名稱
    const [partyName, setPartyName] = useState([]); //會員名稱
    const [lBRatio, setLBRatio] = useState(0); //攤分比例
    const [editItem, setEditItem] = useState({}); //編輯項目
    const [note, setNote] = useState(''); //備註
    const [modifyNote, setModifyNote] = useState(''); //異動原因

    const [partyList, setPartyList] = useState([]); //會員名稱下拉選單
    const [submarineCableList, setSubmarineCableList] = useState([]); //海纜名稱下拉選單
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
    const [isAddCurrencyOpen, setIsAddCurrencyOpen] = useState(false); //新增編輯Currency
    const lBRawID = useRef(0); //LBRawID

    const queryApi = useRef({});

    const getCurrencyDataFun = () => {
        fetch(getCurrencyData, {
            method: 'GET',
            Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
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

    const itemDetailInitial = () => {
        setBillMilestone('');
        setPartyName([]);
        setLBRatio('');
        setModifyNote('');
    };

    //編輯
    const editlistInfoItem = () => {
        let tmpArray = listInfo[editItem];
        if (tmpArray) {
            setBillMilestone(tmpArray?.BillMilestone);
            setPartyName([tmpArray?.PartyName]);
            setLBRatio(tmpArray?.LBRatio);
            setWorkTitle(tmpArray?.WorkTitle);
            setSubmarineCable(tmpArray?.SubmarineCable);
            setModifyNote(tmpArray?.ModifyNote);
            lBRawID.current = tmpArray?.LBRawID;
        }
    };

    //儲存編輯
    const currencyQuery = () => {
        console.log('currencyQuer=>>');
        fetch(getCurrencyExchangeData, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
            },
            body: JSON.stringify(queryApi.current),
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
        itemDetailInitial();
        if (editItem >= 0) {
            editlistInfoItem();
            setIsAddCurrencyOpen(true);
        }
    }, [editItem]);

    useEffect(() => {
        fetch(dropdownmenuSubmarineCable, { method: 'GET' })
            .then((res) => res.json())
            .then((data) => {
                setSubmarineCableList(data);
            })
            .catch((e) => console.log('e1=>', e));
        fetch(partiesLiabilityList, { method: 'GET' })
            .then((res) => res.json())
            .then((data) => {
                setPartyList(data);
            })
            .catch((e) => console.log('e1=>', e));
        getCurrencyDataFun();
    }, []);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} display="flex" justifyContent="right">
                <Button
                    sx={{ mr: '0.25rem' }}
                    variant="contained"
                    onClick={handleCurrencyManageOpen}
                >
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
                    setListInfo={setListInfo}
                    partyName={partyName}
                    setPartyName={setPartyName}
                    workTitle={workTitle}
                    setWorkTitle={setWorkTitle}
                    submarineCable={submarineCable}
                    setSubmarineCable={setSubmarineCable}
                    dialogAction={dialogAction}
                    lBRatio={lBRatio}
                    setLBRatio={setLBRatio}
                    modifyNote={modifyNote}
                    setModifyNote={setModifyNote}
                    note={note}
                    setNote={setNote}
                    setEditItem={setEditItem}
                    lBRawID={lBRawID}
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
