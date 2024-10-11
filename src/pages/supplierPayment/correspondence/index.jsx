import { useState, useRef, useEffect } from 'react';

// project import
import CorrespondenceQuery from './correspondenceQuery';
import MainCard from 'components/MainCard';
import CorrespondenceMake from './correspondenceMake';
import ToEditDataList from './toEditDataList';
import EditedDataList from './editedDataList';

import CustomTabPanel from 'components/CustomTabPanel';
// material-ui
import { Grid, Box, Tabs, Tab } from '@mui/material';
import { queryPaydraft } from 'components/apis.jsx';

const Correspondence = () => {
    const [value, setValue] = useState(0);
    const [listInfo, setListInfo] = useState([]);
    const queryApi = useRef('/Status=PAYING');

    const a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    };

    const [isDialogOpen, setIsDialogOpen] = useState(false); //檢視

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleChange = (event, newValue) => {
        setListInfo([]);
        setValue(newValue);
    };

    const initQuery = () => {
        let tmpQuery =
            value === 0
                ? '/Status=TEMPORARY&PayeeType=SUPPLIER'
                : '/Status=COMPLETE&PayeeType=SUPPLIER';
        tmpQuery = queryPaydraft + tmpQuery;
        fetch(tmpQuery, {
            method: 'GET',
            Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setListInfo(data);
                }
            })
            .catch((e) => {
                console.log('e1=>', e);
            });
    };

    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <CorrespondenceQuery
                        setListInfo={setListInfo}
                        queryApi={queryApi}
                        value={value}
                    />
                </Grid>
                <Grid item xs={12}>
                    <MainCard title={`${value === 0 ? '未編輯' : '已編輯'}資料列表`}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'relative' }}>
                            <Tabs value={value} onChange={handleChange}>
                                <Tab label="未編輯" {...a11yProps(0)} />
                                <Tab label="已編輯" {...a11yProps(1)} />
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={value} index={0}>
                            <ToEditDataList listInfo={listInfo} initQuery={initQuery} />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                            <EditedDataList listInfo={listInfo} />
                        </CustomTabPanel>
                    </MainCard>
                </Grid>
            </Grid>
            <CorrespondenceMake
                isDialogOpen={isDialogOpen}
                handleDialogClose={handleDialogClose}
                listInfo={listInfo}
            />
        </>
    );
};

export default Correspondence;
