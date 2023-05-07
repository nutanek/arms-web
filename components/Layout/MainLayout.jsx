import Link from "next/link";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { assetPrefix } from "./../../next.config";
import HeaderDesktop from "./../Header/HeaderDesktop";

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

const MainLayout = ({ children }) => {
    return (
        <div className="layout">
            <div>
                <HeaderDesktop menus={menus} />
            </div>
            <Content
                style={{
                    padding: "120px 15px",
                    marginLeft: "auto",
                    marginRight: "auto",
                    maxWidth: 1320,
                }}
            >
                {children}
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
};

export default MainLayout;
