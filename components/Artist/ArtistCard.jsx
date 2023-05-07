import Link from "next/link";
import { Card, Badge, Tag, Spin } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import numeral from "numeral";
import { assetPrefix } from "./../../next.config";
import { IMAGE_PATH } from "./../../constants/config";

const ArtistCard = ({ item = {} }) => {
    return (
        <Link href={`/member?id=${item.id}`} target="_blank">
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