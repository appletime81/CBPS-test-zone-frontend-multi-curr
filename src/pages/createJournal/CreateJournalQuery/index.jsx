import { useEffect, useState, useRef } from 'react';
import { Grid } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import JournalQuery from './journalQuery';
import ToBillDataList from './toBillDataList';

const CreateJournal = () => {
    const [listInfo, setListInfo] = useState([]);
    const [page, setPage] = useState(0); //分頁Page
    const queryApi = useRef({});

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <JournalQuery setListInfo={setListInfo} queryApi={queryApi} setPage={setPage} />
            </Grid>
            <Grid item xs={12}>
                <MainCard title="發票資料列表">
                    <ToBillDataList listInfo={listInfo} page={page} setPage={setPage} />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default CreateJournal;
