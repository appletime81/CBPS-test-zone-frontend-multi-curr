import { useEffect, useState, useRef } from 'react';

// material-ui
import { Grid } from '@mui/material';
// project import
import MainCard from 'components/MainCard';
import InvoiceQuery from './invoiceQuery';
import InvoiceDataList from './invoiceDataList';
import ReturnDataList from './returnDataList';

// api
import {
    getInvoiceWKMasterInvoiceWKDetail,
    updateInvoice,
    deleteInvoiceWKMaster,
    deleteInvoiceWKDetail,
    returnToValidated,
    afterBilled,
    supplierNameDropDownUnique,
    submarineCableInfoList,
    billMilestoneLiabilityList,
} from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const InvoiceWorkManage = () => {
    const dispatch = useDispatch();
    const wKMasterID = useRef(); //工作檔ID
    const [bmsList, setBmsList] = useState([]); //計帳段號下拉選單
    const [action, setAction] = useState('');
    const [modifyItem, setModifyItem] = useState([]);
    const queryApi = useRef({});
    const queryApiTemporary = { Status: ['TEMPORARY'] };
    const [submarineCableList, setSubmarineCableList] = useState([]); //海纜名稱下拉選單
    const [listInfo, setListInfo] = useState([]);
    const [page, setPage] = useState(0); //分頁Page
    const [isReturnOpen, setIsReturnOpen] = useState(false);
    const [supNmList, setSupNmList] = useState([]); //供應商下拉選單
    const returnDataList = useRef([]);
    const actionBack = useRef('');

    const itemInfoInitial = () => {
        wKMasterID.current = 0;
    };

    const initQuery = () => {
        fetch(getInvoiceWKMasterInvoiceWKDetail, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
            },
            body: JSON.stringify(queryApi.current),
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
                            message: '網路異常，請檢查網路連線或與系統窗口聯絡',
                        },
                    }),
                );
            });
    };

    const queryInitTemporary = () => {
        fetch(getInvoiceWKMasterInvoiceWKDetail, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
            },
            body: JSON.stringify(queryApiTemporary),
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
                            message: '網路異常，請檢查網路連線或與系統窗口聯絡',
                        },
                    }),
                );
            });
    };

    useEffect(() => {
        itemInfoInitial();
        setAction('');
        setModifyItem([]);
        fetch(supplierNameDropDownUnique, {
            method: 'GET',
            Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setSupNmList(data);
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
        //海纜名稱
        fetch(submarineCableInfoList, { method: 'GET' })
            .then((res) => res.json())
            .then((data) => {
                setSubmarineCableList(data);
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
        fetch(billMilestoneLiabilityList, { method: 'GET' })
            .then((res) => res.json())
            .then((data) => {
                setBmsList(data);
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
    }, []);

    useEffect(() => {
        let tmpModifyItem;
        if (action === '待立帳' || action === '作廢' || action === '退回') {
            listInfo.forEach((i) => {
                if (i.InvoiceWKMaster.InvoiceNo === modifyItem) {
                    tmpModifyItem = i.InvoiceWKMaster.WKMasterID;
                }
            });
        }
        if (action === '待立帳') {
            let tmpArray = {
                WKMasterID: tmpModifyItem,
                Status: 'VALIDATED',
            };
            fetch(updateInvoice, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
                },
                body: JSON.stringify(tmpArray),
            })
                .then((res) => res.json())
                .then(() => {
                    dispatch(
                        setMessageStateOpen({
                            messageStateOpen: {
                                isOpen: true,
                                severity: 'success',
                                message: 'Validated成功',
                            },
                        }),
                    );
                    setPage(0);
                    setAction('');
                    queryInitTemporary();
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
        }
        if (action === '作廢') {
            let tmpArray = {
                WKMasterID: tmpModifyItem,
            };
            fetch(afterBilled, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
                },
                body: JSON.stringify(tmpArray),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (!data.ifReturn && data.hasOwnProperty('ifReturn')) {
                        dispatch(
                            setMessageStateOpen({
                                messageStateOpen: {
                                    isOpen: true,
                                    severity: 'error',
                                    message: '作廢失敗',
                                },
                            }),
                        );
                        returnDataList.current = data.BillMaster;
                        setIsReturnOpen(true);
                        actionBack.current = '作廢';
                    } else if (data.ifReturn && data.hasOwnProperty('ifReturn')) {
                        dispatch(
                            setMessageStateOpen({
                                messageStateOpen: {
                                    isOpen: true,
                                    severity: 'success',
                                    message: '作廢成功',
                                },
                            }),
                        );
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
        }
        if (action === '退回') {
            let tmpArray = {
                WKMasterID: tmpModifyItem,
            };
            fetch(returnToValidated, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
                },
                body: JSON.stringify(tmpArray),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (!data.ifReturn && data.hasOwnProperty('ifReturn')) {
                        dispatch(
                            setMessageStateOpen({
                                messageStateOpen: {
                                    isOpen: true,
                                    severity: 'error',
                                    message: '退回失敗',
                                },
                            }),
                        );
                        returnDataList.current = data.BillMaster;
                        setIsReturnOpen(true);
                        actionBack.current = '退回';
                    } else if (data.ifReturn && data.hasOwnProperty('ifReturn')) {
                        dispatch(
                            setMessageStateOpen({
                                messageStateOpen: {
                                    isOpen: true,
                                    severity: 'success',
                                    message: '退回成功',
                                },
                            }),
                        );
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
        }
        if (action === '刪除') {
            let tmpArray = {
                WKMasterID: tmpModifyItem,
            };
            fetch(deleteInvoiceWKMaster, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
                },
                body: JSON.stringify(tmpArray),
            })
                .then((res) => res.json())
                .then(() => {
                    console.log('刪除主檔成功');
                    fetch(deleteInvoiceWKDetail, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                            Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
                        },
                        body: JSON.stringify(tmpArray),
                    })
                        .then((res) => res.json())
                        .then(() => {
                            dispatch(
                                setMessageStateOpen({
                                    messageStateOpen: {
                                        isOpen: true,
                                        severity: 'success',
                                        message: '刪除成功',
                                    },
                                }),
                            );
                            setPage(0);
                            setAction('');
                            initQuery();
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
        }
    }, [action]);

    const handleReturnClose = () => {
        setIsReturnOpen(false);
        returnDataList.current = {};
        actionBack.current = '';
    };

    return (
        <>
            <ReturnDataList
                isReturnOpen={isReturnOpen}
                handleReturnClose={handleReturnClose}
                returnDataList={returnDataList.current}
                actionBack={actionBack.current}
            />
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <MainCard sx={{ width: '100%' }}>
                        <Grid container display="flex" spacing={2}>
                            <Grid item xs={12}>
                                <InvoiceQuery
                                    setListInfo={setListInfo}
                                    queryApi={queryApi}
                                    supNmList={supNmList}
                                    submarineCableList={submarineCableList}
                                    bmsList={bmsList}
                                    setAction={setAction}
                                    setPage={setPage}
                                />
                            </Grid>
                        </Grid>
                    </MainCard>
                </Grid>
                <Grid item xs={12}>
                    <MainCard title="發票資料列表" sx={{ width: '100%' }}>
                        <Grid container display="flex" spacing={2}>
                            <Grid item xs={12}>
                                <InvoiceDataList
                                    listInfo={listInfo}
                                    page={page}
                                    setPage={setPage}
                                />
                            </Grid>
                        </Grid>
                    </MainCard>
                </Grid>
            </Grid>
        </>
    );
};

export default InvoiceWorkManage;
