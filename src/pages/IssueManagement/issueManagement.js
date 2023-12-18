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
import dayjs from "dayjs";
import moment from "moment";
import React, { useEffect, useState } from "react";
import campaignApi from "../../apis/campaignApi";
import issueApi from "../../apis/issueApi";
import taskReportApi from "../../apis/taskReportApi";
import userApi from "../../apis/userApi";
import "./issueManagement.css";
const { Option } = Select;

const IssueManagement = () => {
  const [campaign, setCampaign] = useState([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [id, setId] = useState();
  const [campaignList, setCampaignList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [taskReport, setTaskReport] = useState([]);

  const user = localStorage.getItem("user");
  const userOption = `${user.lastname} ${user.firstname}`;

  const showModal = () => {
    setOpenModalCreate(true);
  };
  useEffect(() => {
    // form.setFieldValue("userId", JSON.parse(user)?.profileId)
  }, []);
  const handleOkUser = async (values) => {
    setLoading(true);
    try {
      // Kiểm tra ngày kết thúc không được trước ngày tạo
      if (new Date(values.due_date) < new Date(values.start_date)) {
        notification["error"]({
          message: `Thông báo`,
          description: "Ngày kết thúc không thể trước ngày tạo",
        });
        setLoading(false);
        return;
      }
      const campaign = {
        title: values.title,
        description: values.description,
        assignee: values.assignee,
        start_date: values.start_date,
        due_date: values.due_date,
        userId: values.userId,
        taskReportId: values.taskReportId,
        statusId: values.statusId,
      };
      return issueApi.createIssue(campaign).then((response) => {
        if (response === undefined) {
          notification["error"]({
            message: `Thông báo`,
            description: "Tạo vấn đề thất bại",
          });
          setLoading(false);
        } else {
          notification["success"]({
            message: `Thông báo`,
            description: "Tạo vấn đề thành công",
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
      // Kiểm tra ngày kết thúc không được trước ngày tạo
      if (new Date(values.due_date) < new Date(values.start_date)) {
        notification["error"]({
          message: `Thông báo`,
          description: "Ngày kết thúc không thể trước ngày tạo",
        });
        setLoading(false);
        return;
      }
      const campaign = {
        title: values.title,
        description: values.description,
        assignee: values.assignee,
        start_date: values.start_date,
        due_date: values.due_date,
        userId: values.userId,
        taskReportId: values.taskReportId,
        statusId: values.statusId,
        issueId: id,
      };
      await issueApi.updateIssue(campaign, id).then((response) => {
        console.log(response);
        if (response === undefined) {
          notification["error"]({
            message: `Thông báo`,
            description: "Chỉnh sửa vấn đề thất bại",
          });
        } else {
          notification["success"]({
            message: `Thông báo`,
            description: "Chỉnh sửa vấn đề thành công",
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
      await issueApi.listIssue().then((res) => {
        console.log(res);
        setCampaign(res);
        setLoading(false);
      });
    } catch (error) {
      console.log("Failed to fetch event list:" + error);
    }
  };

  const handleDeleteCampaign = async (id) => {
    setLoading(true);
    try {
      await issueApi.deleteIssue(id).then((response) => {
        if (response === undefined) {
          notification["error"]({
            message: `Thông báo`,
            description: "Xóa vấn đề thất bại",
          });
          setLoading(false);
        } else {
          notification["success"]({
            message: `Thông báo`,
            description: "Xóa vấn đề thành công",
          });
          handleCampaignList();
          setLoading(false);
        }
      });
    } catch (error) {
      console.log("Failed to fetch event list:" + error);
    }
  };

  const handleEditCampaign = (id) => {
    setOpenModalUpdate(true);
    (async () => {
      try {
        const response = await issueApi.getDetailIssue(id);
        setId(id);
        form2.setFieldsValue({
          title: response.title,
          description: response.description,
          assignee: response.assignee,
          start_date: dayjs(response.start_date),
          due_date: dayjs(response.due_date),
          userId: response.userId,
          taskReportId: response.taskReportId,
          statusId: response.statusId,
        });
        setLoading(false);
      } catch (error) {
        throw error;
      }
    })();
  };

  const handleFilter = async (name) => {
    try {
      const res = await issueApi.searchIssue(name);
      setCampaign(res);
    } catch (error) {
      console.log("search to fetch campaign list:" + error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "issueId",
      key: "issueId",
    },
    {
      title: "Tên",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Nội dung",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ban được giao",
      dataIndex: "assignee",
      key: "assignee",
    },
    {
      title: "Ngày tạo",
      dataIndex: "start_date",
      key: "start_date",
      render: (start_date) => moment(start_date).format("DD-MM-YYYY"),
    },
    {
      title: "Ngày đáo hạn",
      dataIndex: "due_date",
      key: "due_date",
      render: (due_date) => moment(due_date).format("DD-MM-YYYY"),
    },

    {
      title: "Tên người dùng",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Tên báo cáo nhiệm vụ",
      dataIndex: "taskReportName",
      key: "taskReportName",
    },
    {
      title: "Tên trạng thái hiện tại",
      dataIndex: "currentStatusName",
      key: "currentStatusName",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          <Row style={{ display: "flex", flexDirection: "column" }}>
            <div>
              <Button
                size="small"
                icon={<EditOutlined />}
                style={{ width: 150, borderRadius: 15, height: 30 }}
                onClick={() => handleEditCampaign(record.issueId)}
              >
                {"Chỉnh sửa"}
              </Button>
            </div>
            <div style={{ marginTop: 10 }}>
              <Popconfirm
                title="Bạn có chắc chắn xóa vấn đề này?"
                onConfirm={() => handleDeleteCampaign(record.issueId)}
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
          </Row>
        </div>
      ),
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        await issueApi.listIssue().then((res) => {
          console.log(res);
          setCampaign(res);
          setLoading(false);
        });

        await campaignApi.listCampaign().then((res) => {
          console.log(res);
          setCampaignList(res);
          setLoading(false);
        });

        await userApi.listUserByAdmin().then((res) => {
          console.log(res);
          setUserList(res);
          setLoading(false);
        });

        await taskReportApi.listTaskReport().then((res) => {
          console.log(res);
          setTaskReport(res);
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
                { title: <span>Quản lý vấn đề</span>, key: 2 },
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
                          Tạo vấn đề
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
              pagination={{ position: ["bottom"] }}
              rowKey={"issueId"}
              dataSource={campaign}
            />
          </div>

          <Modal
            title="Tạo vấn đề mới"
            open={openModalCreate}
            style={{ top: 100 }}
            onOk={() => {
              form
                .validateFields()
                .then((values) => {
                  form.resetFields();
                  handleOkUser({ ...values, userId: JSON.parse(user).userId });
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
                <Input placeholder="Tiêu đề" />
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
                name="assignee"
                label="Ban phụ trách"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn Ban phụ trách!",
                  },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Select placeholder="Vui lòng chọn Ban phụ trách">
                  <Select.Option value="ban hậu cần">
                    ban hậu cần{" "}
                  </Select.Option>
                  <Select.Option value="ban kế hoạch">
                    ban kế hoạch{" "}
                  </Select.Option>
                  <Select.Option value="ban truyền thông&sự kiện">
                    ban truyền thông&sự kiện{" "}
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="start_date"
                label="Ngày tạo"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập ngày tạo!",
                  },
                ]}
                style={{ marginBottom: 10 }}
              >
                <DatePicker format="DD-MM-YYYY" placeholder="Ngày tạo" />
              </Form.Item>

              <Form.Item
                name="due_date"
                label="Ngày kết thúc"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập ngày kết thúc!",
                  },
                ]}
                style={{ marginBottom: 10 }}
              >
                <DatePicker format="DD-MM-YYYY" placeholder="Ngày kết thúc" />
              </Form.Item>
              <Form.Item
                name="userId"
                label="Người tạo"
                style={{ marginBottom: 10 }}
              >
                <Select
                  style={{ width: "100%" }}
                  tokenSeparators={[","]}
                  disabled
                  defaultValue={JSON.parse(user).userId}
                  placeholder="Người tạo"
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
                name="taskReportId"
                label="Báo cáo nhiệm vụ"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn Báo cáo nhiệm vụ!",
                  },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Select placeholder="Chọn Báo cáo nhiệm vụ">
                  {taskReport.map((item) => (
                    <Select.Option
                      key={item.taskReportId}
                      value={item.taskReportId}
                    >
                      {item.name}
                    </Select.Option>
                  ))}
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
                  <Select.Option key={1} value={1}>
                    Bắt đầu{" "}
                  </Select.Option>
                  <Select.Option key={2} value={2}>
                    Chưa hoàn thành{" "}
                  </Select.Option>
                  <Select.Option key={3} value={3}>
                    Hoàn thành{" "}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title="Chỉnh sửa vấn đề"
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
                <Input placeholder="Tiêu đề" />
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
                name="assignee"
                label="Ban phụ trách"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn Ban phụ trách!",
                  },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Select placeholder="Vui lòng chọn Ban phụ trách">
                  <Select.Option value="ban hậu cần">
                    ban hậu cần{" "}
                  </Select.Option>
                  <Select.Option value="ban kế hoạch">
                    ban kế hoạch{" "}
                  </Select.Option>
                  <Select.Option value="ban truyền thông&sự kiện">
                    ban truyền thông&sự kiện{" "}
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="start_date"
                label="Ngày tạo"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập ngày tạo!",
                  },
                ]}
                style={{ marginBottom: 10 }}
              >
                <DatePicker format="DD-MM-YYYY" placeholder="Ngày tạo" />
              </Form.Item>

              <Form.Item
                name="due_date"
                label="Ngày kết thúc"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập ngày kết thúc!",
                  },
                ]}
                style={{ marginBottom: 10 }}
              >
                <DatePicker format="DD-MM-YYYY" placeholder="Ngày kết thúc" />
              </Form.Item>
              <Form.Item
                name="userId"
                label="Người tạo"
                style={{ marginBottom: 10 }}
              >
                <Select
                  style={{ width: "100%" }}
                  tokenSeparators={[","]}
                  disabled
                  // defaultValue={1}
                  placeholder="Người tạo"
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
                name="taskReportId"
                label="Báo cáo nhiệm vụ"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn Báo cáo nhiệm vụ!",
                  },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Select placeholder="Chọn Báo cáo nhiệm vụ">
                  {taskReport.map((item) => (
                    <Select.Option
                      key={item.taskReportId}
                      value={item.taskReportId}
                    >
                      {item.name}
                    </Select.Option>
                  ))}
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
                  <Select.Option key={1} value={1}>
                    Bắt đầu{" "}
                  </Select.Option>
                  <Select.Option key={2} value={2}>
                    Chưa hoàn thành{" "}
                  </Select.Option>
                  <Select.Option key={3} value={3}>
                    Hoàn thành{" "}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Spin>
    </div>
  );
};

export default IssueManagement;
