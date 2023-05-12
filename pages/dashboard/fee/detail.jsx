import React, { Component } from "react";
import Head from "next/head";
import Router from "next/router";
import {
    Row,
    Col,
    Form,
    Input,
    Select,
    Button,
    Modal,
    InputNumber,
} from "antd";
import dayjs from "dayjs";
import cloneDeep from "lodash/cloneDeep";
import { assetPrefix } from "./../../../next.config";
import { GENDERS } from "./../../../constants/appConstants";
import { IMAGE_PATH } from "./../../../constants/config";
import {
    getSkillListApi,
    getFeeDetailApi,
    addFeeDetailApi,
    updateFeeDetailApi,
    uploadImageApi,
} from "./../../../services/apiServices";
import MainLayout from "./../../../components/Layout/MainLayout";
import AccountLayout from "./../../../components/Layout/AccountLayout";
import Loading from "./../../../components/Utility/Modal/Loading";

const { Option } = Select;

let title = "ข้อมูลสมาชิก";

class DashboardFeeDetail extends Component {
    state = {
        isLoadng: false,
        isSubmitted: false,
        action: "",
        fee: {},
        title,
    };

    formRef = React.createRef();

    componentDidMount() {
        setTimeout(() => {
            let query = Router.query;
            this.setState(
                {
                    action: query.action === "add" ? "add" : "edit",
                    title:
                        query.action == "add"
                            ? "เพิ่มค่าธรรมเนียมใหม่"
                            : "แก้ไขค่าธรรมเนียม",
                },
                () => {
                    if (query.id) {
                        this.getFeeDetail(query.id);
                    } else {
                        this.formRef.current.resetFields();
                    }
                }
            );
        }, 300);
    }

    async getFeeDetail(id) {
        this.setState({ isLoading: true });
        try {
            let fee = await getFeeDetailApi({ params: { id } });
            this.setState({ fee });
            this.formRef.current?.setFieldsValue({
                service_charge_type: fee.service_charge_type,
                fee: fee.fee,
                detail: fee.detail,
            });
        } catch (error) {
        } finally {
            setTimeout(() => {
                this.setState({ isLoading: false });
            }, 300);
        }
    }

    async addFeeDetail(data) {
        this.setState({ isLoading: true });
        try {
            let res = await addFeeDetailApi({ body: data });
            Modal.success({
                title: "สำเร็จ",
                content: res.message,
                centered: true,
                maskClosable: true,
                okText: "ตกลง",
                afterClose: () => {
                    this.formRef.current.resetFields();
                    this.setState({ fee: {} });
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

    async updateFeeDetail(data) {
        let { fee } = this.state;
        this.setState({ isLoading: true });
        try {
            let res = await updateFeeDetailApi({
                params: { id: fee.id },
                body: data,
            });
            Modal.success({
                title: "สำเร็จ",
                content: res.message,
                centered: true,
                maskClosable: true,
                okText: "ตกลง",
                afterClose: () => {
                    this.getFeeDetail(fee.id);
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
        let { action } = this.state;
        let data = {
            service_charge_type: values.service_charge_type,
            fee: values.fee,
            detail: values.detail,
        };

        if (action === "add") {
            this.addFeeDetail(data);
        } else if (action === "edit") {
            this.updateFeeDetail(data);
        }
    }

    async onBack() {
        await Router.back();
    }

    render() {
        let { isLoading, title } = this.state;

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
                                    <Row gutter={15} className="pb-3">
                                        <Col span={12}>
                                            <Form.Item
                                                label={
                                                    <div className="fs-6">
                                                        ประเภทงาน
                                                    </div>
                                                }
                                                name="service_charge_type"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "โปรดระบุ ประเภทงาน",
                                                    },
                                                ]}
                                            >
                                                <Input size="large" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label={
                                                    <div className="fs-6">
                                                        ค่าธรรมเนียม
                                                    </div>
                                                }
                                                name="fee"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "โปรดระบุ ค่าธรรมเนียม",
                                                    },
                                                ]}
                                            >
                                                <InputNumber
                                                    min={0}
                                                    size="large"
                                                    style={{ width: "100%" }}
                                                    addonAfter="%"
                                                />
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
                                                    rows={3}
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
                                                type="primary"
                                                size="large"
                                                className="btn-primary"
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
                                                    บันทึกข้อมูล
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

export default DashboardFeeDetail;
