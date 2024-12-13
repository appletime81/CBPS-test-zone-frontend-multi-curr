import { useState, useRef } from 'react';

// project import
// material-ui
import { Button, Table, TextField, Box } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import { addWorkTitle, deleteWorkTitle, getWorkTitle, updateWorkTitle } from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const WorkTitleDataList = ({ infoList, setInfoList, getWorkTitleList }) => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState(''); //海纜名稱
    const [titleCode, setTitleCode] = useState(''); //代碼
    const [note, setNote] = useState(''); //摘要
    const titleIDEdit = useRef(-1);
    const [titleCodeEdit, setTitleCodeEdit] = useState(''); //代碼編輯
    const [titleEdit, setTitleEdit] = useState(''); //供應商編輯
    const [noteEdit, setNoteEdit] = useState(''); //帳號名稱編輯

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            // backgroundColor: theme.palette.common.gary,
            color: theme.palette.common.black,
            paddingTop: '0rem',
            paddingBottom: '0rem',
            fontSize: '0.7rem',
        },
        [`&.${tableCellClasses.body}`]: {
            paddingTop: '0.1rem',
            paddingBottom: '0.1rem',
            fontSize: '0.7rem',
        },
    }));

    const infoCheck = () => {
        if (title === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入海纜作業名稱',
                    },
                }),
            );
            return false;
        }
        if (titleCode === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入海纜作業代號',
                    },
                }),
            );
            return false;
        }
        return true;
    };

    const infoInit = () => {
        setTitleCode('');
        setTitle('');
        setNote('');
    };

    const editInfoInit = () => {
        titleIDEdit.current = -1;
        setTitleCodeEdit('');
        setTitleEdit('');
        setNoteEdit('');
    };

    const queryWorkTitleInfo = () => {
        fetch(getWorkTitle, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
            },
            body: JSON.stringify({}),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('data=>>', data);
                if (Array.isArray(data)) {
                    setInfoList(data);
                } else {
                    setInfoList([]);
                }
            })
            .catch(() => {
                setInfoList([]);
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

    const addInfo = () => {
        if (infoCheck()) {
            let tmpArray = {
                TitleCode: titleCode,
                Title: title,
                Note: note,
            };
            fetch(addWorkTitle, {
                method: 'POST',
                body: JSON.stringify(tmpArray),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
                },
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
                                    severity: 'error',
                                    message: '新增失敗',
                                },
                            }),
                        );
                    }
                    if (data.TitleID) {
                        dispatch(
                            setMessageStateOpen({
                                messageStateOpen: {
                                    isOpen: true,
                                    severity: 'success',
                                    message: '新增海纜資料成功',
                                },
                            }),
                        );
                        infoInit();
                        queryWorkTitleInfo();
                    }
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
        }
    };

    const deleteInfo = (titleID) => {
        fetch(deleteWorkTitle, {
            method: 'POST',
            body: JSON.stringify({ TitleID: titleID }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
            },
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
                                message: '刪除海纜資料成功',
                            },
                        }),
                    );
                    queryWorkTitleInfo();
                }
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

    const editInfo = (row) => {
        titleIDEdit.current = row.TitleID;
        setTitleCodeEdit(row.TitleCode);
        setTitleEdit(row.Title);
        setNoteEdit(row.Note);
    };

    const editCheck = () => {
        if (titleEdit === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入海纜作業名稱',
                    },
                }),
            );
            return false;
        }
        return true;
    };

    const saveEditPartyInfo = () => {
        if (editCheck()) {
            let tmpArray = {
                TitleID: titleIDEdit.current,
                TitleCode: titleCodeEdit,
                Title: titleEdit,
                Note: noteEdit,
            };
            fetch(updateWorkTitle, {
                method: 'POST',
                body: JSON.stringify(tmpArray),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
                },
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
                                    message: '更新海纜作業資料成功',
                                },
                            }),
                        );
                        editInfoInit();
                        queryWorkTitleInfo();
                    }
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
        }
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 300 }} stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">Action</StyledTableCell>
                            <StyledTableCell align="center">NO</StyledTableCell>
                            <StyledTableCell align="center">海纜作業代碼</StyledTableCell>
                            <StyledTableCell align="center">海纜作業名稱</StyledTableCell>
                            <StyledTableCell align="center">摘要</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell align="center">
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        '& button': { mx: { md: 0.6, lg: 1, xl: 1.8 }, p: 0 },
                                    }}
                                >
                                    <Button color="success" variant="outlined" onClick={addInfo}>
                                        新增
                                    </Button>
                                </Box>
                            </TableCell>
                            <TableCell align="center"></TableCell>
                            <TableCell align="center">
                                <TextField
                                    size="small"
                                    value={titleCode}
                                    onChange={(e) => {
                                        setTitleCode(e.target.value);
                                    }}
                                />
                            </TableCell>
                            <TableCell align="center">
                                <TextField
                                    size="small"
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                    }}
                                />
                            </TableCell>
                            <TableCell align="center">
                                <TextField
                                    size="small"
                                    value={note}
                                    onChange={(e) => {
                                        setNote(e.target.value);
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        {infoList?.map((row, id) => {
                            return (
                                <TableRow
                                    key={row.TitleCode + id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    {row.TitleID !== titleIDEdit.current ? (
                                        <>
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
                                                            editInfo(row);
                                                        }}
                                                    >
                                                        編輯
                                                    </Button>
                                                    <Button
                                                        color="error"
                                                        variant="outlined"
                                                        onClick={() => {
                                                            deleteInfo(row.TitleID);
                                                        }}
                                                    >
                                                        刪除
                                                    </Button>
                                                </Box>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {id + 1}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {row.TitleCode}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {row.Title}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {row.Note}
                                            </StyledTableCell>
                                        </>
                                    ) : (
                                        <>
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
                                                            saveEditPartyInfo();
                                                        }}
                                                    >
                                                        儲存
                                                    </Button>
                                                    <Button
                                                        color="error"
                                                        variant="outlined"
                                                        onClick={() => {
                                                            editInfoInit();
                                                        }}
                                                    >
                                                        關閉
                                                    </Button>
                                                </Box>
                                            </StyledTableCell>
                                            <TableCell align="center">{id + 1}</TableCell>
                                            <StyledTableCell align="center">
                                                {row.TitleCode}
                                            </StyledTableCell>
                                            <TableCell align="center">
                                                <TextField
                                                    size="small"
                                                    value={titleEdit}
                                                    onChange={(e) => {
                                                        setTitleEdit(e.target.value);
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <TextField
                                                    size="small"
                                                    value={noteEdit}
                                                    onChange={(e) => {
                                                        setNoteEdit(e.target.value);
                                                    }}
                                                />
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default WorkTitleDataList;
