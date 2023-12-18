import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { Button, Form, Input, Select, Spin, notification } from 'antd';
import campaignApi from '../../../apis/campaignApi';
import axios from "axios";

const CreateMedia = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const [campaigns, setCampaigns] = useState([]);
    const [updatedImage, setUpdatedImage] = useState("");
    const [imageData, setImageData] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [uploadedVideo, setUploadeddVideo] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');

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

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const videoURL = URL.createObjectURL(file);
            setSelectedVideo(videoURL);
            setUploadeddVideo(file);
        }
    }

    const mediaCreate = async (e) => {
        const formData = new FormData();
        formData.append("idCampaign", selectedOption);
        formData.append("images", updatedImage);
        formData.append("video", uploadedVideo);
        await axios.post("http://localhost:8080/volunteer-campaign-management/api/v1/uploadMedia", formData)
            .then(response => {
                notification.success({
                    message: 'Thông báo',
                    description: 'Tạo thành công',
                });
                history.push("/media-management");
            })
    };

    const handleSelectedCampain = (e) => {
        setSelectedOption(e)
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await campaignApi.listCampaign();
                setCampaigns(response);
                setLoading(false);
            } catch (error) {
                console.log('Failed to fetch user list:' + error);
            }
        })();
        window.scrollTo(0, 0);

    }, [])
    return (
        <div className="create_account">
            <h1 style={{ borderRadius: 1, marginTop: 40, marginBottom: 0, padding: 15, color: "#FFFFFF", background: "linear-gradient(to right, #2D754E, #5E9F6B, #74C99B)" }}>Tạo Media</h1>
            <div className="create_account__dialog">
                <Spin spinning={loading}>
                    <Form
                        form={form}
                        onFinish={mediaCreate}
                        name="accountCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        {imageData && (
                            <img
                                src={imageData}
                                alt="Choose some img for slider"
                                className="create-post-image-preview"
                                max-width="30%"
                                max-height="30%"
                            />
                        )}
                        <Form.Item
                            name="avatar"
                            placeholder="Ảnh"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng đăng ảnh!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input type="file" accept="image/*" onChange={handleImageChange} />
                        </Form.Item>
                        {selectedVideo && (
                            <div>
                                <video controls width="300">
                                    <source src={selectedVideo} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        )}
                        <Form.Item
                            placeholder="Video"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng đăng video!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input type="file" accept="video/mp4,video/x-m4v,video/*" onChange={handleVideoChange} />
                        </Form.Item>

                        <Form.Item
                            name="roleId"
                            placeholder="Campaign"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn campaign!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select onChange={handleSelectedCampain}>
                                {
                                    campaigns.map((option, index) => (
                                        <>
                                            <Select.Option value={option.campaignId}>{option.name}</Select.Option>
                                        </>
                                    ))
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Button style={{ background: "#FF8000", color: '#FFFFFF', marginLeft: '50%', marginTop: 20 }} htmlType="submit">
                                Tạo
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        </div>
    )
}

export default CreateMedia;