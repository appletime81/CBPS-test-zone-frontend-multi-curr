import { useRef, useState } from 'react';

// project import
import { handleNumber } from 'components/commonFunction';
import CorrespondenceMake from './correspondenceMake';
import PayDraftUpload from './payDraftUpload';

// material-ui
import { Table, Box, Button } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

// api
import { updatePayDraft } from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
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

const CreditBalanceDataList = ({ listInfo }) => {
    const dispatch = useDispatch();
    const payDraftID = useRef(-1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false); //上傳函稿
    // const payDraftID = useRef(-1);
    const handleDialogOpen = (id) => {
        payDraftID.current = id;
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        payDraftID.current = -1;
    };

    const handleUploadClose = () => {
        setIsUploadOpen(false);
        payDraftID.current = -1;
    };

    const handleUploadOpen = (id) => {
        payDraftID.current = id;
        setIsUploadOpen(true);
    };

    const handleComplete = (id) => {
        let tmpArray = {
            PayDraftID: id,
            Status: 'COMPLETE',
        };
        fetch(updatePayDraft, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
            },
            body: JSON.stringify(tmpArray),
        })
            .then((res) => res.json())
            .then((data) => {
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'success',
                            message: '完成函稿成功',
                        },
                    }),
                );
            })
            .catch(() => {
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'error',
                            message: '網路異常，請檢查網路連線或與系統窗口聯絡',
                        },
                    }),
                );
            });
    };

    return (
        <>
            <CorrespondenceMake
                isDialogOpen={isDialogOpen}
                payDraftID={payDraftID.current}
                handleDialogClose={handleDialogClose}
            />
            <PayDraftUpload
                isUploadOpen={isUploadOpen}
                handleUploadClose={handleUploadClose}
                payDraftID={payDraftID.current}
            />
            <TableContainer component={Paper} sx={{ maxHeight: window.screen.height * 0.45 }}>
                <Table sx={{ minWidth: 300 }} stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">NO</StyledTableCell>
                            <StyledTableCell align="center">會員</StyledTableCell>
                            <StyledTableCell align="center">海纜名稱</StyledTableCell>
                            <StyledTableCell align="center">海纜作業</StyledTableCell>
                            <StyledTableCell align="center">匯款總金額</StyledTableCell>
                            <StyledTableCell align="center">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listInfo?.map((row, id) => {
                            return (
                                <TableRow
                                    key={row.CBID + id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <StyledTableCell align="center">{id + 1}</StyledTableCell>
                                    <StyledTableCell align="center">{row.Payee}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.SubmarineCable}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.WorkTitle}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{`$${handleNumber(
                                        row.TotalFeeAmount,
                                    )}`}</StyledTableCell>
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
                                                color="primary"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    handleDialogOpen(row?.PayDraftID);
                                                }}
                                            >
                                                產製
                                            </Button>
                                            <Button
                                                color="success"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    handleUploadOpen(row?.PayDraftID);
                                                }}
                                            >
                                                上傳
                                            </Button>
                                            <Button
                                                color="warning"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    handleComplete(row?.PayDraftID);
                                                }}
                                            >
                                                確認完成函稿
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

export default CreditBalanceDataList;
