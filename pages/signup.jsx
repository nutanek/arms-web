import React, { Component } from "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import {
    Row,
    Col,
    Form,
    Input,
    Button,
    Divider,
    Modal,
    DatePicker,
    message,
} from "antd";
import { signupApi } from "./../services/apiServices";
import { assetPrefix } from "./../next.config";
import {
    isLoggedIn,
    setLocalAccessToken,
    setLocalUserInfo,
} from "./../services/appServices";
import MainLayout from "./../components/Layout/MainLayout";
import Loading from "./../components/Utility/Modal/Loading";

const title = "เข้าสู่ระบบ";

class SignUpPage extends Component {
    state = {
        isLoadng: false,
        isSubmitted: false,
    };

    formRef = React.createRef();

    componentDidMount() {
        if (isLoggedIn()) {
            window.location.replace(`${assetPrefix}/`);
        }
    }

    async signup(data) {
        this.setState({ isLoading: true });
        try {
            let res = await signupApi({ body: data });
            setLocalAccessToken(res.token);
            setLocalUserInfo(res);
            Modal.success({
                title: "สำเร็จ",
                content: res.message,
                centered: true,
                maskClosable: true,
                okText: "ตกลง",
                afterClose: async () => {
                    this.formRef.current.resetFields();
                    await Router.push("/signin");
                },
            });
            this.setState({ isLoading: false });
        } catch (error) {
            Modal.error({
                title: "ไม่สำเร็จ",
                content: error?.message,
                centered: true,
                maskClosable: true,
                okText: "ตกลง",
            });
        } finally {
            this.setState({ isLoading: false });
        }
    }

    onSubmit(values = {}) {
        let data = {
            email: values.email,
            firstname: values.firstname,
            lastname: values.lastname,
            birthdate: values.birthdate.format("YYYY-MM-DD"),
            password: values.password,
        };
        this.signup(data);
    }

    render() {
        let { isLoading } = this.state;
        return (
            <>
                <Head>
                    <title>{title}</title>
                    <meta name="description" content={title} />
                </Head>
                <MainLayout>
                    <Row justify="center">
                        <Col xs={20} sm={18} md={14} lg={10} xl={8}>
                            <div className="authen-card-container">
                                {/* <div className="header">
                                    <img
                                        src={`${ROOT_PATH}/images/logo.png`}
                                        alt="logo"
                                    />
                                </div> */}
                                <div className="body">
                                    <p className="text-center fw-bold fs-3 mt-0">
                                        ลงทะเบียน
                                    </p>
                                    <Form
                                        ref={this.formRef}
                                        layout="vertical"
                                        name="control-ref"
                                        requiredMark="optional"
                                        initialValues={{ remember: true }}
                                        onFinish={this.onSubmit.bind(this)}
                                    >
                                        <Form.Item
                                            name="email"
                                            label="อีเมล"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "โปรดระบุ อีเมล",
                                                },
                                                {
                                                    type: "email",
                                                    message: "อีเมลไม่ถูกต้อง",
                                                },
                                            ]}
                                        >
                                            <Input size="large" />
                                        </Form.Item>

                                        <Row gutter={15}>
                                            <Col xs={24} lg={12}>
                                                <Form.Item
                                                    name="firstname"
                                                    label="ชื่อ"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "โปรดระบุ ชื่อ",
                                                        },
                                                    ]}
                                                >
                                                    <Input size="large" />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} lg={12}>
                                                <Form.Item
                                                    name="lastname"
                                                    label="นามสกุล"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "โปรดระบุ นามสกุล",
                                                        },
                                                    ]}
                                                >
                                                    <Input size="large" />
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Form.Item
                                            label={
                                                <div className="fs-6">
                                                    วันเกิด
                                                </div>
                                            }
                                            name="birthdate"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "โปรดระบุ วันเกิด",
                                                },
                                            ]}
                                        >
                                            <DatePicker
                                                size="large"
                                                format="DD/MM/YYYY"
                                                placeholder="โปรดเลือกวันเกิด"
                                                style={{
                                                    width: "100%",
                                                }}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="password"
                                            label="รหัสผ่าน"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "รหัสผ่าน",
                                                },
                                                {
                                                    min: 8,
                                                    message:
                                                        "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
                                                },
                                            ]}
                                        >
                                            <Input.Password size="large" />
                                        </Form.Item>

                                        <Form.Item
                                            name="confirm_password"
                                            label={
                                                <div className="fs-6">
                                                    ยืนยันรหัสผ่าน
                                                </div>
                                            }
                                            hasFeedback
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "โปรดยืนยัน รหัสผ่าน",
                                                },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (
                                                            !value ||
                                                            getFieldValue(
                                                                "password"
                                                            ) === value
                                                        ) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(
                                                            new Error(
                                                                "รหัสผ่านทั้งคู่ไม่ตรงกัน"
                                                            )
                                                        );
                                                    },
                                                }),
                                            ]}
                                        >
                                            <Input.Password size="large" />
                                        </Form.Item>

                                        <Button
                                            htmlType="submit"
                                            type="primary"
                                            size="large"
                                            block
                                        >
                                            ลงทะเบียน
                                        </Button>

                                        <Divider />

                                        <div className="text-secondary-color text-center">
                                            มีบัญชีอยู่แล้วใช่ไหม?
                                        </div>
                                        <Link href="/signin">
                                            <Button type="link" block>
                                                เข้าสู่ระบบ
                                            </Button>
                                        </Link>
                                    </Form>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </MainLayout>

                <Loading isOpen={isLoading} />
            </>
        );
    }
}

export default SignUpPage;
