import React, { useState, useContext, useEffect } from "react";
import { AppContext } from '../AppProvider';
import { Space, Card, List, message, Tooltip } from 'antd';
import { axiosGetFake, axiosGet, useInterval } from '../utils/public';
import { Res, Props, LooseObject } from '../config/index.type';
import { getstatus, getinfo, queueinfo } from '../store/apiExamples';
import { demoMode } from '../config/config';
import { Bar } from '@ant-design/charts';
import prettyBytes from 'pretty-bytes';
import { 
  WarningOutlined,
  ExclamationCircleOutlined,
  }
from '@ant-design/icons';


type TaskItem = {
  name: string;
  task_error: string;
  export_error: string;
};


export default function Dashboard(props: Props) {
  let { refresh } = useContext(AppContext);

  let [delay, setDelay] = useState([200]);
  const [inited, set_inited] = useState([false]);

  const [cardInfoLoading, set_cardInfoLoading] = useState(true);
  const [cardStatusLoading, set_cardStatusLoading] = useState(true);
  const [cardTasksLoading, set_cardTasksLoading] = useState(true);

  const [getStatusPending, set_getStatusPending] = useState([false]);
  const [getInfoPending, set_getInfoPending] = useState([false]);
  const [getTasksPending, set_getTasksPending] = useState([false]);
  
  const [cardAccess, set_cardAccess] = useState({client_host: '', client_role: ''});
  const [cardStatus, set_cardStatus] = useState({
    status: '', uptime: '', cpu: '',
    ram_total: '',
    ram_available: '',
    ram_used: '',
    ram_free: '',
    ram_lootnika: '',
  });
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
  const [cardTasks, set_cardTasks] = useState([[{
    name: '',
    start_time: '',
    task_error: '',
    export_error: '',
    color1: '',
    color2: '',
  }]])

  var config: any = {
    data: [{
      kind: 'Total',
      size: '',
      value: 0,
    }],
    xField: 'value',
    yField: 'line',
    seriesField: 'kind',
    isPercent: true,
    isStack: true,
    legend: false,
    height: 50,
    // color: ['#f7c122', '#9a67bd', '#657798'],
    label: {
      position: 'end',

      content: function content(item: LooseObject) {
        return item.value.toFixed(2);
      },
      style: { fill: '#fff' },
    },
    animation: {
      appear: {
        animation: 'zoom-in',
        duration: 500,
      },
      update: {
        animation: 'position-update',
        duration: 200,
      },
      enter: {
        animation: 'zoom-in',
        duration: 0,
      },
      leave: {
        animation: 'zoom-out',
        duration: 0,
      },
    },
    barWidthRatio: 1
  };
  
  const [barConfig, set_barConfig] = useState(config);

  async function makeStateFromKeys(stateObj: {}, obj: LooseObject) {
    let m:LooseObject = {};

    Object.keys(stateObj).forEach(k => {
      m[k] = obj[k];
    });
    return m
  };
 
  async function updateInfo() {
    // console.log('updateInfo')
    if (getInfoPending[0]){
      return
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
      set_cardStatus(a)
      refresh()
      
      if (cardInfoLoading){
        a = await makeStateFromKeys(cardAccess, resp?.data)
        set_cardAccess(a)
        a = await makeStateFromKeys(cardInfo, resp?.data)
        set_cardInfo(a)
        set_cardInfoLoading(false);
      }
    }
    getInfoPending[0] = false;
  }

  async function updateStatus() {
    // console.log('updateStatus')
    if (getStatusPending[0]){
      return
    }

    getStatusPending[0] = true;
    let resp: Res
    if(demoMode){
      let dt = new Date()
      getstatus.uptime = "24 day " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds()
      resp = await axiosGetFake('a=getstatus', {status: 200, data: getstatus}, 600);
    }else{
      resp = await axiosGet('a=getstatus');
    }

    if (resp){
      // let a: any = await makeStateFromKeys(cardStatus, resp?.data)
      let a = resp?.data
      let barData = [
        {
          kind: 'available ' + prettyBytes(a.ram_available, {minimumFractionDigits: 2}),
          line: '',
          // value: Number((100 - a.ram_percent).toFixed(2)),
          value: a.ram_available,
        },
        {
          kind: 'used ' + prettyBytes(a.ram_used, {minimumFractionDigits: 2}),
          line: '',
          // value: Number((a.ram_percent - a.ram_lootnika_percent).toFixed(2)),
          value: a.ram_used
        },
        {
          kind: 'lootnika ' + prettyBytes(a.ram_total * a.ram_lootnika_percent * 0.01, {minimumFractionDigits: 2}),
          line: '',
          // value: Number(a.ram_lootnika_percent.toFixed(2)),
          value: a.ram_total/100 * a.ram_lootnika_percent
        },
      ]

      barConfig.data = barData;    
      let data = {
        status: a.status,
        uptime: a.uptime, 
        cpu: a.cpu + ' %',
        ram_total: prettyBytes(a.ram_total, {minimumFractionDigits: 2}),
        ram_available: `${prettyBytes(a.ram_available, {minimumFractionDigits: 2})} (${(100 - a.ram_percent).toFixed(2)} %)`,
        ram_used: `${prettyBytes(a.ram_used, {minimumFractionDigits: 2})} (${a.ram_percent.toFixed(2)} %)`,
        ram_free: `${prettyBytes(a.ram_free, {minimumFractionDigits: 2})} (${(100 - a.ram_percent).toFixed(2)} %)`,
        ram_lootnika: `${prettyBytes(a.ram_total/100 * a.ram_lootnika_percent)} (${a.ram_lootnika_percent.toFixed(2)} %)`
      }
      set_cardStatus(data)
      refresh()
      
      if (cardStatusLoading){
        set_cardStatusLoading(false)
      }
    }

    getStatusPending[0] = false;
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
          'a=schedule?cmd=QueueInfo&limit=100',
          {status: 200, data: queueinfo}, 600
      );
    }else{
        resp = await axiosGet('a=schedule?cmd=QueueInfo&limit=100');
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

  useInterval(
    () => {
      // console.log(cardTasks)
      if (cardInfoLoading && !getInfoPending[0]){
        updateInfo();
      }

      if (cardTasksLoading && !getTasksPending[0]){
        console.log('updateTasks')
        updateTasks();
      }

      updateStatus();
    }, delay[0]
  );

  if (!inited[0]){
    delay[0] = 3000
    inited[0] = true
  }

  return (
    <>
    <Space align="start" size="middle" wrap>
      <Card title="Status" loading={cardStatusLoading} style={{minWidth: "30em", maxWidth: "60em"}}>
      <span>RAM usage</span>
      <Bar {...barConfig} />
        <List
          dataSource={Object.entries(cardStatus)}
          renderItem={item => 
            <List.Item style={{display: "block"}}>
              <span className="simple-list-item" style={{width: "12em", display: "inline-block" }}>{item[0]}</span>
              <span className="simple-list-item" style={{display: "inline-block" }}>{item[1]}</span>
            </List.Item>
          }
        />
      </Card>
      <Card title="Tasks reports" loading={cardTasksLoading} style={{minWidth: "30em", maxWidth: "60em"}}>
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
                      <ExclamationCircleOutlined style={{color: item.color1, paddingRight: '0.2em'}} />
                      {item.task_error}
                    </Tooltip>
                    <Tooltip title="Export errors">
                      <WarningOutlined style={{color: item.color2, paddingRight: '0.2em'}} />
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
