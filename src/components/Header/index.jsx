import React, { useState } from 'react';
import { FaReact } from 'react-icons/fa'
import { FiShoppingCart } from 'react-icons/fi';
import { VscSearchFuzzy } from 'react-icons/vsc';
import { Divider, Badge, Drawer, message, Avatar, Popover } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router';
import { callLogout } from '../../services/api';
import './header.scss';
import { doLogoutAction } from '../../redux/account/accountSlice';
import { Link } from 'react-router-dom';
import ManageAccount from '../Account/ManageAccount';

const Header = ({ setSearchTerm }) => {

    const [openDrawer, setOpenDrawer] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const isAuthenticated = useSelector(state => state.account.isAuthenticated);
    const user = useSelector(state => state.account.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const carts = useSelector(state => state.order.carts);// order: gọi tới orderReducer trong store.js

    const handleSearch = (event) => {
        setSearchTerm(event.target.value); // Gửi giá trị tìm kiếm lên component Home
    };


    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res.data) {
            dispatch(doLogoutAction());
            message.success('Đăng xuất thành công');
            navigate('/')
        }
    }

    let items = [
        // {
        //     label: <label style={{ cursor: 'pointer' }}>Quản lý tài khoản</label>,
        //     key: 'account',
        // },
        {
            label: (
                <div style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen(true)}>
                    Quản lý tài khoản
                </div>
            ),
            key: 'account',
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
    if (user?.role === 'ADMIN') {
        items.unshift({ // unshift để đẩy lên đầu tiên
            label: <Link to='/admin'>Trang quản trị</Link>,
            key: 'admin'
        })
    }

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    const handleViewCart = () => {
        navigate('/order')
    }

    const handleBackHome = () => {
        navigate('/')
    }

    const contentPopover = () => {
        return (
            <div className='pop-cart-body'>
                <div className='pop-cart-content'>
                    {/* <div className='book'>
                        <img src="https://picsum.photos/id/1019/1000/600/" />
                        <div>Đại việt sử kí</div>
                        <div>155.555đ</div>
                    </div>
                    <div className='book'>
                        <img src="https://picsum.photos/id/1019/1000/600/" />
                        <div>Đại việt sử kí</div>
                        <div>155.555đ</div>
                    </div> */}
                    {carts?.map((book, index) => {
                        return (
                            <div className='book' key={`book-${index}`}>
                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail.thumbnail}`} />
                                <div>{book?.detail?.mainText}</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book?.detail?.price)}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className='pop-cart-footer'>
                    <button onClick={handleViewCart} style={{ cursor: "pointer" }}>Xem giỏ hàng</button>
                </div>
            </div>
        )
    }
    return (
        <>
            <div className='header-container'>
                <header className="page-header">
                    <div className="page-header__top">
                        <div className="page-header__toggle" onClick={() => {
                            setOpenDrawer(true)
                        }}>☰</div>
                        <div className='page-header__logo'>
                            <span className='logo' onClick={() => handleBackHome()}>
                                <FaReact className='rotate icon-react' /> TuanAnh DEV
                                <VscSearchFuzzy className='icon-search' />
                            </span>
                            {/* <input
                                className="input-search" type={'text'}
                                placeholder="Bạn tìm gì hôm nay"
                            /> */}
                            <input
                                className='input-search'
                                type='text'
                                placeholder='Bạn tìm gì hôm nay'
                                onChange={handleSearch} // Khi người dùng nhập vào ô tìm kiếm, gọi hàm handleSearch
                            />
                        </div>

                    </div>
                    <nav className="page-header__bottom">
                        <ul id="navigation" className="navigation">
                            <li className="navigation__item">
                                <Popover
                                    className='popover-carts'
                                    placement='topRight'
                                    rootClassName='popover-carts'
                                    title={"Sản phẩm mới thêm"}
                                    content={contentPopover}
                                    arrow={true}
                                >
                                    <Badge
                                        count={carts?.length ?? 0}
                                        size={"small"}
                                        showZero
                                    >
                                        <FiShoppingCart className='icon-cart' />
                                    </Badge>

                                </Popover>
                            </li>
                            <li className="navigation__item mobile"><Divider type='vertical' /></li>
                            <li className="navigation__item mobile">
                                {!isAuthenticated ?
                                    <span onClick={() => navigate('/login')}> Tài Khoản</span>
                                    :
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <a onClick={(e) => e.preventDefault()}>
                                            <Space>
                                                <Avatar src={urlAvatar} />
                                                {user?.fullName}
                                            </Space>
                                        </a>
                                    </Dropdown>
                                }
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
            <ManageAccount isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </>
    )
};

export default Header;
