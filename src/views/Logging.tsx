import React, { useState } from "react";
import { axiosGetFake, axiosGet, useInterval } from '../utils/public';
import { Res, ILogRecods, ILogRecod } from '../config/index.type';
import { 
  logList,
  logRead,
} from '../store/apiExamples';
import { demoMode, API_URL } from '../config/config';
import { Tabs, Button, List, Spin, Card } from 'antd';
import {DownloadOutlined, RedoOutlined} from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';


const { TabPane } = Tabs;

export default function Logging() {
  const [_, forceUpdate] = useState(new Date().toLocaleTimeString());


  let delay = useState(1000)[0];
  const isPlaying = useState([true])[0];
  // const [fileList, set_fileList] = useState([{ key: '1', title: '', content: <Loading /> }]);
  const logRecords = useState<ILogRecods>({
    "lootnika.log": {
      key: '1',
      title: '',
      content: <div style={{textAlign: 'center', margin: '2em'}}><Spin /></div>,
      init: false,
      end: -1,
      offsetEnd: -1,
      offsetStart: -1,
      hasMore: true,
      loading: true,
      records: []
    },
  })[0];

  const [fileListLoading, set_fileListLoading] = useState(true);

  const downloadWait = useState(false)[0];
  const [downloadLink, set_downloadLink] = useState('');
  const getFileListPending = useState([false])[0];
  // const loadRecordsPending = useState([false])[0];
  const initRecordsPending = useState([false])[0];
  const activeTab = useState([''])[0];

  // var activeTab = "";

  async function getFileList(): Promise<boolean> {
    // console.log('getFileList')
    let done = false;
    if (getFileListPending[0]){
      return false
    }
   
    getFileListPending[0] = true;
    let resp: Res
    if(demoMode){
      resp = await axiosGetFake('a=log?cmd=list', {status: 200, data: logList}, 300);
    }else{
      resp = await axiosGet('a=log?cmd=list');
    }
   
    if (resp){
      // let m:Array<{ key: string, title: string, content: JSX.Element }> = []
      // let records: ILogRecods = {};

      for (let k of resp?.data.files) {
        let record: ILogRecod = {
          key: k,
          title: k,
          content: <div style={{textAlign: 'center', margin: '2em'}}><Spin /></div>,
          init: false,
          end: -1,
          offsetEnd: -1,
          offsetStart: -1,
          loading: true,
          hasMore: true,
          records: []
        }
        logRecords[k] = record;
        // m.push({key: k, title: k, content: <div><Loading /></div>})
      };
      
      // set_fileList(m)
      set_fileListLoading(false)
      done = true;
    }
    getFileListPending[0] = false;
    return done
  }

  async function getRecords(logName:string, offset:number, limit:number, backward:boolean, init:boolean): Promise<[number, number, string[]]> {
    // console.log(`loadRecords ${logName}`);
    let offsetNew = -1;
    let endNew = -1;
    let records = [];

    // if (loadRecordsPending[0]){
    //   return false
    // }

    // loadRecordsPending[0] = true;

    let resp: Res
    if(demoMode){
      let fakeData = logRead[logName]
      
      if(!backward){
        fakeData.records = ['Fresh random record']
      }

      if(activeTab[0] === 'user_topics.log'){
        fakeData.records = ['']
      }

      resp = await axiosGetFake(
        'a=log?cmd=read&file=lootnika.log&limit=2&backward=true',
        {status: 200, data: fakeData}, 600
      );
    }else{
      resp = await axiosGet(`a=log?cmd=read&file=${logName}&limit=${limit}&backward=${backward}&offset=${offset}`);
    }

    if (resp){
      offsetNew = resp?.data.offset;
      endNew = resp?.data.end;

      if(init){
        if(backward){
          records = logRecords[logName].records.concat(resp?.data.records);
        }else{
          records = resp?.data.records.concat(logRecords.records);
        }
      }else{
        records = resp?.data.records;
      }
    }

    // loadRecordsPending[0] = false;
    // console.log([offsetNew, endNew, records])
    return [offsetNew, endNew, records]
  }

  async function scrollContent(logName: string) {
    // console.log('length ' + logRecords[logName].records.length);
    return (
      <InfiniteScroll
      height='70vh'
      dataLength={logRecords[logName].records.length}
      next={() => fetchMoreData(true)}
      hasMore={logRecords[logName].hasMore}
      loader={<div style={{textAlign: 'center', margin: '2em'}}><Spin /></div>}
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>This is top</b>
        </p>
      }
    >
      <List
      // style={{maxHeight: "70vh"}}
      dataSource={logRecords[logName].records}
      renderItem={(item: string) => 
        <List.Item className="log-list-item">
          <span>
            {item}
          </span>
        </List.Item>
      }
     />

    </InfiniteScroll>
    )
  }

  async function fetchMoreData(toTop:boolean) {
    // console.log(logRecords[activeTab])
    
    if(toTop){
      let [offsetNew, endNew, records] = await getRecords(activeTab[0], logRecords[activeTab[0]].offsetStart, 50, true, false)
      // console.log([offsetNew, endNew, records]);

      // console.log(`${logRecords[activeTab[0]].offsetStart} -> ${offsetNew}`)

      logRecords[activeTab[0]].offsetStart = offsetNew;
      logRecords[activeTab[0]].end = endNew;

      let ls: string[] = logRecords[activeTab[0]].records 
      logRecords[activeTab[0]].records = ls.concat(records);
      logRecords[activeTab[0]].content = await scrollContent(activeTab[0]);

      // console.log(logRecords[activeTab[0]].offsetStart)
      if(activeTab[0] === 'user_topics.log' && demoMode){
        logRecords[activeTab[0]].offsetStart = 0
      }

      if (logRecords[activeTab[0]].offsetStart <= 0) {
        logRecords[activeTab[0]].hasMore = false;
      }
    }else{
      let [offsetNew, endNew, records] = await getRecords(activeTab[0], logRecords[activeTab[0]].offsetEnd, 1000, false, false)

      logRecords[activeTab[0]].offsetEnd = offsetNew;
      logRecords[activeTab[0]].end = endNew;

      let ls: string[] = logRecords[activeTab[0]].records
      logRecords[activeTab[0]].records = records.reverse().concat(ls);
      logRecords[activeTab[0]].content = await scrollContent(activeTab[0]);
      
      // if (logRecords[activeTab[0]].offsetStart <= 0) {
      //   logRecords[activeTab[0]].hasMore = false;
      // }
    }

    forceUpdate(new Date().toLocaleTimeString())
  };

  async function initRecords(logName:string, limit:number) {
    if(demoMode){
      set_downloadLink('/lootnika/static/files/' + logName)
    }else{
      set_downloadLink(API_URL + '/a=log?cmd=get&file=' + logName)
    }

    if (initRecordsPending[0]){
      return false
    }

    initRecordsPending[0] = true;
    let resp: Res
    if(demoMode){
      let fakeData = logRead[logName]
      fakeData.records = fakeData.records.reverse()

      resp = await axiosGetFake(
        'a=log?cmd=read&file=lootnika.log&limit=2&backward=true',
        {status: 200, data: fakeData}, 600
      );
    }else{
      resp = await axiosGet(`a=log?cmd=read&file=${logName}&limit=${limit}&backward=true`);
    }

    if (resp){
      logRecords[logName].records = resp?.data.records;
      logRecords[logName].end = resp?.data.end;
      logRecords[logName].offsetEnd = resp?.data.end;
      logRecords[logName].offsetStart = resp?.data.offset;
      logRecords[logName].hasMore = true;
      activeTab[0] = logName;
    }

    // fileList
    logRecords[logName].init = true;
    logRecords[logName].content = await scrollContent(logName);
    initRecordsPending[0] = false;
    forceUpdate(new Date().toLocaleTimeString())
  }

  async function switchTab(tabName:string) {
    // console.log(`switchTab ${tabName}`)
    if(logRecords[tabName].init){
      if(demoMode){
        set_downloadLink('/lootnika/static/files/' + tabName)
      }else{
        set_downloadLink(API_URL + '/a=log?cmd=get&file=' + tabName)
      }
      activeTab[0] = tabName;
    }else{
      initRecords(tabName, 50)
    }
  }
  
  useInterval(
        () => {
          // console.log(`fileListLoading=${fileListLoading} getFileListPending=${getFileListPending[0]}`);
          if (fileListLoading && !getFileListPending[0]){
            if(getFileList()){
              initRecords('lootnika.log', 50);
            }
          }

          if (!fileListLoading && !getFileListPending[0]){
            isPlaying[0] = false
          }
        }, isPlaying[0] ? delay : null,
  );

  const operations = <div>
    <Button loading={downloadWait} onClick={() => fetchMoreData(false) } icon={<RedoOutlined />}>Update</Button>
    <Button loading={downloadWait} href={downloadLink} icon={<DownloadOutlined />}>Download</Button>
  </div>;

  // console.log(logRecords)
  return (
    <Card title="Logs viewer">
      <Tabs
        type="card"
        onChange={switchTab}
        tabBarExtraContent={operations}>
          {Object.values(logRecords).map(pane => (
            <TabPane tab={pane.title} key={pane.key}>
              {pane.content}
            </TabPane>
          ))}
      </Tabs>
    </Card>

  )
}
