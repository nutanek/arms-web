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
    Modal,
    Card,
    Tag,
    message,
} from "antd";
import { PlusOutlined, FileSearchOutlined } from "@ant-design/icons";
import moment from "moment";
import { REPORT_STATUS } from "./../../../constants/appConstants";
import { getReportListApi } from "./../../../services/apiServices";
import MainLayout from "./../../../components/Layout/MainLayout";
import AccountLayout from "./../../../components/Layout/AccountLayout";
import Loading from "./../../../components/Utility/Modal/Loading";

const title = "รายงานปัญหาทั้งหมด";

const pageSize = 10;

class DashboardReportList extends Component {
    state = {
        isLoading: false,
        reports: [],
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
                () => this.getReportList()
            );
        }, 100);
    }

    async getReportList() {
        this.setState({ isLoading: true });
        try {
            let res = await getReportListApi({
                params: {
                    page: this.state.page,
                    size: pageSize,
                    keyword: this.state.keyword,
                },
            });
            this.setState({
                reports: res.data,
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
        await Router.push(
            `/dashboard/report/list?page=${page}&keyword=${this.state.keyword}`
        );
        this.setState({ page }, () => {
            this.getReportList();
        });
    }

    async onSearch(keyword = "") {
        await Router.push(`/dashboard/report/list?page=1&keyword=${keyword}`);
        this.setState({ keyword, page: 1 }, () => {
            this.getReportList();
        });
    }

    onChangeKeyword(keyword) {
        this.setState({ keyword });
    }

    render() {
        let { isLoading, reports, page, totalPage, keyword } = this.state;
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
                                        <Input.Search
                                            placeholder="ค้นหาหัวข้อ และชื่อผู้รายงาน"
                                            allowClear
                                            size="large"
                                            value={keyword}
                                            onChange={(e) =>
                                                this.onChangeKeyword(
                                                    e.target.value
                                                )
                                            }
                                            onSearch={this.onSearch.bind(this)}
                                        />
                                    </Col>
                                    <Col span={12} className="pb-3 text-end">
                                        <Link href={`/dashboard/report/add`}>
                                            <Button
                                                type="primary"
                                                size="large"
                                                icon={<PlusOutlined />}
                                                className="bg-success"
                                            >
                                                รายงานปัญหา
                                            </Button>
                                        </Link>
                                    </Col>
                                </Row>
                            }
                        >
                            <Table
                                dataSource={reports}
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
                                        title: "วันที่รายงาน",
                                        dataIndex: "report_time",
                                        key: "report_time",
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
                                        title: "ผู้รายงาน",
                                        dataIndex: "name",
                                        key: "name",
                                        align: "center",
                                        className: "fs-6",
                                        render: (value, record) =>
                                            `${record.member?.firstname} ${record.member?.lastname}`,
                                    },
                                    {
                                        title: "สถานะ",
                                        dataIndex: "report_status",
                                        key: "report_status",
                                        align: "center",
                                        className: "fs-6",
                                        render: (value) => {
                                            let status =
                                                REPORT_STATUS[value] || {};
                                            return (
                                                <Tag color={status.color}>
                                                    {status.name}
                                                </Tag>
                                            );
                                        },
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
                                                    href={`/dashboard/report/detail?id=${record.id}`}
                                                >
                                                    <Button
                                                        type="primary"
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

export default DashboardReportList;
