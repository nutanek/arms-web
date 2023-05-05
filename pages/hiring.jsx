import React, { Component } from "react";
import Head from "next/head";
import Link from "next/link";
import {
    Row,
    Col,
    Form,
    Input,
    InputNumber,
    DatePicker,
    Select,
    Button,
} from "antd";
import { assetPrefix } from "./../next.config";
import { provinces } from "./../constants/provinces";
import MainLayout from "./../components/Layout/MainLayout";
import JobCard from "./../components/Job/JobCard";

const { RangePicker } = DatePicker;
const { Option } = Select;

const title = "ประกาศจ้างงาน";

class HiringPage extends Component {
    state = {
        isSubmitted: false,
    };

    formRef = React.createRef();

    componentDidMount() {}

    onSubmit(values) {
        let data = {};

        console.log(values)

        let dataStr = JSON.stringify(data);

        // if (this.props.type === "ADD") {
        //     this.addGame(dataStr, () => {
        //         this.props.navigate &&
        //             this.props.navigate(`${ROOT_PATH}/account/admin/games`);
        //     });
        // } else if (this.props.type === "EDIT") {
        //     this.updateGame(dataStr, () => {
        //         this.props.navigate &&
        //             this.props.navigate(`${ROOT_PATH}/account/admin/games`);
        //     });
        // }
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
                    <Row justify="center">
                        <Col md={{ span: 15 }}>
                            <Form
                                ref={this.formRef}
                                layout="vertical"
                                requiredMark={true}
                                onFinish={this.onSubmit.bind(this)}
                                onSubmitCapture={() =>
                                    this.setState({ isSubmitted: true })
                                }
                                autoComplete="off"
                            >
                                <Row gutter={15}>
                                    <Col span={24}>
                                        <Form.Item
                                            label={
                                                <div className="fs-6">
                                                    หัวข้อ
                                                </div>
                                            }
                                            name="title"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "โปรดระบุ หัวข้อ",
                                                },
                                            ]}
                                        >
                                            <Input size="large" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={
                                                <div className="fs-6">
                                                    ประเภทงาน
                                                </div>
                                            }
                                            name="job_type"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "โปรดระบุ ประเภทงาน",
                                                },
                                            ]}
                                        >
                                            <Input size="large" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={
                                                <div className="fs-6">
                                                    ทักษะ
                                                </div>
                                            }
                                            name="skills"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "โปรดระบุ ทักษะ",
                                                },
                                            ]}
                                        >
                                            <Input size="large" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label={
                                                <div className="fs-6">
                                                    รายละเอียดงาน
                                                </div>
                                            }
                                            name="detail"
                                        >
                                            <Input.TextArea
                                                rows={3}
                                                size="large"
                                            ></Input.TextArea>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={
                                                <div className="fs-6">
                                                    วันที่ทำงาน
                                                </div>
                                            }
                                            name="work_date"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "โปรดระบุ วันที่ทำงาน",
                                                },
                                            ]}
                                        >
                                            <RangePicker
                                                showTime
                                                size="large"
                                                format="DD/MM/YYYY HH:mm"
                                                placeholder={[
                                                    "วันเริ่มงาน",
                                                    "วันสิ้นสุดงาน",
                                                ]}
                                                style={{ width: "100%" }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={
                                                <div className="fs-6">ค่าจ้าง</div>
                                            }
                                            name="price"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "โปรดระบุ ค่าจ้าง",
                                                },
                                            ]}
                                        >
                                            <InputNumber
                                                min={0}
                                                addonAfter="บาท"
                                                size="large"
                                                style={{ width: "100%" }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={
                                                <div className="fs-6">
                                                    ชื่อร้าน/สถานที่
                                                </div>
                                            }
                                            name="location_name"
                                        >
                                            <Input size="large" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={
                                                <div className="fs-6">
                                                    จังหวัด
                                                </div>
                                            }
                                            name="location_province"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "โปรดระบุ จังหวัด",
                                                },
                                            ]}
                                        >
                                            <Select
                                                placeholder="โปรดเลือกจังหวัด"
                                                size="large"
                                            >
                                                {provinces.map((province) => (
                                                    <Option
                                                        key={province}
                                                        value={province}
                                                    >
                                                        {province}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label={
                                                <div className="fs-6">
                                                    รายละเอียดที่อยู่
                                                </div>
                                            }
                                            name="location_address"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "โปรดระบุ รายละเอียดที่อยู่",
                                                },
                                            ]}
                                        >
                                            <Input.TextArea
                                                rows={3}
                                                size="large"
                                            ></Input.TextArea>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <div className="text-center">
                                    <Button
                                        htmlType="submit"
                                        type="primary"
                                        size="large"
                                    >
                                        ลงประกาศ
                                        {/* {this.props.type === "ADD"
                                            ? T("SUBMIT")
                                            : T("SAVE_CHANGES")} */}
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </MainLayout>
            </>
        );
    }
}

export default HiringPage;
