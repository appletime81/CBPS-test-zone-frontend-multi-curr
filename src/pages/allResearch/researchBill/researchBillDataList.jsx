// import { useState } from 'react';

// project import
import { handleNumber } from 'components/commonFunction';
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
}));

const ResearchBillDataList = ({ listInfo, setDetailInfo }) => {
    return (
        <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
            <Table sx={{ minWidth: 300 }} stickyHeader>
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">NO</StyledTableCell>
                        <StyledTableCell align="center">發票號碼</StyledTableCell>
                        <StyledTableCell align="center">供應商</StyledTableCell>
                        <StyledTableCell align="center">海纜名稱</StyledTableCell>
                        <StyledTableCell align="center">海纜作業</StyledTableCell>
                        <StyledTableCell align="center">計帳段號</StyledTableCell>
                        <StyledTableCell align="center">發票到期日</StyledTableCell>
                        <StyledTableCell align="center">總金額</StyledTableCell>
                        <StyledTableCell align="center">累計實付金額</StyledTableCell>
                        <StyledTableCell align="center">累計減項金額</StyledTableCell>
                        <StyledTableCell align="center">幣別</StyledTableCell>
                        <StyledTableCell align="center">Action</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {listInfo?.map((row, id) => {
                        return (
                            <TableRow
                                key={row.InvoiceWKMaster.InvoiceNo + id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <StyledTableCell align="center">{id + 1}</StyledTableCell>
                                <StyledTableCell align="center">
                                    {row.InvoiceWKMaster?.InvoiceNo}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {row.InvoiceWKMaster?.SupplierName}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {row.InvoiceWKMaster?.SubmarineCable}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {row.InvoiceWKMaster?.WorkTitle}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {row.InvoiceWKMaster?.BillMilestone}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {dayjs(row.InvoiceWKMaster.DueDate).format('YYYY/MM/DD')}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {handleNumber(row.InvoiceWKMaster.TotalAmount)}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {handleNumber(row.InvoiceWKMaster.PaidAmount)}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {handleNumber(row.InvoiceWKMaster.DedAmount)}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {row.InvoiceWKMaster?.Code}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            '& button': { mx: { md: 0.3, lg: 0.7, xl: 1.5 }, p: 0 },
                                        }}
                                    >
                                        <Button
                                            color="primary"
                                            variant="outlined"
                                            onClick={() => {
                                                setDetailInfo(row.BillMaster);
                                            }}
                                        >
                                            檢視帳單
                                        </Button>
                                    </Box>
                                </StyledTableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ResearchBillDataList;
