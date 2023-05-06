import React, { Component } from "react";
import Head from "next/head";
import Router from "next/router";
import { Row, Col, Button, Modal, Popconfirm, Tag, Card, message } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { REPORT_STATUS } from "./../../../constants/appConstants";
import {
    getReportDetailApi,
    updateReportStatusApi,
} from "./../../../services/apiServices";
import MainLayout from "./../../../components/Layout/MainLayout";
import AccountLayout from "./../../../components/Layout/AccountLayout";
import Loading from "./../../../components/Utility/Modal/Loading";

const title = "รายงานปัญหา";

class DashboarReportDetail extends Component {
    state = {
        isLoadng: false,
        isSubmitted: false,
        report: {},
    };

    formRef = React.createRef();

    componentDidMount() {
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

    async updateReportStatus(id, status) {
        if (!status) {
            return;
        }
        this.setState({ isLoading: true });
        try {
            let res = await updateReportStatusApi({
                params: { id },
                body: { status },
            });
            this.getReportDetail(id);
            Modal.success({
                title: "สำเร็จ",
                content: res.message,
                centered: true,
                maskClosable: true,
                okText: "ตกลง",
                onCancel: () => this.onBack(),
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
        let { isLoading, report } = this.state;

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
                                        <div className="text-end">
                                            {[1, 2].includes(
                                                report.report_status
                                            ) && (
                                                <Popconfirm
                                                    title={
                                                        "คุณต้องการยกเลิกคำร้องนี้ใช่ไหม?"
                                                    }
                                                    onConfirm={() =>
                                                        this.updateReportStatus(
                                                            report.id,
                                                            4
                                                        )
                                                    }
                                                    okText={"ยืนยัน"}
                                                    cancelText={"ยกเลิก"}
                                                >
                                                    <Button
                                                        danger
                                                        type="primary"
                                                        size="large"
                                                        className="ms-2"
                                                    >
                                                        ยกเลิกคำร้อง
                                                    </Button>
                                                </Popconfirm>
                                            )}
                                            {[1].includes(
                                                report.report_status
                                            ) && (
                                                <Button
                                                    type="primary"
                                                    size="large"
                                                    className="ms-2"
                                                    onClick={() =>
                                                        this.updateReportStatus(
                                                            report.id,
                                                            2
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
                                                        this.updateReportStatus(
                                                            report.id,
                                                            3
                                                        )
                                                    }
                                                >
                                                    ดำเนินการเสร็จสิ้น
                                                </Button>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </AccountLayout>
                </MainLayout>

                <Loading isOpen={isLoading} />
            </>
        );
    }
}

export default DashboarReportDetail;
