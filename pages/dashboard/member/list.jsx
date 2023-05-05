import React, { Component } from "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import {
    Row,
    Col,
    Alert,
    Table,
    Button,
    Popconfirm,
    Modal,
    message,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import {
    getMemberListApi,
    removeMemberDetailApi,
} from "./../../../services/apiServices";
import MainLayout from "./../../../components/Layout/MainLayout";
import Loading from "./../../../components/Utility/Modal/Loading";

const title = "สมาชิกทั้งหมด";

const pageSize = 10;

class DashboardMemberList extends Component {
    state = {
        isLoading: false,
        members: [],
        page: 1,
        totalPage: 5,
    };

    componentDidMount() {
        setTimeout(() => {
            let query = Router.query;
            this.setState({ page: query.page || 1 }, () =>
                this.getMemberList()
            );
        }, 100);
    }

    async getMemberList() {
        this.setState({ isLoading: true });
        try {
            let res = await getMemberListApi({
                params: {
                    page: this.state.page,
                    size: pageSize,
                },
            });
            this.setState({
                members: res.data,
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

    async removeMemberList(id) {
        this.setState({ isLoading: true });
        try {
            let res = await removeMemberDetailApi({
                params: { id },
            });
            message.success(res?.message);
            this.getMemberList();
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

    onChangePage(page) {
        Router.push(`/dashboard/member/list?page=${page}`);
        this.setState({ page }, () => {
            this.getMemberList();
        });
    }

    render() {
        let { isLoading, members, page, totalPage } = this.state;
        return (
            <>
                <Head>
                    <title>{title}</title>
                    <meta name="description" content={title} />
                </Head>
                <MainLayout>
                    <h1 className="page-title fs-2 text-center fw-bold mt-0 mb-4">
                        {title}
                    </h1>
                    <Row justify="center">
                        <Col lg={{ span: 20 }}>
                            <Row justify="end">
                                <Col className="pb-3">
                                    <Link
                                        href={`/dashboard/member/detail?action=add`}
                                    >
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<PlusOutlined />}
                                            style={{ borderRadius: 8 }}
                                        >
                                            เพิ่มสมาชิกใหม่
                                        </Button>
                                    </Link>
                                </Col>
                            </Row>
                            <Table
                                dataSource={members}
                                pagination={{
                                    current: page,
                                    pageSize: pageSize,
                                    total: totalPage * pageSize,
                                    onChange: this.onChangePage.bind(this),
                                }}
                                rowKey="id"
                                columns={[
                                    {
                                        title: "ชื่อ-นามสกุล",
                                        dataIndex: "name",
                                        key: "name",
                                        className: "fs-6",
                                        render: (value, record) =>
                                            `${record.firstname} ${record.lastname}`,
                                    },
                                    {
                                        title: "อีเมล",
                                        dataIndex: "email",
                                        key: "email",

                                        className: " fs-6",
                                    },
                                    {
                                        title: "วันที่ลงทะเบียน",
                                        dataIndex: "create_date",
                                        key: "create_date",
                                        align: "center",
                                        className: "fs-6",
                                        render: (value) => (
                                            <span>
                                                {moment(value).format(
                                                    "DD/MM/YYYY HH:mm:ss"
                                                )}
                                            </span>
                                        ),
                                    },
                                    {
                                        title: "สถานะ",
                                        dataIndex: "approved_status",
                                        key: "approved_status",
                                        align: "center",
                                        className: "fs-6",
                                        render: (value) => <span>{value}</span>,
                                    },
                                    {
                                        title: "",
                                        dataIndex: "action",
                                        key: "action",
                                        align: "right",
                                        render: (value, record, index) => (
                                            <div
                                                style={{ whiteSpace: "nowrap" }}
                                            >
                                                <Link href="/howto">
                                                    <Button
                                                        type="primary"
                                                        style={{
                                                            borderRadius: 8,
                                                        }}
                                                        icon={<EditOutlined />}
                                                    ></Button>
                                                </Link>

                                                <Popconfirm
                                                    title={
                                                        "คุณต้องการลบสมาชิกรายนี้ใช่ไหม?"
                                                    }
                                                    onConfirm={() =>
                                                        this.removeMemberList(
                                                            record.id
                                                        )
                                                    }
                                                    okText={"ยืนยัน"}
                                                    cancelText={"ยกเลิก"}
                                                >
                                                    <Button
                                                        style={{
                                                            marginLeft: 10,
                                                            borderRadius: 8,
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
                        </Col>
                    </Row>
                </MainLayout>

                <Loading isOpen={isLoading} />
            </>
        );
    }
}

export default DashboardMemberList;
