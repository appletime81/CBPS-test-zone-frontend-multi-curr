import { useState, useRef } from 'react';

// project import
import { handleNumber } from 'components/commonFunction';
import SignedDataWork from './signedDataWork';
import GenerateTerminate from './generateTerminate';
import UploadBillMasterAttachment from './uploadBillMasterAttachment';
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

import { updateBM } from 'components/apis.jsx';

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
    [`&.${tableCellClasses.body}.totalAmount`]: {
        fontSize: 14,
        paddingTop: '0.2rem',
        paddingBottom: '0.2rem',
        backgroundColor: '#CFD8DC',
    },
}));

const SignedDataList = ({ dataList, receivableQuery }) => {
    const dispatch = useDispatch();
    const [infoTerminal, setInfoTerminal] = useState(false); //作廢
    const [isViewOpen, setIsViewOpen] = useState(false); //產製帳單
    const [isUploadOpen, setIsUploadOpen] = useState(false); //簽核
    const billDetailInfo = useRef([]);
    const editBillingNo = useRef('');
    const editBillMasterID = useRef('');
    const billMasterID = useRef(-1);

    const toWriteOff = (billMasterID) => {
        let tmpData = {
            BillMasterID: billMasterID,
            Status: 'TO_WRITEOFF',
        };
        fetch(updateBM, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
            },
            body: JSON.stringify(tmpData),
        })
            .then((res) => res.json())
            .then(() => {
                receivableQuery();
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'success',
                            message: '進待銷帳成功',
                        },
                    }),
                );
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

    const handleDeductedClose = () => {
        setIsViewOpen(false);
    };

    const handleViewOpen = (data) => {
        billDetailInfo.current = data;
        setIsViewOpen(true);
    };

    const handleTerminalClose = () => {
        setInfoTerminal(false);
    };

    const handleInfoTerminal = (no, id) => {
        editBillingNo.current = no;
        editBillMasterID.current = id;
        setInfoTerminal(true);
    };

    const handleUploadClose = () => {
        setIsUploadOpen(false);
        billMasterID.current = -1;
    };

    return (
        <>
            <GenerateTerminate
                infoTerminal={infoTerminal}
                handleTerminalClose={handleTerminalClose}
                receivableQuery={receivableQuery}
                editBillingNo={editBillingNo.current}
                editBillMasterID={editBillMasterID.current}
            />
            <SignedDataWork
                isViewOpen={isViewOpen}
                handleDeductedClose={handleDeductedClose}
                billDetailInfo={billDetailInfo.current}
            />
            <UploadBillMasterAttachment
                isUploadOpen={isUploadOpen}
                handleUploadClose={handleUploadClose}
                billMasterID={billMasterID.current}
                receivableQuery={receivableQuery}
            />
            <TableContainer component={Paper} sx={{ maxHeight: window.screen.height * 0.5 }}>
                <Table sx={{ minWidth: 300 }} stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">NO</StyledTableCell>
                            <StyledTableCell align="center">會員</StyledTableCell>
                            <StyledTableCell align="center">海纜名稱</StyledTableCell>
                            <StyledTableCell align="center">海纜作業</StyledTableCell>
                            <StyledTableCell align="center">帳單號碼</StyledTableCell>
                            <StyledTableCell align="center">帳單日期</StyledTableCell>
                            <StyledTableCell align="center">截止日</StyledTableCell>
                            <StyledTableCell align="center">明細數量</StyledTableCell>
                            <StyledTableCell align="center">總金額</StyledTableCell>
                            <StyledTableCell align="center">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataList?.map((row, id) => {
                            return (
                                <TableRow
                                    key={
                                        row.InvoiceWKMaster?.BillMasterID +
                                        row.InvoiceWKMaster?.InvoiceNo +
                                        id
                                    }
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <StyledTableCell align="center">{id + 1}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.BillMaster.PartyName}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.BillMaster.SubmarineCable}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.BillMaster.WorkTitle}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.BillMaster.BillingNo}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {dayjs(row.BillMaster.IssueDate).format('YYYY/MM/DD')}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {dayjs(row.BillMaster.DueDate).format('YYYY/MM/DD')}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.BillDetail ? row.BillDetail.length : 0}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {handleNumber(row.BillMaster.FeeAmountSum)}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                '& button': {
                                                    mx: { sm: 0.2, md: 0.2, lg: 0.2, xl: 1 },
                                                    p: 0,
                                                },
                                            }}
                                        >
                                            <Button
                                                color="success"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    handleViewOpen(row.BillDetail);
                                                }}
                                            >
                                                檢視
                                            </Button>
                                            {row.BillMaster.Status === 'TO_WRITEOFF' ? (
                                                <Button
                                                    color="inherit"
                                                    size="small"
                                                    variant="outlined"
                                                >
                                                    已進待銷
                                                </Button>
                                            ) : (
                                                <Button
                                                    color="info"
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        toWriteOff(row.BillMaster.BillMasterID);
                                                    }}
                                                >
                                                    進待銷帳
                                                </Button>
                                            )}
                                            <Button
                                                color="warning"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    setInfoTerminal(true);
                                                }}
                                            >
                                                退回
                                            </Button>
                                            <Button
                                                color="error"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    handleInfoTerminal(
                                                        row.BillMaster.BillingNo,
                                                        row.BillMaster.BillMasterID,
                                                    );
                                                }}
                                            >
                                                作廢
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

export default SignedDataList;
