import { useState, useRef, useEffect } from 'react';

// project import
import { handleNumber } from 'components/commonFunction';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// material-ui
import { Button, Table, TextField, Box, FormControl } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { alpha, styled } from '@mui/material/styles';

import dayjs from 'dayjs';

import { addCorporates, getCorporatesInfo, deleteCorporates, editCorporates } from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const GeneratedDataList = ({}) => {
    // 暫時用不到
    const dispatch = useDispatch();
    const fakeData = [
        {
            CorpID: 1,
            CorpName: 'NEC',
            SubmarineCable: '+886',
            CreateDate: '2023/1/1'
        },
        {
            CorpID: 2,
            CorpName: 'NEC#2',
            SubmarineCable: '+888',
            CreateDate: '2023/2/2'
        }
    ];
    const [infoList, setInfoList] = useState(fakeData);
    const [corpName, setCorpName] = useState(''); //聯盟名稱
    const [submarineCable, setSubmarineCable] = useState(''); //海纜代號
    const [createDate, setCreateDate] = useState(new Date()); //成立日期
    const corpID = useRef(-1);
    const [corpNameEdit, setCorpNameEdit] = useState(''); //供應商編輯
    const [submarineCableEdit, setSubmarineCableEdit] = useState(''); //帳號名稱編輯
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
        setCorpName('');
        setSubmarineCable('');
        setCreateDate(new Date());
    };

    const editInfoInit = () => {
        corpID.current = -1;
        setCorpNameEdit('');
        setSubmarineCableEdit('');
        setCreateDateEdit(new Date());
    };

    const queryCorporatesInfo = () => {
        fetch(getCorporatesInfo, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('取得Corporates資料成功=>', data);
                if (Array.isArray(data)) {
                    setInfoList(data);
                }
            })
            .catch((e) => console.log('e1=>', e));
    };

    const addPartyInfo = () => {
        let tmpArray = {
            CorpName: corpName,
            SubmarineCable: submarineCable,
            CreateDate: dayjs(createDate).format('YYYY-MM-DD HH:mm:ss')
        };
        console.log('', tmpArray);
        fetch(addCorporates, { method: 'POST', body: JSON.stringify(tmpArray), headers: { 'Content-Type': 'application/json' } })
            .then((res) => res.json())
            .then(() => {
                dispatch(setMessageStateOpen({ messageStateOpen: { isOpen: true, severity: 'success', message: '新增聯盟資料成功' } }));
                infoInit();
                queryCorporatesInfo();
            })
            .catch((e) => console.log('e1=>', e));
    };

    const deletePartyInfo = (row) => {
        fetch(deleteCorporates, { method: 'POST', body: JSON.stringify(row), headers: { 'Content-Type': 'application/json' } })
            .then((res) => res.json())
            .then(() => {
                dispatch(setMessageStateOpen({ messageStateOpen: { isOpen: true, severity: 'success', message: '刪除聯盟資料成功' } }));
                queryCorporatesInfo();
            })
            .catch((e) => console.log('e1=>', e));
    };

    const editPartyInfo = (row) => {
        // setEditItem(id);
        corpID.current = row.CorpID;
        setCorpNameEdit(row.CorpName);
        setSubmarineCableEdit(row.SubmarineCable);
        setCreateDateEdit(row.CreateDate);
    };

    const saveEditPartyInfo = () => {
        let tmpArray = {
            CorpID: corpID.current,
            CorpName: corpNameEdit,
            SubmarineCable: submarineCableEdit,
            CreateDate: dayjs(createDateEdit).format('YYYY-MM-DD HH:mm:ss')
        };
        console.log('123=>>', tmpArray);
        fetch(editCorporates, { method: 'POST', body: JSON.stringify(tmpArray), headers: { 'Content-Type': 'application/json' } })
            .then((res) => res.json())
            .then(() => {
                dispatch(setMessageStateOpen({ messageStateOpen: { isOpen: true, severity: 'success', message: '更新聯盟資料成功' } }));
                editInfoInit();
                queryCorporatesInfo();
            })
            .catch((e) => console.log('e1=>', e));
    };

    useEffect(() => {
        queryCorporatesInfo();
    }, []);

    return (
        <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
            <Table sx={{ minWidth: 300 }} stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">NO</StyledTableCell>
                        <StyledTableCell align="center">聯盟名稱</StyledTableCell>
                        <StyledTableCell align="center">海纜代號</StyledTableCell>
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
                                {row.CorpID !== corpID.current ? (
                                    <>
                                        <StyledTableCell align="center">{id + 1}</StyledTableCell>
                                        <StyledTableCell align="center">{row.CorpName}</StyledTableCell>
                                        <StyledTableCell align="center">{row.SubmarineCable}</StyledTableCell>
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
                                                        editPartyInfo(row);
                                                    }}
                                                >
                                                    編輯
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
                                    </>
                                ) : (
                                    <>
                                        <TableCell align="center">{id + 1}</TableCell>
                                        <TableCell align="center">
                                            <TextField
                                                size="small"
                                                // style={{ width: '30%' }}
                                                value={corpNameEdit}
                                                onChange={(e) => {
                                                    setCorpNameEdit(e.target.value);
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
                                            {/* <TextField
                                                size="small"
                                                value={createDateEdit}
                                                onChange={(e) => {
                                                    setCreateDateEdit(e.target.value);
                                                }}
                                            /> */}
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
                                value={corpName}
                                onChange={(e) => {
                                    setCorpName(e.target.value);
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
                            {/* <TextField
                                size="small"
                                value={createDate}
                                onChange={(e) => {
                                    setCreateDate(e.target.value);
                                }}
                            /> */}
                            <FormControl>
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
                            </FormControl>
                        </TableCell>
                        <TableCell align="center">
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    '& button': { mx: { md: 0.6, lg: 1, xl: 1.8 }, p: 0, fontSize: 1 }
                                }}
                            >
                                <Button color="success" variant="outlined" onClick={addPartyInfo}>
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

export default GeneratedDataList;
