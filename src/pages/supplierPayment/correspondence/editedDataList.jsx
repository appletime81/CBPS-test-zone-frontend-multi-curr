import { useState, useRef } from 'react';

// project import
import { handleNumber, BootstrapDialogTitle } from 'components/commonFunction';
import CorrespondenceQuery from './correspondenceQuery';
import MainCard from 'components/MainCard';
import CorrespondenceMake from './correspondenceMake';
// material-ui
import {
    Typography,
    Button,
    Table,
    Dialog,
    DialogContent,
    DialogContentText,
    Grid,
    FormControl,
    InputLabel,
    Select,
    DialogActions,
    TextField,
    Box,
} from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import dayjs from 'dayjs';

import { getPayDraftStream } from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

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

const EditedDataList = ({ listInfo }) => {
    const dispatch = useDispatch();
    const handleDownload = (id) => {
        let tmpArray = {
            PayDraftID: id,
            DownloadTemplate: true,
        };
        fetch(getPayDraftStream, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
            },
            body: JSON.stringify(tmpArray),
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
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error('handleDownload error:', error);
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'error',
                            message: '尚未上傳檔案',
                        },
                    }),
                );
                // 处理错误
            });
    };

    return (
        <TableContainer component={Paper} sx={{ maxHeight: window.screen.height * 0.45 }}>
            <Table sx={{ minWidth: 300 }} stickyHeader>
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">供應商</StyledTableCell>
                        <StyledTableCell align="center">發票號碼</StyledTableCell>
                        <StyledTableCell align="center">海纜名稱</StyledTableCell>
                        <StyledTableCell align="center">海纜作業</StyledTableCell>
                        <StyledTableCell align="center">匯款總金額</StyledTableCell>
                        <StyledTableCell align="center">Action</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {listInfo.map((row) => {
                        return (
                            <TableRow
                                key={row?.PayDraftID + row?.PayMID}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <StyledTableCell align="center">{row?.Payee}</StyledTableCell>
                                <StyledTableCell align="center">{row?.InvoiceNo}</StyledTableCell>
                                <StyledTableCell align="center">
                                    {row?.SubmarineCable}
                                </StyledTableCell>
                                <StyledTableCell align="center">{row?.WorkTitle}</StyledTableCell>
                                <StyledTableCell align="center">
                                    {row?.TotalFeeAmount} {row?.PayCode}
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
                                                handleDownload(row?.PayDraftID);
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
    );
};

export default EditedDataList;
