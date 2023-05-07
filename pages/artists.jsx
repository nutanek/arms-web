import React, { Component } from "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { Row, Col, Alert, Pagination } from "antd";
import { assetPrefix } from "./../next.config";
import { getMemberListApi } from "./../services/apiServices";
import MainLayout from "./../components/Layout/MainLayout";
import ArtistCard from "./../components/Artist/ArtistCard";
import Loading from "./../components/Utility/Modal/Loading";

const title = "ศิลปิน";

const pageSize = 12;

class Artists extends Component {
    state = {
        isLoading: false,
        members: [],
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
                () => this.getMemberList()
            );
        }, 300);
    }

    async getMemberList() {
        this.setState({ isLoading: true });
        try {
            let res = await getMemberListApi({
                params: {
                    page: this.state.page,
                    size: pageSize,
                    keyword: this.state.keyword,
                    request_account: 'no',
                    approved_status: 2,
                    member_type: 'employee',
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

    async onChangePage(page) {
        await Router.push(`/artists?page=${page}`);
        this.setState({ page }, () => {
            this.getMemberList();
        });
    }

    render() {
        let { isLoading, members, page, totalPage } = this.state;
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

export default Artists;
