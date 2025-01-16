import { useState, useRef } from 'react';

// project import
import DeductedWork from './deductedWork';
import GenerateBack from './generateBack';
import SignAndUpload from './signAndUpload';
import BillDraftMake from './billDraftMake';
// material-ui
import { Button, Table, Box, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import dayjs from 'dayjs';

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

const DeductedDataList = ({ dataList, receivableQuery }) => {
    const billMaster = useRef({});
    const [isDialogOpen, setIsDialogOpen] = useState(false); //產製帳單
    const [isDeductedWorkOpen, setIsDeductedWorkOpen] = useState(false); //產製帳單
    const [isUploadOpen, setIsUploadOpen] = useState(false); //簽核
    const [infoBack, setInfoBack] = useState(false); //退回
    const billMasterID = useRef(-1);
    const billDetailInfo = useRef([]);
    const editBillingNo = useRef('');
    const editBillMasterID = useRef('');
    const tmpBMArray = useRef([]);

    const handleDeductedOpen = (data) => {
        billDetailInfo.current = data;
        setIsDeductedWorkOpen(true);
    };

    const handleDeductedClose = () => {
        setIsDeductedWorkOpen(false);
    };

    const handleDialogOpen = (info, data) => {
        let bMArray = [];
        data.forEach((i) => {
            if (!bMArray.includes(i.BillDetail.BillMilestone)) {
                bMArray.push(i.BillDetail.BillMilestone);
            }
        });
        console.log('info=>>', info.BillMasterID);
        tmpBMArray.current = bMArray;
        billMasterID.current = info.BillMasterID;
        billMaster.current = info;
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        billMasterID.current = -1;
        billMaster.current = {};
    };

    const handleUploadOpen = (info) => {
        billMasterID.current = info.BillMasterID;
        setIsUploadOpen(true);
    };

    const handleUploadClose = () => {
        setIsUploadOpen(false);
        billMasterID.current = -1;
    };

    const handleBackClose = () => {
        setInfoBack(false);
        editBillingNo.current = '';
        editBillMasterID.current = '';
    };

    const handleInfoBack = (no, id) => {
        editBillingNo.current = no;
        editBillMasterID.current = id;
        setInfoBack(true);
    };

    return (
        <>
            <DeductedWork isDeductedWorkOpen={isDeductedWorkOpen} handleDeductedClose={handleDeductedClose} billDetailInfo={billDetailInfo.current} />
            <GenerateBack
                action={'deducted'}
                infoBack={infoBack}
                handleBackClose={handleBackClose}
                receivableQuery={receivableQuery}
                editBillingNo={editBillingNo.current}
                editBillMasterID={editBillMasterID.current}
            />
            <BillDraftMake
                isDialogOpen={isDialogOpen}
                handleDialogClose={handleDialogClose}
                billMasterID={billMasterID.current}
                pONo={billMaster.current.PONo}
                submarineCableName={billMaster.current.SubmarineCable}
                billingNo={billMaster.current.current}
                issueDateDefault={billMaster.current.IssueDate}
                dueDateDefault={billMaster.current.DueDate}
                code={billMaster.current.Code}
                action={'deducted'}
                tmpBMArray={tmpBMArray.current}
                workTitle={billMaster.current.WorkTitle}
            />
            <SignAndUpload isUploadOpen={isUploadOpen} handleUploadClose={handleUploadClose} billMasterID={billMasterID.current} receivableQuery={receivableQuery} />
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
                            <StyledTableCell align="center">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataList?.map((row, id) => {
                            return (
                                <TableRow key={row.BillMaster.BillMasterID + row.BillMaster.BillingNo + id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <StyledTableCell align="center">{id + 1}</StyledTableCell>
                                    <StyledTableCell align="center">{row.BillMaster.PartyName}</StyledTableCell>
                                    <StyledTableCell align="center">{row.BillMaster.SubmarineCable}</StyledTableCell>
                                    <StyledTableCell align="center">{row.BillMaster.WorkTitle}</StyledTableCell>
                                    <StyledTableCell align="center">{row.BillMaster.BillingNo}</StyledTableCell>
                                    <StyledTableCell align="center">{dayjs(row.BillMaster.IssueDate).format('YYYY/MM/DD')}</StyledTableCell>
                                    <StyledTableCell align="center">{dayjs(row.BillMaster.DueDate).format('YYYY/MM/DD')}</StyledTableCell>
                                    <StyledTableCell align="center">{row.data ? row.data.length : 0}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                '& button': { mx: 0.2, p: 0 }
                                            }}
                                        >
                                            <Button
                                                color="success"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    handleDeductedOpen(row.data);
                                                }}
                                            >
                                                檢視
                                            </Button>
                                            <Button
                                                color="primary"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    handleDialogOpen(row.BillMaster, row.data);
                                                }}
                                            >
                                                產製帳單
                                            </Button>
                                            <Button
                                                color="info"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    handleUploadOpen({
                                                        BillMasterID: row.BillMaster.BillMasterID
                                                    });
                                                }}
                                            >
                                                簽核上傳
                                            </Button>
                                            <Button
                                                color="warning"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    handleInfoBack(row.BillMaster.BillingNo, row.BillMaster.BillMasterID);
                                                }}
                                            >
                                                退回
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

export default DeductedDataList;
