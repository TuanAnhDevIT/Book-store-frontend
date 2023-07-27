import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { doDeleteItemCartAction, doUpdateCartAction } from "../../redux/order/orderSlice";
import { Col, Divider, Empty, InputNumber, Row } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import "../../styles/global.scss"

const VIewOrder = (props) => {
    const carts = useSelector(state => state.order.carts);
    const [totalPrice, setTotalPrice] = useState(0);
    const dispatch = useDispatch();

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

    const handleOnchangeInput = (value, book) => {
        if (!value || value < 1) return;
        if (!isNaN(value)) {
            dispatch(doUpdateCartAction({ quantity: value, detail: book, _id: book._id }))
        }
    }

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Row gutter={[20, 20]}>
                    <Col md={18} xs={24}>
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
                                            <span style={{ paddingRight: "10px" }}>Số lượng: </span>
                                            <InputNumber onChange={(value) => handleOnchangeInput(value, book)} value={book.quantity} />
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
                        {carts.length === 0 &&
                            <div className="order-book-empty">
                                <Empty
                                    description={"Không có sản phẩm trong giỏ hàng"}
                                />

                            </div>
                        }
                    </Col>
                    <Col md={6} xs={24}>
                        <div className="order-sum">
                            <div className="calculate">
                                <span>Tạm tính</span>
                                <span>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}
                                </span>
                            </div>
                            <Divider style={{ margin: "10px 0" }} />
                            <div className="calculate">
                                <span>Tổng tiền</span>
                                <span className="sum-final" >
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}
                                </span>
                            </div>
                            <Divider style={{ margin: "10px 0" }} />
                            <button
                                disabled={carts.length === 0}
                                onClick={() => props.setCurrentStep(1)}
                            >Mua Hàng ({carts?.length ?? 0})</button>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default VIewOrder;