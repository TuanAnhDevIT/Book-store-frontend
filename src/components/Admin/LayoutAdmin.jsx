import React, { useEffect, useState } from 'react';
import {
    AppstoreOutlined,
    ExceptionOutlined,
    HeartTwoTone,
    TeamOutlined,
    UserOutlined,
    DollarCircleOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, message, Avatar } from 'antd';
import { Outlet, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import './layout.scss';
import { useDispatch, useSelector } from 'react-redux';
import { callLogout } from '../../services/api';
import { doLogoutAction } from '../../redux/account/accountSlice';
import ManageAccount from '../Account/ManageAccount';

const { Content, Footer, Sider } = Layout;

const items = [
    {
        label: <Link to='/admin'>Dashboard</Link>,
        key: 'dashboard',
        icon: <AppstoreOutlined />
    },
    {
        label: <span>Manage Users</span>,
        // key: 'user',
        icon: <UserOutlined />,
        children: [
            {
                label: <Link to='/admin/user'>CRUD</Link>,
                key: 'crud',
                icon: <TeamOutlined />,
            },
            // {
            //     label: 'Files1',
            //     key: 'file1',
            //     icon: <TeamOutlined />,
            // }
        ]
    },
    {
        label: <Link to='/admin/book'>Manage Books</Link>,
        key: 'book',
        icon: <ExceptionOutlined />
    },
    {
        label: <Link to='/admin/manage-order'>Manage Orders</Link>,
        key: 'order',
        icon: <DollarCircleOutlined />
    },

];

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const user = useSelector(state => state.account.user);

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (window.location.pathname.includes('/book')) {
            setActiveMenu('book')
        } else if (window.location.pathname.includes('/user')) {
            setActiveMenu('crud')
        } else if (window.location.pathname.includes('/manage-order')) {
            setActiveMenu('order')
        }
    }, [])

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res.data) {
            dispatch(doLogoutAction());
            message.success('Đăng xuất thành công');
            navigate('/')
        }
    }


    const itemsDropdown = [
        {
            label: (
                <div style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen(true)}>
                    Quản lý tài khoản
                </div>
            ),
            key: 'account',
        },
        {
            label: <Link to='/'>Trang chủ</Link>,
            key: 'admin'
        },
        {
            label: <Link to='/history'>Lịch sử mua hàng</Link>,
            key: 'history',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },

    ];

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;


    return (
        <Layout
            style={{ minHeight: '100vh' }}
            className="layout-admin"
        >
            <Sider
                theme='light'
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}>
                <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                    Admin
                </div>
                <Menu
                    // defaultSelectedKeys={[activeMenu]}
                    selectedKeys={[activeMenu]}
                    mode="inline"
                    items={items}
                    onClick={(e) => setActiveMenu(e.key)}
                />
            </Sider>
            <Layout>
                <div className='admin-header'>
                    <span>
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: () => setCollapsed(!collapsed),
                        })}
                    </span>
                    <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <Avatar src={urlAvatar} />
                                {user?.fullName}
                            </Space>
                        </a>
                    </Dropdown>
                </div>
                <Content >
                    <Outlet />
                </Content>
                <Footer style={{ padding: 0 }}>
                    React Test Fresher &copy; TuanAnh DEVIT - Made with <HeartTwoTone />
                </Footer>
            </Layout>
            <ManageAccount isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

        </Layout>
    );
};

export default LayoutAdmin;