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
import { BANKS } from "./../../../constants/appConstants";
import { IMAGE_PATH } from "./../../../constants/config";
import {
    getSkillListApi,
    getBankAccountDetailApi,
    addBankAccountDetailApi,
    updateBankAccountDetailApi,
    uploadImageApi,
} from "./../../../services/apiServices";
import MainLayout from "./../../../components/Layout/MainLayout";
import AccountLayout from "./../../../components/Layout/AccountLayout";
import Loading from "./../../../components/Utility/Modal/Loading";

const { Option } = Select;

let title = "บัญชีธนาคาร";

class DashboardBankAccountDetail extends Component {
    state = {
        isLoadng: false,
        isSubmitted: false,
        action: "",
        bankAccount: {},
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
                            ? "เพิ่มบัญชีธนาคารใหม่"
                            : "แก้ไขบัญชีธนาคาร",
                },
                () => {
                    if (query.id) {
                        this.getBankAccountDetail(query.id);
                    } else {
                        this.formRef.current.resetFields();
                    }
                }
            );
        }, 300);
    }

    async getBankAccountDetail(id) {
        this.setState({ isLoading: true });
        try {
            let bankAccount = await getBankAccountDetailApi({ params: { id } });
            this.setState({ bankAccount });
            this.formRef.current?.setFieldsValue({
                bank_name: bankAccount.bank_name,
                account_number: bankAccount.account_number,
                account_name: bankAccount.account_name,
            });
        } catch (error) {
        } finally {
            setTimeout(() => {
                this.setState({ isLoading: false });
            }, 300);
        }
    }

    async addBankAccountDetail(data) {
        this.setState({ isLoading: true });
        try {
            let res = await addBankAccountDetailApi({ body: data });
            Modal.success({
                title: "สำเร็จ",
                content: res.message,
                centered: true,
                maskClosable: true,
                okText: "ตกลง",
                afterClose: () => {
                    this.formRef.current.resetFields();
                    this.setState({ bankAccount: {} });
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

    async updateBankAccountDetail(data) {
        let { bankAccount } = this.state;
        this.setState({ isLoading: true });
        try {
            let res = await updateBankAccountDetailApi({
                params: { id: bankAccount.id },
                body: data,
            });
            Modal.success({
                title: "สำเร็จ",
                content: res.message,
                centered: true,
                maskClosable: true,
                okText: "ตกลง",
                afterClose: () => {
                    this.getBankAccountDetail(bankAccount.id);
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
            bank_name: values.bank_name,
            account_number: values.account_number,
            account_name: values.account_name,
        };

        if (action === "add") {
            this.addBankAccountDetail(data);
        } else if (action === "edit") {
            this.updateBankAccountDetail(data);
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
                                        <Col span={24}>
                                            <Form.Item
                                                label={
                                                    <div className="fs-6">
                                                        ธนาคาร
                                                    </div>
                                                }
                                                name="bank_name"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "โปรดระบุ ธนาคาร",
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    placeholder="โปรดเลือกธนาคาร"
                                                    size="large"
                                                >
                                                    {BANKS.map((item) => (
                                                        <Option
                                                            key={item.key}
                                                            value={item.name}
                                                        >
                                                            {item.name}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label={
                                                    <div className="fs-6">
                                                        เลขบัญชี
                                                    </div>
                                                }
                                                name="account_number"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "โปรดระบุ เลขบัญชี",
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
                                                        ชื่อบัญชี
                                                    </div>
                                                }
                                                name="account_name"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "โปรดระบุ ชื่อบัญชี",
                                                    },
                                                ]}
                                            >
                                                <Input size="large" />
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

export default DashboardBankAccountDetail;
