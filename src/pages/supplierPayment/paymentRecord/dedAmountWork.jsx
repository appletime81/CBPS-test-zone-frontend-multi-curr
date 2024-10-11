import { useState, useRef, useEffect } from 'react';
import React from 'react';
import PropTypes from 'prop-types';

// project import
import { handleNumber, BootstrapDialogTitle } from 'components/commonFunction';
import MainCard from 'components/MainCard';
// material-ui
import {
  Typography,
  Button,
  Table,
  Dialog,
  DialogContent,
  Grid,
  DialogActions,
  TextField,
} from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

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
  [`&.${tableCellClasses.body}.totalAmount`]: {
    fontSize: 14,
    paddingTop: '0.2rem',
    paddingBottom: '0.2rem',
    backgroundColor: '#CFD8DC',
  },
}));

const DedAmountWork = ({
  isDedDialogOpen,
  handleDedDialogClose,
  editCMList,
  invoiceNo,
  dueDate,
  saveDedAmountEdit,
}) => {
  const [cmListInfo, setCMListInfo] = useState([]); //帳單明細檔
  const dedAmountTotal = useRef(0); //折抵金額

  const initData = () => {
    dedAmountTotal.current = 0;
  };

  const changeDedAmount = (dedAmount, invoiceNo) => {
    dedAmountTotal.current = 0;
    let tmpArray = cmListInfo.map((i) => i);
    tmpArray.forEach((i) => {
      if (i.InvoiceNo === invoiceNo) {
        i.DedAmount = Number(dedAmount);
      }
      dedAmountTotal.current = dedAmountTotal.current + (i.DedAmount ? i.DedAmount : i.CurrAmount);
    });
    setCMListInfo(tmpArray);
  };

  const handleSaveEdit = () => {
    let tmpArray = cmListInfo.map((i) => i);
    tmpArray.forEach((i) => {
      i.DedAmount = i.DedAmount ? i.DedAmount : i.CurrAmount;
    });
    saveDedAmountEdit(tmpArray, dedAmountTotal.current);
  };

  const handleTmpSaveEdit = () => {
    saveDedAmountEdit(editCMList);
  };

  useEffect(() => {
    let tmpArray = JSON.parse(JSON.stringify(editCMList));
    tmpArray.forEach((i) => {
      console.log(i.DedAmount, i.ReceivedAmount, i.PaidAmount);
      dedAmountTotal.current = dedAmountTotal.current + Number(i.CurrAmount);
    });
    if (isDedDialogOpen) {
      setCMListInfo(tmpArray);
    }
  }, [isDedDialogOpen]);

  return (
    <Dialog maxWidth="xxl" open={isDedDialogOpen}>
      <BootstrapDialogTitle>發票金額減項列表</BootstrapDialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ fontSize: 10 }}
        >
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Grid
              container
              spacing={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ fontSize: 10 }}
            >
              <Grid item sm={1} md={1} lg={1}>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { lg: '0.7rem', xl: '0.88rem' },
                    display: 'flex',
                    justifyContent: 'end',
                  }}
                >
                  發票號碼：
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} md={2} lg={2}>
                <TextField
                  value={invoiceNo}
                  fullWidth
                  disabled={true}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item sm={1} md={1} lg={1}>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { lg: '0.7rem', xl: '0.88rem' },
                    display: 'flex',
                    justifyContent: 'end',
                  }}
                >
                  發票到期日：
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} md={2} lg={2}>
                <TextField
                  value={dayjs(dueDate).format('YYYY/MM/DD')}
                  fullWidth
                  disabled={true}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={5} sm={5} md={5} lg={5} />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <MainCard title="帳單明細列表">
              <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                <Table sx={{ minWidth: 300 }} stickyHeader>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">來源發票號碼</StyledTableCell>
                      <StyledTableCell align="center">供應商</StyledTableCell>
                      <StyledTableCell align="center">海纜名稱</StyledTableCell>
                      <StyledTableCell align="center">海纜作業</StyledTableCell>
                      <StyledTableCell align="center">CM種類</StyledTableCell>
                      <StyledTableCell align="center">可折抵金額</StyledTableCell>
                      <StyledTableCell align="center">摘要說明</StyledTableCell>
                      <StyledTableCell align="center">折抵金額</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cmListInfo?.map((row) => {
                      let tmpDedAmount = row.DedAmount ? row.DedAmount : row.CurrAmount;
                      return (
                        <TableRow
                          key={row.InvoiceNo + row?.BillMasterID + row?.BillDetailID}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell align="center">{row?.InvoiceNo}</TableCell>
                          <TableCell align="center">{row?.SupplierName}</TableCell>
                          <TableCell align="center">{row?.SubmarineCable}</TableCell>
                          <TableCell align="center">{row.WorkTitle}</TableCell>
                          {/* <TableCell align="center">{row.BillMilestone}</TableCell> */}
                          <TableCell align="center">{row.CMType}</TableCell>
                          <TableCell align="center">{row.CurrAmount}</TableCell>
                          <TableCell align="center">{row.Note}</TableCell>
                          <TableCell align="center">
                            <TextField
                              size="small"
                              inputProps={{ step: '.01' }}
                              sx={{ minWidth: 75 }}
                              value={handleNumber(tmpDedAmount.toFixed(2))}
                              type="number"
                              onChange={(e) => {
                                changeDedAmount(e.target.value, row.InvoiceNo);
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <StyledTableCell className="totalAmount" align="center">
                        Total
                      </StyledTableCell>
                      <StyledTableCell className="totalAmount" align="center" />
                      {/* <StyledTableCell className="totalAmount" align="center" /> */}
                      <StyledTableCell className="totalAmount" align="center" />
                      <StyledTableCell className="totalAmount" align="center" />
                      <StyledTableCell className="totalAmount" align="center" />
                      <StyledTableCell className="totalAmount" align="center" />
                      <StyledTableCell className="totalAmount" align="center" />
                      <StyledTableCell className="totalAmount" align="center">
                        {handleNumber(dedAmountTotal.current.toFixed(2))}
                      </StyledTableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </MainCard>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <>
          <Button
            sx={{ mr: '0.05rem' }}
            variant="contained"
            onClick={() => {
              handleSaveEdit();
              initData();
            }}
          >
            儲存
          </Button>
          <Button
            sx={{ mr: '0.05rem' }}
            variant="contained"
            onClick={() => {
              handleDedDialogClose();
              // handleTmpSaveEdit();
              initData();
            }}
          >
            關閉
          </Button>
        </>
      </DialogActions>
    </Dialog>
  );
};

export default DedAmountWork;

DedAmountWork.propTypes = {
  actionName: React.String,
  invoiceNo: React.String,
  dueDate: PropTypes.instanceOf(Date),
  editCMList: React.Array,
  saveDedAmountEdit: React.func,
  handleDedDialogClose: React.func,
  isDedDialogOpen: React.bool,
};
