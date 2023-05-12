import { useState, useEffect } from "react";
import Link from "next/link";
import { Drawer, List } from "antd";
import {
    isLoggedIn as checkLoggedIn,
    getLocalUserInfo,
} from "../../services/appServices";

const data = ({ userId }) => [
    {
        title: "หน้าแรก",
        hideOnAuth: false,
        needAuth: false,
        link: `/`,
    },
    {
        title: "หางาน",
        hideOnAuth: false,
        needAuth: false,
        link: `/jobs`,
    },
    {
        title: "จ้างงาน",
        hideOnAuth: false,
        needAuth: false,
        link: `/hiring`,
    },
    {
        title: "ศิลปิน",
        hideOnAuth: false,
        needAuth: false,
        link: `/artists`,
    },
    {
        title: "เข้าสู่ระบบ",
        hideOnAuth: true,
        needAuth: false,
        link: `/signin`,
    },
    {
        title: "ลงทะเบียน",
        hideOnAuth: true,
        needAuth: false,
        link: `/signup`,
    },
    {
        title: "โปร์ไฟล์ของฉัน",
        hideOnAuth: false,
        needAuth: true,
        link: `/dashboard/member/detail?id=${userId}`,
    },
];

const MobileMenuDrawer = (props) => {
    let [user, setUser] = useState({});
    let [isLoggedin, setIsLoggedIn] = useState({});

    useEffect(() => {
        setUser(getLocalUserInfo());
        setIsLoggedIn(checkLoggedIn());
    }, []);

    return (
        <Drawer
            title="Menu"
            placement="right"
            width={300}
            onClose={() => props.onClose()}
            open={props.isOpen}
        >
            <List
                itemLayout="horizontal"
                dataSource={data({ userId: user.id })}
                renderItem={(item) => {
                    let show = false;
                    if (!item.hideOnAuth && !item.needAuth) {
                        show = true;
                    } else if (
                        item.needAuth &&
                        !item.hideOnAuth &&
                        isLoggedin
                    ) {
                        show = true;
                    } else if (!isLoggedin && item.hideOnAuth) {
                        show = true;
                    }
                    if (!show) return null;
                    return (
                        <Link href={item.link}>
                            <List.Item onClick={() => props.onClose()}>
                                <List.Item.Meta title={item.title} />
                            </List.Item>
                        </Link>
                    );
                }}
            />
        </Drawer>
    );
};

export default MobileMenuDrawer;
