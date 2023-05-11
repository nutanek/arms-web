import React, { Component } from "react";
import Router from "next/router";
import { Drawer, List, Button, Empty } from "antd";
import {
    ReloadOutlined,
    ClockCircleOutlined,
    CheckCircleTwoTone,
    ExclamationCircleTwoTone,
    BellTwoTone,
    WarningTwoTone,
    SyncOutlined,
} from "@ant-design/icons";
import { assetPrefix } from "./../../next.config";
import {
    getNotificationListApi,
    markAsReadNotificationApi,
} from "./../../services/apiServices";
import { getTimeFromNow } from "./../../services/appServices";

const pageSize = 10;

const NOTI_TYPE = {
    info: {
        icon: <BellTwoTone className="fs-4" twoToneColor="#1677ff" />,
        color: "#1677ff",
    },
    success: {
        icon: <CheckCircleTwoTone className="fs-4" twoToneColor="#389e0d" />,
        color: "#389e0d",
    },
    danger: {
        icon: (
            <ExclamationCircleTwoTone className="fs-4" twoToneColor="#cf1322" />
        ),
        color: "#cf1322",
    },
    warning: {
        icon: <WarningTwoTone className="fs-4" twoToneColor="#fa8c16" />,
        color: "#fa8c16",
    },
};

class NotificationDrawer extends Component {
    state = {
        isLoading: false,
        notis: [],
        page: 1,
        totalPage: 5,
        totalRecord: 0,
        hasLoadMore: true,
    };

    componentDidMount() {
        this.loadNotificationList();
    }

    async loadNotificationList() {
        this.setState({ isLoading: true });
        try {
            let res = await getNotificationListApi({
                params: {
                    page: this.state.page,
                    size: pageSize,
                },
            });
            this.setState({
                notis: [...this.state.notis, ...res.data],
                page: res.page + 1,
                totalPage: res.total_page,
                totalRecord: res.total_record,
                hasLoadMore: res.data.length >= pageSize,
            });
            this.props.onUpdateUnreadNotiCount(res.total_unread || 0);
        } catch (error) {
            console.log(error);
        } finally {
            setTimeout(() => {
                this.setState({ isLoading: false });
            }, 300);
        }
    }

    async afterMarkAsReadAll() {
        this.setState(
            {
                notis: [],
                page: 1,
                totalPage: 5,
                totalRecord: 0,
                hasLoadMore: true,
            },
            () => {
                this.loadNotificationList();
            }
        );
    }

    async markAsReadNotification(ids = [], readAll = false, onSuccess) {
        this.setState({ isLoading: true });
        try {
            let res = await markAsReadNotificationApi({
                body: {
                    ids: ids.join(","),
                    mark_all: readAll ? "yes" : "no",
                },
            });
            onSuccess && onSuccess();
        } catch (error) {
            console.log(error);
        } finally {
            setTimeout(() => {
                this.setState({ isLoading: false });
            }, 300);
        }
    }

    async onChangePage(page) {
        await Router.push(`/artists?page=${page}`);
        this.setState({ page }, () => {
            this.getMemberList();
        });
    }

    async onView(id, path, read) {
        if (!path) {
            return;
        }
        if (!read) {
            await this.markAsReadNotification([id]);
        }
        window.location.href = `${assetPrefix}${path}`;
    }

    render() {
        let { isLoading, notis, hasLoadMore, totalRecord } = this.state;
        let { isOpen = false, onClose } = this.props;
        return (
            <>
                <Drawer
                    title="แจ้งเตือน"
                    placement="right"
                    extra={
                        <span
                            className="text-primary pointer"
                            style={{ fontSize: 14 }}
                            onClick={() =>
                                this.markAsReadNotification([], true, () =>
                                    this.afterMarkAsReadAll()
                                )
                            }
                        >
                            เปลี่ยนเป็นอ่านแล้วทั้งหมด
                        </span>
                    }
                    bodyStyle={{ padding: 0 }}
                    open={isOpen}
                    onClose={() => onClose()}
                >
                    {totalRecord > 0 ? (
                        <>
                            <List
                                dataSource={notis}
                                renderItem={(item) => (
                                    <List.Item
                                        className="p-3 pointer"
                                        style={{
                                            background: item.mark_as_read
                                                ? "#ffffff"
                                                : "#e6f4ff",
                                            alignItems: "start",
                                        }}
                                        onClick={() =>
                                            this.onView(
                                                item.id,
                                                item.path,
                                                item.mark_as_read
                                            )
                                        }
                                    >
                                        <div className="pt-1 px-2">
                                            {NOTI_TYPE[item.type]?.icon}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div
                                                className="fs-6 fw-bold mb-2"
                                                style={{
                                                    color: NOTI_TYPE[item.type]
                                                        ?.color,
                                                }}
                                            >
                                                {item.message}
                                            </div>
                                            <div className="text-secondary">
                                                <ClockCircleOutlined className="me-2" />
                                                {getTimeFromNow(
                                                    item.create_datetime
                                                )}
                                            </div>
                                        </div>
                                    </List.Item>
                                )}
                            />
                            <div className="p-3">
                                {hasLoadMore && (
                                    <Button
                                        block
                                        size="large"
                                        icon={
                                            isLoading ? (
                                                <SyncOutlined spin />
                                            ) : (
                                                <ReloadOutlined />
                                            )
                                        }
                                        onClick={() =>
                                            this.loadNotificationList()
                                        }
                                        disabled={isLoading}
                                    >
                                        {isLoading
                                            ? "กำลังโหลด..."
                                            : "ดูเพิ่มเติม"}
                                    </Button>
                                )}
                            </div>
                        </>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                height: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Empty description="ยังไม่มีการแจ้งเตือน" />
                        </div>
                    )}
                </Drawer>
            </>
        );
    }
}

export default NotificationDrawer;
