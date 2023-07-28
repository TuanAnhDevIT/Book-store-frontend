import { Button, Col, Form, Input, Row, message, notification } from "antd"
import { useState } from "react";
import { useSelector } from "react-redux";
import { callUpdatePassword } from "../../services/api";


const ChangePassword = (props) => {
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const user = useSelector(state => state.account.user);

    const onFinish = async (values) => {
        const { email, oldpass, newpass } = values;
        setIsSubmit(true);
        const res = await callUpdatePassword(email, oldpass, newpass);
        if (res && res.data) {
            message.success("Cập nhật mật khẩu thành công!");
            form.setFieldValue("oldpass", "")
            form.setFieldValue("newpass", "")
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: res.message
            })
        }
    }

    const handleUpdatePassword = async () => {
        try {
            const values = await form.validateFields(); // Validate the form fields
            onFinish(values); // Call the onFinish function with the validated values
        } catch (error) {
            console.error("Form validation error:", error);
        }
    };

    return (
        <div style={{ minHeight: 400 }}>
            <Row>
                <Col sm={24} md={12}>
                    <Form
                        onFinish={onFinish}
                        form={form}
                    >
                        <Form.Item
                            hidden
                            labelCol={{ span: 24 }} //whole column
                            label="Id"
                            name="_id"
                            rules={[{ required: true, message: 'Vui lòng nhập Id!' }]}
                            initialValue={user?.id}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            labelCol={{ span: 24 }} //whole column
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Email không được để trống!' }]}
                            initialValue={user?.email}
                        >
                            <Input disabled />
                        </Form.Item>

                        <Form.Item
                            labelCol={{ span: 24 }} //whole column
                            label="Mật khẩu hiện tại"
                            name="oldpass"
                            rules={[{ required: true, message: 'Mật khẩu hiện tại không được để trống!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            labelCol={{ span: 24 }} //whole column
                            label="Mật khẩu mới"
                            name="newpass"
                            rules={[{ required: true, message: 'Mật khẩu mới không được để trống!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            {/* Call handleUpdatePassword when the "Xác nhận" button is clicked */}
                            <Button type="primary" onClick={handleUpdatePassword} loading={isSubmit}>
                                Xác nhận
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default ChangePassword;