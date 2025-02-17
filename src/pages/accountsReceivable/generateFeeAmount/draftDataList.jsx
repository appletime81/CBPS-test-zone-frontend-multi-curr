import { useState, useRef } from 'react';

// project import
import BillDraftMake from './billDraftMake';
// import DeductWork from './deductWork';
import GenerateFeeTerminate from './generateTerminate';
import SignAndUpload from './signAndUpload';
import GenerateBack from './generateBack';
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

const DraftDataList = ({ dataList }) => {
    // 暫時拿掉
    const deductInfo = useRef({});
    const actionName = useRef('');
    const [isDialogOpen, setIsDialogOpen] = useState(false); //檢視
    const [infoTerminal, setInfoTerminal] = useState(false); //作廢
    const [uploadOpen, setUploadOpen] = useState(false); //上傳
    const [infoBack, setInfoBack] = useState(false); //退回
    const [currentAmount, setCurrentAmount] = useState(''); //目前金額

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

    const handleDialogClose = () => setIsDialogOpen(false);

    const handleDialogOpen = (action, info) => {
        deductInfo.current = info;
        actionName.current = action;
        setIsDialogOpen(true);
    };

    const handleTerminalClose = () => {
        setInfoTerminal(false);
    };

    const handUploadClose = () => {
        setUploadOpen(false);
    };

    const handleBackClose = () => {
        setInfoBack(false);
    };

    console.log('infoTerminal=>>', infoTerminal);

    return (
        <>
            <GenerateFeeTerminate infoTerminal={infoTerminal} handleTerminalClose={handleTerminalClose} />
            <GenerateBack infoBack={infoBack} handleBackClose={handleBackClose} />
            <SignAndUpload uploadOpen={uploadOpen} handUploadClose={handUploadClose} />
            <BillDraftMake isDialogOpen={isDialogOpen} handleDialogClose={handleDialogClose} />
            <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                <Table sx={{ minWidth: 300 }} stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">NO</StyledTableCell>
                            <StyledTableCell align="center">會員</StyledTableCell>
                            <StyledTableCell align="center">海纜名稱</StyledTableCell>
                            <StyledTableCell align="center">海纜作業</StyledTableCell>
                            <StyledTableCell align="center">發票號碼</StyledTableCell>
                            <StyledTableCell align="center">供應商</StyledTableCell>
                            {/* <StyledTableCell align="center">合約種類</StyledTableCell> */}
                            <StyledTableCell align="center">發票日期</StyledTableCell>
                            <StyledTableCell align="center">明細數量</StyledTableCell>
                            <StyledTableCell align="center">總金額</StyledTableCell>
                            <StyledTableCell align="center">處理狀態</StyledTableCell>
                            <StyledTableCell align="center">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataList?.map((row, id) => {
                            return (
                                <TableRow key={row.InvoiceWKMaster?.WKMasterID + row.InvoiceWKMaster?.InvoiceNo + id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <StyledTableCell align="center">{id + 1}</StyledTableCell>
                                    <StyledTableCell align="center">{row.PartyName}</StyledTableCell>
                                    <StyledTableCell align="center">{row.SubmarineCable}</StyledTableCell>
                                    <StyledTableCell align="center">{row.WorkTitle}</StyledTableCell>
                                    <StyledTableCell align="center">{row.InvoiceNo}</StyledTableCell>
                                    <StyledTableCell align="center">{row.SupplierName}</StyledTableCell>
                                    <StyledTableCell align="center">{dayjs(row.IssueDate).format('YYYY/MM/DD')}</StyledTableCell>
                                    <StyledTableCell align="center">{dataList.length}</StyledTableCell>
                                    <StyledTableCell align="center"></StyledTableCell>
                                    <StyledTableCell align="center">{row.TotalAmount}</StyledTableCell>
                                    <StyledTableCell align="center">{row.Status}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                '& button': { mx: { sm: 0.3, md: 0.3, lg: 0.6, xl: 1.5 }, p: 0 }
                                            }}
                                        >
                                            <Button
                                                color="success"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    handleDialogOpen('viewDeducted', {
                                                        PartyName: row.PartyName,
                                                        IssueDate: dayjs(row.IssueDate).format('YYYY/MM/DD'),
                                                        SubmarineCable: row.SubmarineCable,
                                                        WorkTitle: row.WorkTitle
                                                    });
                                                }}
                                            >
                                                製作帳單
                                            </Button>
                                            <Button
                                                color="primary"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    setUploadOpen(true);
                                                }}
                                            >
                                                簽核
                                            </Button>
                                            <Button
                                                color="warning"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    setInfoBack(true);
                                                }}
                                            >
                                                退回
                                            </Button>
                                            <Button
                                                color="error"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    setInfoTerminal(true);
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

export default DraftDataList;
