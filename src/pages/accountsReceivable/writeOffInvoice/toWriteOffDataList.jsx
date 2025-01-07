import { useState, useRef } from 'react';

// project import
import WriteOffWork from './writeOffWork';
import { handleNumber } from 'components/commonFunction';
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

// material-ui
import { Button, Table, Box } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

// api
import { getWriteOffDetail, submitWriteOff, completeWriteOff } from 'components/apis';

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

const ToWriteOffDataList = ({ listInfo, writeOffInitQuery }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false); //折抵作業
    const writeOffInfo = useRef({});
    // const writeOffDetail = useRef([]);
    const [writeOffDetail, setWriteOffDetail] = useState([]);
    const [cBWriteOff, setCBWriteOff] = useState([]);
    let tmpBMArray = [];
    const dispatch = useDispatch();

    const handleDialogClose = () => {
        writeOffInfo.current = {};
        setWriteOffDetail([]);
        setIsDialogOpen(false);
    };

    const handleWriteOff = (info) => {
        let tmpQuery = getWriteOffDetail + '/BillMasterID=' + info.BillMasterID;
        writeOffInfo.current = info;
        setCBWriteOff([]);
        fetch(tmpQuery, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? ''
            }
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setWriteOffDetail(data);
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

    const sendWriteOffWork = (info) => {
        let tmpArray = {};
        tmpArray = {
            BillMaster: info.BillMaster,
            CBWriteOff: cBWriteOff
        };
        fetch(submitWriteOff, {
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
                            message: '銷帳紀錄送出成功'
                        }
                    })
                );
                writeOffInitQuery();
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

    const handleFinish = (id) => {
        let tmpQuery = completeWriteOff + '/BillMasterID=' + id;
        fetch(tmpQuery, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? ''
            }
        })
            .then((res) => res.json())
            .then(() => {
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'success',
                            message: '完成銷帳成功'
                        }
                    })
                );
                writeOffInitQuery();
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
            <WriteOffWork
                isDialogOpen={isDialogOpen}
                handleDialogClose={handleDialogClose}
                writeOffInfo={writeOffInfo.current}
                writeOffDetail={writeOffDetail}
                writeOffInitQuery={writeOffInitQuery}
                setCBWriteOff={setCBWriteOff}
                cBWriteOff={cBWriteOff}
                action="writeOff"
            />
            <TableContainer component={Paper} sx={{ maxHeight: window.screen.height * 0.45 }}>
                <Table sx={{ minWidth: 300 }} stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">NO</StyledTableCell>
                            <StyledTableCell align="center">海纜名稱</StyledTableCell>
                            <StyledTableCell align="center">海纜作業</StyledTableCell>
                            <StyledTableCell align="center">計帳段號</StyledTableCell>
                            <StyledTableCell align="center">會員</StyledTableCell>
                            <StyledTableCell align="center">帳單號碼</StyledTableCell>
                            <StyledTableCell align="center">帳單日期</StyledTableCell>
                            <StyledTableCell align="center">到期日期</StyledTableCell>
                            <StyledTableCell align="center">明細數量</StyledTableCell>
                            <StyledTableCell align="center">總金額</StyledTableCell>
                            <StyledTableCell align="center">累計實收金額</StyledTableCell>
                            <StyledTableCell align="center">累計手續金額</StyledTableCell>
                            <StyledTableCell align="center">幣別</StyledTableCell>
                            <StyledTableCell align="center">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listInfo?.map((row, id) => {
                            tmpBMArray = [];
                            row.BillDetail.forEach((i) => {
                                if (!tmpBMArray.includes(i.BillMilestone)) {
                                    tmpBMArray.push(i.BillMilestone);
                                }
                            });
                            return (
                                <TableRow key={row?.BillMaster?.BillingNo + row?.BillMaster?.PartyName + id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <StyledTableCell align="center">{id + 1}</StyledTableCell>
                                    <StyledTableCell align="center">{row?.BillMaster?.SubmarineCable}</StyledTableCell>
                                    <StyledTableCell align="center">{row?.BillMaster?.WorkTitle}</StyledTableCell>
                                    <StyledTableCell align="center">{tmpBMArray.join(',')}</StyledTableCell>
                                    <StyledTableCell align="center">{row?.BillMaster?.PartyName}</StyledTableCell>
                                    <StyledTableCell align="center">{row?.BillMaster?.BillingNo}</StyledTableCell>
                                    <StyledTableCell align="center">{dayjs(row?.BillMaster?.IssueDate).format('YYYY/MM/DD')}</StyledTableCell>
                                    <StyledTableCell align="center">{dayjs(row?.BillMaster?.DueDate).format('YYYY/MM/DD')}</StyledTableCell>
                                    <StyledTableCell align="center">{row.BillDetail?.length}</StyledTableCell>
                                    <StyledTableCell align="center">{handleNumber(row?.BillMaster?.FeeAmountSum)}</StyledTableCell>
                                    <StyledTableCell align="center">{handleNumber(row?.BillMaster?.ReceivedAmountSum)}</StyledTableCell>
                                    <StyledTableCell align="center">{handleNumber(row?.BillMaster?.BankFees)}</StyledTableCell>
                                    <StyledTableCell align="center">{row.BillMaster.Code}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                '& button': {
                                                    mx: { sm: 0.3, md: 0.3, lg: 0.6, xl: 1.5 },
                                                    p: 0
                                                }
                                            }}
                                        >
                                            <Button
                                                color="primary"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    handleWriteOff(row.BillMaster);
                                                }}
                                            >
                                                銷帳作業
                                            </Button>
                                            <Button
                                                color="success"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    sendWriteOffWork(row);
                                                }}
                                            >
                                                銷帳紀錄送出
                                            </Button>
                                            <Button
                                                color="info"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    handleFinish(row.BillMaster.BillMasterID);
                                                }}
                                            >
                                                完成銷帳
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

export default ToWriteOffDataList;
