// import PropTypes from 'prop-types';

// // material-ui
// import { Box, Grid, Paper, Stack } from '@mui/material';

// // project import
// import AuthCard from './AuthCard';
// import Logo from 'components/Logo';
// import AuthFooter from 'components/cards/AuthFooter';

// import avatar4 from 'assets/images/loginBG.jpg';

// const styles = {
//     paperContainer: {
//         // backgroundImage: `url(${'https://itbrief.com.au/uploads/story/2021/08/19/GettyImages-1219077605.webp'})`,
//         backgroundImage: `url(${avatar4})`,
//         backgroundSize: 'cover',
//         // color: 'white',
//         color: '#000079',
//         width: '100vw',
//         height: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         fontSize: '3rem'
//     }
// };

// // ==============================|| AUTHENTICATION - WRAPPER ||============================== //

// const AuthWrapper = ({ children }) => (
//     <Box sx={{ minHeight: '100vh' }}>
//         <Paper style={styles.paperContainer}>
//             <Grid container>
//                 <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
//                     <Grid item xs={12} container sx={{ position: 'absolute', width: 'auto' }}>
//                         <Grid item>
//                             <AuthCard>{children}</AuthCard>
//                         </Grid>
//                     </Grid>
//                 </Grid>
//             </Grid>
//         </Paper>
//     </Box>
// );

// AuthWrapper.propTypes = {
//     children: PropTypes.node
// };

// export default AuthWrapper;
