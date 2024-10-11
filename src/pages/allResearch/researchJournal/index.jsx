import { useState, useRef } from 'react';
import { Grid } from '@mui/material';
// import { styled } from '@mui/material/styles';

// project import
import MainCard from 'components/MainCard';
import ResearchJournalQuery from './researchJournalQuery';
import ResearchJournalDataList from './researchJournalDataList';
import ResearchJournalDetail from './researchJournalDetail';

const ResearchJournal = () => {
    const queryApi = useRef('/all');
    const [listInfo, setListInfo] = useState([]);
    const [datailInfo, setDetailInfo] = useState([]);
    const [isDetailShow, setIsDetailShow] = useState(false);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <ResearchJournalQuery setListInfo={setListInfo} queryApi={queryApi} />
            </Grid>
            <Grid item xs={12}>
                <MainCard title="發票列表">
                    <ResearchJournalDataList listInfo={listInfo} setIsDetailShow={setIsDetailShow} />
                </MainCard>
            </Grid>
            <Grid item xs={12}>
                <MainCard title="立帳資料">
                    <ResearchJournalDetail datailInfo={datailInfo} isDetailShow={isDetailShow} />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default ResearchJournal;
