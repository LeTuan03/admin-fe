import {
  DeleteOutlined,
  EditOutlined,
  HomeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { PageHeader } from "@ant-design/pro-layout";
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
  Spin,
  Table,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import mediaApi from "../../apis/mediaApi";
import "./mediaManagement.css";
import { useHistory } from "react-router-dom";

const MediaManagement = () => {
  const [milestone, setMilestone] = useState([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);

  const [updatedImage, setUpdatedImage] = useState("");
  const [imageData, setImageData] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [uploadedVideo, setUploadeddVideo] = useState(null);
  const [campaignId, setCampaignId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [id, setId] = useState();

  const history = useHistory();

  const handleCreateMedia = () => {
    history.push("/create-media");
  };

  const handleOkUser = async (values) => {
    setLoading(true);
    try {
      const milestone = {
        image: values.image,
        video: values.video,
      };
      return mediaApi.createMedia(milestone).then((response) => {
        if (response === undefined) {
          notification["error"]({
            message: `Thông báo`,
            description: "Tạo media thất bại",
          });
          setLoading(false);
        } else {
          notification["success"]({
            message: `Thông báo`,
            description: "Tạo media thành công",
          });
          setOpenModalCreate(false);
          handleMilestoneList();
          setLoading(false);
        }
      });
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateMilestone = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("idCampaign", campaignId);
      formData.append("newImage", updatedImage);
      formData.append("newVideo", uploadedVideo);
      await mediaApi.updateMedia(formData, id).then((response) => {
        if (response === undefined) {
          notification["error"]({
            message: `Thông báo`,
            description: "Chỉnh sửa media thất bại",
          });
        } else {
          notification["success"]({
            message: `Thông báo`,
            description: "Chỉnh sửa media thành công",
          });

          handleMilestoneList();
          handleCancel();
          setOpenModalUpdate(false);
        }
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleCancel = (type) => {
    if (type === "create") {
      setOpenModalCreate(false);
    } else {
      setOpenModalUpdate(false);
      setImageData(null);
      setSelectedVideo(null);
      setCampaignId(null);
      setUploadeddVideo(null);
    }
    console.log("Clicked cancel button");
  };

  const handleMilestoneList = async () => {
    try {
      await mediaApi.listMedia().then((res) => {
        console.log(res);
        setMilestone(res);
        setLoading(false);
      });
    } catch (error) {
      console.log("Failed to fetch event list:" + error);
    }
  };

  const handleDeleteMilestone = async (id) => {
    setLoading(true);
    try {
      await mediaApi.deleteMedia(id).then((response) => {
        if (response === undefined) {
          notification["error"]({
            message: `Thông báo`,
            description: "Xóa media thất bại",
          });
          setLoading(false);
        } else {
          notification["success"]({
            message: `Thông báo`,
            description: "Xóa media thành công",
          });
          handleMilestoneList();
          setLoading(false);
        }
      });
    } catch (error) {
      console.log("Failed to fetch event list:" + error);
    }
  };

  const handleEditMilestone = (record) => {
    setOpenModalUpdate(true);
    (async () => {
      try {
        setId(record?.id);
        form2.setFieldsValue({
          mediaId: record.mediaId,
          image: record.image,
          video: record.video,
        });
        setImageData(record?.image);
        setSelectedVideo(record.video);
        setCampaignId(record?.campaignId);
      } catch (error) {
        throw error;
      }
    })();
  };

  const handleFilter = async (name) => {
    try {
      const res = await mediaApi.searchMedia(name);
      setMilestone(res);
    } catch (error) {
      console.log("search to fetch milestone list:" + error);
    }
  };
  const handleImageChange = (e) => {
    const newImage = e.target.files[0];
    if (newImage) {
      console.log(newImage);
      setUpdatedImage(newImage); // Lưu trữ đối tượng hình ảnh mới
      const reader = new FileReader();
      reader.onload = () => {
        setImageData(reader.result); // Cập nhật đường dẫn tạm thời cho hình ảnh
      };
      reader.readAsDataURL(newImage);
    }
  };

  const handleVideoChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const videoURL = URL.createObjectURL(file);
        setSelectedVideo(videoURL);
        setUploadeddVideo(file);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên chiến dịch",
      dataIndex: "campaignName",
      key: "campaignName",
      render: (text) => {
        return text;
      },
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) => {
        return (
          <a href={text} target={"_blank"}>
            Xem ảnh
          </a>
        );
      },
    },
    {
      title: "Video",
      dataIndex: "video",
      key: "video",
      render: (text) => {
        return (
          <a href={text} target={"_blank"}>
            Xem video
          </a>
        );
      },
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
                onClick={() => handleEditMilestone(record)}
              >
                {"Chỉnh sửa"}
              </Button>
            </div>
            <div style={{ marginTop: 10 }}>
              <Popconfirm
                title="Bạn có chắc chắn xóa media này?"
                onConfirm={() => handleDeleteMilestone(record.idMedia)}
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
  useEffect(() => {}, [selectedVideo]);
  useEffect(() => {
    (async () => {
      try {
        await mediaApi.listMedia().then((res) => {
          console.log(res);
          setMilestone(res);
          setLoading(false);
        });
      } catch (error) {
        console.log("Failed to fetch milestone list:" + error);
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
                { title: <span>Quản lý media</span>, key: 2 },
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
                          icon={<PlusOutlined />}
                          style={{ marginLeft: 10 }}
                          onClick={() => handleCreateMedia()}
                        >
                          Tạo media
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
              rowKey={"image"}
              columns={columns}
              scroll={{ x: true }}
              pagination={{ position: ["bottom"] }}
              dataSource={milestone}
            />
          </div>
        </div>

        <Modal
          title="Tạo media mới"
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
            name="eventCreate"
            layout="vertical"
            initialValues={{
              residence: ["zhejiang", "hangzhou", "xihu"],
              prefix: "86",
            }}
            scrollToFirstError
          >
            <Form.Item
              name="image"
              label="Link ảnh"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập đường link ảnh!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Đường link ảnh" />
            </Form.Item>
            <Form.Item
              name="video"
              label="Link video"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập đường link video!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Đường link video" />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Chỉnh sửa media"
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
                console.log("Validate Failed:", info);
              });
          }}
          onCancel={handleCancel}
          okText="Hoàn thành"
          cancelText="Hủy"
          width={600}
          name="accountCreate"
        >
          <Form form={form2} name="accountCreate">
            Ảnh
            {/* {imageData && (
              <div className="max-w-[30px] max-h-[30px]">
                <img
                  src={imageData}
                  alt="Choose some img for slider"
                  className="create-post-image-preview w-full"
                  style={{ width: "200px", height: "100px" }}
                />
              </div>
            )} */}
            <Form.Item
              name="avatar"
              placeholder="Ảnh"
              // rules={[
              //   {
              //     required: true,
              //     message: "Vui lòng đăng ảnh!",
              //   },
              // ]}
              style={{ marginBottom: 10 }}
            >
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </Form.Item>
            Video
            {/* {selectedVideo && (
              <div>
                <video controls style={{ width: "200px", height: "100px" }}>
                  <source src={selectedVideo} />
                  Your browser does not support the video tag.
                </video>
              </div>
            )} */}
            <Form.Item
              placeholder="Video"
              rules={[
                {
                  required: true,
                  message: "Vui lòng đăng video!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <div>
                <Input type="file" accept="*/*" onChange={handleVideoChange} />
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </Spin>
    </div>
  );
};

export default MediaManagement;
