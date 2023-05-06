import React, { Component } from "react";
import Head from "next/head";
import { Row, Col, Form, Input, Button, Divider, Modal, message } from "antd";
import { signinApi, addJobDetailApi } from "./../services/apiServices";
import { assetPrefix } from "./../next.config";
import {
    isLoggedIn,
    setLocalAccessToken,
    setLocalUserInfo,
} from "./../services/appServices";
import MainLayout from "./../components/Layout/MainLayout";
import Loading from "./../components/Utility/Modal/Loading";

const title = "เข้าสู่ระบบ";

class SigninPage extends Component {
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

    async signin(data) {
        this.setState({ isLoading: true });
        try {
            let res = await signinApi({ body: data });
            setLocalAccessToken(res.token);
            setLocalUserInfo(res);
            message.success("เข้าสู่ระบบสำเร็จ");
            this.setState({ isLoading: false });
            setTimeout(() => window.location.replace(`${assetPrefix}/`), 300);
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
            password: values.password,
        };
        this.signin(data);
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
                                    <p className="text-center fw-bold fs-3">
                                        เข้าสู่ระบบ
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

                                        <Button
                                            htmlType="submit"
                                            type="primary"
                                            size="large"
                                            block
                                        >
                                            เข้าสู่ระบบ
                                        </Button>

                                        <Divider />

                                        <div className="text-secondary-color text-center">
                                            {/* {T("DONT_HAVE_ACCOUNT")} */}
                                        </div>
                                        {/* <Link to={`${ROOT_PATH}/signup`}>
                                            <Button type="link" block>
                                                ลงทะเบียน
                                            </Button>
                                        </Link> */}
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

export default SigninPage;
