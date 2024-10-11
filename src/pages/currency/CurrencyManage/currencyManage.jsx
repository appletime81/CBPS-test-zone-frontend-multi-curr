import { useState, useRef } from 'react';
import { Box, Button, TextField, Table } from '@mui/material';

// day
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// autocomplete
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

// table
import { TableBody, TableHead, TableContainer, TableRow } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

// project
import { BootstrapDialogTitle } from 'components/commonFunction';
import { setMessageStateOpen } from 'store/reducers/dropdown';

// api
import { addCurrencyData, updateCurrencyData, deleteCurrencyData } from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';

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

const CurrencyManage = ({
    handleCurrencyManageClose,
    isCurrencyOpen,
    currencyListInfo,
    getCurrencyDataFun,
}) => {
    const dispatch = useDispatch();
    const [cName, setCName] = useState(''); //貨幣中文
    const [code, setCode] = useState(''); //貨幣代碼
    const currencyIDEdit = useRef(-1);
    const [codeEdit, setCodeEdit] = useState(''); //貨幣代碼編輯
    const [cNameEdit, setCNameEdit] = useState(''); //貨幣中文編輯

    const initData = () => {
        setCName('');
        setCode('');
    };

    const initEditData = () => {
        currencyIDEdit.current = -1;
        setCNameEdit('');
        setCodeEdit('');
    };

    const infoCheck = () => {
        if (code === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入貨幣代碼',
                    },
                }),
            );
            return false;
        }
        if (cName === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入貨幣中文',
                    },
                }),
            );
            return false;
        }
        return true;
    };

    const editCheck = () => {
        if (codeEdit === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入貨幣代碼',
                    },
                }),
            );
            return false;
        }
        if (cNameEdit === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入貨幣中文',
                    },
                }),
            );
            return false;
        }
        return true;
    };

    const addCode = () => {
        if (infoCheck()) {
            let tmpObject = {};
            tmpObject.Code = code;
            tmpObject.CName = cName;
            console.log('tmpObject=>>', tmpObject);
            fetch(addCurrencyData, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
                },
                body: JSON.stringify(tmpObject),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.alert_msg) {
                        dispatch(
                            setMessageStateOpen({
                                messageStateOpen: {
                                    isOpen: true,
                                    severity: 'error',
                                    message: data.alert_msg,
                                },
                            }),
                        );
                    } else {
                        dispatch(
                            setMessageStateOpen({
                                messageStateOpen: {
                                    isOpen: true,
                                    severity: 'success',
                                    message: '新增成功',
                                },
                            }),
                        );
                        initData();
                        getCurrencyDataFun();
                    }
                })
                .catch((e) => console.log('e1=>', e));
        }
    };

    const editCode = (row) => {
        currencyIDEdit.current = row.CurrencyID;
        setCNameEdit(row.CName);
        setCodeEdit(row.Code);
    };

    const deleteCode = (id) => {
        currencyIDEdit.current = -1;
        initData();
        let tmpObject = {};
        tmpObject.CurrencyID = id;
        console.log('tmpObject=>>', tmpObject);
        fetch(deleteCurrencyData, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
            },
            body: JSON.stringify(tmpObject),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.alert_msg) {
                    dispatch(
                        setMessageStateOpen({
                            messageStateOpen: {
                                isOpen: true,
                                severity: 'error',
                                message: data.alert_msg,
                            },
                        }),
                    );
                } else {
                    dispatch(
                        setMessageStateOpen({
                            messageStateOpen: {
                                isOpen: true,
                                severity: 'success',
                                message: '刪除成功',
                            },
                        }),
                    );
                    getCurrencyDataFun();
                }
            })
            .catch((e) => console.log('e1=>', e));
    };

    const saveEditCodeInfo = (id) => {
        if (editCheck()) {
            let tmpObject = {};
            tmpObject.CurrencyID = id;
            tmpObject.Code = codeEdit;
            tmpObject.CName = cNameEdit;
            console.log('tmpObject=>>', tmpObject);
            fetch(updateCurrencyData, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
                },
                body: JSON.stringify(tmpObject),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.alert_msg) {
                        dispatch(
                            setMessageStateOpen({
                                messageStateOpen: {
                                    isOpen: true,
                                    severity: 'error',
                                    message: data.alert_msg,
                                },
                            }),
                        );
                    } else {
                        dispatch(
                            setMessageStateOpen({
                                messageStateOpen: {
                                    isOpen: true,
                                    severity: 'success',
                                    message: '編輯成功',
                                },
                            }),
                        );
                        initEditData();
                        getCurrencyDataFun();
                    }
                })
                .catch((e) => console.log('e1=>', e));
        }
    };

    const cancelEdit = () => {
        currencyIDEdit.current = -1;
        initData();
    };

    return (
        <Dialog maxWidth="sm" fullWidth open={isCurrencyOpen}>
            <BootstrapDialogTitle>貨幣管理</BootstrapDialogTitle>
            <DialogContent dividers>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 300 }} stickyHeader>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">NO</StyledTableCell>
                                <StyledTableCell align="center">貨幣代碼</StyledTableCell>
                                <StyledTableCell align="center">貨幣中文</StyledTableCell>
                                <StyledTableCell align="center">Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell align="center"></TableCell>
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        value={code}
                                        onChange={(e) => {
                                            setCode(e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        value={cName}
                                        onChange={(e) => {
                                            setCName(e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            '& button': { mx: { md: 0.6, lg: 1, xl: 1.8 }, p: 0 },
                                        }}
                                    >
                                        <Button
                                            color="success"
                                            variant="outlined"
                                            onClick={addCode}
                                        >
                                            新增
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                            {currencyListInfo?.map((row, id) => {
                                return (
                                    <TableRow
                                        key={row.Code + id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        {row.CurrencyID !== currencyIDEdit.current ? (
                                            <>
                                                <StyledTableCell align="center">
                                                    {id + 1}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.Code}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.CName}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            '& button': {
                                                                mx: { md: 0.6, lg: 1, xl: 1.8 },
                                                                p: 0,
                                                            },
                                                        }}
                                                    >
                                                        <Button
                                                            color="primary"
                                                            variant="outlined"
                                                            onClick={() => {
                                                                editCode(row);
                                                            }}
                                                        >
                                                            編輯
                                                        </Button>
                                                        <Button
                                                            color="error"
                                                            variant="outlined"
                                                            onClick={() => {
                                                                deleteCode(row.CurrencyID);
                                                            }}
                                                        >
                                                            刪除
                                                        </Button>
                                                    </Box>
                                                </StyledTableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell align="center">{id + 1}</TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        size="small"
                                                        // style={{ width: '30%' }}
                                                        value={codeEdit}
                                                        onChange={(e) => {
                                                            setCodeEdit(e.target.value);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        size="small"
                                                        // style={{ width: '30%' }}
                                                        value={cNameEdit}
                                                        onChange={(e) => {
                                                            setCNameEdit(e.target.value);
                                                        }}
                                                    />
                                                </TableCell>
                                                <StyledTableCell align="center">
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            '& button': {
                                                                mx: { md: 0.6, lg: 1, xl: 1.8 },
                                                                p: 0,
                                                            },
                                                        }}
                                                    >
                                                        <Button
                                                            color="primary"
                                                            variant="outlined"
                                                            onClick={() => {
                                                                saveEditCodeInfo(row.CurrencyID);
                                                            }}
                                                        >
                                                            儲存
                                                        </Button>
                                                        <Button
                                                            color="error"
                                                            variant="outlined"
                                                            onClick={cancelEdit}
                                                        >
                                                            關閉
                                                        </Button>
                                                    </Box>
                                                </StyledTableCell>
                                            </>
                                        )}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button
                    sx={{ mr: '0.05rem' }}
                    variant="contained"
                    onClick={handleCurrencyManageClose}
                >
                    關閉
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CurrencyManage;
