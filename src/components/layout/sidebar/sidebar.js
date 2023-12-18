import { CrownOutlined, CustomerServiceOutlined, FolderOpenOutlined, FileOutlined, FormOutlined, InfoCircleOutlined, ShoppingOutlined, SnippetsOutlined, TeamOutlined, TrophyOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import "./sidebar.css";

const { Sider } = Layout;

function Sidebar() {

  const history = useHistory();
  const location = useLocation();
  const [user, setUser] = useState([]);

  const menuSidebarAdmin = [
    {
      key: "account-management",
      title: "Quản Lý Tài Khoản",
      link: "/account-management",
      icon: <UserOutlined />
    },
  ];

  const menuSidebarCaptain = [
    {
      key: "campaign-management",
      title: "Quản lý chiến dịch",
      link: "/campaign-management",
      icon: <FormOutlined />
    },
    {
      key: "financial-management",
      title: "Báo cáo tài chính",
      link: "/financial-management",
      icon: <ShoppingOutlined />
    },
    {
      key: "task-reports-management",
      title: "Báo cáo nhiệm vụ",
      link: "/task-reports-management",
      icon: <FileOutlined />
    },
    {
      key: "donor-management",
      title: "Quản lý tri ân",
      link: "/donor-management",
      icon: <TrophyOutlined />
    },
    {
      key: "milestone-management",
      title: "Quản lý mốc sự kiện",
      link: "/milestone-management",
      icon: <CrownOutlined />
    },
    {
      key: "reports-management",
      title: "Báo cáo",
      link: "/reports-management",
      icon: <SnippetsOutlined />
    },
    {
      key: "issue-management",
      title: "Vấn đề",
      link: "/issue-management",
      icon: <InfoCircleOutlined />
    },
  ];

  const menuSidebarTresurer = [
    {
      key: "campaign-management",
      title: "Quản lý chiến dịch",
      link: "/campaign-management",
      icon: <FormOutlined />
    },
    {
      key: "task-reports-management",
      title: "Báo cáo nhiệm vụ",
      link: "/task-reports-management",
      icon: <FileOutlined />
    },
    {
      key: "donor-management",
      title: "Quản lý tri ân",
      link: "/donor-management",
      icon: <TrophyOutlined />
    },
    {
      key: "milestone-management",
      title: "Quản lý mốc sự kiện",
      link: "/milestone-management",
      icon: <CrownOutlined />
    },
    {
      key: "financial-management",
      title: "Báo cáo tài chính",
      link: "/financial-management",
      icon: <ShoppingOutlined />
    },
    {
      key: "issue-management",
      title: "Vấn đề",
      link: "/issue-management",
      icon: <InfoCircleOutlined />
    },
  ];

  const menuSidebarPlanningManager= [
    {
      key: "campaign-management",
      title: "Quản lý chiến dịch",
      link: "/campaign-management",
      icon: <FormOutlined />
    },
    {
      key: "task-reports-management",
      title: "Báo cáo nhiệm vụ",
      link: "/task-reports-management",
      icon: <FileOutlined />
    },
    {
      key: "donor-management",
      title: "Quản lý tri ân",
      link: "/donor-management",
      icon: <TrophyOutlined />
    },
    {
      key: "milestone-management",
      title: "Quản lý mốc sự kiện",
      link: "/milestone-management",
      icon: <CrownOutlined />
    },
    {
      key: "financial-management",
      title: "Báo cáo tài chính",
      link: "/financial-management",
      icon: <ShoppingOutlined />
    },
    {
      key: "request-volunteer",
      title: "Tình nguyện viên",
      link: "/request-volunteer",
      icon: <TeamOutlined />
    },
    {
      key: "issue-management",
      title: "Vấn đề",
      link: "/issue-management",
      icon: <InfoCircleOutlined />
    },
   
  ];

  const menuSidebarCommunicationManager = [
    {
      key: "campaign-management",
      title: "Quản lý chiến dịch",
      link: "/campaign-management",
      icon: <FormOutlined />
    },
    {
      key: "task-reports-management",
      title: "Báo cáo nhiệm vụ",
      link: "/task-reports-management",
      icon: <FileOutlined />
    },
    {
      key: "donor-management",
      title: "Quản lý tri ân",
      link: "/donor-management",
      icon: <TrophyOutlined />
    },
    {
      key: "milestone-management",
      title: "Quản lý mốc sự kiện",
      link: "/milestone-management",
      icon: <CrownOutlined />
    },
    {
      key: "news-management",
      title: "Tin tức",
      link: "/news-management",
      icon: <CrownOutlined />
    },
    {
      key: "story-management",
      title: "Quản lý câu chuyện",
      link: "/story-management",
      icon: <CustomerServiceOutlined />
    },
    {
      key: "financial-management",
      title: "Báo cáo tài chính",
      link: "/financial-management",
      icon: <ShoppingOutlined />
    },
    {
      key: "issue-management",
      title: "Vấn đề",
      link: "/issue-management",
      icon: <InfoCircleOutlined />
    },
    {
      key: "media-management",
      title: "Media",
      link: "/media-management",
      icon: <FolderOpenOutlined />
    },
  ];

  const navigate = (link, key) => {
    history.push(link);
  }

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, [])

  return (
    <Sider
      className={'ant-layout-sider-trigger'}
      width={215}
      style={{
        position: "fixed",
        top: 55,
        height: '100%',
        left: 0,
        padding: 0,
        zIndex: 1,
        marginTop: 0,
        boxShadow: " 0 1px 4px -1px rgb(0 0 0 / 15%)"
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={location.pathname.split("/")}
        defaultOpenKeys={['account']}
        style={{ height: '100%', borderRight: 0, backgroundColor: "#FFFFFF" }}
        theme='light'
      >

        {user.role === "trưởng nhóm" ? (
          menuSidebarCaptain.map((map) => (
            <Menu.Item
              onClick={() => navigate(map.link, map.key)}
              key={map.key}
              icon={map.icon}
              className="customeClass"
            >
              {map.title}
            </Menu.Item>
          ))
        ) : user.role === "Admin" ? (
          menuSidebarAdmin.map((map) => (
            <Menu.Item
              onClick={() => navigate(map.link, map.key)}
              key={map.key}
              icon={map.icon}
              className="customeClass"
            >
              {map.title}
            </Menu.Item>
          ))
        )  : user.role === "kế toán" ? (
          menuSidebarTresurer.map((map) => (
            <Menu.Item
              onClick={() => navigate(map.link, map.key)}
              key={map.key}
              icon={map.icon}
              className="customeClass"
            >
              {map.title}
            </Menu.Item>
          ))
        ) : user.role === "trưởng ban kế hoạch"  ? (
          menuSidebarPlanningManager.map((map) => (
            <Menu.Item
              onClick={() => navigate(map.link, map.key)}
              key={map.key}
              icon={map.icon}
              className="customeClass"
            >
              {map.title}
            </Menu.Item>
          ))
        ) : user.role === "trưởng ban sự kiện" ? (
          menuSidebarCommunicationManager.map((map) => (
            <Menu.Item
              onClick={() => navigate(map.link, map.key)}
              key={map.key}
              icon={map.icon}
              className="customeClass"
            >
              {map.title}
            </Menu.Item>
          ))
        ) : null}
      </Menu>

    </Sider >
  );
}

export default Sidebar;