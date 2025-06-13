import React from "react";
import { Form, Input, Button } from "antd";
import AuthLayout from "../components/authLayout";
import logo from "../assets/images/logo.png";

const Login: React.FC = () => {
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        console.log("success", values);
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-md  p-6  ">
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="Logo" className="w-64 h-auto"  />
                </div>

                <h1 className="text-5xl font-semibold text-center text-yellow-900 mb-6">Login</h1>

                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Please input your email!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please input your password!" }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button htmlType="submit" className="w-full text-white p-2 bg-yellow-900">
                            Log In
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </AuthLayout>
    );
};

export default Login;