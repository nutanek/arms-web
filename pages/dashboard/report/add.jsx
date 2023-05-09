import React, { Component } from "react";
import Head from "next/head";
import Router from "next/router";
import { Row, Col, Form, Input, Select, Button, Modal } from "antd";
import { addReportDetailApi } from "./../../../services/apiServices";
import MainLayout from "./../../../components/Layout/MainLayout";
import AccountLayout from "./../../../components/Layout/AccountLayout";
import Loading from "./../../../components/Utility/Modal/Loading";

const title = "รายงานปัญหา";

class DashboardReportAdd extends Component {
    state = {
        isLoadng: false,
        isSubmitted: false,
    };

    formRef = React.createRef();

    async addReportDetail(data) {
        this.setState({ isLoading: true });
        try {
            let res = await addReportDetailApi({ body: data });
            Modal.success({
                title: "สำเร็จ",
                content: res.message,
                centered: true,
                maskClosable: true,
                okText: "ตกลง",
                afterClose: () => {
                    this.formRef.current.resetFields();
                    this.setState({ member: {} });
                },
            });
        } catch (error) {
            Modal.error({
                title: "ไม่สำเร็จ",
                content: error?.message,
                centered: true,
                maskClosable: true,
                okText: "ตกลง",
            });
        } finally {
            setTimeout(() => {
                this.setState({ isLoading: false });
            }, 300);
        }
    }

    onSubmit(values = {}) {
        let data = {
            title: values.title,
            detail: values.detail,
        };

        this.addReportDetail(data);
    }

    async onBack() {
        await Router.back();
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
                    <AccountLayout title={title}>
                        <Row justify="center">
                            <Col lg={16}>
                                <Form
                                    ref={this.formRef}
                                    name="info_form"
                                    layout="vertical"
                                    requiredMark={true}
                                    onFinish={this.onSubmit.bind(this)}
                                    onSubmitCapture={() =>
                                        this.setState({ isSubmitted: true })
                                    }
                                    autoComplete="off"
                                >
                                    <Row gutter={15}>
                                        <Col span={24}>
                                            <Form.Item
                                                label={
                                                    <div className="fs-6">
                                                        หัวข้อ
                                                    </div>
                                                }
                                                name="title"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "โปรดระบุ หัวข้อ",
                                                    },
                                                ]}
                                            >
                                                <Input size="large" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={24}>
                                            <Form.Item
                                                label={
                                                    <div className="fs-6">
                                                        รายละเอียด
                                                    </div>
                                                }
                                                name="detail"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "โปรดระบุ รายละเอียด",
                                                    },
                                                ]}
                                            >
                                                <Input.TextArea
                                                    rows={5}
                                                    size="large"
                                                ></Input.TextArea>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row
                                        justify="space-between"
                                        className="pt-3"
                                    >
                                        <Col span={6}>
                                            <Button
                                                ghost
                                                danger
                                                type="primary"
                                                size="large"
                                                onClick={() => this.onBack()}
                                            >
                                                กลับ
                                            </Button>
                                        </Col>
                                        <Col span={18}>
                                            <div className="text-end">
                                                <Button
                                                    htmlType="submit"
                                                    type="primary"
                                                    size="large"
                                                >
                                                    รายงาน
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                    </AccountLayout>
                </MainLayout>

                <Loading isOpen={isLoading} />
            </>
        );
    }
}

export default DashboardReportAdd;
