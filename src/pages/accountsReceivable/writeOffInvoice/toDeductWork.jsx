import { useState, useRef } from 'react';

// project import
import { handleNumber, BootstrapDialogTitle } from 'components/commonFunction';
import { queryCB } from 'components/apis';
import MainCard from 'components/MainCard';
import Decimal from 'decimal.js';
// material-ui
import { Button, Table, Dialog, DialogContent, Grid, DialogActions, TextField, Box } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

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

const ToDeductWork = ({ isDeductOpen, handleDeductClose, cbData, writeOffInfo, toWriteOffDetailInfo, setToWriteOffDetailInfo, setCBWriteOff }) => {
    const dispatch = useDispatch();
    const [isDeductWorkOpen, setIsDeductWorkOpen] = useState(false);
    const [cbDataList, setCbDataList] = useState([]); //可折抵的Data List
    const [tmpCBArray, setTmpCBArray] = useState([]); //折抵資料(畫面中顯示的)
    const tmpDeductArray = useRef([]);
    const editItem = useRef(''); //當前編輯明細項目

    const resetData = () => {
        let tmpWriteOffDetailInfo = [...toWriteOffDetailInfo];
        let tmpTempDeductArray = [...tmpDeductArray.current];
        tmpWriteOffDetailInfo.forEach((i) => {
            if (i.BillMasterID === cbData.current?.BillMasterID && i.BillDetailID === cbData.current?.BillDetailID) {
                i.ReceiveAmount = new Decimal(i.ReceiveAmount).add(new Decimal(i.CBWriteOffAmount)).toNumber(); //按下reset之後，CB折抵退回給本次實收
                i.CBWriteOffAmount = 0;
            }
        });
        tmpTempDeductArray.forEach((i, index) => {
            if (i.BillDetailID === cbData.current?.BillDetailID) {
                tmpTempDeductArray.splice(index, 1);
            }
        });
        tmpDeductArray.current = tmpTempDeductArray;
        setToWriteOffDetailInfo(tmpWriteOffDetailInfo);
        setCBWriteOff(tmpDeductArray.current);
    };

    const deductWork = (data) => {
        let tmpWriteOffDetailInfo = [...toWriteOffDetailInfo];
        tmpWriteOffDetailInfo.forEach((i) => {
            if (i.BillMasterID === cbData.current?.BillMasterID && i.BillDetailID === cbData.current?.BillDetailID) {
                i.ReceiveAmount = new Decimal(i.ReceiveAmount).add(new Decimal(i.CBWriteOffAmount)).toNumber(); //按下折抵之後，CB折抵暫時退回給本次實收
            }
        });
        let tmpArrayFilter = tmpDeductArray.current.filter((i) => i.BillDetailID === data.BillDetailID);

        const handleFetchResponse = (response) => {
            if (Array.isArray(response) && response.length > 0) {
                setCbDataList(response);
            } else {
                setCbDataList([]);
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'error',
                            message: '無可折抵項目'
                        }
                    })
                );
            }
        };

        const handleFetchError = () => {
            setCbDataList([]);
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '網路異常，請檢查網路連線或與系統窗口聯絡'
                    }
                })
            );
        };

        const fetchCBData = (query) => {
            fetch(query, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
                }
            })
                .then((res) => res.json())
                .then(handleFetchResponse)
                .catch(handleFetchError);
        };

        let tmpQuery = `${queryCB}/SubmarineCable=${writeOffInfo.SubmarineCable}&WorkTitle=${writeOffInfo.WorkTitle}&PartyName=${writeOffInfo.PartyName}&Code=${writeOffInfo.Code}`;

        if (tmpArrayFilter.length === 0) {
            fetchCBData(tmpQuery);
        } else {
            fetchCBData(tmpQuery);
            setTmpCBArray(tmpArrayFilter[0].CB);
        }

        editItem.current = data.BillDetailID;
        setIsDeductWorkOpen(true);
        // if (tmpArrayFilter.length === 0) {
        //     let tmpQuery =
        //         queryCB +
        //         '/SubmarineCable=' +
        //         writeOffInfo.SubmarineCable +
        //         '&WorkTitle=' +
        //         writeOffInfo.WorkTitle +
        //         '&PartyName=' +
        //         writeOffInfo.PartyName +
        //         '&Code=' +
        //         writeOffInfo.Code;
        //     fetch(tmpQuery, {
        //         method: 'GET',
        //         Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
        //     })
        //         .then((res) => res.json())
        //         .then((response) => {
        //             console.log('response=>>', response);
        //             if (Array.isArray(response) && response?.length > 0) {
        //                 setCbDataList(response);
        //             } else {
        //                 setCbDataList([]);
        //                 dispatch(
        //                     setMessageStateOpen({
        //                         messageStateOpen: {
        //                             isOpen: true,
        //                             severity: 'error',
        //                             message: '無可折抵項目'
        //                         }
        //                     })
        //                 );
        //             }
        //         })
        //         .catch(() => {
        //             setCbDataList([]);
        //             dispatch(
        //                 setMessageStateOpen({
        //                     messageStateOpen: {
        //                         isOpen: true,
        //                         severity: 'error',
        //                         message: '網路異常，請檢查網路連線或與系統窗口聯絡'
        //                     }
        //                 })
        //             );
        //         });
        // } else {
        //     let tmpQuery =
        //         queryCB +
        //         '/SubmarineCable=' +
        //         writeOffInfo.SubmarineCable +
        //         '&WorkTitle=' +
        //         writeOffInfo.WorkTitle +
        //         '&PartyName=' +
        //         writeOffInfo.PartyName +
        //         '&Code=' +
        //         writeOffInfo.Code;
        //     fetch(tmpQuery, {
        //         method: 'GET',
        //         Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
        //     })
        //         .then((res) => res.json())
        //         .then((response) => {
        //             console.log('response=>>', response);
        //             if (Array.isArray(response) && response?.length > 0) {
        //                 setCbDataList(response);
        //             } else {
        //                 setCbDataList([]);
        //                 dispatch(
        //                     setMessageStateOpen({
        //                         messageStateOpen: {
        //                             isOpen: true,
        //                             severity: 'error',
        //                             message: '無可折抵項目'
        //                         }
        //                     })
        //                 );
        //             }
        //         })
        //         .catch(() => {
        //             setCbDataList([]);
        //             dispatch(
        //                 setMessageStateOpen({
        //                     messageStateOpen: {
        //                         isOpen: true,
        //                         severity: 'error',
        //                         message: '網路異常，請檢查網路連線或與系統窗口聯絡'
        //                     }
        //                 })
        //             );
        //         });
        //     setTmpCBArray(tmpArrayFilter[0].CB);
        // }
    };

    const changeDiff = (currAmount, maxValue, value, cbid) => {
        //原始可折抵金額,可折抵金額,目前輸入值
        let tmpArrayFilter = tmpCBArray.filter((i) => i.CBID === cbid);
        let tmpArray = tmpCBArray.map((i) => i);
        if (tmpArrayFilter.length > 0) {
            tmpArray.forEach((i) => {
                if (i.CBID === cbid) {
                    if (Number(maxValue) === 0 || Number(value) <= 0) {
                        //如果可折抵金額已經為0 或 輸入數字為負數，則回傳0
                        i.TransAmount = 0;
                    } else if (Number(value) >= Number(maxValue)) {
                        i.TransAmount = Number(value) === Number(maxValue) ? Number(value) : Number(maxValue);
                    } else if (Number(value) >= Number(currAmount)) {
                        i.TransAmount = Number(currAmount);
                    } else {
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
                        : Number(value)
            });
        }
        setTmpCBArray(tmpArray); //秀於畫面中抵扣
    };

    const saveDeduct = () => {
        let tmpWriteOffDetailInfo = [...toWriteOffDetailInfo];
        let deductAmount = 0;
        let tmpArrayFilter = tmpDeductArray.current.filter((i) => i.BillDetailID === editItem.current);
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
            if (i1.BillDetailID === cbData.current?.BillDetailID) {
                i1.CB.forEach((i2) => {
                    deductAmount = new Decimal(deductAmount).add(new Decimal(i2.TransAmount)).toNumber();
                });
            }
        });
        tmpWriteOffDetailInfo.forEach((i) => {
            if (i.BillMasterID === cbData.current?.BillMasterID && i.BillDetailID === cbData.current?.BillDetailID) {
                i.CBWriteOffAmount = deductAmount;
                i.ReceiveAmount = new Decimal(i.ReceiveAmount).minus(new Decimal(deductAmount)).toNumber(); //20250106本次實收需要扣掉CB折抵
            }
        });
        setToWriteOffDetailInfo(tmpWriteOffDetailInfo);
        setCBWriteOff(tmpArray);
        tmpDeductArray.current = tmpArray;
        setTmpCBArray([]);
        setIsDeductWorkOpen(false);
        editItem.current = '';
    };

    const handleReset = () => {
        console.log('tmpDeductArray.current=>>', tmpDeductArray.current);
        resetData();
        setIsDeductWorkOpen(false);
    };

    const handleClose = () => {
        if (isDeductWorkOpen) {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'warning',
                        message: '請先儲存目前折抵作業'
                    }
                })
            );
        } else {
            setIsDeductWorkOpen(false);
            handleDeductClose();
            editItem.current = '';
        }
    };

    return (
        <Dialog maxWidth="xxl" open={isDeductOpen}>
            <BootstrapDialogTitle>折抵作業</BootstrapDialogTitle>
            <DialogContent>
                <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center">
                    <Box display="flex" justifyContent="end" sx={{ fontSize: '1.4rem', width: '100%' }}>
                        幣別：{writeOffInfo.Code}
                    </Box>
                    <Grid item md={12} lg={12}>
                        <MainCard title="帳單明細列表">
                            <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                                <Table sx={{ minWidth: 300 }} stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center">計帳段號</StyledTableCell>
                                            <StyledTableCell align="center">費用項目</StyledTableCell>
                                            <StyledTableCell align="center">累計實收</StyledTableCell>
                                            <StyledTableCell align="center">折抵金額</StyledTableCell>
                                            <StyledTableCell align="center">應收金額</StyledTableCell>
                                            <StyledTableCell align="center">Action</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 }
                                            }}
                                        >
                                            <TableCell align="center">{cbData.current?.BillMilestone}</TableCell>
                                            <TableCell align="center">{cbData.current?.FeeItem}</TableCell>
                                            <TableCell align="center">{handleNumber(cbData.current?.ReceivedAmount)}</TableCell>
                                            <TableCell align="center">{handleNumber(cbData.current?.CBWriteOffAmount)}</TableCell>
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    color: cbData.current?.FeeAmount - cbData.current?.WHTAmount - cbData.current?.CBWriteOffAmount >= 0 ? 'black' : 'red'
                                                }}
                                            >
                                                {handleNumber(
                                                    new Decimal(cbData.current?.FeeAmount || 0)
                                                        .minus(new Decimal(cbData.current?.WHTAmount || 0))
                                                        .minus(new Decimal(cbData.current?.CBWriteOffAmount || 0))
                                                        .toNumber()
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    color="primary"
                                                    variant={editItem.current === cbData.current?.BillDetailID ? 'contained' : 'outlined'}
                                                    size="small"
                                                    onClick={() => {
                                                        deductWork(cbData.current);
                                                    }}
                                                >
                                                    折抵
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </MainCard>
                    </Grid>
                    {isDeductWorkOpen ? (
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <MainCard title={``}>
                                <Grid container>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                                            <Table sx={{ minWidth: 300 }} stickyHeader>
                                                <TableHead>
                                                    <TableRow>
                                                        <StyledTableCell align="center">NO</StyledTableCell>
                                                        <StyledTableCell align="center">CB種類</StyledTableCell>
                                                        <StyledTableCell align="center">可折抵金額</StyledTableCell>
                                                        <StyledTableCell align="center">摘要說明</StyledTableCell>
                                                        <StyledTableCell align="center">折抵金額</StyledTableCell>
                                                        <StyledTableCell align="center">剩餘可折抵金額</StyledTableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {cbDataList.map((row, id) => {
                                                        let otherItemsDeducted = 0; //已經於別的項目折抵的金額
                                                        let deductFee = 0; //可折抵金額
                                                        let afterDiff = 0; //剩餘可折抵金額
                                                        //其他項目目前折抵金額-開始
                                                        tmpDeductArray.current.forEach((i1) => {
                                                            if (i1.BillDetailID !== editItem.current) {
                                                                i1.CB.forEach((i2) => {
                                                                    if (i2.CBID === row.CBID) {
                                                                        otherItemsDeducted = new Decimal(otherItemsDeducted).add(new Decimal(i2.TransAmount));
                                                                    }
                                                                });
                                                            }
                                                        });
                                                        //其他項目目前折抵金額-結束
                                                        //當前項目目前折抵金額-開始
                                                        let tmpArray = tmpCBArray.filter((i) => i.CBID === row.CBID);
                                                        let deductNumber = tmpArray[0] ? tmpArray[0].TransAmount : 0;
                                                        deductFee = new Decimal(row.CurrAmount).minus(new Decimal(otherItemsDeducted)).toNumber();
                                                        afterDiff = row.CurrAmount - deductNumber > 0 ? new Decimal(deductFee).minus(new Decimal(deductNumber)).toNumber() : 0;
                                                        return (
                                                            <TableRow
                                                                key={row.CBID + row?.BLDetailID + id}
                                                                sx={{
                                                                    '&:last-child td, &:last-child th': { border: 0 }
                                                                }}
                                                            >
                                                                <TableCell align="center">{id + 1}</TableCell>
                                                                <TableCell align="center">{row.CBType}</TableCell>
                                                                <TableCell align="center">{handleNumber(deductFee)}</TableCell>
                                                                <TableCell align="center">{row.Note}</TableCell>
                                                                <TableCell align="center">
                                                                    <TextField
                                                                        size="small"
                                                                        type="number"
                                                                        inputProps={{
                                                                            step: '.000001'
                                                                        }}
                                                                        style={{ width: '50%' }}
                                                                        value={deductNumber}
                                                                        onChange={(e) => {
                                                                            changeDiff(row.CurrAmount, deductFee, e.target.value, row.CBID);
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell align="center">{handleNumber(afterDiff)}</TableCell>
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
                <Button sx={{ mr: '0.05rem' }} variant="contained" onClick={handleReset}>
                    Reset
                </Button>
                <Button sx={{ mr: '0.05rem' }} variant="contained" onClick={handleClose}>
                    關閉
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ToDeductWork;
