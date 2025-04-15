import { useState, useRef } from 'react';

// project import
import { handleNumber } from 'components/commonFunction';
import SignedDataWork from './signedDataWork';
import GenerateTerminate from './generateTerminate';
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

import { updateBM, downBM } from 'components/apis.jsx';

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
    [`&.${tableCellClasses.body}.totalAmount`]: {
        fontSize: 14,
        paddingTop: '0.2rem',
        paddingBottom: '0.2rem',
        backgroundColor: '#CFD8DC'
    }
}));

const IsSendDataList = ({ dataList, receivableQuery }) => {
    const dispatch = useDispatch();
    const [infoTerminal, setInfoTerminal] = useState(false); //作廢
    const [isDeductedWorkOpen, setIsDeductedWorkOpen] = useState(false); //產製帳單
    const billDetailInfo = useRef([]);
    const editBillingNo = useRef('');
    const editBillMasterID = useRef('');

    const toWriteOff = (billMasterID) => {
        let tmpData = {
            BillMasterID: billMasterID,
            Status: 'TO_WRITEOFF'
        };
        fetch(updateBM, { method: 'POST', body: JSON.stringify(tmpData) })
            .then((res) => res.json())
            .then(() => {
                receivableQuery();
                dispatch(setMessageStateOpen({ messageStateOpen: { isOpen: true, severity: 'success', message: '進待銷帳成功' } }));
            })
            .catch((e) => console.log('e1=>', e));
    };

    const handleDownload = (billMasterID, url) => {
        let tmpApi = downBM + '/' + billMasterID;
        const tmpArray = url.split('/');
        fetch(tmpApi, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            }
        })
            .then((res) => {
                return res.blob();
            })
            .then((blob) => {
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `${tmpArray[tmpArray.length - 1]}`;
                link.click();
            })
            .catch((e) => console.log('e1=>', e));
    };

    const handleDeductedClose = () => {
        setIsDeductedWorkOpen(false);
    };

    const handleDeductedOpen = (data) => {
        console.log('data=>>', data);
        billDetailInfo.current = data;
        setIsDeductedWorkOpen(true);
    };

    const handleTerminalClose = () => {
        setInfoTerminal(false);
    };

    const handleInfoTerminal = (no, id) => {
        editBillingNo.current = no;
        editBillMasterID.current = id;
        setInfoTerminal(true);
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
            <SignedDataWork isDeductedWorkOpen={isDeductedWorkOpen} handleDeductedClose={handleDeductedClose} billDetailInfo={billDetailInfo.current} />
            <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                <Table sx={{ minWidth: 300 }} stickyHeader aria-label="sticky table">
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
                                <TableRow key={row.BillMaster?.BillingNo + row.BillMaster?.FeeAmountSum} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <StyledTableCell align="center">{id + 1}</StyledTableCell>
                                    <StyledTableCell align="center">{row.BillMaster.PartyName}</StyledTableCell>
                                    <StyledTableCell align="center">{row.BillMaster.SubmarineCable}</StyledTableCell>
                                    <StyledTableCell align="center">{row.BillMaster.WorkTitle}</StyledTableCell>
                                    <StyledTableCell align="center">{row.BillMaster.BillingNo}</StyledTableCell>
                                    <StyledTableCell align="center">{dayjs(row.BillMaster.IssueDate).format('YYYY/MM/DD')}</StyledTableCell>
                                    <StyledTableCell align="center">{dayjs(row.BillMaster.DueDate).format('YYYY/MM/DD')}</StyledTableCell>
                                    <StyledTableCell align="center">{row.BillDetail ? row.BillDetail.length : 0}</StyledTableCell>
                                    <StyledTableCell align="center">{handleNumber(row.BillMaster.FeeAmountSum)}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                '& button': { mx: { sm: 0.2, md: 0.2, lg: 0.2, xl: 1 }, p: 0, fontSize: 1 }
                                            }}
                                        >
                                            <Button
                                                color="success"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    handleDeductedOpen(row.BillDetail);
                                                }}
                                            >
                                                檢視
                                            </Button>
                                            <Button
                                                color="primary"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    handleDownload(row.BillMaster.BillMasterID, row.BillMaster.URI);
                                                }}
                                            >
                                                上傳帳單
                                            </Button>
                                            <Button color="info" size="small" variant="outlined">
                                                上傳附件
                                            </Button>
                                            <Button color="warning" size="small" variant="outlined">
                                                下載帳單
                                            </Button>
                                            <Button color="error" size="small" variant="outlined">
                                                下載附件
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

export default IsSendDataList;
