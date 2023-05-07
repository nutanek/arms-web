import { useEffect, useState } from "react";
import Link from "next/link";
import { Modal, Tag } from "antd";
import {
    UserOutlined,
    HeartOutlined,
    BuildOutlined,
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

// const PATH_ACTIVE = {
//     userInfo: ["/account", "/account/profile", "/account/password"].map(
//         (path) => ROOT_PATH + path
//     ),
//     wishlist: ["/account/wishlist"].map((path) => ROOT_PATH + path),
//     games: ["/account/admin/games"].map((path) => ROOT_PATH + path),
// };

const AccountSidebar = (props) => {
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
        <div className="accont-sidebar">
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
                    <Tag color="#108ee9">
                        {MEMBER_TYPES[user.member_type]?.name ||
                            "ไม่ยืนยันตัวตน"}
                    </Tag>
                </div>
            </div>

            <div className="menu-list-wrapper">
                <div className="menu-list text-md ">
                    <Link href={`/dashboard/member/detail?id=${user.id}`}>
                        <div
                            className={`menu-item pointer ${
                                true ? "active" : ""
                            }`}
                        >
                            <div className="icon">
                                <UserOutlined />
                            </div>
                            <div className="text">แก้ไขโปรไฟล์</div>
                        </div>
                    </Link>
                    {["admin"].includes(user.member_type) && (
                        <Link href={`/dashboard/member/list`}>
                            <div
                                className={`menu-item pointer ${
                                    true ? "active" : ""
                                }`}
                            >
                                <div className="icon">
                                    <UserOutlined />
                                </div>
                                <div className="text">สมาชิก</div>
                            </div>
                        </Link>
                    )}
                    {!["admin"].includes(user.member_type) && (
                        <Link href={`/dashboard/account/request`}>
                            <div
                                className={`menu-item pointer ${
                                    true ? "active" : ""
                                }`}
                            >
                                <div className="icon">
                                    <UserOutlined />
                                </div>
                                <div className="text">ขออนุมัติบัญชี</div>
                            </div>
                        </Link>
                    )}
                    {["admin"].includes(user.member_type) && (
                        <Link href={`/dashboard/account/list`}>
                            <div
                                className={`menu-item pointer ${
                                    true ? "active" : ""
                                }`}
                            >
                                <div className="icon">
                                    <UserOutlined />
                                </div>
                                <div className="text">การขออนุมัติบัญชี</div>
                            </div>
                        </Link>
                    )}
                    <Link href={`/dashboard/job/list`}>
                        <div
                            className={`menu-item pointer ${
                                true ? "active" : ""
                            }`}
                        >
                            <div className="icon">
                                <UserOutlined />
                            </div>
                            <div className="text">งานที่ประกาศจ้าง</div>
                        </div>
                    </Link>
                    {["employee"].includes(user.member_type) && (
                        <Link href={`/dashboard/job/request-list`}>
                            <div
                                className={`menu-item pointer ${
                                    true ? "active" : ""
                                }`}
                            >
                                <div className="icon">
                                    <UserOutlined />
                                </div>
                                <div className="text">งานที่รับจ้าง</div>
                            </div>
                        </Link>
                    )}

                    <Link href={`/dashboard/report/list`}>
                        <div
                            className={`menu-item pointer ${
                                true ? "active" : ""
                            }`}
                        >
                            <div className="icon">
                                <UserOutlined />
                            </div>
                            <div className="text">รายงานปัญหา</div>
                        </div>
                    </Link>

                    <div
                        className="menu-item pointer"
                        onClick={() => showConfirmLogoutModal()}
                    >
                        <div className="icon">
                            <LogoutOutlined />
                        </div>
                        <div className="text">ออกจากระบบ</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSidebar;
