import React, { useEffect, useState } from 'react';
import "./header.css";
import logo from "../../../assets/image/logo.png";
import MenuDropdown from "../../DropdownMenu/dropdownMenu";
import { Layout, Dropdown, Badge, Row, Col, Popover, Modal, List, Avatar, Menu } from 'antd';
import { TranslationOutlined, BellOutlined, NotificationTwoTone } from '@ant-design/icons';
import userApi from "../../../apis/userApi";

const { Header } = Layout;

function Topbar() {

  const [countNotification, setCountNotification] = useState(0);
  const [notification, setNotification] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visiblePopover, setVisiblePopover] = useState(false);
  const [titleNotification, setTitleNotification] = useState('');
  const [contentNotification, setContentNotification] = useState('');

  const handleNotification = (valuesContent, valuesTitile) => {
    setVisible(true);
    setVisiblePopover(visible !== visible)
    setContentNotification(valuesContent);
    setTitleNotification(valuesTitile);
  }

  const handleOk = () => {
    setVisible(false);
  }

  useEffect(() => {
    (async () => {
      try {
        const response = await userApi.pingRole();
        console.log(response.role);
      } catch (error) {
        console.log('Failed to fetch event list:' + error);
      }
    })();
  }, [])

  return (
    <div
      className="header"
      style={{ background: "#FFFFF", padding: 0, margin: 0 }}
    >
      <div >
        <Row className="header" style={{ background: "#FFFFFF", top: 0, position: 'fixed', left: 0, display: 'flex', width: '100%', padding: 0, zIndex: 2, justifyContent: 'center', alignItems: 'center' }}>
          <Col span={10}>
            <div style={{ position: 'relative', display: 'flex', paddingTop: 3, paddingBottom: 3, alignItems: "center", marginLeft: 8 }}>
              <Row
                justify="center"
              >
                <Col style={{ paddingLeft: 20 }}>
                  <a href="#">
                    <img style={{ height: 44 }} className="logo" alt="" src={logo} />
                  </a>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={6} offset={8}>
            <div style={{ display: 'flex', padding: 5, justifyContent: 'center', flexDirection: 'row', float: 'right', alignItems: "center", marginRight: 48 }}>
              <Row>
                <MenuDropdown key="image" />
              </Row>
              <Row>
              </Row>
            </div>
          </Col>
        </Row>
        <Modal
          title={titleNotification}
          open={visible}
          onOk={handleOk}
          onCancel={handleOk}
          cancelButtonProps={{ style: { display: 'none' } }}
        >
          <p dangerouslySetInnerHTML={{ __html: contentNotification }} ></p>
        </Modal>
      </div>
    </div >
  );
}

export default Topbar;