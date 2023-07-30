import { Col, Row, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { callFetchListOrder } from "../../../services/api";
import { parseISO, format } from 'date-fns';


const ManageOrder = () => {
    const [listOrder, setListOrder] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [current, setCurrent] = useState(1);//mặc định ở trang đầu
    const [pageSize, setPageSize] = useState(4);//hiển thị 4 dòng trên 1 trang
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchOrder();
    }, [current, pageSize]);

    const fetchOrder = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;

        const res = await callFetchListOrder(query);

        if (res && res.data) {
            setListOrder(res.data.result);
            setTotal(res.data.meta.total)
        }

        setIsLoading(false)
        console.log(">>>check list order:", listOrder)

    }

    const renderHeader = () => {
        return (
            <span>Table List Order</span>
        )
    }

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            // render: (text, record, index) => {
            //     return (
            //         <a href='#' onClick={() => {
            //             setDataViewDetail(record);
            //             setOpenViewDetail(true);
            //         }}>
            //             {record._id}
            //         </a>
            //     )
            // }
        },
        {
            title: 'Price',
            dataIndex: 'totalPrice',
            sorter: true,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true
        },
        {
            title: 'Adress',
            dataIndex: 'address',
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


    return (
        <>
            <div style={{ padding: 10 }}>
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <Table
                            title={renderHeader}
                            loading={isLoading}
                            columns={columns}
                            dataSource={listOrder}
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
            </div>
        </>
    )
}

export default ManageOrder;