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
import { JOB_STATUS } from "./../../../constants/appConstants";
import { getJobListApi } from "./../../../services/apiServices";
import { getLocalUserInfo } from "./../../../services/appServices";
import MainLayout from "./../../../components/Layout/MainLayout";
import AccountLayout from "./../../../components/Layout/AccountLayout";
import Loading from "./../../../components/Utility/Modal/Loading";

const title = "งานที่ประกาศ";

const pageSize = 10;

class DashboardJobList extends Component {
    state = {
        isLoading: false,
        jobs: [],
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
                () => this.getJobList()
            );
        }, 300);
    }

    async getJobList() {
        let userInfo = getLocalUserInfo();
        this.setState({ isLoading: true });
        try {
            let res = await getJobListApi({
                params: {
                    page: this.state.page,
                    size: pageSize,
                    keyword: this.state.keyword,
                    id_employer:
                        userInfo.member_type === "admin" ? 0 : userInfo.id,
                    id_employee: 0,
                    status: 0,
                },
            });
            this.setState({
                jobs: res.data,
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
            `/dashboard/job/list?page=${page}&keyword=${this.state.keyword}`
        );
        this.setState({ page }, () => {
            this.getJobList();
        });
    }

    async onSearch(keyword = "") {
        await Router.push(`/dashboard/job/list?page=1&keyword=${keyword}`);
        this.setState({ keyword, page: 1 }, () => {
            this.getJobList();
        });
    }

    onChangeKeyword(keyword) {
        this.setState({ keyword });
    }

    render() {
        let { isLoading, jobs, page, totalPage, keyword } = this.state;
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
                                            placeholder="ค้นหาหัวข้อ"
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
                                        <Link
                                            href={`/dashboard/job/detail?action=add`}
                                        >
                                            <Button
                                                type="primary"
                                                size="large"
                                                icon={<PlusOutlined />}
                                                className="bg-success"
                                            >
                                                ประกาศจ้างงาน
                                            </Button>
                                        </Link>
                                    </Col>
                                </Row>
                            }
                        >
                            <Table
                                dataSource={jobs}
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
                                        title: "วันที่ทำงาน",
                                        dataIndex: "work_date",
                                        key: "work_date",
                                        align: "center",
                                        className: "fs-6",
                                        render: (value, record) => (
                                            <span>
                                                {moment(
                                                    `${record.start_date} ${record.start_time}`
                                                ).format("DD/MM/YYYY HH:mm")}
                                            </span>
                                        ),
                                    },
                                    {
                                        title: "ผู้ประกาศ",
                                        dataIndex: "name",
                                        key: "name",
                                        align: "center",
                                        className: "fs-6",
                                        render: (value, record) =>
                                            `${record.member?.firstname} ${record.member?.lastname}`,
                                    },
                                    {
                                        title: "สถานะ",
                                        dataIndex: "job_status",
                                        key: "job_status",
                                        align: "center",
                                        className: "fs-6",
                                        render: (value) => {
                                            let status =
                                                JOB_STATUS[value] || {};
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
                                                    href={`/dashboard/job/detail?id=${record.id}`}
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

export default DashboardJobList;
