import { useRef, useState } from 'react';

// project import
import { handleNumber } from 'components/commonFunction';
import { BootstrapDialogTitle } from 'components/commonFunction';
import Decimal from 'decimal.js';
// material-ui
import { Typography, Button, Table, Box, Grid, TextField } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import dayjs from 'dayjs';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// api
import { queryToDecutBill } from 'components/apis.jsx';

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
    },
    [`&.${tableCellClasses.body}.totalAmount`]: {
        fontSize: 14,
        paddingTop: '0.2rem',
        paddingBottom: '0.2rem',
        backgroundColor: '#CFD8DC'
    }
}));

const ResearchBillDataList = ({ listInfo, setDetailInfo }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false); //檢視
    const [billMasterInfo, setBillMasterInfo] = useState({});
    const [billDetailInfo, setBillDetailInfo] = useState([]);
    const totalPaidAmount = useRef(0);
    const dispatch = useDispatch();

    const initData = () => {
        totalPaidAmount.current = 0;
        setBillMasterInfo({});
        setBillDetailInfo([]);
    };

    const handleClose = () => {
        initData();
        setIsDialogOpen(false);
    };

    const viewBillDetail = (id) => {
        let tmpQuery = queryToDecutBill + '/BillMasterID=' + id;
        fetch(tmpQuery, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    let tmpAmount = 0;
                    data.forEach((i) => {
                        setBillMasterInfo(i.BillMaster);
                        setBillDetailInfo(i.BillDetail);
                        i.BillDetail.forEach((row) => {
                            tmpAmount = new Decimal(tmpAmount).add(new Decimal(row.PaidAmount));
                        });
                    });
                    totalPaidAmount.current = tmpAmount;
                    setIsDialogOpen(true);
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
    };

    return (
        <>
            <Dialog maxWidth="md" fullWidth open={isDialogOpen}>
                <BootstrapDialogTitle>帳單明細</BootstrapDialogTitle>
                <DialogContent>
                    <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center">
                        <Grid item sm={2} md={2} lg={2} display="flex" justifyContent="center" alignItems="center">
                            <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
                                帳單號碼：
                            </Typography>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3} lg={3}>
                            <TextField value={billMasterInfo.BillingNo} fullWidth variant="outlined" size="small" disabled />
                        </Grid>
                        <Grid item sm={2} md={2} lg={2} display="flex" justifyContent="center" alignItems="center">
                            <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
                                帳單到期日：
                            </Typography>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3} lg={3}>
                            <TextField value={dayjs(billMasterInfo.DueDate).format('YYYY/MM/DD')} fullWidth disabled={true} variant="outlined" size="small" />
                        </Grid>
                        <Grid item sm={12} md={12} lg={12}>
                            <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                                <Table sx={{ minWidth: 300 }} stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center">費用項目</StyledTableCell>
                                            <StyledTableCell align="center">計帳段號</StyledTableCell>
                                            <StyledTableCell align="center">會員</StyledTableCell>
                                            <StyledTableCell align="center">應收金額</StyledTableCell>
                                            <StyledTableCell align="center">已實收金額</StyledTableCell>
                                            <StyledTableCell align="center">已實付金額</StyledTableCell>
                                            <StyledTableCell align="center">摘要說明</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {billDetailInfo?.map((row, id) => {
                                            return (
                                                <TableRow
                                                    key={row.FeeItem + row.BillMilestone + row.PartyName + id}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': {
                                                            border: 0
                                                        }
                                                    }}
                                                >
                                                    <TableCell align="center">{row.FeeItem}</TableCell>
                                                    <TableCell align="center">{row.BillMilestone}</TableCell>
                                                    <TableCell align="center">{row.PartyName}</TableCell>
                                                    <TableCell align="center">{handleNumber(row.OrgFeeAmount)}</TableCell>
                                                    <TableCell align="center">{handleNumber(row.ReceivedAmount)}</TableCell>
                                                    <TableCell align="center">{handleNumber(row.PaidAmount)}</TableCell>
                                                    <TableCell align="center">{row.Note}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        <TableRow
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 }
                                            }}
                                        >
                                            <StyledTableCell className="totalAmount" align="center">
                                                Total
                                            </StyledTableCell>
                                            <StyledTableCell className="totalAmount" align="center" />
                                            <StyledTableCell className="totalAmount" align="center" />
                                            <StyledTableCell className="totalAmount" align="center">
                                                {handleNumber(billMasterInfo.FeeAmountSum)}
                                            </StyledTableCell>
                                            <StyledTableCell className="totalAmount" align="center">
                                                {handleNumber(billMasterInfo.ReceivedAmountSum)}
                                            </StyledTableCell>
                                            <StyledTableCell className="totalAmount" align="center">
                                                {handleNumber(totalPaidAmount.current)}
                                            </StyledTableCell>
                                            <StyledTableCell className="totalAmount" align="center"></StyledTableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        sx={{ mr: '0.05rem' }}
                        variant="contained"
                        onClick={() => {
                            handleClose();
                        }}
                    >
                        關閉
                    </Button>
                </DialogActions>
            </Dialog>
            <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                <Table sx={{ minWidth: 300 }} stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">NO</StyledTableCell>
                            <StyledTableCell align="center">帳單號碼</StyledTableCell>
                            <StyledTableCell align="center">會員</StyledTableCell>
                            <StyledTableCell align="center">海纜名稱</StyledTableCell>
                            <StyledTableCell align="center">海纜作業</StyledTableCell>
                            <StyledTableCell align="center">計帳段號</StyledTableCell>
                            <StyledTableCell align="center">帳單到期日</StyledTableCell>
                            <StyledTableCell align="center">應收金額</StyledTableCell>
                            <StyledTableCell align="center">已實收金額</StyledTableCell>
                            <StyledTableCell align="center">幣別</StyledTableCell>
                            <StyledTableCell align="center">狀態</StyledTableCell>
                            <StyledTableCell align="center">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listInfo?.map((row, id) => {
                            return (
                                <TableRow key={row.BillMaster?.BillingNo + row.BillMaster?.PartyName + id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <StyledTableCell align="center">{id + 1}</StyledTableCell>
                                    <StyledTableCell align="center">{row.BillMaster.BillingNo}</StyledTableCell>
                                    <StyledTableCell align="center">{row.BillMaster.PartyName}</StyledTableCell>
                                    <StyledTableCell align="center">{row.BillMaster.SubmarineCable}</StyledTableCell>
                                    <StyledTableCell align="center">{row.BillMaster.WorkTitle}</StyledTableCell>
                                    <StyledTableCell align="center">{row.BillMaster.BillMilestone}</StyledTableCell>
                                    <StyledTableCell align="center">{dayjs(row.BillMaster.DueDate).format('YYYY/MM/DD')}</StyledTableCell>
                                    <StyledTableCell align="center">{handleNumber(row.BillMaster.FeeAmountSum)}</StyledTableCell>
                                    <StyledTableCell align="center">{handleNumber(row.BillMaster.ReceivedAmountSum)}</StyledTableCell>
                                    <StyledTableCell align="center">{row.BillMaster.Code}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.BillMaster.Status === 'COMPLETE'
                                            ? '完成'
                                            : row.BillMaster.Status === 'TO_WRITEOFF'
                                            ? '待銷帳'
                                            : row.BillMaster.Status === 'INITIAL'
                                            ? '待抵扣'
                                            : '已抵扣'}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                '& button': {
                                                    mx: { md: 0.7, lg: 0.7, xl: 1.5 },
                                                    p: 0
                                                }
                                            }}
                                        >
                                            <Button
                                                color="primary"
                                                variant="outlined"
                                                onClick={() => {
                                                    setDetailInfo(row.InvoiceWKMaster);
                                                }}
                                            >
                                                檢視來源發票
                                            </Button>
                                            <Button
                                                color="success"
                                                variant="outlined"
                                                onClick={() => {
                                                    viewBillDetail(row.BillMaster.BillMasterID);
                                                }}
                                            >
                                                檢視帳單明細
                                            </Button>
                                        </Box>
                                    </StyledTableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default ResearchBillDataList;
