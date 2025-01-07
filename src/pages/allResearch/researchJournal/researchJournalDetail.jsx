import { Table } from '@mui/material';

// project import
import { handleNumber } from 'components/commonFunction';
import dayjs from 'dayjs';

// table
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

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

const ResearchBillDetail = ({ datailInfo }) => {
    return (
        <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
            <Table sx={{ minWidth: 300 }} stickyHeader>
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">費用項目</StyledTableCell>
                        <StyledTableCell align="center">費用金額</StyledTableCell>
                        <StyledTableCell align="center">會員</StyledTableCell>
                        <StyledTableCell align="center">攤分比例</StyledTableCell>
                        <StyledTableCell align="center">攤分後金額</StyledTableCell>
                        <StyledTableCell align="center">調整尾差值</StyledTableCell>
                        <StyledTableCell align="center">總費用金額</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {datailInfo?.map((row, id) => {
                        return (
                            <TableRow
                                key={row.CBType + id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <StyledTableCell align="center">{row.CBType}</StyledTableCell>
                                <StyledTableCell align="center">{row.PartyName}</StyledTableCell>
                                <StyledTableCell align="center">{row.BillingNo}</StyledTableCell>
                                <StyledTableCell align="center">{row.WorkTitle}</StyledTableCell>
                                <StyledTableCell align="center">
                                    {handleNumber(row.CurrAmount)}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {dayjs(row.CreateDate).format('YYYY/MM/DD')}
                                </StyledTableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ResearchBillDetail;
