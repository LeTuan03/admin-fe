import {
  FormOutlined,
  HomeOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  Typography,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import userApi from "../../apis/userApi";
import "./profile.scss";

const { confirm } = Modal;
const { Option } = Select;
const { Title } = Typography;
const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  const [isVisibleModal, setVisibleModal] = useState(false);
  const [profile, setProfile] = useState([]);
  const [oldPasswordError, setOldPasswordError] = useState(false);
  const [updatedImage, setUpdatedImage] = useState("");
  const [imageData, setImageData] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);

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
  const formatPhoneNumber = (phoneNumber) => {
    // Loại bỏ tất cả các ký tự không phải số
    const digitsOnly = phoneNumber.replace(/\D/g, "");
    return digitsOnly;
  };

  const handleList = () => {
    (async () => {
      try {
        const currentData = JSON.parse(localStorage.getItem("user"));
        setUserData(JSON.parse(localStorage.getItem("user")));
        const response = await userApi.getProfile(currentData.userId);
        setProfile(response);
        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch profile user:" + error);
      }
    })();
  };

  useEffect(() => {
    handleList();
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    setImageInfo(profile?.avatar);
  }, [profile?.avatar]);

  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);

  const handleFormSubmit = async (values) => {
    try {
      let form = new FormData();
      form.append("firstName", values.firstname);
      form.append("lastName", values.lastname);
      form.append("address", values.address);
      form.append("email", values.email);
      form.append("phone", formatPhoneNumber(values.phone));
      // form.append("password", profile.password)
      form.append("avatar", updatedImage);

      await userApi.updateProfile(form, profile.accountId).then((response) => {
        console.log(response);
        if (response.firstname === "Email is duplicated") {
          notification.error({
            message: "Thông báo",
            description: "Email đã tồn tại",
          });
        } else if (response === "" || response === undefined) {
          notification.error({
            message: "Thông báo",
            description: "Cập nhật tài khoản thất bại",
          });
        } else {
          notification.success({
            message: "Thông báo",
            description: "Cập nhật tài khoản thành công",
          });
          setVisibleModal(false);
        }
      });
      handleList();
    } catch (error) {
      throw error;
    }
  };
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      if (values.currentPassword !== profile.password) {
        setOldPasswordError(true);
        return;
      }

      setOldPasswordError(false);

      let formatData = new FormData();
      formatData.append("currentPass", values.currentPassword);
      formatData.append("newPass", values.password);
      formatData.append("accountID", profile.accountId);
      await userApi.changePass(formatData).then((response) => {
        console.log(response);
        if (response.data === "") {
          notification.error({
            message: "Thông báo",
            description: "Cập nhật mật khẩu thất bại",
          });
        } else {
          notification.success({
            message: "Thông báo",
            description: "Cập nhật mật khẩu thành công",
          });
          setPasswordModalVisible(false);
          form.resetFields();
        }
      });
      handleList();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const validateName = (_, value) => {
    const specialCharacterRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    const digitRegex = /\d/;

    if (specialCharacterRegex.test(value) && digitRegex.test(value)) {
      return Promise.reject("Tên không được chứa ký tự đặc biệt và số");
    } else if (digitRegex.test(value)) {
      return Promise.reject("Tên không được chứa số");
    } else if (specialCharacterRegex.test(value)) {
      return Promise.reject("Tên không được chứa ký tự đặc biệt");
    }
    return Promise.resolve();
  };

  const validatePhone = (_, value) => {
    const formattedPhone = formatPhoneNumber(value);

    // Kiểm tra xem số điện thoại có hợp lệ hay không
    if (
      !/^[0-9]{10}$/.test(formattedPhone) ||
      !/^0[0-9]/.test(formattedPhone)
    ) {
      return Promise.reject("Số điện thoại không hợp lệ");
    }

    // Kiểm tra xem số điện thoại có chứa ký tự đặc biệt và chữ số cùng lúc không
    if (
      /[^0-9]/.test(formattedPhone) ||
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(formattedPhone)
    ) {
      return Promise.reject("Số điện thoại chỉ được chứa chữ số");
    }

    return Promise.resolve();
  };
  return (
    <div>
      <Spin spinning={loading}>
        <div style={{ marginTop: 20, marginLeft: 24 }}>
          <Breadcrumb
            items={[
              { title: <HomeOutlined />, key: 1 },
              { title: <span>Trang cá nhân</span>, key: 2 },
            ]}
          ></Breadcrumb>
        </div>
        <div className="single">
          <div className="singleContainer">
            <div className="top">
              <div className="left">
                <h1 className="title">Thông tin cá nhân</h1>
                <div className="item">
                  <img src={profile?.avatar} alt="" className="itemImg" />
                  <div className="details">
                    <div className="detailItem">
                      <span className="itemKey">Tên:</span>
                      <span className="itemValue">
                        {profile?.lastname} {profile?.firstname}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Email:</span>
                      <span className="itemValue">{profile?.email}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Số điện thoại:</span>
                      <span className="itemValue">{profile?.phone}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Địa chỉ:</span>
                      <span className="itemValue">{profile?.address}</span>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <Button
                        type="primary"
                        style={{ marginRight: 10 }}
                        onClick={() => setVisibleModal(true)}
                      >
                        Cập nhật Profile
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => setPasswordModalVisible(true)}
                      >
                        Đổi mật khẩu
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="right"></div>
            </div>
            <Modal
              open={isPasswordModalVisible}
              onCancel={() => setPasswordModalVisible(false)}
              footer={null}
            >
              <div className="changePassword">
                <Form
                  style={{ width: 400, marginBottom: 8 }}
                  name="normal_login"
                  form={form}
                  className="loginform"
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={onFinish}
                >
                  <Form.Item style={{ marginBottom: 3 }}>
                    <Divider
                      style={{ marginBottom: 5, fontSize: 19 }}
                      orientation="center"
                    >
                      THAY ĐỔI MẬT KHẨU
                    </Divider>
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 16, textAlign: "center" }}>
                    <p className="text">Nhập thông tin dưới đây</p>
                  </Form.Item>

                  <Form.Item
                    name="currentPassword"
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mật khẩu cũ!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value) {
                            return Promise.resolve();
                          }
                          if (value === profile.password) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error("Sai mật khẩu cũ!"));
                        },
                      }),
                    ]}
                    validateTrigger="onBlur"
                  >
                    <Input.Password placeholder="Mật khẩu cũ" />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mật khẩu mới!",
                      },
                      {
                        pattern:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{6,20}$/,
                        message:
                          "Mật khẩu phải bao gồm ít nhất một chữ in hoa, một chữ thường, một số và một ký tự đặc biệt. Độ dài từ 6 đến 20 ký tự.",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password placeholder="Mật khẩu mới" />
                  </Form.Item>

                  <Form.Item
                    name="confirm"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Nhập lại mật khẩu mới!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }

                          return Promise.reject(
                            new Error(
                              "Xác nhận lại mật khẩu mới không khớp. Vui lòng kiểm tra và thử lại!"
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="Xác nhận lại mật khẩu" />
                  </Form.Item>

                  <Form.Item style={{ width: "100%", marginTop: 20 }}>
                    <Button className="button" type="primary" htmlType="submit">
                      Hoàn Thành
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Modal>
            <div>
              <Modal
                title="Cập nhật thông tin cá nhân"
                open={isVisibleModal}
                onCancel={() => setVisibleModal(false)}
                footer={null}
              >
                <Form
                  initialValues={{
                    lastname: profile?.lastname,
                    firstname: profile?.firstname,
                    email: profile?.email,
                    phone: profile?.phone,
                    address: profile?.address,
                    avatar: profile?.avatar,
                  }}
                  onFinish={handleFormSubmit}
                >
                  <Form.Item
                    label="Tên"
                    name="firstname"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên!",
                      },
                      {
                        validator: validateName,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Họ"
                    name="lastname"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập họ!",
                      },
                      {
                        validator: validateName,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        type: "email",
                        message: "Email không hợp lệ!",
                      },
                      {
                        required: true,
                        message: "Vui lòng nhập email!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại!",
                      },
                      {
                        validator: validatePhone,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập địa chỉ!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="avatar"
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
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Cập nhật
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default Profile;
