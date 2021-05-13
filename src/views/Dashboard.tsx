import React from "react";
import { Space, Card, List, Button, Modal, message, Popover } from 'antd';
import { 
  PoweroffOutlined,
  PauseOutlined,
  CloseSquareOutlined,
  StepForwardOutlined,
  CaretRightOutlined,
  ThunderboltOutlined,
  BorderOutlined }
from '@ant-design/icons';
import Icon from '@ant-design/icons';
import { axiosGetFake, axiosGet } from '../utils/public';
import { Res } from '../config/index.type';
import { getstatus, tasksinfo, queueinfo, stop } from '../store/apiExamples';
import { runInThisContext } from "node:vm";

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
    cardSchedule: {
      scheduler_status: '',
      next_start_time: '',
      remained_cycles: '',
    },
    cardInfoLoading: true,
    cardScheduleLoading: true,
    stopModalShow: false,
    canStopSchedule: false,
    canEnableSchedule: false,
    canStopLootnika: false,
    startPause: {
      active: false,
      type: "start",
      loading: false,
    }

  }

  async updateStateFromKeys(stateObj: {}, stateObjName: string, obj: LooseObject) {
    let m:LooseObject = {};

    Object.keys(stateObj).forEach(k => {
      m[k] = obj[k];
    });
    this.setState({ [stateObjName]: m});
  }

  async updateStatus(){
    // let resp: Res = await axiosGet('a=getstatus');
    let dt = new Date()
    getstatus.uptime = "24 day " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds()
    let resp = await axiosGetFake('a=getstatus', {status: 200, data: getstatus}, 1000);
    if (resp){
      await this.updateStateFromKeys(this.state.cardAccess, 'cardAccess', resp?.data);
      await this.updateStateFromKeys(this.state.cardStatus, 'cardStatus', resp?.data);
      await this.updateStateFromKeys(this.state.cardInfo, 'cardInfo', resp?.data);
    }
  }

  async updateSchedule() {
    let resp = await axiosGetFake('a=schedule?cmd=QueueInfo&limit=0', {status: 200, data: queueinfo}, 1500);
    // let resp = await axiosGet('a=schedule?cmd=QueueInfo&limit=0');
    if (resp){
      await this.updateStateFromKeys(this.state.cardSchedule, 'cardSchedule', resp?.data);
      
      let canStop = true
      if(["cancel", "ready", "wait"].indexOf(resp.data["scheduler_status"]) !== -1){
        canStop = false
      }
      
      let active = true
      if("cancel" === resp.data["scheduler_status"]){
        active = false
      }
      
      let type = "start"
      if("pause" === resp.data["scheduler_status"]){
        type = "resume"
      }else if("work" === resp.data["scheduler_status"]){
        type = "pause"
      }
      this.setState({startPause: {active: active, type: type}, canStopSchedule: canStop})
    }
  }
  
  async componentDidMount() {
    await this.updateStatus();
    this.setState({ cardInfoLoading: false, canStopLootnika: true });

    await this.updateSchedule();
    this.setState({ cardScheduleLoading: false });

    setInterval(() => this.updateStatus(), 3000)
    setInterval(() => this.updateSchedule(), 2000)
  }
  
  async togleStopModal() {
    this.setState({
      stopModalShow: !this.state.stopModalShow,
    });
  };
  
  async stopLootnika() {
    this.setState({canStopLootnika: false})
    // let resp = await axiosGet('a=stop');
    let resp = await axiosGetFake('a=stop', {status: 200, data: stop}, 500);

    if (resp){
      if(resp.data.status === "ok"){
        message.success("Lootnika is stopping...");
      }else{
        message.error("Error: " + resp.data.message);
      }
    }else{
      message.error("Fail to stop Lootnika");
    }
    this.togleStopModal()
  }

  async sendCmdSchedule(cmd: string) {
    this.setState({
      canStopSchedule: false,
      startPause: {
        loading: true,
        active: this.state.startPause.active,
        type: this.state.startPause.type
      }
    })
    
    if(cmd === "Resume"){
      console.log(3434)
      //fake
      let resp = await axiosGetFake(
        'a=schedule?cmd=QueueInfo&limit=1',
        {status: 200, data: {status: "ok", message: "returned 1 tasks", tasks: [{name: "user_topics"}]}},
        1200
      );
      //fake

      // let resp = await axiosGet('a=schedule?cmd=QueueInfo&limit=1');
      if (resp){
        if(resp.data.status === "ok"){
          cmd = "Start&TaskName=" + resp.data.tasks[0].name
        }else{
          message.error("Error: " + resp.data.message);
        }
      }else{
        message.error("Fail to execute command");
      }
    }
    
    // fake
    let resp = await axiosGetFake('a=schedule?cmd=' + cmd, {status: 200, data: {status: "ok", message: ""}}, 800);
    let status = "pause"
    if(cmd === "Start&TaskName=user_topics"){
      resp = await axiosGetFake(
        'a=schedule?cmd=QueueInfo&limit=1',
        {status: 200, data: {status: "ok", message: "Success: successfully continue task user_topics"}},
        600
      );
      status = "work"
    }else if(cmd === 'Start'){
      resp = await axiosGetFake(
        'a=Start',
        {status: 200, data: {status: "ok", message: "Success: successfully runnin all tasks"}},
        600
      );
      status = "work"
    }else if(cmd === 'Cancel'){
      status = "ready"
    }

    queueinfo.scheduler_status = status
    //fake

    // let resp = await axiosGet('a=schedule?cmd=' + cmd);
    if (resp){
      if(resp.data.status === "ok"){
        message.success("Success: " + resp.data.message);
      }else{
        message.error("Error: " + resp.data.message);
      }
    }else{
      message.error("Fail to execute command");
    }
  }

  
  activateSchedule = (
    <div>
      <p>Not working yet (ಥ﹏ಥ)</p>
    </div>
  );

  pauseButton(type: string) {
    const bType: LooseObject = {
      "pause":
        <Button 
        className="button-danger"
        type="primary"
        loading={this.state.startPause.loading}
        disabled={!this.state.startPause.active}
        icon={<PauseOutlined />}
        onClick={() => this.sendCmdSchedule("Pause")}>
        Pause
        </Button>,
      "start": 
        <Button 
        // className="button-danger"
        type="primary"
        loading={this.state.startPause.loading}
        disabled={!this.state.startPause.active}
        icon={<StepForwardOutlined />}
        onClick={() => this.sendCmdSchedule("Start")}>
        Run once
        </Button>,
      "resume": 
        <Button 
        type="primary"
        loading={this.state.startPause.loading}
        disabled={!this.state.startPause.active}
        icon={<CaretRightOutlined />}
        onClick={() => this.sendCmdSchedule("Resume")}>
        Resume
        </Button>,
    }
    return(bType[type])
  }

  enableSchedule(active: boolean){
    if(active){
      return(
        <Popover content={this.activateSchedule} title="Disable schedule" trigger="click">
          <Button 
          type="primary"
          disabled={!this.state.startPause.active}
          icon={<ThunderboltOutlined />}
          >
          Enable
          </Button>
        </Popover>
      )
    }else{
      return(
        <Popover content={this.activateSchedule} title="Disable schedule" trigger="click">
          <Button
          disabled={!this.state.startPause.active}
          icon={<PoweroffOutlined />}
          >
          Disable
          </Button>
        </Popover>
      )
    }
  }

  render() {
    return (
      <>
        <Modal
        title="Stop lootnika"
        visible={this.state.stopModalShow}
        onOk={() => this.stopLootnika()}
        onCancel={() => this.togleStopModal()}
        okText="Stop anyway"
        cancelText="Cancel"
      >
        <p>You trying to stop Lootnika</p>
        <p>Lootnika control panel will not work</p>
        <p>Are you sure?</p>
      </Modal>
      <Space align="start" size="middle" wrap>
          <Card title="Schedule" loading={this.state.cardScheduleLoading} style={{minWidth: "30em", maxWidth: "60em"}}>
            <List
              dataSource={Object.entries(this.state.cardSchedule)}
              renderItem={item => 
                <List.Item style={{display: "block"}}>
                  <span className="simple-list-item" style={{width: "10em", display: "inline-block" }}>{item[0]}</span>
                  <span className="simple-list-item" style={{display: "inline-block" }}>{item[1]}</span>
                  </List.Item>
              }
            />
          </Card>
          <Card title="Control" loading={this.state.cardInfoLoading} style={{minWidth: "30em", maxWidth: "60em"}}>
            <List>
              <List.Item>
                <List.Item.Meta title="Lootnika" />
                <Button 
                  danger type="primary"
                  disabled={!this.state.canStopLootnika}
                  icon={<PoweroffOutlined />} onClick={() => this.togleStopModal()}
                  >
                    Stop lootnika
                  </Button>
                </List.Item>
              <List.Item style={{display: "block"}}>
                <List.Item.Meta title="Schedule" />
                <Space>
                  {this.enableSchedule(this.state.canEnableSchedule)}
                  {this.pauseButton(this.state.startPause.type)}
                  <Button
                    danger
                    type="primary"
                    disabled={!this.state.canStopSchedule}
                    icon={<BorderOutlined />}
                    onClick={() => this.sendCmdSchedule("Cancel")}>
                    Abort task
                  </Button>
                </Space>
              </List.Item>
            </List>
          </Card>
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
