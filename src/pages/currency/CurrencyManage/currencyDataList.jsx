// import { useState } from 'react';

// project import
import CurrencyTerminate from './currencyTerminate';

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
import { useState } from 'react';
import { useDispatch } from 'react-redux';

const CurrencyDataList = ({
    listInfo,
    setDialogAction,
    setIsAddCurrencyOpen,
    setEditItem,
    currencyQuery,
}) => {
    const [dialogTerminate, setDialogTerminate] = useState(false);
    const [terminateInfo, setTerminateInfo] = useState();
    const dispatch = useDispatch();

    const handleDialogClose = () => {
        setDialogTerminate(false);
    };

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
        <>
            <TableContainer component={Paper} sx={{ maxHeight: window.screen.height * 0.5 }}>
                <Table sx={{ minWidth: 300 }} stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">海纜名稱</StyledTableCell>
                            <StyledTableCell align="center">海纜作業</StyledTableCell>
                            <StyledTableCell align="center">出帳年月</StyledTableCell>
                            <StyledTableCell align="center">主旨/用途</StyledTableCell>
                            <StyledTableCell align="center">原始幣別代碼</StyledTableCell>
                            <StyledTableCell align="center">兌換幣別代碼</StyledTableCell>
                            <StyledTableCell align="center">匯率</StyledTableCell>
                            <StyledTableCell align="center">備註</StyledTableCell>
                            <StyledTableCell align="center">編輯人員</StyledTableCell>
                            <StyledTableCell align="center">建立日期</StyledTableCell>
                            <StyledTableCell align="center">終止日期</StyledTableCell>
                            <StyledTableCell align="center">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listInfo?.map((row, id) => {
                            return (
                                <TableRow
                                    key={row.SubmarineCable + row.CurrencyExgID + id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <StyledTableCell align="center">
                                        {row.SubmarineCable}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.WorkTitle}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.BillYM ? dayjs(row.BillYM).format('YYYY/MM') : ''}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{row.Purpose}</StyledTableCell>
                                    <StyledTableCell align="center">{row.FromCode}</StyledTableCell>
                                    <StyledTableCell align="center">{row.ToCode}</StyledTableCell>
                                    <StyledTableCell align="center">{row.ExgRate}</StyledTableCell>
                                    <StyledTableCell align="center">{row.Note}</StyledTableCell>
                                    <StyledTableCell align="center">{row.Editor}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.CreateTime
                                            ? dayjs(row.CreateTime).format('YYYY/MM/DD')
                                            : null}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.EndTime ? dayjs(row.EndTime).format('YYYY/MM/DD') : ''}
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
                                            {row.EndTime ? null : (
                                                <Button
                                                    color="primary"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        setDialogAction('Edit');
                                                        setIsAddCurrencyOpen(true);
                                                        setEditItem(row);
                                                    }}
                                                >
                                                    編輯
                                                </Button>
                                            )}
                                            {row.EndTime ? null : (
                                                <Button
                                                    color="error"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        setDialogTerminate(true);
                                                        setTerminateInfo(row.CurrencyExgID);
                                                    }}
                                                >
                                                    終止
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
            <CurrencyTerminate
                dialogTerminate={dialogTerminate}
                handleDialogClose={handleDialogClose}
                terminateInfo={terminateInfo}
                currencyQuery={currencyQuery}
            />
        </>
    );
};

export default CurrencyDataList;
