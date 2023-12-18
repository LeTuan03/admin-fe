import { CheckCircleOutlined, CopyOutlined, PlusOutlined, StopOutlined } from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import { BackTop, Button, Card, Col, Input, Popconfirm, Row, Space, Spin, Table, Tag, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import userApi from "../../apis/userApi";
import "./accountManagement.css";

const AccountManagement = () => {

    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [selectedInput, setSelectedInput] = useState();
    const [currentUser, setCurrentUser] = useState();

    const history = useHistory();

    const titleCase = (str) => {
        var splitStr = str?.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'accountId',
            key: 'accountId',
        },
        {
            title: 'Tên',
            dataIndex: 'firstname',
            key: 'firstname',
            render: (text, record) => (
                <Space size="middle">
                    {
                        text == null || text == undefined ? "" :
                            <span style={{ margin: 0 }}>{titleCase(record.lastname) + " " + titleCase(text)}</span>
                    }
                </Space>
            ),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },

        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Chức vụ',
            dataIndex: 'roleName',
            key: 'roleName',
            width: '12%',
            render: (text, record) => (
                <Space size="middle">
                    {
                        <Tag color="blue" key={text} style={{ width: 180, textAlign: "center" }} icon={<CopyOutlined />}>
                            {titleCase(text)}
                        </Tag>
                    }

                </Space>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => (
                <Space size="middle">
                    {
                        text === 0 ? (
                            <Tag color="red" key={text} style={{ width: 180, textAlign: "center" }}>
                                Đã chặn
                            </Tag>
                        ) : (
<Tag color="green" key={text} style={{ width: 180, textAlign: "center" }}>
                                Hoạt động
                            </Tag>
                        )
                    }
                </Space>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>
                        {record.status == 0 ? <Popconfirm
                            title="Bạn muốn mở chặn tài khoản này?"
                            onConfirm={() => handleUnBanAccount(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                size="small"
                                icon={<CheckCircleOutlined />}
                                style={{ width: 160, borderRadius: 15, height: 30 }}
                            >{"Mở chặn tài khoản"}
                            </Button>
                        </Popconfirm> : <Popconfirm
                            title="Bạn muốn chặn tài khoản này?"
                            onConfirm={() => handleBanAccount(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                size="small"
                                icon={<StopOutlined />}
                                style={{ width: 160, borderRadius: 15, height: 30 }}
                            >{"Chặn tài khoản"}
                            </Button>
                        </Popconfirm>}
                    </Row>

                </div >
            ),
        },
    ];

    const handleListUser = async () => {
        try {
            const response = await userApi.listUserByAdmin();
            console.log(response);
            setUser(response);
            setLoading(false);
        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleUnBanAccount = async (data) => {
        console.log(data);
        console.log(currentUser);

        if (data.accountId === currentUser.userId) {
            notification["error"]({
                message: `Thông báo`,
                description:
                    'Bạn không được thực hiện ở tài khoản này!',

            });
            return;
        }
        try {
            await userApi.unBanAccount(data).then(response => {
                if (response.message === "Email already exists") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Mở khóa thất bại',

                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
description:
                            'Mở khóa thành công',

                    });
                    handleListUser();
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleBanAccount = async (data) => {
        console.log(data);
        if (data.accountId === currentUser.userId) {
            notification["error"]({
                message: `Thông báo`,
                description:
                    'Bạn không được thực hiện ở tài khoản này!',

            });
            return;
        }
        try {
            await userApi.banAccount(data).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chặn thất bại',

                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chặn thành công',

                    });
                    handleListUser();
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleCreateAccount = () => {
        history.push("/account-create")
    }

    const handleFilterEmail = async (email) => {
        try {
            const response = await userApi.searchUser(email);
            setUser(response);
        } catch (error) {
            console.log('search to fetch user list:' + error);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await userApi.listUserByAdmin();
                setUser(response);
                setLoading(false);

                setCurrentUser(JSON.parse(localStorage.getItem("user")));

            } catch (error) {
                console.log('Failed to fetch user list:' + error);
            }
        })();
        window.scrollTo(0, 0);

    }, [])
    return (
        <div>
            <Spin spinning={loading}>
                <div id="account">
                    <div id="account_container">
                        <PageHeader
                            subTitle=""
                            style={{ fontSize: 14, paddingTop: 20, paddingBottom: 20 }}
                        >
                            <Row>
                                <Col span="12">
                                    <Input
                                        placeholder="Tìm kiếm"
                                        allowClear
                                        style={{ width: 300 }}
                                        onChange={handleFilterEmail}
                                        value={selectedInput}
/>
                                </Col>
                                <Col span="12">
                                    <Row justify="end">
                                        <Button style={{ marginLeft: 10 }} icon={<PlusOutlined />} size="middle" onClick={() => handleCreateAccount()}>{"Tạo tài khoản"}</Button>
                                    </Row>
                                </Col>
                            </Row>

                        </PageHeader>
                    </div>
                </div>
                <div style={{ marginTop: 20, marginRight: 5, overflowX: 'auto' }}>
                    <div id="account">
                        <div id="account_container">
                            <Card title="Quản lý tài khoản" bordered={false} >
                                <Table
                                    columns={columns}
                                    dataSource={user}
                                    rowKey={"accountId"}
                                    pagination={{ position: ['bottom'] }}
                                    scroll={{ x: true }}
                                />
                            </Card>
                        </div>
                    </div>
                </div>


            </Spin>
        </div>
    )
}

export default AccountManagement;