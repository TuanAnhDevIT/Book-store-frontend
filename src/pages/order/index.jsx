import { Button, Result, Steps } from "antd";
import { useState } from "react"
import VIewOrder from "../../components/Order/ViewOrder";
import { SmileOutlined } from "@ant-design/icons";
import Payment from "../../components/Order/Payment";
import { useNavigate } from "react-router";


const OrderPage = (props) => {
    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();
    const handleViewHistory = () => {
        navigate('/history')
    }

    return (
        <div style={{ background: "#efefef", padding: "20px 0" }}>
            <div className="order-container" style={{ maxWidth: 1440 }}>
                <div className="order-steps">
                    <Steps
                        size="small"
                        current={currentStep}
                        status={"finish"}
                        items={[
                            {
                                title: 'Đơn hàng',
                            },
                            {
                                title: 'Đặt hàng',
                            },
                            {
                                title: 'Thanh toán',
                            },
                        ]}
                    />
                </div>
                {currentStep === 0 &&
                    <VIewOrder setCurrentStep={setCurrentStep} />
                }
                {currentStep === 1 &&
                    <Payment setCurrentStep={setCurrentStep} />
                }
                {currentStep === 2 &&
                    <Result
                        icon={<SmileOutlined />}
                        title="Đơn hàng đã được đặt thành công!"
                        extra={<Button type="primary" onClick={handleViewHistory}>Xem lịch sử</Button>}
                    />
                }
            </div>
        </div>
    )
}

export default OrderPage;