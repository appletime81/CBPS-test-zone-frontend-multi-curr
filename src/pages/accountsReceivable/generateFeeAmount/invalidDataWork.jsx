import { useState, useRef, useEffect } from 'react';

// project import
import { handleNumber, BootstrapDialogTitle } from 'components/commonFunction';
import Decimal from 'decimal.js';
// material-ui
import { Button, Table, Dialog, DialogContent, Grid, DialogActions } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        // backgroundColor: theme.palette.common.gary,
        color: theme.palette.common.black,
        paddingTop: '0.2rem',
        paddingBottom: '0.2rem',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        paddingTop: '0.2rem',
        paddingBottom: '0.2rem',
    },
    [`&.${tableCellClasses.body}.totalAmount`]: {
        fontSize: 14,
        paddingTop: '0.2rem',
        paddingBottom: '0.2rem',
        backgroundColor: '#CFD8DC',
    },
}));

const InvalidDataWork = ({ isViewOpen, handleDeductedClose, billDetailInfo }) => {
    let feeAmount = useRef(0); // 總費用金額加總(上)
    let dedAmount = useRef(0); //總折抵資料加總(上)
    let wHTAmountTotal = useRef(0); //預付稅款加總
    const [dataList, setDataList] = useState([]);

    const initData = () => {
        feeAmount.current = 0;
        dedAmount.current = 0;
        setDataList([]);
    };

    useEffect(() => {
        let tmpData = billDetailInfo.map((i) => i);
        if (isViewOpen) {
            tmpData.forEach((i) => {
                // feeAmount.current = feeAmount.current + i.FeeAmount;
                // dedAmount.current = dedAmount.current + i.DedAmount;
                // wHTAmountTotal.current = wHTAmountTotal.current + i.wHTAmountTotal;
                feeAmount.current = new Decimal(feeAmount.current).add(new Decimal(i.FeeAmount));
                dedAmount.current = new Decimal(dedAmount.current).add(new Decimal(i.DedAmount));
                wHTAmountTotal.current = new Decimal(wHTAmountTotal.current).add(
                    new Decimal(i.WHTAmount),
                );
            });
            setDataList(tmpData);
        }
    }, [billDetailInfo, isViewOpen]);

    return (
        <Dialog maxWidth="sm" open={isViewOpen}>
            <BootstrapDialogTitle>作廢帳單</BootstrapDialogTitle>
            <DialogContent>
                <Grid
                    container
                    spacing={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ fontSize: 10 }}
                >
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                            <Table sx={{ minWidth: 300 }} stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="center">NO</StyledTableCell>
                                        <StyledTableCell align="center">費用項目</StyledTableCell>
                                        <StyledTableCell align="center">計帳段號</StyledTableCell>
                                        <StyledTableCell align="center">折抵金額</StyledTableCell>
                                        <StyledTableCell align="center">預付稅款</StyledTableCell>
                                        <StyledTableCell align="center">總金額</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataList.map((row, id) => {
                                        return (
                                            <TableRow
                                                key={row.BillMasterID + row?.BillDetailID + id}
                                                sx={{
                                                    '&:last-child td, &:last-child th': {
                                                        border: 0,
                                                    },
                                                }}
                                            >
                                                <TableCell align="center">{id + 1}</TableCell>
                                                <TableCell align="center">{row.FeeItem}</TableCell>
                                                <TableCell align="center">
                                                    {row.BillMilestone}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {handleNumber(row.DedAmount)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {handleNumber(row.WHTAmountTotal)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {handleNumber(row.FeeAmount)}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <StyledTableCell className="totalAmount" align="center">
                                            Total
                                        </StyledTableCell>
                                        <StyledTableCell
                                            className="totalAmount"
                                            align="center"
                                        ></StyledTableCell>
                                        <StyledTableCell
                                            className="totalAmount"
                                            align="center"
                                        ></StyledTableCell>
                                        <StyledTableCell className="totalAmount" align="center">
                                            {handleNumber(dedAmount.current)}
                                        </StyledTableCell>
                                        <StyledTableCell className="totalAmount" align="center">
                                            {handleNumber(wHTAmountTotal.current)}
                                        </StyledTableCell>
                                        <StyledTableCell className="totalAmount" align="center">
                                            {handleNumber(feeAmount.current)}
                                        </StyledTableCell>
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
                        initData();
                        handleDeductedClose();
                    }}
                >
                    關閉
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InvalidDataWork;
