import { useEffect, useState } from 'react';
import { Grid, Button, Box, Tabs, Tab } from '@mui/material';

// day
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// project import
import CreditBalanceDeduct from './creditBalanceDeduct';
import CustomTabPanel from 'components/CustomTabPanel';
import { BootstrapDialogTitle } from 'components/commonFunction';

// api
import { generateReport } from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const CreditBalanceView = ({ cbView, handleViewClose, viewId, codeType }) => {
    const dispatch = useDispatch();
    const [listInfo, setListInfo] = useState([]);
    const [value, setValue] = useState(0);

    const itemDetailInitial = () => {
        setListInfo([]);
    };

    const a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`
        };
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleDownload = () => {
        let tmpData = {
            CBID: viewId,
            Download: true
        };
        fetch(generateReport, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            },
            body: JSON.stringify(tmpData)
        })
            .then((res) => {
                return res.blob();
            })
            .then((blob) => {
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `CB報表.xlsx`;
                link.click();
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

    const getData = () => {
        let tmpData = {
            CBID: viewId,
            Download: false
        };
        fetch(generateReport, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            },
            body: JSON.stringify(tmpData)
        })
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setListInfo(data);
                }
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

    useEffect(() => {
        if (cbView) {
            getData();
        }
    }, [cbView]);

    return (
        <Dialog maxWidth="xl" fullWidth open={cbView}>
            <BootstrapDialogTitle>檢視Credit Balance明細</BootstrapDialogTitle>
            <DialogContent dividers>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Box display="flex" justifyContent="end" sx={{ fontSize: '1rem' }}>
                            幣別：{codeType}
                        </Box>
                        <CreditBalanceDeduct cblistInfo={listInfo} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    sx={{ mr: '0.05rem' }}
                    variant="contained"
                    onClick={() => {
                        handleDownload();
                    }}
                >
                    產生CB報表
                </Button>
                <Button
                    sx={{ mr: '0.05rem' }}
                    variant="contained"
                    onClick={() => {
                        handleViewClose();
                        itemDetailInitial();
                    }}
                >
                    關閉
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreditBalanceView;
