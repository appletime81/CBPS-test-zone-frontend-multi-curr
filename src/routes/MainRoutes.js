import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import { useSelector } from 'react-redux';
//api
import {
    ssoUrlOL,
    ssoUrlQA,
    checktokenForLDAP,
    redirectUriOL,
    redirectUriQA,
    accessSSOOL,
    accessSSOQA,
} from 'components/apis.jsx';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';

// redux
import { setLoginInInfo, setUserInfo } from 'store/reducers/dropdown';
import jwt_decode from 'jwt-decode';
import { setMessageStateOpen } from 'store/reducers/dropdown';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
// 發票工作管理
const InvoiceWorkManageCreate = Loadable(
    lazy(() => import('pages/invoiceWorkManage/InvoiceWorkCreate')),
);
const InvoiceWorkManageEdit = Loadable(
    lazy(() => import('pages/invoiceWorkManage/InvoiceWorkEdit')),
);
const InvoiceAttachManage = Loadable(
    lazy(() => import('pages/invoiceWorkManage/InvoiceAttachManage')),
);
// 立帳管理
const CreateJournal = Loadable(lazy(() => import('pages/createJournal/CreateJournal')));
const JournalQuery = Loadable(lazy(() => import('pages/createJournal/CreateJournalQuery')));
// Credit Balance
const CreditBalance = Loadable(lazy(() => import('pages/creditBalance/CreditBalance')));
const CreditBalanceRefund = Loadable(lazy(() => import('pages/creditBalance/CreditBalanceRefund')));
const RefundCBManager = Loadable(lazy(() => import('pages/creditBalance/RefundCBManager')));
// Credit Memo
const CreditMemo = Loadable(lazy(() => import('pages/creditMemo/CreditMemo')));
// 應收帳款管理
const GenerateFeeAmount = Loadable(
    lazy(() => import('pages/accountsReceivable/generateFeeAmount')),
);
const WriteOffInvoice = Loadable(lazy(() => import('pages/accountsReceivable/writeOffInvoice')));
const BillAttachManagement = Loadable(
    lazy(() => import('pages/accountsReceivable/billAttachManagement')),
);
const SupplierPayment = Loadable(lazy(() => import('pages/supplierPayment/supplierPayment')));
const Correspondence = Loadable(lazy(() => import('pages/supplierPayment/correspondence')));
const PaymentRecord = Loadable(lazy(() => import('pages/supplierPayment/paymentRecord')));
// 全域查詢
const ResearchBill = Loadable(lazy(() => import('pages/allResearch/researchBill')));
const ResearchInvoice = Loadable(lazy(() => import('pages/allResearch/researchInvoice')));
const ResearchJournal = Loadable(lazy(() => import('pages/allResearch/researchJournal')));
// 基本資料設定
const Information = Loadable(lazy(() => import('pages/information/Information')));
// Liability
const LiabilityManage = Loadable(lazy(() => import('pages/liability/LiabilityManage')));
// Liability
const CurrencyManage = Loadable(lazy(() => import('pages/currency/CurrencyManage')));
// 上傳資料管理
const UploadManage = Loadable(lazy(() => import('pages/uploadManage/UploadManage')));
// 通知管理
const Notification = Loadable(lazy(() => import('pages/notification/Notification')));
// 通知管理

// ==============================|| MAIN ROUTING ||============================== //

const RequireAuth = ({ children, item }) => {
    console.log('程式起點2=>>', window.location.href.indexOf('code'));
    const dispatch = useDispatch();
    const { isLogin, userInfo, isOL } = useSelector((state) => state.dropdown); //message狀態
    // haha2
    const getExpireTime = localStorage.getItem('expireTimeCBP');
    let accessSSO = isOL ? accessSSOOL : accessSSOQA;
    const sendNoPermission = () => {
        return window.location.replace(window.location.protocol + '//' + window.location.host);
    };

    if (
        window.location.host.includes('localhost') ||
        window.location.host.includes('127.0.0.1') ||
        dayjs(getExpireTime).diff(new Date(), 'minute') > 0 ||
        isLogin
    ) {
        if (userInfo[item] === false) sendNoPermission();
        return children;
    } else if (window.location.href.indexOf('code') !== -1) {
        const accessCode = window.location.href.split('code=')[1];
        let tmpArray = {
            client_id: isOL ? 'CBPS-CBPS.OL.I' : 'CBPS.QA.I',
            redirect_uri: isOL ? redirectUriOL : redirectUriQA,
            code: accessCode,
            grant_type: 'authorization_code',
        };
        const searchParams = new URLSearchParams(tmpArray);
        console.log('searchParamshaha1=>>', accessCode);
        fetch(accessSSO, {
            method: 'POST',
            body: searchParams,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('datahaha2=>>>>', data.access_token);
                if (data.access_token) {
                    dispatch(
                        setLoginInInfo({
                            loginInInfo: {
                                EmployeeNumber: jwt_decode(data.access_token).employeeNumber,
                                Email: jwt_decode(data.access_token).email,
                                Name: jwt_decode(data.access_token).name,
                            },
                        }),
                    );
                    localStorage.setItem('expireTimeCBP', dayjs().add(480, 'minute'));
                    localStorage.setItem('accessToken', data.access_token);
                    // 傳送使用者資料取得權限
                    fetch(checktokenForLDAP, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                            Authorization: 'Bearer' + data.access_token,
                        },
                        body: JSON.stringify({ accessToken: data.access_token }),
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            console.log('使用者權限資料2=>>', data);
                            dispatch(
                                setUserInfo({
                                    userInfo: {
                                        UserCName: data.UserCName,
                                        ProfilePhotoURI: data.ProfilePhotoURI,
                                        CB: data.CB,
                                        Role: data.Role,
                                        CM: data.CM,
                                        System: data.System,
                                        GlobalQuery: data.GlobalQuery,
                                        SupplierNotify: data.SupplierNotify,
                                        InvoiceWK: data.InvoiceWK,
                                        Report: data.Report,
                                        Superior: data.Superior,
                                        Invoice: data.Invoice,
                                        Data: data.Data,
                                        Bill: data.Bill,
                                        Liability: data.Liability,
                                        Pay: data.Pay,
                                        PartyNotify: data.PartyNotify,
                                        SysNotify: data.SysNotify,
                                    },
                                }),
                            );
                            if (data[item] === false) sendNoPermission();
                        })
                        .catch(() => {
                            dispatch(
                                setMessageStateOpen({
                                    messageStateOpen: {
                                        isOpen: true,
                                        severity: 'error',
                                        message: '網路異常，請檢查網路連線或與系統窗口聯絡',
                                    },
                                }),
                            );
                        });
                    return children;
                } else {
                    return window.location.replace(isOL ? ssoUrlOL : ssoUrlQA);
                }
            })
            .catch(() => {
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'error',
                            message: '網路異常，請檢查網路連線或與系統窗口聯絡',
                        },
                    }),
                );
            });
    } else {
        return window.location.replace(isOL ? ssoUrlOL : ssoUrlQA);
    }
};

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '*',
            element: (
                <RequireAuth>
                    <DashboardDefault />
                </RequireAuth>
            ),
        },
        {
            path: '/',
            element: (
                <RequireAuth>
                    <DashboardDefault />
                </RequireAuth>
            ),
        },
        {
            path: 'InvoiceWorkManage',
            children: [
                {
                    path: 'InvoiceWorkCreate',
                    element: (
                        <RequireAuth item={'InvoiceWK'}>
                            <InvoiceWorkManageCreate />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'InvoiceWorkEdit',
                    element: (
                        <RequireAuth item={'InvoiceWK'}>
                            <InvoiceWorkManageEdit />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'InvoiceAttachManage',
                    element: (
                        <RequireAuth item={'InvoiceWK'}>
                            <InvoiceAttachManage />
                        </RequireAuth>
                    ),
                },
            ],
        },
        {
            path: 'CreateJournal',
            children: [
                {
                    path: 'CreateJournal',
                    element: (
                        <RequireAuth item={'Invoice'}>
                            <CreateJournal />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'JournalQuery',
                    element: (
                        <RequireAuth item={'Invoice'}>
                            <JournalQuery />
                        </RequireAuth>
                    ),
                },
            ],
        },
        {
            path: 'AccountsReceivable',
            children: [
                {
                    path: 'GenerateFeeAmount',
                    element: (
                        <RequireAuth item={'Bill'}>
                            <GenerateFeeAmount />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'BillAttachManagement',
                    element: (
                        <RequireAuth item={'Bill'}>
                            <BillAttachManagement />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'WriteOffInvoice',
                    element: (
                        <RequireAuth item={'Bill'}>
                            <WriteOffInvoice />
                        </RequireAuth>
                    ),
                },
            ],
        },
        {
            path: 'SupplierPayment',
            children: [
                {
                    path: 'SupplierPayment',
                    element: (
                        <RequireAuth item={'Pay'}>
                            <SupplierPayment />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'Correspondence',
                    element: (
                        <RequireAuth item={'Pay'}>
                            <Correspondence />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'PaymentRecord',
                    element: (
                        <RequireAuth item={'Pay'}>
                            <PaymentRecord />
                        </RequireAuth>
                    ),
                },
            ],
        },
        {
            path: 'CreditBalance',
            children: [
                {
                    path: 'CreditBalanceManage',
                    element: (
                        <RequireAuth item={'CB'}>
                            <CreditBalance />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'CreditBalanceRefund',
                    element: (
                        <RequireAuth item={'CB'}>
                            <CreditBalanceRefund />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'RefundCBManager',
                    element: (
                        <RequireAuth item={'CB'}>
                            <RefundCBManager />
                        </RequireAuth>
                    ),
                },
            ],
        },
        {
            path: 'CreditMemo',
            children: [
                {
                    path: 'CreditMemoManage',
                    element: (
                        <RequireAuth item={'CM'}>
                            <CreditMemo />
                        </RequireAuth>
                    ),
                },
            ],
        },
        {
            path: 'AllResearch',
            children: [
                {
                    path: 'ResearchBill',
                    element: (
                        <RequireAuth item={'GlobalQuery'}>
                            <ResearchBill />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'ResearchInvoice',
                    element: (
                        <RequireAuth item={'GlobalQuery'}>
                            <ResearchInvoice />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'ResearchJournal',
                    element: (
                        <RequireAuth item={'GlobalQuery'}>
                            <ResearchJournal />
                        </RequireAuth>
                    ),
                },
            ],
        },
        {
            path: 'Setting',
            children: [
                {
                    path: 'Liability',
                    element: (
                        <RequireAuth item={'Liability'}>
                            <LiabilityManage />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'Currency',
                    element: (
                        <RequireAuth item={'Currency'}>
                            <CurrencyManage />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'Data',
                    element: (
                        <RequireAuth item={'Data'}>
                            <Information />
                        </RequireAuth>
                    ),
                },
                {
                    path: 'SysNotify',
                    element: (
                        <RequireAuth>
                            <Notification item={'SysNotify'} />
                        </RequireAuth>
                    ),
                },
            ],
        },
        {
            path: 'UploadManage',
            element: (
                <RequireAuth>
                    <UploadManage />
                </RequireAuth>
            ),
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'default',
                    element: <DashboardDefault />,
                },
            ],
        },
    ],
};

export default MainRoutes;
