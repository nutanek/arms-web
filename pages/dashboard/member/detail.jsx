import React, { Component } from "react";
import Head from "next/head";
import Router from "next/router";
import {
    Row,
    Col,
    Form,
    Input,
    DatePicker,
    Select,
    Button,
    Modal,
    Divider,
    Upload,
    Card,
    message,
} from "antd";
import dayjs from "dayjs";
import cloneDeep from "lodash/cloneDeep";
import { assetPrefix } from "./../../../next.config";
import { GENDERS } from "./../../../constants/appConstants";
import { IMAGE_PATH } from "./../../../constants/config";
import {
    getSkillListApi,
    getMemberDetailApi,
    addMemberDetailApi,
    updateMemberDetailApi,
    uploadImageApi,
} from "./../../../services/apiServices";
import {
    getLocalUserInfo,
    setLocalUserInfo,
} from "./../../../services/appServices";
getLocalUserInfo;
import MainLayout from "./../../../components/Layout/MainLayout";
import AccountLayout from "./../../../components/Layout/AccountLayout";
import SkillAddModal from "./../../../components/Skill/SkillAddModal";
import Loading from "./../../../components/Utility/Modal/Loading";

const { Option } = Select;

let title = "ข้อมูลสมาชิก";

class DashboardMemberDetail extends Component {
    state = {
        isLoadng: false,
        isSubmitted: false,
        skills: [],
        action: "",
        member: {},
        title,
    };

    formRef = React.createRef();

    componentDidMount() {
        this.getSkills();
        setTimeout(() => {
            let query = Router.query;
            this.setState(
                {
                    action: query.action === "add" ? "add" : "edit",
                    title:
                        query.action == "add"
                            ? "เพิ่มข้อมูลสมาชิกใหม่"
                            : "แก้ไขข้อมูลสมาชิก",
                },
                () => {
                    if (query.id) {
                        this.getMemberDetail(query.id);
                    } else {
                        this.formRef.current.resetFields();
                    }
                }
            );
        }, 300);
    }

    async getSkills() {
        try {
            let skills = await getSkillListApi();
            this.setState({ skills });
        } catch (error) {}
    }

    async getMemberDetail(id) {
        this.setState({ isLoading: true });
        try {
            let member = await getMemberDetailApi({ params: { id } });
            this.setState({ member });
            this.formRef.current?.setFieldsValue({
                member_email: member.email,
                member_password: member.password,
                member_confirm_password: member.password,
                firstname: member.firstname,
                lastname: member.lastname,
                phone_number: member.phone_number,
                birthdate: dayjs(member.birthdate, "YYYY-MM-DD"),
                gender: member.gender,
                skills: member.skills.map((skill) => skill.id),
            });
        } catch (error) {
        } finally {
            setTimeout(() => {
                this.setState({ isLoading: false });
            }, 300);
        }
    }

    async addMemberDetail(data) {
        this.setState({ isLoading: true });
        try {
            let res = await addMemberDetailApi({ body: data });
            Modal.success({
                title: "สำเร็จ",
                content: res.message,
                centered: true,
                maskClosable: true,
                okText: "ตกลง",
                afterClose: () => {
                    this.formRef.current.resetFields();
                    this.setState({ member: {} });
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

    async updateMemberDetail(data) {
        let { member } = this.state;
        this.setState({ isLoading: true });
        try {
            let res = await updateMemberDetailApi({
                params: { id: member.id },
                body: data,
            });
            Modal.success({
                title: "สำเร็จ",
                content: res.message,
                centered: true,
                maskClosable: true,
                okText: "ตกลง",
                afterClose: () => {
                    let user = getLocalUserInfo();
                    user.image = member.image;
                    setLocalUserInfo(user);
                    this.getMemberDetail(member.id);
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

    onSuccessAddSkills(ids = []) {
        this.getSkills();
    }

    onSubmit(values = {}) {
        let { action, member } = this.state;
        let data = {
            id_skills: values.skills.join(","),
            email: values.member_email,
            password: values.member_password,
            gender: values.gender,
            birthdate: values.birthdate.format("YYYY-MM-DD"),
            phone_number: values.phone_number,
            firstname: values.firstname,
            lastname: values.lastname,
            image: member.image,
        };

        if (action === "add") {
            this.addMemberDetail(data);
        } else if (action === "edit") {
            this.updateMemberDetail(data);
        }
    }

    async onBack() {
        await Router.back();
    }

    async uploadImage(file, onSuccess) {
        try {
            this.setState({ isLoading: true });
            let { image } = await uploadImageApi({
                body: {
                    file,
                    width: 450,
                    height: 450,
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
                let member = cloneDeep(this.state.member);
                member.image = image;
                this.setState({ member });
            });
        }
        if (info.file.status === "done") {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`);
        }
    }

    render() {
        let { isLoading, skills, action, title, member = {} } = this.state;

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
                                <Form
                                    ref={this.formRef}
                                    name="info_form"
                                    layout="vertical"
                                    requiredMark={true}
                                    onFinish={this.onSubmit.bind(this)}
                                    onSubmitCapture={() =>
                                        this.setState({ isSubmitted: true })
                                    }
                                    autoComplete="off"
                                >
                                    <Row gutter={15} className="mb-3">
                                        <Col
                                            className="member-profile"
                                            span={24}
                                        >
                                            <div className="avatar-wrapper">
                                                <div className="avatar">
                                                    <img
                                                        src={
                                                            member.image
                                                                ? `${IMAGE_PATH}/${member.image}`
                                                                : `${assetPrefix}/images/no-avatar.png`
                                                        }
                                                        alt="user"
                                                    />
                                                </div>
                                            </div>
                                            <Upload
                                                beforeUpload={() => false}
                                                accept="image/png, image/jpeg, image/jpg"
                                                fileList={[]}
                                                onChange={this.onChangeImage.bind(
                                                    this
                                                )}
                                            >
                                                <Button className="mt-3">
                                                    อัปโหลดรูปภาพ
                                                </Button>
                                            </Upload>
                                        </Col>
                                    </Row>

                                    <Divider
                                        orientation="left"
                                        className="fw-bold"
                                    >
                                        ข้อมูลเข้าสู่ระบบ
                                    </Divider>
                                    <Row gutter={15} className="pb-3">
                                        <Col span={24}>
                                            <Form.Item
                                                label={
                                                    <div className="fs-6">
                                                        อีเมล
                                                    </div>
                                                }
                                                name="member_email"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "โปรดระบุ อีเมล",
                                                    },
                                                    {
                                                        type: "email",
                                                        message:
                                                            "รูปแบบอีเมลไม่ถูกต้อง",
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    size="large"
                                                    name="member_email"
                                                    autoComplete="off"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="member_password"
                                                label={
                                                    <div className="fs-6">
                                                        รหัสผ่าน
                                                    </div>
                                                }
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "โปรดระบุ รหัสผ่าน",
                                                    },
                                                    {
                                                        min: 8,
                                                        message:
                                                            "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
                                                    },
                                                ]}
                                            >
                                                <Input.Password
                                                    name="member_password"
                                                    size="large"
                                                    autoComplete="off"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="member_confirm_password"
                                                label={
                                                    <div className="fs-6">
                                                        ยืนยันรหัสผ่าน
                                                    </div>
                                                }
                                                hasFeedback
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "โปรดยืนยัน รหัสผ่าน",
                                                    },
                                                    ({ getFieldValue }) => ({
                                                        validator(_, value) {
                                                            if (
                                                                !value ||
                                                                getFieldValue(
                                                                    "member_password"
                                                                ) === value
                                                            ) {
                                                                return Promise.resolve();
                                                            }
                                                            return Promise.reject(
                                                                new Error(
                                                                    "รหัสผ่านทั้งคู่ไม่ตรงกัน"
                                                                )
                                                            );
                                                        },
                                                    }),
                                                ]}
                                            >
                                                <Input.Password
                                                    name="member_password"
                                                    size="large"
                                                    autoComplete="off"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Divider
                                        orientation="left"
                                        className="fw-bold"
                                    >
                                        ข้อมูลส่วนตัว
                                    </Divider>
                                    <Row gutter={15}>
                                        <Col span={12}>
                                            <Form.Item
                                                label={
                                                    <div className="fs-6">
                                                        ชื่อ
                                                    </div>
                                                }
                                                name="firstname"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "โปรดระบุ ชื่อ",
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
                                                        นามสกุล
                                                    </div>
                                                }
                                                name="lastname"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "โปรดระบุ นามสกุล",
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
                                                        เพศ
                                                    </div>
                                                }
                                                name="gender"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "โปรดระบุ เพศ",
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    placeholder="โปรดเลือกเพศ"
                                                    size="large"
                                                >
                                                    {GENDERS.map((gender) => (
                                                        <Option
                                                            key={gender.id}
                                                            value={gender.key}
                                                        >
                                                            {gender.name}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label={
                                                    <div className="fs-6">
                                                        วันเกิด
                                                    </div>
                                                }
                                                name="birthdate"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "โปรดระบุ วันเกิด",
                                                    },
                                                ]}
                                            >
                                                <DatePicker
                                                    size="large"
                                                    format="DD/MM/YYYY"
                                                    placeholder="โปรดเลือกวันเกิด"
                                                    style={{
                                                        width: "100%",
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label={
                                                    <div className="fs-6">
                                                        เบอร์โทร
                                                    </div>
                                                }
                                                name="phone_number"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "โปรดระบุ เบอร์โทร",
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
                                            >
                                                <Select
                                                    placeholder="โปรดเลือกทักษะ (ได้มากกว่า 1 ตัวเลือก)"
                                                    size="large"
                                                    mode="multiple"
                                                    all
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
                                                <SkillAddModal
                                                    onSuccess={this.onSuccessAddSkills.bind(
                                                        this
                                                    )}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row
                                        justify="space-between"
                                        className="pt-3"
                                    >
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
                                                    บันทึกข้อมูล
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                    </AccountLayout>
                </MainLayout>
                <Loading isOpen={isLoading} />
            </>
        );
    }
}

export default DashboardMemberDetail;
