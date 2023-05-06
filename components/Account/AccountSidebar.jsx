import Link from "next/link";
import { Modal } from "antd";
import {
    UserOutlined,
    HeartOutlined,
    BuildOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { getLocalUserInfo, signout } from "./../../services/appServices";
// import { IMAGE_PATH, ROOT_PATH, USER_ROLE } from "../../constants/appConstants";

const { confirm } = Modal;

// const PATH_ACTIVE = {
//     userInfo: ["/account", "/account/profile", "/account/password"].map(
//         (path) => ROOT_PATH + path
//     ),
//     wishlist: ["/account/wishlist"].map((path) => ROOT_PATH + path),
//     games: ["/account/admin/games"].map((path) => ROOT_PATH + path),
// };

const AccountSidebar = (props) => {
    // const user = getLocalUserInfo();
    let user = {};

    // function showConfirmLogoutModal() {
    //     confirm({
    //         title: T("CONFIRM_LOGOUT"),
    //         centered: true,
    //         maskClosable: true,
    //         okText: T("OK"),
    //         cancelText: T("CANCEL"),
    //         onOk() {
    //             signout({ isCallback: true });
    //         },
    //         onCancel() {},
    //     });
    // }

    return (
        <div className="accont-sidebar">
            <div className="profile">
                <div className="avatar-wrapper">
                    <div className="avatar">
                        {/* <img
                            src={
                                user.image
                                    ? `${IMAGE_PATH}/users/${user.image}`
                                    : `${ROOT_PATH}/images/no-avatar.png`
                            }
                            alt="user"
                        /> */}
                    </div>
                </div>
                <div className="display-name text-lg text-bold">
                    {user.display_name}
                </div>
                {/* {user.role === "admin" && (
                    <div className="role-label text-xs text-bold">Admin</div>
                )} */}
            </div>

            <div className="menu-list-wrapper">
                <div className="menu-list text-md ">
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
                    <Link href={`/dashboard/account/list`}>
                        <div
                            className={`menu-item pointer ${
                                true ? "active" : ""
                            }`}
                        >
                            <div className="icon">
                                <UserOutlined />
                            </div>
                            <div className="text">รายการขออนุมัติบัญชี</div>
                        </div>
                    </Link>
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
                        // onClick={() => showConfirmLogoutModal()}
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
