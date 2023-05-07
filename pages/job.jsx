import React, { Component } from "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import moment from "moment";
import numeral from "numeral";
import {
    Row,
    Col,
    Alert,
    Tag,
    Card,
    List,
    Avatar,
    Divider,
    Button,
    Modal,
} from "antd";
import { PhoneOutlined, MailOutlined, SendOutlined } from "@ant-design/icons";
import { assetPrefix } from "./../next.config";
import { IMAGE_PATH } from "./../constants/config";
import { getJobDetailApi, requestJobApi } from "./../services/apiServices";
import { getLocalUserInfo } from "./../services/appServices";
import MainLayout from "./../components/Layout/MainLayout";

const title = "";

class Job extends Component {
    state = {
        isLoading: false,
        job: {},
        userInfo: {},
    };

    componentDidMount() {
        let userInfo = getLocalUserInfo();
        this.setState({ userInfo });
        setTimeout(() => {
            let { id = 0 } = Router.query;
            this.getJobDetail(id);
        }, 300);
    }

    async getJobDetail(id) {
        this.setState({ isLoading: true });
        try {
            let res = await getJobDetailApi({ params: { id } });
            this.setState({
                job: res,
            });
        } catch (error) {
            console.log(error);
        } finally {
            setTimeout(() => {
                this.setState({ isLoading: false });
            }, 300);
        }
    }

    async requestJob(id) {
        this.setState({ isLoading: true });
        try {
            let res = await requestJobApi({ params: { id } });
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

    render() {
        let { job, userInfo } = this.state;

        return (
            <>
                <Head>
                    <title>{job.title}</title>
                    <meta name="description" content={title} />
                </Head>
                <MainLayout>
                    <h1 className="page-title fs-2 text-center fw-bold mt-0 mb-4">
                        {job.title}
                    </h1>
                    <Row justify="center">
                        <Col xs={24} lg={16}>
                            {job.image && (
                                <img
                                    src={`${IMAGE_PATH}/${job.image}`}
                                    style={{ width: "100%" }}
                                    className="mb-2"
                                />
                            )}

                            <Row justify="space-between" className="mb-3">
                                <Col>
                                    <div className="fs-3">
                                        ค่าจ้าง{" "}
                                        <b className="text-danger">
                                            {numeral(job.price).format("0,0")}
                                        </b>{" "}
                                        บาท
                                    </div>
                                </Col>
                                <Col>
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<SendOutlined />}
                                        onClick={() => this.requestJob(job.id)}
                                        disabled={!!job.employee?.id}
                                    >
                                        ขอรับงานนี้
                                    </Button>
                                </Col>
                            </Row>

                            <Card
                                type="inner"
                                // headStyle={{
                                //     backgroundColor: "#389e0d",
                                //     color: "#ffffff",
                                // }}
                                title={<div className="fs-6">รายละเอียด</div>}
                                className="mb-3"
                            >
                                {job.detail && (
                                    <div
                                        className="fs-6 mb-4"
                                        style={{ whiteSpace: "pre-line" }}
                                    >
                                        {job.detail}
                                    </div>
                                )}
                                <div className="fs-6 mb-2">
                                    <b>ประเภทงาน: </b>
                                    {job.job_type}
                                </div>
                                <div className="fs-6">
                                    <b>ทักษะที่ต้องการ: </b>
                                    {job.skills &&
                                        job.skills.map((skill) => (
                                            <Tag color="red" className="fs-6">
                                                {skill.name}
                                            </Tag>
                                        ))}
                                </div>
                            </Card>

                            <Row gutter={15}>
                                <Col span={12}>
                                    <Card type="inner" className="mb-3">
                                        <div className="fs-6 text-center">
                                            <b>สถานที่</b>
                                            <br />
                                            {job.location?.name}
                                            <br />
                                            {job.location?.address}
                                            <br />
                                            <div className="text-primary">
                                                {job.location?.province}
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card type="inner" className="mb-3">
                                        <div className="fs-6 text-center">
                                            <b>เวลา</b>
                                            <br />
                                            {moment(
                                                `${job.start_date} ${job.start_time}`
                                            ).format("DD/MM/YYYY HH:mm น.")}
                                            <br />
                                            ถึง
                                            <br />
                                            {moment(
                                                `${job.end_date} ${job.end_time}`
                                            ).format("DD/MM/YYYY HH:mm น.")}
                                        </div>
                                    </Card>
                                </Col>
                            </Row>

                            <Card
                                type="inner"
                                // headStyle={{
                                //     backgroundColor: "#389e0d",
                                //     color: "#ffffff",
                                // }}
                                title={<div className="fs-6">ผู้ว่าจ้าง</div>}
                                className="mb-3"
                            >
                                <List>
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar
                                                    src={
                                                        job.member?.image
                                                            ? `${IMAGE_PATH}/${job.member?.image}`
                                                            : `${assetPrefix}/images/no-avatar.png`
                                                    }
                                                    style={{
                                                        width: 50,
                                                        height: 50,
                                                    }}
                                                />
                                            }
                                            title={
                                                <Link
                                                    href={`/member?id=${job.member?.id}`}
                                                >
                                                    <div className="fs-6 text-primary">
                                                        {job.member?.firstname}{" "}
                                                        {job.member?.lastname}
                                                    </div>
                                                </Link>
                                            }
                                            description={
                                                <div className="fs-6">
                                                    <PhoneOutlined />{" "}
                                                    {job.member?.phone_number ||
                                                        "ไม่ระบุ"}{" "}
                                                    <Divider type="vertical" />
                                                    <MailOutlined />{" "}
                                                    {job.member?.email ||
                                                        "ไม่ระบุ"}
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                </List>
                            </Card>
                        </Col>
                    </Row>
                </MainLayout>
            </>
        );
    }
}

export default Job;
