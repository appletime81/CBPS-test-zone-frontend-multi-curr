// import React from 'react';

// // material-ui
// import {
//     Button,
//     FormHelperText,
//     Grid,
//     IconButton,
//     InputAdornment,
//     InputLabel,
//     OutlinedInput,
//     Stack,
// } from '@mui/material';

// // third party
// import * as Yup from 'yup';
// import { Formik } from 'formik';

// // project import
// import AnimateButton from 'components/@extended/AnimateButton';

// // assets
// import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

// import { useDispatch } from 'react-redux';
// import { setIsLogin, setMessageStateOpen, setUserInfo } from 'store/reducers/dropdown';

// //api
// import { generatetoken, checktoken } from 'components/apis.jsx';

// // ============================|| FIREBASE - LOGIN ||============================ //

// const AuthLogin = () => {
//     const dispatch = useDispatch();
//     const [showPassword, setShowPassword] = React.useState(false);

//     const handleClickShowPassword = () => {
//         setShowPassword(!showPassword);
//     };

//     const handleMouseDownPassword = (event) => {
//         event.preventDefault();
//     };

//     const localStorageService = (dataJWT) => {
//         localStorage.setItem('accessToken', dataJWT.accessToken);
//     };

//     return (
//         <>
//             <Formik
//                 initialValues={{
//                     account: '',
//                     password: '',
//                 }}
//                 validationSchema={Yup.object().shape({
//                     account: Yup.string().max(255).required('Account is required'),
//                     password: Yup.string().max(255).required('Password is required'),
//                 })}
//                 onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
//                     let tmpObj = {
//                         userid: values.account,
//                         password: values.password,
//                     };
//                     fetch(generatetoken, {
//                         method: 'POST',
//                         headers: {
//                             'Content-type': 'application/json',
//                         },
//                         body: JSON.stringify(tmpObj),
//                     })
//                         .then((res) => res.json())
//                         .then((data) => {
//                             if (data.cbps_access_token) {
//                                 localStorageService({ accessToken: data.cbps_access_token });
//                                 fetch(checktoken, {
//                                     method: 'POST',
//                                     headers: {
//                                         'Content-type': 'application/json',
//                                     },
//                                     body: JSON.stringify({
//                                         cbps_access_token: data.cbps_access_token,
//                                     }),
//                                 })
//                                     .then((res) => res.json())
//                                     .then((data2) => {
//                                         console.log('data2=>>', data2);
//                                         dispatch(
//                                             setMessageStateOpen({
//                                                 messageStateOpen: {
//                                                     isOpen: true,
//                                                     severity: 'success',
//                                                     message: `登入成功，${data2.UserCName}歡迎`,
//                                                 },
//                                             }),
//                                         );
//                                         dispatch(
//                                             setUserInfo({
//                                                 userInfo: {
//                                                     UserCName: data2.UserCName,
//                                                     ProfilePhotoURI: data2.ProfilePhotoURI,
//                                                 },
//                                             }),
//                                         );
//                                         dispatch(setIsLogin({ isLogin: true }));
//                                     })
//                                     .catch((e) =>
//                                         dispatch(
//                                             setMessageStateOpen({
//                                                 messageStateOpen: {
//                                                     isOpen: true,
//                                                     severity: 'error',
//                                                     message: '登入失敗，請重新登入',
//                                                 },
//                                             }),
//                                         ),
//                                     );
//                             } else {
//                                 dispatch(
//                                     setMessageStateOpen({
//                                         messageStateOpen: {
//                                             isOpen: true,
//                                             severity: 'error',
//                                             message: '登入錯誤，請檢查帳號密碼',
//                                         },
//                                     }),
//                                 );
//                             }
//                         })
//                         .catch((e) =>
//                             dispatch(
//                                 setMessageStateOpen({
//                                     messageStateOpen: {
//                                         isOpen: true,
//                                         severity: 'error',
//                                         message: '登入錯誤，請檢查帳號密碼',
//                                     },
//                                 }),
//                             ),
//                         );
//                 }}
//             >
//                 {({
//                     errors,
//                     handleBlur,
//                     handleChange,
//                     handleSubmit,
//                     isSubmitting,
//                     touched,
//                     values,
//                 }) => (
//                     <form noValidate onSubmit={handleSubmit}>
//                         <Grid container spacing={3}>
//                             <Grid item xs={12}>
//                                 <Stack spacing={1}>
//                                     <InputLabel htmlFor="account-login">Account</InputLabel>
//                                     <OutlinedInput
//                                         id="account-login"
//                                         type="account"
//                                         value={values.account}
//                                         name="account"
//                                         onBlur={handleBlur}
//                                         onChange={handleChange}
//                                         placeholder="Enter User Account"
//                                         fullWidth
//                                         error={Boolean(touched.account && errors.account)}
//                                     />
//                                     {touched.account && errors.account && (
//                                         <FormHelperText
//                                             error
//                                             id="standard-weight-helper-text-account-login"
//                                         >
//                                             {errors.account}
//                                         </FormHelperText>
//                                     )}
//                                 </Stack>
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <Stack spacing={1}>
//                                     <InputLabel htmlFor="password-login">Password</InputLabel>
//                                     <OutlinedInput
//                                         fullWidth
//                                         error={Boolean(touched.password && errors.password)}
//                                         id="-password-login"
//                                         type={showPassword ? 'text' : 'password'}
//                                         value={values.password}
//                                         name="password"
//                                         onBlur={handleBlur}
//                                         onChange={handleChange}
//                                         endAdornment={
//                                             <InputAdornment position="end">
//                                                 <IconButton
//                                                     aria-label="toggle password visibility"
//                                                     onClick={handleClickShowPassword}
//                                                     onMouseDown={handleMouseDownPassword}
//                                                     edge="end"
//                                                     size="large"
//                                                 >
//                                                     {showPassword ? (
//                                                         <EyeOutlined />
//                                                     ) : (
//                                                         <EyeInvisibleOutlined />
//                                                     )}
//                                                 </IconButton>
//                                             </InputAdornment>
//                                         }
//                                         placeholder="Enter password"
//                                     />
//                                     {touched.password && errors.password && (
//                                         <FormHelperText
//                                             error
//                                             id="standard-weight-helper-text-password-login"
//                                         >
//                                             {errors.password}
//                                         </FormHelperText>
//                                     )}
//                                 </Stack>
//                             </Grid>
//                             {errors.submit && (
//                                 <Grid item xs={12}>
//                                     <FormHelperText error>{errors.submit}</FormHelperText>
//                                 </Grid>
//                             )}
//                             <Grid item xs={12}>
//                                 <AnimateButton>
//                                     <Button
//                                         disableElevation
//                                         disabled={isSubmitting}
//                                         fullWidth
//                                         size="large"
//                                         type="submit"
//                                         variant="contained"
//                                         color="primary"
//                                     >
//                                         Login
//                                     </Button>
//                                 </AnimateButton>
//                             </Grid>
//                         </Grid>
//                     </form>
//                 )}
//             </Formik>
//         </>
//     );
// };

// export default AuthLogin;
