import { useEffect, useState, useRef, useCallback } from 'react';
import { Grid, Button } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import LiabilityQuery from './liabilityQuery';
import LiabilityDataList from './liabilityDataList';
import LiabilityAdd from './liabilityAdd';

// api
import { dropdownmenuParties, queryLiability, compareLiability, addLiabilityapi, updateLiability, dropdownmenuSubmarineCable, getWorkTitle } from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const LiabilityManage = () => {
    const dispatch = useDispatch();
    const [listInfo, setListInfo] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false); //新增編輯Liability
    const [dialogAction, setDialogAction] = useState('');
    const [workTitleList, setWorkTitleList] = useState([]); //海纜作業下拉選單
    const [billMilestone, setBillMilestone] = useState(''); //計帳段號
    const [workTitle, setWorkTitle] = useState(''); //海纜作業
    const [submarineCable, setSubmarineCable] = useState(''); //海纜名稱
    const [partyName, setPartyName] = useState([]); //會員名稱
    const [lBRatio, setLBRatio] = useState(0); //攤分比例
    const [editItem, setEditItem] = useState(NaN); //編輯項目
    const [note, setNote] = useState(''); //備註
    const [modifyNote, setModifyNote] = useState(''); //異動原因

    const [filterList, setFilterList] = useState(listInfo);

    const [partyList, setPartyList] = useState([]); //會員名稱下拉選單
    const [submarineCableList, setSubmarineCableList] = useState([]); //海纜名稱下拉選單
    const lBRawID = useRef(0); //LBRawID
    const queryApi = useRef(queryLiability + '/all');

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
        setDialogAction('add');
    };

    const handleDialogClose = () => setIsDialogOpen(false);

    const itemDetailInitial = () => {
        setBillMilestone('');
        setPartyName([]);
        setLBRatio('');
        setModifyNote('');
    };

    const apiQuery = async () => {
        try {
            const res = await fetch(queryApi.current);
            const data = await res.json();
            setListInfo(data);
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
    };

    //新增
    const addLiability = async (list, setAdd) => {
        const totalRatio = list.reduce((acc, e) => acc + Number(e.LBRatio), 0).toFixed(10);
        // let tmpNumber = 0;
        // list.forEach((e) => {
        //     tmpNumber = Number(e.LBRatio) + Number(tmpNumber);
        // });
        if (totalRatio !== '100.0000000000') {
            return dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '攤分比例加總須等於100'
                    }
                })
            );
        }
        try {
            const res = await fetch(compareLiability, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(list)
            });
            const data = await res.json();
            if (data.compareResult.length > 0) {
                throw new Error('已增加此會員');
            }
            const addRes = await fetch(addLiabilityapi, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(list)
            });
            const addData = await addRes.json();
            if (addData.message === 'success add Liability') {
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
                throw new Error(addData.alert_msg);
            }
        } catch (error) {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: error.message
                    }
                })
            );
        }
    };

    //編輯
    const editlistInfoItem = () => {
        let tmpArray = listInfo[editItem];
        console.log('', editItem, tmpArray);
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
    const saveEdit = () => {
        let tmpArray = {
            LBRawID: listInfo[editItem].LBRawID,
            SubmarineCable: listInfo[editItem].SubmarineCable,
            BillMilestone: listInfo[editItem].BillMilestone,
            PartyName: listInfo[editItem].PartyName,
            WorkTitle: listInfo[editItem].WorkTitle,
            LBRatio: Number(lBRatio).toFixed(10),
            Note: note,
            ModifyNote: modifyNote ? modifyNote : ''
        };
        fetch(updateLiability, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? ''
            },
            body: JSON.stringify(tmpArray)
        })
            .then((res) => res.json())
            .then(() => {
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'success',
                            message: '儲存成功'
                        }
                    })
                );
                apiQuery();
                setEditItem(NaN);
                handleDialogClose();
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
    };

    const searchFunction = useCallback((searchedVal) => {
        const filteredRows = listInfo.filter((row) => row.PartyName.toLowerCase().includes(searchedVal.toLowerCase()));
        setFilterList(filteredRows);
    }, []);

    useEffect(() => {
        itemDetailInitial();
        if (editItem >= 0) {
            editlistInfoItem();
            setIsDialogOpen(true);
        }
    }, [editItem]);

    const fetchData = useCallback(async () => {
        try {
            const [parties, workTitles, submarineCables] = await Promise.all([
                fetch(dropdownmenuParties).then((res) => res.json()),
                fetch(getWorkTitle, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({})
                }).then((res) => res.json()),
                fetch(dropdownmenuSubmarineCable).then((res) => res.json())
            ]);
            setPartyList(Array.isArray(parties) ? parties : []);
            setWorkTitleList(Array.isArray(workTitles) ? workTitles : []);
            setSubmarineCableList(Array.isArray(submarineCables) ? submarineCables : []);
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
                    + 新增Liability
                </Button>
                <LiabilityAdd
                    handleDialogClose={handleDialogClose}
                    addLiability={addLiability}
                    saveEdit={saveEdit}
                    partyName={partyName}
                    setPartyName={setPartyName}
                    isDialogOpen={isDialogOpen}
                    billMilestone={billMilestone}
                    setBillMilestone={setBillMilestone}
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
                    apiQuery={apiQuery}
                />
            </Grid>
            <Grid item xs={12}>
                <LiabilityQuery setListInfo={setListInfo} partyList={partyList} submarineCableList={submarineCableList} queryApi={queryApi} workTitleList={workTitleList} />
            </Grid>
            <Grid item xs={12}>
                <MainCard title="Liability資料列表" search searchFunction={searchFunction} searchTitle={'會員搜尋'}>
                    <LiabilityDataList
                        listInfo={filterList.length > 0 ? filterList : listInfo}
                        setDialogAction={setDialogAction}
                        setIsDialogOpen={setIsDialogOpen}
                        setEditItem={setEditItem}
                        apiQuery={apiQuery}
                    />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default LiabilityManage;
