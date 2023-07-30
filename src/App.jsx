
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './pages/login';
import ContactPage from './pages/contact';
import BookPage from './pages/book';
import { Outlet } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import RegisterPage from './pages/register';
import { useEffect, useState } from "react";
import { callFetchAccount } from "./services/api";
import { useDispatch, useSelector } from "react-redux";
import { doGetAccountAction } from "./redux/account/accountSlice";
import Loading from "./components/Loading";
import NotFound from "./components/NotFound";
import AdminPage from "./pages/admin";
import ProtectedRoute from "./components/ProtectedRoute";
import LayoutAdmin from './components/Admin/LayoutAdmin';
import './styles/reset.scss';
import './styles/global.scss';
import UserTable from "./components/Admin/User/UserTable";
import BookTable from "./components/Admin/Book/BookTable";
import OrderPage from "./pages/order";
import OrderHistory from "./pages/orderHistory";
import ManageOrder from "./components/Admin/ManageOrder/ManageOrder";


const Layout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className='layout-app'>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Outlet context={[searchTerm, setSearchTerm]} />
      <Footer />
    </div>
  )
}

// const LayoutAdmin = () => {
//   const isAdminRoute = window.location.pathname.startsWith('/admin');
//   const user = useSelector(state => state.account.user);
//   const userRole = user.role;

//   return (
//     <div className="layout-app">
//       {isAdminRoute && userRole === 'ADMIN' && <Header />}
//       <Outlet />
//       {isAdminRoute && userRole === 'ADMIN' && <Footer />}
//     </div>
//   )
// }

export default function App() {

  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.account.isLoading)
  // const isAuthenticated = useSelector(state => state.account.isAuthenticated)

  const getAccount = async () => {
    if (window.location.pathname === '/login'
      || window.location.pathname === '/register'
    ) return;

    const res = await callFetchAccount();
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data))
    }
  }

  useEffect(() => {
    getAccount();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "contact",
          element: <ContactPage />,
        },
        {
          path: "book/:slug",//dấu : định nghĩa param, slug là tên biến có thể đặt bất kì
          element: <BookPage />,
        },
        {
          path: "order",
          element:
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
        },
        {
          path: "history",
          element:
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
        }
      ],
    },

    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,
      children: [
        {
          index: true, element:
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
        },
        {
          path: "user",
          element: <UserTable />,
        },
        {
          path: "book",
          element: <BookTable />,
        },
        {
          path: "manage-order",
          element: <ManageOrder />,
        },
      ],
    },

    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);

  return (
    <>
      {
        // isAuthenticated === true
        isLoading === false
          || window.location.pathname === '/login'
          || window.location.pathname === '/register'
          || window.location.pathname === '/'
          ?
          <RouterProvider router={router} />
          :
          <Loading />
      }
    </>

  )
}

