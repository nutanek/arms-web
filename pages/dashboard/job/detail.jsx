import React, { Component } from "react";
import Head from "next/head";
import Router from "next/router";
import { Row, Col, Button, Modal, Popconfirm, Tag, Card, message } from "antd";
import MainLayout from "./../../../components/Layout/MainLayout";
import AccountLayout from "./../../../components/Layout/AccountLayout";
import Loading from "./../../../components/Utility/Modal/Loading";
import JobForm from "./../../../components/Job/JobForm";

class DashboardJobDetail extends Component {
    state = {
        isLoadng: false,
        isSubmitted: false,
        jobId: 0,
        title: "",
        action: "",
    };

    formRef = React.createRef();

    componentDidMount() {
        setTimeout(() => {
            let query = Router.query;
            this.setState({
                action: query.action === "add" ? "add" : "edit",
                title: query.action == "add" ? "ประกาศจ้างงาน" : "ข้อมูลงาน",
                jobId: query.id,
            });
        }, 300);
    }

    render() {
        let { isLoading, title, action, jobId } = this.state;

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
                                {action && <JobForm id={jobId} />}
                            </Col>
                        </Row>
                    </AccountLayout>
                </MainLayout>

                <Loading isOpen={isLoading} />
            </>
        );
    }
}

export default DashboardJobDetail;
