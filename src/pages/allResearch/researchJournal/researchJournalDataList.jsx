// import { useState } from 'react';

// project import
import { handleNumber } from 'components/commonFunction';
// material-ui
import { Typography, Button, Table, Box } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

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

const ResearchBillDataList = ({ listInfo, setIsDetailShow }) => {
    const [cbView, setCbview] = useState(false);
    const [cbTerminal, setCbTerminal] = useState(false);
    const viewId = useRef(-1);

    const handleViewClose = () => {
        setCbview(false);
        viewId.current = -1;
    };

    const handleTerminalClose = () => {
        setCbTerminal(false);
    };

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
                        <StyledTableCell align="center">發票到期日</StyledTableCell>
                        <StyledTableCell align="center">總金額</StyledTableCell>
                        <StyledTableCell align="center">累計實收金額</StyledTableCell>
                        <StyledTableCell align="center">累計實付金額</StyledTableCell>
                        <StyledTableCell align="center">累計減項金額</StyledTableCell>
                        <StyledTableCell align="center">Action</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {listInfo?.map((row, id) => {
                        return (
                            <TableRow
                                key={row.CBType + id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <StyledTableCell align="center">{id + 1}</StyledTableCell>
                                <StyledTableCell align="center">{row.CBType}</StyledTableCell>
                                <StyledTableCell align="center">{row.PartyName}</StyledTableCell>
                                <StyledTableCell align="center">{row.InvoiceNo}</StyledTableCell>
                                <StyledTableCell align="center">{row.WorkTitle}</StyledTableCell>
                                <StyledTableCell align="center">{`$${handleNumber(
                                    row.CurrAmount,
                                )}`}</StyledTableCell>
                                <StyledTableCell align="center">
                                    {dayjs(row.CreateDate).format('YYYY/MM/DD')}
                                </StyledTableCell>
                                <StyledTableCell align="center">{row.Note}</StyledTableCell>
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
                                                setCbview(true);
                                                viewId.current = row.CBID;
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
