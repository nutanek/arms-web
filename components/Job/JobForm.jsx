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
    Rate,
    Alert,
    message,
    Tag,
} from "antd";
import { PhoneOutlined, MailOutlined, StarOutlined } from "@ant-design/icons";
import cloneDeep from "lodash/cloneDeep";
import dayjs from "dayjs";
import moment from "moment";
import numeral from "numeral";
import { assetPrefix } from "./../../next.config";
import { IMAGE_PATH } from "./../../constants/config";
import { provinces } from "./../../constants/provinces";
import {
    getSkillListApi,
    getFeeListApi,
    getBankAccountListApi,
    getJobDetailApi,
    addJobDetailApi,
    updateJobDetailApi,
    updateJobStatusApi,
    uploadImageApi,
    updateJobRatingApi,
} from "./../../services/apiServices";
import { getLocalUserInfo } from "../../services/appServices";
import Loading from "./../Utility/Modal/Loading";
import SkillAddModal from "./../Skill/SkillAddModal";
import { JOB_STATUS } from "@/constants/appConstants";

const { RangePicker } = DatePicker;
const { Option } = Select;

const expiryPaymentLiftTime = 48;

class JobForm extends Component {
    state = {
        isLoadng: false,
        isSubmitted: false,
        isOpenModalRating: false,
        skills: [],
        fees: [],
        bankAccounts: [],
        job: {
            price: 0,
            service_charge: {
                id: 0,
            },
            bank_account: {
                id: 0,
            },
            employee_rating: 0,
        },
        tempRating: 0,
    };

    formRef = React.createRef();

    componentDidMount() {
        this.getSkills();
        this.getFees();
        this.getBankAccounts();
        if (this.props.id) {
            this.getJobDetail(this.props.id);
        }
    }

    async getSkills() {
        try {
            let skills = await getSkillListApi();
            this.setState({ skills });
        } catch (error) {}
    }

    async getFees() {
        try {
            let userInfo = getLocalUserInfo();
            let res = await getFeeListApi({ params: { page: 1, size: 999 } });
            let fees = res.data || [];
            if (userInfo.member_type == "employer")
                fees = fees.filter(
                    (fee) => fee.service_charge_type !== "งานจ้างทดแทน"
                );
            this.setState({ fees });
        } catch (error) {}
    }

    async getBankAccounts() {
        try {
            let res = await getBankAccountListApi({
                params: { page: 1, size: 999 },
            });
            let bankAccounts = res.data || [];
            this.setState({ bankAccounts });
        } catch (error) {}
    }

    async getJobDetail(id) {
        this.setState({ isLoading: true });
        try {
            let job = await getJobDetailApi({ params: { id } });
            this.setState({ job, tempRating: job.employee_rating });
            this.formRef.current?.setFieldsValue({
                skills: job.skills.map((skill) => skill.id),
                location_name: job.location?.name,
                location_address: job.location?.address,
                location_province: job.location?.province,
                title: job.title,
                id_service_charge: job.service_charge?.id,
                detail: job.detail,
                price: job.price,
                id_bank_account: job.bank_account?.id || null,
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
            setTimeout(() => {
                this.setState({ isLoading: false });
            }, 300);
        }
    }

    async updateJobStatus(id, status) {
        this.setState({ isLoading: true });
        try {
            let res = await updateJobStatusApi({
                params: { id },
                body: { status },
            });
            if (status == 4) {
                this.toggleModalRating(true);
            } else {
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
            }
        } catch (error) {
            Modal.error({
                title: "ไม่สำเร็จ",
                content: error?.message,
                centered: true,
                maskClosable: true,
                okText: "ตกลง",
            });
        } finally {
            setTimeout(() => {
                this.setState({ isLoading: false });
            }, 300);
        }
    }

    async updateJobRating(jobId) {
        this.setState({ isLoading: true });
        try {
            await updateJobRatingApi({
                params: { id: jobId },
                body: { rating: this.state.tempRating },
            });
            this.toggleModalRating(false);
            this.showThankyouModal();
        } catch (error) {
            Modal.error({
                title: "ไม่สำเร็จ",
                content: error?.message,
                centered: true,
                maskClosable: true,
                okText: "ตกลง",
            });
        } finally {
            setTimeout(() => {
                this.setState({ isLoading: false });
            }, 300);
        }
    }

    showThankyouModal() {
        let { job } = this.state;
        Modal.success({
            title: "กราบขอบพระคุณที่ใช้บริการ ARMS",
            content:
                "หวังเป็นอย่างยิ่งว่าท่านจะประทับใจ และกลับมาใช้บริการอีกครั้ง",
            centered: true,
            maskClosable: true,
            okText: "ตกลง",
            onCancel: () => this.getJobDetail(job.id),
            onOk: () => this.getJobDetail(job.id),
        });
    }

    async uploadImage(file, isRealSize = false, onSuccess) {
        try {
            this.setState({ isLoading: true });
            let body = {
                file,
                width: 860,
                height: 520,
            };
            if (isRealSize) {
                body.real_size = isRealSize;
            }
            let { image } = await uploadImageApi({
                body,
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

    onChangeImage(info, key, isRealSize) {
        if (info.file.status !== "uploading") {
            console.log(info.fileList[0]);
            this.uploadImage(
                info.fileList[0].originFileObj,
                isRealSize,
                (image) => {
                    let job = cloneDeep(this.state.job);
                    job[key] = image;
                    this.setState({ job });
                }
            );
        }
        if (info.file.status === "done") {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`);
        }
    }

    onChangeServiceCharge(id) {
        let job = cloneDeep(this.state.job);
        if (job.service_charge) {
            job.service_charge.id = id;
        }
        this.setState({ job });
    }

    onChangeBankAccount(id) {
        let job = cloneDeep(this.state.job);
        if (job.bank_account) {
            job.bank_account.id = id;
        }
        this.setState({ job });
    }

    onChangePrice(price) {
        let job = cloneDeep(this.state.job);
        job.price = price;
        this.setState({ job });
    }

    calculatePyment(price = 0, serviceChargeId) {
        let fees = cloneDeep(this.state.fees);
        let serviceCharge = fees.find((item) => item.id == serviceChargeId);
        let feePercentage = serviceCharge?.fee || 0;
        let feeFixed = (price * feePercentage) / 100.0;
        return {
            totalPrice: price + feeFixed,
            price,
            feeFixed,
            feePercentage,
        };
    }

    onSubmit(values = {}) {
        let { job } = this.state;

        if (!!job.bank_account?.id && !job.payment_image) {
            message.warning("กรุณาอัปโหลดหลักฐานการชำระเงิน");
            return;
        }

        if (!!job.payment_image && !job.bank_account?.id) {
            message.warning("กรุณาเลือกธนาคารปลายทาง");
            return;
        }

        let data = {
            id_skills: values.skills.join(","),
            location_name: values.location_name,
            location_address: values.location_address,
            location_province: values.location_province,
            title: values.title,
            id_service_charge: values.id_service_charge,
            detail: values.detail,
            price: values.price,
            start_date: values.work_date[0].format("YYYY-MM-DD"),
            start_time: values.work_date[0].format("HH:mm:ss"),
            end_date: values.work_date[1].format("YYYY-MM-DD"),
            end_time: values.work_date[1].format("HH:mm:ss"),
            image: job.image,
            payment_image: job.payment_image,
            id_bank_account: values.id_bank_account,
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

    onSuccessAddSkills(ids = []) {
        this.getSkills();
    }

    confirmRejectRequestJob(jobId) {
        Modal.confirm({
            title: "ท่านยืนยันที่จะปฏิเสธการขอรับงานนี้ใช่ไหม?",
            okText: "ยืนยัน",
            cancelText: "ยกเลิก",
            centered: true,
            onOk: () => this.updateJobStatus(jobId, 1),
        });
    }

    confirmApproveRequestJob(jobId) {
        Modal.confirm({
            title: "ท่านยืนยันที่จะมอบหมายงานให้ศิลปินท่านนี้ใช่ไหม?",
            okText: "ยืนยัน",
            cancelText: "ยกเลิก",
            centered: true,
            onOk: () => this.updateJobStatus(jobId, 3),
        });
    }

    confirmFinishJob(jobId) {
        Modal.confirm({
            title: "ท่านยืนยันที่จะจบงานนี้ใช่ไหม?",
            okText: "ยืนยัน",
            cancelText: "ยกเลิก",
            centered: true,
            onOk: () => this.updateJobStatus(jobId, 4),
        });
    }

    confirmCancelJob(jobId) {
        let { job } = this.state;
        Modal.confirm({
            title: "ท่านยืนยันที่จะยกเลิกงานนี้ใช่ไหม?",
            content:
                job.job_status != 8
                    ? "หากท่านทำการยกเลิก ท่านจะไม่สามารถรับเงินค่าธรรมเนียมคืนได้"
                    : null,
            okText: "ยืนยัน",
            cancelText: "ยกเลิก",
            centered: true,
            onOk: () => this.updateJobStatus(jobId, 5),
        });
    }

    toggleModalRating(status) {
        this.setState({ isOpenModalRating: status });
    }

    onChangeRating(rating) {
        this.setState({ tempRating: rating });
    }

    render() {
        let {
            isLoading,
            job,
            skills,
            fees,
            bankAccounts,
            tempRating,
            isOpenModalRating,
        } = this.state;

        let payment = this.calculatePyment(job.price, job.service_charge?.id);
        let jobStatus = JOB_STATUS[job.job_status] || {};
        let bankAccount = bankAccounts.find(
            (bank) => bank.id == job.bank_account?.id
        );
        let expiryPaymentDate = !!job.create_datetime
            ? moment(job.create_datetime)
                  .add(expiryPaymentLiftTime, "hours")
                  .format("DD/MM/YYYY HH:mm น.")
            : "";

        return (
            <>
                {!!job.id && (
                    <Alert
                        description={
                            <div className="fs-6">
                                <b>สถานะของงาน: </b>
                                <Tag color={jobStatus.color}>
                                    {jobStatus.name}
                                </Tag>
                            </div>
                        }
                        type="info"
                        className="mb-3"
                    />
                )}

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
                                                job.employee?.image
                                                    ? `${IMAGE_PATH}/${job.employee?.image}`
                                                    : `${assetPrefix}/images/no-avatar.png`
                                            }
                                            style={{
                                                width: 50,
                                                height: 50,
                                            }}
                                        />
                                    }
                                    title={
                                        <Link
                                            href={`/member?id=${job.employee?.id}`}
                                            target="_blank"
                                        >
                                            <div className="fs-6 text-primary">
                                                {job.employee?.firstname}{" "}
                                                {job.employee?.lastname}
                                            </div>
                                        </Link>
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
                                        this.confirmRejectRequestJob(job.id)
                                    }
                                >
                                    ปฏิเสธ
                                </Button>
                            )}
                            {[2].includes(job.job_status) && (
                                <Button
                                    type="primary"
                                    size="large"
                                    className="ms-2"
                                    onClick={() =>
                                        this.confirmApproveRequestJob(job.id)
                                    }
                                >
                                    มอบหมายงาน
                                </Button>
                            )}
                            {[3].includes(job.job_status) && (
                                <Button
                                    type="primary"
                                    size="large"
                                    className="ms-2"
                                    onClick={() =>
                                        this.confirmFinishJob(job.id)
                                    }
                                >
                                    จบงาน
                                </Button>
                            )}
                            {[4].includes(job.job_status) &&
                                (job.employee_rating == 0 ? (
                                    <Button
                                        ghost
                                        type="primary"
                                        size="large"
                                        className="ms-2"
                                        icon={<StarOutlined />}
                                        onClick={() =>
                                            this.toggleModalRating(true)
                                        }
                                    >
                                        ให้คะแนนศิลปิน
                                    </Button>
                                ) : (
                                    <div>
                                        <Rate
                                            value={job.employee_rating}
                                            disabled
                                        />
                                        <span className="ms-2 fs-6 fw-bold">
                                            ({job.employee_rating}/5)
                                        </span>
                                    </div>
                                ))}
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
                                name="id_service_charge"
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
                                    onChange={this.onChangeServiceCharge.bind(
                                        this
                                    )}
                                >
                                    {fees.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.service_charge_type}{" "}
                                            (ค่าธรรมเนียม {item.fee}%)
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<div className="fs-6">ทักษะ</div>}
                                name="skills"
                                className="mb-0"
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
                                    mode="multiple"
                                    allowClear
                                >
                                    {skills.map((skill) => (
                                        <Option key={skill.id} value={skill.id}>
                                            {skill.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <SkillAddModal
                                onSuccess={this.onSuccessAddSkills.bind(this)}
                            />
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
                                    onChange={this.onChangePrice.bind(this)}
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
                            >
                                <Upload
                                    beforeUpload={() => false}
                                    accept="image/png, image/jpeg, image/jpg"
                                    fileList={[]}
                                    onChange={(e) =>
                                        this.onChangeImage(e, "image", false)
                                    }
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
                        <Col span={24}>
                            <Card
                                type="inner"
                                title="การชำระเงิน"
                                headStyle={{
                                    background: "#389e0d",
                                    color: "#ffffff",
                                }}
                                style={{
                                    borderColor: "#389e0d",
                                }}
                                bordered
                            >
                                <Row justify="space-between">
                                    <Col xs={24} lg={10}>
                                        <div className="fs-5 fw-bold">
                                            ยอดชำระ:{" "}
                                            <span className="text-success">
                                                {numeral(
                                                    payment.totalPrice
                                                ).format("0,0[.]00")}{" "}
                                                บาท
                                            </span>
                                        </div>
                                        <div>
                                            ค่าจ้าง:{" "}
                                            {numeral(payment.price).format(
                                                "0,0[.]00"
                                            )}{" "}
                                            บาท
                                        </div>
                                        <div>
                                            ค่าธรรมเนียม:{" "}
                                            {numeral(payment.feeFixed).format(
                                                "0,0[.]00"
                                            )}{" "}
                                            บาท ({payment.feePercentage}%)
                                        </div>
                                        {(!job.job_status ||
                                            job.job_status == 8) && (
                                            <Alert
                                                className="my-3 p-3"
                                                showIcon
                                                type="warning"
                                                description={`กรุณาชำระเงินภายใน ${
                                                    job.create_datetime
                                                        ? expiryPaymentDate
                                                        : `${expiryPaymentLiftTime} ชม.`
                                                } เพื่อไม่ให้ประกาศของท่านถูกยกเลิก`}
                                            />
                                        )}
                                        <Alert
                                            className="my-3 p-3"
                                            showIcon
                                            type="warning"
                                            description="หากมีการยกเลิกงานภายหลัง
                                                จะไม่สามารถรับค่าธรรมเนียมคืนได้"
                                        />
                                    </Col>
                                    <Col xs={24} lg={12}>
                                        <Card>
                                            <Form.Item
                                                label={
                                                    <div className="fs-6 fw-bold">
                                                        ธนาคารปลายทาง
                                                    </div>
                                                }
                                                name="id_bank_account"
                                            >
                                                <Select
                                                    placeholder="โปรดเลือกธนาคารปลายทาง"
                                                    size="large"
                                                    onChange={this.onChangeBankAccount.bind(
                                                        this
                                                    )}
                                                >
                                                    {bankAccounts.map(
                                                        (item) => (
                                                            <Option
                                                                key={item.id}
                                                                value={item.id}
                                                            >
                                                                {item.bank_name}
                                                            </Option>
                                                        )
                                                    )}
                                                </Select>
                                            </Form.Item>
                                            {!!job.bank_account?.id && (
                                                <Card
                                                    className="mb-3 fs-6"
                                                    style={{
                                                        borderColor: "#0d6efd",
                                                    }}
                                                >
                                                    <div className="mb-1">
                                                        <b>ธนาคาร: </b>
                                                        {bankAccount?.bank_name}
                                                    </div>
                                                    <div className="mb-1">
                                                        <b>เลขบัญชี: </b>
                                                        {
                                                            bankAccount?.account_number
                                                        }
                                                    </div>
                                                    <div>
                                                        <b>ชื่่อบัญชี: </b>
                                                        {
                                                            bankAccount?.account_name
                                                        }
                                                    </div>
                                                </Card>
                                            )}

                                            <Form.Item
                                                label={
                                                    <div className="fs-6 fw-bold">
                                                        ใบเสร็จ/หลักฐานการชำระเงิน{" "}
                                                        <span
                                                            className="fw-light"
                                                            style={{
                                                                color: "#ff0000",
                                                            }}
                                                        >
                                                            *
                                                        </span>
                                                    </div>
                                                }
                                                extra="รองรับ .jpg, .jpeg และ .png ขนาดไม่เกิน 5 MB"
                                            >
                                                <Upload
                                                    beforeUpload={() => false}
                                                    accept="image/png, image/jpeg, image/jpg"
                                                    fileList={[]}
                                                    onChange={(e) =>
                                                        this.onChangeImage(
                                                            e,
                                                            "payment_image",
                                                            true
                                                        )
                                                    }
                                                >
                                                    <Button>
                                                        อัปโหลดรูปภาพ
                                                    </Button>
                                                </Upload>
                                                {job.payment_image && (
                                                    <div className="mt-3">
                                                        <Image
                                                            width={"100%"}
                                                            src={`${IMAGE_PATH}/${job.payment_image}`}
                                                        />
                                                    </div>
                                                )}
                                            </Form.Item>
                                        </Card>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>

                    <Row justify="space-between" className="pt-4">
                        <Col span={6}>
                            <Button
                                type="primary"
                                size="large"
                                className="btn-primary"
                                onClick={() => this.onBack()}
                            >
                                กลับ
                            </Button>
                        </Col>
                        <Col span={18}>
                            {![4, 5, 7].includes(job.job_status) && (
                                <div className="text-end">
                                    {!!job.id && (
                                        <Button
                                            danger
                                            type="primary"
                                            size="large"
                                            className="ms-2"
                                            onClick={() =>
                                                this.confirmCancelJob(job.id)
                                            }
                                        >
                                            ยกเลิกงาน
                                        </Button>
                                    )}
                                    <Button
                                        htmlType="submit"
                                        type="primary"
                                        size="large"
                                        className="ms-2"
                                    >
                                        {!!job.id ? "บันทึกข้อมูล" : "ลงประกาศ"}
                                    </Button>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Form>

                <Modal
                    open={isOpenModalRating}
                    centered
                    okText="ยืนยัน"
                    cancelText="ไม่ใช่ตอนนี้"
                    okButtonProps={{ size: "large", disabled: tempRating == 0 }}
                    cancelButtonProps={{ size: "large" }}
                    onOk={() => this.updateJobRating(job.id)}
                    onCancel={() => {
                        this.onChangeRating(job.employee_rating);
                        this.toggleModalRating(false);
                        if (job.job_status !== 4) {
                            this.showThankyouModal();
                        }
                    }}
                >
                    <div className="mt-3 text-center fs-5 fw-bold">
                        กรุณาให้คะแนนการทำงานของศิลปิน
                    </div>
                    <div className="text-center py-3">
                        <Rate
                            value={tempRating}
                            className="fs-1"
                            onChange={this.onChangeRating.bind(this)}
                        />
                    </div>
                </Modal>

                <Loading isOpen={isLoading} />
            </>
        );
    }
}

export default JobForm;
