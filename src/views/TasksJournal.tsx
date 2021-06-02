import React from "react";
import {
  Space,
  Card,
  Table,
  InputNumber,
  Button,
  message }
from 'antd';
import { 
    ThunderboltOutlined,
     }
  from '@ant-design/icons';
import { axiosGetFake, axiosGet } from '../utils/public';
import { queueinfo } from '../store/apiExamples';
import moment from 'moment';
import { demoMode } from '../config/config'
import { Res, LooseObject } from '../config/index.type';


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
    }

    async componentDidMount() {
      await this.updateTable()
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
                s += `${k}: ${row["count_" + k.replace(' ', '_')]}\n`
            });
            
            row["counts"] = `${s}last doc ID: ${row["last_doc_id"]}`
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
          s += `${k}: ${row["count_" + k.replace(' ', '_')]}\n`
        });
        
        row["counts"] = `${s}last doc ID: ${row["last_doc_id"]}`
        rowsData.push(row)
      }
      return rowsData
    }

    async updateTable () {
      this.setState({ tableLoading: true });
      
      let resp: Res
      if(demoMode){
          resp = await axiosGetFake(
              `a=schedule?cmd=QueueInfo&start=${this.state.recordStart}&limit=${this.state.selectSize}`,
              {status: 200, data: queueinfo}, 600
          );
      }else{
          resp = await axiosGet(`a=schedule?cmd=QueueInfo&start=${this.state.recordStart}&limit=${this.state.selectSize}`);
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
          message.error(resp.data.message);
        }
      }

      if(rowsData.length > 1){ ttl=rowsData.length }
      this.setState({rows: rowsData, recordsTttl: ttl, tableLoading: false});
    }

    render(){
        return (
        <>
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
