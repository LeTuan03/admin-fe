import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    ShoppingOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop,
    Breadcrumb,
    Button,
    Col,
    Form,
    Input,
    Popconfirm,
    Row,
    Spin,
    Table,
    notification
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import campaignApi from "../../apis/campaignApi";
import requestVolunteerApi from '../../apis/requestVolunteerApi';
import "./requestVolunteer.css";

const RequestVolunteer = () => {

    const [campaign, setCampaign] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
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
            const campaign = {
                "name": values.name,
                "description": values.description,
                "start_date": values.start_date,
                "end_date": values.end_date,
                "title": values.title,
                "location": values.location,
                "statusId": values.statusId
            }
            return campaignApi.createCampaign(campaign).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo chiến dịch thất bại',
                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo chiến dịch thành công',
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
                "name": values.name,
                "description": values.description,
                "start_date": values.start_date,
                "end_date": values.end_date,
                "title": values.title,
                "location": values.location,
                "statusId": values.statusId
            }
            await campaignApi.updateCampaign(campaign).then(response => {
                console.log(response);
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa chiến dịch thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa chiến dịch thành công',
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
            await requestVolunteerApi.listRequestVolunteer().then((res) => {
                console.log(res);
                setCampaign(res);
                setLoading(false);
            });
            ;
        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        };
    }

    const handleApproveCampaign  = async (record) => {
        const campaign = 
            {
                "status": true
            }
        await requestVolunteerApi.updateRequestVolunteer(campaign, record.id).then(response => {
            console.log(response);
            if (response === undefined) {
                notification["error"]({
                    message: `Thông báo`,
                    description:
                        'Cập nhật thất bại',
                });
            }
            else {
                notification["success"]({
                    message: `Thông báo`,
                    description:
                        'Cập nhật thành công',
                });
                handleCampaignList();
                setOpenModalUpdate(false);
            }
        })
    }

    const handleRejectCampaign   = async (record) => {
        const campaign = 
            {
                "status": false
            }
        await requestVolunteerApi.updateRequestVolunteer(campaign, record.id).then(response => {
            console.log(response);
            if (response === undefined) {
                notification["error"]({
                    message: `Thông báo`,
                    description:
                        'Cập nhật thất bại',
                });
            }
            else {
                notification["success"]({
                    message: `Thông báo`,
                    description:
                        'Cập nhật thành công',
                });
                handleCampaignList();
                setOpenModalUpdate(false);
            }
        })
    }

    const handleFilter = async (name) => {
        try {
            const res = await requestVolunteerApi.searchRequestVolunteer(name);
            setCampaign(res);
        } catch (error) {
            console.log('search to fetch campaign list:' + error);
        }
    }
    const [page, setPage] = useState(1);


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'date_of_birth',
            key: 'date_of_birth',
            render: (start_date) => moment(start_date).format('DD-MM-YYYY'),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Lý do muốn vào',
            dataIndex: 'reason',
            key: 'reason',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <span style={{ color: status == 0 ? 'red' : 'green' }}>
                    {status == 0 ? 'Từ chối' : 'Đã phê duyệt'}
                </span>
            ),
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
                                onClick={() => handleApproveCampaign (record)}
                            >{"Phê duyệt"}
                            </Button>
                        </div>
                        <div
                            style={{ marginTop: 10 }}>
                            <Popconfirm
                                title="Bạn có chắc chắn từ chối chiến dịch này?"
                                onConfirm={() => handleRejectCampaign (record)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    style={{ width: 150, borderRadius: 15, height: 30 }}
                                >{"Từ chối"}
                                </Button>
                            </Popconfirm>
                        </div>
                    </Row>
                </div >
            ),
        },
    ];


    useEffect(() => {
        (async () => {
            try {
                await requestVolunteerApi.listRequestVolunteer().then((res) => {
                    console.log(res);
                    setCampaign(res);
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
                                <span>Quản lý tình nguyện viện</span>
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
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} scroll={{ x: true }}
                            pagination={{ position: ['bottom'] }} dataSource={campaign} />
                    </div>
                </div>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default RequestVolunteer;