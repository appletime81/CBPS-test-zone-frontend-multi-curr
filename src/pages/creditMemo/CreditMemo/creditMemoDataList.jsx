import { useState, useRef } from 'react';

// material-ui
import { Button, Table, Grid, Box } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import CreditMemoUpload from './creditMemoUpload';

import { getCreditMemoStreamApi, downloadCreditMemoApi } from 'components/apis.jsx';

// import CreditBalanceView from './CreditMemoView';
// import CreditBalanceTerminate from './CreditMemoTerminate';
import { useDispatch } from 'react-redux';
import { setMessageStateOpen, setIsLoading } from 'store/reducers/dropdown';
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

const CreditBalanceDataList = ({ listInfo }) => {
    const dispatch = useDispatch();
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const itemID = useRef(-1);
    const handleUploadOpen = (id) => {
        itemID.current = id;
        setIsUploadOpen(true);
    };

    const handleUploadClose = () => {
        setIsUploadOpen(false);
    };

    const getCreditMemo = (id) => {
        let tmpObject = { CMID: id };
        fetch(getCreditMemoStreamApi, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            },
            body: JSON.stringify(tmpObject)
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }

                // 解析 content-disposition 来获取文件名
                const contentDisposition = res.headers.get('content-disposition');
                let filename = 'default.pdf'; // 默认文件名
                if (contentDisposition.includes("filename*=utf-8''")) {
                    const filenameEncoded = contentDisposition.split("filename*=utf-8''")[1];
                    filename = decodeURIComponent(filenameEncoded);
                } else {
                    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                    if (filenameMatch && filenameMatch[1]) {
                        filename = filenameMatch[1];
                    }
                }

                return res.blob().then((blob) => ({ blob, filename }));
            })
            .then(({ blob, filename }) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                dispatch(setIsLoading({ isLoading: false }));
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error('handleDownload error:', error);
                dispatch(setIsLoading({ isLoading: false }));
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'error',
                            message: '產製失敗'
                        }
                    })
                );
                // 处理错误
            });
    };

    const handleDownload = (id) => {
        const tmpApi = `${downloadCreditMemoApi}/${id}`;
        dispatch(setIsLoading({ isLoading: true }));
        console.log('tmpApi=>>', tmpApi);
        fetch(tmpApi, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }

                // 解析 content-disposition 来获取文件名
                const contentDisposition = res.headers.get('content-disposition');
                let filename = 'default.pdf'; // 默认文件名
                if (contentDisposition.includes("filename*=utf-8''")) {
                    const filenameEncoded = contentDisposition.split("filename*=utf-8''")[1];
                    filename = decodeURIComponent(filenameEncoded);
                } else {
                    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                    if (filenameMatch && filenameMatch[1]) {
                        filename = filenameMatch[1];
                    }
                }

                return res.blob().then((blob) => ({ blob, filename }));
            })
            .then(({ blob, filename }) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                dispatch(setIsLoading({ isLoading: false }));
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error('handleDownload error:', error);
                dispatch(setIsLoading({ isLoading: false }));
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'error',
                            message: '尚未上傳檔案'
                        }
                    })
                );
                // 处理错误
            });
    };

    return (
        <>
            <CreditMemoUpload isUploadOpen={isUploadOpen} handleUploadClose={handleUploadClose} itemID={itemID.current} />
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                        <Table sx={{ minWidth: 300 }} stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">NO</StyledTableCell>
                                    <StyledTableCell align="center">CM號碼</StyledTableCell>
                                    <StyledTableCell align="center">海纜名稱</StyledTableCell>
                                    <StyledTableCell align="center">海纜作業</StyledTableCell>
                                    <StyledTableCell align="center">會員</StyledTableCell>
                                    <StyledTableCell align="center">開立日期</StyledTableCell>
                                    <StyledTableCell align="center">摘要說明</StyledTableCell>
                                    <StyledTableCell align="center">Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {listInfo?.map((row, id) => {
                                    return (
                                        <TableRow
                                            key={row.CNNo + id}
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 }
                                            }}
                                        >
                                            <StyledTableCell align="center">{id + 1}</StyledTableCell>
                                            <StyledTableCell align="center">{row.CMNo}</StyledTableCell>
                                            <StyledTableCell align="center">{row.SubmarineCable}</StyledTableCell>
                                            <StyledTableCell align="center">{row.WorkTitle}</StyledTableCell>
                                            <StyledTableCell align="center">{row.PartyName}</StyledTableCell>
                                            <StyledTableCell align="center">{dayjs(row.LastIssueDate).format('YYYY/MM/DD')}</StyledTableCell>
                                            <StyledTableCell align="center">{row.Note}</StyledTableCell>
                                            <StyledTableCell align="center">
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        '& button': {
                                                            mx: {
                                                                sm: 0.2,
                                                                md: 0.2,
                                                                lg: 0.2,
                                                                xl: 1
                                                            },
                                                            p: 0
                                                        }
                                                    }}
                                                >
                                                    <Button
                                                        color="success"
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => {
                                                            getCreditMemo(row.CMID);
                                                        }}
                                                    >
                                                        產製
                                                    </Button>
                                                    <Button
                                                        color="primary"
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => {
                                                            handleUploadOpen(row.CMID);
                                                        }}
                                                    >
                                                        上傳
                                                    </Button>
                                                    <Button
                                                        color="info"
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => {
                                                            handleDownload(row.CMID);
                                                        }}
                                                    >
                                                        下載
                                                    </Button>
                                                </Box>
                                            </StyledTableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </>
    );
};

export default CreditBalanceDataList;
