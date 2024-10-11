import { useEffect, useState, forwardRef, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, useMediaQuery, Snackbar, CircularProgress } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

// project import
import Drawer from './Drawer';
import navigation from 'menu-items';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

// types
import { openDrawer } from 'store/reducers/menu';
import { setMessageStateOpen, setUserInfo, setIsLoading } from 'store/reducers/dropdown';

// redux
import { setLoginInInfo } from 'store/reducers/dropdown';
import dayjs from 'dayjs';

// api
import {
    checktokenForLDAP,
    ssoUrlQA,
    ssoUrlOL,
    redirectUriQA,
    redirectUriOL,
    accessSSOQA,
    accessSSOOL,
} from 'components/apis.jsx';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
    const theme = useTheme();
    const matchDownLG = useMediaQuery(theme.breakpoints.down('xl'));
    const dispatch = useDispatch();
    const { drawerOpen } = useSelector((state) => state.menu);
    // drawer toggler
    const [open, setOpen] = useState(drawerOpen);
    const handleDrawerToggle = () => {
        setOpen(!open);
        dispatch(openDrawer({ drawerOpen: !open }));
    };

    // idle time
    // const [isActive, setisActive] = useState(false);
    // let timeoutId;
    // const timeout = 3000;

    //清除目前逾時並設定新的逾時
    // const resetTimeout = () => {
    //   clearTimeout(timeoutId);
    //   timeoutId = setTimeout(() => setisActive(true), timeout);
    // };
    //使用者活動時觸發，並在使用者不空閒時重置逾時
    // const onActivity = () => {
    //   if (isActive) {
    //     setisActive(false);
    //   }
    //   resetTimeout();
    // };

    // useEffect(() => {
    //   console.log('timeout=>>', timeout);
    //   const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];

    //   const onVisibilityChange = () => {
    //     if (document.visibilityState === 'visible') {
    //       resetTimeout();
    //     }
    //   };

    //   events.forEach((event) => {
    //     window.addEventListener(event, onActivity);
    //   });

    //   document.addEventListener('visibilitychange', onVisibilityChange);

    //   resetTimeout();

    //   return () => {
    //     clearTimeout(timeoutId);
    //     events.forEach((event) => {
    //       window.removeEventListener(event, onActivity);
    //     });
    //     document.removeEventListener('visibilitychange', onVisibilityChange);
    //   };
    // }, [timeout]);

    //messageInfo
    const [isOpenNow, setIsOpenNow] = useState(false);
    const timer = useRef();
    const { messageStateOpen, isLoading, isOL } = useSelector((state) => state.dropdown); //message狀態
    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} {...props} sx={{ fontSize: 16 }} />;
    });
    const handleLoading = () => {
        if (!isLoading) {
            setIsOpenNow(false);
            dispatch(setIsLoading({ isLoading: true }));
            timer.current = window.setTimeout(() => {
                setIsOpenNow(true);
                dispatch(setIsLoading({ isLoading: false }));
            }, 500);
        }
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        dispatch(
            setMessageStateOpen({ messageStateOpen: { isOpen: false, severity: '', message: '' } }),
        );
        setIsOpenNow(false);
    };

    // set media wise responsive drawer
    useEffect(() => {
        setOpen(!matchDownLG);
        dispatch(openDrawer({ drawerOpen: !matchDownLG }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchDownLG]);

    useEffect(() => {
        if (open !== drawerOpen) setOpen(drawerOpen);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [drawerOpen]);

    let accessSSO = isOL ? accessSSOOL : accessSSOQA;

    useEffect(() => {
        //haha1
        const getExpireTime = localStorage.getItem('expireTimeCBP');
        console.log('程式起點1=>>', window.location.href.indexOf('code'));
        if (window.location.href.indexOf('code') !== -1) {
            if (dayjs(getExpireTime).diff(new Date(), 'minute') > 0) {
                // 傳送使用者資料取得權限
                let accessToken = localStorage.getItem('accessToken');
                fetch(checktokenForLDAP, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: 'Bearer' + accessToken,
                    },
                    body: JSON.stringify({ accessToken: accessToken }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        console.log('使用者權限資料1=>>', data);
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
                const accessCode = window.location.href.split('code=')[1];
                let tmpArray = {
                    client_id: isOL ? 'CBPS-CBPS.OL.I' : 'CBPS.QA.I',
                    redirect_uri: isOL ? redirectUriOL : redirectUriQA,
                    // redirect_uri:
                    //     'c2be8338-3cce-494d-880f-9b47773246f9.c7fc3a89-861f-4ece-9362-eb1814c0b5c2.4d93c876-915e-4ed3-bd09-968595f302c8',
                    code: accessCode,
                    grant_type: 'authorization_code',
                };
                const searchParams = new URLSearchParams(tmpArray);
                fetch(accessSSO, {
                    method: 'POST',
                    body: searchParams,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.access_token) {
                            dispatch(
                                setLoginInInfo({
                                    loginInInfo: {
                                        EmployeeNumber: jwt_decode(data.access_token)
                                            .employeeNumber,
                                        Email: jwt_decode(data.access_token).email,
                                        Name: jwt_decode(data.access_token).name,
                                    },
                                }),
                            );
                            // localStorage.setItem('expireTime', dayjs().add(31, 'minute'));
                            // 傳送使用者資料取得權限
                            fetch(checktokenForLDAP, {
                                method: 'POST',
                                headers: {
                                    'Content-type': 'application/json',
                                    Authorization: 'Bearer' + data.access_token,
                                },
                                body: JSON.stringify(data.access_token),
                            })
                                .then((res) => res.json())
                                .then((data) => {
                                    console.log('使用者權限資料1=>>', data);
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
        } else if (
            dayjs(getExpireTime).diff(new Date(), 'minute') > 0 &&
            localStorage.getItem('accessToken')
        ) {
            // 傳送使用者資料取得權限
            let accessToken = localStorage.getItem('accessToken');
            fetch(checktokenForLDAP, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: 'Bearer' + accessToken,
                },
                body: JSON.stringify({ accessToken: accessToken }),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log('使用者權限資料1=>>', data);
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
    }, []);

    useEffect(() => {
        if (messageStateOpen.isOpen) handleLoading();
    }, [messageStateOpen.isOpen]);

    // const [idleTime, setIdleTime] = useState(0);

    useEffect(() => {
        let timer;
        const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
        const resetTimer = () => {
            // setIdleTime(0);
            clearTimeout(timer);
            timer = setTimeout(() => {
                // Here, you can perform actions upon detecting idle time, like logging out the user
                console.log('User is idle for a specified time.');
                window.location.replace(isOL ? ssoUrlOL : ssoUrlQA);
                // For instance, you could trigger a function to log out the user or display a message
            }, 1805000); // Adjust this time according to your requirement (e.g., 5 seconds for testing)
        };

        const clearTimer = () => {
            clearTimeout(timer);
        };

        const handleUserActivity = () => {
            resetTimer();
        };

        // Event listeners for user activity
        events.forEach((event) => {
            window.addEventListener(event, handleUserActivity);
        });

        // Initial setup of the timer
        resetTimer();

        // Cleanup: Remove event listeners and clear timer on unmount
        return () => {
            events.forEach((event) => {
                window.removeEventListener(event, handleUserActivity);
            });
            clearTimer();
        };
    }, []);

    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            {/* Side Bar */}
            <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
            {/* Content */}
            <Box component="main" sx={{ width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                {/* <Breadcrumbs navigation={navigation} title titleBottom card={false} divider={false} /> */}
                <Breadcrumbs navigation={navigation} title divider={false} />
                <Outlet sx={{ width: '100%' }} />
            </Box>
            {/* 警示按鈕 */}
            {isLoading && (
                <Box
                    sx={{
                        position: 'absolute',
                        width: '95vw',
                        height: '100%',
                        zIndex: 10000,
                    }}
                >
                    <CircularProgress
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                        }}
                        size={68}
                    />
                </Box>
            )}
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={isOpenNow}
                autoHideDuration={10000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity={messageStateOpen.severity}
                    sx={{ width: '100%' }}
                >
                    {messageStateOpen.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MainLayout;
