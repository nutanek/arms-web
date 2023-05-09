import React, { Component } from "react";
import { Form, Button, Select, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { addSkillListApi } from "./../../services/apiServices";
import Loading from "./../Utility/Modal/Loading";

class SkillAddModal extends Component {
    state = {
        isLoading: false,
        isOpen: false,
    };

    formRef = React.createRef();

    componentDidMount() {}

    async addSkillList(data) {
        this.setState({ isLoading: true });
        try {
            let res = await addSkillListApi({
                body: data,
            });
            message.success("เพิ่มทักษะเรียบร้อยแล้ว");
            this.setState(
                {
                    isOpen: false,
                },
                () => {
                    this.props.onSuccess && this.props.onSuccess(res.ids);
                }
            );
        } catch (error) {
            message.error("เพิ่มทักษะไม่สำเร็จ");
            console.log(error);
        } finally {
            setTimeout(() => {
                this.setState({ isLoading: false });
            }, 300);
        }
    }

    toggleModal(status) {
        this.setState({ isOpen: status });
    }

    onSubmit(values = {}) {
        let data = {
            skills: values.skills.join(","),
        };
        this.addSkillList(data);
    }

    render() {
        let { isLoading, isOpen } = this.state;
        return (
            <>
                <div
                    className="text-primary pointer mt-1"
                    onClick={() => this.toggleModal(true)}
                >
                    <PlusOutlined /> เพิ่มทักษะอื่นๆ
                </div>
                <Modal
                    title="เพิ่มทักษะอื่นๆ"
                    open={isOpen}
                    onCancel={() => this.toggleModal(false)}
                    footer={false}
                    destroyOnClose
                >
                    <Form
                        ref={this.formRef}
                        layout="vertical"
                        requiredMark={false}
                        onFinish={this.onSubmit.bind(this)}
                        autoComplete="off"
                    >
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
                                placeholder="กรอกทักษะที่ต้องการ (ได้มากกว่า 1 ทักษะ)"
                                size="large"
                                mode="tags"
                                tokenSeparators={[", ", ","]}
                                dropdownStyle={{ display: "none" }}
                            >
                                {/* {[].map((skill) => (
                                    <Option key={skill.id} value={skill.id}>
                                        {skill.name}
                                    </Option>
                                ))} */}
                            </Select>
                        </Form.Item>
                        <div className="text-end mt-2">
                            <Button
                                danger
                                size="large"
                                onClick={() => this.toggleModal(false)}
                            >
                                ยกเลิก
                            </Button>
                            <Button
                                htmlType="submit"
                                size="large"
                                type="primary"
                                className="ms-2"
                            >
                                ยืนยัน
                            </Button>
                        </div>
                    </Form>
                </Modal>

                <Loading isOpen={isLoading} />
            </>
        );
    }
}

export default SkillAddModal;
