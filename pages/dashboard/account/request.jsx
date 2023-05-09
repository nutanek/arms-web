import React, { Component } from "react";
import Head from "next/head";
import Router from "next/router";
import {
    Row,
    Col,
    Form,
    Upload,
    Radio,
    Button,
    Modal,
    Image,
    Alert,
    message,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { IMAGE_PATH } from "./../../../constants/config";
import {
    requestMemberAccountApi,
    uploadImageApi,
} from "./../../../services/apiServices";
import MainLayout from "./../../../components/Layout/MainLayout";
import AccountLayout from "./../../../components/Layout/AccountLayout";
import Loading from "./../../../components/Utility/Modal/Loading";

const title = "ขออนุมัติบัญชี";

class DashboardAccountRequest extends Component {
    state = {
        isLoadng: false,
        isSubmitted: false,
        image: "",
    };

    formRef = React.createRef();

    async requestMemberAccount(data) {
        this.setState({ isLoading: true });
        try {
            let res = await requestMemberAccountApi({ body: data });
            Modal.success({
                title: "สำเร็จ",
                content: res.message,
                centered: true,
                maskClosable: true,
                okText: "ตกลง",
                afterClose: () => {
                    this.formRef.current.resetFields();
                    this.setState({ image: "" });
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

    async uploadImage(file, onSuccess) {
        try {
            this.setState({ isLoading: true });
            let { image } = await uploadImageApi({
                body: {
                    file,
                    real_size: true,
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
                this.setState({ image });
            });
        }
        if (info.file.status === "done") {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`);
        }
    }

    onSubmit(values = {}) {
        let { image } = this.state;
        if (!image) {
            message.warning("โปรดอัปโหลดรูปภาพ");
            return;
        }
        let data = {
            member_type: values.member_type,
            image,
        };

        this.requestMemberAccount(data);
    }

    async onBack() {
        await Router.back();
    }

    render() {
        let { isLoading } = this.state;

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
                                    requiredMark={false}
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
                                                        ประเภทสมาชิก
                                                    </div>
                                                }
                                                name="member_type"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "โปรดระบุ ประเภทสมาชิก",
                                                    },
                                                ]}
                                            >
                                                <Radio.Group>
                                                    <Radio
                                                        value="employee"
                                                        className="fs-6"
                                                    >
                                                        ศิลปิน
                                                    </Radio>
                                                    <Radio
                                                        value="employer"
                                                        className="fs-6"
                                                    >
                                                        ผู้ว่าจ้าง
                                                    </Radio>
                                                </Radio.Group>
                                            </Form.Item>
                                        </Col>
                                        <Col span={24}>
                                            <Form.Item
                                                label={
                                                    <div className="fs-6">
                                                        รูปภาพตนเองคู่กับบัตรประชาชน
                                                    </div>
                                                }
                                                name="image"
                                            >
                                                <Upload.Dragger
                                                    beforeUpload={() => false}
                                                    accept="image/png, image/jpeg, image/jpg"
                                                    fileList={[]}
                                                    onChange={this.onChangeImage.bind(
                                                        this
                                                    )}
                                                >
                                                    <p className="ant-upload-drag-icon">
                                                        <InboxOutlined />
                                                    </p>
                                                    <p className="ant-upload-text">
                                                        คลิกหรือวางรูปภาพที่นี่
                                                    </p>
                                                    <p className="ant-upload-hint">
                                                        รองรับไฟล์ประเภท .jpeg,
                                                        .jpg และ .png
                                                        <br />
                                                        ขนาดไม่เกิน 5 MB
                                                    </p>
                                                </Upload.Dragger>
                                            </Form.Item>
                                        </Col>
                                        {this.state.image && (
                                            <Col span={24}>
                                                <Form.Item
                                                    label={
                                                        <div className="fs-6">
                                                            ตัวอย่างรูปภาพ
                                                        </div>
                                                    }
                                                    name="image"
                                                >
                                                    <Image
                                                        width={200}
                                                        src={`${IMAGE_PATH}/${this.state.image}`}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        )}
                                    </Row>

                                    <Alert
                                        description="ทาง ARMS จะไม่นำข้อมูลในรูปภาพบัตรประชาชนที่ส่งมาไปใช้เพื่อวัตถุประสงค์อื่นๆ นอกจากเพื่อยืนยันตัวตน และจะทำการลบรูปออกจากระบบภายใน 15 วัน"
                                        type="info"
                                        showIcon
                                    />

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
                                                    ส่งคำขอ
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

export default DashboardAccountRequest;
