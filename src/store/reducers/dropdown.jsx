// types
import { createSlice } from '@reduxjs/toolkit';
console.log('env2:', process.env.REACT_APP_ENV_FLAGE);
let envFlag = false;
if (process.env.REACT_APP_ENV_FLAGE === 'ol') {
    console.log('env3:', process.env.REACT_APP_ENV_FLAGE);
    envFlag = true;
}

// initial state
const initialState = {
    isOL: envFlag,
    isLoading: false,
    // isLogin: window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1') ? true : false,
    // isTimeout: window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1') ? true : false,
    isLogin: false,
    isTimeout: false,
    bmsList: [], //計帳段號下拉選單
    loginInInfo: { EmployeeNumber: '', Email: '', Name: '' },
    // 主選功能
    userInfo: {
        UserID: '',
        //設定
        InvoiceWK: false, //發票工作管理
        Invoice: false, // 立帳管理
        Bill: false, //應收帳款管理
        Pay: false, //廠商付款處理
        CB: false, //CB
        CM: false, //CN
        GlobalQuery: false, //發票帳單全域管理
        Report: false, //報表產製與管理
        Data: false, //基本資料設定
        Liability: false,
        PartyNotify: false, //會員提醒通知管理
        SysNotify: false, //內部提醒通知管理
        Role: false, //使用者權限管理
        System: false, //系統開發測試文件
        SupplierNotify: false, //供應商提醒通知管理
        Superior: false, //主管功能管理
        // InvoiceWK: window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1') ? true : false, //發票工作管理
        // Invoice: window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1') ? true : false, // 立帳管理
        // Bill: window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1') ? true : false, //應收帳款管理
        // Pay: window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1') ? true : false, //廠商付款處理
        // CB: window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1') ? true : false, //CB
        // CM: window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1') ? true : false, //CN
        // GlobalQuery: window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1') ? true : false, //發票帳單全域管理
        // Report: window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1') ? true : false, //報表產製與管理
        // Data: window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1') ? true : false, //基本資料設定
        // Liability: window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1') ? true : false,
        // PartyNotify: window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1') ? true : false, //會員提醒通知管理
        // SysNotify: window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1') ? true : false, //內部提醒通知管理
        // Role: window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1') ? true : false, //使用者權限管理
        // System: window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1') ? true : false, //系統開發測試文件
        // SupplierNotify: window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1') ? true : false, //供應商提醒通知管理
        // Superior: window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1') ? true : false, //主管功能管理
        UPerMIDNo: -1,
        UserCName: '',
        PCode: '',
        HashedPassword: '',
        ProfilePhotoURI: ''
    },
    messageStateOpen: { isOpen: false, severity: '', message: '' }
};

// ==============================|| SLICE - MENU ||============================== //

const dropdown = createSlice({
    name: 'dropdown',
    initialState,
    reducers: {
        setIsLoading(state, action) {
            state.isLoading = action.payload.isLoading;
        },
        setIsLogin(state, action) {
            state.isLogin = action.payload.isLogin;
        },
        setLoginInInfo(state, action) {
            state.loginInInfo = action.payload.loginInInfo;
        },
        setUserInfo(state, action) {
            state.userInfo = action.payload.userInfo;
        },
        setMessageStateOpen(state, action) {
            state.messageStateOpen = action.payload.messageStateOpen;
        }
    }
});

export default dropdown.reducer;

export const { setMessageStateOpen, setIsLogin, setUserInfo, setLoginInInfo, setIsLoading } = dropdown.actions;
