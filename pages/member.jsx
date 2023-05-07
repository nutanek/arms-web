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
import { GENDERS_MAPPING, MEMBER_TYPES } from "./../constants/appConstants";
import { IMAGE_PATH } from "./../constants/config";
import { getMemberDetailApi } from "./../services/apiServices";
import { getLocalUserInfo } from "./../services/appServices";
import MainLayout from "./../components/Layout/MainLayout";

const title = "";

class Member extends Component {
    state = {
        isLoading: false,
        member: {},
        userInfo: {},
    };

    componentDidMount() {
        let userInfo = getLocalUserInfo();
        this.setState({ userInfo });
        setTimeout(() => {
            let { id = 0 } = Router.query;
            this.getMemberDetail(id);
        }, 300);
    }

    async getMemberDetail(id) {
        this.setState({ isLoading: true });
        try {
            let res = await getMemberDetailApi({ params: { id } });
            this.setState({
                member: res,
            });
        } catch (error) {
            console.log(error);
        } finally {
            setTimeout(() => {
                this.setState({ isLoading: false });
            }, 300);
        }
    }

    render() {
        let { member, userInfo } = this.state;

        return (
            <>
                <Head>
                    <title>โปรไฟล์ของ {member.firstname}</title>
                    <meta name="description" content={title} />
                </Head>
                <MainLayout>
                    <Row justify="center">
                        <Col xs={24} lg={16}>
                            <div className="text-center mb-3">
                                <Avatar
                                    src={
                                        member.image
                                            ? `${IMAGE_PATH}/${member.image}`
                                            : `${assetPrefix}/images/no-avatar.png`
                                    }
                                    style={{
                                        width: 150,
                                        height: 150,
                                    }}
                                />
                            </div>

                            <h1 className="page-title fs-2 text-center fw-bold mt-0 mb-1">
                                {member.firstname} {member.lastname}
                            </h1>

                            <div className="text-center mb-4">
                                <Tag color="#108ee9">
                                    {MEMBER_TYPES[member.member_type]?.name ||
                                        "ไม่ยืนยันตัวตน"}
                                </Tag>
                            </div>

                            <Card
                                type="inner"
                                // headStyle={{
                                //     backgroundColor: "#389e0d",
                                //     color: "#ffffff",
                                // }}
                                title={<div className="fs-6">รายละเอียด</div>}
                                className="mb-3"
                            >
                                <div className="fs-6 mb-2">
                                    <b>เพศ: </b>
                                    {GENDERS_MAPPING[member.gender]?.name ||
                                        "-"}
                                </div>
                                <div className="fs-6 mb-2">
                                    <b>วันเกิด: </b>
                                    {member.birthday}
                                    {moment(member.birthdate).format(
                                        "DD/MM/YYYY"
                                    )}
                                </div>
                                {!!member.skills &&
                                    member.skills.length > 0 && (
                                        <div className="fs-6">
                                            <b>ทักษะ: </b>
                                            {member.skills &&
                                                member.skills.map((skill) => (
                                                    <Tag
                                                        color="red"
                                                        className="fs-6"
                                                    >
                                                        {skill.name}
                                                    </Tag>
                                                ))}
                                        </div>
                                    )}
                            </Card>

                            <Card
                                type="inner"
                                // headStyle={{
                                //     backgroundColor: "#389e0d",
                                //     color: "#ffffff",
                                // }}
                                title={
                                    <div className="fs-6">ช่องทางการติดต่อ</div>
                                }
                                className="mb-3"
                            >
                                <div className="fs-6">
                                    <PhoneOutlined />{" "}
                                    {member.phone_number || "ไม่ระบุ"}{" "}
                                    <Divider type="vertical" />
                                    <MailOutlined /> {member.email || "ไม่ระบุ"}
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </MainLayout>
            </>
        );
    }
}

export default Member;