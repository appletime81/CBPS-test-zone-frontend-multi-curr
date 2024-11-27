import { useState, useRef, useEffect } from 'react';

// material-ui
import { Button, Table, TextField, Box, Select, MenuItem } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import {
    corporates,
    getCorporatesInfo,
    deleteCorporates,
    editCorporates,
    submarineCableInfoList,
    getWorkTitle,
} from 'components/apis.jsx';
// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';
// icon
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import AddCircleIcon from '@mui/icons-material/AddCircle';

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

const Corporates = ({ infoList, setInfoList }) => {
    const dispatch = useDispatch();
    const [submarineCableList, setSubmarineCableList] = useState([]); //海纜名稱下拉選單
    const [acctName, setAcctName] = useState(''); //海纜作業
    const [bankAcctNo, setBankAcctNo] = useState(''); //會員名稱
    const [savingbankAcctNo, setSavingBankAcctNo] = useState(''); //銀行帳號2
    const [sWIFTCode, setSWIFTCode] = useState(''); //聯繫窗口
    const [aCHNo, setaCHno] = useState(''); //ACH NO
    const [wireRouting, setWireRouting] = useState(''); //Wire/Routing
    const [branch, setBranch] = useState('');
    const [iBAN, setIBAN] = useState(''); //電子郵件
    const [bankName, setBankName] = useState(''); //電話
    const [address, setAddress] = useState(''); //公司地址
    const [submarineCable, setSubmarineCable] = useState(''); //海纜名稱
    const [workTitle, setWorkTitle] = useState(''); //海纜作業
    const [submarineCableEdit, setSubmarineCableEdit] = useState(''); //供應商編輯
    const [workTitleEdit, setWorkTitleEdit] = useState(''); //帳號名稱編輯
    const [branchAddress, setBranchAddress] = useState('');
    const [branchAddressEdit, setBranchAddressEdit] = useState('');
    const corpID = useRef(-1);
    const [bankAcctNameEdit, setBankAcctNameEdit] = useState(''); //帳號名稱編輯
    const [bankAcctNoEdit, setBankAcctNoEdit] = useState(''); //銀行帳號編輯
    const [savingBankAcctNoEdit, setSavingBankAcctNoEdit] = useState(''); //銀行帳號2編輯
    const [sWIFTCodeEdit, setSWIFTCodeEdit] = useState(''); //國際銀行帳戶號碼編輯
    const [iBANEdit, setIBANEdit] = useState(''); //銀行名稱編輯
    const [bankNameEdit, setBankNameEdit] = useState(''); //銀行地址編輯
    const [addressEdit, setAddressEdit] = useState(''); //國際銀行代碼編輯
    const [aCHNoEdit, setaCHnoEdit] = useState(''); //ACH NO編輯
    const [wireRoutingEdit, setWireRoutingEdit] = useState(''); //Wire/Routing編輯
    const [branchEdit, setBranchEdit] = useState('');
    const [workTitleList, setWorkTitleList] = useState([]); //海纜作業下拉選單
    const [isColumn2Open, setIsColumn2Open] = useState(false);
    const [isColumn3Open, setIsColumn3Open] = useState(false);

    const columns2 = [
        {
            id: 'Bank Name',
            label: 'Bank Name',

            align: 'center',
        },
        { id: 'Branch Name', label: 'Branch Name', align: 'center' },
        {
            id: 'Bank Address',
            label: 'Bank Address',

            align: 'center',
        },
    ];

    const columns3 = [
        {
            id: 'A/C Name',
            label: 'A/C Name',

            align: 'center',
        },
        { id: 'A/C No.', label: 'A/C No.', align: 'center' },
        {
            id: 'Saving A/C No.',
            label: 'Saving A/C No.',

            align: 'center',
        },
        {
            id: 'ACH No',
            label: 'ACH No',

            align: 'center',
        },
        {
            id: 'Wire/Routing',
            label: 'Wire/Routing',

            align: 'center',
        },
        {
            id: 'SWIFT Code',
            label: 'SWIFT Code',

            align: 'center',
        },
        {
            id: 'IBAN',
            label: 'IBAN',

            align: 'center',
        },
    ];

    const infoInit = () => {
        setAcctName('');
        setBankAcctNo('');
        setSWIFTCodeEdit('');
        setSWIFTCode('');
        setIBAN('');
        setBankName('');
        setAddress('');
        setSavingBankAcctNo('');
        setaCHno('');
        setWireRouting('');
        setBranch('');
        setSubmarineCable('');
        setWorkTitle('');
        setBranchAddress('');
    };

    const editInfoInit = () => {
        corpID.current = -1;
        // setCorpNameEdit('');
        setBankAcctNameEdit('');
        setBankAcctNoEdit('');
        setSWIFTCodeEdit('');
        setIBANEdit('');
        setBankNameEdit('');
        setAddressEdit('');
        setSavingBankAcctNoEdit('');
        setaCHnoEdit('');
        setWireRoutingEdit('');
        setBranchEdit('');
        setSubmarineCableEdit('');
        setWorkTitleEdit('');
        setBranchAddressEdit('');
    };

    const queryCorporatesInfo = () => {
        fetch(getCorporatesInfo, {
            method: 'GET',
            Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('取得Corporates資料成功=>', data);
                if (Array.isArray(data)) {
                    setInfoList(data);
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

    const infoCheck = () => {
        if (submarineCable === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入海纜名稱',
                    },
                }),
            );
            return false;
        }
        if (workTitle === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入海纜作業',
                    },
                }),
            );
            return false;
        }
        return true;
    };

    const addCorporatesInfo = () => {
        if (infoCheck()) {
            let tmpArray = {
                BankAcctName: acctName,
                BankAcctNo: bankAcctNo,
                SavingAcctNo: savingbankAcctNo,
                SWIFTCode: sWIFTCode,
                IBAN: iBAN,
                ACHNo: aCHNo,
                WireRouting: wireRouting,
                BankName: bankName,
                Branch: branch,
                Address: address,
                SubmarineCable: submarineCable,
                WorkTitle: workTitle,
                BranchAddress: branchAddress,
            };
            console.log('', tmpArray);
            fetch(corporates, {
                method: 'POST',
                body: JSON.stringify(tmpArray),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
                },
            })
                .then((res) => res.json())
                .then(() => {
                    dispatch(
                        setMessageStateOpen({
                            messageStateOpen: {
                                isOpen: true,
                                severity: 'success',
                                message: '新增聯盟金融帳戶資料成功',
                            },
                        }),
                    );
                    infoInit();
                    queryCorporatesInfo();
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

    const deleteCorporatesInfo = (row) => {
        fetch(deleteCorporates, {
            method: 'POST',
            body: JSON.stringify(row),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
            },
        })
            .then((res) => res.json())
            .then(() => {
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'success',
                            message: '刪除聯盟金融帳戶資料成功',
                        },
                    }),
                );
                queryCorporatesInfo();
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

    const editCorporatesInfo = (row) => {
        corpID.current = row.CorpID;
        setBankAcctNameEdit(row.BankAcctName);
        setBankAcctNoEdit(row.BankAcctNo);
        setSWIFTCodeEdit(row.SWIFTCode);
        setIBANEdit(row.IBAN);
        setBankNameEdit(row.BankName);
        setAddressEdit(row.Address);
        setSavingBankAcctNoEdit(row.SavingAcctNo);
        setaCHnoEdit(row.ACHNo);
        setWireRoutingEdit(row.WireRouting);
        setBranchEdit(row.Branch);
        setSubmarineCableEdit(row.SubmarineCable);
        setWorkTitleEdit(row.WorkTitle);
        setBranchAddressEdit(row.BranchAddress);
    };

    const editCheck = () => {
        if (submarineCableEdit === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入海纜名稱',
                    },
                }),
            );
            return false;
        }
        if (workTitleEdit === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入海纜作業',
                    },
                }),
            );
            return false;
        }
        return true;
    };

    const saveEditCorporatesInfo = () => {
        if (editCheck()) {
            let tmpArray = {
                CorpID: corpID.current,
                BankAcctName: bankAcctNameEdit,
                BankAcctNo: bankAcctNoEdit,
                SavingAcctNo: savingBankAcctNoEdit,
                SWIFTCode: sWIFTCodeEdit,
                IBAN: iBANEdit,
                ACHNo: aCHNoEdit,
                WireRouting: wireRoutingEdit,
                BankName: bankNameEdit,
                Branch: branchEdit,
                Address: addressEdit,
                SubmarineCable: submarineCableEdit,
                WorkTitle: workTitleEdit,
                BranchAddress: branchAddressEdit,
            };
            fetch(editCorporates, {
                method: 'POST',
                body: JSON.stringify(tmpArray),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
                },
            })
                .then((res) => res.json())
                .then(() => {
                    dispatch(
                        setMessageStateOpen({
                            messageStateOpen: {
                                isOpen: true,
                                severity: 'success',
                                message: '更新聯盟金融帳戶資料成功',
                            },
                        }),
                    );
                    editInfoInit();
                    queryCorporatesInfo();
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

    useEffect(() => {
        //海纜名稱
        fetch(submarineCableInfoList, { method: 'GET' })
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
                            message: '網路異常，請檢查網路連線或與系統窗口聯絡',
                        },
                    }),
                );
            });
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
                            message: '網路異常，請檢查網路連線或與系統窗口聯絡',
                        },
                    }),
                );
            });
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 300 }} stickyHeader>
                <TableHead>
                    <TableRow sx={{ fontSize: '50px' }}>
                        <StyledTableCell align="center">Action</StyledTableCell>
                        <StyledTableCell align="center">NO</StyledTableCell>
                        <StyledTableCell align="center">海纜名稱</StyledTableCell>
                        <StyledTableCell align="center">海纜作業</StyledTableCell>
                        <StyledTableCell align="center">地址</StyledTableCell>
                        {isColumn2Open ? (
                            columns2.map((column, id) => {
                                return (
                                    <StyledTableCell key={column.id} align={column.align}>
                                        {id === 0 ? (
                                            <Button
                                                sx={{ p: 0, minWidth: '30px' }}
                                                onClick={() => {
                                                    setIsColumn2Open(!isColumn2Open);
                                                }}
                                            >
                                                {isColumn2Open ? (
                                                    <DoNotDisturbOnIcon />
                                                ) : (
                                                    <AddCircleIcon />
                                                )}
                                            </Button>
                                        ) : (
                                            ''
                                        )}
                                        {column.label}
                                    </StyledTableCell>
                                );
                            })
                        ) : (
                            <StyledTableCell key={columns2[0].id} align={columns2[0].align}>
                                <Button
                                    sx={{ p: 0, minWidth: '30px' }}
                                    onClick={() => {
                                        setIsColumn2Open(!isColumn2Open);
                                    }}
                                >
                                    {isColumn2Open ? <DoNotDisturbOnIcon /> : <AddCircleIcon />}
                                </Button>
                                {columns2[0].label}
                            </StyledTableCell>
                        )}
                        {isColumn3Open ? (
                            columns3.map((column, id) => {
                                return (
                                    <StyledTableCell key={column.id} align={column.align}>
                                        {id === 0 ? (
                                            <Button
                                                sx={{ p: 0, minWidth: '30px' }}
                                                onClick={() => {
                                                    setIsColumn3Open(!isColumn3Open);
                                                }}
                                            >
                                                {isColumn3Open ? (
                                                    <DoNotDisturbOnIcon />
                                                ) : (
                                                    <AddCircleIcon />
                                                )}
                                            </Button>
                                        ) : (
                                            ''
                                        )}
                                        {column.label}
                                    </StyledTableCell>
                                );
                            })
                        ) : (
                            <StyledTableCell key={columns3[0].id} align={columns3[0].align}>
                                <Button
                                    sx={{ p: 0, minWidth: '30px' }}
                                    onClick={() => {
                                        setIsColumn3Open(!isColumn3Open);
                                    }}
                                >
                                    {isColumn3Open ? <DoNotDisturbOnIcon /> : <AddCircleIcon />}
                                </Button>
                                {columns3[0].label}
                            </StyledTableCell>
                        )}
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
                                <Button
                                    color="success"
                                    variant="outlined"
                                    onClick={addCorporatesInfo}
                                >
                                    新增
                                </Button>
                            </Box>
                        </TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center">
                            <Select
                                size="small"
                                value={submarineCable}
                                onChange={(e) => setSubmarineCable(e.target.value)}
                            >
                                {submarineCableList.map((i) => (
                                    <MenuItem key={i.CableName} value={i.CableName}>
                                        {i.CableName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </TableCell>
                        <TableCell align="center">
                            <Select
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
                        </TableCell>
                        <TableCell align="center">
                            <TextField
                                size="small"
                                value={address}
                                onChange={(e) => {
                                    setAddress(e.target.value);
                                }}
                            />
                        </TableCell>
                        {isColumn2Open ? (
                            <>
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        value={bankName}
                                        onChange={(e) => {
                                            setBankName(e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        value={branch}
                                        onChange={(e) => {
                                            setBranch(e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        // value={bankAddress}
                                        value={branchAddress}
                                        onChange={(e) => {
                                            // setBankAddress(e.target.value);
                                            setBranchAddress(e.target.value);
                                        }}
                                    />
                                </TableCell>
                            </>
                        ) : (
                            <TableCell align="center">
                                <TextField
                                    size="small"
                                    value={bankName}
                                    onChange={(e) => {
                                        setBankName(e.target.value);
                                    }}
                                />
                            </TableCell>
                        )}
                        {isColumn3Open ? (
                            <>
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        value={acctName}
                                        onChange={(e) => {
                                            setAcctName(e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        value={bankAcctNo}
                                        disabled={
                                            savingbankAcctNo?.length > 0 || !!savingbankAcctNo
                                        }
                                        onChange={(e) => {
                                            setBankAcctNo(e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        value={savingbankAcctNo}
                                        disabled={bankAcctNo?.length > 0 || !!bankAcctNo}
                                        onChange={(e) => {
                                            setSavingBankAcctNo(e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        value={aCHNo}
                                        onChange={(e) => {
                                            setaCHno(e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        value={wireRouting}
                                        onChange={(e) => {
                                            setWireRouting(e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        value={sWIFTCode}
                                        onChange={(e) => {
                                            setSWIFTCode(e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        value={iBAN}
                                        onChange={(e) => {
                                            setIBAN(e.target.value);
                                        }}
                                    />
                                </TableCell>
                            </>
                        ) : (
                            <TableCell align="center">
                                <TextField
                                    size="small"
                                    value={acctName}
                                    onChange={(e) => {
                                        setAcctName(e.target.value);
                                    }}
                                />
                            </TableCell>
                        )}
                    </TableRow>
                    {infoList?.map((row, id) => {
                        return (
                            <TableRow
                                key={row.SubmarineCable + id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {row.CorpID !== corpID.current ? (
                                    <>
                                        <StyledTableCell align="center">
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexFlow: 'column',
                                                    justifyContent: 'center',
                                                    '& button': {
                                                        mx: { md: 0.6, lg: 1, xl: 1.8 },
                                                        my: 0.2,
                                                        p: 0,
                                                    },
                                                }}
                                            >
                                                <Button
                                                    color="primary"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        editCorporatesInfo(row);
                                                    }}
                                                >
                                                    編輯
                                                </Button>
                                                <Button
                                                    color="error"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        deleteCorporatesInfo(row);
                                                    }}
                                                >
                                                    刪除
                                                </Button>
                                            </Box>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{id + 1}</StyledTableCell>
                                        <StyledTableCell align="center">
                                            {row.SubmarineCable}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {row.WorkTitle}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {row.Address}
                                        </StyledTableCell>
                                        {isColumn2Open ? (
                                            <>
                                                <StyledTableCell align="center">
                                                    {row.BankName}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.Branch}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.BranchAddress}
                                                </StyledTableCell>
                                            </>
                                        ) : (
                                            <StyledTableCell align="center">
                                                {row.BankName}
                                            </StyledTableCell>
                                        )}
                                        {isColumn3Open ? (
                                            <>
                                                <StyledTableCell align="center">
                                                    {row.BankAcctName}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.BankAcctNo}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.SavingAcctNo}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.ACHNo}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.WireRouting}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.SWIFTCode}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.IBAN}
                                                </StyledTableCell>
                                            </>
                                        ) : (
                                            <StyledTableCell align="center">
                                                {row.BankAcctName}
                                            </StyledTableCell>
                                        )}
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
                                                        saveEditCorporatesInfo();
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
                                        <TableCell sx={{ fontSize: '0.5rem' }} align="center">
                                            {id + 1}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Select
                                                size="small"
                                                value={submarineCableEdit}
                                                onChange={(e) =>
                                                    setSubmarineCableEdit(e.target.value)
                                                }
                                            >
                                                {submarineCableList.map((i) => (
                                                    <MenuItem key={i.CableName} value={i.CableName}>
                                                        {i.CableName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Select
                                                size="small"
                                                value={workTitleEdit}
                                                label="填寫海纜作業"
                                                onChange={(e) => setWorkTitleEdit(e.target.value)}
                                            >
                                                <MenuItem value={'Upgrade'}>Upgrade</MenuItem>
                                                <MenuItem value={'Construction'}>
                                                    Construction
                                                </MenuItem>
                                                <MenuItem value={'O&M'}>O&M</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell align="center">
                                            <TextField
                                                size="small"
                                                value={addressEdit}
                                                onChange={(e) => {
                                                    setAddressEdit(e.target.value);
                                                }}
                                            />
                                        </TableCell>
                                        {isColumn2Open ? (
                                            <>
                                                <TableCell align="center">
                                                    <TextField
                                                        size="small"
                                                        value={bankNameEdit}
                                                        onChange={(e) => {
                                                            setBankNameEdit(e.target.value);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        size="small"
                                                        value={branchEdit}
                                                        onChange={(e) => {
                                                            setBranchEdit(e.target.value);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        size="small"
                                                        // value={bankAddressEdit}
                                                        value={branchAddressEdit}
                                                        onChange={(e) => {
                                                            // setBankAddressEdit(e.target.value);
                                                            setBranchAddressEdit(e.target.value);
                                                        }}
                                                    />
                                                </TableCell>
                                            </>
                                        ) : (
                                            <TableCell align="center">
                                                <TextField
                                                    size="small"
                                                    value={bankNameEdit}
                                                    onChange={(e) => {
                                                        setBankNameEdit(e.target.value);
                                                    }}
                                                />
                                            </TableCell>
                                        )}
                                        {isColumn3Open ? (
                                            <>
                                                <TableCell align="center">
                                                    <TextField
                                                        size="small"
                                                        value={bankAcctNameEdit}
                                                        onChange={(e) => {
                                                            setBankAcctNameEdit(e.target.value);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        size="small"
                                                        value={bankAcctNoEdit}
                                                        disabled={
                                                            savingBankAcctNoEdit?.length > 0 ||
                                                            !!savingBankAcctNoEdit
                                                        }
                                                        onChange={(e) => {
                                                            setBankAcctNoEdit(e.target.value);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        size="small"
                                                        value={savingBankAcctNoEdit}
                                                        disabled={
                                                            bankAcctNoEdit?.length > 0 ||
                                                            !!bankAcctNoEdit
                                                        }
                                                        onChange={(e) => {
                                                            setSavingBankAcctNoEdit(e.target.value);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        size="small"
                                                        value={aCHNoEdit}
                                                        onChange={(e) => {
                                                            setaCHnoEdit(e.target.value);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        size="small"
                                                        value={wireRoutingEdit}
                                                        onChange={(e) => {
                                                            setWireRoutingEdit(e.target.value);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        size="small"
                                                        value={sWIFTCodeEdit}
                                                        onChange={(e) => {
                                                            setSWIFTCodeEdit(e.target.value);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        size="small"
                                                        value={iBANEdit}
                                                        onChange={(e) => {
                                                            setIBANEdit(e.target.value);
                                                        }}
                                                    />
                                                </TableCell>
                                            </>
                                        ) : (
                                            <TableCell align="center">
                                                <TextField
                                                    size="small"
                                                    value={bankAcctNameEdit}
                                                    onChange={(e) => {
                                                        setBankAcctNameEdit(e.target.value);
                                                    }}
                                                />
                                            </TableCell>
                                        )}
                                    </>
                                )}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default Corporates;
