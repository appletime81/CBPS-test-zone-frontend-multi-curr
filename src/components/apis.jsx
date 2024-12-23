//let env = 'internal-cbpsAlb-1176080923.ap-northeast-1.elb.amazonaws.com'
// let env = '10.193.130.75:8000';
let env = '127.0.0.1:8000';
let httpEnv = 'http';

if (process.env.REACT_APP_ENV_FLAGE === 'qa') {
    env = 'cbpsqabe.cht.com.tw';
    httpEnv = 'https';
} else if (process.env.REACT_APP_ENV_FLAGE === 'ol') {
    env = 'cbpsbe.cht.com.tw';
    httpEnv = 'https';
}
export const ssoUrlQA =
    'https://iam-qa.cht.com.tw/auth/realms/B2E/protocol/openid-connect/auth?client_id=CBPS.QA.I&response_type=code&redirect_uri=https://cbpsqa.cht.com.tw&scope=ldap';
export const ssoUrlOL =
    'https://iam.cht.com.tw/auth/realms/B2E/protocol/openid-connect/auth?client_id=CBPS-CBPS.OL.I&response_type=code&redirect_uri=https://cbps.cht.com.tw&scope=ldap';

export const redirectUriQA = 'https://cbpsqa.cht.com.tw';
export const redirectUriOL = 'https://cbps.cht.com.tw';
// 'https://internal-cbpsalbfrontend-1323185980.ap-northeast-1.elb.amazonaws.com';

export const accessSSOQA =
    'https://iam-qa.cht.com.tw/auth/realms/B2E/protocol/openid-connect/token';
export const accessSSOOL = 'https://iam.cht.com.tw/auth/realms/B2E/protocol/openid-connect/token';

// Login
export const generatetoken = `${httpEnv}://${env}/api/v1/generatetoken`;
export const checktoken = `${httpEnv}://${env}/api/v1/checktoken`;
export const checktokenForLDAP = `${httpEnv}://${env}/api/v1/checktokenForLDAP`;

// 下拉選單
export const dropdownmenuParties = `${httpEnv}://${env}/api/v1/dropdownmenuParties`;

// 產生發票工作檔
export const generateInvoice = `${httpEnv}://${env}/api/v1/generateInvoiceWKMaster&InvoiceWKDetail`;

// 更新工作檔狀態
export const updateInvoice = `${httpEnv}://${env}/api/v1/updateInvoiceWKMaster`;

// 查詢發票工作檔狀態
export const getInvoiceWKMasterInvoiceWKDetail = `${httpEnv}://${env}/api/v1/getInvoiceWKMaster&InvoiceWKDetail`;

// 刪除發票工作檔
export const deleteInvoiceWKMaster = `${httpEnv}://${env}/api/v1/deleteInvoiceWKMaster`;
export const deleteInvoiceWKDetail = `${httpEnv}://${env}/api/v1/deleteInvoiceWKDetail`;

//發票與附件管理
export const uploadInvoiceWKMaster = `${httpEnv}://${env}/api/v1/uploadInvoiceWKMaster`;
export const uploadInvoiceWKMasterAttachment = `${httpEnv}://${env}/api/v1/uploadInvoiceWKMaster/Attachment`;
export const downloadInvoiceWKMaster = `${httpEnv}://${env}/api/v1/downloadInvoiceWKMaster`;
export const downloadInvoiceWKMasterAttachment = `${httpEnv}://${env}/api/v1/downloadInvoiceWKMaster/Attachment`;

//Liability下拉選單
export const updateLiability = `${httpEnv}://${env}/api/v1/updateLiability`;

// 查詢Liability
export const compareLiability = `${httpEnv}://${env}/api/v1/compareLiability`;
export const addLiabilityapi = `${httpEnv}://${env}/api/v1/batchAddLiability`;
export const deleteLiability = `${httpEnv}://${env}/api/v1/deleteLiability`;
export const dropdownmenuBillMilestone = `${httpEnv}://${env}/api/v1/dropdownmenuBillMilestone`;

// 立帳的發票查詢
export const addInvoiceMasterInvoiceDetail = `${httpEnv}://${env}/api/v1/addInvoiceMaster&InvoiceDetail`;
export const updateInvoiceMaster = `${httpEnv}://${env}/api/v1/updateInvoiceMaster`;
export const checkInvoiceNo = `${httpEnv}://${env}/api/v1/checkInvoiceNo`;

// 立帳與附件管理
export const uploadSignedBillMaster = `${httpEnv}://${env}/api/v1/uploadSignedBillMaster`;
export const downloadBillMaster = `${httpEnv}://${env}/api/v1/downloadBillMaster`;
export const downloadBillMasterAttachment = `${httpEnv}://${env}/api/v1/downloadBillMaster/Attachment`;
export const billMasterAndAttachment = `${httpEnv}://${env}/api/v1/SendEmail/BillMasterAndAttachment`;

// 應收帳款管理
export const uploadFileApi = `${httpEnv}://${env}/api/v1/uploadSignedBillMaster`;
export const uploadBillMasterAttachment = `${httpEnv}://${env}/api/v1/uploadBillMasterAttachment`;

// CB
export const generateReport = `${httpEnv}://${env}/api/v1/CreditBalanceStatement/generateReport`;

// CM
// export const creditMemoApi = `${httpEnv}://${env}/api/v1/CreditMemo`;
export const creditMemoView = `${httpEnv}://${env}/api/v1/CreditMemo/view`;
export const getCreditMemoStreamApi = `${httpEnv}://${env}/api/v1/getCreditMemoStream`;
export const uploadCreditMemoApi = `${httpEnv}://${env}/api/v1/uploadCreditMemo`;
export const downloadCreditMemoApi = `${httpEnv}://${env}/api/v1/downloadCreditMemo`;

// 待合併
export const combineInvo = `${httpEnv}://${env}/api/v1/getBillMaster&BillDetailStream`;
export const isBillNoCheckOK = `${httpEnv}://${env}/api/v1/checkBillingNo`;
export const generateBillNoCovert = `${httpEnv}://${env}/api/v1/checkBillingNo/convert`;
export const initBillMasterBillDetail = `${httpEnv}://${env}/api/v1/initBillMaster&BillDetail`;
export const sendDuctInfo = `${httpEnv}://${env}/api/v1/generateBillMaster&BillDetail`;

// 產製應收帳款-已抵扣
export const generateBillData = `${httpEnv}://${env}/api/v1/getBillMasterDraftStream`;

// 產製應收帳款-已簽核
export const updateBM = `${httpEnv}://${env}/api/v1/updateBillMaster`;
// export const downBM = `${httpEnv}://${env}/api/v1/BillMaster/signedDraft`;

// 銷帳
// export const sendToWriteOff = `${httpEnv}://${env}/api/v1/BillMaster&BillDetail/toWriteOff`;
export const getWriteOffDetail = `${httpEnv}://${env}/api/v1/getWriteOffDetail`;
export const getBillMasterBillDetail = `${httpEnv}://${env}/api/v1/getBillMaster&BillDetail`;
export const saveWriteOff = `${httpEnv}://${env}/api/v1/WriteOffDetail/saveWriteOff`;
export const submitWriteOff = `${httpEnv}://${env}/api/v1/BillMaster&BillDetail/submitWriteOff`;
export const completeWriteOff = `${httpEnv}://${env}/api/v1/completeWriteOff`;

// 廠商付款處理
export const sendPayment = `${httpEnv}://${env}/api/v1/payment/submit`;
export const getPayMasterPayStatement = `${httpEnv}://${env}/api/v1/getPayMaster&PayStatement`;
export const paymentExchangeStart = `${httpEnv}://${env}/api/v1/payment/exchangeStart`;
export const paymentExchangeProcess = `${httpEnv}://${env}/api/v1/payment/exchangeProcess`;

// 退回-發票查詢
export const returnToValidated = `${httpEnv}://${env}/api/v1/returnToValidated`;
// 退回-待抵扣
export const beforeDuction = `${httpEnv}://${env}/api/v1/returnBillMaster/beforeduction`;
// 退回-已抵扣
export const afterDeduction = `${httpEnv}://${env}/api/v1/returnBillMaster/afterdeduction`;
// 發票查詢-作廢
export const afterBilled = `${httpEnv}://${env}/api/v1/invalidInvoice/afterBilled`;
export const getPayDraftStream = `${httpEnv}://${env}/api/v1/getPayDraftStream`;
export const getPayDraftStreamCBRefund = `${httpEnv}://${env}/api/v1/getPayDraftStream/CBRefund`;
// 全域查詢
export const searchBillMasterByInvoiceWKMaster = `${httpEnv}://${env}/api/v1/searchBillMasterByInvoiceWKMaster`;
export const searchInvoiceWKMasterByBillMaster = `${httpEnv}://${env}/api/v1/searchInvoiceWKMasterByBillMaster`;
export const searchInvoiceWKMasterIsBilled = `${httpEnv}://${env}/api/v1/searchInvoiceWKMasterIsBilled`;

// 基本資料-workTitle
export const getWorkTitle = `${httpEnv}://${env}/api/v1/getWorkTitle`;
export const addWorkTitle = `${httpEnv}://${env}/api/v1/addWorkTitle`;
export const deleteWorkTitle = `${httpEnv}://${env}/api/v1/deleteWorkTitle`;
export const updateWorkTitle = `${httpEnv}://${env}/api/v1/updateWorkTitle`;

// 基本資料-Suppliers
export const suppliers = `${httpEnv}://${env}/api/v1/Suppliers`;
export const deleteSuppliers = `${httpEnv}://${env}/api/v1/deleteSuppliers`;
export const editSuppliers = `${httpEnv}://${env}/api/v1/updateSuppliers`;

// 基本資料-Parties
export const parties = `${httpEnv}://${env}/api/v1/Parties`;
export const deleteParties = `${httpEnv}://${env}/api/v1/deleteParties`;
export const editParties = `${httpEnv}://${env}/api/v1/updateParties`;

// 基本資料-SubmarineCables
export const submarineCables = `${httpEnv}://${env}/api/v1/SubmarineCables`;
export const deleteSubmarineCables = `${httpEnv}://${env}/api/v1/deleteSubmarineCables`;
export const editSubmarineCables = `${httpEnv}://${env}/api/v1/updateSubmarineCables`;

// 基本資料-Corporates
export const corporates = `${httpEnv}://${env}/api/v1/Corporates`;
export const deleteCorporates = `${httpEnv}://${env}/api/v1/deleteCorporates`;
export const editCorporates = `${httpEnv}://${env}/api/v1/updateCorporates`;

// 通知
export const addBillNotifyRule = `${httpEnv}://${env}/api/v1/Notification/BillMaster/addBillNotifyRule`;
export const addSysInvNotifyRule = `${httpEnv}://${env}/api/v1/Notification/InvoiceWKMaster/addSysInvNotifyRule&SysInvNotifyRecipients`;
export const getSysInvNotifyRule = `${httpEnv}://${env}/api/v1/Notification/InvoiceWKMaster/getSysInvNotifyRule&SysInvNotifyRecipients`;
export const updateSysInvNotifyRule = `${httpEnv}://${env}/api/v1/Notification/InvoiceWKMaster/updateSysInvNotifyRule&SysInvNotifyRecipients`;
export const deleteSysInvNotifyRule = `${httpEnv}://${env}/api/v1/Notification/InvoiceWKMaster/deleteSysInvNotifyRule`;

// GET
export const supplierNameListForInvoice = `${httpEnv}://${env}/api/v1/Suppliers/`; //供應商
export const supplierNameDropDownUnique = `${httpEnv}://${env}/api/v1/dropdownmenuSuppliers`; //供應商
export const submarineCableInfoList = `${httpEnv}://${env}/api/v1/SubmarineCables/all`; // 海纜名稱
export const supplierNameList = `${httpEnv}://${env}/api/v1/Suppliers/all`; //供應商
export const billMilestoneLiabilityList = `${httpEnv}://${env}/api/v1/dropdownmenuBillMilestone`; //計帳段號
export const billMilestoneList = `${httpEnv}://${env}/api/v1/BillMilestone/`;
export const dropdownmenuSubmarineCable = `${httpEnv}://${env}/api/v1/dropdownmenuSubmarineCable`; // 海纜名稱
// export const workTitleLiabilityList = `${httpEnv}://${env}/api/v1/dropdownmenuWorkTitle`;
export const queryLiability = `${httpEnv}://${env}/api/v1/Liability`;
export const toBillDataapi = `${httpEnv}://${env}/api/v1/getInvoiceMaster&InvoiceDetailStream`;
export const journalDetailView = `${httpEnv}://${env}/api/v1/InvoiceDetail`;
export const journalMasterView = `${httpEnv}://${env}/api/v1/InvoiceWKMaster`;
export const queryToCombineInvo = `${httpEnv}://${env}/api/v1/getInvoiceMaster&InvoiceDetail`;
export const queryToDecutBill = `${httpEnv}://${env}/api/v1/getBillMaster&BillDetail`;
export const quertDeductedData = `${httpEnv}://${env}/api/v1/getBillMaster&BillDetailWithCBData`;
// export const contactUser = `${httpEnv}://${env}/api/v1/User/all`;
export const dropdownmenuUsers = `${httpEnv}://${env}/api/v1/dropdownmenuUsers`;
export const querySupplierPayment = `${httpEnv}://${env}/api/v1/payment`;
export const queryPaydraft = `${httpEnv}://${env}/api/v1/paydraft`;
export const getPartiesAllInfo = `${httpEnv}://${env}/api/v1/Parties/all`; // 會員名稱
// export const getContractsInfo = `${httpEnv}://${env}/api/v1/Contracts/all`;
export const getCorporatesInfo = `${httpEnv}://${env}/api/v1/Corporates/all`;
// export const getPartiesByContractInfo = `${httpEnv}://${env}/api/v1/PartiesByContract/all`;

// CreditBalance
export const queryCB = `${httpEnv}://${env}/api/v1/CreditBalance`;
export const creditBalanceRefund = `${httpEnv}://${env}/api/v1/CreditBalance/refund`;
export const refundView = `${httpEnv}://${env}/api/v1/CBStatement/Refund/view`;
export const cBRefund = `${httpEnv}://${env}/api/v1/initPayDraft/CBRefund`;
export const cBRefundView = `${httpEnv}://${env}/api/v1/initPayDraft/CBRefund/view`;
export const uploadPayDraft = `${httpEnv}://${env}/api/v1/uploadPayDraft/CBRefund`;
export const updatePayDraft = `${httpEnv}://${env}/api/v1/updatePayDraft/CBRefund`;

// currency
export const addCurrencyData = `${httpEnv}://${env}/api/v1/add_currency_data`;
export const getCurrencyData = `${httpEnv}://${env}/api/v1/get_currency_data`;
export const addCurrencyExchangeData = `${httpEnv}://${env}/api/v1/add_currency_exchange_data`;
export const getCurrencyExchangeData = `${httpEnv}://${env}/api/v1/get_currency_exchange_data`;
export const updateCurrencyData = `${httpEnv}://${env}/api/v1/update_currency_data`;
export const deleteCurrencyData = `${httpEnv}://${env}/api/v1/delete_currency_data`;
export const updateCurrencyExchangeData = `${httpEnv}://${env}/api/v1/update_currency_exchange_data`;
export const corporatesView = `${httpEnv}://${env}/api/v1/Corporates/view`;
