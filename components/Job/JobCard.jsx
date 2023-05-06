import { Card, Badge, Tag, Spin } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import numeral from "numeral";
import { assetPrefix } from "./../../next.config";

const JobCard = ({ item = {}, onViewDetail }) => {
    return (
        <Wrapper text={item.location.province}>
            <Card
                className="job-item"
                bodyStyle={{ padding: "15px 10px", flex: 1 }}
                onClick={() => onViewDetail()}
                cover={
                    <div className="job-item-cover">
                        <div className="badge-promotion mb-0">
                            {item.skills &&
                                item.skills.map((skill) => (
                                    <Tag
                                        key={skill.id}
                                        color="#dc3545"
                                        className="fw-bold"
                                        style={{ borderRadius: 10 }}
                                    >
                                        {skill.name}
                                    </Tag>
                                ))}
                        </div>

                        <img
                            key={item.image}
                            src={item.image}
                            className={`card-img-top`}
                            alt={item.name}
                        />
                    </div>
                }
                actions={[
                    <div className="text-primary fw-bold">รายละเอียด</div>,
                    <div className="text-success fw-bold">รับงาน</div>,
                ]}
            >
                <div className="card-title text-center">
                    <div className="fw-bold fs-6">{item.title}</div>

                    <div>
                        <ClockCircleOutlined />{" "}
                        {moment(`${item.start_date} ${item.start_time}`).format(
                            "DD/MM/YYYY HH:mm น."
                        )}
                    </div>
                    <div className="fw-bold fs-5 text-danger">
                        {numeral(item.price).format("0,0")} บาท
                    </div>
                </div>
            </Card>
        </Wrapper>
    );
};

const Wrapper = ({ text = null, children }) =>
    text ? (
        <Badge.Ribbon text={text} color="#2980b9">
            {children}
        </Badge.Ribbon>
    ) : (
        children
    );

export default JobCard;