import React, { useEffect, useState } from 'react';
import { Table, Row, Col } from 'antd';
import InputSearch from './InputSearch';
import { callFetchListUser } from '../../../services/api';
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
            title: 'Action',
            render: (text, record, index) => {
                return (
                    <><button>Delete</button></>
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

    const handleSearch = (query) => {
        setFilter(query);
    }
    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <InputSearch
                        handleSearch={handleSearch}
                        setFilter={setFilter}
                    />
                </Col>
                <Col span={24}>
                    <Table
                        // title={renderHeader}
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
                                total: total
                            }
                        }
                    />
                </Col>
            </Row>
        </>
    )
}


export default UserTable;