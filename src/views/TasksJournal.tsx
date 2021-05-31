import React from "react";
import {
  Space,
  Card,
  Table,
  InputNumber,
  Button,
  Modal,
  List,
  Popover,
  message }
from 'antd';
import { 
    PoweroffOutlined,
    PauseOutlined,
    StepForwardOutlined,
    CaretRightOutlined,
    ThunderboltOutlined,
    BorderOutlined }
  from '@ant-design/icons';
import { axiosGetFake, axiosGet } from '../utils/public';
import { queueinfo, stop } from '../store/apiExamples';
import moment from 'moment';
import { demoMode } from '../config/config'
import { Res } from '../config/index.type';


interface LooseObject {
    [key: string]: any
  }

function timeConversion(duration: number) {
    const portions: string[] = [];
  
    const msInHour = 1000 * 60 * 60;
    const hours = Math.trunc(duration / msInHour);
    if (hours > 0) {
      portions.push(hours + 'h');
      duration = duration - (hours * msInHour);
    }
  
    const msInMinute = 1000 * 60;
    const minutes = Math.trunc(duration / msInMinute);
    if (minutes > 0) {
      portions.push(minutes + 'm');
      duration = duration - (minutes * msInMinute);
    }
  
    const seconds = Math.trunc(duration / 1000);
    if (seconds > 0) {
      portions.push(seconds + 's');
    }
  
    return portions.join(' ');
  }

export default class TasksJournal extends React.Component {
    state = {
        columns: [
            {
            title: 'Name',
            dataIndex: 'name',
            },{
            title: 'status',
            dataIndex: 'status',
            width: '6em',
            },{
            title: 'start time',
            dataIndex: 'start_time',
            width: '11em',
            },{
            title: 'end time',
            dataIndex: 'end_time',
            width: '11em',
            },{
            title: 'duration',
            dataIndex: 'duration',
            },{
            title: 'counts',
            dataIndex: 'counts',
            },
        ],
        rows: [],
        tableLoading: true,
        selectSize: 20,
        recordStart: 0,
        recordsTttl: 1,
        style: { paginationExt: { paddingTop: "0rem" }},
        cardSchedule: {
            scheduler_status: '',
            next_start_time: '',
            remained_cycles: '',
          },
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

    async componentDidMount() {
        await this.updateTable()

        await this.updateSchedule();
        this.setState({ cardScheduleLoading: false, canStopLootnika: true });

        setInterval(() => this.updateSchedule(), 2000)
    }

    setSelectSize(e: number) {
        if(e) {
            this.setState({ selectSize: e.valueOf() })
        }else{
            this.setState({ selectSize: 10 })
        }
    }
  
    setRecordStart(e: number) {
        if(e) {
            this.setState({ recordStart: e.valueOf() })
        }else{
            this.setState({ recordStart: 0 })
        }
    }
    
    appendRowsFake(tasks: Array<LooseObject>){
      let head = ["total", "seen", "new", "differ", "delete", "task error", "export error"]

      let fakeLimit = 0
      let fakeStart = 0
      let rowsData = []

      for (let row of tasks) {
        if (fakeStart >= this.state.recordStart){
          if (fakeLimit  < this.state.selectSize){
            let a = moment(row["end_time"], 'DD.MM.YYYY HH:mm:ss').valueOf() -
                    moment(row["start_time"],'DD.MM.YYYY HH:mm:ss').valueOf()
            row["duration"] = timeConversion(a)

            let s = ""
            head.forEach((k: string) => {
                s += k + ": " + row["count_" + k.replace(' ', '_')] + "\n"
            });
            
            row["counts"] = s + "last doc ID: " + row["last_doc_id"]
            rowsData.push(row)

            fakeLimit += 1
          }
          fakeStart += 1
        }
        fakeStart += 1
      }
      // console.log(rowsData)
      return rowsData
    }

    appendRows(tasks: Array<LooseObject>){
      let head = ["total", "seen", "new", "differ", "delete", "task error", "export error"]
      let rowsData = []

      for (let row of tasks) {
        let a = moment(row["end_time"], 'DD.MM.YYYY HH:mm:ss').valueOf() -
                moment(row["start_time"],'DD.MM.YYYY HH:mm:ss').valueOf()
        row["duration"] = timeConversion(a)

        let s = ""
        head.forEach((k: string) => {
            s += k + ": " + row["count_" + k.replace(' ', '_')] + "\n"
        });
        
        row["counts"] = s + "last doc ID: " + row["last_doc_id"]
        rowsData.push(row)
      }
      return rowsData
    }

    async updateTable () {
      this.setState({ tableLoading: true });
      
      let resp: Res
      if(demoMode){
          resp = await axiosGetFake(
              'a=schedule?cmd=QueueInfo&start=' + this.state.recordStart + '&limit=' + this.state.selectSize,
              {status: 200, data: queueinfo}, 600
          );
      }else{
          resp = await axiosGet('a=schedule?cmd=QueueInfo&start=' + this.state.recordStart + '&limit=' + this.state.selectSize);
      }

      let rowsData: Array<LooseObject> = []
      let ttl = 1
      if(resp){       
        if(resp.data.status === "ok"){
          if(demoMode){
            rowsData = this.appendRowsFake(resp.data.tasks)
          }else{
            rowsData = this.appendRows(resp.data.tasks)
          }
        }else{
          message.error("Error: " + resp.data.message);
        }
      }

      if(rowsData.length > 1){ ttl=rowsData.length }
      this.setState({rows: rowsData, recordsTttl: ttl, tableLoading: false});
    }

    async updateStateFromKeys(stateObj: {}, stateObjName: string, obj: LooseObject) {
        let m:LooseObject = {};
    
        Object.keys(stateObj).forEach(k => {
          m[k] = obj[k];
        });
        this.setState({ [stateObjName]: m});
    }

    async updateSchedule() {
        let resp: Res
        if(demoMode){
          resp = await axiosGetFake('a=schedule?cmd=QueueInfo&limit=0', {status: 200, data: queueinfo}, 200);
        }else{
          resp = await axiosGet('a=schedule?cmd=QueueInfo&limit=0');
        }
    
        if (resp){
          if(resp.data.status !== "ok"){
            message.error("Error: " + resp.data.message);
          }else{
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
    }

    async togleStopModal() {
        this.setState({
          stopModalShow: !this.state.stopModalShow,
        });
    };
      
      async stopLootnika() {
        this.setState({canStopLootnika: false})
    
        let resp: Res
        if(demoMode){
          resp = await axiosGetFake('a=stop', {status: 200, data: stop}, 500);
        }else{
          resp = await axiosGet('a=stop');
        }
    
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
          let resp: Res
          if(demoMode){
            resp = await axiosGetFake(
              'a=schedule?cmd=QueueInfo&limit=1',
              {status: 200, data: {status: "ok", message: "returned 1 tasks", tasks: [{name: "user_topics"}]}},
              1200
            );
          }else{
            resp = await axiosGet('a=schedule?cmd=QueueInfo&limit=1');
          }
    
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
        
        let resp: Res
        if(demoMode){
          resp = await axiosGetFake('a=schedule?cmd=' + cmd, {status: 200, data: {status: "ok", message: ""}}, 800);
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
        }else{
          resp = await axiosGet('a=schedule?cmd=' + cmd);
        }
    
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
            className="button-warn"
            type="primary"
            loading={this.state.startPause.loading}
            disabled={!this.state.startPause.active}
            icon={<PauseOutlined />}
            onClick={() => this.sendCmdSchedule("Pause")}>
            Pause
            </Button>,
          "start": 
            <Button
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

    render(){
        return (
        <>
        <Modal
            title="Stop lootnika"
            visible={this.state.stopModalShow}
            onOk={() => this.stopLootnika()}
            onCancel={() => this.togleStopModal()}
            okText="Stop anyway"
            cancelText="Cancel">
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
          <Card title="Control" loading={this.state.cardScheduleLoading} style={{minWidth: "30em", maxWidth: "60em"}}>
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
        </Space>

        <div className="divider-space" style={{height: "1em", width: "100%"}}></div>
        <Card title="Tasks journal">
            <div className="pagination-ext"
                style={{ 
                    position: "absolute",
                    right: 0,
                    paddingTop: ".8em",
                    // paddingTop: this.state.style.paginationExt.paddingTop,
                    paddingRight: "2em",
                    zIndex: 1 }}
            >
                <Space >
                    <span>Record start:</span>
                    <InputNumber
                        id="recordStart"
                        min={0}
                        defaultValue={this.state.recordStart}
                        onChange={(e) => this.setRecordStart(e)} 
                        onPressEnter={ () => this.updateTable() }
                        disabled={this.state.tableLoading}
                    />
                    <span>Records limit:</span>
                    <InputNumber
                        id="selectSize"
                        min={1}
                        defaultValue={this.state.selectSize}
                        onChange={(e) => this.setSelectSize(e)} 
                        onPressEnter={ () => this.updateTable() }
                        disabled={this.state.tableLoading}
                    />
                    <Button
                        id="updateTable"
                        icon={<ThunderboltOutlined />}
                        onClick={() => this.updateTable() }
                        disabled={this.state.tableLoading} />
                </Space>
            </div>
            <Table
                rowKey="id"
                columns={this.state.columns}
                dataSource={this.state.rows}
                size="small"
                loading={this.state.tableLoading}
                pagination={{
                  defaultCurrent: 1,
                  position: ["topLeft", "bottomLeft"],
                  showLessItems: false,
                  total: this.state.recordsTttl
                }}
                bordered = {true}
                sticky = {true}
                style={{ whiteSpace: 'pre' }}
                scroll={{ x: "80em" }}
                />
        </Card>
        </>
        );
    }
};
