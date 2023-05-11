import React, { Component } from "react";
import Head from "next/head";
import Router from "next/router";
import {
    Row,
    Col,
    Button,
    Modal,
    Popconfirm,
    Tag,
    Card,
    message,
    Input,
} from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { REPORT_STATUS } from "./../../../constants/appConstants";
import {
    getReportDetailApi,
    updateReportStatusApi,
} from "./../../../services/apiServices";
import { getLocalUserInfo } from "@/services/appServices";
import MainLayout from "./../../../components/Layout/MainLayout";
import AccountLayout from "./../../../components/Layout/AccountLayout";
import Loading from "./../../../components/Utility/Modal/Loading";

const title = "รายงานปัญหา";

class DashboardReportDetail extends Component {
    state = {
        isLoadng: false,
        isSubmitted: false,
        isOpenCommentModal: false,
        selectedStatus: 0,
        comment: "",
        report: {},
        userInfo: {},
    };

    formRef = React.createRef();

    componentDidMount() {
        let userInfo = getLocalUserInfo();
        this.setState({ userInfo });
        setTimeout(() => {
            let query = Router.query;
            this.getReportDetail(query.id);
        }, 300);
    }

    async getReportDetail(id) {
        this.setState({ isLoading: true });
        try {
            let report = await getReportDetailApi({ params: { id } });
            this.setState({ report });
        } catch (error) {
        } finally {
            setTimeout(() => {
                this.setState({ isLoading: false });
            }, 300);
        }
    }

    async updateReportStatus(id) {
        let { comment, selectedStatus: status } = this.state;
        if (!status) {
            return;
        }
        this.setState({ isLoading: true });
        try {
            let res = await updateReportStatusApi({
                params: { id },
                body: { status, response_message: comment },
            });
            this.toggleCommentModal(false);
            Modal.success({
                title: "สำเร็จ",
                content: res.message,
                centered: true,
                maskClosable: true,
                okText: "ตกลง",
                onOk: () => {
                    this.getReportDetail(id);
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

    onChangeComment(comment = "") {
        this.setState({ comment });
    }

    toggleCommentModal(status) {
        this.setState({ isOpenCommentModal: status });
    }

    confirmRejectRequestJob() {
        this.toggleCommentModal(true);
        this.setState({ selectedStatus: 4 });
        // Modal.confirm({
        //     title: "ท่านยืนยันที่จะยกเลิกการรายงานนี้ใช่ไหม?",
        //     okText: "ยืนยัน",
        //     cancelText: "ยกเลิก",
        //     centered: true,
        //     onOk: () => this.updateReportStatus(reportId, 4),
        // });
    }

    confirmApproveRequestJob() {
        this.toggleCommentModal(true);
        this.setState({ selectedStatus: 2 });
        // Modal.confirm({
        //     title: "ท่านยืนยันที่จะดำเนินการแก้ปัญหานี้ใช่ไหม?",
        //     okText: "ยืนยัน",
        //     cancelText: "ยกเลิก",
        //     centered: true,
        //     onOk: () => this.updateReportStatus(reportId, 2),
        // });
    }

    confirmAFinishRequestJob() {
        this.toggleCommentModal(true);
        this.setState({ selectedStatus: 3 });
        // Modal.confirm({
        //     title: "ท่านยืนยันที่จะเสร็จสิ้นการแก้ปัญหานี้ใช่ไหม?",
        //     okText: "ยืนยัน",
        //     cancelText: "ยกเลิก",
        //     centered: true,
        //     onOk: () => this.updateReportStatus(reportId, 3),
        // });
    }

    render() {
        let {
            isLoading,
            report,
            isOpenCommentModal,
            selectedStatus,
            userInfo,
        } = this.state;

        let status = REPORT_STATUS[report.report_status] || {};

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
                                <Card
                                    type="inner"
                                    title={
                                        <Row>
                                            <Col
                                                span={12}
                                                className="fs-6 fw-light"
                                            >
                                                <b>ผู้รายงาน: </b>
                                                {report.member?.firstname}{" "}
                                                {report.member?.lastname}
                                            </Col>
                                            <Col span={12} className="text-end">
                                                <Tag color={status.color}>
                                                    {status.name}
                                                </Tag>
                                            </Col>
                                        </Row>
                                    }
                                >
                                    <div className="fs-5 fw-bold">
                                        {report.title}
                                    </div>
                                    <div
                                        className="fs-6 mt-3"
                                        style={{ wordBreak: "break-word" }}
                                    >
                                        {report.detail}
                                    </div>

                                    <div className="mt-5 text-primary">
                                        <ClockCircleOutlined />{" "}
                                        {moment(report.report_time).format(
                                            "DD/MM/YYYY HH:mm"
                                        )}
                                    </div>
                                </Card>
                                {report.response_message && (
                                    <Card
                                        type="inner"
                                        className="mt-3"
                                        title="ข้อความตอบกลับ"
                                        bodyStyle={{ whiteSpace: "pre-line" }}
                                    >
                                        {report.response_message}
                                    </Card>
                                )}
                                <Row justify="space-between" className="pt-3">
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
                                        {["admin"].includes(
                                            userInfo.member_type
                                        ) && (
                                            <div className="text-end">
                                                {[1, 2].includes(
                                                    report.report_status
                                                ) && (
                                                    <Button
                                                        danger
                                                        type="primary"
                                                        size="large"
                                                        className="ms-2"
                                                        onClick={() =>
                                                            this.confirmRejectRequestJob(
                                                                report.id
                                                            )
                                                        }
                                                    >
                                                        ยกเลิกคำร้อง
                                                    </Button>
                                                )}
                                                {[1].includes(
                                                    report.report_status
                                                ) && (
                                                    <Button
                                                        type="primary"
                                                        size="large"
                                                        className="ms-2"
                                                        onClick={() =>
                                                            this.confirmApproveRequestJob(
                                                                report.id
                                                            )
                                                        }
                                                    >
                                                        ดำเนินการ
                                                    </Button>
                                                )}
                                                {[2].includes(
                                                    report.report_status
                                                ) && (
                                                    <Button
                                                        type="primary"
                                                        size="large"
                                                        className="ms-2 bg-success"
                                                        onClick={() =>
                                                            this.confirmAFinishRequestJob(
                                                                report.id
                                                            )
                                                        }
                                                    >
                                                        ดำเนินการเสร็จสิ้น
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Modal
                            title={`ข้อความตอบกลับ (${
                                selectedStatus == 2
                                    ? "ดำเนินการ"
                                    : selectedStatus == 3
                                    ? "ดำเนินการเสร็จสิ้น"
                                    : selectedStatus == 4
                                    ? "ยกเลิกกคำร้อง"
                                    : ""
                            })`}
                            open={isOpenCommentModal}
                            onCancel={() => this.toggleCommentModal(false)}
                            footer={false}
                            centered
                        >
                            <Input.TextArea
                                rows={4}
                                className="mt-2"
                                onBlur={(e) =>
                                    this.onChangeComment(e.target.value)
                                }
                            />

                            <div className="text-end mt-3">
                                <Button
                                    size="large"
                                    type="primary"
                                    onClick={() =>
                                        this.updateReportStatus(report.id)
                                    }
                                >
                                    ยืนยัน
                                </Button>
                            </div>
                        </Modal>
                    </AccountLayout>
                </MainLayout>

                <Loading isOpen={isLoading} />
            </>
        );
    }
}

export default DashboardReportDetail;
