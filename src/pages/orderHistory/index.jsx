import { Col, Row, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { callHistory } from "../../services/api";
import ReactJson from "react-json-view";
import moment from "moment";

const OrderHistory = () => {
    const [listOrder, setListOrder] = useState([]);
    const fetchHistory = async () => {
        const res = await callHistory();

        // console.log(">>>>check his:", res)
        if (res && res.data) {
            setListOrder(res.data);
        }
    }

    const renderHeader = () => {
        return (
            <span>Lịch sử mua hàng</span>
        )
    }
    useEffect(() => {
        fetchHistory();
    })
    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => index + 1, // Render the row index starting from 1
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            render: (text, record) => (
                <span>
                    {moment(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                </span>
            ),
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalPrice',
            render: (text, record) => (
                <span>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.totalPrice)}
                </span>
            ),
        },
        {
            title: 'Trạng thái',
            render: (text, record) => (
                <Tag color="green">Thành công</Tag>
            ),
        },
        {
            title: 'Chi tiết',
            key: 'action',
            render: (_, record) => (
                <ReactJson
                    src={record.detail}
                    name="Chi tiết đơn mua"
                    collapsed={true}
                    enableClipboard={false}
                    displayDataTypes={false}
                    displayObjectSize={false}
                />
            )
        }
    ];
    return (
        <>
            <div style={{ padding: "10px" }}>
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <Table
                            title={renderHeader}
                            columns={columns}
                            dataSource={listOrder.map((order, index) => ({ ...order, index }))}
                            pagination={false}
                        />
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default OrderHistory;