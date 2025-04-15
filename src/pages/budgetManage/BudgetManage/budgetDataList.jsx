// project import
import BudgeTerminate from './budgetTerminate';

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
import { useRef, useState } from 'react';

const BudgetDataList = ({ listInfo, setDialogAction, setIsDialogOpen, setDataDetail, budgetQuery }) => {
    const [dialogTerminate, setDialogTerminate] = useState(false);
    const [terminateInfo, setTerminateInfo] = useState({});
    const actionName = useRef('');

    const handleDialogOpen = (action) => {
        actionName.current = action;
        setDialogTerminate(true);
    };

    const handleDialogClose = () => {
        setDialogTerminate(false);
    };

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

    return (
        <>
            <TableContainer component={Paper} sx={{ maxHeight: window.screen.height * 0.5 }}>
                <Table sx={{ minWidth: 300 }} stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">海纜名稱</StyledTableCell>
                            <StyledTableCell align="center">海纜作業</StyledTableCell>
                            <StyledTableCell align="center">年度</StyledTableCell>
                            {/* <StyledTableCell align="center">項目序號</StyledTableCell>
                            <StyledTableCell align="center">項目名稱</StyledTableCell>
                            <StyledTableCell align="center">幣別</StyledTableCell>
                            <StyledTableCell align="center">項目金額</StyledTableCell>
                            <StyledTableCell align="center">備註</StyledTableCell> */}
                            <StyledTableCell align="center">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listInfo?.map((row, id) => {
                            return (
                                <TableRow key={row.SubmarineCable + row.LBRatio + id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <StyledTableCell align="center">{row.SubmarineCable}</StyledTableCell>
                                    <StyledTableCell align="center">{row.WorkTitle}</StyledTableCell>
                                    <StyledTableCell align="center">{row.budget_year}</StyledTableCell>
                                    {/* <StyledTableCell align="center">{row.budget_fee_item_seq}</StyledTableCell>
                                    <StyledTableCell align="center">{row.budget_fee_item_name}</StyledTableCell>
                                    <StyledTableCell align="center">{row.Code}</StyledTableCell>
                                    <StyledTableCell align="center">{row.budget_fee_amount}</StyledTableCell>
                                    <StyledTableCell align="center">{row.remark}</StyledTableCell> */}
                                    <StyledTableCell align="center">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                '& button': {
                                                    mx: { sm: 0.3, md: 0.3, lg: 0.6, xl: 1.5 },
                                                    p: 0
                                                }
                                            }}
                                        >
                                            <Button
                                                color="primary"
                                                variant="outlined"
                                                onClick={() => {
                                                    setDialogAction('View');
                                                    setDataDetail(row.data);
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                檢視
                                            </Button>
                                            {row.EndDate ? null : (
                                                <Button
                                                    color="success"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        setDialogAction('Edit');
                                                        setDataDetail(row.data);
                                                        setIsDialogOpen(true);
                                                    }}
                                                >
                                                    編輯
                                                </Button>
                                            )}
                                            {row.EndDate ? null : (
                                                <Button
                                                    color="warning"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        handleDialogOpen('stop');
                                                        setTerminateInfo({
                                                            BillMilestone: row.BillMilestone,
                                                            PartyName: row.PartyName,
                                                            LBRawID: row.LBRawID,
                                                            EndDate: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
                                                        });
                                                    }}
                                                >
                                                    停用
                                                </Button>
                                            )}
                                            {row.EndDate ? null : (
                                                <Button
                                                    color="error"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        handleDialogOpen('terminate');
                                                        setTerminateInfo({
                                                            BillMilestone: row.BillMilestone,
                                                            PartyName: row.PartyName,
                                                            LBRawID: row.LBRawID,
                                                            EndDate: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
                                                        });
                                                    }}
                                                >
                                                    刪除
                                                </Button>
                                            )}
                                        </Box>
                                    </StyledTableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <BudgeTerminate
                dialogTerminate={dialogTerminate}
                handleDialogClose={handleDialogClose}
                actionName={actionName.current}
                budgetQuery={budgetQuery}
                terminateInfo={terminateInfo}
            />
        </>
    );
};

export default BudgetDataList;
