import React, { Component } from "react";
import Head from "next/head";
import Router from "next/router";
import {
    Row,
    Col,
    Button,
    Modal,
    Form,
    Tag,
    Card,
    Image,
    message,
    Divider,
} from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import numeral from "numeral";
import { JOB_STATUS, REPORT_STATUS } from "./../../../constants/appConstants";
import { IMAGE_PATH } from "./../../../constants/config";
import {
    getJobDetailApi,
    updateJobStatusApi,
} from "./../../../services/apiServices";
import { getLocalUserInfo } from "./../../../services/appServices";
import MainLayout from "./../../../components/Layout/MainLayout";
import AccountLayout from "./../../../components/Layout/AccountLayout";
import Loading from "./../../../components/Utility/Modal/Loading";
import Link from "next/link";

const title = "การชำระเงิน";

class DashboardPaymentDetail extends Component {
    state = {
        isLoadng: false,
        isSubmitted: false,
        job: {},
        userInfo: {},
    };

    formRef = React.createRef();

    componentDidMount() {
        let userInfo = getLocalUserInfo();
        this.setState({ userInfo });
        setTimeout(() => {
            let query = Router.query;
            this.getJobDetail(query.id);
        }, 300);
    }

    async getJobDetail(id) {
        this.setState({ isLoading: true });
        try {
            let job = await getJobDetailApi({ params: { id } });
            this.setState({ job });
        } catch (error) {
        } finally {
            setTimeout(() => {
                this.setState({ isLoading: false });
            }, 300);
        }
    }

    async updateJobStatus(id, status) {
        this.setState({ isLoading: true });
        try {
            let res = await updateJobStatusApi({
                params: { id },
                body: { status },
            });
            Modal.success({
                title: "สำเร็จ",
                content: res.message,
                centered: true,
                maskClosable: true,
                okText: "ตกลง",
                afterClose: () => {
                    this.getJobDetail(id);
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
            this.setState({ isLoading: false });
        }
    }

    calculatePyment(price = 0, fee = 0) {
        let feePercentage = fee || 0;
        let feeFixed = (price * feePercentage) / 100.0;
        return {
            totalPrice: price + feeFixed,
            price,
            feeFixed,
            feePercentage,
        };
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

    confirmRejectPayment(jobId) {
        Modal.confirm({
            title: "ท่านยืนยันที่จะปฏิเสธการชำระเงินนี้ใช่ไหม?",
            content: "กรุณาติดต่อผู้ลงประกาศเพื่อคืนเงินค่าจ้าง(ถ้ามี)",
            okText: "ยืนยัน",
            cancelText: "ยกเลิก",
            centered: true,
            onOk: () => this.updateJobStatus(jobId, 7),
        });
    }

    confirmApprovePayment(jobId) {
        Modal.confirm({
            title: "ท่านยืนยันที่จะอนุมัติการชำระเงินนี้ใช่ไหม?",
            okText: "ยืนยัน",
            cancelText: "ยกเลิก",
            centered: true,
            onOk: () => this.updateJobStatus(jobId, 1),
        });
    }

    render() {
        let { isLoading, job, userInfo } = this.state;

        let payment = this.calculatePyment(job.price, job.service_charge?.fee);

        let status = JOB_STATUS[job.job_status] || {};

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
                                            ></Col>
                                            <Col span={12} className="text-end">
                                                <Tag color={status.color}>
                                                    {status.name}
                                                </Tag>
                                            </Col>
                                        </Row>
                                    }
                                >
                                    <Row justify="space-between" gutter={25}>
                                        <Col lg={12} className="pb-4">
                                            <div className="fs-5 fw-bold">
                                                ยอดชำระ:{" "}
                                                <span className="text-success">
                                                    {numeral(
                                                        payment.totalPrice
                                                    ).format("0,0[.]00")}{" "}
                                                    บาท
                                                </span>
                                            </div>
                                            <div>
                                                ค่าจ้าง:{" "}
                                                {numeral(payment.price).format(
                                                    "0,0[.]00"
                                                )}{" "}
                                                บาท
                                            </div>
                                            <div>
                                                ค่าธรรมเนียม:{" "}
                                                {numeral(
                                                    payment.feeFixed
                                                ).format("0,0[.]00")}{" "}
                                                บาท ({payment.feePercentage}%)
                                            </div>

                                            <Divider />
                                            

                                            <div className="fs-6">
                                                <b>ธนาคารปลายทาง: </b>
                                                {job.bank_account?.bank_name ||
                                                    "-"}
                                            </div>
                                            <div className="fs-6">
                                                <b>เลขบัญชี: </b>
                                                {job.bank_account
                                                    ?.account_number || "-"}
                                            </div>
                                            <div className="fs-6">
                                                <b>ชื่อบัญชี: </b>
                                                {job.bank_account
                                                    ?.account_name || "-"}
                                            </div>

                                            <Divider />

                                            <div className="fs-6">
                                                <b>หัวข้อ: </b>
                                                <Link
                                                    href={`/dashboard/job/detail?id=${job.id}`}
                                                    className="text-primary"
                                                >
                                                    {job.title}
                                                </Link>
                                            </div>
                                            <div className="fs-6">
                                                <b>ผู้ลงประกาศ: </b>
                                                <Link
                                                    href={`/member?id=${job.member?.id}`}
                                                    className="text-primary"
                                                >
                                                    <>
                                                        {job.member?.firstname}{" "}
                                                        {job.member?.lastname}
                                                    </>
                                                </Link>
                                            </div>
                                            <div className="fs-6">
                                                <b>เวลา: </b>
                                                {moment(
                                                    job.create_datetime
                                                ).format("DD/MM/YYYY HH:mm")}
                                            </div>
                                        </Col>
                                        <Col xs={24} lg={12}>
                                            <Card>
                                                <Form.Item
                                                    label={
                                                        <div className="fs-6 fw-bold">
                                                            ใบเสร็จ/หลักฐานการชำระเงิน{" "}
                                                        </div>
                                                    }
                                                >
                                                    {job.payment_image && (
                                                        <div className="mt-3">
                                                            <Image
                                                                width={"100%"}
                                                                src={`${IMAGE_PATH}/${job.payment_image}`}
                                                            />
                                                        </div>
                                                    )}
                                                </Form.Item>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Card>

                                <Row justify="space-between" className="pt-3">
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
                                        {["admin"].includes(
                                            userInfo.member_type
                                        ) && (
                                            <div className="text-end">
                                                {[6].includes(
                                                    job.job_status
                                                ) && (
                                                    <Button
                                                        danger
                                                        type="primary"
                                                        size="large"
                                                        className="ms-2"
                                                        onClick={() =>
                                                            this.confirmRejectPayment(
                                                                job.id
                                                            )
                                                        }
                                                    >
                                                        ปฏิเสธ
                                                    </Button>
                                                )}
                                                {[6].includes(
                                                    job.job_status
                                                ) && (
                                                    <Button
                                                        type="primary"
                                                        size="large"
                                                        className="ms-2"
                                                        onClick={() =>
                                                            this.confirmApprovePayment(
                                                                job.id
                                                            )
                                                        }
                                                    >
                                                        อนุมัติ
                                                    </Button>
                                                )}
                                            </div>
                                        )}
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

export default DashboardPaymentDetail;
