import { Row, Col, Divider } from "antd";
import AccountSidebar from "../Account/AccountSidebar";

const AccountLayout = (props) => {
    const { children } = props;
    return (
        <div className="pt-3">
            <Row gutter={[25, 25]}>
                <Col xs={24} sm={24} md={6} lg={4} xl={4}>
                    <AccountSidebar />
                </Col>
                <Col xs={24} sm={24} md={18} lg={20} xl={20}>
                    <Divider orientation="center">
                        <h2 className="fs-2 fw-bold my-0">{props.title}</h2>
                    </Divider>
                    <div className="pt-3">{children}</div>
                </Col>
            </Row>
        </div>
    );
};

export default AccountLayout;
