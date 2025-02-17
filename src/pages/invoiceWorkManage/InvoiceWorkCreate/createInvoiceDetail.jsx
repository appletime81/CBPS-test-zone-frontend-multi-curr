import { useEffect, useState, useRef } from 'react';

// project import
import MainCard from 'components/MainCard';
import { TextField } from '@mui/material/index';
import NumericFormatCustom from 'components/numericFormatCustom';
import { handleNumber } from 'components/commonFunction';

// material-ui
import { Typography, Grid, FormControl, InputLabel, Select, MenuItem, Button, Table } from '@mui/material';
import { StyledEngineProvider, CssVarsProvider } from '@mui/joy/styles';
import Textarea from '@mui/joy/Textarea';

// table
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const CreateInvoiceDetail = ({
    invoiceDetailInfo,
    setInvoiceDetailInfo,
    bmStoneList,
    itemDetailInitial,
    billMilestone,
    setBillMilestone,
    feeItem,
    setFeeItem,
    feeAmount,
    setFeeAmount,
    isTax
}) => {
    const [isEdit, setIsEdit] = useState(false);
    const editItem = useRef(0);
    const dispatch = useDispatch();

    const createData = (FeeItem, BillMilestone, IsTax, FeeAmount) => {
        return { FeeItem, BillMilestone, IsTax, FeeAmount };
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

    const infoCheck = () => {
        if (billMilestone === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入計帳段號'
                    }
                })
            );
            return false;
        }
        if (feeItem.trim() === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入費用項目'
                    }
                })
            );
            return false;
        }
        if (feeAmount === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入費用金額'
                    }
                })
            );
            return false;
        }
        return true;
    };

    // 新增
    const itemDetailAdd = () => {
        if (infoCheck()) {
            let tmpArray = invoiceDetailInfo.map((i) => i);
            tmpArray.push(createData(feeItem.trim(), billMilestone, 0, feeAmount));
            // tmpArray.reverse();
            setInvoiceDetailInfo([...tmpArray]);
            itemDetailInitial();
        }
    };

    //刪除
    const itemDetailDelete = (id) => {
        let tmpArray = invoiceDetailInfo.map((i) => i);
        tmpArray.splice(id, 1);
        setInvoiceDetailInfo([...tmpArray]);
    };

    //編輯
    const itemDetailEdit = (id) => {
        setIsEdit(true);
        editItem.current = id;
        let tmpArray = invoiceDetailInfo[id];
        setBillMilestone(tmpArray.BillMilestone);
        setFeeItem(tmpArray.FeeItem);
        setFeeAmount(tmpArray.FeeAmount);
        isTax.current = tmpArray.IsTax;
    };

    //儲存編輯
    const itemDetailSave = () => {
        if (infoCheck()) {
            setIsEdit(false);
            let tmpArray = invoiceDetailInfo.map((i) => i);
            tmpArray.splice(editItem.current, 1);
            tmpArray.push(createData(feeItem, billMilestone, isTax.current, feeAmount));
            tmpArray.reverse();
            setInvoiceDetailInfo([...tmpArray]);
            itemDetailInitial();
            editItem.current = 0;
        }
    };

    //取消編輯
    const itemDetailCancel = () => {
        itemDetailInitial();
        setIsEdit(false);
    };

    //複製變成稅
    const copyTax = (info) => {
        let tmpArray = invoiceDetailInfo.map((i) => i);
        console.log(info);
        tmpArray.push(createData('(tax)' + info.FeeItem.trim(), info.BillMilestone, 1, Number(info.FeeAmount / 10)));
        // tmpArray.reverse();
        setInvoiceDetailInfo([...tmpArray]);
        itemDetailInitial();
        console.log(info);
    };

    useEffect(() => {
        itemDetailInitial();
    }, []);

    return (
        <MainCard title="發票工作明細檔建立" sx={{ height: '100%' }}>
            <Grid container display="flex" justifyContent="center" alignItems="center" spacing={1}>
                {/* row1 */}
                <Grid item sm={6} md={2} lg={2}>
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' }
                        }}
                    >
                        計帳段號：
                    </Typography>
                </Grid>
                <Grid item sm={6} md={4} lg={4}>
                    <FormControl fullWidth>
                        <InputLabel>選擇計帳段號</InputLabel>
                        <Select value={billMilestone} label="計帳段號" size="small" onChange={(e) => setBillMilestone(e.target.value)}>
                            {bmStoneList.map((i) => (
                                <MenuItem key={i} value={i}>
                                    {i}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item sm={6} md={2} lg={2}>
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' }
                        }}
                    >
                        費用金額：
                    </Typography>
                </Grid>
                <Grid item sm={6} md={4} lg={4}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={feeAmount}
                        size="small"
                        label="填寫費用金額(限制包含小數點16位數)"
                        InputProps={{
                            inputComponent: NumericFormatCustom
                        }}
                        onChange={(e) => {
                            if (e.target.value.length <= 16) {
                                setFeeAmount(e.target.value);
                            }
                        }}
                    />
                </Grid>
                {/* row2 */}
                <Grid item sm={6} md={2} lg={2}>
                    <Typography
                        variant="h5"
                        size="small"
                        align="center"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' }
                        }}
                    >
                        費用項目：
                    </Typography>
                </Grid>
                <Grid item sm={6} md={10} lg={10}>
                    <StyledEngineProvider injectFirst>
                        <CssVarsProvider>
                            <Textarea required value={feeItem} placeholder="填寫費用項目" minRows={2} maxRows={2} onChange={(e) => setFeeItem(e.target.value)} />
                        </CssVarsProvider>
                    </StyledEngineProvider>
                </Grid>
                {/* row3 */}
                <Grid item sm={12} md={12} lg={12} display="flex" justifyContent="end" alignItems="center">
                    {isEdit ? (
                        <Button size="small" sx={{ mr: '0.25rem' }} variant="contained" onClick={itemDetailSave}>
                            儲存
                        </Button>
                    ) : (
                        <Button size="small" sx={{ mr: '0.25rem' }} variant="contained" onClick={itemDetailAdd}>
                            新增
                        </Button>
                    )}
                    {isEdit ? (
                        <Button size="small" sx={{ ml: '0.25rem' }} variant="contained" onClick={itemDetailCancel}>
                            關閉
                        </Button>
                    ) : (
                        <Button size="small" sx={{ ml: '0.25rem' }} variant="contained" onClick={itemDetailInitial}>
                            清除
                        </Button>
                    )}
                </Grid>
                <Grid item md={12}>
                    <TableContainer component={Paper} sx={{ maxHeight: { lg: 200, md: 275 } }}>
                        <Table sx={{ minWidth: 300 }} stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">費用項目</StyledTableCell>
                                    <StyledTableCell align="center">計帳段號</StyledTableCell>
                                    <StyledTableCell align="center">是否為稅</StyledTableCell>
                                    <StyledTableCell align="center">費用金額</StyledTableCell>
                                    <StyledTableCell align="center">Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {invoiceDetailInfo?.map((row, id) => (
                                    <TableRow key={id + row.FeeItem + row.BillMilestone} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <StyledTableCell component="th" scope="row">
                                            {row.FeeItem}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{row.BillMilestone}</StyledTableCell>
                                        <StyledTableCell align="center">{row.IsTax === 1 ? '是' : '否'}</StyledTableCell>
                                        <StyledTableCell align="center">{handleNumber(row.FeeAmount)}</StyledTableCell>
                                        <StyledTableCell align="center">
                                            {row.FeeItem.includes('(tax)') ? null : (
                                                <Button
                                                    color="success"
                                                    onClick={() => {
                                                        copyTax(row);
                                                    }}
                                                >
                                                    Tax
                                                </Button>
                                            )}
                                            <Button
                                                color="primary"
                                                onClick={() => {
                                                    itemDetailEdit(id);
                                                }}
                                            >
                                                編輯
                                            </Button>
                                            <Button
                                                color="error"
                                                onClick={() => {
                                                    itemDetailDelete(id);
                                                }}
                                            >
                                                刪除
                                            </Button>
                                        </StyledTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default CreateInvoiceDetail;
