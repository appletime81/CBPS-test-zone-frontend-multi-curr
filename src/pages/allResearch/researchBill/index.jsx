import { useState } from 'react';
import { Grid } from '@mui/material';
// import { styled } from '@mui/material/styles';

// project import
import MainCard from 'components/MainCard';
import ResearchBillQuery from './researchBillQuery';
import ResearchBillDataList from './researchBillDataList';
import ResearchBillDetail from './researchBillDetail';

// redux
import { useSelector } from 'react-redux';

const fakeData = [
    {
        InvoiceWKMaster: {
            IssueDate: '2023-04-10T12:00:00',
            DedAmount: 0.33,
            DueDate: '2023-06-09T12:00:00',
            PaidAmount: 6072.0,
            InvoiceNo: '16170',
            PartyName: '',
            CreateDate: '2023-04-11T11:53:42',
            WKMasterID: 19,
            IsPro: false,
            PaidDate: '2023-06-09T10:17:19',
            SupplierName: 'Ciena-JP',
            IsRecharge: false,
            Status: 'COMPLETE',
            SubmarineCable: 'TPE',
            IsLiability: true,
            WorkTitle: 'Upgrade',
            IsCreditMemo: null,
            ContractType: 'SC',
            TotalAmount: 6072.0,
            BillMilestone: '11_BM3'
        },
        BillMaster: [
            {
                WorkTitle: 'Upgrade',
                BillingNo: '03UP-CU2304271121',
                BillMilestone: 'String',
                PONo: '',
                PartyName: 'CU',
                DueDate: '2023-05-24T00:00:00',
                ReceivedAmountSum: 5795.11,
                IsPro: false,
                URI: 's3://cht-deploy-bucket-1/(CU) TPECR-CU041901_credit(PDF).pdf',
                BillMasterID: 12,
                SubmarineCable: 'TPE',
                IssueDate: '2023-04-27T00:00:00',
                FeeAmountSum: 5810.0,
                BankFees: 14.89,
                Status: 'COMPLETE'
            }
        ]
    }
];

const ResearchBill = () => {
    const [listInfo, setListInfo] = useState([]);
    const [datailInfo, setDetailInfo] = useState([]);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <ResearchBillQuery setListInfo={setListInfo} setDetailInfo={setDetailInfo} />
            </Grid>
            <Grid item xs={12}>
                <MainCard title="發票列表">
                    <ResearchBillDataList listInfo={listInfo} setDetailInfo={setDetailInfo} />
                </MainCard>
            </Grid>
            <Grid item xs={12}>
                <MainCard title="帳單列表">
                    <ResearchBillDetail datailInfo={datailInfo} />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default ResearchBill;
