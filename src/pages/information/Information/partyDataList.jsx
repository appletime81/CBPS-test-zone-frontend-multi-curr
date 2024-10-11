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
    parties,
    getPartiesAllInfo,
    deleteParties,
    editParties,
    submarineCableInfoList,
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

const columns1 = [
    { id: '海纜名稱', label: '海纜名稱', align: 'center' },
    { id: '海纜作業', label: '海纜作業', align: 'center' },
];

const columns2 = [
    {
        id: '會員名稱',
        label: '會員名稱',

        align: 'center',
    },
    { id: '會員代碼', label: '會員代碼', align: 'center' },
    { id: '預付稅款百分比', label: '預付稅款百分比', align: 'center' },
    {
        id: '公司名稱',
        label: '公司名稱',

        align: 'center',
    },
    {
        id: '公司地址',
        label: '公司地址',

        align: 'center',
    },
    {
        id: '聯絡窗口',
        label: '聯絡窗口',

        align: 'center',
    },
    {
        id: '電子郵件',
        label: '電子郵件',

        align: 'center',
    },
    {
        id: '電話',
        label: '電話',

        align: 'center',
    },
];

const columns3 = [
    { id: 'Bank A/C Name', label: 'Bank A/C Name', align: 'center' },
    {
        id: 'Bank Name',
        label: 'Bank Name',
        align: 'center',
    },
    {
        id: 'Branch',
        label: 'Branch',
        align: 'center',
    },
    {
        id: 'Bank Address',
        label: 'Bank Address',
        align: 'center',
    },
];

const columns4 = [
    {
        id: 'A/C No.',
        label: 'A/C No.',
        align: 'center',
    },
    {
        id: 'Saving A/C No.',
        label: 'Saving A/C No.',
        align: 'center',
    },
    {
        id: 'SWIFT Code',
        label: 'SWIFT Code',
        align: 'center',
    },
    {
        id: 'ACH No',
        label: 'ACH No',
        align: 'center',
    },
    {
        id: 'SWIFT Code',
        label: 'SWIFT Code',
        align: 'center',
    },
    {
        id: 'Wire/Routing',
        label: 'Wire/Routing',
        align: 'center',
    },
];

const PartyDataList = ({ infoList, setInfoList }) => {
    const dispatch = useDispatch();
    const [submarineCableList, setSubmarineCableList] = useState([]); //海纜名稱下拉選單
    const [submarineCable, setSubmarineCable] = useState(''); //海纜名稱
    const [workTitle, setWorkTitle] = useState(''); //海纜作業
    const [code, setCode] = useState(''); //代碼
    const [partyName, setPartyName] = useState(''); //會員名稱
    const [address, setAddress] = useState(''); //公司地址
    const [contact, setContact] = useState(''); //聯繫窗口
    const [email, setEmail] = useState(''); //電子郵件
    const [wHTRate, setWHTRate] = useState(''); //預付稅款百分比
    const [tel, setTel] = useState(''); //電話
    const [companyName, setCompanyName] = useState('');
    const [bankAcctName, setBankAcctName] = useState('');
    const [accountNo, setAccountNo] = useState('');
    const [savingAccountNo, setSavingAccountNo] = useState('');
    const [sWIFTCode, setSWIFTCode] = useState('');
    const [iBAN, setIBAN] = useState('');
    const [aCHNo, setACHNo] = useState('');
    const [wireRouting, setWireRouting] = useState('');
    const [bankName, setBankName] = useState('');
    const [branch, setBranch] = useState('');
    const [bankAddress, setBankAddress] = useState('');
    const partyID = useRef(-1);
    const [codeEdit, setCodeEdit] = useState(''); //代碼編輯
    const [submarineCableEdit, setSubmarineCableEdit] = useState(''); //供應商編輯
    const [workTitleEdit, setWorkTitleEdit] = useState(''); //帳號名稱編輯
    const [partyNameEdit, setPartyNameEdit] = useState(''); //銀行帳號編輯
    const [addressEdit, setAddressEdit] = useState(''); //國際銀行代碼編輯
    const [contactEdit, setContactEdit] = useState(''); //國際銀行帳戶號碼編輯
    const [emailEdit, setEmailEdit] = useState(''); //銀行名稱編輯
    const [wHTRateEdit, setWHTRateEdit] = useState(''); //預付稅款百分比編輯
    const [telEdit, setTelEdit] = useState('');
    const [companyNameEdit, setCompanyNameEdit] = useState('');
    const [bankAcctNameEdit, setBankAcctNameEdit] = useState('');
    const [accountNoEdit, setAccountNoEdit] = useState('');
    const [savingAccountNoEdit, setSavingAccountNoEdit] = useState('');
    const [sWIFTCodeEdit, setSWIFTCodeEdit] = useState('');
    const [iBANEdit, setIBANEdit] = useState('');
    const [aCHNoEdit, setACHNoEdit] = useState('');
    const [wireRoutingEdit, setWireRoutingEdit] = useState('');
    const [bankNameEdit, setBankNameEdit] = useState('');
    const [branchEdit, setBranchEdit] = useState('');
    const [bankAddressEdit, setBankAddressEdit] = useState('');

    const [isColumn1Open, setIsColumn1Open] = useState(false);
    const [isColumn2Open, setIsColumn2Open] = useState(false);
    const [isColumn3Open, setIsColumn3Open] = useState(false);
    const [isColumn4Open, setIsColumn4Open] = useState(false);

    const infoInit = () => {
        setSubmarineCable('');
        setWorkTitle('');
        setPartyName('');
        setAddress('');
        setContact('');
        setEmail('');
        setWHTRate('');
        setTel('');
        setCompanyName('');
        setBankAcctName('');
        setAccountNo('');
        setSavingAccountNo('');
        setSWIFTCode('');
        setIBAN('');
        setACHNo('');
        setWireRouting('');
        setBankName('');
        setBranch('');
        setBankAddress('');
        setCode('');
    };

    const editInfoInit = () => {
        partyID.current = -1;
        setSubmarineCableEdit('');
        setWorkTitleEdit('');
        setPartyNameEdit('');
        setAddressEdit('');
        setContactEdit('');
        setEmailEdit('');
        setWHTRateEdit('');
        setTelEdit('');
        setCompanyNameEdit('');
        setBankAcctNameEdit('');
        setAccountNoEdit('');
        setSavingAccountNoEdit('');
        setSWIFTCodeEdit('');
        setIBANEdit('');
        setACHNoEdit('');
        setWireRoutingEdit('');
        setBankNameEdit('');
        setBranchEdit('');
        setBankAddressEdit('');
        setCodeEdit('');
    };

    const queryPartiesInfo = () => {
        fetch(getPartiesAllInfo, {
            method: 'GET',
            Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
        })
            .then((res) => res.json())
            .then((data) => {
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
        if (code === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入會員代碼',
                    },
                }),
            );
            return false;
        }
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
        if (partyName === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入會員名稱',
                    },
                }),
            );
            return false;
        }
        if (wHTRate === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入預付稅款百分比',
                    },
                }),
            );
            return false;
        }
        return true;
    };

    const addPartyInfo = () => {
        if (infoCheck()) {
            let tmpArray = {
                PartyCode: code,
                SubmarineCable: submarineCable,
                WorkTitle: workTitle,
                PartyName: partyName,
                Address: address,
                Contact: contact,
                Email: email,
                WHTRate: wHTRate,
                Tel: tel,
                CompanyName: companyName,
                BankAcctName: bankAcctName,
                BankAcctNo: accountNo,
                SavingAcctNo: savingAccountNo,
                SWIFTCode: sWIFTCode,
                IBAN: iBAN,
                ACHNo: aCHNo,
                WireRouting: wireRouting,
                BankName: bankName,
                Branch: branch,
                BankAddress: bankAddress,
            };
            console.log('', tmpArray);
            fetch(parties, {
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
                                message: '新增會員資料成功',
                            },
                        }),
                    );
                    infoInit();
                    queryPartiesInfo();
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

    const deletePartyInfo = (row) => {
        fetch(deleteParties, {
            method: 'POST',
            body: JSON.stringify(row),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((res) => res.json())
            .then(() => {
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'success',
                            message: '刪除會員資料成功',
                        },
                    }),
                );
                queryPartiesInfo();
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

    const editPartyInfo = (row) => {
        // setEditItem(id);
        partyID.current = row.PartyID;
        setCodeEdit(row.PartyCode);
        setSubmarineCableEdit(row.SubmarineCable);
        setWorkTitleEdit(row.WorkTitle);
        setPartyNameEdit(row.PartyName);
        setAddressEdit(row.Address);
        setContactEdit(row.Contact);
        setEmailEdit(row.Email);
        setWHTRateEdit(row.WHTRate);
        setTelEdit(row.Tel);
        setCompanyNameEdit(row.CompanyName);
        setBankAcctNameEdit(row.BankAcctName);
        setAccountNoEdit(row.BankAcctNo);
        setSavingAccountNoEdit(row.SavingAcctNo);
        setSWIFTCodeEdit(row.SWIFTCode);
        setIBANEdit(row.IBAN);
        setACHNoEdit(row.ACHNo);
        setWireRoutingEdit(row.WireRouting);
        setBankNameEdit(row.BankName);
        setBranchEdit(row.Branch);
        setBankAddressEdit(row.BankAddress);
    };

    const copyPartyInfo = (row) => {
        setCode(row.PartyCode);
        setSubmarineCable(row.SubmarineCable);
        setWorkTitle(row.WorkTitle);
        setPartyName(row.PartyName);
        setAddress(row.Address);
        setContact(row.Contact);
        setEmail(row.Email);
        setWHTRate(row.WHTRate);
        setTel(row.Tel);
        setCompanyName(row.CompanyName);
        setBankAcctName(row.BankAcctName);
        setAccountNo(row.BankAcctNo);
        setSavingAccountNo(row.SavingAcctNo);
        setSWIFTCode(row.SWIFTCode);
        setIBAN(row.IBAN);
        setACHNo(row.ACHNo);
        setWireRouting(row.WireRouting);
        setBankName(row.BankName);
        setBranch(row.Branch);
        setBankAddress(row.BankAddress);
    };

    const editCheck = () => {
        if (codeEdit === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入會員代碼',
                    },
                }),
            );
            return false;
        }
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
        if (partyNameEdit === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入會員名稱',
                    },
                }),
            );
            return false;
        }
        if (wHTRateEdit === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入預付稅款百分比',
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
                PartyID: partyID.current,
                PartyCode: codeEdit,
                SubmarineCable: submarineCableEdit,
                WorkTitle: workTitleEdit,
                PartyName: partyNameEdit,
                Address: addressEdit,
                Contact: contactEdit,
                Email: emailEdit,
                WHTRate: wHTRateEdit,
                Tel: telEdit,
                CompanyName: companyNameEdit,
                BankAcctName: bankAcctNameEdit,
                BankAcctNo: accountNoEdit,
                SavingAcctNo: savingAccountNoEdit,
                SWIFTCode: sWIFTCodeEdit,
                IBAN: iBANEdit,
                ACHNo: aCHNoEdit,
                WireRouting: wireRoutingEdit,
                BankName: bankNameEdit,
                Branch: branchEdit,
                BankAddress: bankAddressEdit,
            };
            fetch(editParties, {
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
                                message: '更新會員資料成功',
                            },
                        }),
                    );
                    editInfoInit();
                    queryPartiesInfo();
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

    const handleCross = (email) => {
        return email.split(';').map((i) => <Box>{i}</Box>);
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
    }, []);

    return (
        <TableContainer id="tableContainer" component={Paper}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow></TableRow>
                    <TableRow>
                        <StyledTableCell align="center">Action</StyledTableCell>
                        <StyledTableCell align="center">NO</StyledTableCell>
                        {isColumn1Open ? (
                            columns1.map((column, id) => {
                                return (
                                    <StyledTableCell key={column.id} align={column.align}>
                                        {id === 0 ? (
                                            <Button
                                                sx={{ p: 0, minWidth: '30px' }}
                                                onClick={() => {
                                                    setIsColumn1Open(!isColumn1Open);
                                                }}
                                            >
                                                {isColumn1Open ? (
                                                    <DoNotDisturbOnIcon />
                                                ) : (
                                                    <AddCircleIcon />
                                                )}
                                            </Button>
                                        ) : null}
                                        {column.label}
                                    </StyledTableCell>
                                );
                            })
                        ) : (
                            <StyledTableCell key={columns1[0].id} align={columns1[0].align}>
                                <Button
                                    sx={{ p: 0, minWidth: '30px' }}
                                    onClick={() => {
                                        setIsColumn1Open(!isColumn1Open);
                                    }}
                                >
                                    {isColumn1Open ? <DoNotDisturbOnIcon /> : <AddCircleIcon />}
                                </Button>
                                {columns1[0].label}
                            </StyledTableCell>
                        )}
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
                                        ) : null}
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
                                        ) : null}
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
                        {isColumn4Open ? (
                            columns4.map((column, id) => {
                                return (
                                    <StyledTableCell key={column.id} align={column.align}>
                                        {id === 0 ? (
                                            <Button
                                                sx={{ p: 0, minWidth: '30px' }}
                                                onClick={() => {
                                                    setIsColumn4Open(!isColumn4Open);
                                                }}
                                            >
                                                {isColumn4Open ? (
                                                    <DoNotDisturbOnIcon />
                                                ) : (
                                                    <AddCircleIcon />
                                                )}
                                            </Button>
                                        ) : null}
                                        {column.label}
                                    </StyledTableCell>
                                );
                            })
                        ) : (
                            <StyledTableCell key={columns4[0].id} align={columns4[0].align}>
                                <Button
                                    sx={{ p: 0, minWidth: '30px' }}
                                    onClick={() => {
                                        setIsColumn4Open(!isColumn4Open);
                                    }}
                                >
                                    {isColumn4Open ? <DoNotDisturbOnIcon /> : <AddCircleIcon />}
                                </Button>
                                {columns4[0].label}
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
                                    flexFlow: isColumn2Open ? 'column' : 'row',
                                    justifyContent: 'center',
                                    '& button': { mx: { md: 0.6, lg: 1, xl: 1.8 }, my: 0.2, p: 0 },
                                }}
                            >
                                <Button color="primary" variant="outlined" onClick={addPartyInfo}>
                                    新增
                                </Button>
                                <Button color="success" variant="outlined" onClick={infoInit}>
                                    清除
                                </Button>
                            </Box>
                        </TableCell>
                        <TableCell align="center"></TableCell>
                        {isColumn1Open ? (
                            <>
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
                                        <MenuItem value={'Upgrade'}>Upgrade</MenuItem>
                                        <MenuItem value={'Construction'}>Construction</MenuItem>
                                        <MenuItem value={'O&M'}>O&M</MenuItem>
                                    </Select>
                                </TableCell>
                            </>
                        ) : (
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
                        )}
                        {isColumn2Open ? (
                            <>
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        value={partyName}
                                        onChange={(e) => {
                                            setPartyName(e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        sx={{ width: '3rem' }}
                                        value={code}
                                        onChange={(e) => {
                                            setCode(e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        value={wHTRate}
                                        onChange={(e) => {
                                            setWHTRate(e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        value={companyName}
                                        onChange={(e) => {
                                            setCompanyName(e.target.value);
                                        }}
                                    />
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
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        value={contact}
                                        onChange={(e) => {
                                            setContact(e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        value={email}
                                        label="多個Email請用;分隔"
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        value={tel}
                                        onChange={(e) => {
                                            setTel(e.target.value);
                                        }}
                                    />
                                </TableCell>
                            </>
                        ) : (
                            <TableCell align="center">
                                <TextField
                                    size="small"
                                    value={partyName}
                                    onChange={(e) => {
                                        setPartyName(e.target.value);
                                    }}
                                />
                            </TableCell>
                        )}
                        {isColumn3Open ? (
                            <>
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        value={bankAcctName}
                                        onChange={(e) => {
                                            setBankAcctName(e.target.value);
                                        }}
                                    />
                                </TableCell>
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
                                        value={bankAddress}
                                        onChange={(e) => {
                                            setBankAddress(e.target.value);
                                        }}
                                    />
                                </TableCell>
                            </>
                        ) : (
                            <TableCell align="center">
                                <TextField
                                    size="small"
                                    value={bankAcctName}
                                    onChange={(e) => {
                                        setBankAcctName(e.target.value);
                                    }}
                                />
                            </TableCell>
                        )}
                        {isColumn4Open ? (
                            <>
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        value={accountNo}
                                        disabled={savingAccountNo?.length > 0 || !!savingAccountNo}
                                        onChange={(e) => {
                                            setAccountNo(e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        value={savingAccountNo}
                                        disabled={accountNo?.length > 0 || !!accountNo}
                                        onChange={(e) => {
                                            setSavingAccountNo(e.target.value);
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
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        value={aCHNo}
                                        onChange={(e) => {
                                            setACHNo(e.target.value);
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
                            </>
                        ) : (
                            <TableCell align="center">
                                <TextField
                                    size="small"
                                    value={accountNo}
                                    onChange={(e) => {
                                        setAccountNo(e.target.value);
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
                                {row.PartyID !== partyID.current ? (
                                    <>
                                        <StyledTableCell align="center">
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexFlow: isColumn2Open ? 'column' : 'row',
                                                    justifyContent: 'center',
                                                    '& button': {
                                                        mx: { md: 0.1, lg: 0.1, xl: 0.2 },
                                                        my: 0.2,
                                                        p: 0,
                                                    },
                                                }}
                                            >
                                                <Button
                                                    color="primary"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        editPartyInfo(row);
                                                    }}
                                                >
                                                    編輯
                                                </Button>
                                                <Button
                                                    color="success"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        copyPartyInfo(row);
                                                    }}
                                                >
                                                    複製
                                                </Button>
                                                <Button
                                                    color="error"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        deletePartyInfo(row);
                                                    }}
                                                >
                                                    刪除
                                                </Button>
                                            </Box>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{id + 1}</StyledTableCell>
                                        {isColumn1Open ? (
                                            <>
                                                <StyledTableCell align="center">
                                                    {row.SubmarineCable}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.WorkTitle}
                                                </StyledTableCell>
                                            </>
                                        ) : (
                                            <StyledTableCell align="center">
                                                {row.SubmarineCable}
                                            </StyledTableCell>
                                        )}
                                        {isColumn2Open ? (
                                            <>
                                                <StyledTableCell align="center">
                                                    {row.PartyName}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.PartyCode}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.WHTRate}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.CompanyName}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.Address}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.Contact}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {handleCross(row.Email)}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.Tel}
                                                </StyledTableCell>
                                            </>
                                        ) : (
                                            <StyledTableCell align="center">
                                                {row.PartyName}
                                            </StyledTableCell>
                                        )}
                                        {isColumn3Open ? (
                                            <>
                                                <StyledTableCell align="center">
                                                    {row.BankAcctName}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.BankName}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.Branch}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.BankAddress}
                                                </StyledTableCell>
                                            </>
                                        ) : (
                                            <StyledTableCell align="center">
                                                {row.BankAcctName}
                                            </StyledTableCell>
                                        )}
                                        {isColumn4Open ? (
                                            <>
                                                <StyledTableCell align="center">
                                                    {row.BankAcctNo}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.SavingAcctNo}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.SWIFTCode}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.IBAN}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.ACHNo}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.WireRouting}
                                                </StyledTableCell>
                                            </>
                                        ) : (
                                            <StyledTableCell align="center">
                                                {row.BankAcctNo}
                                            </StyledTableCell>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <StyledTableCell align="center">
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexFlow: isColumn2Open ? 'column' : 'row',
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
                                                    onClick={saveEditPartyInfo}
                                                >
                                                    儲存
                                                </Button>
                                                <Button
                                                    color="error"
                                                    variant="outlined"
                                                    onClick={editInfoInit}
                                                >
                                                    關閉
                                                </Button>
                                            </Box>
                                        </StyledTableCell>
                                        <TableCell align="center">{id + 1}</TableCell>
                                        {isColumn1Open ? (
                                            <>
                                                <TableCell align="center">
                                                    <Select
                                                        size="small"
                                                        value={submarineCableEdit}
                                                        onChange={(e) =>
                                                            setSubmarineCableEdit(e.target.value)
                                                        }
                                                    >
                                                        {submarineCableList.map((i) => (
                                                            <MenuItem
                                                                key={i.CableName}
                                                                value={i.CableName}
                                                            >
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
                                                        onChange={(e) =>
                                                            setWorkTitleEdit(e.target.value)
                                                        }
                                                    >
                                                        <MenuItem value={'Upgrade'}>
                                                            Upgrade
                                                        </MenuItem>
                                                        <MenuItem value={'Construction'}>
                                                            Construction
                                                        </MenuItem>
                                                        <MenuItem value={'O&M'}>O&M</MenuItem>
                                                    </Select>
                                                </TableCell>
                                            </>
                                        ) : (
                                            <TableCell align="center">
                                                <Select
                                                    size="small"
                                                    value={submarineCableEdit}
                                                    onChange={(e) =>
                                                        setSubmarineCableEdit(e.target.value)
                                                    }
                                                >
                                                    {submarineCableList.map((i) => (
                                                        <MenuItem
                                                            key={i.CableName}
                                                            value={i.CableName}
                                                        >
                                                            {i.CableName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </TableCell>
                                        )}
                                        {isColumn2Open ? (
                                            <>
                                                <TableCell align="center">
                                                    <TextField
                                                        size="small"
                                                        value={partyNameEdit}
                                                        onChange={(e) => {
                                                            setPartyNameEdit(e.target.value);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        sx={{ width: '3rem' }}
                                                        value={codeEdit}
                                                        onChange={(e) => {
                                                            setCodeEdit(e.target.value);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        sx={{ width: '3rem' }}
                                                        value={wHTRateEdit}
                                                        onChange={(e) => {
                                                            setWHTRateEdit(e.target.value);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        size="small"
                                                        value={companyNameEdit}
                                                        onChange={(e) => {
                                                            setCompanyNameEdit(e.target.value);
                                                        }}
                                                    />
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
                                                <TableCell align="center">
                                                    <TextField
                                                        size="small"
                                                        value={contactEdit}
                                                        onChange={(e) => {
                                                            setContactEdit(e.target.value);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        size="small"
                                                        value={emailEdit}
                                                        onChange={(e) => {
                                                            setEmailEdit(e.target.value);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        size="small"
                                                        value={telEdit}
                                                        onChange={(e) => {
                                                            setTelEdit(e.target.value);
                                                        }}
                                                    />
                                                </TableCell>
                                            </>
                                        ) : (
                                            <TableCell align="center">
                                                <TextField
                                                    size="small"
                                                    value={partyNameEdit}
                                                    onChange={(e) => {
                                                        setPartyNameEdit(e.target.value);
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
                                                        value={bankAddressEdit}
                                                        onChange={(e) => {
                                                            setBankAddressEdit(e.target.value);
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
                                        {isColumn4Open ? (
                                            <>
                                                <TableCell align="center">
                                                    <TextField
                                                        size="small"
                                                        value={accountNoEdit}
                                                        disabled={
                                                            savingAccountNoEdit?.length > 0 ||
                                                            !!savingAccountNoEdit
                                                        }
                                                        onChange={(e) => {
                                                            setAccountNoEdit(e.target.value);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        size="small"
                                                        value={savingAccountNoEdit}
                                                        disabled={
                                                            accountNoEdit?.length > 0 ||
                                                            !!accountNoEdit
                                                        }
                                                        onChange={(e) => {
                                                            setSavingAccountNoEdit(e.target.value);
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
                                                <TableCell align="center">
                                                    <TextField
                                                        size="small"
                                                        value={aCHNoEdit}
                                                        onChange={(e) => {
                                                            setACHNoEdit(e.target.value);
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
                                            </>
                                        ) : (
                                            <TableCell align="center">
                                                <TextField
                                                    size="small"
                                                    value={accountNoEdit}
                                                    onChange={(e) => {
                                                        setAccountNoEdit(e.target.value);
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

export default PartyDataList;
