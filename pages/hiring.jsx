import React, { Component } from "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { Row, Col, Modal, Result, Button } from "antd";
import { getSkillListApi, addJobDetailApi } from "./../services/apiServices";
import { isLoggedIn, getLocalUserInfo } from "./../services/appServices";
import MainLayout from "./../components/Layout/MainLayout";
import Loading from "./../components/Utility/Modal/Loading";
import JobForm from "./../components/Job/JobForm";

const title = "ประกาศจ้างงาน";

class HiringPage extends Component {
    state = {
        isLoadng: false,
        isSubmitted: false,
        skills: [],
        userInfo: {},
    };

    formRef = React.createRef();

    componentDidMount() {
        let userInfo = getLocalUserInfo();
        this.setState({ userInfo });
        this.getSkills();
        if (!isLoggedIn()) {
            Router.push("/signin");
        }
    }

    async getSkills() {
        this.setState({ isLoading: true });
        try {
            let skills = await getSkillListApi();
            this.setState({ skills });
        } catch (error) {
        } finally {
            this.setState({ isLoading: false });
        }
    }

    async addJobDetail(data) {
        this.setState({ isLoading: true });
        try {
            let res = await addJobDetailApi({ body: data });
            Modal.success({
                title: "สำเร็จ",
                content: res.message,
                centered: true,
                maskClosable: true,
                okText: "ตกลง",
                afterClose: () => {
                    this.formRef.current.resetFields();
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

    onSubmit(values = {}) {
        let data = {
            id_skills: values.skills.join(","),
            location_name: values.location_name,
            location_address: values.location_address,
            location_province: values.location_province,
            title: values.title,
            job_type: values.job_type,
            detail: values.detail,
            price: values.price,
            start_date: values.work_date[0].format("YYYY-MM-DD"),
            start_time: values.work_date[0].format("HH:mm:ss"),
            end_date: values.work_date[1].format("YYYY-MM-DD"),
            end_time: values.work_date[1].format("HH:mm:ss"),
        };
        this.addJobDetail(data);
    }

    render() {
        let { isLoading, userInfo } = this.state;
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
                        <Col md={{ span: 14 }}>
                            {userInfo.approved_status == 2 ? (
                                <JobForm />
                            ) : (
                                <Result
                                    status="403"
                                    title="ท่านยังไม่ผ่านการอนุมัติบัญชี"
                                    subTitle={
                                        <span className="fs-6">
                                            เฉพาะผู้ที่ผ่านการอนุมัติบัญชีแล้วเท่านั้น
                                            จึงจะสามารถประกาศจ้างงานได้
                                        </span>
                                    }
                                    extra={
                                        <Link
                                            href={`/dashboard/account/request`}
                                        >
                                            <Button type="primary" size="large">
                                                ขออนุมัติบัญชี
                                            </Button>
                                        </Link>
                                    }
                                />
                            )}
                        </Col>
                    </Row>
                </MainLayout>
                <Loading isOpen={isLoading} />
            </>
        );
    }
}

export default HiringPage;
