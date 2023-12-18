import { Button, Form, Input, Select, Spin, notification } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axiosClient from "../../../apis/axiosClient";
import "./accountCreate.css";

const AccountCreate = () => {
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const history = useHistory();

  // function hasSpecialCharacters(input) {
  //     const specialCharacterRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  //     return specialCharacterRegex.test(input);
  // }

  // function hasDigits(input) {
  //     const digitRegex = /\d/;
  //     return digitRegex.test(input);
  // };
  const formatPhoneNumber = (phoneNumber) => {
    // Loại bỏ tất cả các ký tự không phải số
    const digitsOnly = phoneNumber.replace(/\D/g, "");
    return digitsOnly;
  };

  const accountCreate = async (values) => {
    // if (hasSpecialCharacters(values.firstname)) {
    //     notification.error({
    //         message: 'Thông báo',
    //         description: 'Tên không được chứa kí tự đặc biệt',
    //     });
    //     return;
    // }

    // if (hasSpecialCharacters(values.lastname)) {
    //     notification.error({
    //         message: 'Thông báo',
    //         description: 'Họ không được chứa kí tự đặc biệt',
    //     });
    //     return;
    // }

    // if (hasDigits(values.firstname)) {
    //     notification.error({
    //         message: 'Thông báo',
    //         description: 'Họ không được chứa chữ số',
    //     });
    //     return;
    // }

    // if (hasDigits(values.lastname)) {
    //     notification.error({
    //         message: 'Thông báo',
    //         description: 'Tên không được chứa chữ số',
    //     });
    //     return;
    // }

    try {
      const formatData = {
        email: values.email,
        phone: formatPhoneNumber(values.phone),
        password: values.password,
        firstname: values.firstname,
        lastname: values.lastname,
        avatar: values.avatar,
        address: values.address,
        roleId: values.roleId,
        departmentId: "1",
      };

      await axiosClient.post("/accounts", formatData).then((response) => {
        console.log(response);
        if (response.firstname == "Email is duplicated") {
          notification.error({
            message: "Thông báo",
            description: "Email đã tồn tại",
          });
        } else if (response.data === "" || response === undefined) {
          notification.error({
            message: "Thông báo",
            description: "Tạo tài khoản thất bại",
          });
        } else {
          notification.success({
            message: "Thông báo",
            description: "Tạo tài khoản thành công",
          });
          form.resetFields();
          history.push("/account-management");
        }
      });
    } catch (error) {
      throw error;
    }
    setTimeout(function () {
      setLoading(false);
    }, 1000);
  };

  const CancelCreateAccount = () => {
    form.resetFields();
    history.push("/account-management");
  };

  useEffect(() => {
    setTimeout(function () {
      setLoading(false);
    }, 500);
  }, []);

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
    <div className="create_account">
      <h1
        style={{
          borderRadius: 1,
          marginTop: 40,
          marginBottom: 0,
          padding: 15,
          color: "#FFFFFF",
          background: "linear-gradient(to right, #2D754E, #5E9F6B, #74C99B)",
        }}
      >
        Tạo tài khoản
      </h1>
      <div className="create_account__dialog">
        <Spin spinning={loading}>
          <Form
            form={form}
            onFinish={accountCreate}
            name="accountCreate"
            layout="vertical"
            initialValues={{
              residence: ["zhejiang", "hangzhou", "xihu"],
              prefix: "86",
            }}
            scrollToFirstError
          >
            <Form.Item
              name="firstname"
              label="Họ"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập họ!",
                },
                {
                  validator: validateName,
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Họ" />
            </Form.Item>

            <Form.Item
              name="lastname"
              label="Tên"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên!",
                },
                {
                  validator: validateName,
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Tên" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              hasFeedback
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
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu!",
                },
                {
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{6,20}$/,
                  message:
                    "Mật khẩu phải bao gồm ít nhất một chữ in hoa, một chữ thường, một số và một ký tự đặc biệt. Độ dài từ 6 đến 20 ký tự.",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input.Password placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại!",
                },
                {
                  validator: validatePhone,
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Số điện thoại" />
            </Form.Item>

            {/* <Form.Item
                            name="avatar"
                            label="Ảnh đại diện"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập URL ảnh đại diện!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="URL ảnh đại diện" />
                        </Form.Item> */}

            <Form.Item
              name="address"
              label="Địa chỉ"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập địa chỉ!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Địa chỉ" />
            </Form.Item>

            <Form.Item
              name="roleId"
              label="Phân quyền"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn role!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Select placeholder="Chọn role">
                <Select.Option value="1">Quản Trị Viên</Select.Option>
                <Select.Option value="2">Trưởng nhóm</Select.Option>
                <Select.Option value="3">Ban kế hoạch</Select.Option>
                <Select.Option value="4">Trưởng ban sự kiện</Select.Option>
                <Select.Option value="5">Ban Kế Toán</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                style={{
                  background: "#FF8000",
                  color: "#FFFFFF",
                  float: "right",
                  marginTop: 20,
                  marginLeft: 8,
                }}
                htmlType="submit"
              >
                Hoàn thành
              </Button>
              <Button
                style={{
                  background: "#FF8000",
                  color: "#FFFFFF",
                  float: "right",
                  marginTop: 20,
                }}
                onClick={CancelCreateAccount}
              >
                Hủy
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </div>
  );
};

export default AccountCreate;
