import { useState, useRef, useEffect } from 'react';

// project import
import { handleNumber } from 'components/commonFunction';
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

import { addPartiesByContract, getPartiesByContractInfo, deletePartiesByContract, editPartiesByContract } from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const SuppliersByContractDataList = ({}) => {
    const dispatch = useDispatch();
    const fakeData = [
        {
            ContractID: 1,
            SupplierName: 'NEC'
        },
        {
            ContractID: 2,
            SupplierName: 'NEC#2'
        }
    ];
    const [infoList, setInfoList] = useState(fakeData);
    const [supplierName, setSupplierName] = useState(''); //海纜名稱
    const contractID = useRef(-1);
    const [supplierNameEdit, setSupplierNameEdit] = useState(''); //供應商編輯

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
        setSupplierName('');
    };

    const editInfoInit = () => {
        contractID.current = -1;
        setSupplierNameEdit('');
    };

    const queryPartiesByContractInfo = () => {
        fetch(getPartiesByContractInfo, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('取得合約廠商資料成功=>', data);
                if (Array.isArray(data)) {
                    setInfoList(data);
                }
            })
            .catch((e) => console.log('e1=>', e));
    };

    const addSuppliersByContractInfo = () => {
        let tmpArray = {
            SupplierName: supplierName
        };
        console.log('', tmpArray);
        fetch(addPartiesByContract, { method: 'POST', body: JSON.stringify(tmpArray), headers: { 'Content-Type': 'application/json' } })
            .then((res) => res.json())
            .then(() => {
                dispatch(setMessageStateOpen({ messageStateOpen: { isOpen: true, severity: 'success', message: '新增合約廠商資料成功' } }));
                infoInit();
                queryPartiesByContractInfo();
            })
            .catch((e) => console.log('e1=>', e));
    };

    const deleteSuppliersByContractInfo = (row) => {
        fetch(deletePartiesByContract, { method: 'POST', body: JSON.stringify(row), headers: { 'Content-Type': 'application/json' } })
            .then((res) => res.json())
            .then(() => {
                dispatch(setMessageStateOpen({ messageStateOpen: { isOpen: true, severity: 'success', message: '刪除合約廠商資料成功' } }));
                queryPartiesByContractInfo();
            })
            .catch((e) => console.log('e1=>', e));
    };

    const editSuppliersByContractInfo = (row) => {
        contractID.current = row.ContractID;
        setSupplierNameEdit(row.SupplierName);
    };

    const saveEditSuppliersByContractInfo = () => {
        let tmpArray = {
            CorpID: contractID.current,
            SupplierName: supplierNameEdit
        };
        console.log('123=>>', tmpArray);
        fetch(editPartiesByContract, { method: 'POST', body: JSON.stringify(tmpArray), headers: { 'Content-Type': 'application/json' } })
            .then((res) => res.json())
            .then(() => {
                dispatch(setMessageStateOpen({ messageStateOpen: { isOpen: true, severity: 'success', message: '更新合約廠商資料成功' } }));
                editInfoInit();
                queryPartiesByContractInfo();
            })
            .catch((e) => console.log('e1=>', e));
    };

    useEffect(() => {
        queryPartiesByContractInfo();
    }, []);

    return (
        <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
            <Table sx={{ minWidth: 300 }} stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">NO</StyledTableCell>
                        <StyledTableCell align="center">供應商名稱</StyledTableCell>
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
                                        <StyledTableCell align="center">{row.SupplierName}</StyledTableCell>
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
                                                        editSuppliersByContractInfo(row);
                                                    }}
                                                >
                                                    編輯
                                                </Button>
                                                <Button
                                                    color="error"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        deleteSuppliersByContractInfo(row);
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
                                                value={supplierNameEdit}
                                                onChange={(e) => {
                                                    setSupplierNameEdit(e.target.value);
                                                }}
                                            />
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
                                                        saveEditSuppliersByContractInfo();
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
                                value={supplierName}
                                onChange={(e) => {
                                    setSupplierName(e.target.value);
                                }}
                            />
                        </TableCell>
                        <TableCell align="center">
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    '& button': { mx: { md: 0.6, lg: 1, xl: 1.8 }, p: 0, fontSize: 1 }
                                }}
                            >
                                <Button color="success" variant="outlined" onClick={addSuppliersByContractInfo}>
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

export default SuppliersByContractDataList;
