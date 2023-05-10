import React, { Component } from "react";
import Head from "next/head";
import Link from "next/link";
import { Row, Col } from "antd";
import { assetPrefix } from "./../next.config";
import { getJobListApi, getMemberListApi } from "./../services/apiServices";
import MainLayout from "./../components/Layout/MainLayout";
import JobCard from "./../components/Job/JobCard";
import ArtistCard from "./../components/Artist/ArtistCard";

const title = "แพลตฟอร์มจ้างงานด้านดนตรี";

const pageSize = 4;

class Home extends Component {
    state = {
        isLoading: false,
        jobs: [],
        members: [],
    };

    componentDidMount() {
        this.getJobList();
        this.getMemberList();
    }

    async getJobList() {
        this.setState({ isLoading: true });
        try {
            let res = await getJobListApi({
                params: {
                    page: 1,
                    size: pageSize,
                    keyword: "",
                    id_employer: 0,
                    id_employee: 0,
                    status: 1,
                },
            });
            this.setState({
                jobs: res.data,
            });
        } catch (error) {
            console.log(error);
        } finally {
            setTimeout(() => {
                this.setState({ isLoading: false });
            }, 300);
        }
    }

    async getMemberList() {
        this.setState({ isLoading: true });
        try {
            let res = await getMemberListApi({
                params: {
                    page: 1,
                    size: pageSize,
                    keyword: "",
                    request_account: "no",
                    approved_status: 2,
                    member_type: "employee",
                },
            });
            this.setState({
                members: res.data,
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

    render() {
        let { isLoading, jobs = [], members = [] } = this.state;
        return (
            <>
                <Head>
                    <title>{title}</title>
                    <meta name="description" content={title} />
                </Head>
                <MainLayout>
                    <style jsx global>{`
                        .header-lg {
                            background: none !important;
                            box-shadow: none !important;
                        }
                        .header-lg {
                            position: unset;
                        }
                        .hero-banner::after {
                            background-image: url(${assetPrefix}/images/header-divider.svg);
                        }
                    `}</style>

                    <div
                        className="hero-banner background"
                        style={{
                            backgroundImage: `url(${assetPrefix}/images/bg-hero.jpeg)`,
                        }}
                    >
                        {Array.from(Array(100), (_, index) => index + 1).map(
                            (index) => (
                                <span key={index}></span>
                            )
                        )}
                    </div>

                    <div className="hero-banner-text text-center">
                        <div className="mb-2">
                            <img
                                src={`${assetPrefix}/images/logo-lg.png`}
                                width={200}
                                alt="logo"
                            />
                        </div>
                        <h1 className="page-title fs-1 text-center fw-bold text-white mt-0 mb-4">
                            {title}
                        </h1>
                    </div>

                    <Row
                        justify="space-between"
                        align="middle"
                        className="mb-4"
                    >
                        <Col>
                            <h2 className="page-title fs-2 fw-bold my-0">
                                งานจ้าง
                            </h2>
                        </Col>
                        <Col>
                            <div className="fs-6">
                                <Link href="/jobs" className="text-primary">
                                    ดูทั้งหมด
                                </Link>
                            </div>
                        </Col>
                    </Row>
                    {isLoading && (
                        <div className="text-center">กำลังโหลด...</div>
                    )}
                    <Row
                        gutter={[
                            { xs: 8, sm: 16, md: 24, lg: 32 },
                            { xs: 16, sm: 16, md: 24, lg: 32 },
                        ]}
                        className="mb-5"
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

                    <Row
                        justify="space-between"
                        align="middle"
                        className="mb-4"
                    >
                        <Col>
                            <h2 className="page-title fs-2 fw-bold my-0">
                                ศิลปิน
                            </h2>
                        </Col>
                        <Col>
                            <div className="fs-6">
                                <Link href="/artists" className="text-primary">
                                    ดูทั้งหมด
                                </Link>
                            </div>
                        </Col>
                    </Row>
                    {isLoading && (
                        <div className="text-center">กำลังโหลด...</div>
                    )}
                    <Row
                        gutter={[
                            { xs: 8, sm: 16, md: 24, lg: 32 },
                            { xs: 16, sm: 16, md: 24, lg: 32 },
                        ]}
                    >
                        {members.map((member) => (
                            <Col
                                key={member.id}
                                xs={{ span: 12 }}
                                md={{ span: 8 }}
                                lg={{ span: 6 }}
                            >
                                <ArtistCard item={member} />
                            </Col>
                        ))}
                    </Row>
                </MainLayout>
            </>
        );
    }
}

export default Home;
