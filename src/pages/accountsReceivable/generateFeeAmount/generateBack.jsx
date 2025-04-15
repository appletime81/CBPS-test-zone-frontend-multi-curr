import { Button, Grid, Typography } from '@mui/material';

// project
import { BootstrapDialogTitle } from 'components/commonFunction';

// day
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// api
import { beforeDuction, afterDeduction } from 'components/apis.jsx';

// redux
// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const GenerateBack = ({ action, infoBack, handleBackClose, receivableQuery, editBillingNo, editBillMasterID }) => {
    const dispatch = useDispatch();
    const backBill = () => {
        const queryApi = action === 'toDeduct' ? beforeDuction : afterDeduction;
        let tmpObject = {
            BillMasterID: editBillMasterID
        };
        fetch(queryApi, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            },
            body: JSON.stringify(tmpObject)
        })
            .then((res) => res.json())
            .then(() => {
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'success',
                            message: '退回成功'
                        }
                    })
                );
                receivableQuery();
                handleBackClose();
            })
            .catch(() => {
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'error',
                            message: '網路異常，請檢查網路連線或與系統窗口聯絡'
                        }
                    })
                );
            });
    };

    return (
        <Dialog maxWidth="xs" fullWidth open={infoBack}>
            <BootstrapDialogTitle>確認退回訊息</BootstrapDialogTitle>
            <DialogContent dividers>
                <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center">
                    {/* row3 */}
                    <Grid item xs={12} sm={12} md={12} lg={12} display="flex">
                        <Typography
                            sx={{
                                fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                ml: { lg: '0.5rem', xl: '1.5rem' }
                            }}
                        >
                            {`是否確定退回此${editBillingNo}帳單`}
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    sx={{ mr: '0.05rem' }}
                    variant="contained"
                    onClick={() => {
                        backBill();
                    }}
                >
                    確定
                </Button>
                <Button sx={{ mr: '0.05rem' }} variant="contained" onClick={handleBackClose}>
                    關閉
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GenerateBack;
