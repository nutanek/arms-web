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
    Image,
    message,
} from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import {
    MEMBER_TYPES,
    ACCOUNT_APPROVE_STATUS,
} from "./../../../constants/appConstants";
import { IMAGE_PATH } from "./../../../constants/config";
import {
    getMemberDetailApi,
    updateMemberAccountStatusApi,
} from "./../../../services/apiServices";
import MainLayout from "./../../../components/Layout/MainLayout";
import AccountLayout from "./../../../components/Layout/AccountLayout";
import Loading from "./../../../components/Utility/Modal/Loading";

const title = "รายละเอียดคำขออนุมัติ";

class DashboarAccountDetail extends Component {
    state = {
        isLoadng: false,
        isSubmitted: false,
        member: {},
    };

    formRef = React.createRef();

    componentDidMount() {
        setTimeout(() => {
            let query = Router.query;
            this.getMemberDetail(query.id);
        }, 300);
    }

    async getMemberDetail(id) {
        this.setState({ isLoading: true });
        try {
            let member = await getMemberDetailApi({ params: { id } });
            this.setState({ member });
        } catch (error) {
        } finally {
            setTimeout(() => {
                this.setState({ isLoading: false });
            }, 300);
        }
    }

    async updateMemberAccountStatus(id, status) {
        if (!status) {
            return;
        }
        this.setState({ isLoading: true });
        try {
            let res = await updateMemberAccountStatusApi({
                params: { id },
                body: { status },
            });
            Modal.success({
                title: "สำเร็จ",
                content: res.message,
                centered: true,
                maskClosable: true,
                okText: "ตกลง",
                onCancel: () => this.onBack(),
                afterClose: () => this.getMemberDetail(id),
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
        let { isLoading, member } = this.state;

        let memberType = MEMBER_TYPES[member.member_type] || {};
        let status = ACCOUNT_APPROVE_STATUS[member.approved_status] || {};

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
                                                <b>ชื่อ: </b>
                                                {member?.firstname}{" "}
                                                {member?.lastname}
                                            </Col>
                                            <Col span={12} className="text-end">
                                                <Tag color={status.color}>
                                                    {status.name}
                                                </Tag>
                                            </Col>
                                        </Row>
                                    }
                                >
                                    {/* <div className="fs-5 fw-bold">
                                        {report.title}
                                    </div>
                                    <div
                                        className="fs-6 mt-3"
                                        style={{ wordBreak: "break-word" }}
                                    >
                                        {report.detail}
                                    </div> */}

                                    <div className="fs-6 mb-3">
                                        <b>ประเถทสมาชิกที่ขอ: </b>
                                        {memberType.name}
                                    </div>

                                    <div>
                                        <Image
                                            width={200}
                                            src={`${IMAGE_PATH}/${member.account_image}`}
                                        />
                                    </div>

                                    <div className="mt-5 text-primary">
                                        <ClockCircleOutlined />{" "}
                                        {moment(
                                            member.request_approve_datetime
                                        ).format("DD/MM/YYYY HH:mm")}
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
                                        {[1].includes(
                                            member.approved_status
                                        ) && (
                                            <div className="text-end">
                                                <Button
                                                    danger
                                                    type="primary"
                                                    size="large"
                                                    className="ms-2"
                                                    onClick={() =>
                                                        this.updateMemberAccountStatus(
                                                            member.id,
                                                            3
                                                        )
                                                    }
                                                >
                                                    ไม่อนุมัติ
                                                </Button>
                                                <Button
                                                    type="primary"
                                                    size="large"
                                                    className="ms-2 bg-success"
                                                    onClick={() =>
                                                        this.updateMemberAccountStatus(
                                                            member.id,
                                                            2
                                                        )
                                                    }
                                                >
                                                    อนุมัติ
                                                </Button>
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

export default DashboarAccountDetail;
