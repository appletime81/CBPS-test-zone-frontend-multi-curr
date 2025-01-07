import { useState, useRef } from 'react';

// project import
import { handleNumber, BootstrapDialogTitle } from 'components/commonFunction';
import Decimal from 'decimal.js';
// material-ui
import { Button, Table, Dialog, DialogContent, DialogActions, TextField, Box } from '@mui/material';
import { TableBody, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

import { toBillDataapi, addInvoiceMasterInvoiceDetail } from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
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

const ToBillDataList = ({ listInfo, apiQuery }) => {
    const dispatch = useDispatch();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const toBillDataMain = useRef();
    const [toBillDataInfo, setToBillDataInfo] = useState([]); //發票明細檔
    const [totalAmount, setTotalAmount] = useState('0'); //發票總金額
    const [currentAmount, setCurrentAmount] = useState(0); //目前金額
    let codeType = useRef(''); //幣別
    let differAmount = useRef(0); //尾差值總和
    let feeAmountPostAmount = useRef(0); //攤分後金額總合

    const infoInit = () => {
        differAmount.current = 0;
        feeAmountPostAmount.current = 0;
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        infoInit();
    };

    //立帳作業
    const toBillData = (wKMasterID) => {
        let tmpQuery = '/WKMasterID=' + wKMasterID;
        tmpQuery = toBillDataapi + tmpQuery;
        console.log('tmpQuery=>>', tmpQuery);
        fetch(tmpQuery, {
            method: 'GET',
            Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data.InvoiceDetail) && Array.isArray(data.InvoiceMaster)) {
                    let tmpAmount = 0;
                    const reduceArray = Object.values(
                        data.InvoiceDetail.reduce((acc, item, index) => {
                            const keyName = item.PartyName;
                            if (!acc[keyName]) {
                                acc[keyName] = [];
                            }
                            item.itemCount = index + 1;
                            acc[keyName].push(item);
                            return acc;
                        }, []),
                    );
                    setToBillDataInfo(reduceArray);
                    toBillDataMain.current = data.InvoiceMaster;
                    setTotalAmount(data.TotalAmount.toString());
                    data.InvoiceDetail.forEach((i) => {
                        tmpAmount = new Decimal(tmpAmount)
                            .add(new Decimal(i.FeeAmountPost))
                            .add(new Decimal(i.Difference));
                        codeType.current = i.ToCode;
                    });
                    setCurrentAmount(tmpAmount);
                    feeAmountPostAmount.current = data.TotalAmount;
                    setIsDialogOpen(true);
                } else {
                    toBillDataMain.current = [];
                    setToBillDataInfo([]);
                    setTotalAmount('0');
                    setCurrentAmount(0);
                    dispatch(
                        setMessageStateOpen({
                            messageStateOpen: {
                                isOpen: true,
                                severity: 'info',
                                message: '沒有攤分資料',
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
    };

    const changeDiff = (diff, idFirst, idSecond) => {
        let tmpArray = toBillDataInfo.map((i) => i);
        let tmpAmount = 0;
        let tmpDifferAmount = 0;
        tmpArray[idFirst][idSecond].Difference = Number(diff);
        tmpArray.forEach((PartyNameArray) => {
            PartyNameArray.forEach((i) => {
                tmpAmount = new Decimal(tmpAmount)
                    .add(new Decimal(i.FeeAmountPost))
                    .add(new Decimal(i.Difference));
                tmpDifferAmount = new Decimal(tmpDifferAmount).add(new Decimal(i.Difference));
            });
        });
        differAmount.current = tmpDifferAmount;
        setToBillDataInfo(tmpArray);
        setCurrentAmount(tmpAmount);
    };

    // 送出立帳(新增)
    const sendJournalInfo = () => {
        if (Number(totalAmount).toFixed(6) === Number(currentAmount).toFixed(6)) {
            let tmpArray = toBillDataMain.current.map((i) => i);
            let tmpData = {
                TotalAmount: totalAmount,
                InvoiceMaster: tmpArray,
                InvoiceDetail: [].concat(...toBillDataInfo),
            };
            console.log('tmpData=>>', tmpData);
            fetch(addInvoiceMasterInvoiceDetail, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
                },
                body: JSON.stringify(tmpData),
            })
                .then((res) => res.json())
                .then(() => {
                    dispatch(
                        setMessageStateOpen({
                            messageStateOpen: {
                                isOpen: true,
                                severity: 'success',
                                message: '送出立帳成功',
                            },
                        }),
                    );
                    apiQuery();
                    handleDialogClose();
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
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '目前金額不等於發票總金額',
                    },
                }),
            );
        }
    };

    return (
        <>
            <Dialog maxWidth="xxl" fullWidth open={isDialogOpen}>
                <BootstrapDialogTitle>立帳作業</BootstrapDialogTitle>
                <Box display="flex" justifyContent="end" sx={{ marginRight: '2rem' }}>
                    幣別：{codeType.current}
                </Box>
                <DialogContent>
                    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">No</StyledTableCell>
                                    <StyledTableCell align="center">費用項目</StyledTableCell>
                                    <StyledTableCell align="center">費用金額</StyledTableCell>
                                    <StyledTableCell align="center">計帳段號</StyledTableCell>
                                    <StyledTableCell align="center">會員</StyledTableCell>
                                    <StyledTableCell align="center">攤分比例</StyledTableCell>
                                    <StyledTableCell align="center">攤分後金額</StyledTableCell>
                                    <StyledTableCell align="center">是否為稅</StyledTableCell>
                                    <StyledTableCell align="center">調整尾差值</StyledTableCell>
                                    <StyledTableCell align="center">總費用金額</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {toBillDataInfo.map((rowFirst, idFirst) => {
                                    return rowFirst.map((rowSecond, idSecond) => {
                                        let afterDiff = new Decimal(rowSecond.FeeAmountPost)
                                            .add(new Decimal(rowSecond.Difference))
                                            .minus(new Decimal(rowSecond.WHTAmount));
                                        return (
                                            <TableRow
                                                key={
                                                    idFirst +
                                                    rowSecond.FeeAmountPre +
                                                    rowSecond?.LBRatio +
                                                    rowSecond.itemCount
                                                }
                                                sx={{
                                                    '&:last-child td, &:last-child th': {
                                                        border: 0,
                                                    },
                                                }}
                                            >
                                                <TableCell
                                                    align="center"
                                                    sx={{
                                                        borderTop:
                                                            idFirst !== 0 && idSecond === 0
                                                                ? '0.5px solid black'
                                                                : null,
                                                    }}
                                                >
                                                    {rowSecond.itemCount}
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    sx={{
                                                        borderTop:
                                                            idFirst !== 0 && idSecond === 0
                                                                ? '0.5px solid black'
                                                                : null,
                                                    }}
                                                >
                                                    {rowSecond.FeeItem}
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    sx={{
                                                        borderTop:
                                                            idFirst !== 0 && idSecond === 0
                                                                ? '0.5px solid black'
                                                                : null,
                                                    }}
                                                >
                                                    {handleNumber(rowSecond.FeeAmountPre)}
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    sx={{
                                                        borderTop:
                                                            idFirst !== 0 && idSecond === 0
                                                                ? '0.5px solid black'
                                                                : null,
                                                    }}
                                                >
                                                    {rowSecond.BillMilestone}
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    sx={{
                                                        borderTop:
                                                            idFirst !== 0 && idSecond === 0
                                                                ? '0.5px solid black'
                                                                : null,
                                                    }}
                                                >
                                                    {rowSecond.PartyName}
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    sx={{
                                                        borderTop:
                                                            idFirst !== 0 && idSecond === 0
                                                                ? '0.5px solid black'
                                                                : null,
                                                    }}
                                                >
                                                    {rowSecond.LBRatio}%
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    sx={{
                                                        borderTop:
                                                            idFirst !== 0 && idSecond === 0
                                                                ? '0.5px solid black'
                                                                : null,
                                                    }}
                                                >
                                                    {handleNumber(rowSecond.FeeAmountPost)}
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    sx={{
                                                        borderTop:
                                                            idFirst !== 0 && idSecond === 0
                                                                ? '0.5px solid black'
                                                                : null,
                                                    }}
                                                >
                                                    {/* {rowSecond.WHTAmount} */}
                                                    {rowSecond.IsTax ? '是' : '否'}
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    sx={{
                                                        borderTop:
                                                            idFirst !== 0 && idSecond === 0
                                                                ? '0.5px solid black'
                                                                : null,
                                                    }}
                                                >
                                                    <TextField
                                                        label="$"
                                                        inputProps={{ step: '.000001' }}
                                                        size="small"
                                                        type="number"
                                                        style={{ width: '50%' }}
                                                        onChange={(e) => {
                                                            changeDiff(
                                                                e.target.value,
                                                                idFirst,
                                                                idSecond,
                                                            );
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    sx={{
                                                        borderTop:
                                                            idFirst !== 0 && idSecond === 0
                                                                ? '0.5px solid black'
                                                                : null,
                                                    }}
                                                >
                                                    {handleNumber(afterDiff)}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    });
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
                                        {handleNumber(feeAmountPostAmount.current)}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        className="totalAmount"
                                        align="center"
                                    ></StyledTableCell>
                                    <StyledTableCell className="totalAmount" align="center">
                                        {handleNumber(differAmount.current)}
                                    </StyledTableCell>
                                    <StyledTableCell className="totalAmount" align="center">
                                        {handleNumber(currentAmount)}
                                    </StyledTableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <Box display="flex" justifyContent="end" sx={{ marginRight: '2rem' }}>
                    幣別：{codeType.current}
                </Box>
                <DialogActions>
                    <Button sx={{ mr: '0.05rem' }} variant="contained" onClick={sendJournalInfo}>
                        新增
                    </Button>
                    <Button sx={{ mr: '0.05rem' }} variant="contained" onClick={handleDialogClose}>
                        關閉
                    </Button>
                </DialogActions>
            </Dialog>
            <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                <Table sx={{ minWidth: 300 }} stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">NO</StyledTableCell>
                            <StyledTableCell align="center">發票號碼</StyledTableCell>
                            <StyledTableCell align="center">供應商</StyledTableCell>
                            <StyledTableCell align="center">海纜名稱</StyledTableCell>
                            <StyledTableCell align="center">海纜作業</StyledTableCell>
                            <StyledTableCell align="center">發票日期</StyledTableCell>
                            <StyledTableCell align="center">明細數量</StyledTableCell>
                            <StyledTableCell align="center">原始金額</StyledTableCell>
                            <StyledTableCell align="center">原始幣別</StyledTableCell>
                            <StyledTableCell align="center">換匯後金額</StyledTableCell>
                            <StyledTableCell align="center">換匯後幣別</StyledTableCell>
                            <StyledTableCell align="center">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listInfo?.map((row, id) => {
                            return (
                                <TableRow
                                    key={row.InvoiceWKMaster?.InvoiceNo + id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <StyledTableCell align="center">{id + 1}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.InvoiceWKMaster.InvoiceNo}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.InvoiceWKMaster.SupplierName}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.InvoiceWKMaster.SubmarineCable}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.InvoiceWKMaster.WorkTitle}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {dayjs(row.InvoiceWKMaster.IssueDate).format('YYYY/MM/DD')}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.InvoiceWKDetail.length}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {handleNumber(row.InvoiceWKMaster.TotalAmount)}{' '}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.InvoiceWKMaster.Code}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {handleNumber(row.InvoiceWKMaster.ExgTotalAmount)}{' '}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.InvoiceWKMaster.ToCode}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                '& button': {
                                                    mx: { md: 0.3, lg: 0.6, xl: 1.5 },
                                                    p: 0,
                                                },
                                            }}
                                        >
                                            <Button
                                                color="primary"
                                                variant="outlined"
                                                onClick={() => {
                                                    toBillData(row.InvoiceWKMaster.WKMasterID);
                                                }}
                                            >
                                                立帳作業
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

export default ToBillDataList;
