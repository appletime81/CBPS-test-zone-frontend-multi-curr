import { useEffect, useState, useRef } from 'react';
import { Typography, Grid, Button, FormControl, Box, TextField, Checkbox, Table, Tab, RadioGroup, FormControlLabel, Radio, TableCell } from '@mui/material';

// day
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// autocomplete
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

// project import
import MainCard from 'components/MainCard';
import { handleNumber, BootstrapDialogTitle, TabPanel } from 'components/commonFunction';

// table
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

// api
import { getPayDraftStreamCBRefund, getCurrencyDataChineseName } from 'components/apis.jsx';

// print
import './styles.css';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

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

const CorrespondenceMake = ({ isDialogOpen, handleDialogClose, payDraftID, payCode }) => {
    const dispatch = useDispatch();
    const [correspondenceInfo, setCorrespondenceInfo] = useState({});
    const [subject1, setSubject1] = useState(''); //主旨1
    const [cableInfo, setCableInfo] = useState(''); //海纜資訊
    const [cCode, setCCode] = useState({});

    const saveToSend = () => {
        let tmpArray = {
            PayDraftID: payDraftID,
            PayDraftCableInfo: cableInfo,
            PayDraftSubject: subject1
            // Save: true
        };
        fetch(getPayDraftStreamCBRefund, {
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
                            message: '送出成功'
                        }
                    })
                );
            })
            .catch((e) =>
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'error',
                            message: '送出不成功'
                        }
                    })
                )
            );
        handleDialogClose();
    };

    useEffect(() => {
        const tmpArray = {
            PayDraftID: payDraftID,
            Preview: true
        };
        if (isDialogOpen) {
            fetch(getPayDraftStreamCBRefund, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? ''
                },
                body: JSON.stringify(tmpArray)
            })
                .then((res) => res.json())
                .then((data) => {
                    setCorrespondenceInfo(data);
                    setSubject1(data.Subject);
                    setCableInfo(data.CableInfo);
                    // dispatch(setMessageStateOpen({ messageStateOpen: { isOpen: true, severity: 'success', message: '送出成功' } }));
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

            fetch(getCurrencyDataChineseName, { method: 'GET' })
                .then((res) => res.json())
                .then((data) => {
                    setCCode(data);
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
    }, [isDialogOpen]);

    return (
        <Dialog maxWidth="lg" fullWidth open={isDialogOpen}>
            <BootstrapDialogTitle className="no-print">製作函稿</BootstrapDialogTitle>
            <DialogContent dividers className="no-print">
                <Grid container spacing={2} className="no-print">
                    <Grid item xs={7} sm={7} md={7} lg={7}>
                        <MainCard title="函稿專用文字" sx={{ width: '100%' }}>
                            <Grid container spacing={1}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12} md={12} lg={12} display="flex">
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontSize: { lg: '0.55rem', xl: '0.88rem' },
                                                ml: { lg: '0.5rem', xl: '1.5rem' },
                                                display: 'flex',
                                                alignItems: 'center',
                                                flexWrap: 'wrap'
                                            }}
                                        >
                                            請電匯 {correspondenceInfo?.Payee}以支付
                                            <TextField
                                                variant="outlined"
                                                value={subject1}
                                                size="small"
                                                label="支付項目"
                                                onChange={(e) => setSubject1(e.target.value)}
                                                sx={{
                                                    fontSize: { lg: '0.55rem', xl: '0.88rem' },
                                                    ml: { lg: '0.5rem', xl: '1.5rem' },
                                                    width: '20%'
                                                }}
                                            />
                                            ，淨額為{cCode[payCode]}元{correspondenceInfo?.PayDraftChineseTotalFeeAmount}({payCode}
                                            {handleNumber(correspondenceInfo?.TotalFeeAmount)}
                                            )，請查照
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </MainCard>
                        <MainCard title="說明" sx={{ width: '100%' }}>
                            <Grid container spacing={1}>
                                <Grid item xs={2} sm={2} md={2} lg={2} display="flex" justifyContent="center" alignItems="center">
                                    <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
                                        海纜資訊：
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} sm={4} md={4} lg={4}>
                                    <TextField fullWidth variant="outlined" value={cableInfo} size="small" label="填寫海纜" onChange={(e) => setCableInfo(e.target.value)} />
                                </Grid>
                            </Grid>
                        </MainCard>
                    </Grid>
                    <Grid item xs={5} sm={5} md={5} lg={5}>
                        <Typography sx={{ fontFamily: 'DFKai-sb', fontWeight: 'bold' }}>
                            <Box sx={{ fontSize: '20px', m: 1 }}>中華電信股份有限公司國際電信分公司&nbsp;&nbsp;&nbsp;函(稿)</Box>
                            <Box sx={{ fontSize: '14px' }}>{`受文者：${correspondenceInfo?.OriginalTo}`}</Box>
                            <Box sx={{ fontSize: '14px' }}>&nbsp;&nbsp;&nbsp;&nbsp;</Box>
                            <Box sx={{ fontSize: '14px' }}>&nbsp;&nbsp;&nbsp;&nbsp;</Box>
                            <Box sx={{ fontSize: '14px' }}>&nbsp;&nbsp;&nbsp;&nbsp;</Box>
                            <Box sx={{ fontSize: '14px' }}>
                                主旨： 請電匯 {correspondenceInfo?.Payee}以支付{subject1}
                                ，淨額為{cCode[payCode]}
                                {correspondenceInfo?.PayDraftChineseTotalFeeAmount}
                                元({payCode}
                                {handleNumber(correspondenceInfo?.TotalFeeAmount)}
                                )，請查照。
                            </Box>
                            <Box sx={{ fontSize: '14px' }}>說明：</Box>
                            <Box sx={{ fontSize: '12px' }}>
                                一、請貴分行自本分公司之帳戶(帳號{correspondenceInfo?.CBPBankAcctNo}
                                )匯至以下帳戶
                            </Box>
                            <Box sx={{ fontSize: '12px' }}>&nbsp;&nbsp;&nbsp;&nbsp;A/C Name: {correspondenceInfo?.BankAcctName}.</Box>
                            <Box sx={{ fontSize: '12px' }}>&nbsp;&nbsp;&nbsp;&nbsp;Bank: {correspondenceInfo?.BankName}</Box>
                            <Box sx={{ fontSize: '12px' }}>&nbsp;&nbsp;&nbsp;&nbsp;Address：{correspondenceInfo?.BankAddress}</Box>
                            <Box sx={{ fontSize: '12px' }}>&nbsp;&nbsp;&nbsp;&nbsp;A/C Number: {correspondenceInfo?.BankAcctNo}</Box>
                            <Box sx={{ fontSize: '12px' }}>&nbsp;&nbsp;&nbsp;&nbsp;IBAN: {correspondenceInfo?.IBAN}</Box>
                            <Box sx={{ fontSize: '12px' }}>&nbsp;&nbsp;&nbsp;&nbsp;SWIFT: {correspondenceInfo?.SWIFTCode}</Box>
                            <Box sx={{ fontSize: '12px' }}>&nbsp;&nbsp;&nbsp;&nbsp;ACH: {correspondenceInfo?.ACHNo}</Box>
                            <Box sx={{ fontSize: '12px' }}>
                                &nbsp;&nbsp;&nbsp;&nbsp;Wire/Routing:
                                {correspondenceInfo?.WireRouting}
                            </Box>
                            <Box sx={{ fontSize: '12px' }}>二、本款項請即時匯出，匯款時請附加說明：</Box>
                            <Box sx={{ fontSize: '12px' }}>
                                &nbsp;&nbsp;&nbsp;&nbsp;Invoice No.{correspondenceInfo?.InvoiceNo},{cableInfo}, {payCode}
                                {handleNumber(correspondenceInfo?.TotalFeeAmount)}
                            </Box>
                            <Box sx={{ fontSize: '12px' }}>三、本款項為全額到行。</Box>
                            <Box sx={{ fontSize: '12px' }}>
                                四、檢附貴行外幣活期存款第{correspondenceInfo?.CBPBankAcctNo}
                                號帳戶同額{cCode[payCode]}取款憑條乙紙。
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
                        saveToSend();
                    }}
                >
                    儲存
                </Button>
                <Button
                    sx={{ mr: '0.05rem' }}
                    variant="contained"
                    onClick={() => {
                        handleDialogClose();
                    }}
                >
                    取消
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CorrespondenceMake;
