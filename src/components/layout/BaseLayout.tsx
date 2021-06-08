import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom'
import prettyBytes from 'pretty-bytes';
import routes from '../../routes';
import { AppContext } from '../../AppProvider';
import { axiosGetFake, axiosGet, useInterval, random_number } from '../../utils/public';
import { getstatus, } from '../../store/apiExamples';
import { Res } from '../../config/index.type';
import { Layout, Menu, Space, Divider, Button, Tooltip } from 'antd';
import { githubPage, version, demoMode } from '../../config/config'
import { ReactComponent as Myico } from '../../assets/myico.svg';
import { 
  HomeFilled,
  ScheduleFilled,
  ReadFilled,
  GithubFilled,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  InfoCircleFilled,
  QuestionCircleOutlined
} from '@ant-design/icons';


const { Content, Sider, Header, Footer } = Layout;

export default function BaseLayout() {
  const [collapsed, setСollapsed] = useState(false);
  const [lastUpdate, set_lastUpdate] = useState(new Date().toLocaleTimeString());
  const getStatusPending = useState([false])[0];
  const delay = useState([200])[0];
  const inited = useState([false])[0];

  let { cardStatus, cardStatusLoading, statusBarConfig, set_cardStatusLoading } = useContext(AppContext);

  async function updateStatus() {
    if (getStatusPending[0]){
      return
    }

    getStatusPending[0] = true;
    let resp: Res
    if(demoMode){
      let dt = new Date()
      let ramUse = random_number(3965752576, 4665752576)
      let lotnikaRam = random_number(3,8)
      getstatus.uptime = "24 day " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds()
      getstatus.cpu = random_number(15,88)
      getstatus.ram_free = getstatus.ram_total - ramUse
      getstatus.ram_available = getstatus.ram_free
      getstatus.ram_used = ramUse
      getstatus.ram_lootnika_percent = lotnikaRam
      resp = await axiosGetFake('a=getstatus', {status: 200, data: getstatus}, 600);
    }else{
      resp = await axiosGet('a=getstatus');
    }

    if (resp){
      let a = resp?.data
      let lotnikaRam = a.ram_total * a.ram_lootnika_percent * 0.01
      statusBarConfig.data = [
        {
          kind: 'free ' + prettyBytes(a.ram_free, {minimumFractionDigits: 2}),
          line: '',
          value: a.ram_free,
        },
        {
          kind: 'used ' + prettyBytes(a.ram_used, {minimumFractionDigits: 2}),
          line: '',
          value: a.ram_used
        },
        {
          kind: 'lootnika ' + prettyBytes(lotnikaRam, {minimumFractionDigits: 2}),
          line: '',
          value: lotnikaRam
        },
      ]

      let data = {
        status: a.status,
        uptime: a.uptime, 
        cpu: a.cpu + ' %',
        ram_total: prettyBytes(a.ram_total, {minimumFractionDigits: 2}),
        ram_available: `${prettyBytes(a.ram_available, {minimumFractionDigits: 2})} (${(100 - a.ram_percent).toFixed(2)} %)`,
        ram_used: `${prettyBytes(a.ram_used, {minimumFractionDigits: 2})} (${a.ram_percent.toFixed(2)} %)`,
        ram_free: `${prettyBytes(a.ram_free, {minimumFractionDigits: 2})} (${(100 - a.ram_percent).toFixed(2)} %)`,
        ram_lootnika: `${prettyBytes(lotnikaRam)} (${a.ram_lootnika_percent.toFixed(2)} %)`
      }
      cardStatus[0] = data
      set_lastUpdate(new Date().toLocaleTimeString())
      
      if (cardStatusLoading){
        set_cardStatusLoading(false)
      }
    }

    getStatusPending[0] = false;
  }
  

  useInterval(
    () => {
      updateStatus();
    }, delay[0]
  );

  if (!inited[0]){
    delay[0] = 3000
    inited[0] = true
  }

    return (
      <>
      <Layout style={{ minHeight: "100vh" }}>
      <Sider
          collapsible
          collapsed={collapsed}
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
              <Menu.Item key="1" icon={<HomeFilled />}><Link to="/admin">Dashboard</Link></Menu.Item>
              <Menu.Item key="2" icon={<ScheduleFilled />}><Link to="/admin/tasksjournal">Tasks journal</Link></Menu.Item>
              <Menu.Item key="3" icon={<ReadFilled />}><Link to="/admin/logging">Logs</Link></Menu.Item>
              <Menu.Item key="4" icon={<InfoCircleFilled />}><Link to="/admin/about">About</Link></Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setСollapsed(!collapsed),
              id: "components-layout-demo-custom-trigger"
          })}
          <div className="heder-menu" style={{float: "right", marginLeft: "auto", marginRight: 0}}>
            <div className="header-menu-item">
              <div className="header-menu-item-cnt">
                <Tooltip placement="bottom" title="Open help page">
                  <Link target={"_blank"} to={demoMode ? "/lootnika/help/index.html" : "/help"}><QuestionCircleOutlined /></Link>
                </Tooltip>
              </div>
            </div>
            <div className="header-menu-item"></div>
          </div>
          </Header>
          <Content id="content">
            {routes()}
            <div id="lastUpdate">
              <span>Last update: {lastUpdate}</span>
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
