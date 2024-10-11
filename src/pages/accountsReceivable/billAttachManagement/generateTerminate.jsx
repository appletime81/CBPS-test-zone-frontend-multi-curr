import { useState } from 'react';
import { Typography, Grid, Button, TextField } from '@mui/material';

// project
import { BootstrapDialogTitle } from 'components/commonFunction';

// day
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const GenerateFeeTerminate = ({ infoTerminal, handleTerminalClose, editBillingNo }) => {
    const [note, setNote] = useState('');
    
    const terminalBill = () => {
        console.log('尚未開發');
    };

    return (
        <Dialog maxWidth="xs" fullWidth open={infoTerminal}>
            <BootstrapDialogTitle>確認終止訊息</BootstrapDialogTitle>
            <DialogContent dividers>
                <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center">
                    {/* row3 */}
                    <Grid item xs={12} sm={12} md={12} lg={12} display="flex">
                        <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem' ,xl: '0.88rem' }, ml: { lg: '0.5rem', xl: '1.5rem' } }}>
                            {/* {`是否確定刪除${terminateInfo.BillMilestone}、${terminateInfo.PartyName}的Credit Balance資料`} */}
                            {`是否確定作廢此${editBillingNo}帳單`}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} display="flex">
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={note}
                            size="small"
                            label="填寫終止原因"
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    sx={{ mr: '0.05rem' }}
                    variant="contained"
                    onClick={() => {
                        terminalBill();
                    }}
                >
                    確定
                </Button>
                <Button sx={{ mr: '0.05rem' }} variant="contained" onClick={handleTerminalClose} c>
                    關閉
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GenerateFeeTerminate;
