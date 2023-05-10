import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Modal, Tag, Card } from "antd";
import {
    TeamOutlined,
    FileProtectOutlined,
    RedEnvelopeOutlined,
    NotificationOutlined,
    PayCircleOutlined,
    PushpinOutlined,
    AlertOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import {
    getLocalUserInfo,
    isLoggedIn,
    signout,
} from "./../../services/appServices";
import { assetPrefix } from "../../next.config";
import { IMAGE_PATH } from "../../constants/config";
import { MEMBER_TYPES } from "../../constants/appConstants";

const { confirm } = Modal;

const PATH_ACTIVE = {
    member: ["/dashboard/member/list", "/dashboard/member/detail"],
    account: [
        "/dashboard/account/list",
        "/dashboard/account/detail",
        "/dashboard/account/request",
    ],
    payment: ["/dashboard/payment/list", "/dashboard/payment/detail"],
    jobEmployer: ["/dashboard/job/list", "/dashboard/job/detail"],
    jobEmployee: ["/dashboard/job/request-list"],
    fee: ["/dashboard/fee/list", "/dashboard/fee/detail"],
    report: ["/dashboard/report/list", "/dashboard/report/detail"],
};

const AccountSidebar = (props) => {
    const router = useRouter();
    const currentRoute = router.pathname;

    let [user, setUser] = useState({});

    useEffect(() => {
        const user = getLocalUserInfo();
        if (!isLoggedIn()) {
            window.location.replace(`${assetPrefix}/`);
        } else {
            setUser(user);
        }
    }, []);

    function showConfirmLogoutModal() {
        confirm({
            title: "ต้องการออกจากระบบใช่ไหม?",
            centered: true,
            maskClosable: true,
            okText: "ยืนยัน",
            cancelText: "ยกเลิก",
            onOk() {
                signout();
            },
            onCancel() {},
        });
    }

    return (
        <Card className="accont-sidebar">
            <div className="profile">
                <div className="avatar-wrapper">
                    <div className="avatar">
                        <img
                            src={
                                user.image
                                    ? `${IMAGE_PATH}/${user.image}`
                                    : `${assetPrefix}/images/no-avatar.png`
                            }
                            alt="user"
                        />
                    </div>
                </div>
                <div className="display-name text-lg text-bold">
                    {user.display_name}
                </div>
                <div className="text-center">
                    ประเภท:{" "}
                    <Tag color="#108ee9">
                        {MEMBER_TYPES[user.member_type]?.name ||
                            "ไม่ยืนยันตัวตน"}
                    </Tag>
                </div>
            </div>

            <div className="menu-list-wrapper">
                <div className="menu-list text-md ">
                    {["admin"].includes(user.member_type) && (
                        <Link href={`/dashboard/member/list`}>
                            <div
                                className={`menu-item pointer ${
                                    PATH_ACTIVE.member.includes(currentRoute)
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <div className="icon">
                                    <TeamOutlined />
                                </div>
                                <div className="text">สมาชิก</div>
                            </div>
                        </Link>
                    )}
                    {!["admin"].includes(user.member_type) && (
                        <Link href={`/dashboard/account/request`}>
                            <div
                                className={`menu-item pointer ${
                                    PATH_ACTIVE.account.includes(currentRoute)
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <div className="icon">
                                    <FileProtectOutlined />
                                </div>
                                <div className="text">ขออนุมัติบัญชี</div>
                            </div>
                        </Link>
                    )}
                    {["admin"].includes(user.member_type) && (
                        <Link href={`/dashboard/account/list`}>
                            <div
                                className={`menu-item pointer ${
                                    PATH_ACTIVE.account.includes(currentRoute)
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <div className="icon">
                                    <FileProtectOutlined />
                                </div>
                                <div className="text">อนุมัติบัญชี</div>
                            </div>
                        </Link>
                    )}
                    {["admin"].includes(user.member_type) && (
                        <Link href={`/dashboard/payment/list`}>
                            <div
                                className={`menu-item pointer ${
                                    PATH_ACTIVE.payment.includes(currentRoute)
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <div className="icon">
                                    <RedEnvelopeOutlined />
                                </div>
                                <div className="text">อนุมัติการชำระเงิน</div>
                            </div>
                        </Link>
                    )}
                    {["admin", "employer", "employeee"].includes(
                        user.member_type
                    ) && (
                        <Link href={`/dashboard/job/list`}>
                            <div
                                className={`menu-item pointer ${
                                    PATH_ACTIVE.jobEmployer.includes(
                                        currentRoute
                                    )
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <div className="icon">
                                    <NotificationOutlined />
                                </div>
                                <div className="text">งานที่ประกาศจ้าง</div>
                            </div>
                        </Link>
                    )}
                    {["employee"].includes(user.member_type) && (
                        <Link href={`/dashboard/job/request-list`}>
                            <div
                                className={`menu-item pointer ${
                                    PATH_ACTIVE.jobEmployee.includes(
                                        currentRoute
                                    )
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <div className="icon">
                                    <PushpinOutlined />
                                </div>
                                <div className="text">งานที่รับจ้าง</div>
                            </div>
                        </Link>
                    )}
                    {["admin"].includes(user.member_type) && (
                        <Link href={`/dashboard/fee/list`}>
                            <div
                                className={`menu-item pointer ${
                                    PATH_ACTIVE.fee.includes(currentRoute)
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <div className="icon">
                                    <PayCircleOutlined />
                                </div>
                                <div className="text">ค่าธรรมเนียม</div>
                            </div>
                        </Link>
                    )}
                    <Link href={`/dashboard/report/list`}>
                        <div
                            className={`menu-item pointer ${
                                PATH_ACTIVE.report.includes(currentRoute)
                                    ? "active"
                                    : ""
                            }`}
                        >
                            <div className="icon">
                                <AlertOutlined />
                            </div>
                            <div className="text">รายงานปัญหา</div>
                        </div>
                    </Link>

                    <div
                        className="menu-item pointer text-danger"
                        onClick={() => showConfirmLogoutModal()}
                    >
                        <div className="icon">
                            <LogoutOutlined />
                        </div>
                        <div className="text">ออกจากระบบ</div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default AccountSidebar;
