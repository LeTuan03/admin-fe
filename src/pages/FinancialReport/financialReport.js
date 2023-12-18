import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    ShoppingOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop,
    Breadcrumb,
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal, Popconfirm,
    Row,
    Select,
    Space,
    Spin,
    Table,
    notification
} from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import campaignApi from '../../apis/campaignApi';
import financialReportApi from "../../apis/financialReportApi";
import userApi from '../../apis/userApi';
import "./financialReport.css";

const { Option } = Select;

const FinancialReport = () => {

    const [financialReport, setFinancialReport] = useState([]);
    const [campaignList, setCampaignList] = useState([]);
    const [userList, setUserList] = useState([]);

    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [user, setUser] = useState([]);

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            // Thêm kiểm tra điều kiện
            if (values.amount > values.total_expenses) {
                notification["error"]({
                    message: `Thông báo`,
                    description:
                        'Số tiền không được lớn hơn tổng số chi phí',
                });
                setLoading(false);
                return;
            }

            const financialReport = {
                "name": values.name,
                "amount": values.amount,
                "total_expenses": values.total_expenses,
                "user_id": values.user_id,
                "description": values.description,
                "created_at": values.created_at,
                "note": values.note,
                "campaign_id": values.campaign_id
            };
            return financialReportApi.createFinancialReport(financialReport).then(response => {
                console.log(response);
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo tài chính thất bại',
                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo tài chính thành công',
                    });
                    setOpenModalCreate(false);
handleCampaignList();
                    setLoading(false);
                }
            })

        } catch (error) {
            throw error;
        }
    }

    const handleUpdateCampaign = async (values) => {
        setLoading(true);
        try {
            const financialReport = {
                "name": values.name,
                "amount": values.amount,
                "total_expenses": values.total_expenses,
                "user_id": values.user_id,
                "description": values.description,
                "created_at": values.created_at,
                "note": values.note,
                "campaign_id": values.campaign_id
            };
            await financialReportApi.updateFinancialReport(financialReport, id).then(response => {
                console.log(response);
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa tài chính thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa tài chính thành công',
                    });
                    handleCampaignList();
                    setOpenModalUpdate(false);
                }
            })
            setLoading(false);

        } catch (error) {
            throw error;
        }
    }

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false)
        }
        console.log('Clicked cancel button');
    };

    const handleCampaignList = async () => {
        try {
            await financialReportApi.listFinancialReport().then((res) => {
                console.log(res);
                setFinancialReport(res);
                setLoading(false);
            });
            ;
        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        };
    }

    const handleDeleteCampaign = async (id) => {
        setLoading(true);
        try {
            await financialReportApi.deleteFinancialReport(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa tài chính thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa tài chính thành công',

                    });
                    handleCampaignList();
                    setLoading(false);
}
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleEditCampaign = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await financialReportApi.getDetailFinancialReport(id);
                setId(id);
                form2.setFieldsValue({
                    name: response.name,
                    amount: response.amount,
                    total_expenses: response.total_expenses,
                    user_id: response.user_id,
                    description: response.description,
                    created_at: dayjs(response.created_at),
                    note: response.note,
                    campaign_id: response.campaign_id,
                });
                console.log(form2);
                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    }

    const handleFilter = async (name) => {
        try {
            const res = await financialReportApi.searchFinancialReport(name);
            setFinancialReport(res);
        } catch (error) {
            console.log('search to fetch financialReport list:' + error);
        }
    }

    const [page, setPage] = useState(1);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'financialreport_id',
            key: 'financialreport_id',
            render: (value, item, index) => (
                (page - 1) * 10 + (index + 1)
            ),
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Tổng số chi phí',
            dataIndex: 'total_expenses',
            key: 'total_expenses',
        },
        {
            title: 'Người phụ trách',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (created_at) => moment(created_at).format('DD-MM-YYYY'),
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: 'Tên chiến dịch',
            dataIndex: 'campaign_name',
            key: 'campaign_name',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row style={{ display: 'flex', flexDirection: 'column' }}>
                        {user.role === 'kế toán' && (
                            <div>
<Button
                                    size="small"
                                    icon={<EditOutlined />}
                                    style={{ width: 150, borderRadius: 15, height: 30 }}
                                    onClick={() => handleEditCampaign(record.financialreport_id)}
                                >
                                    {"Chỉnh sửa"}
                                </Button>
                            </div>
                        )}
                        {user.role === 'kế toán' && (
                            <div style={{ marginTop: 10 }}>
                                <Popconfirm
                                    title="Bạn có chắc chắn xóa tài chính này?"
                                    onConfirm={() => handleDeleteCampaign(record.financialreport_id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        size="small"
                                        icon={<DeleteOutlined />}
                                        style={{ width: 150, borderRadius: 15, height: 30 }}
                                    >
                                        {"Xóa"}
                                    </Button>
                                </Popconfirm>
                            </div>
                        )}
                    </Row>
                </div>
            ),
        },
    ];

    if (user.role !== 'kế toán') {
        columns.pop();
    }


    useEffect(() => {
        (async () => {
            try {
                await financialReportApi.listFinancialReport().then((res) => {
                    console.log(res);
                    setFinancialReport(res);
                    setLoading(false);
                });

                await campaignApi.listCampaign().then((res) => {
                    console.log(res);
                    const newRes = res.filter(ele => ele.status === true)
                    setCampaignList(newRes);
                    setLoading(false);
                });;

                await userApi.listUserByAdmin().then((res) => {
                    console.log(res);
                    setUserList(res);
                    setLoading(false);
                });

                setUser(JSON.parse(localStorage.getItem("user")));



                ;
            } catch (error) {
                console.log('Failed to fetch financialReport list:' + error);
            }
        })();
    }, [])

    return (
        <div>
            <Spin spinning={loading}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb
                            items={[
                                {title: <HomeOutlined />, key: 1},
                                {title: <span>Quản lý tài chính</span>, key: 2},
                            ]}
                        >

                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14 }}
                            >
                                <Row>
                                    <Col span="18">
                                        <Input
                                            placeholder="Tìm kiếm"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                {user.role === 'kế toán' ?
                                                    <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo tài chính</Button>
                                                    : null}
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} scroll={{ x: true }}
                            pagination={{ position: ['bottom'] }} rowKey={"financialreport_id"} dataSource={financialReport} />
                    </div>
                </div>

                <Modal
                    title="Tạo tài chính mới"
                    open={openModalCreate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                form.resetFields();
                                handleOkUser(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={() => handleCancel("create")}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="name"
                            label="Tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên báo cáo tài chính" />
                        </Form.Item>
                        <Form.Item
                            name="amount"
                            label="Số tiền"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số tiền!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <InputNumber placeholder="Số tiền" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            name="total_expenses"
                            label="Tổng số chi phí"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tổng số chi phí!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <InputNumber placeholder="Tổng số chi phí" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name="user_id"
                            label="Người phụ trách"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn người phụ trách!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select style={{ width: '100%' }} tokenSeparators={[',']} placeholder="Người phụ trách" showSearch filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                                {userList.map((item, index) => {
                                    return (
                                        <Option value={item.accountId} key={item.accountId} >
{item.lastname}  {item.firstname}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Mô tả" />
                        </Form.Item>
                        <Form.Item
                            name="created_at"
                            label="Ngày tạo"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập ngày tạo!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker
                                format="DD-MM-YYYY"
                                placeholder="Chọn ngày và giờ"
                            />
                        </Form.Item>
                        <Form.Item
                            name="note"
                            label="Ghi chú"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập ghi chú!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Ghi chú" />
                        </Form.Item>

                        <Form.Item
                            name="campaign_id"
                            label="Chiến dịch"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn chiến dịch!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select style={{ width: '100%' }} tokenSeparators={[',']} placeholder="Chiến dịch" showSearch filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                                {campaignList.map((item, index) => {
                                    return (
<Option value={item.campaignId} key={item.campaignId} >
                                            {item.name}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>

                    </Form>
                </Modal>

                <Modal
                    title="Chỉnh sửa tài chính"
                    open={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateCampaign(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={handleCancel}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form2}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="name"
                            label="Tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên báo cáo tài chính" />
                        </Form.Item>
                        <Form.Item
                            name="amount"
                            label="Số tiền"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số tiền!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <InputNumber placeholder="Số tiền" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            name="total_expenses"
                            label="Tổng số chi phí"
                            rules={[
                                {
required: true,
                                    message: 'Vui lòng nhập tổng số chi phí!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <InputNumber placeholder="Tổng số chi phí" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name="user_id"
                            label="Người phụ trách"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn người phụ trách!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select style={{ width: '100%' }} tokenSeparators={[',']} placeholder="Chiến dịch" showSearch filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                                {userList.map((item, index) => {
                                    return (
                                        <Option value={item.accountId} key={item.accountId} >
                                            {item.lastname} {item.firstname}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Mô tả" />
                        </Form.Item>
                        <Form.Item
                            name="created_at"
                            label="Ngày tạo"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập ngày tạo!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker
                                format="DD-MM-YYYY"
                                placeholder="Chọn ngày và giờ"
                            />
                        </Form.Item>
                        <Form.Item
                            name="note"
label="Ghi chú"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập ghi chú!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Ghi chú" />
                        </Form.Item>

                        <Form.Item
                            name="campaign_id"
                            label="Chiến dịch"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn chiến dịch!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select style={{ width: '100%' }} tokenSeparators={[',']} placeholder="Chiến dịch" showSearch filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                                {campaignList.map((item, index) => {
                                    return (
                                        <Option value={item.campaignId} key={item.campaignId} >
                                            {item.name}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>

                    </Form>
                </Modal>

            </Spin>
        </div >
    )
}

export default FinancialReport;