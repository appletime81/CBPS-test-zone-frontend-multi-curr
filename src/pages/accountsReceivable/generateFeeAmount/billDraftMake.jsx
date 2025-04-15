import { useEffect, useState, useRef } from 'react';
import { Typography, Grid, Button, FormControl, Box, TextField, Table, TableCell, Paper, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio } from '@mui/material';

// day
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// project import
import MainCard from 'components/MainCard';
import { BootstrapDialogTitle, handleNumber } from 'components/commonFunction';
import Decimal from 'decimal.js';

// table
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

// print
import './styles.css';

import { generateBillData, dropdownmenuUsers } from 'components/apis.jsx';
import Logo1 from 'assets/images/logo1.gif';
import Logo2 from 'assets/images/logo2.png';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        padding: '12px',
        fontFamily: 'Microsoft JhengHei,Arial',
        fontSize: '8px',
        background: '#fff',
        border: 'black 1.5px solid',
        textAlign: 'center'
    },
    [`&.${tableCellClasses.head}.theTopFirst`]: {
        paddingTop: '6px',
        paddingBottom: '6px',
        borderTop: 'black 3px solid',
        borderLeft: 'black 3px solid'
    },
    [`&.${tableCellClasses.head}.top`]: {
        paddingTop: '6px',
        paddingBottom: '6px',
        borderLeft: 'initial !important',
        borderTop: 'black 3px solid'
    },
    [`&.${tableCellClasses.head}.theTopFinal`]: {
        paddingTop: '6px',
        paddingBottom: '6px',
        borderLeft: 'initial !important',
        borderTop: 'black 3px solid',
        borderRight: 'black 3px solid'
    },
    [`&.${tableCellClasses.body}.theSecondFirst`]: {
        paddingTop: '6px',
        paddingBottom: '6px',
        borderTop: 'initial !important',
        borderLeft: 'black 3px solid !important'
    },
    [`&.${tableCellClasses.body}.theSecond`]: {
        paddingTop: '6px',
        paddingBottom: '6px',
        borderTop: 'initial !important',
        borderLeft: 'initial !important'
    },
    [`&.${tableCellClasses.body}.theSecondFinal`]: {
        paddingTop: '6px',
        paddingBottom: '6px',
        borderTop: 'initial !important',
        borderLeft: 'initial !important',
        borderRight: 'black 3px solid !important'
    },
    [`&.${tableCellClasses.body}`]: {
        padding: '12px',
        fontFamily: 'Microsoft JhengHei,Arial',
        fontSize: '8px',
        background: '#fff',
        border: 'black 1.5px solid !important'
    },
    [`&.${tableCellClasses.body}.totalAmountFirst`]: {
        paddingTop: '6px',
        paddingBottom: '6px',
        fontWeight: 'bold',
        borderTop: 'initial !important',
        borderRight: 'initial !important',
        borderLeft: 'black 3px solid !important',
        borderBottom: 'black 3px solid !important'
    },
    [`&.${tableCellClasses.body}.totalAmountSecond`]: {
        paddingTop: '6px',
        paddingBottom: '6px',
        fontWeight: 'bold',
        borderTop: 'initial !important',
        borderRight: 'initial !important',
        borderBottom: 'black 3px solid !important'
    },
    [`&.${tableCellClasses.body}.totalAmount`]: {
        paddingTop: '6px',
        paddingBottom: '6px',
        borderTop: 'initial !important',
        borderRight: 'initial !important',
        borderLeft: 'initial !important',
        borderBottom: 'black 3px solid !important',
        fontWeight: 'bold'
    },
    [`&.${tableCellClasses.body}.totalAmountFinal`]: {
        paddingTop: '6px',
        paddingBottom: '6px',
        borderTop: 'initial !important',
        borderRight: 'black 3px solid !important',
        borderBottom: 'black 3px solid !important',
        fontWeight: 'bold'
    }
}));

const BillDraftMake = ({ isDialogOpen, handleDialogClose, billMasterID, pONo, workTitle, code, bmJoin, submarineCableName, issueDateDefault, dueDateDefault, tmpBMArray }) => {
    const dispatch = useDispatch();
    const [dataList, setDataList] = useState([]);
    const [contact, setContact] = useState({ UserID: '', UserName: '' });
    const [contactList, setContactList] = useState([]);
    const [contactInfo, setContactInfo] = useState({});
    const [partyInfo, setPartyInfo] = useState({});
    const [submarineCableInfo, setSubmarineCableInfo] = useState({});
    const [detailInfo, setDetailInfo] = useState([]);
    const totalAmountInfo = useRef({ shareAmount: 0, taxAmount: 0, totalAmount: 0 });
    const [issueDate, setIssueDate] = useState(issueDateDefault); //發票日期
    const [dueDate, setDueDate] = useState(dueDateDefault); //發票日期
    const [logo, setLogo] = useState(1);
    const [subject1, setSubject1] = useState(''); //主旨1
    const [subject3, setSubject3] = useState(''); //主旨3
    const [isShowLevel, setIsShowLevel] = useState(false); //顯示費用項目階層
    const isTax = useRef(false);

    const itemDetailInitial = () => {
        setDetailInfo([]);
    };

    const clearDetail = () => {
        setContact({});
        setLogo(1);
        setSubject1('');
        setSubject3('');
        setIssueDate(issueDateDefault);
        setDueDate(dueDateDefault);
    };

    const handleDownload = () => {
        if (!contact.UserID) {
            return dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請選擇窗口人員'
                    }
                })
            );
        }
        let tmpData = {
            BillMasterID: billMasterID,
            UserID: contact.UserID,
            IssueDate: dayjs(issueDate).format('YYYY/MM/DD'),
            DueDate: dayjs(dueDate).format('YYYY/MM/DD'),
            WorkTitle: subject1,
            InvoiceName: subject3,
            logo: logo,
            GetTemplate: false
        };
        fetch(generateBillData, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            },
            body: JSON.stringify(tmpData)
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                // 解析 content-disposition 来获取文件名
                const contentDisposition = res.headers.get('content-disposition');
                let filename = 'default.pdf'; // 默认文件名
                if (contentDisposition.includes("filename*=utf-8''")) {
                    const filenameEncoded = contentDisposition.split("filename*=utf-8''")[1];
                    filename = decodeURIComponent(filenameEncoded);
                } else {
                    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                    if (filenameMatch && filenameMatch[1]) {
                        filename = filenameMatch[1];
                    }
                }
                return res.blob().then((blob) => ({ blob, filename }));
            })
            .then(({ blob, filename }) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch((e) => console.error('handleDownload error:', e));
    };

    const handleContact = (e) => {
        setContact({
            UserID: e.UserID,
            UserName: e.UserName
        });
    };

    useEffect(() => {
        if (isDialogOpen) {
            let tmpArray = {
                BillMasterID: billMasterID,
                UserID: 'chang_ty', //20241007暫時不動
                GetTemplate: true
            };
            setIssueDate(issueDateDefault);
            setDueDate(dueDateDefault);
            fetch(generateBillData, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
                },
                body: JSON.stringify(tmpArray)
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log('data抓取成功=>>', data);
                    setDataList(data);
                    setContactInfo(data.ContactWindowAndSupervisorInformation);
                    setPartyInfo(data.PartyInformation);
                    setSubmarineCableInfo(data.CorporateInformation);
                    setDetailInfo(data.DetailInformation);
                    data.DetailInformation.forEach((i) => {
                        if (i.IsTax) {
                            totalAmountInfo.current.taxAmount = new Decimal(totalAmountInfo.current.taxAmount)
                                .toDecimalPlaces(2)
                                .add(new Decimal(i.ShareAmount).toDecimalPlaces(2));
                        } else {
                            totalAmountInfo.current.shareAmount = new Decimal(totalAmountInfo.current.shareAmount)
                                .toDecimalPlaces(2)
                                .add(new Decimal(i.ShareAmount).toDecimalPlaces(2));
                        }
                        totalAmountInfo.current.totalAmount = new Decimal(totalAmountInfo.current.totalAmount)
                            .toDecimalPlaces(2)
                            .add(new Decimal(i.ShareAmount).toDecimalPlaces(2));
                    });
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
            fetch(dropdownmenuUsers, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
                }
            })
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        setContactList(data);
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
    }, [billMasterID, isDialogOpen]);

    console.log('isShowLevel=>>', isShowLevel, typeof isShowLevel);

    return (
        <Dialog maxWidth="xxl" fullWidth open={isDialogOpen}>
            <BootstrapDialogTitle className="no-print">產製帳單</BootstrapDialogTitle>
            <DialogContent dividers className="no-print">
                <Grid container spacing={2} className="no-print">
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        <MainCard title="聯絡窗口及主管資訊" sx={{ width: '100%' }}>
                            <Grid container spacing={1}>
                                <Grid item md={2} display="flex" justifyContent="center" alignItems="center">
                                    <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
                                        標示：
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} sm={4} md={4} lg={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>選擇標示</InputLabel>
                                        <Select value={logo} label="Logo" onChange={(e) => setLogo(e.target.value)}>
                                            <MenuItem value={1}>CHT Logo</MenuItem>
                                            <MenuItem value={2}>TPE Logo</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} display="flex" justifyContent="center" alignItems="center">
                                    <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
                                        窗口人員：
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} sm={4} md={4} lg={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>選擇聯絡窗口</InputLabel>
                                        <Select
                                            label="會員"
                                            value={contact.UserName ? contact : ''}
                                            onChange={(e) => handleContact(e.target.value)}
                                            renderValue={(selected) => (selected.UserName ? selected.UserName : '選擇聯絡窗口')}
                                        >
                                            {contactList.map((i) => (
                                                <MenuItem key={i.UserID} value={i}>
                                                    {i.UserName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </MainCard>
                        <MainCard title="顯示費用項目階層" sx={{ width: '100%' }}>
                            <Grid container spacing={1} display="flex" alignItems="center">
                                <Grid item md={3} display="flex" justifyContent="start">
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontSize: { lg: '0.7rem', xl: '0.88rem' }
                                        }}
                                    >
                                        顯示費用項目階層：
                                    </Typography>
                                </Grid>
                                <Grid container item md={9} display="flex" alignItems="center">
                                    <FormControl>
                                        <RadioGroup row value={isShowLevel} onChange={(e) => setIsShowLevel(e.target.value)}>
                                            <FormControlLabel
                                                value={true}
                                                control={
                                                    <Radio
                                                        sx={{
                                                            '& .MuiSvgIcon-root': {
                                                                fontSize: { lg: 14, xl: 20 }
                                                            }
                                                        }}
                                                    />
                                                }
                                                label="是"
                                            />
                                            <FormControlLabel
                                                value={false}
                                                control={
                                                    <Radio
                                                        sx={{
                                                            '& .MuiSvgIcon-root': {
                                                                fontSize: { lg: 14, xl: 20 }
                                                            }
                                                        }}
                                                    />
                                                }
                                                label="否"
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item md={12} display="flex" justifyContent="start">
                                    <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
                                        表頭一：
                                    </Typography>
                                </Grid>
                                <Grid container item md={12} spacing={2} display="flex" justifyContent="center">
                                    <Grid item xs={12} sm={12} md={12} lg={12} display="flex">
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            value={subject1}
                                            size="small"
                                            inputProps={{ maxLength: 65 }}
                                            onChange={(e) => setSubject1(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item md={12} display="flex" justifyContent="start">
                                    <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
                                        表頭二：
                                    </Typography>
                                </Grid>
                                <Grid container item md={12} display="flex" justifyContent="center">
                                    <Grid item xs={12} sm={12} md={12} lg={12} display="flex">
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            value={subject3}
                                            size="small"
                                            inputProps={{ maxLength: 65 }}
                                            onChange={(e) => setSubject3(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item md={2} display="flex" justifyContent="center" alignItems="center">
                                    <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
                                        開立日期：
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} sm={4} md={4} lg={4}>
                                    <FormControl>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DesktopDatePicker
                                                inputFormat="YYYY/MM/DD"
                                                value={issueDate}
                                                onChange={(e) => {
                                                    setIssueDate(e);
                                                }}
                                                renderInput={(params) => <TextField size="small" {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} display="flex" justifyContent="center" alignItems="center">
                                    <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
                                        到期日期：
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} sm={4} md={4} lg={4}>
                                    <FormControl>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DesktopDatePicker
                                                inputFormat="YYYY/MM/DD"
                                                value={dueDate}
                                                onChange={(e) => {
                                                    setDueDate(e);
                                                }}
                                                renderInput={(params) => <TextField size="small" {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </MainCard>
                    </Grid>
                    {/* 表單開始 */}
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        <Typography sx={{ fontFamily: 'Microsoft JhengHei,Arial' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box sx={{ m: 1, width: '50%' }}>
                                    <Box sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        <Box
                                            component="img"
                                            sx={{
                                                width: '15rem',
                                                height: 'auto'
                                            }}
                                            src={logo === 1 ? Logo1 : Logo2}
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{ m: 1, width: '20%' }} />
                                <Box sx={{ m: 1, width: '30%' }}>
                                    <Box sx={{ fontSize: '12px', textAlign: 'left' }}>{contactInfo?.Company}</Box>
                                    <Box sx={{ fontSize: '12px', textAlign: 'left' }}>{contact.UserName}</Box>
                                    <Box sx={{ fontSize: '12px', textAlign: 'left' }}>{contactInfo?.Address}</Box>
                                    <Box sx={{ fontSize: '12px', textAlign: 'left' }}>Tel：{contactInfo?.Tel}</Box>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    fontSize: subject1?.length <= 50 ? '18px' : '15px',
                                    mt: 1,
                                    textAlign: 'center',
                                    whiteSpace: 'nowrap',
                                    fontWeight: 'bold'
                                }}
                            >
                                <Box>
                                    {submarineCableName} {workTitle} Cable {subject1} Central Billing Party
                                </Box>
                                <Box>{tmpBMArray.join(',')}</Box>
                                <Box>
                                    {subject3} {bmJoin?.join(',')}
                                </Box>
                                <Box>Invoice</Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box sx={{ m: 1, minWidth: '40%', with: '40%' }}>
                                    <Box sx={{ fontSize: '12px', textAlign: 'left' }}>BILL TO：</Box>
                                    <Box sx={{ fontSize: '12px', textAlign: 'left' }}>{partyInfo?.Company}</Box>
                                    <Box sx={{ fontSize: '12px', textAlign: 'left' }}>ADDR：{partyInfo?.Address}</Box>
                                    <Box sx={{ fontSize: '12px', textAlign: 'left' }}>ATTN：{partyInfo?.Contact}</Box>
                                    <Box sx={{ fontSize: '12px', textAlign: 'left' }}>E-mail：{partyInfo?.Email}</Box>
                                    <Box sx={{ fontSize: '12px', textAlign: 'left' }}>Tel：{partyInfo?.Tel}</Box>
                                </Box>
                                <Box sx={{ m: 1, minWidth: '30%', with: '30%' }} />
                                <Box sx={{ m: 1, minWidth: '30%', with: '30%' }}>
                                    <Box sx={{ fontSize: '12px', textAlign: 'left' }}>Invoice No.： {dataList.InvoiceNo}</Box>
                                    <Box sx={{ fontSize: '12px', textAlign: 'left' }}>Issue Date：{dayjs(issueDate).format('YYYY/MM/DD')}</Box>
                                    <Box sx={{ fontSize: '12px', textAlign: 'left' }}>Due Date：{dayjs(dueDate).format('YYYY/MM/DD')}</Box>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    fontSize: '12px',
                                    m: 1,
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Box>{pONo?.length > 0 ? `PO No. ${pONo}` : null}</Box>
                                <Box>(Currency：{code})</Box>
                            </Box>
                            <Box>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 300 }} stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell className="theTopFirst">No</StyledTableCell>
                                                <StyledTableCell className="top">Supplier</StyledTableCell>
                                                <StyledTableCell className="top">INV. No.</StyledTableCell>
                                                {isShowLevel === 'true' ? <StyledTableCell className="top">Budget Description</StyledTableCell> : null}
                                                <StyledTableCell className="top">Description</StyledTableCell>
                                                <StyledTableCell className="top">Currency</StyledTableCell>
                                                <StyledTableCell className="top">Amount</StyledTableCell>
                                                <StyledTableCell className="top">Liability</StyledTableCell>
                                                <StyledTableCell className="top">Share Amount</StyledTableCell>
                                                <StyledTableCell className="top">Tax</StyledTableCell>
                                                <StyledTableCell className="theTopFinal">Total</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {detailInfo?.map((row, id) => {
                                                isTax.current = row.IsTax;
                                                return (
                                                    <TableRow key={id}>
                                                        <StyledTableCell align="center" className="theSecondFirst">
                                                            {id + 1}
                                                        </StyledTableCell>
                                                        <StyledTableCell align="center" className="theSecond">
                                                            {row.Supplier}
                                                        </StyledTableCell>
                                                        <StyledTableCell align="left" className="theSecond">
                                                            {row.InvNumber}
                                                        </StyledTableCell>
                                                        {isShowLevel === 'true' ? (
                                                            <StyledTableCell align="left" className="theSecond">
                                                                {row.BudgetDescription}
                                                            </StyledTableCell>
                                                        ) : null}
                                                        <StyledTableCell align="left" className="theSecond">
                                                            {row.Description}
                                                        </StyledTableCell>
                                                        <StyledTableCell align="left" className="theSecond">
                                                            {row.ToCode}
                                                        </StyledTableCell>
                                                        <StyledTableCell align="right" className="theSecond">
                                                            {handleNumber(row.BilledAmount?.toFixed(2))}
                                                        </StyledTableCell>
                                                        <StyledTableCell align="right" className="theSecond">
                                                            {row.Liability?.toFixed(10)}%
                                                        </StyledTableCell>
                                                        <StyledTableCell align="right" className="theSecond">
                                                            {row.IsTax ? '0.00' : handleNumber(row.ShareAmount?.toFixed(2))}
                                                        </StyledTableCell>
                                                        <StyledTableCell align="right" className="theSecond">
                                                            {row.IsTax ? handleNumber(row.ShareAmount?.toFixed(2)) : '0.00'}
                                                        </StyledTableCell>
                                                        <StyledTableCell align="right" className="theSecondFinal">
                                                            {handleNumber(row.ShareAmount?.toFixed(2))}
                                                        </StyledTableCell>
                                                    </TableRow>
                                                );
                                            })}
                                            <TableRow>
                                                <StyledTableCell align="center" className="totalAmountFirst" />
                                                <StyledTableCell align="center" className="totalAmount" />
                                                <StyledTableCell align="center" className="totalAmount" />
                                                <StyledTableCell align="center" className="totalAmount" />
                                                {isShowLevel === 'true' ? <StyledTableCell align="center" className="totalAmount" /> : null}
                                                <StyledTableCell align="center" className="totalAmount" />
                                                <StyledTableCell align="center" className="totalAmount" />
                                                <StyledTableCell align="center" className="totalAmount">
                                                    Total Amount
                                                </StyledTableCell>
                                                <StyledTableCell align="right" className="totalAmountSecond">
                                                    {handleNumber(totalAmountInfo.current?.shareAmount.toFixed(2))}
                                                </StyledTableCell>
                                                <StyledTableCell align="right" className="totalAmountSecond">
                                                    {handleNumber(totalAmountInfo.current?.taxAmount.toFixed(2))}
                                                </StyledTableCell>
                                                <StyledTableCell align="right" className="totalAmountFinal">
                                                    {handleNumber(totalAmountInfo.current?.totalAmount.toFixed(2))}
                                                </StyledTableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                            <Box sx={{ m: 1, fontSize: '12px' }}>Certified by：</Box>
                            <Box
                                sx={{
                                    fontSize: '12px',
                                    m: 1,
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '50%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'end'
                                    }}
                                >
                                    <Box sx={{}}>———————————————</Box>
                                    <Box sx={{}}>{contactInfo?.DirectorName}</Box>
                                    <Box sx={{}}>Director, CBP</Box>
                                    <Box sx={{}}>{contactInfo?.Company}</Box>
                                    <Box sx={{}}>Tel： {contactInfo?.DTel}</Box>
                                    <Box sx={{}}>Fax： {contactInfo?.DFax}</Box>
                                </Box>
                                <Box sx={{ width: '50%' }}>
                                    <Box>Payment by Telegraphic Transfer to：</Box>
                                    <Box>Bank Name： {submarineCableInfo?.BankName}</Box>
                                    <Box>Branch Name： {submarineCableInfo?.Branch}</Box>
                                    <Box>Branch Address： {submarineCableInfo?.BranchAddress}</Box>
                                    <Box>A/C Name：{submarineCableInfo?.BankAcctName}</Box>
                                    <Box>Company Addr：{submarineCableInfo?.Address}</Box>
                                    <Box>
                                        A/C No.:
                                        {submarineCableInfo?.BankAcctNo?.length !== 0 ? submarineCableInfo?.BankAcctNo : submarineCableInfo?.SavingAcctNo}
                                    </Box>
                                    <Box>IBAN： {submarineCableInfo?.IBAN}</Box>
                                    <Box>Swift： {submarineCableInfo?.SWIFTCode}</Box>
                                    <Box>ACH：{submarineCableInfo?.ACHNo}</Box>
                                    <Box>Wire/Routing：{submarineCableInfo?.WireRouting}</Box>
                                </Box>
                            </Box>
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions className="no-print">
                <Button
                    sx={{ mr: '0.05rem' }}
                    variant="contained"
                    onClick={() => {
                        clearDetail();
                    }}
                >
                    清除
                </Button>
                <Button
                    sx={{ mr: '0.05rem' }}
                    variant="contained"
                    onClick={() => {
                        handleDownload();
                    }}
                >
                    下載
                </Button>
                <Button
                    sx={{ mr: '0.05rem' }}
                    variant="contained"
                    onClick={() => {
                        handleDialogClose();
                        itemDetailInitial();
                    }}
                >
                    關閉
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BillDraftMake;
