import React from "react";
import { Space, Card, List } from 'antd';
import { axiosGetFake, axiosGet } from '../utils/public';
import { Res } from '../config/index.type';
import { getstatus } from '../store/apiExamples';
import { demoMode } from '../config/config'

interface LooseObject {
  [key: string]: any
}

export default class Dashboard extends React.Component {
  state = {
    cardAccess:  {
      client_host: '',
      client_role: '',
    },
    cardStatus: {
      status: '',
      uptime: '',
    },
    cardInfo: {
      product: '',
      picker_type: '',
      version: '',
      directory: '',
      service_name: '',
    },
    cardInfoLoading: true,
  }

  async updateStateFromKeys(stateObj: {}, stateObjName: string, obj: LooseObject) {
    let m:LooseObject = {};

    Object.keys(stateObj).forEach(k => {
      m[k] = obj[k];
    });
    this.setState({ [stateObjName]: m});
  }

  async updateStatus(){
    let resp: Res
    if(demoMode){
      let dt = new Date()
      getstatus.uptime = "24 day " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds()
      resp = await axiosGetFake('a=getstatus', {status: 200, data: getstatus}, 1000);
    }else{
      resp = await axiosGet('a=getstatus');
    }

    if (resp){
      await this.updateStateFromKeys(this.state.cardAccess, 'cardAccess', resp?.data);
      await this.updateStateFromKeys(this.state.cardStatus, 'cardStatus', resp?.data);
      await this.updateStateFromKeys(this.state.cardInfo, 'cardInfo', resp?.data);
    }
  }
  
  async componentDidMount() {
    await this.updateStatus();
    this.setState({ cardInfoLoading: false });

    setInterval(() => this.updateStatus(), 3000)
  }

  render() {
    return (
      <>
      <Space align="start" size="middle" wrap>
          <Card title="Info" loading={this.state.cardInfoLoading} style={{minWidth: "30em", maxWidth: "60em"}}>
              <List
                dataSource={Object.entries(this.state.cardInfo)}
                renderItem={item => 
                  <List.Item style={{display: "block"}}>
                    <span className="simple-list-item" style={{width: "10em", display: "inline-block" }}>{item[0]}</span>
                    <span className="simple-list-item" style={{display: "inline-block" }}>{item[1]}</span>
                  </List.Item>
                }
              />
            </Card>
          <Card title="Status" loading={this.state.cardInfoLoading} style={{minWidth: "30em", maxWidth: "60em"}}>
              <List
                dataSource={Object.entries(this.state.cardStatus)}
                renderItem={item => 
                  <List.Item style={{display: "block"}}>
                    <span className="simple-list-item" style={{width: "10em", display: "inline-block" }}>{item[0]}</span>
                    <span className="simple-list-item" style={{display: "inline-block" }}>{item[1]}</span>
                  </List.Item>
                }
              />
            </Card>
          <Card title="Access" loading={this.state.cardInfoLoading} style={{minWidth: "30em", maxWidth: "60em"}}>
            <List
              dataSource={Object.entries(this.state.cardAccess)}
              renderItem={item => 
                <List.Item style={{display: "block"}}>
                  <span className="simple-list-item" style={{width: "10em", display: "inline-block" }}>{item[0]}</span>
                  <span className="simple-list-item" style={{display: "inline-block" }}>{item[1]}</span>
                </List.Item>
              }
            />
          </Card>
      </Space> 
    </>
    );
  };
}
