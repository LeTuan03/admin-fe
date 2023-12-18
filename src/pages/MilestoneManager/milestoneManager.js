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
import milestoneApi from "../../apis/milestoneApi";
import "./milestoneManager.css";
const { Option } = Select;

const MilestoneManager = () => {

    const [milestone, setMilestone] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [campaignList, setCampaignList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();


    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            // Kiểm tra ngày kết thúc không được trước ngày tạo
            if (new Date(values.end_date) < new Date(values.created_at)) {
                notification["error"]({
                    message: `Thông báo`,
                    description: 'Ngày kết thúc không thể trước ngày tạo',
                });
                setLoading(false);
                return;
            }

            const milestone = {
                "name": values.name,
                "description": values.description,
                "end_date": values.end_date,
                "create_at": values.created_at,
                "campaign_id": values.campaign_id,
                "current_Status_id": values.current_Status_id,
            }
            return milestoneApi.createMilestone(milestone).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo sự kiện thất bại',
                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo sự kiện thành công',
                    });
                    setOpenModalCreate(false);
                    handleMilestoneList();
                    setLoading(false);
                }
            })

        } catch (error) {
            throw error;
        }
    }

    const handleUpdateMilestone = async (values) => {
        setLoading(true);
        try {
            // Kiểm tra ngày kết thúc không được trước ngày tạo
            if (new Date(values.end_date) < new Date(values.created_at)) {
                notification["error"]({
                    message: `Thông báo`,
                    description: 'Ngày kết thúc không thể trước ngày tạo',
                });
                setLoading(false);
                return;
            }

            const milestone = {
                "name": values.name,
                "description": values.description,
                "end_date": values.end_date,
                "create_at": values.created_at,
                "campaign_id": values.campaign_id,
                "current_Status_id": values.current_Status_id,

            }
            await milestoneApi.updateMilestone(milestone, id).then(response => {
                console.log(response);
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa sự kiện thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa sự kiện thành công',
                    });
                    handleMilestoneList();
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

    const handleMilestoneList = async () => {
        try {
            await milestoneApi.listMilestones().then((res) => {
                console.log(res);
                setMilestone(res);
                setLoading(false);
            });
            ;
        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        };
    }

    const handleDeleteMilestone = async (id) => {
        setLoading(true);
        try {
            await milestoneApi.deleteMilestone(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa sự kiện thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa sự kiện thành công',

                    });
                    handleMilestoneList();
                    setLoading(false);
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleEditMilestone = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await milestoneApi.getDetailMilestone(id);
                setId(id);
                form2.setFieldsValue({
                    name: response.name,
                    description: response.description,
                    created_at: dayjs(response.create_at),
                    end_date: dayjs(response.end_date),
                    campaign_id: response.campaign_id,
                    current_Status_id: response.current_Status_id,
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
            const res = await milestoneApi.searchMilestones(name);
            setMilestone(res);
        } catch (error) {
            console.log('search to fetch milestone list:' + error);
        }
    }

    const [user, setUser] = useState([]);


    const columns = [
        {
            title: 'ID',
            dataIndex: 'milestione_id',
            key: 'milestione_id',
        },
        {
            title: 'Tên sự kiện',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Tên chiến dịch',
            dataIndex: 'campain_name',
            key: 'campain_name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'start_date',
            key: 'start_date',
            render: (start_date) => moment(start_date).format('DD-MM-YYYY'),
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'end_date',
            key: 'end_date',
            render: (end_date) => moment(end_date).format('DD-MM-YYYY'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'current_status_name',
            key: 'current_status_name',
        },

        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row style={{ display: 'flex', flexDirection: 'column' }}>
                        {user.role === 'trưởng ban kế hoạch' && (
                            <div>
                                <Button
                                    size="small"
                                    icon={<EditOutlined />}
                                    style={{ width: 150, borderRadius: 15, height: 30 }}
                                    onClick={() => handleEditMilestone(record.milestione_id)}
                                >
                                    {"Chỉnh sửa"}
                                </Button>
                            </div>
                        )}
                        {user.role === 'trưởng ban kế hoạch' && (
                            <div style={{ marginTop: 10 }}>
                                <Popconfirm
                                    title="Bạn có chắc chắn xóa sự kiện này?"
                                    onConfirm={() => handleDeleteMilestone(record.milestione_id)}
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

    if (user.role !== 'trưởng ban kế hoạch') {
        columns.pop();
    }

    useEffect(() => {
        (async () => {
            try {
                await milestoneApi.listMilestones().then((res) => {
                    console.log(res);
                    setMilestone(res);
                    setLoading(false);
                });

                await campaignApi.listCampaign().then((res) => {
                    console.log(res);
                    const newRes = res.filter(ele => ele.status === true)
                    setCampaignList(newRes);
                    setLoading(false);
                });

                setUser(JSON.parse(localStorage.getItem("user")));

            } catch (error) {
                console.log('Failed to fetch milestone list:' + error);
            }
        })();
    }, [])

    // Hàm loại bỏ dữ liệu trùng lặp dựa trên một key cụ thể
    const disabledEndDate = (endValue) => {
        const startValue = form.getFieldValue('created_at');
        if (!startValue || !endValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    };

    return (
        <div>
            <Spin spinning={loading}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb
                            items={[
                                {title: <HomeOutlined />, key: 1},
                                {title: <span>Quản lý mốc sự kiện</span>, key: 2},
                            ]}
                        ></Breadcrumb>
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
                                            {user.role === 'trưởng ban kế hoạch' ?
                                                <Space>
                                                    <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo mốc sự kiện</Button>
                                                </Space>
                                            : null}
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} scroll={{ x: true }}
                            pagination={{ position: ['bottom'] }} dataSource={milestone} rowKey={"milestione_id"} />
                    </div>
                </div>

                <Modal
                    title="Tạo sự kiện mới"
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
                            <Input placeholder="Tên" />
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
                            <DatePicker format="DD-MM-YYYY" placeholder="Ngày tạo" />
                        </Form.Item>
                        <Form.Item
                            name="end_date"
                            label="Ngày kết thúc"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập ngày kết thúc!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker format="DD-MM-YYYY" placeholder="Ngày kết thúc" disabledDate={disabledEndDate}
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
                            name="current_Status_id"
                            label="Trạng thái"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn trạng thái!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn trạng thái">
                                <Select.Option key={1} value={1}>
                                    Bắt đầu
                                </Select.Option>
                                <Select.Option key={2} value={2}>
                                    Chưa hoàn thành
                                </Select.Option>
                                <Select.Option key={3} value={3}>
                                    Hoàn thành
                                </Select.Option>
                            </Select>
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
                    title="Chỉnh sửa sự kiện"
                    open={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateMilestone(values);
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
                            <Input placeholder="Tên" />
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
                            <DatePicker format="DD-MM-YYYY" placeholder="Ngày tạo" />
                        </Form.Item>
                        <Form.Item
                            name="end_date"
                            label="Ngày kết thúc"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập ngày kết thúc!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker format="DD-MM-YYYY" placeholder="Ngày kết thúc" disabledDate={disabledEndDate} />
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
                            name="current_Status_id"
                            label="Trạng thái"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn trạng thái!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn trạng thái">
                                <Select.Option key={1} value={1}>
                                    Bắt đầu
                                </Select.Option>
                                <Select.Option key={2} value={2}>
                                    Chưa hoàn thành
                                </Select.Option>
                                <Select.Option key={3} value={3}>
                                    Hoàn thành
                                </Select.Option>
                            </Select>
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

export default MilestoneManager;