import { useState, useRef } from 'react';

// project import
import { handleNumber } from 'components/commonFunction';
import WriteOffWork from './writeOffWork';
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

const WriteOffedDataList = ({ listInfo }) => {
    let tmpBMArray = [];
    const [isDialogOpen, setIsDialogOpen] = useState(false); //檢視
    const writeOffInfo = useRef({});
    const [writeOffDetail, setWriteOffDetail] = useState([]);

    const handleDialogClose = () => {
        writeOffInfo.current = {};
        setWriteOffDetail([]);
        setIsDialogOpen(false);
    };
    const handleDialogOpen = (info) => {
        let tmpArray = info.BillDetail.map((i) => i);
        writeOffInfo.current = info.BillMaster;
        setWriteOffDetail(tmpArray);
        setIsDialogOpen(true);
    };

    return (
        <>
            <WriteOffWork
                isDialogOpen={isDialogOpen}
                handleDialogClose={handleDialogClose}
                writeOffInfo={writeOffInfo.current}
                writeOffDetail={writeOffDetail}
                action="view"
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
                            <StyledTableCell align="center">手續費</StyledTableCell>
                            <StyledTableCell align="center">累計實收金額</StyledTableCell>
                            <StyledTableCell align="center">總金額</StyledTableCell>
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
                                <TableRow
                                    key={
                                        row.BillMaster?.BillingNo +
                                        row.BillMaster?.FeeAmountSum +
                                        id
                                    }
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <StyledTableCell align="center">{id + 1}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.BillMaster.SubmarineCable}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.BillMaster.WorkTitle}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {tmpBMArray.join(',')}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.BillMaster.PartyName}
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
                                        {row.BillDetail?.length}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {handleNumber(row.BillMaster?.BankFees)}{' '}
                                        {row.BillMaster?.Code}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {handleNumber(row.BillMaster?.ReceivedAmountSum)}{' '}
                                        {row.BillMaster?.Code}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {handleNumber(row.BillMaster?.FeeAmountSum)}{' '}
                                        {row.BillMaster?.Code}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                '& button': {
                                                    mx: { sm: 0.3, md: 0.3, lg: 0.6, xl: 1.5 },
                                                    p: 0,
                                                },
                                            }}
                                        >
                                            <Button
                                                color="success"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    handleDialogOpen(row);
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

export default WriteOffedDataList;
