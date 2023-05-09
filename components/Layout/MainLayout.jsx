import { Component } from "react";
import Link from "next/link";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { assetPrefix } from "./../../next.config";
import HeaderDesktop from "./../Header/HeaderDesktop";
import HeaderMobile from "./../Header/HeaderMobile";
import NotificationDrawer from "./../Notification/NotificationDrawer";

const { Header, Content, Footer } = Layout;

const menus = [
    {
        label: <Link href="/">หางาน</Link>,
        key: "home",
    },
    {
        label: <Link href="/hiring">จ้างงาน</Link>,
        key: "hiring",
    },
    {
        label: <Link href="/artists">ศิลปิน</Link>,
        key: "artists",
    },
];

class MainLayout extends Component {
    state = {
        isOpenNotificationDrawer: false,
        unreadNotiCount: 0,
    };

    toggleNotificationDrawer(status) {
        this.setState({ isOpenNotificationDrawer: status });
    }

    onUpdateUnreadNotiCount(count) {
        this.setState({ unreadNotiCount: count });
    }

    render() {
        let { isOpenNotificationDrawer, unreadNotiCount } = this.state;
        return (
            <div className="layout">
                <div>
                    <HeaderDesktop
                        menus={menus}
                        unreadNotiCount={unreadNotiCount}
                        onViewNotification={() =>
                            this.toggleNotificationDrawer(true)
                        }
                    />
                    <HeaderMobile
                        menus={menus}
                        unreadNotiCount={unreadNotiCount}
                        onViewNotification={() =>
                            this.toggleNotificationDrawer(true)
                        }
                    />
                </div>
                <NotificationDrawer
                    isOpen={isOpenNotificationDrawer}
                    onClose={() => this.toggleNotificationDrawer(false)}
                    onUpdateUnreadNotiCount={this.onUpdateUnreadNotiCount.bind(
                        this
                    )}
                />
                <Content
                    style={{
                        padding: "120px 15px",
                        marginLeft: "auto",
                        marginRight: "auto",
                        maxWidth: 1320,
                    }}
                >
                    {this.props.children}
                </Content>
                <Footer
                    style={{
                        textAlign: "center",
                    }}
                >
                    Copyright ©2023. Artist Record Management System
                </Footer>
            </div>
        );
    }
}

export default MainLayout;
