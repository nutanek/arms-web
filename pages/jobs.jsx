import React, { Component } from "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { Row, Col, Alert, Pagination } from "antd";
import { assetPrefix } from "./../next.config";
import { getJobListApi } from "./../services/apiServices";
import MainLayout from "./../components/Layout/MainLayout";
import JobCard from "./../components/Job/JobCard";
import Loading from "./../components/Utility/Modal/Loading";

const title = "หางาน";

const pageSize = 12;

class Jobs extends Component {
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
        this.setState({ isLoading: true });
        try {
            let res = await getJobListApi({
                params: {
                    page: this.state.page,
                    size: pageSize,
                    keyword: this.state.keyword,
                    id_employer: 0,
                    id_employee: 0,
                    status: 1,
                },
            });
            this.setState({
                jobs: res.data,
                page: res.page,
                totalPage: res.total_page,
            });
        } catch (error) {
            console.log(error);
        } finally {
            setTimeout(() => {
                this.setState({ isLoading: false });
            }, 300);
        }
    }

    async onChangePage(page) {
        await Router.push(`/jobs?page=${page}`);
        this.setState({ page }, () => {
            this.getJobList();
        });
    }

    render() {
        let { isLoading, jobs, page, totalPage } = this.state;
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
                    <Row
                        // style={{ width: "100%" }}
                        gutter={[
                            { xs: 8, sm: 16, md: 24, lg: 32 },
                            { xs: 16, sm: 16, md: 24, lg: 32 },
                        ]}
                    >
                        {jobs.map((job) => (
                            <Col
                                key={job.id}
                                xs={{ span: 12 }}
                                md={{ span: 8 }}
                                lg={{ span: 6 }}
                            >
                                <JobCard item={job} onViewDetail={() => {}} />
                            </Col>
                        ))}
                    </Row>

                    <div className="text-center mt-5">
                        <Pagination
                            current={page}
                            pageSize={pageSize}
                            total={totalPage * pageSize}
                            onChange={this.onChangePage.bind(this)}
                        />
                    </div>
                </MainLayout>

                <Loading isOpen={isLoading} />
            </>
        );
    }
}

export default Jobs;
