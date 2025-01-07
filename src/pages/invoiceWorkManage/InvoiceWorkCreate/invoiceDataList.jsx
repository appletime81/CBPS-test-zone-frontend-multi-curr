// project import
import { handleNumber } from 'components/commonFunction';

// material-ui
import { Button, Table } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

const InvoiceDataList = ({ listInfo, setEditItem, deletelistInfoItem }) => {
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

    return (
        <TableContainer component={Paper} sx={{ maxHeight: window.screen.height * 0.5 }}>
            <Table sx={{ minWidth: 300 }} stickyHeader>
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">發票號碼</StyledTableCell>
                        <StyledTableCell align="center">供應商</StyledTableCell>
                        <StyledTableCell align="center">海纜名稱</StyledTableCell>
                        <StyledTableCell align="center">合約種類</StyledTableCell>
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
                                    {row.InvoiceWKMaster?.ContractType}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {dayjs(row.InvoiceWKMaster?.IssueDate).format('YYYY/MM/DD')}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {row.InvoiceWKDetail.length}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {handleNumber(row.InvoiceWKMaster.TotalAmount)}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {row.InvoiceWKMaster.Code}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {row.InvoiceWKMaster.TotalAmount *
                                        (row.InvoiceWKMaster.ExgRate || 1)}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {row.InvoiceWKMaster.ToCode || row.InvoiceWKMaster.Code}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <Button
                                        color="primary"
                                        onClick={() => {
                                            setEditItem(id);
                                        }}
                                    >
                                        編輯
                                    </Button>
                                    <Button
                                        color="error"
                                        onClick={() => {
                                            deletelistInfoItem(id);
                                        }}
                                    >
                                        刪除
                                    </Button>
                                </StyledTableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default InvoiceDataList;
