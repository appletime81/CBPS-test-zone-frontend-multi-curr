import { useEffect, useState } from 'react';
import { Grid, Button, IconButton, Box, Tabs, Tab } from '@mui/material';
// import { styled } from '@mui/material/styles';

// project import
import MainCard from 'components/MainCard';
import CreditNoteQuery from './creditNoteQuery';
import CreditNoteDataList from './creditNoteDataList';
import CreditNoteAdd from './creditNoteAdd';
import { TabPanel } from 'components/commonFunction';

// day
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';

const CreditNote = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`
        };
    };
    const fakeData = [
        {
            CBType: 'MWG1',
            PartyName: 'CHT',
            InvoiceNo: '234567',
            BillingNo: '12345',
            SubmarineCable: 'SJC',
            WorkTitle: 'Upgrade',
            CurrAmount: 1234,
            CreateDate: '2023-01-01 12:12:!2',
            Note: '測試'
        },
        {
            CBType: 'MWG2',
            PartyName: 'CHT',
            InvoiceNo: '234567',
            BillingNo: '12345',
            SubmarineCable: 'SJC',
            WorkTitle: 'Upgrade',
            CurrAmount: 1234,
            CreateDate: '2023-01-01 12:12:!2',
            Note: '測試'
        },
        {
            CBType: 'MWG3',
            PartyName: 'CHT',
            InvoiceNo: '234567',
            BillingNo: '12345',
            SubmarineCable: 'SJC',
            WorkTitle: 'Upgrade',
            CurrAmount: 1234,
            CreateDate: '2023-01-01 12:12:!2',
            Note: '測試'
        },
        {
            CBType: 'MWG4',
            PartyName: 'CHT',
            InvoiceNo: '234567',
            BillingNo: '12345',
            SubmarineCable: 'SJC',
            WorkTitle: 'Upgrade',
            CurrAmount: 1234,
            CreateDate: '2023-01-01 12:12:!2',
            Note: '測試'
        }
    ];

    const [listInfo, setListInfo] = useState(fakeData);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState('');

    const [billMilestone, setBillMilestone] = useState(''); //計帳段號
    const [partyName, setPartyName] = useState([]); //會員名稱
    const [lBRatio, setLBRatio] = useState(''); //攤分比例
    const [editItem, setEditItem] = useState(NaN);
    const [modifyNote, setModifyNote] = useState('');

    const creditNoteQuery = () => {
        console.log('CreditNoteQueryFunction');
    };

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
        setDialogAction('add');
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const itemDetailInitial = () => {
        setBillMilestone('');
        setPartyName([]);
        setLBRatio('');
        setModifyNote('');
    };

    //新增
    const addLiability = (list) => {
        console.log('list=>>', list);
        if (list.length > 0) {
            let tmpArray = listInfo.map((i) => i);
            list.forEach((i) => {
                tmpArray.push({
                    BillMilestone: i.BillMilestone,
                    PartyName: i.PartyName,
                    LBRatio: i.LbRatio,
                    createTime: new Date(),
                    modifyNote: modifyNote.trim() === '' ? '' : modifyNote
                });
            });

            setListInfo([...tmpArray]);
            handleDialogClose();
            itemDetailInitial();
        }
    };

    //刪除
    const deletelistInfoItem = (deleteItem) => {
        let tmpArray = listInfo.map((i) => i);
        tmpArray.splice(deleteItem, 1);
        setListInfo([...tmpArray]);
    };

    //編輯
    const editlistInfoItem = () => {
        let tmpArray = listInfo[editItem];
        if (tmpArray) {
            setBillMilestone(tmpArray?.billMilestone);
            partyName.current = tmpArray?.partyName;
            setLBRatio(tmpArray?.lBRatio);
            setModifyNote(tmpArray?.modifyNote);
        }
    };

    //儲存編輯
    const saveEdit = () => {
        setEditItem(NaN);
        deletelistInfoItem(editItem);
        addLiability();
        // setIsListEdit(false);
        itemDetailInitial();
    };

    useEffect(() => {
        itemDetailInitial();
        if (editItem >= 0) {
            editlistInfoItem();
            setIsDialogOpen(true);
        }
    }, [editItem]);

    return (
        <Grid container spacing={1}>
            {/* <Grid item xs={12} display="flex" justifyContent="right">
                <Button sx={{ mr: '0.25rem' }} variant="contained" onClick={handleDialogOpen}>
                    + 新增Credit Balance
                </Button>
                <CreditNoteAdd
                    handleDialogClose={handleDialogClose}
                    addLiability={addLiability}
                    saveEdit={saveEdit}
                    partyName={partyName}
                    setPartyName={setPartyName}
                    isDialogOpen={isDialogOpen}
                    billMilestone={billMilestone}
                    setBillMilestone={setBillMilestone}
                    dialogAction={dialogAction}
                    lBRatio={lBRatio}
                    setLBRatio={setLBRatio}
                />
            </Grid> */}
            <Grid item xs={12}>
                <CreditNoteQuery creditNoteQuery={creditNoteQuery} />
            </Grid>
            <Grid item xs={12}>
                <MainCard title="Credit Note資料列表">
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'relative' }}>
                        <Tabs value={value} onChange={handleChange} >
                            <Tab label="CB轉CN" {...a11yProps(0)} />
                            <Tab label="CN列表" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <CreditNoteDataList
                            listInfo={listInfo}
                            setDialogAction={setDialogAction}
                            setIsDialogOpen={setIsDialogOpen}
                            setEditItem={setEditItem}
                            deletelistInfoItem={deletelistInfoItem}
                        />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <CreditNoteDataList
                            listInfo={listInfo}
                            setDialogAction={setDialogAction}
                            setIsDialogOpen={setIsDialogOpen}
                            setEditItem={setEditItem}
                            deletelistInfoItem={deletelistInfoItem}
                        />
                    </TabPanel>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default CreditNote;
