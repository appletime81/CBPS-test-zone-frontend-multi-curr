import { useState } from 'react';

// project import
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { handleNumber } from 'components/commonFunction';
import { BootstrapDialogTitle } from 'components/commonFunction';

// material-ui
import { Button, Table, Dialog, DialogContent, DialogActions, Grid } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { TableContainer, TableHead, TableBody, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

const ReturnDataList = ({ isReturnOpen, handleReturnClose, returnDataList, actionBack }) => {
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

  return (
    <Dialog maxWidth="md" fullWidth open={isReturnOpen}>
      <BootstrapDialogTitle>
        {actionBack === '退回' ? '有帳單存在不能退回' : '有帳單存在不能作廢'}
      </BootstrapDialogTitle>
      <DialogContent>
        <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TableContainer component={Paper} sx={{ maxHeight: 640 }}>
              <Table sx={{ minWidth: 300 }} stickyHeader>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">NO</StyledTableCell>
                    <StyledTableCell align="center">帳單號碼</StyledTableCell>
                    <StyledTableCell align="center">海纜名稱</StyledTableCell>
                    <StyledTableCell align="center">海纜作業</StyledTableCell>
                    <StyledTableCell align="center">會員</StyledTableCell>
                    <StyledTableCell align="center">發票日期</StyledTableCell>
                    <StyledTableCell align="center">發票到期日</StyledTableCell>
                    <StyledTableCell align="center">總金額</StyledTableCell>
                    <StyledTableCell align="center">已實收金額</StyledTableCell>
                    <StyledTableCell align="center">手續費</StyledTableCell>
                    <StyledTableCell align="center">供應商</StyledTableCell>
                    <StyledTableCell align="center">是否為pro-forma</StyledTableCell>
                    <StyledTableCell align="center">Status</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {returnDataList?.INITIAL?.map((row, itemID) => {
                    return (
                      <TableRow
                        key={row.InvoiceWKMaster?.WKMasterID + row.InvoiceWKMaster?.InvoiceNo}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <StyledTableCell align="center">{itemID + 1}</StyledTableCell>
                        <StyledTableCell align="center">{row?.BillingNo}</StyledTableCell>
                        <StyledTableCell align="center">{row?.SubmarineCable}</StyledTableCell>
                        <StyledTableCell align="center">{row?.WorkTitle}</StyledTableCell>
                        <StyledTableCell align="center">{row?.PartyName}</StyledTableCell>
                        <StyledTableCell align="center">
                          {dayjs(row?.IssueDate).format('YYYY/MM/DD')}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {dayjs(row?.DueDate).format('YYYY/MM/DD')}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {handleNumber(row?.FeeAmountSum.toFixed(2))}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {handleNumber(row?.ReceivedAmountSum.toFixed(2))}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row?.BankFees ? handleNumber(row?.BankFees.toFixed(2)) : 0}
                        </StyledTableCell>
                        <StyledTableCell align="center">{row?.IsPro ? '是' : '否'}</StyledTableCell>
                        <StyledTableCell align="center">待抵扣</StyledTableCell>
                      </TableRow>
                    );
                  })}
                  {returnDataList?.RATED?.map((row, itemID) => {
                    return (
                      <TableRow
                        key={row.InvoiceWKMaster?.WKMasterID + row.InvoiceWKMaster?.InvoiceNo}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <StyledTableCell align="center">{itemID + 1}</StyledTableCell>
                        <StyledTableCell align="center">{row?.BillingNo}</StyledTableCell>
                        <StyledTableCell align="center">{row?.SubmarineCable}</StyledTableCell>
                        <StyledTableCell align="center">{row?.WorkTitle}</StyledTableCell>
                        <StyledTableCell align="center">{row?.PartyName}</StyledTableCell>
                        <StyledTableCell align="center">
                          {dayjs(row?.IssueDate).format('YYYY/MM/DD')}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {dayjs(row?.DueDate).format('YYYY/MM/DD')}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {handleNumber(row?.FeeAmountSum.toFixed(2))}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {handleNumber(row?.ReceivedAmountSum.toFixed(2))}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row?.BankFees ? handleNumber(row?.BankFees.toFixed(2)) : 0}
                        </StyledTableCell>
                        <StyledTableCell align="center">{row?.IsPro ? '是' : '否'}</StyledTableCell>
                        <StyledTableCell align="center">已抵扣</StyledTableCell>
                      </TableRow>
                    );
                  })}
                  {returnDataList?.SIGNED?.map((row, itemID) => {
                    return (
                      <TableRow
                        key={row.InvoiceWKMaster?.WKMasterID + row.InvoiceWKMaster?.InvoiceNo}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <StyledTableCell align="center">{itemID + 1}</StyledTableCell>
                        <StyledTableCell align="center">{row?.BillingNo}</StyledTableCell>
                        <StyledTableCell align="center">{row?.SubmarineCable}</StyledTableCell>
                        <StyledTableCell align="center">{row?.WorkTitle}</StyledTableCell>
                        <StyledTableCell align="center">{row?.PartyName}</StyledTableCell>
                        <StyledTableCell align="center">
                          {dayjs(row?.IssueDate).format('YYYY/MM/DD')}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {dayjs(row?.DueDate).format('YYYY/MM/DD')}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {handleNumber(row?.FeeAmountSum.toFixed(2))}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {handleNumber(row?.ReceivedAmountSum.toFixed(2))}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row?.BankFees ? handleNumber(row?.BankFees.toFixed(2)) : 0}
                        </StyledTableCell>
                        <StyledTableCell align="center">{row?.IsPro ? '是' : '否'}</StyledTableCell>
                        <StyledTableCell align="center">已簽核</StyledTableCell>
                      </TableRow>
                    );
                  })}
                  {returnDataList?.TO_WRITEOFF?.map((row, itemID) => {
                    return (
                      <TableRow
                        key={row.InvoiceWKMaster?.WKMasterID + row.InvoiceWKMaster?.InvoiceNo}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <StyledTableCell align="center">{itemID + 1}</StyledTableCell>
                        <StyledTableCell align="center">{row?.BillingNo}</StyledTableCell>
                        <StyledTableCell align="center">{row?.SubmarineCable}</StyledTableCell>
                        <StyledTableCell align="center">{row?.WorkTitle}</StyledTableCell>
                        <StyledTableCell align="center">{row?.PartyName}</StyledTableCell>
                        <StyledTableCell align="center">
                          {dayjs(row?.IssueDate).format('YYYY/MM/DD')}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {dayjs(row?.DueDate).format('YYYY/MM/DD')}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {handleNumber(row?.FeeAmountSum.toFixed(2))}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {handleNumber(row?.ReceivedAmountSum.toFixed(2))}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row?.BankFees ? handleNumber(row?.BankFees.toFixed(2)) : 0}
                        </StyledTableCell>
                        <StyledTableCell align="center">{row?.IsPro ? '是' : '否'}</StyledTableCell>
                        <StyledTableCell align="center">待銷帳</StyledTableCell>
                      </TableRow>
                    );
                  })}
                  {returnDataList?.COMPLETE?.map((row, itemID) => {
                    return (
                      <TableRow
                        key={row.InvoiceWKMaster?.WKMasterID + row.InvoiceWKMaster?.InvoiceNo}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <StyledTableCell align="center">{itemID + 1}</StyledTableCell>
                        <StyledTableCell align="center">{row?.BillingNo}</StyledTableCell>
                        <StyledTableCell align="center">{row?.SubmarineCable}</StyledTableCell>
                        <StyledTableCell align="center">{row?.WorkTitle}</StyledTableCell>
                        <StyledTableCell align="center">{row?.PartyName}</StyledTableCell>
                        <StyledTableCell align="center">
                          {dayjs(row?.IssueDate).format('YYYY/MM/DD')}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {dayjs(row?.DueDate).format('YYYY/MM/DD')}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {handleNumber(row?.FeeAmountSum.toFixed(2))}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {handleNumber(row?.ReceivedAmountSum.toFixed(2))}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row?.BankFees ? handleNumber(row?.BankFees.toFixed(2)) : 0}
                        </StyledTableCell>
                        <StyledTableCell align="center">{row?.IsPro ? '是' : '否'}</StyledTableCell>
                        <StyledTableCell align="center">已銷帳</StyledTableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button sx={{ mr: '0.05rem' }} variant="contained" onClick={handleReturnClose}>
          關閉
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReturnDataList;
