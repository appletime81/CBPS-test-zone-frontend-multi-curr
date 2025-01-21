import PropTypes from 'prop-types';

// material-ui
import { Typography, Grid, FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio } from '@mui/material';
// material-ui
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// project import
import MainCard from 'components/MainCard';
import NumericFormatCustom from 'components/numericFormatCustom';
import { TextField } from '@mui/material/index';

// api
import { checkInvoiceNo } from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

// ==============================|| SAMPLE PAGE ||============================== //

const InvoiceWorkManage = ({
    handleDialogOpen,
    action,
    supplierName,
    setSupplierName,
    invoiceNo,
    setInvoiceNo,
    submarineCable,
    setSubmarineCable,
    workTitle,
    setWorkTitle,
    contractType,
    setContractType,
    issueDate,
    setIssueDate,
    dueDate,
    setDueDate,
    totalAmount,
    setTotalAmount,
    isPro,
    setIsPro,
    isLiability,
    setIsLiability,
    isRecharge,
    setIsRecharge,
    fromCode,
    setFromCode,
    partyName,
    setPartyName,
    submarineCableList,
    codeList,
    purpose,
    partyNameList,
    supNmList,
    workTitleList,
    rateInfo
}) => {
    // const [supNmList, setSupNmList] = useState([]); //供應商下拉選單
    const dispatch = useDispatch();
    const invoiceNoCheck = () => {
        if (action !== '檢視') {
            let tmpArray = {
                InvoiceNo: invoiceNo
            };
            fetch(checkInvoiceNo, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? ''
                },
                body: JSON.stringify(tmpArray)
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.isExist) {
                        dispatch(
                            setMessageStateOpen({
                                messageStateOpen: {
                                    isOpen: true,
                                    severity: 'error',
                                    message: '發票號碼重複'
                                }
                            })
                        );
                        setInvoiceNo('');
                    } else {
                        dispatch(
                            setMessageStateOpen({
                                messageStateOpen: {
                                    isOpen: true,
                                    severity: 'success',
                                    message: '發票號碼無重複'
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
        }
    };

    console.log('partyName=>>', partyName, partyNameList);
    console.log('rateInfo=>', rateInfo);

    return (
        <MainCard title="發票工作主檔" sx={{ height: '100%' }}>
            <Grid container display="flex" justifyContent="center" alignItems="center" spacing={1}>
                {/* row1 */}
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0rem', xl: '1.5rem' }
                        }}
                    >
                        海纜名稱：
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇海纜</InputLabel>
                        <Select value={submarineCable} label="發票供應商" inputProps={{ readOnly: action === '檢視' }} onChange={(e) => setSubmarineCable(e.target.value)}>
                            {submarineCableList.map((i) => (
                                <MenuItem key={i.CableName} value={i.CableName}>
                                    {i.CableName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0rem', xl: '1.5rem' }
                        }}
                    >
                        海纜作業：
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇海纜作業</InputLabel>
                        <Select value={workTitle} label="填寫海纜作業" inputProps={{ readOnly: action === '檢視' }} onChange={(e) => setWorkTitle(e.target.value)}>
                            {workTitleList.map((i) => (
                                <MenuItem key={i.Title} value={i.Title}>
                                    {i.Title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                {/* row2 */}
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0rem', xl: '1.5rem' }
                        }}
                    >
                        供應商：
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇供應商</InputLabel>
                        <Select value={supplierName} label="發票供應商" inputProps={{ readOnly: action === '檢視' }} onChange={(e) => setSupplierName(e.target.value)}>
                            {supNmList.map((i) => (
                                <MenuItem key={i.SupplierName} value={i.SupplierName}>
                                    {i.SupplierName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0rem', xl: '1.5rem' }
                        }}
                    >
                        發票號碼：
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        // disabled={action === '檢視'}
                        value={invoiceNo}
                        size="small"
                        label="發票號碼"
                        inputProps={{
                            readOnly: action === '檢視',
                            onBlur: () => {
                                invoiceNoCheck();
                            }
                        }}
                        onChange={(e) => setInvoiceNo(e.target.value)}
                    />
                </Grid>
                {/* row3 */}
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0rem', xl: '1.5rem' }
                        }}
                    >
                        合約種類：
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇合約種類</InputLabel>
                        <Select value={contractType} label="發票供應商" inputProps={{ readOnly: action === '檢視' }} onChange={(e) => setContractType(e.target.value)}>
                            <MenuItem value={'SC'}>SC</MenuItem>
                            <MenuItem value={'NSC'}>NSC</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0rem', xl: '1.5rem' }
                        }}
                    >
                        發票日期：
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                    <FormControl>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                inputFormat="YYYY/MM/DD"
                                value={issueDate}
                                readOnly={action === '檢視'}
                                onChange={(e) => {
                                    setIssueDate(e);
                                }}
                                renderInput={(params) => <TextField size="small" {...params} />}
                            />
                        </LocalizationProvider>
                    </FormControl>
                </Grid>
                {/* row4 */}
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0rem', xl: '1.5rem' }
                        }}
                    >
                        總金額：
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                    <TextField
                        value={totalAmount}
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="填寫發票總金額"
                        InputProps={{
                            readOnly: action === '檢視',
                            inputComponent: NumericFormatCustom
                        }}
                        onChange={(e) => {
                            setTotalAmount(e.target.value);
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0rem', xl: '1.5rem' }
                        }}
                    >
                        發票到期日：
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                    <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                inputFormat="YYYY/MM/DD"
                                value={dueDate}
                                readOnly={action === '檢視'}
                                onChange={(e) => setDueDate(e)}
                                renderInput={(params) => <TextField size="small" {...params} />}
                            />
                        </LocalizationProvider>
                    </FormControl>
                </Grid>
                {/* row5 */}
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0rem', xl: '1.5rem' }
                        }}
                    >
                        幣別：
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇原始幣別</InputLabel>
                        <Select value={fromCode} label="幣別" inputProps={{ readOnly: action === '檢視' }} onChange={(e) => setFromCode(e.target.value)}>
                            {codeList?.map((i) => (
                                <MenuItem key={i.Code} value={i.Code}>
                                    {i.Code}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0rem', xl: '1.5rem' }
                        }}
                    >
                        匯率資料：
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={4}>
                    <FormControl fullWidth>
                        <TextField
                            size="small"
                            value={purpose}
                            InputProps={{
                                readOnly: true,
                                onClick: () => handleDialogOpen()
                            }}
                        />
                    </FormControl>
                </Grid>
                {/* row6 */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0rem', xl: '1.5rem' }
                        }}
                    >
                        是否為Pro-Forma：
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <FormControl>
                        <RadioGroup row value={isPro} onChange={(e) => setIsPro(e.target.value)}>
                            <FormControlLabel
                                value={true}
                                disabled={action === '檢視'}
                                control={
                                    <Radio
                                        sx={{
                                            '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } }
                                        }}
                                    />
                                }
                                label="Y"
                            />
                            <FormControlLabel
                                value={false}
                                disabled={action === '檢視'}
                                control={
                                    <Radio
                                        sx={{
                                            '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } }
                                        }}
                                    />
                                }
                                label="N"
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                {/* row7 */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0rem', xl: '1.5rem' }
                        }}
                    >
                        是否為短繳補收：
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <FormControl>
                        <RadioGroup row value={isRecharge} onChange={(e) => setIsRecharge(e.target.value)}>
                            <FormControlLabel
                                value={true}
                                disabled={action === '檢視'}
                                control={
                                    <Radio
                                        sx={{
                                            '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } }
                                        }}
                                    />
                                }
                                label="Y"
                            />
                            <FormControlLabel
                                value={false}
                                disabled={action === '檢視'}
                                control={
                                    <Radio
                                        sx={{
                                            '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } }
                                        }}
                                    />
                                }
                                label="N"
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2} lg={2}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0rem', xl: '1.5rem' }
                        }}
                    >
                        是否需攤分：
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                    <FormControl>
                        <RadioGroup
                            row
                            value={isLiability}
                            onChange={(e) => {
                                setIsLiability(e.target.value);
                                setPartyName('');
                            }}
                        >
                            <FormControlLabel
                                value={true}
                                disabled={action === '檢視'}
                                control={
                                    <Radio
                                        sx={{
                                            '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } }
                                        }}
                                    />
                                }
                                label="攤分"
                            />
                            <FormControlLabel
                                value={false}
                                disabled={action === '檢視'}
                                control={
                                    <Radio
                                        sx={{
                                            '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } }
                                        }}
                                    />
                                }
                                label="不攤分"
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                {/* row8 */}
                <Grid item xs={12} sm={6} md={2} lg={2}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0rem', xl: '1.5rem' }
                        }}
                    >
                        {isLiability === false || isLiability === 'false' ? '會員名稱：' : null}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                    {isLiability === false || isLiability === 'false' ? (
                        <FormControl fullWidth size="small">
                            <InputLabel>選擇會員</InputLabel>
                            <Select value={partyName} readOnly={action === '檢視'} label="不須攤分請填寫名稱" onChange={(e) => setPartyName(e.target.value)}>
                                {partyNameList.map((i) => (
                                    <MenuItem key={i} value={i}>
                                        {i}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : null}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} />
            </Grid>
        </MainCard>
    );
};

InvoiceWorkManage.propTypes = {
    action: PropTypes.string,
    supplierName: PropTypes.string,
    setSupplierName: PropTypes.func,
    invoiceNo: PropTypes.string,
    setInvoiceNo: PropTypes.func,
    submarineCable: PropTypes.string,
    setSubmarineCable: PropTypes.func,
    workTitle: PropTypes.string,
    setWorkTitle: PropTypes.func,
    contractType: PropTypes.string,
    setContractType: PropTypes.func,
    partyName: PropTypes.string,
    setPartyName: PropTypes.func,
    isRecharge: PropTypes.bool,
    setIsRecharge: PropTypes.func,
    isCreditMemo: PropTypes.bool,
    setIsCreditMemo: PropTypes.func,
    isLiability: PropTypes.bool,
    setIsLiability: PropTypes.func,
    totalAmount: PropTypes.number,
    setTotalAmount: PropTypes.func,
    submarineCableList: PropTypes.array,
    isPro: PropTypes.bool,
    setIsPro: PropTypes.func,
    dueDate: PropTypes.instanceOf(Date),
    setDueDate: PropTypes.func,
    issueDate: PropTypes.instanceOf(Date),
    setIssueDate: PropTypes.func
};

export default InvoiceWorkManage;
