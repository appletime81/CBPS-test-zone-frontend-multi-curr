import { useState, useRef } from 'react';

// project import
import { handleNumber } from 'components/commonFunction';
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
} from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { alpha, styled } from '@mui/material/styles';

import dayjs from 'dayjs';

import { toBillDataapi, addInvoiceMasterInvoiceDetail } from 'components/apis.jsx';

const InvalidatedDataList = ({ listInfo, BootstrapDialogTitle, apiQuery }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const toBillDataMain = useRef();
    const [toBillDataInfo, setToBillDataInfo] = useState([]); //發票明細檔
    const [totalAmount, setTotalAmount] = useState([]); //發票總金額
    const [currentAmount, setCurrentAmount] = useState(''); //目前金額
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

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    //立帳作業
    const toBillData = (wKMasterID) => {
        console.log('立帳作業wKMasterID=>>', wKMasterID);
        let tmpQuery = '/WKMasterID=' + wKMasterID;
        tmpQuery = toBillDataapi + tmpQuery;
        console.log('tmpQuery=>>', tmpQuery);
        fetch(tmpQuery, { method: 'GET' })
            .then((res) => res.json())
            .then((data) => {
                console.log('立帳成功=>>', data);
                let tmpAmount = 0;
                if (Array.isArray(data)) {
                    toBillDataMain.current = data ? data.InvoiceMaster : [];
                    setToBillDataInfo(data ? data.InvoiceDetail : []);
                    setTotalAmount(data ? data.TotalAmount : 0);
                    data.InvoiceDetail.forEach((i) => {
                        tmpAmount = tmpAmount + i.FeeAmountPost + i.Difference;
                    });
                    setCurrentAmount(tmpAmount.toFixed(2));
                }
            })
            .catch((e) => console.log('e1=>', e));
        setIsDialogOpen(true);
    };

    const changeDiff = (diff, id) => {
        let tmpArray = toBillDataInfo.map((i) => i);
        let tmpAmount = 0;
        tmpArray[id].Difference = Number(diff);
        tmpArray.forEach((i) => {
            tmpAmount = tmpAmount + i.FeeAmountPost + i.Difference;
        });
        setToBillDataInfo(tmpArray);
        setCurrentAmount(tmpAmount.toFixed(2));
    };

    // 送出立帳(新增)
    const sendJounaryInfo = () => {
        let tmpArray = toBillDataMain.current.map((i) => i);
        tmpArray.forEach((i) => {
            delete i.InvMasterID;
        });
        let tmpData = {
            TotalAmount: totalAmount,
            InvoiceMaster: tmpArray,
            InvoiceDetail: toBillDataInfo,
        };
        fetch(addInvoiceMasterInvoiceDetail, { method: 'POST', body: JSON.stringify(tmpData) })
            .then((res) => res.json())
            .then((data) => {
                console.log('立帳成功=>>', data);
                alert('送出立帳成功');
                apiQuery();
                handleDialogClose();
            })
            .catch((e) => console.log('e1=>', e));
    };

    return (
        <TableContainer component={Paper} sx={{ maxHeight: 700 }}>
            <Table sx={{ minWidth: 300 }} stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">NO</StyledTableCell>
                        <StyledTableCell align="center">作業名稱</StyledTableCell>
                        <StyledTableCell align="center">摘要</StyledTableCell>
                        <StyledTableCell align="center">Action</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {listInfo?.map((row, id) => {
                        return (
                            <TableRow
                                key={
                                    row.InvoiceWKMaster?.WKMasterID + row.InvoiceWKMaster?.InvoiceNo
                                }
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <StyledTableCell align="center">{id + 1}</StyledTableCell>
                                <StyledTableCell align="center">
                                    {row.InvoiceWKMaster.WKMasterID}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {row.InvoiceWKMaster.InvoiceNo}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {row.InvoiceWKMaster.SupplierName}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {row.InvoiceWKMaster.SubmarineCable}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {row.InvoiceWKMaster.WorkTitle}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {dayjs(row.InvoiceWKMaster.IssueDate).format('YYYY/MM/DD')}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {row.InvoiceWKDetail.length}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {handleNumber(row.InvoiceWKMaster.TotalAmount)}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <Button
                                        color="primary"
                                        onClick={() => {
                                            toBillData(row.InvoiceWKMaster.WKMasterID);
                                        }}
                                    >
                                        立帳作業
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

export default InvalidatedDataList;
