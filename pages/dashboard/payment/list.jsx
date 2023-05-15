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
import { FileSearchOutlined } from "@ant-design/icons";
import moment from "moment";
import numeral from "numeral";
import { getPaymentListApi } from "./../../../services/apiServices";
import MainLayout from "./../../../components/Layout/MainLayout";
import AccountLayout from "./../../../components/Layout/AccountLayout";
import Loading from "./../../../components/Utility/Modal/Loading";

const title = "รายการรออนุมัติการชำระเงิน";

const pageSize = 10;

class DashboardPaymentList extends Component {
    state = {
        isLoading: false,
        payments: [],
        page: 1,
        totalPage: 5,
        keyword: "",
    };

    componentDidMount() {
        setTimeout(() => {
            let { page = 1 } = Router.query;
            this.setState(
                {
                    page,
                },
                () => this.getPaymentList()
            );
        }, 300);
    }

    async getPaymentList() {
        this.setState({ isLoading: true });
        try {
            let res = await getPaymentListApi({
                params: {
                    page: this.state.page,
                    size: pageSize,
                },
            });
            this.setState({
                payments: res.data,
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

    async onChangePage(page) {
        await Router.push(`/dashboard/payment/list?page=${page}`);
        this.setState({ page }, () => {
            this.getMemberList();
        });
    }

    render() {
        let { isLoading, payments, page, totalPage } = this.state;

        return (
            <>
                <Head>
                    <title>{title}</title>
                    <meta name="description" content={title} />
                </Head>
                <MainLayout>
                    <AccountLayout title={title}>
                        <Card type="inner">
                            <Table
                                dataSource={payments}
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
                                        title: "หัวข้อ",
                                        dataIndex: "title",
                                        key: "title",
                                        className: " fs-6",
                                    },
                                    {
                                        title: "ผู้ลงประกาศ",
                                        dataIndex: "name",
                                        key: "name",
                                        align: "center",
                                        className: "fs-6",
                                        render: (value, record) =>
                                            `${record.member?.firstname} ${record.member?.lastname}`,
                                    },
                                    {
                                        title: "วันที่ลงประกาศ",
                                        dataIndex: "create_datetime",
                                        key: "create_datetime",
                                        align: "center",
                                        className: "fs-6",
                                        render: (value) => (
                                            <span>
                                                {moment(value).format(
                                                    "DD/MM/YYYY HH:mm"
                                                )}
                                            </span>
                                        ),
                                    },
                                    {
                                        title: "ยอดชำระ (บาท)",
                                        dataIndex: "total_amount",
                                        key: "total_amount",
                                        align: "right",
                                        className: "fs-6",
                                        render: (value, record) =>
                                            numeral(value).format("0,0.00"),
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
                                                    href={`/dashboard/payment/detail?id=${record.id}`}
                                                >
                                                    <Button
                                                        type="primary"
                                                        className="btn-primary"
                                                        icon={
                                                            <FileSearchOutlined />
                                                        }
                                                    >
                                                        รายละเอียด
                                                    </Button>
                                                </Link>
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

export default DashboardPaymentList;
