import React, { Component } from "react";
import Head from "next/head";
import Link from "next/link";
import { Row, Col, Alert } from "antd";
import { assetPrefix } from "./../next.config";
import MainLayout from "./../components/Layout/MainLayout";
import JobCard from "./../components/Job/JobCard";

const title = "หางาน";

class Home extends Component {
    state = {
        jobs: [],
        page: 1,
        totalPage: 5,
    };

    componentDidMount() {
        this.getJobs();
    }

    getJobs() {
        let data = {
            data: [
                {
                    id: 1,
                    image: "https://image.cnbcfm.com/api/v1/image/105444004-1536674877622gettyimages-634807612.jpeg?v=1536674964&w=929&h=523&vtcrop=y",
                    title: "รับนักร้องด่วน!",
                    detail: "สถานที่ ร้าน R&D รังสิต",
                    job_type: "งานทดแทน",
                    start_date: "2023-02-22",
                    start_time: "08:26:57",
                    end_date: "2023-02-22",
                    end_time: "18:26:57",
                    price: "3000",
                    job_status: 1,
                    member: {
                        id: 1,
                        firstname: "aaa",
                        lastname: "aaa",
                    },
                    skills: [
                        {
                            id: 1,
                            name: "นักร้อง",
                        },
                        {
                            id: 2,
                            name: "มือกลอง",
                        },
                    ],
                    location: {
                        id: 1,
                        name: "ครัวลั่นทุง",
                        address:
                            "399 ซอย รังสิต-นครนายก 30 ตำบล ประชาธิปัตย์ อำเภอธัญบุรี ปทุมธานี 12130",
                        province: "ปทุมธานี",
                    },
                },
            ],
            total_page: 5,
            page: 1,
        };

        data.data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
            (id) => ({ ...data.data[0], id })
        );

        this.setState({
            jobs: data.data,
            page: data.page,
            totalPage: data.total_page,
        });
    }

    render() {
        let { jobs, page, totalPage } = this.state;
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
                        gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 16, sm: 16, md: 24, lg: 32 }]}
                    >
                        {jobs.map((job) => (
                            <Col key={job.id} xs={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                                <JobCard item={job} onViewDetail={() => {}} />
                            </Col>
                        ))}
                    </Row>
                </MainLayout>
            </>
        );
    }
}

export default Home;
