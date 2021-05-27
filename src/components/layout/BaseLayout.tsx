import React from 'react';
import { Link } from 'react-router-dom'
import { Layout, Menu, Space, Divider, Button, Tooltip } from 'antd';
import { githubPage, version } from '../../config/config'
import routes from '../../routes';
import { ReactComponent as Myico } from '../../assets/myico.svg';
import { 
  DashboardFilled,
  InfoCircleOutlined,
  UnorderedListOutlined,
  GithubFilled,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';


const { Content, Sider, Header, Footer } = Layout;

export default class BaseLayout extends React.Component {
  state = {
    collapsed: false,
    lastUpdate: new Date().toLocaleTimeString()
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <>
      <Layout style={{ minHeight: "100vh" }}>
      <Sider
          collapsible
          collapsed={this.state.collapsed}
          trigger={null}>
          <div className="sider-logo" style={{padding: ".3em"}}>
            <Myico style={{display: "block", height: "3.4em", width: "3.4em", margin: "0 auto" }}/>
          </div>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ borderRight: 0, backgroundColor: "#3f4d67" }}
            theme="dark"
            >
              <Menu.Item key="1" icon={<DashboardFilled />}><Link to="/admin">Dashboard</Link></Menu.Item>
              <Menu.Item key="2" icon={<UnorderedListOutlined />}><Link to="/admin/tasksjournal">Tasks journal</Link></Menu.Item>
              <Menu.Item key="3" icon={<InfoCircleOutlined />}><Link to="/admin/about">About</Link></Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header>
          {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: this.toggle,
              id: "components-layout-demo-custom-trigger"
          })}
          <div className="heder-menu" style={{float: "right", marginLeft: "auto", marginRight: 0}}>
            <div className="header-menu-item">
              <div className="header-menu-item-cnt">
                <Tooltip placement="bottom" title="Open help page">
                  <Link target={"_blank"} to="/help"><QuestionCircleOutlined /></Link>
                  {/* <Link target={"_blank"} to="/lootnika/help/index.html"><QuestionCircleOutlined /></Link> */}
                </Tooltip>
              </div>
            </div>
            <div className="header-menu-item"></div>
          </div>
          </Header>
          <Content id="content">
            {routes()}
            <div id="lastUpdate">
              <span>Last update: {this.state.lastUpdate}</span>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center', color: "#000" }}>
            <Space
              size="middle"
              align="center"
              split={<Divider type="vertical" style={{borderLeft: "0.05rem solid #000"}} />}>
                <Button type="text" target={"_blank"} href={githubPage + "/lootnika"} size="large" icon={<GithubFilled />} style={{marginRight: "-0.5em"}}>
                </Button>
                <div>Lootnika control panel {version}</div>
            </Space>
            {/* <div className="footer-menu" style={{float: "right", marginLeft: "auto", marginRight: 0}}>
              <div className="footer-menu-item">
                <div className="footer-menu-item-cnt">

                </div>
              </div>
            </div> */}
        </Footer>
        </Layout>
      </Layout>
      </>
    )
  }
}

