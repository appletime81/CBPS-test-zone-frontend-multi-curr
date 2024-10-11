import { useState } from 'react';

// project import
import { handleNumber } from 'components/commonFunction';
import MainCard from 'components/MainCard';
import { StyledEngineProvider, CssVarsProvider } from '@mui/joy/styles';
import Textarea from '@mui/joy/Textarea';
// material-ui
import { Typography, Button, Table, Checkbox, Grid } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

// import CreditBalanceView from './CreditMemoView';
// import CreditBalanceTerminate from './CreditMemoTerminate';
import dayjs from 'dayjs';

const CreditBalanceToCN = ({ listInfo, setIsDialogOpen, deletelistInfoItem }) => {
  const [cbView, setCbview] = useState(false);
  const [cbTerminal, setCbTerminal] = useState(false);
  const [summary, setSummary] = useState('');
  const [cbToCn, setCbToCn] = useState({}); //處理狀態
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

  const handleViewClose = () => {
    setCbview(false);
  };

  const handleTerminalClose = () => {
    setCbTerminal(false);
  };

  const handleChange = (event) => {
    setCbToCn({ ...cbToCn, [event.target.name]: event.target.checked });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
          <Table sx={{ minWidth: 300 }} stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell align="center"></StyledTableCell>
                <StyledTableCell align="center">NO</StyledTableCell>
                <StyledTableCell align="center">CB種類</StyledTableCell>
                <StyledTableCell align="center">會員</StyledTableCell>
                <StyledTableCell align="center">發票號碼</StyledTableCell>
                <StyledTableCell align="center">帳單號碼</StyledTableCell>
                <StyledTableCell align="center">剩餘金額</StyledTableCell>
                <StyledTableCell align="center">摘要說明</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listInfo?.map((row, id) => {
                return (
                  <TableRow
                    key={row.CBType + id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="center">
                      <Checkbox
                        name={id}
                        onChange={handleChange}
                        checked={cbToCn.id || false}
                        // sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }}
                      />
                    </TableCell>
                    <StyledTableCell align="center">{id + 1}</StyledTableCell>
                    <StyledTableCell align="center">{row.CBType}</StyledTableCell>
                    <StyledTableCell align="center">{row.PartyName}</StyledTableCell>
                    <StyledTableCell align="center">{row.InvoiceNo}</StyledTableCell>
                    <StyledTableCell align="center">{row.BillingNo}</StyledTableCell>
                    <StyledTableCell align="center">{row.SubmarineCable}</StyledTableCell>
                    <StyledTableCell align="center">{`$${handleNumber(
                      row.CurrAmount,
                    )}`}</StyledTableCell>
                    {/* <StyledTableCell align="center"> {dayjs(row.CreateDate).format('YYYY/MM/DD')}</StyledTableCell> */}
                    {/* <StyledTableCell align="center">{row.Note}</StyledTableCell> */}
                    {/* <StyledTableCell align="center">
                                        <Button
                                            color="primary"
                                            onClick={() => {
                                                setCbview(true);
                                            }}
                                        >
                                            檢視
                                        </Button>
                                        <Button
                                            color="warning"
                                            onClick={() => {
                                                setCbTerminal(true);
                                            }}
                                        >
                                            退費
                                        </Button>
                                    </StyledTableCell> */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <CreditBalanceView cbView={cbView} handleViewClose={handleViewClose} listInfo={listInfo} /> */}
        {/* <CreditBalanceTerminate cbTerminal={cbTerminal} handleTerminalClose={handleTerminalClose} /> */}
      </Grid>
      <Grid item xs={6}>
        <MainCard title="新增Credit Memo">
          <Typography variant="h5" size="small" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
            摘要說明：
          </Typography>
          <StyledEngineProvider injectFirst>
            <CssVarsProvider>
              <Textarea
                required
                value={summary}
                placeholder="填寫摘要說明"
                // disabled={action === 'View'}
                minRows={2}
                maxRows={2}
                onChange={(e) => setSummary(e.target.value)}
              />
            </CssVarsProvider>
          </StyledEngineProvider>
          <TableContainer component={Paper} sx={{ maxHeight: 350, mt: 1 }}>
            <Table sx={{ minWidth: 300 }} stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">CB種類</StyledTableCell>
                  <StyledTableCell align="center">會員</StyledTableCell>
                  <StyledTableCell align="center">發票號碼</StyledTableCell>
                  <StyledTableCell align="center">帳單號碼</StyledTableCell>
                  <StyledTableCell align="center">剩餘金額</StyledTableCell>
                  <StyledTableCell align="center">摘要說明</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listInfo?.map((row, id) => {
                  return (
                    <TableRow
                      key={row.CBType + id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      {cbToCn[id] ? (
                        <>
                          <StyledTableCell align="center">{row.CBType}</StyledTableCell>
                          <StyledTableCell align="center">{row.PartyName}</StyledTableCell>
                          <StyledTableCell align="center">{row.InvoiceNo}</StyledTableCell>
                          <StyledTableCell align="center">{row.BillingNo}</StyledTableCell>
                          <StyledTableCell align="center">{row.SubmarineCable}</StyledTableCell>
                          <StyledTableCell align="center">{`$${handleNumber(
                            row.CurrAmount,
                          )}`}</StyledTableCell>
                        </>
                      ) : (
                        <></>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default CreditBalanceToCN;
