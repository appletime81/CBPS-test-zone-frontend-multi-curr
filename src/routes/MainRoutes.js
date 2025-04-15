import { useEffect, useState, forwardRef, useRef } from 'react';
import { lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import jwt_decode from 'jwt-decode';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// api & redux actions
import { ssoUrlOL, ssoUrlQA, ssoUrlTest, ssoUrlLogout, checktokenForLDAP, redirectUriOL, redirectUriQA, accessSSOOL, accessSSOQA, genToken } from 'components/apis.jsx';
import { setLoginInInfo, setUserInfo, setMessageStateOpen } from 'store/reducers/dropdown';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
// 發票工作管理
const InvoiceWorkManageCreate = Loadable(lazy(() => import('pages/invoiceWorkManage/InvoiceWorkCreate')));
const InvoiceWorkManageEdit = Loadable(lazy(() => import('pages/invoiceWorkManage/InvoiceWorkEdit')));
const InvoiceAttachManage = Loadable(lazy(() => import('pages/invoiceWorkManage/InvoiceAttachManage')));
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
const GenerateFeeAmount = Loadable(lazy(() => import('pages/accountsReceivable/generateFeeAmount')));
const WriteOffInvoice = Loadable(lazy(() => import('pages/accountsReceivable/writeOffInvoice')));
const BillAttachManagement = Loadable(lazy(() => import('pages/accountsReceivable/billAttachManagement')));
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
// 內部提醒通知管理
const Notification = Loadable(lazy(() => import('pages/notification/Notification')));
// 預算費用項目管理
const BudgetManage = Loadable(lazy(() => import('pages/budgetManage/BudgetManage')));

// ==============================|| MAIN ROUTING ||============================== //

const RequireAuth = ({ children, item }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLogin, userInfo, isOL } = useSelector((state) => state.dropdown); //message狀態
    // haha2
    console.log('haha2=>>');
    const [isFetching, setIsFetching] = useState(false);
    const getExpireTime = dayjs.unix(localStorage.getItem('expireTimeCBPS'));
    const accessToken = localStorage.getItem('accessToken');
    const now = dayjs();
    // let accessSSO = isOL ? accessSSOOL : accessSSOQA;
    const redirectToHome = () => {
        console.log('ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg');
        return window.location.replace(window.location.protocol + '//' + window.location.host);
    };
    const directRouter = () => {
        console.log('ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg');
        return window.location.replace(window.location.href);
    };
    const handleNetworkError = () => {
        dispatch(
            setMessageStateOpen({
                messageStateOpen: {
                    isOpen: true,
                    severity: 'error',
                    message: '網路異常，請檢查網路連線或與系統窗口聯絡'
                }
            })
        );
    };

    const getPermission = async () => {
        const ldapRes = await fetch(checktokenForLDAP, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer' + accessToken
            },
            body: JSON.stringify({ accessToken: accessToken })
        });

        const ldapData = await ldapRes.json();
        dispatch(setUserInfo({ userInfo: ldapData }));
        console.log('suck', ldapData, ldapData[item], item);
        if (ldapData[item] === false) redirectToHome();
    };

    useEffect(() => {
        const fetchToken = async () => {
            if (isFetching) return; // 避免重複執行
            setIsFetching(true);

            try {
                const accessCodeWebsite = new URLSearchParams(window.location.search).get('code');
                if (!accessCodeWebsite) return;

                console.log('accessCode=>>', accessCodeWebsite);
                const res = await fetch(genToken, {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({ iam_code: accessCodeWebsite })
                });

                const data = await res.json();
                console.log('data=>>', data);

                if (!data.access_token) {
                    console.log('取得 token 失敗，重新導向登入頁面');
                    // window.location.replace(isOL ? ssoUrlOL : ssoUrlQA);
                    window.location.replace(ssoUrlLogout);
                    return;
                }

                localStorage.setItem('expireTimeCBPS', data.exp);
                localStorage.setItem('accessToken', data.access_token);
                const ldapRes = await fetch(checktokenForLDAP, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer' + data.access_token
                    },
                    body: JSON.stringify({ accessToken: data.access_token })
                });

                const ldapData = await ldapRes.json();
                console.log('使用者權限資料=>>', ldapData);
                dispatch(setUserInfo({ userInfo: ldapData }));

                if (ldapData[item] === false) return redirectToHome();
                console.log('取得 token 成功');
            } catch (error) {
                console.log('error=>>', error);
            } finally {
                setIsFetching(false);
            }
        };

        // 未超時
        if (!getExpireTime.isBefore(now)) {
            if (accessToken) {
                getPermission();
            } else {
                return window.location.replace(ssoUrlTest);
            }

            // return children;
        } else if (window.location.href.includes('code=')) {
            console.log('22222222222222222222');
            console.log('time22', getExpireTime);
            fetchToken();
        } else {
            console.log('3333333333333333333');
            // return window.location.replace(isOL ? ssoUrlOL : ssoUrlQA);
            return window.location.replace(ssoUrlTest);
        }
    }, []);

    // if (!getExpireTime.isBefore(now) && accessToken) {
    //     console.log('789', item, 'getExpireTime=>>', getExpireTime);
    //     getPermission();
    //     console.log('userInfo22222222222222222222222222222=>>', userInfo, item, userInfo[item] === false);
    //     if (userInfo[item] === false) {
    //         console.log('101112');
    //         window.location.replace(window.location.protocol + '//' + window.location.host);
    //         return null;
    //     }
    //     return children;
    // }
    return children;
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
            )
        },
        {
            path: '/',
            element: (
                <RequireAuth>
                    <DashboardDefault />
                </RequireAuth>
            )
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
                    )
                },
                {
                    path: 'InvoiceWorkEdit',
                    element: (
                        <RequireAuth item={'InvoiceWK'}>
                            <InvoiceWorkManageEdit />
                        </RequireAuth>
                    )
                },
                {
                    path: 'InvoiceAttachManage',
                    element: (
                        <RequireAuth item={'InvoiceWK'}>
                            <InvoiceAttachManage />
                        </RequireAuth>
                    )
                }
            ]
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
                    )
                },
                {
                    path: 'JournalQuery',
                    element: (
                        <RequireAuth item={'Invoice'}>
                            <JournalQuery />
                        </RequireAuth>
                    )
                }
            ]
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
                    )
                },
                {
                    path: 'BillAttachManagement',
                    element: (
                        <RequireAuth item={'Bill'}>
                            <BillAttachManagement />
                        </RequireAuth>
                    )
                },
                {
                    path: 'WriteOffInvoice',
                    element: (
                        <RequireAuth item={'Bill'}>
                            <WriteOffInvoice />
                        </RequireAuth>
                    )
                }
            ]
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
                    )
                },
                {
                    path: 'Correspondence',
                    element: (
                        <RequireAuth item={'Pay'}>
                            <Correspondence />
                        </RequireAuth>
                    )
                },
                {
                    path: 'PaymentRecord',
                    element: (
                        <RequireAuth item={'Pay'}>
                            <PaymentRecord />
                        </RequireAuth>
                    )
                }
            ]
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
                    )
                },
                {
                    path: 'CreditBalanceRefund',
                    element: (
                        <RequireAuth item={'CB'}>
                            <CreditBalanceRefund />
                        </RequireAuth>
                    )
                },
                {
                    path: 'RefundCBManager',
                    element: (
                        <RequireAuth item={'CB'}>
                            <RefundCBManager />
                        </RequireAuth>
                    )
                }
            ]
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
                    )
                }
            ]
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
                    )
                },
                {
                    path: 'ResearchInvoice',
                    element: (
                        <RequireAuth item={'GlobalQuery'}>
                            <ResearchInvoice />
                        </RequireAuth>
                    )
                },
                {
                    path: 'ResearchJournal',
                    element: (
                        <RequireAuth item={'GlobalQuery'}>
                            <ResearchJournal />
                        </RequireAuth>
                    )
                }
            ]
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
                    )
                },
                {
                    path: 'Currency',
                    element: (
                        <RequireAuth item={'Currency'}>
                            <CurrencyManage />
                        </RequireAuth>
                    )
                },
                {
                    path: 'Data',
                    element: (
                        <RequireAuth item={'Data'}>
                            <Information />
                        </RequireAuth>
                    )
                },
                {
                    path: 'SysNotify',
                    element: (
                        <RequireAuth>
                            <Notification item={'SysNotify'} />
                        </RequireAuth>
                    )
                },
                {
                    path: 'BudgetManage',
                    element: (
                        <RequireAuth>
                            <BudgetManage item={'BudgetManage'} />
                        </RequireAuth>
                    )
                }
            ]
        },
        {
            path: 'UploadManage',
            element: (
                <RequireAuth>
                    <UploadManage />
                </RequireAuth>
            )
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'default',
                    element: <DashboardDefault />
                }
            ]
        }
    ]
};

export default MainRoutes;
