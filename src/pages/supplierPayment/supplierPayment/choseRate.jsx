import { useEffect, useState, useRef } from 'react';
import { Grid, Button, Table, RadioGroup, FormControlLabel, Radio, TableCell } from '@mui/material';

// day
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import dayjs from 'dayjs';

// project import
import { BootstrapDialogTitle } from 'components/commonFunction';

// table
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

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

const ChoseRate = ({
    isRateDialogOpen,
    handleRateDialogClose,
    toPaymentDetailInfoDetail,
    // currencyExgID,
    // setCurrencyExgID,
    rateInfo,
}) => {
    const dispatch = useDispatch();
    const [tempCurrencyExgID, setTempCurrencyExgID] = useState(null);
    const tempSelectPurposeInfo = useRef({});
    const tmpSelect = useRef(null); //for Cancel

    const handleChange = (row) => {
        toPaymentDetailInfoDetail.choseCurrencyExgID = row.CurrencyExgID;
        tempSelectPurposeInfo.current = {
            BillDetailID: toPaymentDetailInfoDetail.BillDetailID,
            BillMasterID: toPaymentDetailInfoDetail.BillMasterID,
            Purpose: row.Purpose,
            ExgRate: row.ExgRate,
            ToCode: row.ToCode,
            CurrencyExgID: row.CurrencyExgID,
        };
        setTempCurrencyExgID(row.CurrencyExgID);
    };

    const handleSave = () => {
        // rateInfo.current = tempSelectPurposeInfo.current;
        const existObject = rateInfo.current.find(
            (i) =>
                i.BillDetailID === tempSelectPurposeInfo.current.BillDetailID &&
                i.BillMasterID === tempSelectPurposeInfo.current.BillMasterID,
        );
        if (existObject) {
            // 如果找到該物件，更新其 key 值
            existObject.BillDetailID = tempSelectPurposeInfo.current.BillDetailID;
            existObject.BillMasterID = tempSelectPurposeInfo.current.BillMasterID;
            existObject.Purpose = tempSelectPurposeInfo.current.Purpose;
            existObject.ExgRate = tempSelectPurposeInfo.current.ExgRate;
            existObject.ToCode = tempSelectPurposeInfo.current.ToCode;
        }
        if (!existObject && Object.keys(tempSelectPurposeInfo.current).length > 0) {
            // 如果沒有找到，新增一個物件
            rateInfo.current.push(tempSelectPurposeInfo.current);
        }
        // setCurrencyExgID(tempCurrencyExgID);
        tempSelectPurposeInfo.current = {};
        setTempCurrencyExgID(null);
        handleRateDialogClose();
    };

    useEffect(() => {
        if (isRateDialogOpen && toPaymentDetailInfoDetail.choseCurrencyExgID) {
            setTempCurrencyExgID(toPaymentDetailInfoDetail.choseCurrencyExgID);
            tmpSelect.current = toPaymentDetailInfoDetail.choseCurrencyExgID;
        }
    }, [isRateDialogOpen]);

    console.log();

    return (
        <Dialog maxWidth="md" fullWidth open={isRateDialogOpen}>
            <BootstrapDialogTitle>匯率資料</BootstrapDialogTitle>
            <DialogContent dividers>
                <Grid
                    container
                    spacing={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item md={12}>
                        <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="center"></StyledTableCell>
                                        <StyledTableCell align="center">主旨/用途</StyledTableCell>
                                        <StyledTableCell align="center">
                                            原始幣別代碼
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            兌換幣別代碼
                                        </StyledTableCell>
                                        <StyledTableCell align="center">匯率</StyledTableCell>
                                        <StyledTableCell align="center">備註</StyledTableCell>
                                        <StyledTableCell align="center">建立日期</StyledTableCell>
                                        <StyledTableCell align="center">編輯人員</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.keys(toPaymentDetailInfoDetail).length > 0 &&
                                        toPaymentDetailInfoDetail?.CurrencyExgList.map(
                                            (row, id) => {
                                                return (
                                                    <TableRow key={row.Purpose + row.ExgRate + id}>
                                                        <TableCell width="5%">
                                                            <RadioGroup
                                                                row
                                                                value={
                                                                    tempSelectPurposeInfo.current
                                                                        .CurrencyExgID ??
                                                                    tempCurrencyExgID
                                                                }
                                                                onChange={() => handleChange(row)}
                                                                sx={{ justifyContent: 'center' }}
                                                            >
                                                                <FormControlLabel
                                                                    value={row.CurrencyExgID}
                                                                    sx={{ display: 'contents' }}
                                                                    control={
                                                                        <Radio
                                                                            sx={{
                                                                                '& .MuiSvgIcon-root':
                                                                                    {
                                                                                        fontSize: {
                                                                                            xl: 18,
                                                                                        },
                                                                                    },
                                                                            }}
                                                                        />
                                                                    }
                                                                />
                                                            </RadioGroup>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {row.Purpose}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {row.FromCode}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {row.ToCode}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {row.ExgRate}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {row.Note}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {dayjs(row.CreateTime).format(
                                                                'YYYY/MM/DD',
                                                            )}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {row.Editor}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            },
                                        )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button sx={{ mr: '0.05rem' }} variant="contained" onClick={handleSave}>
                    儲存
                </Button>
                <Button
                    sx={{ mr: '0.05rem' }}
                    variant="contained"
                    onClick={() => {
                        handleRateDialogClose();
                        tempSelectPurposeInfo.current = {};
                        toPaymentDetailInfoDetail.choseCurrencyExgID = tmpSelect.current;
                    }}
                >
                    取消
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChoseRate;
