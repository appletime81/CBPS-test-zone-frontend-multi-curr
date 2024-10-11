// project import
import invoiceWorkManagePage from './invoiceWorkManagePage';
import dashboard from './dashboard';
import createJournal from './createJournal';
import creditBalanceManage from './creditBalanceManage';
import CreditMemoManage from './creditMemoManage';
import accountsReceivable from './accountsReceivable';
import supplierPayment from './supplierPayment';
import allResearch from './allResearch';
import uploadManage from './uploadManage';
import setting from './setting';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
    items: [
        dashboard,
        invoiceWorkManagePage,
        createJournal,
        accountsReceivable,
        supplierPayment,
        creditBalanceManage,
        CreditMemoManage,
        allResearch,
        uploadManage,
        setting,
    ],
};

export default menuItems;
