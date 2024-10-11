import { useState, useRef } from 'react';

// project import
import InvalidDataWork from './invalidDataWork';
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
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

const InvalidatedDataList = ({ dataList }) => {
    const [isViewOpen, setIsViewOpen] = useState(false); //產製帳單
    const billDetailInfo = useRef([]);

    const handleDeductedClose = () => {
        setIsViewOpen(false);
    };

    const handleViewOpen = (data) => {
        billDetailInfo.current = data;
        setIsViewOpen(true);
    };
    return (
        <>
            <InvalidDataWork
                isViewOpen={isViewOpen}
                handleDeductedClose={handleDeductedClose}
                billDetailInfo={billDetailInfo.current}
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
                            <StyledTableCell align="center">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataList?.map((row, id) => {
                            return (
                                <TableRow
                                    key={
                                        row.BillMaster?.WKMasterID + row.BillMaster?.InvoiceNo + id
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
                                        {row.data ? row.data.length : 0}
                                    </StyledTableCell>
                                    <StyledTableCell>
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

export default InvalidatedDataList;
