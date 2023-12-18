import {
  DeleteOutlined,
  EditOutlined,
  HomeOutlined,
  PlusOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { PageHeader } from "@ant-design/pro-layout";
import {
  BackTop,
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  notification,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import campaignApi from "../../apis/campaignApi";
import taskReportApi from "../../apis/taskReportApi";
import userApi from "../../apis/userApi";

import "./taskReportsManagement.css";
const { Option } = Select;

const TaskReports = () => {
  const [campaign, setCampaign] = useState([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [id, setId] = useState();
  const [campaignList, setCampaignList] = useState([]);
  const [userList, setUserList] = useState([]);

  const user = localStorage.getItem("user");
  const userOption = `${user.lastname} ${user.firstname}`;

  const showModal = () => {
    setOpenModalCreate(true);
  };

  const handleOkUser = async (values) => {
    setLoading(true);
    try {
      const campaign = {
        name: values.name,
        userId: JSON.parse(user).userId,
        description: values.description,
        title: values.title,
        due_date: moment(values.due_date).format(),
        note: values.note,
        campaignId: values.campaignId,
        statusId: values.statusId,
        userName: "",
        campaignName: "",
        statusName: "",
      };

      return taskReportApi.createTaskReport(campaign).then((response) => {
        if (response === undefined) {
          notification["error"]({
            message: `Thông báo`,
            description: "Tạo báo cáo nhiệm vụ thất bại",
          });
          setLoading(false);
        } else {
          notification["success"]({
            message: `Thông báo`,
            description: "Tạo báo cáo nhiệm vụ thành công",
          });
          setOpenModalCreate(false);
          handleCampaignList();
          setLoading(false);
        }
      });
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateCampaign = async (values) => {
    setLoading(true);
    try {
      const campaign = {
        name: values.name,
        description: values.description,
        title: values.title,
        due_date: values.due_date,
        note: values.note,
        userId: values.userId,
        campaignId: values.campaignId,
        statusId: values.statusId,
        taskReportId: id,
      };
      await taskReportApi.updateTaskReport(campaign, id).then((response) => {
        console.log(response);
        if (response === undefined) {
          notification["error"]({
            message: `Thông báo`,
            description: "Chỉnh sửa báo cáo nhiệm vụ thất bại",
          });
        } else {
          notification["success"]({
            message: `Thông báo`,
            description: "Chỉnh sửa báo cáo nhiệm vụ thành công",
          });
          handleCampaignList();
          setOpenModalUpdate(false);
        }
      });
      setLoading(false);
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = (type) => {
    if (type === "create") {
      setOpenModalCreate(false);
    } else {
      setOpenModalUpdate(false);
    }
    console.log("Clicked cancel button");
  };

  const handleCampaignList = async () => {
    try {
      await taskReportApi.listTaskReport().then((res) => {
        console.log(res);
        setCampaign(res);
        setLoading(false);
      });
    } catch (error) {
      console.log("Failed to fetch event list:" + error);
    }
  };

  const handleEditCampaign = (id) => {
    setOpenModalUpdate(true);
    (async () => {
      try {
        const response = await taskReportApi.getDetailTaskReport(id);
        setId(id);
        form2.setFieldsValue({
          name: response.name,
          description: response.description,
          title: response.title,
          due_date: moment(response.due_date),
          note: response.note,
          campaignId: response.campaignId,
          statusId: response.statusName,
          userId: response.userId,
        });
        setLoading(false);
      } catch (error) {
        throw error;
      }
    })();
  };

  const handleFilter = async (name) => {
    try {
      const res = await taskReportApi.searchTaskReport(name);
      setCampaign(res);
    } catch (error) {
      console.log("search to fetch campaign list:" + error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "taskReportId",
      key: "taskReportId",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Nội dung",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Tên chiến dịch",
      dataIndex: "campaignName",
      key: "campaignName",
    },
    {
      title: "Tên người tạo",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Ngày đáo hạn",
      dataIndex: "due_date",
      key: "due_date",
      render: (due_date) => moment(due_date).format("DD-MM-YYYY"),
    },

    {
      title: "Trạng thái",
      dataIndex: "statusName",
      key: "statusName",
    },
    {
      title: "Lưu ý",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          <Row style={{ display: "flex", flexDirection: "column" }}>
            <div>
              <Button
                disabled={!(record?.userId === JSON.parse(user)?.userId)}
                size="small"
                icon={<EditOutlined />}
                style={{ width: 150, borderRadius: 15, height: 30 }}
                onClick={() => handleEditCampaign(record.taskReportId)}
              >
                {"Chỉnh sửa"}
              </Button>
            </div>
          </Row>
        </div>
      ),
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        await taskReportApi.listTaskReport().then((res) => {
          console.log(res);
          setCampaign(res);
          setLoading(false);
        });

        await campaignApi.listCampaign().then((res) => {
          console.log(res);
          const newRes = res.filter((ele) => ele.status === true);
          setCampaignList(newRes);
          setLoading(false);
        });

        await userApi.listUserByAdmin().then((res) => {
          console.log(res);
          setUserList(res);
          setLoading(false);
        });
      } catch (error) {
        console.log("Failed to fetch campaign list:" + error);
      }
    })();
  }, []);
  return (
    <div>
      <Spin spinning={loading}>
        <div className="container">
          <div style={{ marginTop: 20 }}>
            <Breadcrumb
              items={[
                { title: <HomeOutlined />, key: 1 },
                { title: <span>Báo cáo nhiệm vụ</span>, key: 2 },
              ]}
            ></Breadcrumb>
          </div>

          <div style={{ marginTop: 20 }}>
            <div id="my__event_container__list">
              <PageHeader subTitle="" style={{ fontSize: 14 }}>
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
                        <Button
                          onClick={showModal}
                          icon={<PlusOutlined />}
                          style={{ marginLeft: 10 }}
                        >
                          Tạo báo cáo nhiệm vụ
                        </Button>
                      </Space>
                    </Row>
                  </Col>
                </Row>
              </PageHeader>
            </div>
          </div>

          <div style={{ marginTop: 30 }}>
            <Table
              columns={columns}
              scroll={{ x: true }}
              rowKey={"taskReportId"}
              pagination={{ position: ["bottom"] }}
              dataSource={campaign}
            />
          </div>

          <Modal
            title="Tạo báo cáo nhiệm vụ mới"
            open={openModalCreate}
            style={{ top: 100 }}
            onOk={() => {
              form
                .validateFields()
                .then((values) => {
                  handleOkUser(values);
                  form.resetFields();
                })
                .catch((info) => {
                  console.log("Validate Failed:", info);
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
                residence: ["zhejiang", "hangzhou", "xihu"],
                prefix: "86",
              }}
              scrollToFirstError
            >
              <Form.Item
                name="name"
                label="Tên"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên!",
                  },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Input placeholder="Tên" />
              </Form.Item>
              <Form.Item
                name="description"
                label="Mô tả"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả!",
                  },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Input.TextArea placeholder="Mô tả" />
              </Form.Item>
              <Form.Item
                name="title"
                label="Tiêu đề"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tiêu đề!",
                  },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Input placeholder="Tiêu đề bài viết" />
              </Form.Item>
              <Form.Item
                name="userId"
                label="Người phụ trách"
                style={{ marginBottom: 10 }}
              >
                <Select
                  style={{ width: "100%" }}
                  tokenSeparators={[","]}
                  disabled
                  defaultValue={JSON.parse(user).userId}
                  placeholder="Người phụ trách"
                  // Removing showSearch prop to disable search
                  filterOption={(input, option) =>
                    option.children && typeof option.children === "string"
                      ? option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      : false
                  }
                >
                  {userList.map((item, index) => (
                    <Option value={item.accountId} key={item.accountId}>
                      {item.lastname} {item.firstname}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="due_date"
                label="Ngày đáo hạn"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập ngày đáo hạn!",
                  },
                ]}
                style={{ marginBottom: 10 }}
              >
                <DatePicker format="DD-MM-YYYY" placeholder="Chọn ngày" />
              </Form.Item>
              <Form.Item
                name="note"
                label="Ghi chú"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập ghi chú!",
                  },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Input placeholder="Ghi chú" />
              </Form.Item>
              <Form.Item
                name="campaignId"
                label="Chiến dịch"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn chiến dịch!",
                  },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Select
                  style={{ width: "100%" }}
                  tokenSeparators={[","]}
                  placeholder="Chiến dịch"
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {campaignList.map((item, index) => {
                    return (
                      <Option value={item.campaignId} key={item.campaignId}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                name="statusId"
                label="Trạng thái"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn trạng thái!",
                  },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value="1">Bắt đầu</Select.Option>
                  <Select.Option value="2">Chưa hoàn thành</Select.Option>
                  <Select.Option value="3">Hoàn thành</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title="Chỉnh sửa báo cáo nhiệm vụ"
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
                  console.log("Validate Failed:", info);
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
                residence: ["zhejiang", "hangzhou", "xihu"],
                prefix: "86",
              }}
              scrollToFirstError
            >
              <Form.Item
                name="name"
                label="Tên"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên!",
                  },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Input placeholder="Tên" />
              </Form.Item>
              <Form.Item
                name="description"
                label="Mô tả"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả!",
                  },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Input.TextArea placeholder="Mô tả" />
              </Form.Item>
              <Form.Item
                name="title"
                label="Tiêu đề"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tiêu đề!",
                  },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Input placeholder="Tiêu đề bài viết" />
              </Form.Item>
              <Form.Item
                name="userId"
                label="Người phụ trách"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn người phụ trách!",
                  },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Select
                  style={{ width: "100%" }}
                  disabled
                  defaultValue={user.userId}
                  tokenSeparators={[","]}
                  placeholder="Người phụ trách"
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {userList.map((item, index) => {
                    return (
                      <Option value={item.accountId} key={item.accountId}>
                        {item.lastname} {item.firstname}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                name="due_date"
                label="Ngày đáo hạn"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập ngày đáo hạn!",
                  },
                ]}
                style={{ marginBottom: 10 }}
              >
                <DatePicker format="DD-MM-YYYY" placeholder="Chọn ngày" />
              </Form.Item>
              <Form.Item
                name="note"
                label="Ghi chú"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập ghi chú!",
                  },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Input placeholder="Ghi chú" />
              </Form.Item>
              <Form.Item
                name="campaignId"
                label="Chiến dịch"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn chiến dịch!",
                  },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Select
                  style={{ width: "100%" }}
                  tokenSeparators={[","]}
                  placeholder="Chiến dịch"
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {campaignList.map((item, index) => {
                    return (
                      <Option value={item.campaignId} key={item.campaignId}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                name="statusId"
                label="Trạng thái"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn trạng thái!",
                  },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value="1">Bắt đầu</Select.Option>
                  <Select.Option value="2">Chưa hoàn thành</Select.Option>
                  <Select.Option value="3">Hoàn thành</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Spin>
    </div>
  );
};

export default TaskReports;
