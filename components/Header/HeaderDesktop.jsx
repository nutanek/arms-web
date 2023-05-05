import Link from "next/link";
import Image from "next/image";
import { Row, Col, Menu } from "antd";
import { assetPrefix } from "./../../next.config";

const HeaderDesktop = ({ menus = [] }) => {
    return (
        <header className="header-lg">
            <Row style={{ width: "100%" }} align="middle">
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
                <Col className="gutter-row" span={18}>
                    <Row justify="end">
                        <Col className="gutter-row" span={24}>
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
                    </Row>
                </Col>
            </Row>
        </header>
    );
};

export default HeaderDesktop;
