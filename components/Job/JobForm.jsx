import React, { Component } from "react";
import Router from "next/router";
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
    Modal,
    Card,
    List,
    Avatar,
    Divider,
    Upload,
    Image,
    message,
} from "antd";
import { PhoneOutlined, MailOutlined } from "@ant-design/icons";
import cloneDeep from "lodash/cloneDeep";
import dayjs from "dayjs";
import { assetPrefix } from "./../../next.config";
import { IMAGE_PATH } from "./../../constants/config";
import { provinces } from "./../../constants/provinces";
import { JOB_TYPES } from "./../../constants/appConstants";
import {
    getSkillListApi,
    getJobDetailApi,
    addJobDetailApi,
    updateJobDetailApi,
    updateJobStatusApi,
    uploadImageApi,
} from "./../../services/apiServices";
import Loading from "./../Utility/Modal/Loading";

const { RangePicker } = DatePicker;
const { Option } = Select;

class JobForm extends Component {
    state = {
        isLoadng: false,
        isSubmitted: false,
        skills: [],
        job: {},
    };

    formRef = React.createRef();

    componentDidMount() {
        this.getSkills();
        if (this.props.id) {
            this.getJobDetail(this.props.id);
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

    async getJobDetail(id) {
        this.setState({ isLoading: true });
        try {
            let job = await getJobDetailApi({ params: { id } });
            this.setState({ job });
            this.formRef.current?.setFieldsValue({
                skills: job.skills.map((skill) => skill.id),
                location_name: job.location?.name,
                location_address: job.location?.address,
                location_province: job.location?.province,
                title: job.title,
                job_type: job.job_type,
                detail: job.detail,
                price: job.price,
                work_date: [
                    dayjs(
                        `${job.start_date} ${job.start_time}`,
                        "YYYY-MM-DD HH:mm:ss"
                    ),
                    dayjs(
                        `${job.end_date} ${job.end_time}`,
                        "YYYY-MM-DD HH:mm:ss"
                    ),
                ],
            });
        } catch (error) {
        } finally {
            setTimeout(() => {
                this.setState({ isLoading: false });
            }, 300);
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
                    this.setState({ job: {} });
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

    async updateJobDetail(id, data) {
        this.setState({ isLoading: true });
        try {
            let res = await updateJobDetailApi({ params: { id }, body: data });
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

    async updateJobStatus(id, status) {
        this.setState({ isLoading: true });
        try {
            let res = await updateJobStatusApi({
                params: { id },
                body: { status },
            });
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

    async uploadImage(file, onSuccess) {
        try {
            this.setState({ isLoading: true });
            let { image } = await uploadImageApi({
                body: {
                    file,
                    width: 860,
                    height: 520,
                },
            });
            this.setState({
                isLoading: false,
            });
            onSuccess && onSuccess(image);
        } catch (error) {
            message.error(error?.message);
            this.setState({ isLoading: false });
        }
    }

    onChangeImage(info) {
        if (info.file.status !== "uploading") {
            console.log(info.fileList[0]);
            this.uploadImage(info.fileList[0].originFileObj, (image) => {
                let job = cloneDeep(this.state.job);
                job.image = image;
                this.setState({ job });
            });
        }
        if (info.file.status === "done") {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`);
        }
    }

    onSubmit(values = {}) {
        let { job } = this.state;
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
            image: job.image,
        };
        if (!job.id) {
            this.addJobDetail(data);
        } else {
            this.updateJobDetail(job.id, data);
        }
    }

    async onBack() {
        await Router.back();
    }

    render() {
        let { isLoading, job, skills } = this.state;
        return (
            <>
                {!!job.id && !!job.employee?.id && (
                    <Card
                        headStyle={{ background: "#2980b9", color: "#fff" }}
                        style={{ borderColor: "#2980b9" }}
                        title="ศิลปินผู้รับงาน"
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
                                        <div className="fs-6">
                                            {job.employee?.firstname}{" "}
                                            {job.employee?.lastname}
                                        </div>
                                    }
                                    description={
                                        <div className="fs-6">
                                            <PhoneOutlined />{" "}
                                            {job.employee?.phone_number ||
                                                "ไม่ระบุ"}{" "}
                                            <Divider type="vertical" />
                                            <MailOutlined />{" "}
                                            {job.employee?.email || "ไม่ระบุ"}
                                        </div>
                                    }
                                />
                            </List.Item>
                        </List>
                        <div className="text-end">
                            {[2].includes(job.job_status) && (
                                <Button
                                    danger
                                    type="primary"
                                    size="large"
                                    className="ms-2"
                                    onClick={() =>
                                        this.updateJobStatus(job.id, 1)
                                    }
                                >
                                    ปฎิเสธ
                                </Button>
                            )}
                            {[2].includes(job.job_status) && (
                                <Button
                                    type="primary"
                                    size="large"
                                    className="ms-2"
                                    onClick={() =>
                                        this.updateJobStatus(job.id, 3)
                                    }
                                >
                                    มอบหมายงาน
                                </Button>
                            )}
                            {[3].includes(job.job_status) && (
                                <Button
                                    type="primary"
                                    size="large"
                                    className="ms-2 bg-success"
                                    onClick={() =>
                                        this.updateJobStatus(job.id, 4)
                                    }
                                >
                                    จบงาน
                                </Button>
                            )}
                        </div>
                    </Card>
                )}
                <Form
                    ref={this.formRef}
                    layout="vertical"
                    requiredMark={true}
                    onFinish={this.onSubmit.bind(this)}
                    onSubmitCapture={() => this.setState({ isSubmitted: true })}
                    autoComplete="off"
                >
                    <Row gutter={15}>
                        <Col span={24}>
                            <Form.Item
                                label={<div className="fs-6">หัวข้อ</div>}
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
                                label={<div className="fs-6">ประเภทงาน</div>}
                                name="job_type"
                                rules={[
                                    {
                                        required: true,
                                        message: "โปรดระบุ ประเภทงาน",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="โปรดเลือกประเภทงาน"
                                    size="large"
                                >
                                    {JOB_TYPES.map((type) => (
                                        <Option key={type.id} value={type.name}>
                                            {type.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<div className="fs-6">ทักษะ</div>}
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
                                        <Option key={skill.id} value={skill.id}>
                                            {skill.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label={
                                    <div className="fs-6">รายละเอียดงาน</div>
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
                                label={<div className="fs-6">วันที่ทำงาน</div>}
                                name="work_date"
                                rules={[
                                    {
                                        required: true,
                                        message: "โปรดระบุ วันที่ทำงาน",
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
                                label={<div className="fs-6">ค่าจ้าง</div>}
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
                                    <div className="fs-6">ชื่อร้าน/สถานที่</div>
                                }
                                name="location_name"
                            >
                                <Input size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<div className="fs-6">จังหวัด</div>}
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
                                        <Option key={province} value={province}>
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
                                        message: "โปรดระบุ รายละเอียดที่อยู่",
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    rows={3}
                                    size="large"
                                ></Input.TextArea>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label={
                                    <div className="fs-6">
                                        รูปภาพประจำประกาศ
                                    </div>
                                }
                                extra="รองรับ .jpg, .jpeg และ .png ขนาดไม่เกิน 5 MB"
                                name="detail"
                            >
                                <Upload
                                    beforeUpload={() => false}
                                    accept="image/png, image/jpeg, image/jpg"
                                    fileList={[]}
                                    onChange={this.onChangeImage.bind(this)}
                                >
                                    <Button>อัปโหลดรูปภาพ</Button>
                                </Upload>
                                {job.image && (
                                    <div className="mt-3">
                                        <Image
                                            width={200}
                                            src={`${IMAGE_PATH}/${job.image}`}
                                        />
                                    </div>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify="space-between" className="pt-3">
                        <Col span={6}>
                            <Button
                                ghost
                                danger
                                type="primary"
                                size="large"
                                onClick={() => this.onBack()}
                            >
                                กลับ
                            </Button>
                        </Col>
                        <Col span={18}>
                            <div className="text-end">
                                <Button
                                    htmlType="submit"
                                    type="primary"
                                    size="large"
                                >
                                    {!!job.id ? "บันทึกข้อมูล" : "ลงประกาศ"}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>

                <Loading isOpen={isLoading} />
            </>
        );
    }
}

export default JobForm;