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
    suppliers,
    supplierNameList,
    deleteSuppliers,
    editSuppliers,
    submarineCableInfoList,
} from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

// icon
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const SupplierDataList = ({ infoList, setInfoList }) => {
    const dispatch = useDispatch();
    const [submarineCableList, setSubmarineCableList] = useState([]); //海纜名稱下拉選單
    // const [infoList, setInfoList] = useState([]);
    const [supplierName, setSupplierName] = useState(''); //供應商
    const [bankAcctName, setBankAcctName] = useState(''); //帳號名稱
    const [bankAcctNo, setBankAcctNo] = useState(''); //銀行帳號
    const [savingbankAcctNo, setSavingBankAcctNo] = useState(''); //銀行帳號
    const [sWIFTCode, setSWIFTCode] = useState(''); //國際銀行代碼
    const [iBAN, setIBAN] = useState(''); //國際銀行帳戶號碼
    const [bankName, setBankName] = useState(''); //銀行名稱
    const [branch, setBranch] = useState(''); //分行名稱
    const [bankAddress, setBankAddress] = useState(''); //銀行地址
    const [aCHNo, setaCHno] = useState(''); //ACH NO
    const [wireRouting, setWireRouting] = useState(''); //Wire/Routing
    const supplierID = useRef(-1);
    const [supplierNameEdit, setSupplierNameEdit] = useState(''); //供應商編輯
    const [bankAcctNameEdit, setBankAcctNameEdit] = useState(''); //帳號名稱編輯
    const [bankAcctNoEdit, setBankAcctNoEdit] = useState(''); //銀行帳號1編輯
    const [savingBankAcctNoEdit, setSavingBankAcctNoEdit] = useState(''); //銀行帳號2編輯
    const [sWIFTCodeEdit, setSWIFTCodeEdit] = useState(''); //國際銀行代碼編輯
    const [iBANEdit, setIBANEdit] = useState(''); //國際銀行帳戶號碼編輯
    const [bankNameEdit, setBankNameEdit] = useState(''); //銀行名稱編輯
    const [branchEdit, setBranchEdit] = useState(''); //分行名稱
    const [bankAddressEdit, setBankAddressEdit] = useState(''); //銀行地址編輯
    const [aCHNoEdit, setaCHnoEdit] = useState(''); //ACH NO編輯
    const [wireRoutingEdit, setWireRoutingEdit] = useState(''); //Wire/Routing編輯
    const [companyName, setCompanyName] = useState(''); //供應商全名
    const [companyNameEdit, setCompanyNameEdit] = useState('');
    const [submarineCable, setSubmarineCable] = useState(''); //海纜名稱
    const [workTitle, setWorkTitle] = useState(''); //海纜作業
    const [submarineCableEdit, setSubmarineCableEdit] = useState(''); //海纜名稱
    const [workTitleEdit, setWorkTitleEdit] = useState(''); //海纜作業
    const [isColumn1Open, setIsColumn1Open] = useState(false);
    const [isColumn2Open, setIsColumn2Open] = useState(false);
    const [isColumn3Open, setIsColumn3Open] = useState(false);

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
        { id: '供應商簡稱', label: '供應商簡稱', align: 'center' },
        { id: '供應商全名', label: '供應商全名', align: 'center' },
    ];

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
        setSupplierName('');
        setBankAcctName('');
        setBankAcctNo('');
        setSWIFTCode('');
        setIBAN('');
        setBankName('');
        setBankAddress('');
        setSavingBankAcctNo('');
        setaCHno('');
        setWireRouting('');
        setCompanyName('');
        setSubmarineCable('');
        setWorkTitle('');
    };

    const editInfoInit = () => {
        supplierID.current = -1;
        setSupplierNameEdit('');
        setBankAcctNameEdit('');
        setBankAcctNoEdit('');
        setSWIFTCodeEdit('');
        setIBANEdit('');
        setBankNameEdit('');
        setBankAddressEdit('');
        setSavingBankAcctNoEdit('');
        setWireRoutingEdit('');
        setaCHnoEdit('');
        setCompanyNameEdit('');
        setSubmarineCableEdit('');
        setWorkTitleEdit('');
    };

    const querySuppliersInfo = () => {
        fetch(supplierNameList, { method: 'GET' })
            .then((res) => res.json())
            .then((data) => {
                console.log('取得Suppliers資料成功=>', data);
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
        if (supplierName === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入供應商簡稱',
                    },
                }),
            );
            return false;
        }
        if (companyName === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入供應商全名',
                    },
                }),
            );
            return false;
        }
        return true;
    };

    const addSupplierInfo = () => {
        if (infoCheck()) {
            let tmpArray = {
                SupplierName: supplierName,
                CompanyName: companyName,
                BankAcctName: bankAcctName,
                Branch: branch,
                BankAcctNo: bankAcctNo,
                SavingAcctNo: savingbankAcctNo,
                SWIFTCode: sWIFTCode,
                IBAN: iBAN,
                BankName: bankName,
                BankAddress: bankAddress,
                ACHNo: aCHNo,
                WireRouting: wireRouting,
                SubmarineCable: submarineCable,
                WorkTitle: workTitle,
            };
            fetch(suppliers, {
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
                                message: '新增供應商資料成功',
                            },
                        }),
                    );
                    infoInit();
                    querySuppliersInfo();
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

    const deleteSupplierInfo = (row) => {
        fetch(deleteSuppliers, {
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
                            message: '刪除供應商資料成功',
                        },
                    }),
                );
                querySuppliersInfo();
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

    const editSupplierInfo = (row) => {
        supplierID.current = row.SupplierID;
        setSupplierNameEdit(row.SupplierName);
        setBankAcctNameEdit(row.BankAcctName);
        setBranchEdit(row.Branch);
        setBankAcctNoEdit(row.BankAcctNo);
        setSWIFTCodeEdit(row.SWIFTCode);
        setIBANEdit(row.IBAN);
        setBankNameEdit(row.BankName);
        setBankAddressEdit(row.BankAddress);
        setaCHnoEdit(row.ACHNo);
        setWireRoutingEdit(row.WireRouting);
        setCompanyNameEdit(row.CompanyName);
        setSubmarineCableEdit(row.SubmarineCable);
        setWorkTitleEdit(row.WorkTitle);
        setSavingBankAcctNoEdit(row.SavingAcctNo);
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
        if (supplierNameEdit === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入供應商簡稱',
                    },
                }),
            );
            return false;
        }
        if (companyNameEdit === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入供應商全名',
                    },
                }),
            );
            return false;
        }
        return true;
    };

    const saveEditSupplierInfo = () => {
        if (editCheck()) {
            let tmpArray = {
                SupplierID: supplierID.current,
                SupplierName: supplierNameEdit,
                CompanyName: companyNameEdit,
                BankAcctName: bankAcctNameEdit,
                Branch: branchEdit,
                BankAcctNo: bankAcctNoEdit,
                SavingAcctNo: savingBankAcctNoEdit,
                SWIFTCode: sWIFTCodeEdit,
                IBAN: iBANEdit,
                BankName: bankNameEdit,
                BankAddress: bankAddressEdit,
                ACHNo: aCHNoEdit,
                WireRouting: wireRoutingEdit,
                SubmarineCable: submarineCableEdit,
                WorkTitle: workTitleEdit,
            };
            fetch(editSuppliers, {
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
                                message: '更新供應商資料成功',
                            },
                        }),
                    );
                    editInfoInit();
                    querySuppliersInfo();
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
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 300 }} stickyHeader>
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">Action</StyledTableCell>
                        <StyledTableCell align="center">No.</StyledTableCell>
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
                                    onClick={addSupplierInfo}
                                >
                                    新增
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
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        // style={{ width: '30%' }}
                                        value={supplierName}
                                        onChange={(e) => {
                                            setSupplierName(e.target.value);
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        size="small"
                                        // style={{ width: '30%' }}
                                        value={companyName}
                                        onChange={(e) => {
                                            setCompanyName(e.target.value);
                                        }}
                                    />
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
                                        value={bankAcctName}
                                        onChange={(e) => {
                                            setBankAcctName(e.target.value);
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
                                    value={bankAcctName}
                                    onChange={(e) => {
                                        setBankAcctName(e.target.value);
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
                                {row.SupplierID !== supplierID.current ? (
                                    <>
                                        <StyledTableCell align="center">
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    '& button': {
                                                        mx: { md: 0.1, lg: 0.1, xl: 0.2 },
                                                        p: 0,
                                                    },
                                                }}
                                            >
                                                <Button
                                                    color="primary"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        editSupplierInfo(row);
                                                    }}
                                                >
                                                    編輯
                                                </Button>
                                                <Button
                                                    color="error"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        deleteSupplierInfo(row);
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
                                                <StyledTableCell align="center">
                                                    {row.SupplierName}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.CompanyName}
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
                                                        mx: { md: 0.1, lg: 0.1, xl: 1 },
                                                        p: 0,
                                                    },
                                                }}
                                            >
                                                <Button
                                                    color="primary"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        saveEditSupplierInfo();
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
                                                <TableCell align="center">
                                                    <TextField
                                                        size="small"
                                                        // style={{ width: '30%' }}
                                                        value={supplierNameEdit}
                                                        onChange={(e) => {
                                                            setSupplierNameEdit(e.target.value);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        size="small"
                                                        // style={{ width: '30%' }}
                                                        value={companyNameEdit}
                                                        onChange={(e) => {
                                                            setCompanyNameEdit(e.target.value);
                                                        }}
                                                    />
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

export default SupplierDataList;
