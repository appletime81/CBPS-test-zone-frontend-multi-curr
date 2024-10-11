import { useEffect, useState, useRef } from 'react';
import {
    Typography,
    Grid,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    TextField,
    Checkbox,
    Autocomplete,
    Table,
    Tabs,
    Tab
} from '@mui/material';

// day
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// autocomplete
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

// project import
import MainCard from 'components/MainCard';
import CreditBalanceDeduct from './creditNoteDeduct';
import CreditBalanceRefund from './creditNoteRefund';
import { BootstrapDialogTitle, TabPanel } from 'components/commonFunction';

// table
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const CreditBalanceView = ({ cbView, handleViewClose, listInfo }) => {
    const [cblistInfo, setCbListInfo] = useState(listInfo);
    // const [editItem, setEditItem] = useState(NaN);
    const [isEdit, setIsEdit] = useState(false);
    const [value, setValue] = useState(0);

    // const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    // const checkedIcon = <CheckBoxIcon fontSize="small" />;

    const itemDetailInitial = () => {
        setPartyName([]);
        setLBRatio('');
        setIsEdit(false);
    };

    // //編輯
    // const editlistInfoItem = () => {
    //     let tmpArray = listInfo[editItem];

    //     if (tmpArray) {
    //         setPartyName([tmpArray?.PartyName]);
    //         setLBRatio(tmpArray?.LbRatio);
    //     }
    //     setIsEdit(true);
    // };

    //新增
    // const addList = () => {
    //     let tmpArray = listInfo.map((i) => i);
    //     console.log('=>>', partyName);
    //     let partyArray = partyName;
    //     partyArray.forEach((e) => {
    //         tmpArray.push({
    //             BillMilestone: billMilestone,
    //             PartyName: e,
    //             LBRatio: lBRatio
    //         });
    //     });
    //     setListInfo([...tmpArray]);
    //     itemDetailInitial();
    // };

    // //刪除
    // const deletelistInfoItem = (deleteItem) => {
    //     let tmpArray = listInfo.map((i) => i);
    //     tmpArray.splice(deleteItem, 1);
    //     setListInfo([...tmpArray]);
    // };

    // useEffect(() => {
    //     if (editItem >= 0) {
    //         editlistInfoItem();
    //         // setIsListEdit(true);
    //     }
    // }, [editItem]);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            // backgroundColor: theme.palette.common.gary,
            color: theme.palette.common.black,
            paddingTop: '0.2rem',
            paddingBottom: '0.2rem'
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
            paddingTop: '0.2rem',
            paddingBottom: '0.2rem'
        }
    }));

    const a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`
        };
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Dialog
            // onClose={() => {
            //     handleViewClose();
            //     itemDetailInitial();
            // }}
            maxWidth="sm"
            fullWidth
            open={cbView}
        >
            <BootstrapDialogTitle>檢視Credit Balance明細</BootstrapDialogTitle>
            <DialogContent dividers>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <MainCard title="Credit Balance" sx={{ width: '100%' }}>
                            <Grid container spacing={1}>
                                <Grid item xs={3} sm={3} md={3} lg={3} display="flex" justifyContent="center">
                                    <Typography
                                        variant="h5"
                                        sx={{ fontSize: { lg: '0.5rem', xl: '0.88rem' }, ml: { lg: '0.5rem', xl: '1.5rem' } }}
                                    >
                                        會員名稱：
                                    </Typography>
                                </Grid>
                                <Grid item xs={3} sm={3} md={3} lg={3}>
                                    <FormControl fullWidth size="small">
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            // disabled={listInfo.length > 0}
                                            // value={billMilestone}
                                            size="small"
                                            label="填寫CB種類"
                                            // onChange={(e) => setBillMilestone(e.target.value)}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={3} sm={3} md={3} lg={3} display="flex" justifyContent="center">
                                    <Typography
                                        variant="h5"
                                        sx={{ fontSize: { lg: '0.5rem', xl: '0.88rem' }, ml: { lg: '0.5rem', xl: '1.5rem' } }}
                                    >
                                        CB種類：
                                    </Typography>
                                </Grid>
                                <Grid item xs={3} sm={3} md={3} lg={3}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        // value={lBRatio}
                                        size="small"
                                        label="填寫會員名稱"
                                        // onChange={(e) => setLBRatio(e.target.value)}
                                    />
                                </Grid>
                                {/* <Grid item xs={3} sm={3} md={3} lg={3} xl={6} /> */}
                                <Grid item xs={3} sm={3} md={3} lg={3} display="flex" justifyContent="center">
                                    <Typography
                                        variant="h5"
                                        sx={{ fontSize: { lg: '0.5rem', xl: '0.88rem' }, ml: { lg: '0.5rem', xl: '1.5rem' } }}
                                    >
                                        剩餘金額：
                                    </Typography>
                                </Grid>
                                <Grid item xs={3} sm={3} md={3} lg={3}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        // value={lBRatio}
                                        size="small"
                                        label="填寫剩餘金額"
                                        // onChange={(e) => setLBRatio(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={3} sm={3} md={3} lg={3} display="flex" justifyContent="center">
                                    <Typography
                                        variant="h5"
                                        sx={{ fontSize: { lg: '0.5rem', xl: '0.88rem' }, ml: { lg: '0.5rem', xl: '1.5rem' } }}
                                    >
                                        摘要：
                                    </Typography>
                                </Grid>
                                <Grid item xs={3} sm={3} md={3} lg={3}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        // value={lBRatio}
                                        size="small"
                                        label="填寫摘要"
                                        // onChange={(e) => setLBRatio(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </MainCard>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <MainCard title="Credit Balance" sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} >
                                    <Tab label="CB抵扣紀錄" {...a11yProps(0)} />
                                    <Tab label="退費紀錄" {...a11yProps(1)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={value} index={0}>
                                <CreditBalanceDeduct cblistInfo={cblistInfo} />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <CreditBalanceRefund cblistInfo={cblistInfo} />
                            </TabPanel>
                        </MainCard>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    sx={{ mr: '0.05rem' }}
                    variant="contained"
                    onClick={() => {
                        handleViewClose();
                        itemDetailInitial();
                    }}
                >
                    關閉
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreditBalanceView;
