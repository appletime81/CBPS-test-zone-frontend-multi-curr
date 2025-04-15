import { useEffect, useState } from 'react';
import {
    Typography,
    Grid,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Checkbox,
    Autocomplete,
    Table,
    TableBody,
    TableHead,
    TableContainer,
    TableRow
} from '@mui/material';

// day
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// autocomplete
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

// table
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

// project
import { BootstrapDialogTitle } from 'components/commonFunction';

// api
import { deleteLiability, addLiabilityapi, submarineCableInfoList, dropdownmenuParties, getWorkTitle } from 'components/apis.jsx';

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

const LiabilityAdd = ({
    handleDialogClose,
    addLiability,
    saveEdit,
    partyName,
    setPartyName,
    isDialogOpen,
    billMilestone,
    setBillMilestone,
    workTitle,
    setWorkTitle,
    submarineCable,
    setSubmarineCable,
    dialogAction,
    lBRatio,
    setLBRatio,
    modifyNote,
    setModifyNote,
    note,
    setNote,
    setEditItem,
    lBRawID,
    apiQuery
}) => {
    const dispatch = useDispatch();
    const [listInfo, setListInfo] = useState([]);
    const [splitNumber, setSplitNumber] = useState('');
    const [submarineCableList, setSubmarineCableList] = useState([]); //海纜名稱下拉選單
    const [partiesList, setPartiesList] = useState([]); //會員下拉選單
    const [workTitleList, setWorkTitleList] = useState([]); //海纜作業下拉選單

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    const itemDetailInitial = () => {
        setBillMilestone('');
        setPartyName([]);
        setLBRatio('');
        setWorkTitle('');
        setSubmarineCable('');
        setSplitNumber('');
        setNote('');
    };

    const itemDetailPartInitial = () => {
        setPartyName([]);
        setLBRatio('');
        setSplitNumber('');
        setNote('');
    };

    const infoCheck = () => {
        const lBRatioSum = listInfo.reduce((acc, obj) => acc + parseInt(obj.LBRatio), 0);
        if (lBRatioSum === 100) {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '攤分比例已到達100'
                    }
                })
            );
            return false;
        }

        if (partyName.length === 0) {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入會員名稱'
                    }
                })
            );
            return false;
        }
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
        if (submarineCable === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入海纜名稱'
                    }
                })
            );
            return false;
        }
        if (workTitle === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入海纜作業'
                    }
                })
            );
            return false;
        }
        if (lBRatio === 0 || lBRatio === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入攤分比例'
                    }
                })
            );
            return false;
        }
        return true;
    };

    //新增
    const addList = () => {
        if (infoCheck()) {
            let tmpArray = listInfo.map((i) => i);
            let partyArray = partyName;
            partyArray.forEach((e) => {
                tmpArray.push({
                    BillMilestone: billMilestone,
                    PartyName: e,
                    LBRatio: lBRatio,
                    SubmarineCable: submarineCable,
                    WorkTitle: workTitle,
                    Note: note
                });
            });
            console.log('partyArray=>>', partyArray);
            setListInfo([...tmpArray]);
            itemDetailPartInitial();
        }
    };

    //分段+
    const addSplit = () => {
        let tmpArray = listInfo.map((i) => i);
        let partyArray = partyName;
        partyArray.forEach((e) => {
            tmpArray.push({
                BillMilestone: billMilestone + splitNumber,
                PartyName: e,
                LBRatio: lBRatio,
                SubmarineCable: submarineCable,
                WorkTitle: workTitle,
                ModifyNote: modifyNote
            });
        });
        setListInfo([...tmpArray]);
        setSplitNumber('');
    };

    //刪除
    const deleteListInfoItem = (deleteItem) => {
        let tmpArray = listInfo.map((i) => i);
        tmpArray.splice(deleteItem, 1);
        setListInfo([...tmpArray]);
    };

    const excuteSplit = () => {
        if (listInfo.length > 0) {
            fetch(deleteLiability, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
                },
                body: JSON.stringify({ LBRawID: lBRawID.current })
            })
                .then((res) => res.json())
                .then(() => {
                    console.log('刪除成功');
                    fetch(addLiabilityapi, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
                        },
                        body: JSON.stringify(listInfo)
                    })
                        .then((res) => res.json())
                        .then(() => {
                            dispatch(
                                setMessageStateOpen({
                                    messageStateOpen: {
                                        isOpen: true,
                                        severity: 'success',
                                        message: '分段成功'
                                    }
                                })
                            );
                            handleDialogClose();
                            itemDetailInitial();
                            setEditItem(NaN);
                            setListInfo([]);
                            apiQuery();
                        })
                        .catch(() => {
                            dispatch(
                                setMessageStateOpen({
                                    messageStateOpen: {
                                        isOpen: true,
                                        severity: 'error',
                                        message: '網路異常，請檢查網路連線或與系統窗口聯絡'
                                    }
                                })
                            );
                        });
                })
                .catch(() => {
                    dispatch(
                        setMessageStateOpen({
                            messageStateOpen: {
                                isOpen: true,
                                severity: 'error',
                                message: '網路異常，請檢查網路連線或與系統窗口聯絡'
                            }
                        })
                    );
                });
        } else {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請增加分段帳號'
                    }
                })
            );
        }
    };

    useEffect(() => {
        //海纜名稱
        fetch(submarineCableInfoList, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setSubmarineCableList(data);
            })
            .catch(() => {
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'error',
                            message: '網路異常，請檢查網路連線或與系統窗口聯絡'
                        }
                    })
                );
            });
        //會員名稱
        fetch(dropdownmenuParties, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setPartiesList(data);
            })
            .catch(() => {
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'error',
                            message: '網路異常，請檢查網路連線或與系統窗口聯絡'
                        }
                    })
                );
            });
        fetch(getWorkTitle, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            },
            body: JSON.stringify({})
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setWorkTitleList(data);
                } else {
                    setWorkTitleList([]);
                }
            })
            .catch(() => {
                setWorkTitleList([]);
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'error',
                            message: '網路異常，請檢查網路連線或與系統窗口聯絡'
                        }
                    })
                );
            });
    }, []);

    useEffect(() => {
        if (submarineCable && workTitle) {
            let tmpArray = {
                SubmarineCable: submarineCable,
                WorkTitle: workTitle
            };
            //會員名稱
            fetch(dropdownmenuParties, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
                },
                body: JSON.stringify(tmpArray)
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log('data=>>', data);
                    if (data.length === 0) {
                        dispatch(
                            setMessageStateOpen({
                                messageStateOpen: {
                                    isOpen: true,
                                    severity: 'error',
                                    message: '無會員資料'
                                }
                            })
                        );
                    } else {
                        setPartiesList(data);
                    }
                })
                .catch(() => {
                    dispatch(
                        setMessageStateOpen({
                            messageStateOpen: {
                                isOpen: true,
                                severity: 'error',
                                message: '網路異常，請檢查網路連線或與系統窗口聯絡'
                            }
                        })
                    );
                });
        }
    }, [submarineCable, workTitle]);

    return (
        <Dialog maxWidth="md" fullWidth open={isDialogOpen}>
            <BootstrapDialogTitle>
                {dialogAction === 'Split' ? `切割計費段${billMilestone}的Liabilty` : dialogAction === 'Edit' ? '編輯Liability' : '新增Liability'}
            </BootstrapDialogTitle>
            <DialogContent dividers>
                <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center">
                    <Grid item xs={2} sm={2} md={2} lg={2} display="flex" justifyContent="center">
                        <Typography
                            variant="h5"
                            sx={{
                                fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                ml: { lg: '0.5rem', xl: '1.5rem' }
                            }}
                        >
                            計帳段號：
                        </Typography>
                    </Grid>
                    {dialogAction === 'Split' ? (
                        <Grid item sm={2} md={2} lg={2} display="flex" justifyContent="center">
                            <TextField
                                fullWidth
                                variant="outlined"
                                disabled={dialogAction === 'Split'}
                                value={billMilestone}
                                size="small"
                                label="計帳段號"
                                inputProps={{ style: { textTransform: 'uppercase' } }}
                                onChange={(e) => setBillMilestone(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={splitNumber}
                                size="small"
                                label="分段"
                                inputProps={{ maxLength: 2, style: { textTransform: 'lowercase' } }}
                                onChange={(e) => setSplitNumber(e.target.value)}
                            />
                        </Grid>
                    ) : (
                        <Grid item sm={2} md={2} lg={2} display="flex" justifyContent="center">
                            <TextField
                                fullWidth
                                variant="outlined"
                                disabled={dialogAction === 'Edit' || listInfo.length > 0}
                                value={billMilestone}
                                size="small"
                                label="大小寫視為不同段號"
                                // inputProps={{ style: { textTransform: 'uppercase' } }}
                                onChange={(e) => setBillMilestone(e.target.value)}
                            />
                        </Grid>
                    )}
                    <Grid item xs={2} sm={2} md={2} lg={2} display="flex" justifyContent="center">
                        <Typography
                            variant="h5"
                            sx={{
                                fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                ml: { lg: '0.5rem', xl: '1.5rem' }
                            }}
                        >
                            海纜名稱：
                        </Typography>
                    </Grid>
                    <Grid item xs={2} sm={2} md={2} lg={2} display="flex" justifyContent="center">
                        <FormControl fullWidth size="small">
                            <InputLabel>選擇海纜名稱</InputLabel>
                            <Select
                                disabled={dialogAction === 'Edit' || listInfo.length > 0 || dialogAction === 'Split'}
                                size="small"
                                value={submarineCable}
                                label="填寫海纜名稱"
                                onChange={(e) => setSubmarineCable(e.target.value)}
                            >
                                {submarineCableList.map((i) => (
                                    <MenuItem key={i.CableName} value={i.CableName}>
                                        {i.CableName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2} sm={2} md={2} lg={2} display="flex" justifyContent="center">
                        <Typography
                            variant="h5"
                            sx={{
                                fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                ml: { lg: '0.5rem', xl: '1.5rem' }
                            }}
                        >
                            海纜作業：
                        </Typography>
                    </Grid>
                    <Grid item xs={2} sm={2} md={2} lg={2} display="flex" justifyContent="center">
                        <FormControl fullWidth size="small">
                            <InputLabel>選擇海纜作業</InputLabel>
                            <Select
                                disabled={dialogAction === 'Edit' || listInfo.length > 0 || dialogAction === 'Split'}
                                size="small"
                                value={workTitle}
                                label="填寫海纜作業"
                                onChange={(e) => setWorkTitle(e.target.value)}
                            >
                                {workTitleList.map((i) => (
                                    <MenuItem key={i.Title} value={i.Title}>
                                        {i.Title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2} sm={2} md={2} lg={2} display="flex" justifyContent="center">
                        <Typography
                            variant="h5"
                            sx={{
                                fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                ml: { lg: '0.5rem', xl: '1.5rem' }
                            }}
                        >
                            攤分比例：
                        </Typography>
                    </Grid>
                    <Grid item xs={2} sm={2} md={2} lg={2}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            disabled={dialogAction === 'Edit' || dialogAction === 'Split'}
                            value={lBRatio}
                            size="small"
                            label="填寫攤分比例"
                            onChange={(e) => setLBRatio(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={2} sm={2} md={2} lg={2} display="flex" justifyContent="center">
                        <Typography
                            variant="h5"
                            sx={{
                                fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                ml: { lg: '0.5rem', xl: '1.5rem' }
                            }}
                        >
                            會員名稱：
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        <Autocomplete
                            multiple
                            options={partiesList}
                            value={partyName}
                            disabled={dialogAction === 'Edit' || dialogAction === 'Split'}
                            size="small"
                            disableCloseOnSelect
                            // haha
                            onChange={(event, newValue) => {
                                setPartyName(newValue);
                            }}
                            getOptionLabel={(option) => option}
                            renderOption={(props, option, { selected }) => {
                                return (
                                    <li {...props}>
                                        <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                                        {option}
                                    </li>
                                );
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="選擇會員名稱"
                                    onClick={() => {
                                        if (partiesList.length === 0) {
                                            dispatch(
                                                setMessageStateOpen({
                                                    messageStateOpen: {
                                                        isOpen: true,
                                                        severity: 'warning',
                                                        message: '請先選擇海纜名稱及海纜作業'
                                                    }
                                                })
                                            );
                                        }
                                    }}
                                />
                            )}
                        />
                    </Grid>
                    {/* row3 */}
                    <Grid item xs={2} sm={2} md={2} lg={2} display="flex" justifyContent="center">
                        <Typography
                            variant="h5"
                            sx={{
                                fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                ml: { lg: '0.5rem', xl: '1.5rem' }
                            }}
                        >
                            備註：
                        </Typography>
                    </Grid>
                    <Grid item xs={4} sm={4} md={4} lg={4}>
                        <TextField fullWidth variant="outlined" value={note} size="small" label="填寫備註" onChange={(e) => setNote(e.target.value)} />
                    </Grid>
                    <Grid item xs={2} sm={2} md={2} lg={2} display="flex" justifyContent="center">
                        {dialogAction === 'Edit' ? (
                            <Typography
                                variant="h5"
                                sx={{
                                    fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                    ml: { lg: '0.5rem', xl: '1.5rem' }
                                }}
                            >
                                異動原因：
                            </Typography>
                        ) : null}
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        {dialogAction === 'Edit' ? (
                            <TextField fullWidth variant="outlined" value={modifyNote} size="small" label="填寫異動原因" onChange={(e) => setModifyNote(e.target.value)} />
                        ) : null}
                    </Grid>
                    <Grid item sm={1} md={1} lg={1} display="flex" alignItems="center" justifyContent="end">
                        {dialogAction !== 'Edit' ? (
                            <Button
                                size="small"
                                style={{
                                    maxWidth: '2rem',
                                    maxHeight: '2rem',
                                    minWidth: '2rem',
                                    minHeight: '2rem'
                                }}
                                variant="contained"
                                onClick={dialogAction === 'Split' ? addSplit : addList}
                            >
                                +
                            </Button>
                        ) : null}
                    </Grid>
                    {dialogAction !== 'Edit' ? (
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                                <Table sx={{ minWidth: 300 }} stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center">計帳段號</StyledTableCell>
                                            <StyledTableCell align="center">會員名稱</StyledTableCell>
                                            <StyledTableCell align="center">攤分比例</StyledTableCell>
                                            <StyledTableCell align="center">海纜名稱</StyledTableCell>
                                            <StyledTableCell align="center">海纜作業</StyledTableCell>
                                            <StyledTableCell align="center">Action</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {listInfo?.map((row, id) => {
                                            return (
                                                <TableRow
                                                    // key={row.InvoiceWKMaster?.invoiceNo + row.InvoiceWKMaster?.supplierName + id}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': {
                                                            border: 0
                                                        }
                                                    }}
                                                >
                                                    <StyledTableCell align="center">{row.BillMilestone}</StyledTableCell>
                                                    <StyledTableCell align="center">{row.PartyName}</StyledTableCell>
                                                    <StyledTableCell align="center">{row.LBRatio}%</StyledTableCell>
                                                    <StyledTableCell align="center">{row.SubmarineCable}</StyledTableCell>
                                                    <StyledTableCell align="center">{row.WorkTitle}</StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <Button
                                                            color="error"
                                                            onClick={() => {
                                                                deleteListInfoItem(id);
                                                            }}
                                                        >
                                                            刪除
                                                        </Button>
                                                    </StyledTableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    ) : null}
                </Grid>
            </DialogContent>
            <DialogActions>
                {dialogAction === 'Edit' ? (
                    <Button sx={{ mr: '0.05rem' }} variant="contained" onClick={saveEdit}>
                        儲存
                    </Button>
                ) : dialogAction === 'Split' ? (
                    <Button
                        sx={{ mr: '0.05rem' }}
                        variant="contained"
                        onClick={() => {
                            excuteSplit();
                        }}
                    >
                        分段
                    </Button>
                ) : (
                    <Button
                        sx={{ mr: '0.05rem' }}
                        variant="contained"
                        onClick={() => {
                            addLiability(listInfo, setListInfo);
                        }}
                    >
                        儲存
                    </Button>
                )}
                <Button
                    sx={{ mr: '0.05rem' }}
                    variant="contained"
                    onClick={() => {
                        handleDialogClose();
                        itemDetailInitial();
                        setEditItem(NaN);
                        setListInfo([]);
                    }}
                >
                    關閉
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LiabilityAdd;
