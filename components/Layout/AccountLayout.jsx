import { Row, Col, Divider } from "antd";
import AccountSidebar from "../Account/AccountSidebar";

const AccountLayout = (props) => {
    const { children } = props;
    return (
        <div className="pt-3">
            <Row gutter={[25, 25]}>
                <Col xs={24} sm={24} md={6} lg={5} xl={5}>
                    <AccountSidebar />
                </Col>
                <Col xs={24} sm={24} md={18} lg={19} xl={19}>
                    <Divider orientation="center" className="mt-0">
                        <h2 className="fs-2 fw-bold my-0">{props.title}</h2>
                    </Divider>
                    <div className="pt-3">{children}</div>
                </Col>
            </Row>
        </div>
    );
};

export default AccountLayout;
