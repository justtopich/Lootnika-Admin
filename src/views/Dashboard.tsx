import React, { useState, useContext } from "react";
import { AppContext } from '../AppProvider';
import { 
  Space,
  Card,
  List,
  message,
  Tooltip,
  Button,
  Typography,
  Popover,
  Modal,
  Select,
  Row, Col,
  Divider }
from 'antd';
import { axiosGetFake, axiosGet, useInterval, createFakeTask } from '../utils/public';
import { Res, Props, LooseObject } from '../config/index.type';
import { getinfo, queueinfo, tasksinfo, stop } from '../store/apiExamples';
import { demoMode } from '../config/config';
import { Bar } from '@ant-design/charts';
import {
  WarningFilled,
  ExclamationCircleFilled,
  BorderOutlined,
  PauseOutlined,
  StepForwardOutlined,
  CaretRightOutlined,
  ThunderboltOutlined,
  PoweroffOutlined,
  FileZipFilled,
  DropboxOutlined,
  }
from '@ant-design/icons';
import { exception } from "node:console";


const { Title, Text } = Typography;

export default function Dashboard(props: Props) {
  let { cardStatusLoading, cardStatus, statusBarConfig } = useContext(AppContext);
  let tasksItems: Array<Array<string>> = Object.entries(cardStatus[0]);

  let delay = useState(3000)[0];
  const isPlaying = useState([true])[0]
  const [cardInfoLoading, set_cardInfoLoading] = useState(true);
  const [cardScheduleLoading, set_cardScheduleLoading] = useState(true);
  const [actualTasksLoading, set_actualTasksLoading] = useState(true);
  const [stopModalShow, set_stopModalShow] = useState(false);

  const getInfoPending = useState([false])[0];
  const getTasksPending = useState([false])[0];
  const getActualTasksPending = useState([false])[0];
  
  const actualTasks = useState([[{label: 'all', value: 'all'}]])[0]
  const [actualTasksValue, set_actualTasksValue] = useState(actualTasks[0][0].value)

  const [cardInfo, set_cardInfo] = useState({
    product: '',
    picker_type: '',
    version: '',
    directory: '',
    service_name: '',
    pid: '',
    pid_owner: '',
    client_host: '',
    client_role: ''
  });
  const cardTasks = useState([[{
    name: '',
    start_time: '',
    task_error: '',
    export_error: '',
    color1: '',
    color2: '',
  }]])[0];
  const [cardSchedule, set_cardSchedule] = useState({
    scheduler_status: '',
    next_start_time: '',
    cycles_left: '-1',
  });
  const [controlsState, set_controlsState] = useState({
    canStopSchedule: false,
    canEnableSchedule: false,
    canStopLootnika: true,
    startPause: {
      active: false,
      type: "start",
      loading: false,
    }
  });
  const selectTasksProps = {
    style: { width: 200 },
    value: actualTasksValue,
    options: actualTasks[0],
    onChange: (newValue: string) => {
      set_actualTasksValue(newValue);
    },
    defaultValue: actualTasks[0][0].value,
    loading: actualTasksLoading,
  };


  async function makeStateFromKeys(stateObj: {}, obj: LooseObject) {
    let m:LooseObject = {};

    Object.keys(stateObj).forEach(k => {
      m[k] = obj[k];
    });
    return m
  };
 
  async function getActualTasks(): Promise<boolean> {
    console.log('getActualTasks')
    let done = false;
    if (getActualTasksPending[0]){
      return false
    }

    getActualTasksPending[0] = true;
    let resp: Res
    if(demoMode){
      resp = await axiosGetFake('a=schedule?cmd=TasksInfo', {status: 200, data: tasksinfo}, 1000);
    }else{
      resp = await axiosGet('a=schedule?cmd=TasksInfo');
    }

    if (resp){
      let m = [{label: 'all', value: 'all'}]
      Object.keys(resp?.data.tasks).forEach(k => {
        m.push({label: k, value: k})
      });
      actualTasks[0] = m
      set_actualTasksLoading(false)
      done = true;
      }
    getActualTasksPending[0] = false;
    return done
  }

  async function updateInfo(): Promise<boolean> {
    console.log('updateInfo')
    let done = false;
    if (getInfoPending[0]){
      return false
    }

    getInfoPending[0] = true;
    let resp: Res
    if(demoMode){
      resp = await axiosGetFake('a=getinfo', {status: 200, data: getinfo}, 1000);
    }else{
      resp = await axiosGet('a=getinfo');
    }

    if (resp){
      let a: any = await makeStateFromKeys(cardInfo, resp?.data)      
      if (cardInfoLoading){
        a = await makeStateFromKeys(cardInfo, resp?.data)
        set_cardInfo(a)
        set_cardInfoLoading(false);
        done = true;
      }
    }
    getInfoPending[0] = false;
    return done
  }  

  async function updateTasks() {
    // console.log('updateTasks')
    if (getTasksPending[0]){
      return
    }

    getTasksPending[0] = true;
    let resp: Res
    if(demoMode){
      resp = await axiosGetFake(
          'a=schedule?cmd=QueueInfo&limit=6',
          {status: 200, data: queueinfo}, 600
      );
    }else{
        resp = await axiosGet('a=schedule?cmd=QueueInfo&limit=6');
    }

    if(resp){
      let tasks = resp.data.tasks.slice(0, 6)

      if(resp.data.status !== "ok"){
        message.error("Load tasks: " + resp.data.message);
        controlsState.canStopSchedule = false
      }else{
        // fill tasks problems
        cardTasks[0] = []
        for (let row of tasks) {
          let color1 = '#9c9c9c'
          let color2 = '#9c9c9c'

          if (row.count_task_error > 0){
            color1 = '#f56e53'
          }
          if (row.count_export_error > 0){
            color2 = '#f56e53'
          }

          cardTasks[0].push({
            name: row.name,
            start_time: row.start_time,
            task_error: row.count_task_error,
            export_error: row.count_export_error,
            color1: color1,
            color2: color2
          })
        }

        // update controls
        let lol = resp?.data.cycles_left.toString() 
        if (lol === '-1'){ lol = '∞'}

        set_cardSchedule({
          scheduler_status: resp?.data.scheduler_status,
          next_start_time: resp?.data.next_start_time,
          cycles_left: lol
        })
            
        let canStop = true
        if(["cancel", "ready", "wait"].indexOf(resp.data.scheduler_status) !== -1){
          canStop = false
        }
        
        let active = true
        if("cancel" === resp.data.scheduler_status){
          active = false
        }
        
        let type = "start"
        if("pause" === resp.data.scheduler_status){
          type = "resume"
        }else if("work" === resp.data.scheduler_status){
          type = "pause"
        }
        
        // console.log(`${canStop} ${active} ${type}`)
        set_controlsState({
          canStopSchedule: canStop,
          canEnableSchedule: controlsState.canEnableSchedule,
          canStopLootnika: true,
          startPause: {
            loading: false,
            active: active,
            type: type
          }
        })

        if(cardScheduleLoading){
          set_cardScheduleLoading(false);
        }
      }
    }
    getTasksPending[0] = false;
  }

  function showSadSmile() {
    return <div><p>Not working yet (ಥ﹏ಥ)</p></div>
  }

  function enableSchedule(active: boolean){
    if(active){
      return(
        <Popover content={showSadSmile()} title="Disable schedule" trigger="click">
          <Button 
          type="primary"
          disabled={!controlsState.startPause.active}
          icon={<ThunderboltOutlined />}
          >
          Enable
          </Button>
        </Popover>
      )
    }else{
      return(
        <Popover content={showSadSmile()} title="Disable schedule" trigger="click">
          <Button
          disabled={!controlsState.startPause.active}
          icon={<PoweroffOutlined />}
          >
          Disable
          </Button>
        </Popover>
      )
    }
  }

  async function togleStopModal() {
    set_stopModalShow(!stopModalShow);
  };

  async function stopLootnika() {
    set_controlsState({
      canStopSchedule: controlsState.canStopSchedule,
      canEnableSchedule: controlsState.canEnableSchedule,
      canStopLootnika: controlsState.canStopLootnika,
      startPause: {
        loading: controlsState.startPause.loading,
        active: controlsState.startPause.active,
        type: controlsState.startPause.type
      }
    })

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
        message.error(resp.data.message);
      }
    }else{
      message.error("Fail to stop Lootnika");
    }
    await togleStopModal()
}

  async function scheduleAction(cmd: string, taskName: string) {
    set_controlsState({
      canStopSchedule: false,
      canEnableSchedule: false,
      canStopLootnika: true,
      startPause: {
        loading: true,
        active: controlsState.startPause.active,
        type: controlsState.startPause.type
      }
    })

    let taskNameCmd: string
    if(taskName === 'all'){
      taskNameCmd = ''
    }else{
      taskNameCmd = '&TaskName=' + taskName
    }

    let resp: Res
    if(demoMode){
      let status = "pause"
      let message = 'successfully paused task ' + taskName
      if(cmd === 'start'){
        if(queueinfo.scheduler_status === 'pause'){
          if(queueinfo.tasks[0].name === taskName){
            message = 'successfully resume task ' + taskName
            status = "work"
          }else{
            message = `Scheduler suspended on task ${queueinfo.tasks[0].name}, but you trying to resume another task, that not allowed`
          }
        }else{
          queueinfo.tasks.unshift(createFakeTask(taskName, 'now'))
          message = 'successfully started task ' + taskName
          status = "work"
        }
      }else if(cmd === 'cancel'){
        status = "ready"
        message = 'successfully canceled task ' + taskName
      }

      resp = await axiosGetFake('a=schedule?cmd=' + cmd, {status: 200, data: {status: "ok", message: message}}, 800);
      queueinfo.scheduler_status = status
    }else{
      resp = await axiosGet(`a=schedule?cmd=${cmd}${taskNameCmd}`);
    }

    if (resp){
      if(resp.data.status === "ok"){
        message.success(resp.data.message);
      }else{
        message.error(resp.data.message);
      }
    }else{
      message.error("Fail to execute command");
    }

  }

  function pauseButton(type: string) {
    const bType: LooseObject = {
      "pause":
        <Button 
        className="button-warn"
        type="primary"
        loading={controlsState.startPause.loading}
        disabled={!controlsState.startPause.active}
        icon={<PauseOutlined />}
        onClick={() => scheduleAction("pause", actualTasksValue)}>
        Pause
        </Button>,
      "start": 
        <Button
        loading={controlsState.startPause.loading}
        disabled={!controlsState.startPause.active}
        icon={<StepForwardOutlined />}
        className="button-success"
        onClick={() => scheduleAction("start", actualTasksValue)}>
        Run once
        </Button>,
      "resume": 
        <Button 
        loading={controlsState.startPause.loading}
        disabled={!controlsState.startPause.active}
        className="button-success"
        icon={<CaretRightOutlined />}
        onClick={() => scheduleAction("start", actualTasksValue)}>
        Resume
        </Button>,
    }
    return(bType[type])
  }

  if (cardInfoLoading && !getInfoPending[0]){
    updateInfo();
  }
  if (cardScheduleLoading && !getTasksPending[0]){
    updateTasks();
  }

  useInterval(
    () => {
      if (cardInfoLoading && !getInfoPending[0]){
        updateInfo();
      }

      if (cardScheduleLoading && !getTasksPending[0]){
        updateTasks();
      }

      if(actualTasksLoading){
        getActualTasks()
      }

      if (!cardInfoLoading && !cardScheduleLoading){
        isPlaying[0] = false
      }
    }, isPlaying[0] ? delay : null,
  );
  
  useInterval(
    () => {
      updateTasks()
    }, 3000
  )

  // actualTasks.forEach(i => console.log(i))

  const controlButtons: Array<Object> = [
    <Popover content={showSadSmile()} title="Disable schedule" trigger="click">
      <Button
      type="primary"
      icon={<FileZipFilled />}
      loading={controlsState.startPause.loading}
      disabled={!controlsState.startPause.active}
      onClick={() => showSadSmile()}>
      Backup
      </Button>
    </Popover>,
    <Popover content={showSadSmile()} title="Disable schedule" trigger="click">
      <Button
      type="primary"
      icon={<DropboxOutlined />}
      className="button-warn"
      loading={controlsState.startPause.loading}
      disabled={!controlsState.startPause.active}
      onClick={() => showSadSmile()}>
      Restore
      </Button>
    </Popover>,
    <Button 
      danger type="primary"
      icon={<PoweroffOutlined />}
      disabled={!controlsState.canStopLootnika}
      onClick={() => togleStopModal()}>
        Stop lootnika
    </Button>
  ]

  return (
    <>
    <Modal
        title="Stop lootnika"
        visible={stopModalShow}
        onOk={() => stopLootnika()}
        onCancel={() => togleStopModal()}
        okText="Stop anyway"
        cancelText="Cancel">
        <p>You trying to stop Lootnika</p>
        <p>Lootnika control panel will not work</p>
        <p>Are you sure?</p>
    </Modal>

    <Space align="start" size="middle" wrap>
      <Card title="Schedule" loading={cardScheduleLoading} style={{minWidth: "61em", maxWidth: "120em"}}>
        <Row justify="space-around" style={{textAlign: 'center' }}>
          <Col span={6}>
            <Title level={3} style={{marginBottom: 0, whiteSpace: 'nowrap'}}>{cardSchedule.scheduler_status}</Title>
            <Text>status</Text>
          </Col>
          <Col span={12}>
            <Title level={3} style={{marginBottom: 0}}>{cardSchedule.next_start_time}</Title>
            <Text>next start time</Text>
          </Col>
          <Col span={6}>
            <Title level={3} style={{marginBottom: 0, whiteSpace: 'nowrap'}}>{cardSchedule.cycles_left}</Title>
            <Text>cycles left</Text>
          </Col>
        </Row>
        <Divider orientation="left" plain>Control</Divider>
        <Row justify="space-around" style={{textAlign: 'center' }}>
          <Col span={6}>
            {/* <Select defaultValue={actualTasks[0]} style={{ width: 200 }}> */}
              {/* {() => actualTasks.forEach(i => <Option value={i}>{i}</Option>)} */}
            {/* </Select> */}
            <Select {...selectTasksProps} />
          </Col>
          <Col span={6}>
            {pauseButton(controlsState.startPause.type)}
          </Col>
          <Col span={6}>
            <Button
              type="primary"
              disabled={!controlsState.canStopSchedule}
              icon={<BorderOutlined />}
              onClick={() => scheduleAction("cancel", actualTasksValue)}>
              Cancel task
            </Button>
          </Col>
          <Col span={6}>
            {enableSchedule(controlsState.canEnableSchedule)}
          </Col>
        </Row>
        <Divider orientation="left" plain>Last tasks</Divider>
        <List
          dataSource={cardTasks[0]}
          renderItem={item => 
            <List.Item>
              <span className="simple-list-item">
                {item.name}
              </span>
              <span style={{paddingRight: '0.5em'}}>{item.start_time}</span>
              <span className="simple-list-item" style={{float: "right"}}>
                <Space align="start" size="small" wrap style={{fontWeight: 600}}>
                  <Tooltip title="Task errors">
                    <ExclamationCircleFilled style={{color: item.color1, paddingRight: '0.2em', fontSize: 'large'}} />
                    {item.task_error}
                  </Tooltip>
                  <Tooltip title="Export errors">
                    <WarningFilled style={{color: item.color2, paddingRight: '0.2em', fontSize: 'large'}} />
                    {item.export_error}
                  </Tooltip>
                </Space>
              </span>
            </List.Item>
          }
        />
      </Card>
      <Card title="Status" loading={cardStatusLoading} style={{minWidth: "30em", maxWidth: "60em"}}>
        <span>RAM usage</span>
        <Bar {...statusBarConfig} />
        <List
          dataSource={tasksItems}
          renderItem={item => 
            <List.Item style={{display: "block"}}>
              <span className="simple-list-item" style={{width: "12em", display: "inline-block" }}>{item[0]}</span>
              <span className="simple-list-item" style={{display: "inline-block" }}>{item[1]}</span>
            </List.Item>
          }
        />
      </Card>
      <Card title="Info" loading={cardInfoLoading} style={{minWidth: "30em", maxWidth: "60em"}}>
        <List
          dataSource={Object.entries(cardInfo)}
          renderItem={item => 
            <List.Item style={{display: "block"}}>
              <span className="simple-list-item" style={{width: "10em", display: "inline-block" }}>{item[0]}</span>
              <span className="simple-list-item" style={{display: "inline-block" }}>{item[1]}</span>
            </List.Item>
          }
        />
      </Card>
      <Card title="Control" loading={cardInfoLoading} style={{minWidth: "30em", maxWidth: "60em"}}>
        <List
          dataSource={controlButtons}
          renderItem={item => 
            <List.Item style={{display: "block"}}>
              { item }
            </List.Item>
          }
        />
      </Card>
    </Space>
  </>
  );
}
