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
    getFeeListApi,
    removeFeeDetailApi,
} from "./../../../services/apiServices";
import MainLayout from "./../../../components/Layout/MainLayout";
import AccountLayout from "./../../../components/Layout/AccountLayout";
import Loading from "./../../../components/Utility/Modal/Loading";

const title = "ค่าธรรมเนียม";

const pageSize = 10;

class DashboardFeeList extends Component {
    state = {
        isLoading: false,
        fees: [],
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
                () => this.getFeeList()
            );
        }, 300);
    }

    async getFeeList() {
        this.setState({ isLoading: true });
        try {
            let res = await getFeeListApi({
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
                fees: res.data,
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

    async removeFeeList(id) {
        this.setState({ isLoading: true });
        try {
            let res = await removeFeeDetailApi({
                params: { id },
            });
            message.success(res?.message);
            this.getFeeList();
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
            `/dashboard/fee/list?page=${page}&keyword=${this.state.keyword}`
        );
        this.setState({ page }, () => {
            this.getFeeList();
        });
    }

    async onSearch(keyword = "") {
        await Router.push(`/dashboard/fee/list?page=1&keyword=${keyword}`);
        this.setState({ keyword, page: 1 }, () => {
            this.getFeeList();
        });
    }

    onChangeKeyword(keyword) {
        this.setState({ keyword });
    }

    render() {
        let { isLoading, fees, page, totalPage, keyword } = this.state;
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
                                    <Col xs={12} lg={8}>
                                        {/* <Input.Search
                                            placeholder="ค้นหาสมาชิกด้วย ชื่อ และอีเมล"
                                            allowClear
                                            size="large"
                                            value={keyword}
                                            onChange={(e) =>
                                                this.onChangeKeyword(
                                                    e.target.value
                                                )
                                            }
                                            onSearch={this.onSearch.bind(this)}
                                        /> */}
                                    </Col>
                                    <Col span={12} className="pb-3 text-end">
                                        <Link
                                            href={`/dashboard/fee/detail?action=add`}
                                        >
                                            <Button
                                                type="primary"
                                                size="large"
                                                icon={<PlusOutlined />}
                                                className="bg-success"
                                            >
                                                เพิ่มรายการใหม่
                                            </Button>
                                        </Link>
                                    </Col>
                                </Row>
                            }
                        >
                            <Table
                                dataSource={fees}
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
                                        title: "ประเภท",
                                        dataIndex: "service_charge_type",
                                        key: "service_charge_type",
                                        className: "fs-6",
                                    },
                                    {
                                        title: "ค่าธรรมเนียม",
                                        dataIndex: "fee",
                                        key: "fee",
                                        className: "fs-6",
                                        align: "center",
                                        render: (value, record) =>
                                            `${numeral(value).format(
                                                "0,0"
                                            )} บาท`,
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
                                                    href={`/dashboard/fee/detail?id=${record.id}`}
                                                >
                                                    <Button
                                                        type="primary"
                                                        icon={<EditOutlined />}
                                                    ></Button>
                                                </Link>

                                                <Popconfirm
                                                    title={
                                                        "คุณต้องการลบสมาชิกรายนี้ใช่ไหม?"
                                                    }
                                                    onConfirm={() =>
                                                        this.removeFeeList(
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
                                                    ></Button>
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

export default DashboardFeeList;
