import { Navigate } from 'react-router-dom';
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';

const routes = (isLoggedIn) => [
    {
        path: '/',
        element: !isLoggedIn ? <MainRoutes /> : <Navigate to="/" />,
        children: [
            { path: 'login', element: <LoginRoutes /> },
            { path: '/', element: <Navigate to="/login" /> },
        ],
    },
];

export default routes;
