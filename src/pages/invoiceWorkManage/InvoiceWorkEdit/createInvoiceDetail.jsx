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
    setInvoiceDetailInfo,
    bmStoneList,
    invoiceDetailInfo,
    action,
    itemDetailInitial,
    billMilestone,
    setBillMilestone,
    budgetList,
    feeItem,
    setFeeItem,
    feeAmount,
    setFeeAmount,
    isTax,
    budgetInfo,
    setBudgetInfo
}) => {
    const [isEdit, setIsEdit] = useState(false);
    const editItem = useRef();
    const dispatch = useDispatch();
    const createData = (FeeItem, BillMilestone, IsTax, FeeAmount, budget_year, budget_fee_item_seq) => {
        return { FeeItem, BillMilestone, IsTax, FeeAmount, budget_year, budget_fee_item_seq };
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

    const itemDetailAdd = () => {
        if (infoCheck()) {
            let tmpArray = invoiceDetailInfo;
            tmpArray.push(createData(feeItem.trim(), billMilestone, 0, feeAmount, budgetInfo.budget_year, budgetInfo.budget_fee_item_seq));
            setInvoiceDetailInfo([...tmpArray]);
            itemDetailInitial();
        }
    };

    const itemDetailDelete = (id) => {
        let tmpArray = invoiceDetailInfo;
        tmpArray.splice(id, 1);
        setInvoiceDetailInfo([...tmpArray]);
    };

    const itemDetailEdit = (id) => {
        setIsEdit(true);
        editItem.current = id;
        let tmpArray = invoiceDetailInfo[id];
        setBillMilestone(tmpArray.BillMilestone);
        setFeeItem(tmpArray.FeeItem);
        setFeeAmount(handleNumber(tmpArray.FeeAmount));
        setBudgetInfo({
            budget_year: tmpArray.budget_year,
            budget_fee_item_seq: tmpArray.budget_fee_item_seq
        });
        isTax.current = tmpArray.IsTax;
    };

    const itemDetailSave = () => {
        if (infoCheck()) {
            setIsEdit(false);
            let tmpArray = invoiceDetailInfo.map((i) => i);
            tmpArray.splice(editItem.current, 1);
            console.log('feeAmount=>>', feeAmount);
            tmpArray.push(createData(feeItem, billMilestone, isTax.current, feeAmount, budgetInfo.budget_year, budgetInfo.budget_fee_item_seq));
            tmpArray.reverse();
            setInvoiceDetailInfo([...tmpArray]);
            itemDetailInitial();
            editItem.current = 0;
        }
    };

    const itemDetailCancel = () => {
        itemDetailInitial();
        setIsEdit(false);
    };

    //複製變成稅
    const copyTax = (info) => {
        let tmpArray = invoiceDetailInfo.map((i) => i);
        console.log(info);
        tmpArray.push(
            createData('(tax)' + info.FeeItem.trim(), info.BillMilestone, 1, Number(info.FeeAmount / 10), info.budgetInfo.budget_year, info.budgetInfo.budget_fee_item_seq)
        );
        // tmpArray.reverse();
        setInvoiceDetailInfo([...tmpArray]);
        itemDetailInitial();
        console.log(info);
    };

    const handleBudgetInfo = (e) => {
        const selectedValue = JSON.parse(e.target.value);
        setBudgetInfo(selectedValue);
    };

    useEffect(() => {
        itemDetailInitial();
    }, []);

    return (
        <MainCard title="發票明細檔" sx={{ height: '100%' }}>
            <Grid container display="flex" justifyContent="center" alignItems="center" spacing={1}>
                {/* row1 */}
                {action === '編輯' ? (
                    <>
                        <Grid item md={2} lg={2}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                    ml: { lg: '0rem', xl: '1.5rem' }
                                }}
                            >
                                計帳段號：
                            </Typography>
                        </Grid>
                        <Grid item md={4} lg={4}>
                            <FormControl fullWidth>
                                <InputLabel size="small" id="billMilestone" disabled={action !== '編輯'}>
                                    選擇計帳段號
                                </InputLabel>
                                <Select value={billMilestone} disabled={action !== '編輯'} label="發票供應商" size="small" onChange={(e) => setBillMilestone(e.target.value)}>
                                    {bmStoneList.map((i) => (
                                        <MenuItem key={i} value={i}>
                                            {i}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2} lg={2}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                    ml: { lg: '0rem', xl: '1.5rem' }
                                }}
                            >
                                費用金額：
                            </Typography>
                        </Grid>
                        <Grid item md={4} lg={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                disabled={action !== '編輯'}
                                value={feeAmount}
                                size="small"
                                label="填寫費用金額"
                                InputProps={{
                                    inputComponent: NumericFormatCustom
                                }}
                                onChange={(e) => setFeeAmount(e.target.value)}
                            />
                        </Grid>
                        {/* row2 */}
                        <Grid item sm={6} md={2} lg={2}>
                            <Typography
                                variant="h5"
                                align="left"
                                sx={{
                                    fontSize: { lg: '0.7rem', xl: '0.88rem' }
                                }}
                            >
                                預算費用項目：
                            </Typography>
                        </Grid>
                        <Grid item sm={6} md={6} lg={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>選擇項目序號</InputLabel>
                                <Select label="項目序號" value={budgetInfo ? JSON.stringify(budgetInfo) : ''} onChange={handleBudgetInfo}>
                                    {budgetList.map((i) => (
                                        <MenuItem
                                            key={i}
                                            value={JSON.stringify({
                                                budget_year: i.budget_year,
                                                budget_fee_item_seq: i.budget_fee_item_seq
                                            })}
                                        >
                                            {`序號:${i.budget_fee_item_seq}'  名稱:'${i.budget_fee_item_name}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item sm={6} md={4} lg={4} />
                        {/* row3 */}
                        <Grid item md={2} lg={2}>
                            <Typography
                                variant="h5"
                                size="small"
                                sx={{
                                    fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                    ml: { lg: '0rem', xl: '1.5rem' }
                                }}
                            >
                                費用項目：
                            </Typography>
                        </Grid>
                        <Grid item md={10} lg={10}>
                            <StyledEngineProvider injectFirst>
                                <CssVarsProvider>
                                    <Textarea
                                        required
                                        value={feeItem}
                                        placeholder="填寫費用項目"
                                        disabled={action !== '編輯'}
                                        minRows={2}
                                        maxRows={2}
                                        onChange={(e) => setFeeItem(e.target.value)}
                                    />
                                </CssVarsProvider>
                            </StyledEngineProvider>
                        </Grid>
                    </>
                ) : null}
                {action === '編輯' ? (
                    <Grid item md={12} lg={12} display="flex" justifyContent="end" alignItems="center">
                        {isEdit ? (
                            <Button sx={{ mr: '0.25rem' }} variant="contained" onClick={itemDetailSave}>
                                儲存
                            </Button>
                        ) : (
                            <Button sx={{ mr: '0.25rem' }} variant="contained" onClick={itemDetailAdd}>
                                新增
                            </Button>
                        )}
                        {isEdit ? (
                            <Button sx={{ ml: '0.25rem' }} variant="contained" onClick={itemDetailCancel}>
                                關閉
                            </Button>
                        ) : (
                            <Button sx={{ ml: '0.25rem' }} variant="contained" onClick={itemDetailInitial}>
                                清除
                            </Button>
                        )}
                    </Grid>
                ) : null}
                <Grid item xs={12} sm={12} lg={12}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 300 }} stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">費用項目</StyledTableCell>
                                    <StyledTableCell align="center">計帳段號</StyledTableCell>
                                    <StyledTableCell align="center">是否為稅</StyledTableCell>
                                    <StyledTableCell align="center">費用金額</StyledTableCell>
                                    <StyledTableCell align="center">預算費用項目</StyledTableCell>
                                    {action === '編輯' ? <StyledTableCell align="center">Action</StyledTableCell> : null}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {invoiceDetailInfo?.map((row, id) => (
                                    <TableRow key={row.FeeItem + row.BillMilestone + id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <StyledTableCell component="th" scope="row">
                                            {row.FeeItem}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{row.BillMilestone}</StyledTableCell>
                                        <StyledTableCell align="center">{row.IsTax ? '是' : '否'}</StyledTableCell>
                                        <StyledTableCell align="center">{handleNumber(row.FeeAmount)}</StyledTableCell>
                                        <StyledTableCell align="center"> {row.budget_year ? `${row.budget_year}年 序號:${row.budget_fee_item_seq}` : null}</StyledTableCell>
                                        {action === '編輯' ? (
                                            <StyledTableCell align="center">
                                                {row.FeeItem.includes('(tax)') ? null : (
                                                    <Button
                                                        color="success"
                                                        sx={{ m: '0.01rem', p: '0.01rem' }}
                                                        onClick={() => {
                                                            copyTax(row);
                                                        }}
                                                    >
                                                        Tax
                                                    </Button>
                                                )}
                                                <Button
                                                    color="primary"
                                                    sx={{ m: '0.01rem', p: '0.01rem' }}
                                                    onClick={() => {
                                                        itemDetailEdit(id);
                                                    }}
                                                >
                                                    編輯
                                                </Button>
                                                <Button
                                                    color="error"
                                                    sx={{ m: '0.01rem', p: '0.01rem' }}
                                                    onClick={() => {
                                                        itemDetailDelete(id);
                                                    }}
                                                >
                                                    刪除
                                                </Button>
                                            </StyledTableCell>
                                        ) : null}
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
