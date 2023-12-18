import {
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
    Modal,
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
import generalReportsApi from "../../apis/generalReportsApi";
import userApi from '../../apis/userApi';
import uploadFileApi from '../../apis/uploadFileApi';
import "./generalReports.css";
const { Option } = Select;

const GeneralReports = () => {

    const [campaign, setCampaign] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [campaignList, setCampaignList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [file, setUploadFile] = useState();


    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const campaign = {
                "attachment": file,
                "created_at": values.created_at,
                "campaignId": values.campaignId,
                "statusId": values.statusId,
            }
            return generalReportsApi.createGeneralReport(campaign).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo báo cáo thất bại',
                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo báo cáo thành công',
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
            const campaign = {
                "attachment": file,
                "created_at": values.created_at,
                "campaignId": values.campaignId,
                "statusId": values.statusId,
                "generalReportId": id,
            }
            await generalReportsApi.updateGeneralReport(campaign, id).then(response => {
                console.log(response);
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa báo cáo thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa báo cáo thành công',
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
            await generalReportsApi.listGeneralReport().then((res) => {
                console.log(res);
                setCampaign(res);
                setLoading(false);
            });
            ;
        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        };
    }

    const handleEditCampaign = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await generalReportsApi.getDetailGeneralReport(id);
                setId(id);
                form2.setFieldsValue({
                    attachment: response.attachment,
                    created_at: dayjs(response.created_at),
                    campaignId: response.campaignId,
                    statusId: response.statusId,
                });
                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    }

    const handleFilter = async (name) => {
        try {
            const res = await generalReportsApi.searchGeneralReport(name);
            setCampaign(res);
        } catch (error) {
            console.log('search to fetch campaign list:' + error);
        }
    }
    const [page, setPage] = useState(1);


    const columns = [
        {
            title: 'ID',
            dataIndex: 'generalReportId',
            key: 'generalReportId',
        },
        {
            title: 'Chiến dịch',
            dataIndex: 'campaignName',
            key: 'campaignName',
        },
        {
            title: 'Trạng thái hiện tại',
            dataIndex: 'statusName',
            key: 'statusName',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (due_date) => moment(due_date).format('DD-MM-YYYY'),
        },
        {
            title: 'File đính kèm',
            dataIndex: 'attachment',
            key: 'attachment',
            render: (attachment) => {
                return loading ? (
                  "Xem file"
                ) : (
                  <a
                    href={attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {"Xem file"}
                  </a>
                );
            },
          },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row style={{ display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <Button
                                size="small"
                                icon={<EditOutlined />}
                                style={{ width: 150, borderRadius: 15, height: 30 }}
                                onClick={() => handleEditCampaign(record.generalReportId)}
                            >
                                {"Chỉnh sửa"}
                            </Button>
                        </div>
                        {/* <div style={{ marginTop: 10 }}>
                            <Popconfirm
                                title="Bạn có chắc chắn xóa báo cáo này?"
                                onConfirm={() => handleDeleteCampaign(record.generalReportId)}
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
                        </div> */}
                    </Row>
                </div>
            ),
        },
    ];

    const handleChangeImage = async (e) => {
        setLoading(true);
        const response = await uploadFileApi.uploadFile(e);
        if (response) {
            setUploadFile(response);
        }
        setLoading(false);
    }

    useEffect(() => {
        (async () => {
            try {
                await generalReportsApi.listGeneralReport().then((res) => {
                    console.log(res);
                    setCampaign(res);
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

                ;
            } catch (error) {
                console.log('Failed to fetch campaign list:' + error);
            }
        })();
    }, [])
    return (
        <div>
            <Spin spinning={loading}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <ShoppingOutlined />
                                <span>Quản lý báo cáo</span>
                            </Breadcrumb.Item>
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
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo báo cáo</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} scroll={{ x: true }}
                            pagination={{ position: ['bottom'] }} rowKey={"campaignId"} dataSource={campaign} />
                    </div>

                    <Modal
                        title="Tạo báo cáo mới"
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
                            name="storyCreate"
                            layout="vertical"
                            initialValues={{
                                residence: ['zhejiang', 'hangzhou', 'xihu'],
                                prefix: '86',
                            }}
                            scrollToFirstError
                        >

                            <Form.Item
                                name="campaignId"
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

                            <Form.Item
                                name="statusId"
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
                                        Chưa hoàn thành                                    </Select.Option>
                                    <Select.Option key={3} value={3}>
                                        Hoàn thành
                                    </Select.Option>
                                </Select>
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
                                name="image"
                                label="Đính kèm"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập ngày tạo!',
                                    },
                                ]}
                            >
                                <input type="file" onChange={handleChangeImage}
                                    id="avatar" name="file" />
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        title="Chỉnh sửa báo cáo"
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
                            name="storyCreate"
                            layout="vertical"
                            initialValues={{
                                residence: ['zhejiang', 'hangzhou', 'xihu'],
                                prefix: '86',
                            }}
                            scrollToFirstError
                        >

                            <Form.Item
                                name="campaignId"
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

                            <Form.Item
                                name="statusId"
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
                                        Chưa hoàn thành                                    </Select.Option>
                                    <Select.Option key={3} value={3}>
                                        Hoàn thành
                                    </Select.Option>
                                </Select>
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

                            <Form.Item name="image" label="Đính kèm">
                                <input type="file" onChange={handleChangeImage}
                                    id="avatar" name="file" />
                            </Form.Item>
                        </Form>


                    </Modal>
                </div>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default GeneralReports;