import { useEffect, useState } from 'react';
import { Grid, Button, Box } from '@mui/material';
import { DropzoneArea } from 'mui-file-dropzone';
// import { FileUploader } from 'react-drag-drop-files';

// project
import { BootstrapDialogTitle } from 'components/commonFunction';

// day
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// api
import { uploadSignedBillMaster } from 'components/apis.jsx';
// import MainCard from 'components/MainCard';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen, setIsLoading } from 'store/reducers/dropdown';

const BillUpload = ({ isUploadOpen, handleUploadClose, itemID }) => {
    const dispatch = useDispatch();
    const [uploadFile, setUploadFile] = useState(null);
    const [displayName, setDisplayName] = useState([]);

    const handleUploadChange = (file) => {
        setUploadFile(file);
    };

    const handleUploadFile = () => {
        if (uploadFile.length > 0) {
            let tmpApi = uploadSignedBillMaster + '/' + itemID;
            const pdfData = new FormData();
            pdfData.append('file', uploadFile[0]);
            dispatch(setIsLoading({ isLoading: true }));
            // data
            fetch(tmpApi, {
                method: 'POST',
                body: pdfData,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
                }
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.message === 'success') {
                        dispatch(setIsLoading({ isLoading: false }));
                        dispatch(
                            setMessageStateOpen({
                                messageStateOpen: {
                                    isOpen: true,
                                    severity: 'success',
                                    message: '上傳成功'
                                }
                            })
                        );
                        setUploadFile(null);
                        handleUploadClose();
                    } else {
                        dispatch(setIsLoading({ isLoading: false }));
                        dispatch(
                            setMessageStateOpen({
                                messageStateOpen: {
                                    isOpen: true,
                                    severity: 'error',
                                    message: '上傳失敗'
                                }
                            })
                        );
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
        } else {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: { isOpen: true, severity: 'error', message: '請上傳檔案' }
                })
            );
        }
    };

    useEffect(() => {
        if (uploadFile) {
            let tmpArray = [];
            uploadFile.forEach((i) => {
                tmpArray.push(i.name);
            });
            setDisplayName(tmpArray);
        }
    }, [uploadFile]);

    return (
        <Dialog maxWidth="xs" fullWidth open={isUploadOpen}>
            <BootstrapDialogTitle>上傳發票作業</BootstrapDialogTitle>
            <DialogContent dividers>
                {/* 第二階段優化 */}
                <Grid container spacing={2} display="flex" justifyContent="center" alignItems="center">
                    <Grid item xs={12} sm={12} md={12} lg={12} display="flex">
                        <Box
                            sx={{
                                display: 'flex',
                                flexFlow: 'column',
                                alignItems: 'center',
                                width: '100%'
                            }}
                        >
                            <DropzoneArea onChange={handleUploadChange} acceptedFiles={['.pdf']} maxFileSize={100000000} />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} display="flex">
                        <Box sx={{ fontSize: 0.1, textAlign: 'left' }}>{displayName[0] ? `上傳成功：${displayName[0]}` : ''}</Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    sx={{ mr: '0.05rem' }}
                    variant="contained"
                    onClick={() => {
                        handleUploadFile();
                    }}
                >
                    確定
                </Button>
                <Button sx={{ mr: '0.05rem' }} variant="contained" onClick={handleUploadClose}>
                    關閉
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BillUpload;
