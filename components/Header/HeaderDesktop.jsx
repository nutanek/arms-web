import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Row, Col, Menu, Button } from "antd";
import { assetPrefix } from "./../../next.config";
import { getLocalUserInfo, isLoggedIn } from "../../services/appServices";

const HeaderDesktop = ({ menus = [] }) => {
    let [user, setUser] = useState({});
    let [isUserLoggedIn, setIsUserLoggedIn] = useState({});

    useEffect(() => {
        setUser(getLocalUserInfo());
        setIsUserLoggedIn(isLoggedIn());
    }, []);

    return (
        <header className="header-lg">
            <Row
                style={{ width: "100%" }}
                align="middle"
                justify="space-between"
            >
                <Col className="gutter-row" span={6}>
                    <div className="logo">
                        <Link href="/">
                            <img
                                src={`${assetPrefix}/images/logo.png`}
                                height={50}
                                alt="logo"
                            />
                        </Link>
                    </div>
                </Col>
                <Col className="gutter-row">
                    <Row justify="end" align="middle">
                        <Col className="gutter-row">
                            <div className="menu-container">
                                {menus.map((menu) => (
                                    <div key={menu.key} className="menu-item">
                                        {menu.label}
                                    </div>
                                ))}
                            </div>
                            {/* <Menu
                                selectedKeys={["home"]}
                                mode="horizontal"
                                items={menus.map((menu) => ({
                                    ...menu,
                                    label: (
                                        <div className="menu-item">
                                            {menu.label}
                                        </div>
                                    ),
                                }))}
                                className="menu-container"
                                style={{
                                    borderBottom: "none",
                                    justifyContent: "flex-end",
                                }}
                            /> */}
                        </Col>
                        <Col>
                            {isUserLoggedIn ? (
                                <Link href={`/dashboard/member/detail?id=${user.id}`}>
                                    <Button ghost type="default" size="large">
                                        โปรไฟล์ของฉัน
                                    </Button>
                                </Link>
                            ) : (
                                <Link href={`/signin`}>
                                    <Button ghost type="default" size="large">
                                        เข้าสู่ระบบ/ลงทะเบียน
                                    </Button>
                                </Link>
                            )}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </header>
    );
};

export default HeaderDesktop;
