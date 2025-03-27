import { useEffect, useState, useRef, useCallback } from 'react';

// material-ui
import { Grid, Button } from '@mui/material';
import dayjs from 'dayjs';
// project import
import MainCard from 'components/MainCard';
import InvoiceQuery from './invoiceQuery';
import CreateInvoiceMain from './createInvoiceMain';
import CreateInvoiceDetail from './createInvoiceDetail';
import InvoiceDataList from './invoiceDataList';
import ReturnDataList from './returnDataList';
import ChosePurpose from './chosePurpose';

// api
import {
    getInvoiceWKMasterInvoiceWKDetail,
    generateInvoice,
    updateInvoice,
    deleteInvoiceWKMaster,
    deleteInvoiceWKDetail,
    billMilestoneList,
    returnToValidated,
    afterBilled,
    supplierNameListForInvoice,
    submarineCableInfoList,
    billMilestoneLiabilityList,
    getCurrencyData,
    dropdownmenuParties,
    getWorkTitle,
    supplierNameDropDownUnique,
    getLevels
} from 'components/apis.jsx';

// redux
import { activeItem } from 'store/reducers/menu';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

import { Link } from 'react-router-dom';

// ==============================|| SAMPLE PAGE ||============================== //

const InvoiceWorkManage = () => {
    const [dropdownLists, setDropdownLists] = useState({
        supNmList: [], //供應商下拉選單
        submarineCableList: [], //海纜名稱下拉選單
        partyNameList: [], //會員下拉選單
        bmStoneList: [], //計帳段號下拉選單
        workTitleList: [], //海纜作業下拉選單
        codeList: [], //幣別下拉選單
        bmsList: [], //計帳段號下拉選單
        budgetList: [] //預算下拉選單
    });
    const dispatch = useDispatch();
    const [invoiceDetailInfo, setInvoiceDetailInfo] = useState([]);
    const [supplierName, setSupplierName] = useState(''); //供應商
    const [invoiceNo, setInvoiceNo] = useState(''); //發票號碼
    const [submarineCable, setSubmarineCable] = useState(''); //海纜名稱
    const [workTitle, setWorkTitle] = useState(''); //海纜作業
    const [contractType, setContractType] = useState(''); //合約種類
    const [issueDate, setIssueDate] = useState(new Date()); //發票日期
    const [dueDate, setDueDate] = useState(new Date()); //發票到期日
    const [totalAmount, setTotalAmount] = useState(''); //總金額
    const [isPro, setIsPro] = useState(false); //是否為Pro-forma
    const [isLiability, setIsLiability] = useState(true); //是否需攤分
    const [isRecharge, setIsRecharge] = useState(false); //是否為短腳補收
    const [isCreditMemo, setIsCreditMemo] = useState(false); //是否為短腳補收
    const [partyName, setPartyName] = useState(''); //會員名稱
    const wKMasterID = useRef(); //工作檔ID
    const [bmStoneList, setBmStoneList] = useState([]); //計帳段號下拉選單

    const [fromCode, setFromCode] = useState(''); //幣別
    const [currencyExgID, setCurrencyExgID] = useState(null);
    const isTax = useRef(0);
    const [billMilestone, setBillMilestone] = useState(''); //計帳段號
    const [feeItem, setFeeItem] = useState(''); //費用項目
    const [feeAmount, setFeeAmount] = useState(''); //費用金額
    const [action, setAction] = useState('');
    const [modifyItem, setModifyItem] = useState('');
    const queryApi = useRef({});
    const queryApiTemporary = { Status: ['TEMPORARY'] };
    const [partyNameList, setPartyNameList] = useState([]); //會員下拉選單
    const [listInfo, setListInfo] = useState([]);
    const [page, setPage] = useState(0); //分頁Page
    const [isReturnOpen, setIsReturnOpen] = useState(false);
    const returnDataList = useRef([]);
    const actionBack = useRef('');
    const rateInfo = useRef({});
    const [isPurposeDialogOpen, setIsPurposeDialogOpen] = useState(false);
    const [purpose, setPurpose] = useState('');
    const [budgetInfo, setBudgetInfo] = useState('');

    const fetchData = useCallback(
        async (url, method = 'GET', body = null) => {
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}`
            };
            const options = {
                method,
                headers,
                ...(body && { body: JSON.stringify(body) })
            };
            try {
                const response = await fetch(url, options);
                return await response.json();
            } catch (error) {
                dispatch(setMessageStateOpen({ messageStateOpen: { isOpen: true, severity: 'error', message: '網路異常，請檢查網路連線或與系統窗口聯絡' } }));
                throw error;
            }
        },
        [dispatch]
    );

    const itemInfoInitial = () => {
        wKMasterID.current = 0;
        setSupplierName('');
        setInvoiceNo('');
        setSubmarineCable('');
        setWorkTitle('');
        setContractType('');
        setIssueDate(new Date());
        setDueDate(new Date());
        setTotalAmount('');
        setIsPro(false);
        setIsLiability(true);
        setIsRecharge(false);
        setIsCreditMemo(false);
        setPartyName('');
        setInvoiceDetailInfo([]);
    };

    const itemDetailInitial = () => {
        setBillMilestone('');
        setFeeItem('');
        setFeeAmount('');
        setBudgetInfo('');
    };

    const orderDate = (data) => {
        data.sort((a, b) => {
            return dayjs(b.InvoiceWKMaster.CreateDate).diff(dayjs(a.InvoiceWKMaster.CreateDate));
        });
    };

    const initQuery = () => {
        fetch(getInvoiceWKMasterInvoiceWKDetail, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? ''
            },
            body: JSON.stringify(queryApi.current)
        })
            .then((res) => res.json())
            .then((data) => {
                setListInfo(data);
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
        console.log('  initQuery();=>>');
    };

    const firstQueryInit = () => {
        fetch(getInvoiceWKMasterInvoiceWKDetail, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? ''
            },
            body: JSON.stringify(queryApiTemporary)
        })
            .then((res) => res.json())
            .then((data) => {
                orderDate(data);
                setListInfo(data);
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

    const createData = (
        WKMasterID,
        InvoiceNo,
        SupplierName,
        SubmarineCable,
        WorkTitle,
        ContractType,
        IssueDate,
        DueDate,
        PartyName,
        Status,
        IsPro,
        IsRecharge,
        IsCreditMemo,
        IsLiability,
        TotalAmount,
        CurrencyExgID,
        Purpose,
        fromCode
    ) => {
        return {
            WKMasterID,
            InvoiceNo,
            SupplierName,
            SubmarineCable,
            WorkTitle,
            ContractType,
            IssueDate,
            DueDate,
            PartyName,
            Status,
            IsPro,
            IsRecharge,
            IsCreditMemo,
            IsLiability,
            TotalAmount,
            CurrencyExgID,
            Purpose,
            Code: fromCode
        };
    };

    const handleLink = () => {
        dispatch(activeItem({ openItem: ['item2'] }));
    };

    const handleDialogOpen = () => {
        if (action !== '檢視') {
            setIsPurposeDialogOpen(true);
        }
    };

    const handleDialogClose = () => {
        setIsPurposeDialogOpen(false);
    };

    const getBmStoneList = (api) => {
        if (action === '編輯') {
            fetch(api, { method: 'GET' })
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        setBmStoneList(data);
                    }
                    if (data.alert_msg) {
                        setBmStoneList([]);
                        dispatch(
                            setMessageStateOpen({
                                messageStateOpen: {
                                    isOpen: true,
                                    severity: 'error',
                                    message: data.alert_msg
                                }
                            })
                        );
                    }
                })
                .catch(() => {
                    setBmStoneList([]);
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
        }
    };

    const getPartList = () => {
        fetch(dropdownmenuParties, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? ''
            },
            body: JSON.stringify({
                SubmarineCable: submarineCable,
                WorkTitle: workTitle,
                IsLiability: isLiability.toString()
            })
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setPartyNameList(data);
                }
                if (data.alert_msg) {
                    setPartyNameList([]);
                    dispatch(
                        setMessageStateOpen({
                            messageStateOpen: {
                                isOpen: true,
                                severity: 'error',
                                message: data.alert_msg
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
    };

    const infoCheck = () => {
        // 金額確認
        let detailAmount = 0;
        invoiceDetailInfo.forEach((i) => {
            detailAmount = detailAmount + Number(i.FeeAmount);
        });
        if (Number(totalAmount).toFixed(6) !== Number(detailAmount).toFixed(6)) {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '總金額不等於費用項目金額加總'
                    }
                })
            );
            return false;
        }
        if ((!isLiability || isLiability === 'false') && partyName === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '不攤分請選擇會員名稱'
                    }
                })
            );
            return false;
        }
        if (submarineCable === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入海纜名稱'
                    }
                })
            );
            return false;
        }
        if (workTitle === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入海纜作業'
                    }
                })
            );
            return false;
        }
        if (supplierName === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: { isOpen: true, severity: 'error', message: '請輸入供應商' }
                })
            );
            return false;
        }
        if (invoiceNo === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入發票號碼'
                    }
                })
            );
            return false;
        }
        if (contractType === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入合約種類'
                    }
                })
            );
            return false;
        }
        if (!isLiability && partyName === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入會員名稱'
                    }
                })
            );
            return false;
        }
        return true;
    };

    const saveEdit = () => {
        if (infoCheck()) {
            let tmpArray = createData(
                wKMasterID.current,
                invoiceNo.trim() === '' ? 'No.' + dayjs(new Date()).format('YYYYMMDDHHmmss') : invoiceNo,
                supplierName,
                submarineCable,
                workTitle,
                contractType,
                dayjs(issueDate).format('YYYY-MM-DD HH:mm:ss'),
                dayjs(dueDate).format('YYYY-MM-DD HH:mm:ss'),
                partyName,
                'TEMPORARY',
                isPro === 'true' || isPro === true ? true : false,
                isRecharge === 'true' || isRecharge === true ? true : false,
                isCreditMemo === 'true' || isCreditMemo === true ? true : false,
                isLiability === 'true' || isLiability === true ? true : false,
                Number(totalAmount),
                currencyExgID,
                rateInfo.current.Purpose,
                fromCode,
                rateInfo.current.ExgRate,
                rateInfo.current.ToCode
            );
            invoiceDetailInfo.forEach((i) => {
                i.FeeAmount = Number(i.FeeAmount);
            });
            let combineArray = {
                InvoiceWKMaster: tmpArray,
                InvoiceWKDetail: invoiceDetailInfo
            };
            let tmpModifyItem;
            listInfo.forEach((i) => {
                if (i.InvoiceWKMaster.InvoiceNo === modifyItem) {
                    tmpModifyItem = i.InvoiceWKMaster.WKMasterID;
                }
            });
            let tmpWKMasterID = {
                WKMasterID: tmpModifyItem
            };
            fetch(deleteInvoiceWKMaster, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? ''
                },
                body: JSON.stringify(tmpWKMasterID)
            })
                .then((res) => res.json())
                .then(() => {
                    console.log('刪除主檔成功');
                    fetch(deleteInvoiceWKDetail, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                            Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? ''
                        },
                        body: JSON.stringify(tmpWKMasterID)
                    })
                        .then((res) => res.json())
                        .then(() => {
                            console.log('刪除明細成功');
                            fetch(generateInvoice, {
                                method: 'POST',
                                headers: {
                                    'Content-type': 'application/json',
                                    Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? ''
                                },
                                body: JSON.stringify(combineArray)
                            })
                                .then((res) => res.json())
                                .then(() => {
                                    dispatch(
                                        setMessageStateOpen({
                                            messageStateOpen: {
                                                isOpen: true,
                                                severity: 'success',
                                                message: '儲存成功'
                                            }
                                        })
                                    );
                                    // 重新query
                                    initQuery();
                                    itemInfoInitial();
                                    setAction('');
                                })
                                .catch((e) => console.log('e3=>>', e));
                        })
                        .catch((e) => console.log('e2=>>', e));
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
        }
    };

    const cancelAdd = () => {
        itemInfoInitial();
        setAction('');
        setModifyItem('');
    };

    const handleReturnClose = () => {
        setIsReturnOpen(false);
        returnDataList.current = {};
        actionBack.current = '';
    };

    const fetchAndHandleResponse = async (url, method = 'POST', body = {}, successMessage, errorMessage, successCallback) => {
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-type': 'application/json',
                    Authorization: 'Bearer ' + (localStorage.getItem('accessToken') ?? '')
                },
                body: JSON.stringify(body)
            });
            const data = await response.json();
            if (data?.ifReturn !== false || !data.hasOwnProperty('ifReturn')) {
                successCallback && successCallback(data);
                dispatch(setMessageStateOpen({ messageStateOpen: { isOpen: true, severity: 'success', message: successMessage } }));
            } else {
                dispatch(setMessageStateOpen({ messageStateOpen: { isOpen: true, severity: 'error', message: errorMessage } }));
                if (data?.BillMaster) {
                    returnDataList.current = data.BillMaster;
                    setIsReturnOpen(true);
                    actionBack.current = body.Status;
                }
            }
        } catch {
            dispatch(setMessageStateOpen({ messageStateOpen: { isOpen: true, severity: 'error', message: '網路異常，請檢查網路連線或與系統窗口聯絡' } }));
        }
    };

    useEffect(() => {
        // if ((modifyItem !== '' && action === '編輯') || (modifyItem !== '' && action === '檢視')) {
        //     listInfo.forEach((i) => {
        //         if (i.InvoiceWKMaster.InvoiceNo === modifyItem) {
        //             setSupplierName(i.InvoiceWKMaster.SupplierName);
        //             setInvoiceNo(i.InvoiceWKMaster.InvoiceNo);
        //             setSubmarineCable(i.InvoiceWKMaster.SubmarineCable);
        //             setWorkTitle(i.InvoiceWKMaster.WorkTitle);
        //             setContractType(i.InvoiceWKMaster.ContractType);
        //             setIssueDate(i.InvoiceWKMaster.IssueDate);
        //             setDueDate(i.InvoiceWKMaster.DueDate);
        //             setTotalAmount(i.InvoiceWKMaster.TotalAmount);
        //             setIsPro(i.InvoiceWKMaster.IsPro);
        //             setIsLiability(i.InvoiceWKMaster.IsLiability);
        //             setIsRecharge(i.InvoiceWKMaster.IsRecharge);
        //             setIsCreditMemo(i.InvoiceWKMaster.IsCreditMemo);
        //             setPartyName(i.InvoiceWKMaster.PartyName);
        //             setInvoiceDetailInfo(i.InvoiceWKDetail);
        //             setFromCode(i.InvoiceWKMaster.Code);
        //             setCurrencyExgID(i.InvoiceWKMaster.CurrencyExgID);
        //             rateInfo.current = {
        //                 Purpose: i.InvoiceWKMaster.Purpose,
        //                 ExgRate: i.InvoiceWKMaster.ExgRate,
        //                 ToCode: i.InvoiceWKMaster.ToCode
        //             };
        //             setPurpose(i.InvoiceWKMaster.Purpose);
        //             wKMasterID.current = i.InvoiceWKMaster.WKMasterID;
        //         }
        //     });
        // }
        if ((modifyItem && action === '編輯') || (modifyItem && action === '檢視')) {
            const item = listInfo.find((i) => i.InvoiceWKMaster.InvoiceNo === modifyItem);
            if (item) {
                const {
                    SupplierName,
                    InvoiceNo,
                    SubmarineCable,
                    WorkTitle,
                    ContractType,
                    IssueDate,
                    DueDate,
                    TotalAmount,
                    IsPro,
                    IsLiability,
                    IsRecharge,
                    IsCreditMemo,
                    PartyName,
                    Code,
                    CurrencyExgID,
                    Purpose,
                    ExgRate,
                    ToCode,
                    WKMasterID
                } = item.InvoiceWKMaster;
                setSupplierName(SupplierName);
                setInvoiceNo(InvoiceNo);
                setSubmarineCable(SubmarineCable);
                setWorkTitle(WorkTitle);
                setContractType(ContractType);
                setIssueDate(IssueDate);
                setDueDate(DueDate);
                setTotalAmount(TotalAmount);
                setIsPro(IsPro);
                setIsLiability(IsLiability);
                setIsRecharge(IsRecharge);
                setIsCreditMemo(IsCreditMemo);
                setPartyName(PartyName);
                setInvoiceDetailInfo(item.InvoiceWKDetail);
                setFromCode(Code);
                setCurrencyExgID(CurrencyExgID);
                setPurpose(Purpose);

                rateInfo.current = { Purpose, ExgRate, ToCode };
                wKMasterID.current = WKMasterID;
            }
        }
    }, [modifyItem, action]);

    useEffect(() => {
        if (action === '待立帳' || action === '作廢' || action === '退回' || action === '刪除') {
            const item = listInfo.find((i) => i.InvoiceWKMaster.InvoiceNo === modifyItem);
            if (item) {
                const tmpModifyItem = item.InvoiceWKMaster.WKMasterID;
                const actionHandlers = {
                    待立帳: () =>
                        fetchAndHandleResponse(updateInvoice, 'POST', { WKMasterID: tmpModifyItem, Status: 'VALIDATED' }, '待立帳成功', '待立帳失敗', () => {
                            setPage(0);
                            setAction('');
                        }),
                    作廢: () => fetchAndHandleResponse(afterBilled, 'POST', { WKMasterID: tmpModifyItem }, '作廢成功', '作廢失敗'),
                    退回: () => fetchAndHandleResponse(returnToValidated, 'POST', { WKMasterID: tmpModifyItem }, '退回成功', '退回失敗'),
                    刪除: () => {
                        fetchAndHandleResponse(deleteInvoiceWKMaster, 'POST', { WKMasterID: tmpModifyItem }, '刪除成功', '刪除失敗', () => {
                            fetchAndHandleResponse(deleteInvoiceWKDetail, 'POST', { WKMasterID: tmpModifyItem }, '刪除明細成功', '刪除明細失敗', () => {
                                setPage(0);
                                setAction('');
                            });
                        });
                    }
                };
                actionHandlers[action] && actionHandlers[action]();
            }
            initQuery();
        }
    }, [action]);

    // useEffect(() => {
    //     let tmpModifyItem;
    //     if (action === '待立帳' || action === '作廢' || action === '退回' || action === '刪除') {
    //         listInfo.forEach((i) => {
    //             if (i.InvoiceWKMaster.InvoiceNo === modifyItem) {
    //                 tmpModifyItem = i.InvoiceWKMaster.WKMasterID;
    //             }
    //         });
    //     }
    //     if (action === '待立帳') {
    //         let tmpArray = {
    //             WKMasterID: tmpModifyItem,
    //             Status: 'VALIDATED'
    //         };
    //         fetch(updateInvoice, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-type': 'application/json',
    //                 Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? ''
    //             },
    //             body: JSON.stringify(tmpArray)
    //         })
    //             .then((res) => res.json())
    //             .then(() => {
    //                 dispatch(
    //                     setMessageStateOpen({
    //                         messageStateOpen: {
    //                             isOpen: true,
    //                             severity: 'success',
    //                             message: '待立帳成功'
    //                         }
    //                     })
    //                 );
    //                 setPage(0);
    //                 setAction('');
    //                 queryInitTemporary();
    //             })
    //             .catch(() => {
    //                 dispatch(
    //                     setMessageStateOpen({
    //                         messageStateOpen: {
    //                             isOpen: true,
    //                             severity: 'error',
    //                             message: '網路異常，請檢查網路連線或與系統窗口聯絡'
    //                         }
    //                     })
    //                 );
    //             });
    //     }
    //     if (action === '作廢') {
    //         let tmpArray = {
    //             WKMasterID: tmpModifyItem
    //         };
    //         fetch(afterBilled, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-type': 'application/json',
    //                 Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? ''
    //             },
    //             body: JSON.stringify(tmpArray)
    //         })
    //             .then((res) => res.json())
    //             .then((data) => {
    //                 if (!data.ifReturn && data.hasOwnProperty('ifReturn')) {
    //                     dispatch(
    //                         setMessageStateOpen({
    //                             messageStateOpen: {
    //                                 isOpen: true,
    //                                 severity: 'error',
    //                                 message: '作廢失敗'
    //                             }
    //                         })
    //                     );
    //                     returnDataList.current = data.BillMaster;
    //                     setIsReturnOpen(true);
    //                     actionBack.current = '作廢';
    //                 } else if (data.ifReturn && data.hasOwnProperty('ifReturn')) {
    //                     dispatch(
    //                         setMessageStateOpen({
    //                             messageStateOpen: {
    //                                 isOpen: true,
    //                                 severity: 'success',
    //                                 message: '作廢成功'
    //                             }
    //                         })
    //                     );
    //                 }
    //             })
    //             .catch(() => {
    //                 dispatch(
    //                     setMessageStateOpen({
    //                         messageStateOpen: {
    //                             isOpen: true,
    //                             severity: 'error',
    //                             message: '網路異常，請檢查網路連線或與系統窗口聯絡'
    //                         }
    //                     })
    //                 );
    //             });
    //     }
    //     if (action === '退回') {
    //         let tmpArray = {
    //             WKMasterID: tmpModifyItem
    //         };
    //         fetch(returnToValidated, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-type': 'application/json',
    //                 Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? ''
    //             },
    //             body: JSON.stringify(tmpArray)
    //         })
    //             .then((res) => res.json())
    //             .then((data) => {
    //                 if (!data.ifReturn && data.hasOwnProperty('ifReturn')) {
    //                     dispatch(
    //                         setMessageStateOpen({
    //                             messageStateOpen: {
    //                                 isOpen: true,
    //                                 severity: 'error',
    //                                 message: '退回失敗'
    //                             }
    //                         })
    //                     );
    //                     returnDataList.current = data.BillMaster;
    //                     setIsReturnOpen(true);
    //                     actionBack.current = '退回';
    //                 } else if (data.ifReturn && data.hasOwnProperty('ifReturn')) {
    //                     dispatch(
    //                         setMessageStateOpen({
    //                             messageStateOpen: {
    //                                 isOpen: true,
    //                                 severity: 'success',
    //                                 message: '退回成功'
    //                             }
    //                         })
    //                     );
    //                 }
    //             })
    //             .catch(() => {
    //                 dispatch(
    //                     setMessageStateOpen({
    //                         messageStateOpen: {
    //                             isOpen: true,
    //                             severity: 'error',
    //                             message: '網路異常，請檢查網路連線或與系統窗口聯絡'
    //                         }
    //                     })
    //                 );
    //             });
    //     }
    //     if (action === '刪除') {
    //         let tmpArray = {
    //             WKMasterID: tmpModifyItem
    //         };
    //         fetch(deleteInvoiceWKMaster, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-type': 'application/json',
    //                 Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? ''
    //             },
    //             body: JSON.stringify(tmpArray)
    //         })
    //             .then((res) => res.json())
    //             .then(() => {
    //                 console.log('刪除主檔成功');
    //                 fetch(deleteInvoiceWKDetail, {
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-type': 'application/json',
    //                         Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? ''
    //                     },
    //                     body: JSON.stringify(tmpArray)
    //                 })
    //                     .then((res) => res.json())
    //                     .then(() => {
    //                         setPage(0);
    //                         setAction('');
    //                         initQuery();
    //                         dispatch(
    //                             setMessageStateOpen({
    //                                 messageStateOpen: {
    //                                     isOpen: true,
    //                                     severity: 'success',
    //                                     message: '刪除成功'
    //                                 }
    //                             })
    //                         );
    //                     })
    //                     .catch(() => {
    //                         dispatch(
    //                             setMessageStateOpen({
    //                                 messageStateOpen: {
    //                                     isOpen: true,
    //                                     severity: 'error',
    //                                     message: '網路異常，請檢查網路連線或與系統窗口聯絡'
    //                                 }
    //                             })
    //                         );
    //                     });
    //             })
    //             .catch(() => {
    //                 dispatch(
    //                     setMessageStateOpen({
    //                         messageStateOpen: {
    //                             isOpen: true,
    //                             severity: 'error',
    //                             message: '網路異常，請檢查網路連線或與系統窗口聯絡'
    //                         }
    //                     })
    //                 );
    //             });
    //     }
    // }, [action]);

    useEffect(() => {
        if (workTitle && submarineCable) {
            if (action === '編輯') {
                const fetchSupplierList = async () => {
                    try {
                        const data = await fetchData(`${supplierNameListForInvoice}SubmarineCable=${submarineCable}&WorkTitle=${workTitle}`);
                        const budgetListData = await fetchData(getLevels, 'POST', {
                            SubmarineCable: submarineCable,
                            WorkTitle: workTitle,
                            budget_year: dayjs(issueDate).format('YYYY')
                        });
                        setDropdownLists((prev) => ({ ...prev, supNmList: data }));
                        setDropdownLists((prev) => ({ ...prev, budgetList: budgetListData[0]?.data || [] }));
                    } catch (error) {
                        console.error('Error fetching supplier list:', error);
                    }
                };
                fetchSupplierList();
                const shouldReset = listInfo.some(
                    (i) => i.InvoiceWKMaster.InvoiceNo === modifyItem && (i?.InvoiceWKMaster.WorkTitle !== workTitle || i?.InvoiceWKMaster.SubmarineCable !== submarineCable)
                );

                if (shouldReset) {
                    rateInfo.current = {};
                    setCurrencyExgID(null);
                    setPurpose('');
                }
            } else if (action === '檢視') {
                setDropdownLists((prev) => ({ ...prev, supNmList: [{ SupplierName: supplierName }] }));
            }
        }
    }, [workTitle, submarineCable, action]);

    useEffect(() => {
        // rateInfo.current = {}; 使用者更動海纜名稱跟海纜作業才能清空匯率資料
        // setCurrencyExgID(null); 使用者更動海纜名稱跟海纜作業才能清空匯率資料
        if (workTitle && submarineCable && isLiability.toString() !== 'false') {
            let bmStone = billMilestoneList + 'SubmarineCable=' + submarineCable + '&WorkTitle=' + workTitle + '&End=false&IsLiability=' + isLiability;
            getBmStoneList(bmStone);
            // } else if (workTitle && submarineCable && isLiability.toString() === 'false' && !partyName) {
        } else if (workTitle && submarineCable && isLiability.toString() === 'false') {
            setBmStoneList([]);
            getPartList();
        } else {
            setBmStoneList([]);
            setPartyNameList([]);
        }
    }, [workTitle, submarineCable, isLiability]);

    useEffect(() => {
        if (workTitle && submarineCable && isLiability.toString() === 'false' && partyName) {
            const bmStone = `${billMilestoneList}SubmarineCable=${submarineCable}&WorkTitle=${workTitle}&End=false&IsLiability=${isLiability}&PartyName=${partyName}`;
            getBmStoneList(bmStone);
        }
    }, [workTitle, submarineCable, isLiability, partyName]);

    useEffect(() => {
        itemInfoInitial();
        setAction('');
        setModifyItem('');
        firstQueryInit();
        //海纜名稱
        const fetchSubmarineCableList = async () => {
            try {
                const data = await fetchData(submarineCableInfoList);
                setDropdownLists((prev) => ({ ...prev, submarineCableList: data }));
            } catch (error) {
                console.error('Error fetching submarine cable list:', error);
            }
        };
        const fetchCurrencyData = async () => {
            try {
                const data = await fetchData(getCurrencyData);
                setDropdownLists((prev) => ({ ...prev, codeList: data }));
            } catch (error) {
                console.error('Error fetching currency data:', error);
            }
        };
        const fetchBMData = async () => {
            try {
                const data = await fetchData(billMilestoneLiabilityList);
                setDropdownLists((prev) => ({ ...prev, bmsList: data }));
            } catch (error) {
                console.error('Error fetching currency data:', error);
            }
        };
        const fetchWorkTitle = async () => {
            try {
                const data = await fetchData(getWorkTitle, 'POST', {});
                setDropdownLists((prev) => ({ ...prev, workTitleList: data }));
            } catch (error) {
                console.error('Error fetching currency data:', error);
            }
        };
        const fetchSupplierName = async () => {
            try {
                const data = await fetchData(supplierNameDropDownUnique);
                setDropdownLists((prev) => ({ ...prev, supNmList: data }));
            } catch (error) {
                console.error('Error fetching currency data:', error);
            }
        };
        fetchSubmarineCableList();
        fetchCurrencyData();
        fetchBMData();
        fetchWorkTitle();
        fetchSupplierName();
    }, []);

    return (
        <>
            <ChosePurpose
                isPurposeDialogOpen={isPurposeDialogOpen}
                handleDialogClose={handleDialogClose}
                submarineCable={submarineCable}
                workTitle={workTitle}
                fromCode={fromCode}
                codeList={dropdownLists.codeList}
                currencyExgID={currencyExgID}
                setCurrencyExgID={setCurrencyExgID}
                rateInfo={rateInfo}
                setPurpose={setPurpose}
            />
            <ReturnDataList isReturnOpen={isReturnOpen} handleReturnClose={handleReturnClose} returnDataList={returnDataList.current} actionBack={actionBack.current} />
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <MainCard sx={{ width: '100%' }}>
                        <Grid container display="flex" spacing={2}>
                            <Grid item xs={12}>
                                <InvoiceQuery
                                    setListInfo={setListInfo}
                                    queryApi={queryApi}
                                    supNmList={dropdownLists.supNmList}
                                    submarineCableList={dropdownLists.submarineCableList}
                                    bmsList={dropdownLists.bmsList}
                                    setAction={setAction}
                                    setPage={setPage}
                                    codeList={dropdownLists.codeList}
                                />
                            </Grid>
                        </Grid>
                    </MainCard>
                </Grid>
                <Grid item xs={12}>
                    <MainCard title="發票資料列表" sx={{ width: '100%' }}>
                        <Grid container display="flex" spacing={2}>
                            <Grid item xs={12}>
                                <InvoiceDataList listInfo={listInfo} setAction={setAction} setModifyItem={setModifyItem} page={page} setPage={setPage} action={action} />
                            </Grid>
                        </Grid>
                    </MainCard>
                </Grid>
                {action === '編輯' || action === '檢視' ? (
                    <Grid item xs={12}>
                        <MainCard sx={{ width: '100%' }}>
                            <Grid container display="flex" spacing={2}>
                                {/* 左 */}
                                <Grid item xs={6}>
                                    <CreateInvoiceMain
                                        handleDialogOpen={handleDialogOpen}
                                        supplierName={supplierName}
                                        setSupplierName={setSupplierName}
                                        invoiceNo={invoiceNo}
                                        setInvoiceNo={setInvoiceNo}
                                        submarineCable={submarineCable}
                                        setSubmarineCable={setSubmarineCable}
                                        workTitle={workTitle}
                                        setWorkTitle={setWorkTitle}
                                        contractType={contractType}
                                        setContractType={setContractType}
                                        issueDate={issueDate}
                                        setIssueDate={setIssueDate}
                                        dueDate={dueDate}
                                        setDueDate={setDueDate}
                                        totalAmount={totalAmount}
                                        setTotalAmount={setTotalAmount}
                                        isPro={isPro}
                                        setIsPro={setIsPro}
                                        isLiability={isLiability}
                                        setIsLiability={setIsLiability}
                                        isRecharge={isRecharge}
                                        setIsRecharge={setIsRecharge}
                                        fromCode={fromCode}
                                        setFromCode={setFromCode}
                                        isCreditMemo={isCreditMemo}
                                        setIsCreditMemo={setIsCreditMemo}
                                        partyName={partyName}
                                        setPartyName={setPartyName}
                                        submarineCableList={dropdownLists.submarineCableList}
                                        action={action}
                                        codeList={dropdownLists.codeList}
                                        partyNameList={partyNameList}
                                        supNmList={dropdownLists.supNmList}
                                        workTitleList={dropdownLists.workTitleList}
                                        rateInfo={rateInfo}
                                        purpose={purpose}
                                    />
                                </Grid>
                                {/* 右 */}
                                <Grid item xs={6}>
                                    <CreateInvoiceDetail
                                        setInvoiceDetailInfo={setInvoiceDetailInfo}
                                        invoiceDetailInfo={invoiceDetailInfo}
                                        bmStoneList={bmStoneList}
                                        budgetList={dropdownLists.budgetList}
                                        action={action}
                                        itemDetailInitial={itemDetailInitial}
                                        billMilestone={billMilestone}
                                        setBillMilestone={setBillMilestone}
                                        feeItem={feeItem}
                                        setFeeItem={setFeeItem}
                                        feeAmount={feeAmount}
                                        setFeeAmount={setFeeAmount}
                                        isTax={isTax}
                                        budgetInfo={budgetInfo}
                                        setBudgetInfo={setBudgetInfo}
                                    />
                                </Grid>
                                {action === '編輯' ? (
                                    <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                                        <Button variant="contained" onClick={saveEdit} sx={{ mx: 1 }}>
                                            儲存編輯
                                        </Button>
                                        <Button variant="contained" onClick={cancelAdd} sx={{ mx: 1 }}>
                                            取消編輯
                                        </Button>
                                    </Grid>
                                ) : null}
                            </Grid>
                        </MainCard>
                    </Grid>
                ) : null}
                <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                    <Link to="/CreateJournal/CreateJournal" onClick={handleLink} style={{ color: '#262626', textDecoration: 'none' }}>
                        <Button variant="contained">切換至立帳作業</Button>
                    </Link>
                </Grid>
            </Grid>
        </>
    );
};

export default InvoiceWorkManage;
