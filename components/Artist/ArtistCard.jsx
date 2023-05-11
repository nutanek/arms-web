import Link from "next/link";
import { Row, Col, Card, Badge, Tag } from "antd";
import { StarFilled } from "@ant-design/icons";
import numeral from "numeral";
import { assetPrefix } from "./../../next.config";
import { IMAGE_PATH } from "./../../constants/config";

const ArtistCard = ({ item = {} }) => {
    return (
        <Link href={`/member?id=${item.id}`}>
            <Card
                className="job-item"
                bodyStyle={{ padding: "15px 10px", flex: 1 }}
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
                            src={
                                item.image
                                    ? `${IMAGE_PATH}/${item.image}`
                                    : `${assetPrefix}/images/no-avatar.png`
                            }
                            className={`card-img-top`}
                            alt={item.name}
                        />
                    </div>
                }
            >
                <div className="card-title text-center">
                    <div className="fw-bold fs-6">
                        {item.firstname} {item.lastname}
                    </div>
                </div>
                <Row className="mt-3">
                    <Col span={12}>
                        <StarFilled style={{ color: "#ffcc00" }} />{" "}
                        <span className="text-secondary">
                            {item.rating > 0 ? (
                                <b>{numeral(item.rating).format("0[.]0")}</b>
                            ) : (
                                "ยังไม่มีคะแนน"
                            )}
                        </span>
                    </Col>
                    <Col span={12} className="text-end">
                        <span className="text-secondary">
                            {item.success_count} งาน
                        </span>
                    </Col>
                </Row>
            </Card>
        </Link>
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

export default ArtistCard;
