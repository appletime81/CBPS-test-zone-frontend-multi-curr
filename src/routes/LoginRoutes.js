// import { lazy } from 'react';

// // project import
// import Loadable from 'components/Loadable';
// import MinimalLayout from 'layout/MinimalLayout';
// import { Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// // ==============================|| AUTH ROUTING ||============================== //

// // render - login
// const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));

// const RequireAuth = ({ children }) => {
//     const { isLogin } = useSelector((state) => state.dropdown);
//     if (isLogin) {
//         return <Navigate to="/" replace />;
//     }
//     return children;
// };

// const LoginRoutes = {
//     path: '/',
//     element: <MinimalLayout />,
//     children: [
//         {
//             path: 'login',
//             element: (
//                 <RequireAuth>
//                     <AuthLogin />
//                 </RequireAuth>
//             ),
//         },
//         {
//             path: '*',
//             element: (
//                 <RequireAuth>
//                     <AuthLogin />
//                 </RequireAuth>
//             ),
//         },
//     ],
// };

// export default LoginRoutes;
