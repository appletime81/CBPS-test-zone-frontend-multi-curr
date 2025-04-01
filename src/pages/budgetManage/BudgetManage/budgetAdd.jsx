import { useEffect, useRef, useState } from 'react';
import { Grid, Button, FormControl, TextField, Table, TableBody, TableHead, TableContainer, TableRow } from '@mui/material';
import dayjs from 'dayjs';

// day
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// table
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

// project
import { BootstrapDialogTitle, CustomAddTypography, CustomSelect } from 'components/commonFunction';

// api
import { addLevelsFromFrontend, updateLevels } from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

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

const BudgetAdd = ({ isDialogOpen, handleDialogClose, currencyListInfo, submarineCableList, dialogAction, workTitleList, dataDetail, budgetQuery }) => {
    const dispatch = useDispatch();
    const [submarineCable, setSubmarineCable] = useState('');
    const [budget_year, setBudget_year] = useState(dayjs().startOf('year')); //發票日期
    const [budget_fee_item_seq, setBudget_fee_item_seq] = useState('');
    const [budget_fee_item_name, setBudget_fee_item_name] = useState('');
    const [budget_fee_amount, setBudget_fee_amount] = useState(0);
    const [workTitle, setWorkTitle] = useState('');
    const [code, setCode] = useState('');
    const [remark, setRemark] = useState('');
    const [dataList, setDataList] = useState([]);
    const isEdit = useRef();
    const fixItem = useRef(-1);
    const isEditMode = dialogAction === 'Edit';
    const isAddOrEdit = dialogAction === 'Add' || isEditMode;
    const isViewMode = dialogAction === 'View';
    const isDisabled = isEditMode || dataList.length > 0;

    const initAddInfo = () => {
        if (dataList.length > 0) {
            setBudget_fee_item_seq('');
            setBudget_fee_item_name('');
            setBudget_fee_amount('');
            setRemark('');
        } else {
            setSubmarineCable('');
            setBudget_year(dayjs().startOf('year'));
            setBudget_fee_item_seq('');
            setBudget_fee_item_name('');
            setBudget_fee_amount('');
            setWorkTitle('');
            setCode('');
            setRemark('');
        }
    };

    const initInfo = () => {
        setSubmarineCable('');
        setBudget_year(dayjs().startOf('year'));
        setBudget_fee_item_seq('');
        setBudget_fee_item_name('');
        setBudget_fee_amount('');
        setWorkTitle('');
        setCode('');
        setRemark('');
        setDataList([]);
    };

    const showError = (message) => {
        dispatch(setMessageStateOpen({ messageStateOpen: { isOpen: true, severity: 'error', message } }));
    };

    const infoCheck = () => {
        if (!submarineCable) return showError('請輸入海纜名稱'), false;
        if (!workTitle) return showError('請輸入海纜作業'), false;
        if (!budget_fee_item_seq) return showError('請輸入項目序號'), false;
        if (!budget_fee_item_name) return showError('請輸入項目名稱'), false;
        return true;
    };

    //新增
    const addList = () => {
        if (infoCheck()) {
            setDataList([
                ...dataList,
                {
                    budget_year: dayjs(budget_year).format('YYYY'),
                    SubmarineCable: submarineCable,
                    WorkTitle: workTitle,
                    budget_fee_item_seq,
                    budget_fee_item_name,
                    Code: code,
                    budget_fee_amount,
                    remark
                }
            ]);
        }
    };

    const handleFetch = async (url, method, bodyData) => {
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}` },
                body: JSON.stringify(bodyData)
            });
            const data = await response.json();
            if (data.alert_msg) {
                showError(data.alert_msg || '請洽管理人員');
            } else {
                handleDialogClose();
                dispatch(setMessageStateOpen({ messageStateOpen: { isOpen: true, severity: 'success', message: method === 'POST' ? '新增成功' : '更新成功' } }));
                initInfo();
                setDataList([]);
                budgetQuery();
            }
        } catch (e) {
            console.error('Error:', e);
        }
    };

    const addBudgetData = () => {
        if (dialogAction === 'Add') {
            handleFetch(addLevelsFromFrontend, 'POST', { levels: Object.fromEntries(dataList.map((item) => [item.budget_fee_item_seq, item])) });
        }
    };

    const updateBudgetData = () => {
        if (dialogAction === 'Edit') {
            handleFetch(updateLevels, 'POST', { levels: Object.fromEntries(dataList.map((item) => [item.budget_fee_item_seq, item])) });
        }
    };

    //編輯
    const editListInfoItem = (fixItem) => {
        let tmpArray = dataList[fixItem];
        console.log('tmpArray=>>', tmpArray);
        isEdit.current = true;
        setSubmarineCable(tmpArray.SubmarineCable);
        setBudget_year(tmpArray.budget_year);
        setWorkTitle(tmpArray.WorkTitle);
        setCode(tmpArray.Code);
        setBudget_fee_item_seq(tmpArray.budget_fee_item_seq);
        setBudget_fee_item_name(tmpArray.budget_fee_item_name);
        setBudget_fee_amount(tmpArray.budget_fee_amount);
        setRemark(tmpArray.remark);
    };

    //刪除
    const deleteListInfoItem = (deleteItem) => {
        setDataList(dataList.filter((_, i) => i !== deleteItem));
    };

    const saveEdit = async () => {
        if (infoCheck()) {
            let tmpArray = dataList.map((i) => i);
            tmpArray.splice(fixItem.current, 1);
            tmpArray.push({
                budget_year: dayjs(budget_year).format('YYYY'),
                SubmarineCable: submarineCable,
                WorkTitle: workTitle,
                budget_fee_item_seq,
                budget_fee_item_name,
                Code: code,
                budget_fee_amount,
                remark
            });
            setDataList([...tmpArray]);
            cancelEdit();
        }
    };

    const cancelEdit = () => {
        isEdit.current = false;
        fixItem.current = -1;
        initAddInfo();
    };

    useEffect(() => {
        if (isDialogOpen && (isViewMode || isEditMode)) {
            console.log('dataDetail=>>', dataDetail);
            setSubmarineCable(dataDetail[0].SubmarineCable);
            setBudget_year(dataDetail[0].budget_year);
            setWorkTitle(dataDetail[0].WorkTitle);
            setCode(dataDetail[0].Code);
            setDataList(dataDetail);
        }
    }, [dialogAction, isDialogOpen]);

    console.log('dataList3=>>', dataList);

    return (
        <Dialog maxWidth="md" fullWidth open={isDialogOpen}>
            <BootstrapDialogTitle>{dialogAction === 'Edit' ? '編輯費用項目' : dialogAction === 'View' ? '檢視費用項目' : '新增費用項目'}</BootstrapDialogTitle>
            <DialogContent dividers>
                <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center">
                    {isAddOrEdit && (
                        <>
                            <Grid item md={3} lg={3} display="flex" justifyContent="center">
                                <CustomAddTypography>海纜名稱：</CustomAddTypography>
                            </Grid>
                            <Grid item md={3} lg={3}>
                                <CustomSelect
                                    label="選擇海纜"
                                    value={submarineCable}
                                    onChange={(e) => setSubmarineCable(e.target.value)}
                                    options={submarineCableList}
                                    disabled={isDisabled}
                                />
                            </Grid>
                            <Grid item md={3} lg={3} display="flex" justifyContent="center">
                                <CustomAddTypography>海纜作業：</CustomAddTypography>
                            </Grid>
                            <Grid item md={3} lg={3}>
                                <CustomSelect
                                    label="選擇海纜作業"
                                    value={workTitle}
                                    onChange={(e) => setWorkTitle(e.target.value)}
                                    options={workTitleList.map((i) => i.Title)}
                                    disabled={isDisabled}
                                />
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} lg={3} display="flex" justifyContent="center">
                                <CustomAddTypography>年度：</CustomAddTypography>
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} lg={3}>
                                <FormControl>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DesktopDatePicker
                                            views={['year']} // 只顯示年份選擇
                                            value={budget_year}
                                            onChange={(e) => {
                                                setBudget_year(e);
                                            }}
                                            renderInput={(params) => <TextField size="small" {...params} />}
                                            disabled={isDisabled}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} lg={3} display="flex" justifyContent="center">
                                <CustomAddTypography>幣別：</CustomAddTypography>
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} lg={3}>
                                <CustomSelect
                                    label="幣別"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    options={currencyListInfo.map((i) => i.Code)}
                                    disabled={isDisabled}
                                />
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} lg={3} display="flex" justifyContent="center">
                                <CustomAddTypography>項目序號：</CustomAddTypography>
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} lg={3}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={budget_fee_item_seq}
                                    size="small"
                                    label="填寫主旨/用途"
                                    onChange={(e) => setBudget_fee_item_seq(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} lg={3} display="flex" justifyContent="center">
                                <CustomAddTypography>項目名稱：</CustomAddTypography>
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} lg={3}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={budget_fee_item_name}
                                    size="small"
                                    label="填寫主旨/用途"
                                    onChange={(e) => setBudget_fee_item_name(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} lg={3} display="flex" justifyContent="center">
                                <CustomAddTypography>項目金額：</CustomAddTypography>
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} lg={3}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={budget_fee_amount}
                                    size="small"
                                    label="填寫主旨/用途"
                                    onChange={(e) => setBudget_fee_amount(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} lg={3} display="flex" justifyContent="center">
                                <CustomAddTypography>備註：</CustomAddTypography>
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} lg={3}>
                                <TextField fullWidth variant="outlined" value={remark} size="small" label="填寫備註" onChange={(e) => setRemark(e.target.value)} />
                            </Grid>
                            {dialogAction === 'Add' || dialogAction === 'Edit' ? (
                                <>
                                    <Grid item sm={11} md={11} lg={11} display="flex" alignItems="center" justifyContent="end" />
                                    <Grid item sm={1} md={1} lg={1} display="flex" alignItems="center" justifyContent="end">
                                        {isEdit.current ? (
                                            <>
                                                <Button size="small" variant="contained" onClick={saveEdit}>
                                                    儲存
                                                </Button>
                                                <Button
                                                    size="small"
                                                    style={{
                                                        marginLeft: '0.5rem'
                                                    }}
                                                    variant="contained"
                                                    onClick={cancelEdit}
                                                >
                                                    取消
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                size="small"
                                                style={{
                                                    maxWidth: '2rem',
                                                    maxHeight: '2rem',
                                                    minWidth: '2rem',
                                                    minHeight: '2rem'
                                                }}
                                                variant="contained"
                                                onClick={addList}
                                            >
                                                +
                                            </Button>
                                        )}
                                    </Grid>
                                </>
                            ) : null}
                        </>
                    )}
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="center">海纜名稱</StyledTableCell>
                                        <StyledTableCell align="center">海纜作業</StyledTableCell>
                                        <StyledTableCell align="center">年度</StyledTableCell>
                                        <StyledTableCell align="center">幣別</StyledTableCell>
                                        <StyledTableCell align="center">項目序號</StyledTableCell>
                                        <StyledTableCell align="center">項目名稱</StyledTableCell>
                                        <StyledTableCell align="center">項目金額</StyledTableCell>
                                        <StyledTableCell align="center">備註</StyledTableCell>
                                        {!isViewMode ? <StyledTableCell align="center">Action</StyledTableCell> : null}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataList.map((row, id) => {
                                        return (
                                            <TableRow
                                                key={row.budget_fee_item_name + row.budget_fee_item_seq + id}
                                                sx={{
                                                    '&:last-child td, &:last-child th': {
                                                        border: 0
                                                    }
                                                }}
                                            >
                                                <StyledTableCell align="center">{row.SubmarineCable}</StyledTableCell>
                                                <StyledTableCell align="center">{row.WorkTitle}</StyledTableCell>
                                                <StyledTableCell align="center">{row.budget_year}</StyledTableCell>
                                                <StyledTableCell align="center">{row.Code}</StyledTableCell>
                                                <StyledTableCell align="center">{row.budget_fee_item_seq}</StyledTableCell>
                                                <StyledTableCell align="center">{row.budget_fee_item_name}</StyledTableCell>
                                                <StyledTableCell align="center">{row.budget_fee_amount}</StyledTableCell>
                                                <StyledTableCell align="center">{row.remark}</StyledTableCell>
                                                {!isViewMode ? (
                                                    <StyledTableCell align="center">
                                                        <Button
                                                            color="primary"
                                                            onClick={() => {
                                                                editListInfoItem(id);
                                                                fixItem.current = id;
                                                            }}
                                                        >
                                                            編輯
                                                        </Button>
                                                        <Button
                                                            color="error"
                                                            onClick={() => {
                                                                deleteListInfoItem(id);
                                                            }}
                                                        >
                                                            刪除
                                                        </Button>
                                                    </StyledTableCell>
                                                ) : null}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                {dialogAction === 'Add' ? (
                    <Button sx={{ mr: '0.05rem' }} variant="contained" onClick={addBudgetData}>
                        新增
                    </Button>
                ) : (
                    <Button sx={{ mr: '0.05rem' }} variant="contained" onClick={updateBudgetData}>
                        更新
                    </Button>
                )}

                <Button
                    sx={{ mr: '0.05rem' }}
                    variant="contained"
                    onClick={() => {
                        handleDialogClose();
                        initInfo();
                    }}
                >
                    關閉
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BudgetAdd;
