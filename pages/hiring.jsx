import React, { Component } from "react";
import Head from "next/head";
import {
    Row,
    Col,
    Form,
    Input,
    InputNumber,
    DatePicker,
    Select,
    Button,
    Modal,
} from "antd";
import { provinces } from "./../constants/provinces";
import { JOB_TYPES } from "./../constants/appConstants";
import { getSkillListApi, addJobDetailApi } from "./../services/apiServices";
import MainLayout from "./../components/Layout/MainLayout";
import Loading from "./../components/Utility/Modal/Loading";

const { RangePicker } = DatePicker;
const { Option } = Select;

const title = "ประกาศจ้างงาน";

class HiringPage extends Component {
    state = {
        isLoadng: false,
        isSubmitted: false,
        skills: [],
    };

    formRef = React.createRef();

    componentDidMount() {
        this.getSkills();
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
        let { isLoading, skills } = this.state;
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
                                            <Select
                                                placeholder="โปรดเลือกประเภทงาน"
                                                size="large"
                                            >
                                                {JOB_TYPES.map((type) => (
                                                    <Option
                                                        key={type.id}
                                                        value={type.name}
                                                    >
                                                        {type.name}
                                                    </Option>
                                                ))}
                                            </Select>
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
                                            <Select
                                                placeholder="โปรดเลือกทักษะ (ได้มากกว่า 1 ตัวเลือก)"
                                                size="large"
                                                mode="tags"
                                                tokenSeparators={[", ", ","]}
                                            >
                                                {skills.map((skill) => (
                                                    <Option
                                                        key={skill.id}
                                                        value={skill.id}
                                                    >
                                                        {skill.name}
                                                    </Option>
                                                ))}
                                            </Select>
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
                                                <div className="fs-6">
                                                    ค่าจ้าง
                                                </div>
                                            }
                                            name="price"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "โปรดระบุ ค่าจ้าง",
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

                                <div className="text-center pt-3">
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
                <Loading isOpen={isLoading} />
            </>
        );
    }
}

export default HiringPage;
