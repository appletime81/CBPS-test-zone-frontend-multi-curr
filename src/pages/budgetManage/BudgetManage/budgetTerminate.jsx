import { useState } from 'react';
import { Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem, Box, TextField, Autocomplete, Table } from '@mui/material';

// day
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// api
import { deleteLiability } from 'components/apis.jsx';

// project
import { BootstrapDialogTitle } from 'components/commonFunction';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const LiabilityTerminate = ({ dialogTerminate, handleDialogClose, actionName, budgetQuery, terminateInfo }) => {
    const dispatch = useDispatch();
    const [endNote, setEndNote] = useState('');

    const terminalLiability = async () => {
        console.log('尚未開發');
    };

    return (
        <Dialog maxWidth="xs" fullWidth open={dialogTerminate}>
            <BootstrapDialogTitle>確認{actionName === 'stop' ? '停用' : '刪除'}訊息</BootstrapDialogTitle>
            <DialogContent dividers>
                <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center">
                    {/* row3 */}
                    <Grid item xs={12} sm={12} md={12} lg={12} display="flex">
                        <Typography
                            variant="h5"
                            sx={{
                                fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                ml: { lg: '0.5rem', xl: '1.5rem' }
                            }}
                        >
                            {/* {`是否確定刪除${terminateInfo.BillMilestone}、${terminateInfo.PartyName}的Liability資料`} */}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} display="flex">
                        <TextField fullWidth variant="outlined" value={endNote} size="small" label="填寫終止原因" onChange={(e) => setEndNote(e.target.value)} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    sx={{ mr: '0.05rem' }}
                    variant="contained"
                    onClick={() => {
                        terminalLiability();
                    }}
                >
                    確定
                </Button>

                <Button sx={{ mr: '0.05rem' }} variant="contained" onClick={handleDialogClose}>
                    關閉
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LiabilityTerminate;
