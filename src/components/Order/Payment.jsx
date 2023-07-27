import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { doDeleteItemCartAction, doPlaceOrderAction, doUpdateCartAction } from "../../redux/order/orderSlice";
import { Button, Col, Descriptions, Divider, Empty, Form, Input, InputNumber, Radio, Row, Select, notification } from "antd";
import { DeleteTwoTone, LoadingOutlined } from "@ant-design/icons";
import "../../styles/global.scss"
import { message } from 'antd';
import TextArea from "antd/es/input/TextArea";
import { callPlaceOrder } from "../../services/api";

const Payment = (props) => {
    const carts = useSelector(state => state.order.carts);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useDispatch();

    const user = useSelector(state => state.account.user);

    const [form] = Form.useForm();

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map(item => {
                sum += item.quantity * item.detail.price;
            })
            setTotalPrice(sum)
        } else {
            setTotalPrice(0)
        }

    }, [carts])

    const onFinish = async (values) => {
        setIsSubmit(true);
        const detailOrder = carts.map(item => {
            return {
                bookName: item.detail.mainText,
                quantity: item.quantity,
                _id: item._id
            }
        })
        const data = {
            name: values.name,
            address: values.address,
            phone: values.phone,
            totalPrice: totalPrice,
            detail: detailOrder
        }
        const res = await callPlaceOrder(data);
        if (res && res.data) {
            message.success('Đặt hàng thành công!');
            dispatch(doPlaceOrderAction());
            props.setCurrentStep(2);
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra!",
                Descriptions: res.message
            })
        }
        setIsSubmit(false)
    }

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Row gutter={[20, 20]}>
                    <Col md={16} xs={24}>
                        {carts?.map((book, index) => {
                            const currentBookPrice = book?.detail?.price ?? 0;
                            return (
                                <div className="order-book" key={`index-${index}`}>
                                    <div className="book-content">
                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail.thumbnail}`} />
                                        <div className="title">
                                            {book?.detail?.mainText}
                                        </div>
                                        <div className="price">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice)}
                                        </div>
                                    </div>
                                    <div className="action">
                                        <div className="quantity">
                                            <span style={{ paddingRight: "40px" }}>Số lượng: {book.quantity}</span>
                                        </div>
                                        <div className="sum">
                                            Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice * book.quantity)}
                                        </div>
                                        <DeleteTwoTone
                                            style={{ cursor: "pointer" }}
                                            onClick={() => dispatch(doDeleteItemCartAction({ _id: book._id }))}
                                            twoToneColor="#eb2f96"
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </Col>
                    <Col md={8} xs={24}>
                        <div className="order-sum">
                            <Form
                                form={form}
                                name="payment"
                                onFinish={onFinish}
                                style={{ maxWidth: 600 }}
                                scrollToFirstError
                            >
                                <Form.Item
                                    style={{ margin: 0 }}
                                    labelCol={{ span: 24 }}
                                    name="name"
                                    label="Tên người nhận"
                                    initialValue={user?.fullName}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tên người nhận',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    style={{ margin: 0 }}
                                    labelCol={{ span: 24 }}
                                    name="phone"
                                    label="Số điện thoại"
                                    initialValue={user?.phone}
                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                >
                                    <Input style={{ width: '100%' }} />
                                </Form.Item>

                                <Form.Item
                                    style={{ margin: 0 }}
                                    labelCol={{ span: 24 }}
                                    name="address"
                                    label="Địa chỉ"
                                    rules={[{ required: true, message: 'vui lòng nhập địa chỉ!' }]}
                                >
                                    <TextArea
                                        autoFocus
                                        rows={4}
                                    />
                                </Form.Item>
                            </Form>
                            <div className="info">
                                <div className="method">
                                    <div>Hình thức thanh toán</div>
                                    <Radio checked>Thanh toán khi nhận hàng</Radio>
                                </div>
                            </div>
                            <Divider style={{ margin: "5px 0" }} />
                            <div className="calculate">
                                <span>Tổng tiền</span>
                                <span className="sum-final">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}
                                </span>
                            </div>
                            <Divider style={{ margin: "5px 0" }} />
                            <Button
                                onClick={() => form.submit()}
                                disabled={isSubmit}
                            >
                                {isSubmit && <span><LoadingOutlined /> &nbsp;</span>}
                                Đặt hàng ({carts?.length ?? 0})
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Payment;