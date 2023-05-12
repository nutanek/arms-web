import React, { Component } from "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import {
    Row,
    Col,
    Input,
    Table,
    Button,
    Popconfirm,
    Modal,
    Card,
    Tag,
    message,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import numeral from "numeral";
import { ACCOUNT_APPROVE_STATUS } from "./../../../constants/appConstants";
import {
    getBankAccountListApi,
    removeBankAccountDetailApi,
} from "./../../../services/apiServices";
import MainLayout from "./../../../components/Layout/MainLayout";
import AccountLayout from "./../../../components/Layout/AccountLayout";
import Loading from "./../../../components/Utility/Modal/Loading";

const title = "บัญชีธนาคาร";

const pageSize = 10;

class DashboardBankAccountList extends Component {
    state = {
        isLoading: false,
        bankAccounts: [],
        page: 1,
        totalPage: 5,
        keyword: "",
    };

    componentDidMount() {
        setTimeout(() => {
            let { page = 1, keyword = "" } = Router.query;
            this.setState(
                {
                    page,
                    keyword,
                },
                () => this.getBankAccountList()
            );
        }, 300);
    }

    async getBankAccountList() {
        this.setState({ isLoading: true });
        try {
            let res = await getBankAccountListApi({
                params: {
                    page: this.state.page,
                    size: pageSize,
                    keyword: this.state.keyword,
                    request_account: "no",
                    approved_status: 0,
                    fee_type: "all",
                },
            });
            this.setState({
                bankAccounts: res.data,
                page: res.page,
                totalPage: res.total_page,
            });
        } catch (error) {
        } finally {
            setTimeout(() => {
                this.setState({ isLoading: false });
            }, 300);
        }
    }

    async removeBankAccountList(id) {
        this.setState({ isLoading: true });
        try {
            let res = await removeBankAccountDetailApi({
                params: { id },
            });
            message.success(res?.message);
            this.getBankAccountList();
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

    async onChangePage(page) {
        await Router.push(
            `/dashboard/bank-account/list?page=${page}&keyword=${this.state.keyword}`
        );
        this.setState({ page }, () => {
            this.getBankAccountList();
        });
    }

    async onSearch(keyword = "") {
        await Router.push(
            `/dashboard/bank-account/list?page=1&keyword=${keyword}`
        );
        this.setState({ keyword, page: 1 }, () => {
            this.getBankAccountList();
        });
    }

    onChangeKeyword(keyword) {
        this.setState({ keyword });
    }

    render() {
        let { isLoading, bankAccounts, page, totalPage, keyword } = this.state;
        return (
            <>
                <Head>
                    <title>{title}</title>
                    <meta name="description" content={title} />
                </Head>
                <MainLayout>
                    <AccountLayout title={title}>
                        <Card
                            type="inner"
                            title={
                                <Row justify="space-between" className="pt-3">
                                    <Col xs={12} lg={8}></Col>
                                    <Col span={12} className="pb-3 text-end">
                                        <Link
                                            href={`/dashboard/bank-account/detail?action=add`}
                                        >
                                            <Button
                                                type="primary"
                                                size="large"
                                                icon={<PlusOutlined />}
                                            >
                                                เพิ่มบัญชีใหม่
                                            </Button>
                                        </Link>
                                    </Col>
                                </Row>
                            }
                        >
                            <Table
                                dataSource={bankAccounts}
                                pagination={{
                                    current: page,
                                    pageSize: pageSize,
                                    total: totalPage * pageSize,
                                    onChange: this.onChangePage.bind(this),
                                }}
                                rowKey="id"
                                scroll={{
                                    x: 700,
                                }}
                                columns={[
                                    {
                                        title: "ธนาคาร",
                                        dataIndex: "bank_name",
                                        key: "bank_name",
                                        className: "fs-6",
                                    },
                                    {
                                        title: "เลขบัญชี",
                                        dataIndex: "account_number",
                                        key: "account_number",
                                        className: "fs-6",
                                        align: "center",
                                    },
                                    {
                                        title: "ชื่อบัญชี",
                                        dataIndex: "account_name",
                                        key: "account_name",
                                        className: "fs-6",
                                        align: "center",
                                    },
                                    {
                                        title: "",
                                        dataIndex: "action",
                                        key: "action",
                                        align: "right",
                                        render: (value, record, index) => (
                                            <div
                                                style={{
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                <Link
                                                    href={`/dashboard/bank-account/detail?id=${record.id}`}
                                                >
                                                    <Button
                                                        type="primary"
                                                        icon={<EditOutlined />}
                                                        className="btn-primary"
                                                    >
                                                        แก้ไข
                                                    </Button>
                                                </Link>

                                                <Popconfirm
                                                    title={
                                                        "คุณต้องการลบบัญชีธนาคารนี้ใช่ไหม?"
                                                    }
                                                    onConfirm={() =>
                                                        this.removeBankAccountList(
                                                            record.id
                                                        )
                                                    }
                                                    okText={"ยืนยัน"}
                                                    cancelText={"ยกเลิก"}
                                                >
                                                    <Button
                                                        style={{
                                                            marginLeft: 10,
                                                        }}
                                                        danger
                                                        type="primary"
                                                        icon={
                                                            <DeleteOutlined />
                                                        }
                                                    >
                                                        ลบ
                                                    </Button>
                                                </Popconfirm>
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        </Card>
                    </AccountLayout>
                </MainLayout>

                <Loading isOpen={isLoading} />
            </>
        );
    }
}

export default DashboardBankAccountList;
