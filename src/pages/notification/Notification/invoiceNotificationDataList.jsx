// import { useState } from 'react';

// project import
import RuleAdd from './ruleAdd';

// material-ui
import { Button, Table, Box } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

import { deleteSysInvNotifyRule } from 'components/apis.jsx';

const InvoiceNotificationDataList = ({ listInfo, partiesList, submarineCableList, initQuery }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editData, setEditData] = useState({});
    const actionName = useRef('');
    const dispatch = useDispatch();

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

    const handleAddRuleClose = () => {
        setIsDialogOpen(false);
    };

    const handleView = (row) => {
        actionName.current = 'View';
        setIsDialogOpen(true);
        setEditData(row);
    };

    const handleEdit = (row) => {
        actionName.current = 'Edit';
        setIsDialogOpen(true);
        setEditData(row);
    };

    const handleDelete = (id) => {
        console.log('id=>>', id);
        let tmpArray = {
            RuleID: id,
        };
        fetch(deleteSysInvNotifyRule, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
            },
            body: JSON.stringify(tmpArray),
        })
            .then((res) => res.json())
            .then(() => {
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'success',
                            message: '刪除成功',
                        },
                    }),
                );
                initQuery();
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

    return (
        <>
            <RuleAdd
                isDialogOpen={isDialogOpen}
                handleAddRuleClose={handleAddRuleClose}
                value={1}
                partiesList={partiesList}
                submarineCableList={submarineCableList}
                editData={editData}
                action={actionName.current}
                initQuery={initQuery}
            />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 300 }} stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">NO</StyledTableCell>
                            <StyledTableCell align="center">規則英文名稱</StyledTableCell>
                            <StyledTableCell align="center">規則中文名稱</StyledTableCell>
                            <StyledTableCell align="center">海纜名稱</StyledTableCell>
                            <StyledTableCell align="center">海纜作業</StyledTableCell>
                            <StyledTableCell align="center">提醒對象種類</StyledTableCell>
                            <StyledTableCell align="center">到期日</StyledTableCell>
                            <StyledTableCell align="center">
                                到期日之前的第一門檻天數
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                到期日之前的第二門檻天數
                            </StyledTableCell>
                            <StyledTableCell align="center">到期日之後的門檻天數</StyledTableCell>
                            <StyledTableCell align="center">是否以Email通知</StyledTableCell>
                            <StyledTableCell align="center">是否以Web通知</StyledTableCell>
                            <StyledTableCell align="center">是否以SMS通知</StyledTableCell>
                            <StyledTableCell align="center">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listInfo?.map((row, id) => {
                            return (
                                <TableRow
                                    key={
                                        row.SysInvNotifyRule.RuleName +
                                        row.SysInvNotifyRule.RuleCName
                                    }
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <StyledTableCell align="center">{id + 1}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.SysInvNotifyRule.RuleName}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.SysInvNotifyRule.RuleCName}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.SysInvNotifyRule.SubmarineCable}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.SysInvNotifyRule.WorkTitle}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.SysInvNotifyRule.NotifyTarget}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {dayjs(row.SysInvNotifyRule.ColumnName).format(
                                            'YYYY/MM/DD',
                                        )}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.SysInvNotifyRule.Days1BeforeDue}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.SysInvNotifyRule.Days2BeforeDue}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.SysInvNotifyRule.DaysAfterDue}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.SysInvNotifyRule.Email ? '√' : ''}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.SysInvNotifyRule.Web ? '√' : ''}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.SysInvNotifyRule.SMS ? '√' : ''}
                                    </StyledTableCell>
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
                                                color="success"
                                                variant="outlined"
                                                onClick={() => handleView(row)}
                                            >
                                                檢視
                                            </Button>
                                            <Button
                                                color="primary"
                                                variant="outlined"
                                                onClick={() => handleEdit(row)}
                                            >
                                                編輯
                                            </Button>
                                            <Button
                                                color="error"
                                                variant="outlined"
                                                onClick={() =>
                                                    handleDelete(row.SysInvNotifyRule.RuleID)
                                                }
                                            >
                                                刪除
                                            </Button>
                                        </Box>
                                    </StyledTableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default InvoiceNotificationDataList;
