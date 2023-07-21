import React, { useState } from 'react';
import { Button, Modal, Form, Divider, Input, message, notification } from 'antd';
import { callCreateAUser } from '../../../services/api';


const UserModalCreate = (props) => {
    const { openModalCreate, setOpenModalCreate } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    // https://ant.design/components/form#formuseform
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const { fullName, password, email, phone } = values;
        setIsSubmit(true);
        const res = await callCreateAUser(fullName, email, password, phone);
        if (res?.data?._id) {
            message.success('Tạo mới user thành công !');
            form.resetFields();
            setOpenModalCreate(false);
            await props.fetchUser()
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            })
        }
        setIsSubmit(false)
    };

    return (
        <>
            <Modal
                title="Thêm mới người dùng"
                open={openModalCreate}
                onOk={() => { form.submit() }}
                onCancel={() => setOpenModalCreate(false)}
                okText={"Tạo mới"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
            >
                <Divider />

                <Form
                    form={form}
                    name='basic'
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete='off'
                >
                    <Form.Item
                        labelCol={{ span: 24 }} //whole column
                        label="Tên hiển thị"
                        name="fullName"
                        rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
                    >
                        <Input />
                    </Form.Item>


                    <Form.Item
                        labelCol={{ span: 24 }} //whole column
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Email không được để trống!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        labelCol={{ span: 24 }} //whole column
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }} //whole column
                        label="Số điện thoại"
                        name="phone"
                        rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                    >
                        <Input />
                    </Form.Item>

                </Form>
            </Modal>
        </>
    );
};

export default UserModalCreate;