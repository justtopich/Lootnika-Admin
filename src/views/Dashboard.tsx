import React, { useState, useContext } from "react";
import { AppContext } from '../AppProvider';
import { Space, Card, List, message, Tooltip } from 'antd';
import { axiosGetFake, axiosGet, useInterval } from '../utils/public';
import { Res, Props, LooseObject } from '../config/index.type';
import { getinfo, queueinfo } from '../store/apiExamples';
import { demoMode } from '../config/config';
import { Bar } from '@ant-design/charts';
import {
  WarningFilled,
  ExclamationCircleFilled,
  }
from '@ant-design/icons';


export default function Dashboard(props: Props) {
  let { cardStatusLoading, cardStatus, statusBarConfig } = useContext(AppContext);
  let tasksItems: Array<Array<string>> = Object.entries(cardStatus[0])

  let delay = useState(3000)[0];
  const isPlaying = useState([true])[0]
  const [cardInfoLoading, set_cardInfoLoading] = useState(true);
  const [cardTasksLoading, set_cardTasksLoading] = useState(true);

  const getInfoPending = useState([false])[0];
  const getTasksPending = useState([false])[0];
  
  const [cardAccess, set_cardAccess] = useState({client_host: '', client_role: ''});

  const [cardInfo, set_cardInfo] = useState(
    {
      product: '',
      picker_type: '',
      version: '',
      directory: '',
      service_name: '',
      pid: '',
      pid_owner: '',
    },
  );
  const cardTasks = useState([[{
    name: '',
    start_time: '',
    task_error: '',
    export_error: '',
    color1: '',
    color2: '',
  }]])[0]

  async function makeStateFromKeys(stateObj: {}, obj: LooseObject) {
    let m:LooseObject = {};

    Object.keys(stateObj).forEach(k => {
      m[k] = obj[k];
    });
    return m
  };
 
  async function updateInfo(): Promise<Boolean> {
    // console.log('updateInfo')
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
        a = await makeStateFromKeys(cardAccess, resp?.data)
        set_cardAccess(a)
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
          'a=schedule?cmd=QueueInfo&limit=10',
          {status: 200, data: queueinfo}, 600
      );
    }else{
        resp = await axiosGet('a=schedule?cmd=QueueInfo&limit=10');
    }

    cardTasks[0] = []
    if(resp){       
      let tasks = resp.data.tasks.slice(0, 10)
      if(resp.data.status === "ok"){
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

        if(cardTasksLoading){
          set_cardTasksLoading(false);
        }
      }else{
        message.error("Load tasks: " + resp.data.message);
      }
    }
    getTasksPending[0] = false;
  }


  if (cardInfoLoading && !getInfoPending[0]){
    updateInfo();
  }
  if (cardTasksLoading && !getTasksPending[0]){
    updateTasks();
  }

  useInterval(
    () => {
      if (cardInfoLoading && !getInfoPending[0]){
        updateInfo();
      }

      if (cardTasksLoading && !getTasksPending[0]){
        updateTasks();
      }

      if (!cardInfoLoading && !cardTasksLoading){
        isPlaying[0] = false
      }
    }, isPlaying[0] ? delay : null,
  );


  return (
    <>
    <Space align="start" size="middle" wrap>
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
      <Card title="Tasks problems" loading={cardTasksLoading} style={{minWidth: "30em", maxWidth: "60em"}}>
        <List
          dataSource={cardTasks[0]}
          renderItem={item => 
            <List.Item style={{display: "block"}}>
              <span
                className="simple-list-item"
                style={{ minWidth: "10em", display: "inline-block" }}
                >
                  {item.name}
              </span>
              <span style={{ paddingRight: '0.5em' }}>{item.start_time}</span>
              <span
                className="simple-list-item"
                style={{display: "inline-block", float: "right" }}>
                  {}
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
      <Card title="Access" loading={cardInfoLoading} style={{minWidth: "30em", maxWidth: "60em"}}>
        <List
          dataSource={Object.entries(cardAccess)}
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
}
