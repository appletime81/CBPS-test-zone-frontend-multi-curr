import { useState, useRef, useEffect } from 'react';

// project import
import { handleNumber } from 'components/commonFunction';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// material-ui
import { Button, Table, TextField, Box } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { alpha, styled } from '@mui/material/styles';

import dayjs from 'dayjs';

import { addContracts, getContractsInfo, deleteContracts, editContracts } from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const ContractDataList = ({}) => {
    const dispatch = useDispatch();
    const fakeData = [
        {
            ContractID: 1,
            ContractName: 'NEC',
            SubmarineCable: '+886',
            WorkTitle: 'Upgrade',
            CreateDate: '2023/1/1'
        },
        {
            ContractID: 2,
            ContractName: 'NEC#2',
            SubmarineCable: '+888',
            WorkTitle: 'Upgrade',
            CreateDate: '2023/2/2'
        }
    ];
    const [infoList, setInfoList] = useState(fakeData);
    const [contractName, setContractName] = useState(''); //聯盟名稱
    const [submarineCable, setSubmarineCable] = useState(''); //海纜代號
    const [workTitle, setWorkTitle] = useState(''); //海纜作業
    const [createDate, setCreateDate] = useState(new Date()); //成立日期
    const contractID = useRef(-1);
    const [contractNameEdit, setContractNameEdit] = useState(''); //供應商編輯
    const [submarineCableEdit, setSubmarineCableEdit] = useState(''); //帳號名稱編輯
    const [workTitleEdit, setWorkTitleEdit] = useState(''); //海纜作業
    const [createDateEdit, setCreateDateEdit] = useState(new Date()); //銀行帳號編輯

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

    const infoInit = () => {
        setContractName('');
        setSubmarineCable('');
        setWorkTitle('');
        setCreateDate('');
    };

    const editInfoInit = () => {
        contractID.current = -1;
        setContractNameEdit('');
        setSubmarineCableEdit('');
        setCreateDateEdit('');
        setWorkTitleEdit('');
    };

    const queryContractsInfo = () => {
        fetch(getContractsInfo, { method: 'GET' })
            .then((res) => res.json())
            .then((data) => {
                console.log('取得合約資料成功=>', data);
                if (Array.isArray(data)) {
                    setInfoList(data);
                }
            })
            .catch((e) => console.log('e1=>', e));
    };

    const addContractsInfo = () => {
        let tmpArray = {
            ContractName: contractName,
            SubmarineCable: submarineCable,
            WorkTitle: workTitle,
            CreateDate: dayjs(createDate).format('YYYY-MM-DD HH:mm:ss')
        };
        console.log('', tmpArray);
        fetch(addContracts, { method: 'POST', body: JSON.stringify(tmpArray), headers: { 'Content-Type': 'application/json' } })
            .then((res) => res.json())
            .then(() => {
                dispatch(setMessageStateOpen({ messageStateOpen: { isOpen: true, severity: 'success', message: '新增合約資料成功' } }));
                infoInit();
                queryContractsInfo();
            })
            .catch((e) => console.log('e1=>', e));
    };

    const deleteContractsInfo = (row) => {
        fetch(deleteContracts, { method: 'POST', body: JSON.stringify(row), headers: { 'Content-Type': 'application/json' } })
            .then((res) => res.json())
            .then(() => {
                dispatch(setMessageStateOpen({ messageStateOpen: { isOpen: true, severity: 'success', message: '刪除合約資料成功' } }));
                queryContractsInfo();
            })
            .catch((e) => console.log('e1=>', e));
    };

    const editContractsInfo = (row) => {
        // setEditItem(id);
        contractID.current = row.ContractID;
        setContractNameEdit(row.ContractName);
        setSubmarineCableEdit(row.SubmarineCable);
        setWorkTitleEdit(row.WorkTitle);
        setCreateDateEdit(row.CreateDate);
    };

    const saveEditContractsInfo = () => {
        let tmpArray = {
            ContractID: contractID.current,
            ContractName: contractNameEdit,
            SubmarineCable: submarineCableEdit,
            WorkTitle: workTitleEdit,
            CreateDate: dayjs(createDateEdit).format('YYYY-MM-DD HH:mm:ss')
        };
        console.log('123=>>', tmpArray);
        fetch(editContracts, { method: 'POST', body: JSON.stringify(tmpArray), headers: { 'Content-Type': 'application/json' } })
            .then((res) => res.json())
            .then(() => {
                dispatch(setMessageStateOpen({ messageStateOpen: { isOpen: true, severity: 'success', message: '更新合約資料成功' } }));
                editInfoInit();
                queryContractsInfo();
            })
            .catch((e) => console.log('e1=>', e));
    };

    useEffect(() => {
        queryContractsInfo();
    }, []);

    return (
        <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
            <Table sx={{ minWidth: 300 }} stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">NO</StyledTableCell>
                        <StyledTableCell align="center">聯盟名稱</StyledTableCell>
                        <StyledTableCell align="center">海纜代號</StyledTableCell>
                        <StyledTableCell align="center">海纜作業</StyledTableCell>
                        <StyledTableCell align="center">成立日期</StyledTableCell>
                        <StyledTableCell align="center">Action</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {infoList?.map((row, id) => {
                        return (
                            <TableRow
                                // key={row.InvoiceWKMaster?.WKMasterID + row.InvoiceWKMaster?.InvoiceNo}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {row.ContractID !== contractID.current ? (
                                    <>
                                        <StyledTableCell align="center">{id + 1}</StyledTableCell>
                                        <StyledTableCell align="center">{row.ContractName}</StyledTableCell>
                                        <StyledTableCell align="center">{row.SubmarineCable}</StyledTableCell>
                                        <StyledTableCell align="center">{row.WorkTitle}</StyledTableCell>
                                        <StyledTableCell align="center">{row.CreateDate}</StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    '& button': { mx: { md: 0.6, lg: 1, xl: 1.8 }, p: 0, fontSize: 1 }
                                                }}
                                            >
                                                <Button
                                                    color="primary"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        editContractsInfo(row);
                                                    }}
                                                >
                                                    編輯
                                                </Button>
                                                <Button
                                                    color="error"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        deleteContractsInfo(row);
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
                                                value={contractNameEdit}
                                                onChange={(e) => {
                                                    setContractNameEdit(e.target.value);
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <TextField
                                                size="small"
                                                value={submarineCableEdit}
                                                onChange={(e) => {
                                                    setSubmarineCableEdit(e.target.value);
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <TextField
                                                size="small"
                                                value={workTitleEdit}
                                                onChange={(e) => {
                                                    setWorkTitleEdit(e.target.value);
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DesktopDatePicker
                                                    inputFormat="YYYY/MM/DD"
                                                    value={createDateEdit}
                                                    onChange={(e) => {
                                                        setCreateDateEdit(e);
                                                    }}
                                                    renderInput={(params) => <TextField size="small" {...params} />}
                                                />
                                            </LocalizationProvider>
                                        </TableCell>
                                        <StyledTableCell align="center">
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    '& button': { mx: { md: 0.6, lg: 1, xl: 1.8 }, p: 0, fontSize: 1 }
                                                }}
                                            >
                                                <Button
                                                    color="primary"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        saveEditContractsInfo();
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
                                    </>
                                )}
                            </TableRow>
                        );
                    })}
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center">
                            <TextField
                                size="small"
                                // style={{ width: '30%' }}
                                value={contractName}
                                onChange={(e) => {
                                    setContractName(e.target.value);
                                }}
                            />
                        </TableCell>
                        <TableCell align="center">
                            <TextField
                                size="small"
                                value={submarineCable}
                                onChange={(e) => {
                                    setSubmarineCable(e.target.value);
                                }}
                            />
                        </TableCell>
                        <TableCell align="center">
                            <TextField
                                size="small"
                                value={workTitle}
                                onChange={(e) => {
                                    setWorkTitle(e.target.value);
                                }}
                            />
                        </TableCell>
                        <TableCell align="center">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    inputFormat="YYYY/MM/DD"
                                    value={createDate}
                                    onChange={(e) => {
                                        setCreateDate(e);
                                    }}
                                    renderInput={(params) => <TextField size="small" {...params} />}
                                />
                            </LocalizationProvider>
                        </TableCell>
                        <TableCell align="center">
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    '& button': { mx: { md: 0.6, lg: 1, xl: 1.8 }, p: 0, fontSize: 1 }
                                }}
                            >
                                <Button color="success" variant="outlined" onClick={addContractsInfo}>
                                    新增
                                </Button>
                            </Box>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ContractDataList;
