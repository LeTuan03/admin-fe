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
import donorApi from "../../apis/donorApi";
import userApi from '../../apis/userApi';
import "./donorManagement.css";
const { Option } = Select;

const DonorManagement = () => {

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
            const financialReport = {
                "name": values.name,
                "amount": values.amount,
                "donate_date": values.donate_date,
                "description": values.description,
                "campaign_id": values.campaign_id,

            };
            return donorApi.createDonor(financialReport).then(response => {
                console.log(response);
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo tri ân thất bại',
                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo tri ân thành công',
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
                "donate_date": values.donate_date,
                "description": values.description,
                "campaign_id": values.campaign_id,
            };
            await donorApi.updateDonor(financialReport, id).then(response => {
                console.log(response);
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa tri ân thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa tri ân thành công',
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
            await donorApi.listDonor().then((res) => {
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
            await donorApi.deleteDonor(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa tri ân thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa tri ân thành công',

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

    const handleEditCampaign = async (id) => {
        setOpenModalUpdate(true);

        try {
            const response = await donorApi.getDetailDonor(id);
            setId(id);
            form2.setFieldsValue({
                name: response.name,
                amount: response.amount,
                donate_date: dayjs(response.donate_date),
                description: response.description,
                campaign_id: response.campaign_id,
            });
            console.log(form2);
            setLoading(false);
        } catch (error) {
            throw error;
        }
    };

    const handleFilter = async (name) => {
        try {
            const res = await donorApi.searchDonor(name);
            setFinancialReport(res);
        } catch (error) {
            console.log('search to fetch financialReport list:' + error);
        }
    }
    const [page, setPage] = useState(1);


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'index',
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
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Ngày tặng',
            dataIndex: 'donate_date',
            key: 'donate_date',
            render: (created_at) => moment(created_at).format('DD-MM-YYYY'),
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
                                onClick={() => handleEditCampaign(record.donor_id)}
                            >{"Chỉnh sửa"}
                            </Button>
                        </div>
                        )}
                        {user.role === 'kế toán' && (
                        <div
                            style={{ marginTop: 10 }}>
                            <Popconfirm
                                title="Bạn có chắc chắn xóa tri ân này?"
                                onConfirm={() => handleDeleteCampaign(record.donor_id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    style={{ width: 150, borderRadius: 15, height: 30 }}
                                >{"Xóa"}
                                </Button>
                            </Popconfirm>
                        </div>
                        )}
                    </Row>
                </div >
            ),
        },
    ];

    if (user.role !== 'kế toán') {
        columns.pop();
    }

    useEffect(() => {
        (async () => {
            try {
                await donorApi.listDonor().then((res) => {
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
                                {title: <span>Quản lý tri ân</span>, key: 2},
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
                                                    <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo tri ân</Button>
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
                            pagination={{ position: ['bottom'] }} rowKey={"donor_id"} dataSource={financialReport} />
                    </div>
                </div>

                <Modal
                    title="Tạo tri ân mới"
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
                            <Input placeholder="Tên báo cáo tri ân" />
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
                            <InputNumber placeholder="Số tiền" />
                        </Form.Item>
                        <Form.Item
                            name="donate_date"
                            label="Ngày ủng hộ"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập ngày ủng hộ!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker
                                placeholder="Chọn ngày và giờ"
                            />
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
                    title="Chỉnh sửa tri ân"
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
                            <Input placeholder="Tên báo cáo tri ân" />
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
                            <InputNumber placeholder="Số tiền" />
                        </Form.Item>
                        <Form.Item
                            name="donate_date"
                            label="Ngày ủng hộ"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập ngày ủng hộ!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker
                                placeholder="Chọn ngày và giờ"
                            />
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

export default DonorManagement;