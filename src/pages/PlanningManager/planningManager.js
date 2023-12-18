import {
  EditOutlined,
  FileOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
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
import "./planningManager.css";

const PlanningManager = () => {
  const [campaign, setCampaign] = useState([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [id, setId] = useState();

  const [user, setUser] = useState([]);
  const [createContent, setCreateContent] = useState("");
  const [updateContent, setUpdateContent] = useState("");
  const [updatedImage, setUpdatedImage] = useState("");
  const [imageData, setImageData] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);
  const [status, setStatus] = useState(null);

  const handleImageChange = (e) => {
    const newImage = e.target.files[0];
    if (newImage) {
      setUpdatedImage(newImage); // Lưu trữ đối tượng hình ảnh mới
      const reader = new FileReader();
      reader.onload = () => {
        setImageData(reader.result); // Cập nhật đường dẫn tạm thời cho hình ảnh
      };
      reader.readAsDataURL(newImage);
    }
  };

  const showModal = () => {
    setOpenModalCreate(true);
  };

  const handleOkUser = async (values) => {
    setLoading(true);
    try {
      // Kiểm tra ngày kết thúc không được trước ngày bắt đầu
      if (new Date(values.end_date) < new Date(values.start_date)) {
        notification["error"]({
          message: `Thông báo`,
          description: "Ngày kết thúc không thể trước ngày bắt đầu",
        });
        setLoading(false);
        return;
      }

      const form = new FormData();
      form.append("name", values.name);
      form.append("description", createContent);
      form.append("start_date", moment(values?.start_date).format());
      form.append("end_date", moment(values?.end_date).format());
      form.append("title", values.title);
      form.append("location", values.location);
      form.append("statusId", values.statusId);
      form.append("image", updatedImage);
      form.append("desc", 1);
      form.append("currentStatus", values?.statusId);

      return campaignApi.createCampaign(form).then((response) => {
        if (response === undefined) {
          notification["error"]({
            message: `Thông báo`,
            description: "Tạo chiến dịch thất bại",
          });
          setLoading(false);
        } else {
          notification["success"]({
            message: `Thông báo`,
            description: "Tạo chiến dịch thành công",
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
      // Kiểm tra ngày kết thúc không được trước ngày bắt đầu
      if (new Date(values.end_date) < new Date(values.start_date)) {
        notification["error"]({
          message: `Thông báo`,
          description: "Ngày kết thúc không thể trước ngày bắt đầu",
        });
        setLoading(false);
        return;
      }

      var form = new FormData();
      form.append("name", values.name);
      form.append("desc", updateContent);
      form.append("start_date", dayjs(values.start_date).format("DD-MM-YYYY"));
      form.append("end_date", dayjs(values.end_date).format("DD-MM-YYYY"));
      form.append("location", values.location);
      form.append("title", values.title);
      form.append("image", updatedImage);
      form.append("currentStatus", status);

      await campaignApi.updateCampaign(form, id).then((response) => {
        console.log(response);
        if (response === undefined) {
          notification["error"]({
            message: `Thông báo`,
            description: "Chỉnh sửa chiến dịch thất bại",
          });
        } else {
          notification["success"]({
            message: `Thông báo`,
            description: "Chỉnh sửa chiến dịch thành công",
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
      await campaignApi.listCampaign().then((res) => {
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
      await campaignApi.deleteCampaign(id).then((response) => {
        if (response === undefined) {
          notification["error"]({
            message: `Thông báo`,
            description: "Xóa chiến dịch thất bại",
          });
          setLoading(false);
        } else {
          notification["success"]({
            message: `Thông báo`,
            description: "Xóa chiến dịch thành công",
          });
          handleCampaignList();
          setLoading(false);
        }
      });
    } catch (error) {
      console.log("Failed to fetch event list:" + error);
    }
  };

  const dateFormat = "DD-MM-YYYY";

  const handleEditCampaign = (id) => {
    setOpenModalUpdate(true);
    (async () => {
      try {
        const response = await campaignApi.getDetailCampaign(id);
        setId(id);
        setImageInfo(response?.image);
        setStatus(response?.statusId);
        form2.setFieldsValue({
          name: response.name,
          description: response.description,
          start_date: dayjs(response.start_date),
          end_date: dayjs(response.end_date),
          title: response.title,
          location: response.location,
          statusId: response.statusName,
          image: response?.image,
        });
        setUpdateContent(response.description);
        console.log(form2);
        setLoading(false);
      } catch (error) {
        throw error;
      }
    })();
  };

  const handleFilter = async (name) => {
    try {
      const res = await campaignApi.searchCampaign(name);

      // Loại bỏ dữ liệu trùng lặp dựa trên campaignId
      const uniqueCampaigns = removeDuplicateData(res, "campaignId");

      setCampaign(uniqueCampaigns);
    } catch (error) {
      console.log("Search to fetch campaign list: " + error);
    }
  };

  // Hàm loại bỏ dữ liệu trùng lặp dựa trên một key cụ thể
  const removeDuplicateData = (data, key) => {
    return data.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t[key] === item[key])
    );
  };

  const handleApproveCampaign = async (record) => {
    const campaign = {
      status: true,
      campaignId: record.campaignId,
    };
    await campaignApi
      .updateCampaignStatus(campaign, record.id)
      .then((response) => {
        console.log(response);
        if (response === undefined) {
          notification["error"]({
            message: `Thông báo`,
            description: "Cập nhật thất bại",
          });
        } else {
          notification["success"]({
            message: `Thông báo`,
            description: "Cập nhật thành công",
          });
          handleCampaignList();
          setOpenModalUpdate(false);
        }
      });
  };

  const handleRejectCampaign = async (record) => {
    const campaign = {
      status: false,
      campaignId: record.campaignId,
    };
    await campaignApi.updateCampaignStatus(campaign).then((response) => {
      console.log(response);
      if (response === undefined) {
        notification["error"]({
          message: `Thông báo`,
          description: "Cập nhật thất bại",
        });
      } else {
        notification["success"]({
          message: `Thông báo`,
          description: "Cập nhật thành công",
        });
        handleCampaignList();
        setOpenModalUpdate(false);
      }
    });
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "campaignId",
      key: "campaignId",
    },
    {
      title: "Tên chiến dịch",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (value) => (
        <div dangerouslySetInnerHTML={{ __html: value }}></div>
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (start_date) => moment(start_date).format("DD-MM-YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (end_date) => moment(end_date).format("DD-MM-YYYY"),
    },
    {
      title: "Vị trí",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Tiến độ",
      dataIndex: "statusName",
      key: "statusName",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <a href={image} target="_blank" rel="noopener noreferrer">
          {"Xem ảnh"}
        </a>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <span style={{ color: status === false ? "red" : "green" }}>
          {status === false ? "Từ chối" : "Đã phê duyệt"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          <Row style={{ display: "flex", flexDirection: "column" }}>
            {user.role === "trưởng ban kế hoạch" && (
              <div>
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  style={{ width: 150, borderRadius: 15, height: 30 }}
                  onClick={() => handleEditCampaign(record.campaignId)}
                >
                  {"Chỉnh sửa"}
                </Button>
              </div>
            )}
            {user.role === "trưởng nhóm" && (
              <div style={{ marginTop: 10 }}>
                <Popconfirm
                  title="Bạn có chắc chắn phê duyệt chiến dịch này?"
                  onConfirm={() => handleApproveCampaign(record)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    size="small"
                    icon={<FileOutlined />}
                    style={{ width: 150, borderRadius: 15, height: 30 }}
                  >
                    {"Phê duyệt"}
                  </Button>
                </Popconfirm>
              </div>
            )}
            {user.role === "trưởng nhóm" && (
              <div style={{ marginTop: 10 }}>
                <Popconfirm
                  title="Bạn có chắc chắn từ chối chiến dịch này?"
                  onConfirm={() => handleRejectCampaign(record)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    size="small"
                    icon={<InfoCircleOutlined />}
                    style={{ width: 150, borderRadius: 15, height: 30 }}
                  >
                    {"Từ chối"}
                  </Button>
                </Popconfirm>
              </div>
            )}
          </Row>
        </div>
      ),
    },
  ];

  if (user.role !== "trưởng ban kế hoạch" && user.role !== "trưởng nhóm") {
    columns.pop();
  }

  useEffect(() => {
    (async () => {
      try {
        await campaignApi.listCampaign().then((res) => {
          setCampaign(res);
          setLoading(false);
        });

        setUser(JSON.parse(localStorage.getItem("user")));
      } catch (error) {
        console.log("Failed to fetch campaign list:" + error);
      }
    })();
  }, []);
  const disabledEndDate = (endValue) => {
    const startValue = form.getFieldValue("start_date");
    if (!startValue || !endValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  return (
    <div>
      <Spin spinning={loading}>
        <div className="container">
          <div style={{ marginTop: 20 }}>
            <Breadcrumb
              items={[
                {
                  title: <HomeOutlined />,
                  key: 1,
                },
                {
                  title: <span>Quản lý chiến dịch</span>,
                  key: 2,
                },
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
                        {user.role === "trưởng ban kế hoạch" ? (
                          <Button
                            onClick={showModal}
                            icon={<PlusOutlined />}
                            style={{ marginLeft: 10 }}
                          >
                            Tạo chiến dịch
                          </Button>
                        ) : null}
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
              rowKey={"campaignId"}
              dataSource={campaign}
            />
          </div>
        </div>

        <Modal
          title="Tạo chiến dịch mới"
          open={openModalCreate}
          style={{ top: 100 }}
          onOk={() => {
            form.submit();
            // .validateFields()
            // .then((values) => {
            //     form.resetFields();
            //     handleOkUser(values);
            // })
            // .catch((info) => {
            //     console.log('Validate Failed:', info);
            // });
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
              residence: ["zhejiang", "hangzhou", "xihu"],
              prefix: "86",
            }}
            onFinish={(val) => {
              handleOkUser(val);
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
              name="start_date"
              label="Ngày bắt đầu"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập ngày bắt đầu!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <DatePicker placeholder="Ngày bắt đầu" />
            </Form.Item>
            <Form.Item
              name="end_date"
              label="Ngày kết thúc"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập ngày kết thúc!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <DatePicker
                format="DD-MM-YYYY"
                placeholder="Ngày kết thúc"
                disabledDate={disabledEndDate}
              />
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
              <CKEditor
                editor={ClassicEditor}
                data="<p>Please input content here</p>"
                onChange={(event, editor) => {
                  setCreateContent(editor.getData());
                }}
              />
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
              <Input placeholder="Tiêu đề" />
            </Form.Item>
            <Form.Item
              name="location"
              label="Vị trí"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập vị trí!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Vị trí" />
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

            <Form.Item
              name="image"
              placeholder="Ảnh"
              rules={[
                {
                  required: true,
                  message: "Vui lòng đăng ảnh!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Chỉnh sửa chiến dịch"
          open={openModalUpdate}
          style={{ top: 100 }}
          onOk={() => {
            form2
              .validateFields()
              .then((values) => {
                handleUpdateCampaign({ ...values });
                form2.resetFields();
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
            name="eventCreate"
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
              name="start_date"
              label="Ngày bắt đầu"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập ngày bắt đầu!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <DatePicker format={dateFormat} placeholder="Ngày bắt đầu" />
            </Form.Item>
            <Form.Item
              name="end_date"
              label="Ngày kết thúc"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập ngày kết thúc!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <DatePicker
                format="DD-MM-YYYY"
                placeholder="Ngày kết thúc"
                disabledDate={disabledEndDate}
              />
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
              <CKEditor
                editor={ClassicEditor}
                data={updateContent}
                onChange={(event, editor) => {
                  setUpdateContent(editor.getData());
                }}
              />
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
              <Input placeholder="Tiêu đề" />
            </Form.Item>
            <Form.Item
              name="location"
              label="Vị trí"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập vị trí!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Vị trí" />
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
              <Select
                placeholder="Chọn trạng thái"
                onChange={(e) => setStatus(e)}
              >
                <Select.Option value="1">Bắt đầu</Select.Option>
                <Select.Option value="2">Chưa hoàn thành</Select.Option>
                <Select.Option value="3">Hoàn thành</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="image"
              placeholder="Ảnh"
              rules={[
                {
                  required: true,
                  message: "Vui lòng đăng ảnh!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <img
                src={imageData || imageInfo}
                alt="1"
                style={{ maxWidth: "100px" }}
              />
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Item>
          </Form>
        </Modal>
      </Spin>
    </div>
  );
};

export default PlanningManager;
