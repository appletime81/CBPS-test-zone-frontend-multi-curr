import { useState, useRef, useEffect } from 'react';

// project import
import { handleNumber, BootstrapDialogTitle } from 'components/commonFunction';
import { queryCB, sendDuctInfo } from 'components/apis';
import MainCard from 'components/MainCard';
import Decimal from 'decimal.js';
// material-ui
import {
    Box,
    Typography,
    Button,
    Table,
    Dialog,
    DialogContent,
    Grid,
    DialogActions,
    TextField,
} from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import dayjs from 'dayjs';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

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

const ToDeductWork = ({
    isDeductOpen,
    handleDeductClose,
    billDetailInfo,
    billMasterInfo,
    actionName,
    receivableQuery,
}) => {
    const dispatch = useDispatch();
    const [isDeductWorkOpen, setIsDeductWorkOpen] = useState(false);
    const [cbDataList, setCbDataList] = useState([]); //可折抵的Data List
    const [tmpCBArray, setTmpCBArray] = useState([]); //折抵資料(畫面中顯示的)
    const tmpDeductArray = useRef([]); //暫時紀錄deduct的資料
    let orgFeeAmount = useRef(0); // 總費用金額加總(上)
    let dedAmount = useRef(0); //總折抵資料加總(上)
    let wHTAmountTotal = useRef(0); //預付稅款加總
    const [feeAmountTotal, setFeeAmountTotal] = useState(0); //總金額加總(上)
    const editItem = useRef(''); //當前編輯明細項目

    const initData = () => {
        setTmpCBArray([]);
        tmpDeductArray.current = [];
        editItem.current = '';
        orgFeeAmount.current = 0;
        dedAmount.current = 0;
        wHTAmountTotal.current = 0;
        setFeeAmountTotal(0);
    };

    //按下折抵
    const deductWork = (data) => {
        console.log('data=>>', data);
        let tmpArrayFilter = tmpDeductArray.current.filter(
            (i) => i.BillDetailID === data.BillDetailID,
        );
        if (tmpArrayFilter.length === 0) {
            let tmpQuery =
                queryCB +
                '/SubmarineCable=' +
                data.SubmarineCable +
                '&WorkTitle=' +
                data.WorkTitle +
                '&PartyName=' +
                data.PartyName +
                '&Code=' +
                data.Code;
            fetch(tmpQuery, {
                method: 'GET',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
            })
                .then((res) => res.json())
                .then((response) => {
                    console.log('response=>>', response.length !== 0);
                    if (Array.isArray(response) && response.length !== 0) {
                        setCbDataList(response);
                    } else {
                        dispatch(
                            setMessageStateOpen({
                                messageStateOpen: {
                                    isOpen: true,
                                    severity: 'error',
                                    message: '無可折抵項目',
                                },
                            }),
                        );
                    }
                })
                .catch(() => {
                    dispatch(
                        setMessageStateOpen({
                            messageStateOpen: {
                                isOpen: true,
                                severity: 'error',
                                message: '網路異常，請檢查網路連線或與系統窗口聯絡',
                            },
                        }),
                    );
                });
        } else {
            setTmpCBArray(tmpArrayFilter[0].CB);
        }
        editItem.current = data.BillDetailID;
        setIsDeductWorkOpen(true);
    };

    const changeDiff = (currAmount, maxValue, value, cbid) => {
        //原始可折抵金額,可折抵金額,目前輸入值
        let resule = 0;
        let tmpArrayFilter = tmpCBArray.filter((i) => i.CBID === cbid);
        let tmpArray = tmpCBArray.map((i) => i);
        if (tmpArrayFilter.length > 0) {
            tmpArray.forEach((i) => {
                if (i.CBID === cbid) {
                    if (Number(maxValue) === 0 || Number(value) <= 0) {
                        //如果可折抵金額已經為0 或 輸入數字為負數，則回傳0
                        resule = Number(currAmount);
                        i.TransAmount = 0;
                    } else if (Number(value) >= Number(maxValue)) {
                        resule =
                            Number(value) === Number(maxValue) ? Number(value) : Number(maxValue);
                        i.TransAmount =
                            Number(value) === Number(maxValue) ? Number(value) : Number(maxValue);
                    } else if (Number(value) >= Number(currAmount)) {
                        resule = Number(currAmount);
                        i.TransAmount = Number(currAmount);
                    } else {
                        resule = Number(value);
                        i.TransAmount = Number(value);
                    }
                }
            });
        } else {
            tmpArray.push({
                CBID: cbid,
                TransAmount:
                    Number(maxValue) === 0 || Number(value) < 0
                        ? 0
                        : Number(value) > Number(maxValue)
                        ? Number(maxValue)
                        : Number(value) > Number(currAmount)
                        ? Number(currAmount)
                        : Number(value),
            });
        }
        setTmpCBArray(tmpArray); //秀於畫面中抵扣
    };

    const saveDeduct = () => {
        let tmpFeeAmount = 0;
        let deductAmount = 0;
        let tmpArrayFilter = tmpDeductArray.current.filter(
            (i) => i.BillDetailID === editItem.current,
        );
        let tmpArray = tmpDeductArray.current.map((i) => i);
        if (tmpArrayFilter.length > 0) {
            tmpArray.forEach((i) => {
                if (i.BillDetailID === editItem.current) {
                    i.CB = tmpCBArray;
                }
            });
        } else {
            tmpArray.push({ BillDetailID: editItem.current, CB: tmpCBArray });
        }
        tmpArray.forEach((i1) => {
            i1.CB.forEach((i2) => {
                deductAmount = new Decimal(deductAmount).add(new Decimal(i2.TransAmount));
            });
        });
        billDetailInfo.forEach((i) => {
            tmpFeeAmount = new Decimal(tmpFeeAmount).add(new Decimal(i.FeeAmount));
        });
        dedAmount.current = deductAmount;
        tmpDeductArray.current = tmpArray;
        setFeeAmountTotal(tmpFeeAmount - deductAmount);
        setTmpCBArray([]);
        setIsDeductWorkOpen(false);
        editItem.current = '';
    };

    const handleReset = () => {
        setTmpCBArray([]);
        tmpDeductArray.current = [];
        editItem.current = '';
        // orgFeeAmount.current = 0;
        dedAmount.current = 0;
        // wHTAmountTotal.current = 0;
        // setFeeAmountTotal(0);
    };

    const sendDuctWork = () => {
        let tmpArray = {
            BillMaster: billMasterInfo,
            Deduct: tmpDeductArray.current,
        };
        fetch(sendDuctInfo, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
            },
            body: JSON.stringify(tmpArray),
        })
            .then((res) => res.json())
            .then(() => {
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'success',
                            message: '送出成功',
                        },
                    }),
                );
                receivableQuery();
            })
            .catch(() => {
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'error',
                            message: '網路異常，請檢查網路連線或與系統窗口聯絡',
                        },
                    }),
                );
            });
        handleDeductClose();
    };

    useEffect(() => {
        if (isDeductOpen) {
            let tmpFeeAmount = 0;
            billDetailInfo.forEach((row) => {
                orgFeeAmount.current = orgFeeAmount.current + row.OrgFeeAmount;
                wHTAmountTotal.current = wHTAmountTotal.current + row.WHTAmount;
                tmpFeeAmount = tmpFeeAmount + row.FeeAmount;
            });
            setFeeAmountTotal(tmpFeeAmount);
        }
    }, [billDetailInfo, isDeductOpen]);

    useEffect(() => {
        setFeeAmountTotal(orgFeeAmount.current - dedAmount.current);
    }, [dedAmount.current]);

    return (
        <Dialog maxWidth="xxl" open={isDeductOpen}>
            <BootstrapDialogTitle>
                {actionName === 'deduct' ? '折抵作業' : '檢視待抵扣帳單明細'}
            </BootstrapDialogTitle>
            <DialogContent>
                <Grid
                    container
                    spacing={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ fontSize: 10 }}
                >
                    {actionName === 'view' ? (
                        <Grid item md={12} lg={12}>
                            <Grid
                                container
                                spacing={1}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                sx={{ fontSize: 10 }}
                            >
                                <Grid item md={1} lg={1} />
                                <Grid item md={2} lg={2}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                            ml: { lg: '0.5rem', xl: '1.5rem' },
                                        }}
                                    >
                                        會員：
                                    </Typography>
                                </Grid>
                                <Grid item md={3} lg={3}>
                                    <TextField
                                        value={billMasterInfo.PartyName}
                                        fullWidth
                                        readOnly
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item md={2} lg={2}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                            ml: { lg: '0.5rem', xl: '1.5rem' },
                                        }}
                                    >
                                        帳單截止日期：
                                    </Typography>
                                </Grid>
                                <Grid item md={3} lg={3}>
                                    <TextField
                                        value={dayjs(billMasterInfo.DueDate).format('YYYY/MM/DD')}
                                        fullWidth
                                        readOnly
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item md={1} lg={1} />
                                <Grid item md={1} lg={1} />
                                <Grid item md={2} lg={2}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                            ml: { lg: '0.5rem', xl: '1.5rem' },
                                        }}
                                    >
                                        海纜名稱：
                                    </Typography>
                                </Grid>
                                <Grid item md={3} lg={3}>
                                    <TextField
                                        value={billMasterInfo.SubmarineCable}
                                        fullWidth
                                        readOnly
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item md={2} lg={2}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                            ml: { lg: '0.5rem', xl: '1.5rem' },
                                        }}
                                    >
                                        海纜作業：
                                    </Typography>
                                </Grid>
                                <Grid item md={3} lg={3}>
                                    <TextField
                                        value={billMasterInfo.WorkTitle}
                                        fullWidth
                                        readOnly
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item md={1} lg={1} />
                            </Grid>
                        </Grid>
                    ) : null}
                    <Grid item md={12} lg={12}>
                        <Box display="flex" justifyContent="end" sx={{ fontSize: '1rem' }}>
                            幣別：{billMasterInfo.Code}
                        </Box>
                        <MainCard title="帳單明細列表">
                            <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                                <Table sx={{ minWidth: 300 }} stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center">NO</StyledTableCell>
                                            <StyledTableCell align="center">
                                                計帳段號
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                費用項目
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                是否為税
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                費用金額
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                折抵金額
                                            </StyledTableCell>

                                            <StyledTableCell align="center">總金額</StyledTableCell>
                                            {actionName === 'deduct' ? (
                                                <StyledTableCell align="center">
                                                    Action
                                                </StyledTableCell>
                                            ) : null}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {billDetailInfo.map((row, id) => {
                                            let tmpFiliter = tmpDeductArray.current.filter(
                                                (i) => i.BillDetailID === row.BillDetailID,
                                            );
                                            let dedAmountTmp = 0;
                                            if (tmpFiliter.length > 0) {
                                                tmpFiliter[0].CB.forEach((i) => {
                                                    dedAmountTmp = dedAmountTmp + i.TransAmount;
                                                });
                                            }
                                            return (
                                                <TableRow
                                                    key={row.BillDetailID + row?.BillMasterID + id}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': {
                                                            border: 0,
                                                        },
                                                    }}
                                                >
                                                    <TableCell align="center">{id + 1}</TableCell>
                                                    <TableCell align="center">
                                                        {row.BillMilestone}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {row.FeeItem}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {row?.IsTax ? '是' : '否'}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {handleNumber(row.OrgFeeAmount)}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {handleNumber(dedAmountTmp)}
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        sx={{
                                                            color:
                                                                row.OrgFeeAmount -
                                                                    dedAmountTmp -
                                                                    row.WHTAmount >=
                                                                0
                                                                    ? 'black'
                                                                    : 'red',
                                                        }}
                                                    >
                                                        {handleNumber(
                                                            new Decimal(row.OrgFeeAmount)
                                                                .minus(new Decimal(dedAmountTmp))
                                                                .minus(new Decimal(row.WHTAmount)),
                                                        )}
                                                    </TableCell>
                                                    {actionName === 'deduct' ? (
                                                        <TableCell align="center">
                                                            <Button
                                                                color="primary"
                                                                variant={
                                                                    editItem.current ===
                                                                    row.BillDetailID
                                                                        ? 'contained'
                                                                        : 'outlined'
                                                                }
                                                                size="small"
                                                                onClick={() => {
                                                                    editItem.current === ''
                                                                        ? deductWork(row)
                                                                        : dispatch(
                                                                              setMessageStateOpen({
                                                                                  messageStateOpen:
                                                                                      {
                                                                                          isOpen: true,
                                                                                          severity:
                                                                                              'warning',
                                                                                          message:
                                                                                              '請先儲存目前折抵作業',
                                                                                      },
                                                                              }),
                                                                          );
                                                                }}
                                                            >
                                                                折抵
                                                            </Button>
                                                        </TableCell>
                                                    ) : null}
                                                </TableRow>
                                            );
                                        })}
                                        <TableRow
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 },
                                            }}
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
                                            <StyledTableCell
                                                className="totalAmount"
                                                align="center"
                                            ></StyledTableCell>
                                            <StyledTableCell className="totalAmount" align="center">
                                                {handleNumber(orgFeeAmount.current)}
                                            </StyledTableCell>
                                            <StyledTableCell className="totalAmount" align="center">
                                                {handleNumber(dedAmount.current)}
                                            </StyledTableCell>
                                            <StyledTableCell className="totalAmount" align="center">
                                                {handleNumber(feeAmountTotal)}
                                            </StyledTableCell>
                                            {actionName === 'deduct' ? (
                                                <StyledTableCell
                                                    className="totalAmount"
                                                    align="center"
                                                ></StyledTableCell>
                                            ) : null}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </MainCard>
                    </Grid>
                    {isDeductWorkOpen && actionName === 'deduct' ? (
                        <Grid item md={12} lg={12}>
                            <MainCard title={`${billMasterInfo.PartyName}可折抵CB`}>
                                <Grid container>
                                    <Grid item md={12} lg={12}>
                                        <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                                            <Table sx={{ minWidth: 300 }} stickyHeader>
                                                <TableHead>
                                                    <TableRow>
                                                        <StyledTableCell align="center">
                                                            NO
                                                        </StyledTableCell>
                                                        <StyledTableCell align="center">
                                                            CB種類
                                                        </StyledTableCell>
                                                        <StyledTableCell align="center">
                                                            可折抵金額
                                                        </StyledTableCell>
                                                        <StyledTableCell align="center">
                                                            摘要說明
                                                        </StyledTableCell>
                                                        <StyledTableCell align="center">
                                                            折抵金額
                                                        </StyledTableCell>
                                                        <StyledTableCell align="center">
                                                            剩餘可折抵金額
                                                        </StyledTableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {cbDataList.map((row, id) => {
                                                        let otherItemsDeducted = 0; //已經於別的項目折抵的金額
                                                        let deductFee = 0; //可折抵金額
                                                        let afterDiff = 0; //剩餘可折抵金額
                                                        //其他項目目前折抵金額-開始
                                                        tmpDeductArray.current.forEach((i1) => {
                                                            if (
                                                                i1.BillDetailID !== editItem.current
                                                            ) {
                                                                i1.CB.forEach((i2) => {
                                                                    if (i2.CBID === row.CBID) {
                                                                        otherItemsDeducted =
                                                                            new Decimal(
                                                                                otherItemsDeducted,
                                                                            )
                                                                                .add(
                                                                                    new Decimal(
                                                                                        i2.TransAmount,
                                                                                    ),
                                                                                )
                                                                                .toNumber();
                                                                    }
                                                                });
                                                            }
                                                        });
                                                        //其他項目目前折抵金額-結束
                                                        //當前項目目前折抵金額-開始
                                                        let tmpArray = tmpCBArray.filter(
                                                            (i) => i.CBID === row.CBID,
                                                        );
                                                        let deductNumber = tmpArray[0]
                                                            ? tmpArray[0].TransAmount
                                                            : 0;
                                                        deductFee = new Decimal(row.CurrAmount)
                                                            .minus(new Decimal(otherItemsDeducted))
                                                            .toNumber();

                                                        // afterDiff =
                                                        //     row.CurrAmount - otherItemsDeducted > 0
                                                        //         ? row.CurrAmount - otherItemsDeducted
                                                        //         : 0;
                                                        // afterDiff =
                                                        // row.CurrAmount - deductNumber > 0
                                                        //     ? new Decimal(row.CurrAmount)
                                                        //           .minus(
                                                        //               new Decimal(deductNumber),
                                                        //           )
                                                        //           .toNumber()
                                                        //     : 0;
                                                        afterDiff =
                                                            deductFee - deductNumber > 0
                                                                ? new Decimal(deductFee)
                                                                      .minus(
                                                                          new Decimal(deductNumber),
                                                                      )
                                                                      .toNumber()
                                                                : 0;
                                                        return (
                                                            <TableRow
                                                                key={
                                                                    row.CBID + row?.BLDetailID + id
                                                                }
                                                                sx={{
                                                                    '&:last-child td, &:last-child th':
                                                                        { border: 0 },
                                                                }}
                                                            >
                                                                <TableCell align="center">
                                                                    {id + 1}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {row.CBType}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {handleNumber(deductFee)}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {row.Note}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <TextField
                                                                        label="$"
                                                                        size="small"
                                                                        type="number"
                                                                        inputProps={{
                                                                            step: '.000001',
                                                                        }}
                                                                        style={{ width: '50%' }}
                                                                        value={deductNumber}
                                                                        onChange={(e) => {
                                                                            changeDiff(
                                                                                row.CurrAmount,
                                                                                deductFee,
                                                                                e.target.value,
                                                                                row.CBID,
                                                                            );
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {handleNumber(afterDiff)}
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                    <Grid item md={12} lg={12} display="flex" justifyContent="end">
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            size="small"
                                            sx={{ ml: '0.5rem', mt: '0.5rem' }}
                                            onClick={() => {
                                                saveDeduct();
                                            }}
                                        >
                                            儲存
                                        </Button>
                                    </Grid>
                                </Grid>
                            </MainCard>
                        </Grid>
                    ) : null}
                </Grid>
            </DialogContent>
            <DialogActions>
                {actionName === 'deduct' ? (
                    <>
                        <Button sx={{ mr: '0.05rem' }} variant="contained" onClick={sendDuctWork}>
                            送出
                        </Button>
                        <Button sx={{ mr: '0.05rem' }} variant="contained" onClick={handleReset}>
                            Reset
                        </Button>
                    </>
                ) : null}
                <Button
                    sx={{ mr: '0.05rem' }}
                    variant="contained"
                    onClick={() => {
                        initData();
                        setIsDeductWorkOpen(false);
                        handleDeductClose();
                    }}
                >
                    關閉
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ToDeductWork;
