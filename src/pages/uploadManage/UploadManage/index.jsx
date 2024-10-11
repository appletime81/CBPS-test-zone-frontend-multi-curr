import { useEffect, useState } from 'react';
import { Grid, Button, IconButton, Box, Tabs, Tab, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// import { styled } from '@mui/material/styles';

// project import
import MainCard from 'components/MainCard';
import UploadFile from './uploadFile';
import UploadDataList from './uploadDataList';

const Information = () => {
    const tableH = document.getElementById('tableContainer')?.offsetTop;
    const [isUploadOpen, setIsUploadOpen] = useState(false); //簽核
    const maxHei = window.screen.height - tableH - 270;

    const handleUploadOpen = () => {
        setIsUploadOpen(true);
    };

    const handleUploadClose = () => {
        setIsUploadOpen(false);
    };

    return (
        <Grid container spacing={1}>
        <Grid item xs={12} display="flex" justifyContent="right">
            <Button sx={{ mr: '0.25rem' }} variant="contained" onClick={handleUploadOpen}>
                + 上傳檔案
            </Button>
            <UploadFile
                isUploadOpen={isUploadOpen}
                handleUploadClose={handleUploadClose}
            />
        </Grid>
        <Grid item xs={12}>
            <MainCard title="上傳紀錄">
                <UploadDataList />
            </MainCard>
        </Grid>
    </Grid>
    );
};

export default Information;
