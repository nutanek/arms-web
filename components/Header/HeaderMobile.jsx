import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Row, Col, Menu, Button, Badge } from "antd";
import { BellOutlined, MenuOutlined } from "@ant-design/icons";
import { assetPrefix } from "./../../next.config";
import { getLocalUserInfo, isLoggedIn } from "../../services/appServices";
import MobileMenuDrawer from "./MobileMenuDrawer";

const HeaderMobile = ({ menus = [], unreadNotiCount, onViewNotification }) => {
    let [isUserLoggedIn, setIsUserLoggedIn] = useState({});
    let [isOpenMenu, setIsOpenMenu] = useState(false);

    useEffect(() => {
        setIsUserLoggedIn(isLoggedIn());
    }, []);

    return (
        <header className="header-mobile header-xs">
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
                <Col
                    className="gutter-row"
                    style={{ display: "flex", gap: "30px" }}
                >
                    {isUserLoggedIn && (
                        <div
                            className="ps-2"
                            onClick={() => onViewNotification()}
                        >
                            <Badge
                                size="small"
                                count={unreadNotiCount}
                                overflowCount={99}
                            >
                                <BellOutlined
                                    style={{ fontSize: 30, color: "#ffffff" }}
                                />
                            </Badge>
                        </div>
                    )}

                    <MenuOutlined
                        style={{ fontSize: 30, color: "#ffffff" }}
                        onClick={() => setIsOpenMenu(true)}
                    />
                </Col>
            </Row>
            <MobileMenuDrawer
                isOpen={isOpenMenu}
                onClose={() => setIsOpenMenu(false)}
            />
        </header>
    );
};

export default HeaderMobile;
