import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Popconfirm, message, notification, Button } from 'antd';
import InputSearch from './InputSearch';
import { callFetchListUser, callDeleteUser } from '../../../services/api';
import { CloudDownloadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import UserViewDetail from './UserViewDetail';
import UserModalCreate from './UserModalCreate';
import UserImport from './data/UserImport';
import * as XLSX from 'xlsx';
import { parseISO, format } from 'date-fns';
import UserModalUpdate from './UserModalUpdate';

// https://stackblitz.com/run?file=demo.tsx
const UserTable = () => {

    const [listUser, setListUser] = useState([]);
    // sử dụng 'useState' để khai báo sate 'listUser' và hàm 'setListUser' để thay đổi giá trị của 'listUser' 
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("");

    const [openModalCreate, setOpenModalCreate] = useState(false);

    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState(null);

    // const [setOpenModalImport, openModalImport] = useState(false);
    const [openModalImport, setOpenModalImport] = useState(false);

    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(""); // tự thêm >>> check


    useEffect(() => {
        fetchUser();
    }, [current, pageSize, filter, sortQuery]);
    //dependencies (tham số thứ hai trong []) là một mảng các giá trị mà hook sẽ theo dõi. 
    //Khi các giá trị này thay đổi, callback function sẽ được gọi lại. 
    //Nếu dependencies là một mảng rỗng [], callback function chỉ được gọi một lần 
    //khi component được render lần đầu tiên.

    const fetchUser = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;

        if (filter) {
            query += `&${filter}`
        }
        if (sortQuery) {
            query += `&${sortQuery}`
        }

        const res = await callFetchListUser(query);//`/api/v1/user?${query}`
        if (res && res.data) {
            setListUser(res.data.result);
            // vd postman
            // vd:"result": [
            //     {
            //         "_id": "646b0a150aaf0df4a5fafeeb",
            //         "fullName": "I'm Admin",
            //         "email": "admin@gmail.com",
            //         "phone": "123456789",
            //         "role": "ADMIN",
            //         "avatar": "21232f297a57a5a743894a0e4a801fc3.png",
            //         "isActive": true,
            //         "createdAt": "2023-05-22T06:22:09.613Z",
            //         "updatedAt": "2023-05-22T06:22:09.613Z",
            //         "__v": 0
            //     },
            //     ....
            // ]
            setTotal(res.data.meta.total)
            // "data": {
            //     "meta": {
            //         "current": "1",
            //         "pageSize": "2",
            //         "pages": 10,
            //         "total": 20
            //     },
        }
        setIsLoading(false)
    }

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            render: (text, record, index) => {
                return (
                    <a href='#' onClick={() => {
                        setDataViewDetail(record);
                        setOpenViewDetail(true);
                    }}>
                        {record._id}
                    </a>
                )
            }
        },
        {
            title: 'Tên hiển thị',
            dataIndex: 'fullName',
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            sorter: true
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            sorter: true,
            render: (text, record) => {
                const date = parseISO(record.updatedAt);
                const formattedDate = format(date, 'dd/MM/yyyy HH:mm:ss'); // Định dạng ngày giờ theo ý muốn, ví dụ: 22/05/2023 06:22:09
                return <span>{formattedDate}</span>;
            },
        },
        {
            title: 'Action',
            render: (text, record, index) => {
                // return (
                //     <><button>Delete</button></>
                // )
                return (
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa user"}
                            description={"Bạn có chắc chắn muốn xóa user này ?"}
                            onConfirm={() => handleDeleteUser(record._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer" }}>
                                <DeleteTwoTone twoToneColor="#ff4d4f" />
                            </span>
                        </Popconfirm>

                        <EditTwoTone
                            twoToneColor="#f57800" style={{ cursor: "pointer" }}
                            onClick={() => {
                                setOpenModalUpdate(true);
                                setDataUpdate(record)
                            }}
                        />
                    </div>
                )
            }
        }
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }
        console.log('params', pagination, filters, sorter, extra);
        if (sorter && sorter.field) {
            const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`;
            setSortQuery(q);
        }
    };

    const handleDeleteUser = async (userId) => {
        const res = await callDeleteUser(userId);
        if (res && res.data) {
            message.success('Xóa user thành công');
            fetchUser();
        }
        else {
            notification.error({
                message: "có lỗi xảy ra",
                description: res.message
            });
        }
    };

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Table List Users</span>
                <span style={{ display: 'flex', gap: 15 }}>
                    <Button
                        icon={<ExportOutlined />}
                        type="primary"
                        onClick={() => handleExportData()}
                    >
                        Export
                    </Button>
                    <Button
                        icon={<CloudDownloadOutlined />}
                        type="primary"
                        onClick={() => setOpenModalImport(true)}
                    >
                        Import
                    </Button>
                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => setOpenModalCreate(true)}
                    >
                        Thêm mới
                    </Button>
                    <Button
                        type='ghost'
                        onClick={() => {
                            setFilter("");
                            setSortQuery("")
                        }}
                    >
                        <ReloadOutlined />
                    </Button>
                </span>
            </div>
        )
    }

    const handleSearch = (query) => {
        setFilter(query);
        setCurrent(1)
        // có 1 bug là khi tại trang 2 => search email=admin thì không tìm thấy 
        //=> setCurent(1) để hàm useEfect nhận ra sự thay đổi và gọi lại hàm fetchUser
    }

    const handleExportData = () => {
        // https://stackoverflow.com/questions/70871254/how-can-i-export-a-json-object-to-excel-using-nextjs-react
        if (listUser.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listUser);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "ExportUser.xlsx");
        }
    }

    return (
        <>
            <div style={{ padding: 10 }}>
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <InputSearch
                            handleSearch={handleSearch}
                            setFilter={setFilter}
                        />
                    </Col>
                    <Col span={24}>
                        <Table
                            title={renderHeader}
                            loading={isLoading}
                            columns={columns}
                            dataSource={listUser}
                            onChange={onChange}
                            rowKey='_id'
                            pagination={
                                {
                                    current: current,
                                    pageSize: pageSize,
                                    showSizeChanger: true,
                                    total: total,
                                    showTotal: (total, range) => { return (<div>{range[0]}-{range[1]} trên {total} row </div>) }
                                }
                            }
                        />
                    </Col>
                </Row>
                <UserModalCreate
                    openModalCreate={openModalCreate}
                    setOpenModalCreate={setOpenModalCreate}
                />
                <UserViewDetail
                    openViewDetail={openViewDetail}
                    setOpenViewDetail={setOpenViewDetail}
                    dataViewDetail={dataViewDetail}
                    setDataViewDetail={setDataViewDetail}
                />
                <UserImport
                    openModalImport={openModalImport}
                    setOpenModalImport={setOpenModalImport}
                />
                < UserModalUpdate
                    openModalUpdate={openModalUpdate}
                    setOpenModalUpdate={setOpenModalUpdate}
                    dataUpdate={dataUpdate}
                    setDataUpdate={setDataUpdate}
                    fetchUser={fetchUser}
                />
            </div>
        </>
    )
}


export default UserTable;