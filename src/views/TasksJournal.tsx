import React from "react";
import { Space, Card, Table, InputNumber, Button, Modal } from 'antd';
import { ThunderboltOutlined, RedoOutlined } from '@ant-design/icons';
import { axiosGetFake, axiosGet } from '../utils/public';
import { queueinfo } from '../store/apiExamples';
import moment from 'moment';


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
            // {
            // title: 'total',
            // dataIndex: 'count_total',
            // },{
            // title: 'seen',
            // dataIndex: 'count_seen',
            // },{
            // title: 'new',
            // dataIndex: 'count_new',
            // },{
            // title: 'differ',
            // dataIndex: 'count_differ',
            // },{
            // title: 'deleted',
            // dataIndex: 'count_delete',
            // },{
            // title: 'task error',
            // dataIndex: 'count_task_error',
            // },{
            // title: 'export error',
            // dataIndex: 'count_export_error',
            // },{
            // title: 'last doc ID',
            // dataIndex: 'last_doc_id',
            // },
        ],
        rows: [],
        tableLoading: true,
        selectSize: 20,
        recordStart: 0,
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
  
    async updateTable () {
        this.setState({ tableLoading: true });
        let resp = await axiosGetFake(
            'a=schedule?cmd=QueueInfo&start=' + this.state.recordStart + '&limit=' + this.state.selectSize,
            {status: 200, data: queueinfo}, 1200
        );
        // let resp = await axiosGet('a=schedule?cmd=QueueInfo&start=' + this.state.recordStart + '&limit=' + this.state.selectSize);
        if(resp){       
            let rowsData = []
            let head = ["total", "seen", "new", "differ", "delete", "task error", "export error"]
            let fakeLimit = 0   // del in prod
            let fakeStart = 0
            for (let row of resp?.data.tasks) {
                if (fakeStart > this.state.recordStart){
                    if (fakeLimit  < this.state.selectSize){
                        let a = moment(row["end_time"], 'DD.MM.YYYY HH:mm:ss').valueOf() - moment(row["start_time"], 'DD.MM.YYYY HH:mm:ss').valueOf()
                        row["duration"] = timeConversion(a)

                        let s = ""
                        head.forEach((k) => {
                            s += k + ": " + row["count_" + k.replace(' ', '_')] + "\n"
                        });
                        
                        row["counts"] = s + "last doc ID: " + row["last_doc_id"]
                        rowsData.push(row)
                        fakeLimit += 1
                    }
                }
                fakeStart += 1
            }
            this.setState({rows: rowsData});
            // if (rowsData.length > 0) {
            //     // this.state.style.paginationExt.paddingTop = "2rem"
            // }else{
            //     // this.state.style.paginationExt.paddingTop = "0rem"
            // }
        }
        this.setState({ tableLoading: false });
    }

    render(){
        return (
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
                        <Button id="updateTable" icon={<RedoOutlined />} onClick={() => this.updateTable() } disabled={this.state.tableLoading} />
                    </Space>
                </div>
                <Table
                    rowKey="id"
                    columns={this.state.columns}
                    dataSource={this.state.rows}
                    size="small"
                    loading={this.state.tableLoading}
                    pagination={{ defaultCurrent: 1, position: ["topLeft", "bottomLeft"], showLessItems: false, total: 1 }}
                    bordered = {true}
                    sticky = {true}
                    style={{ whiteSpace: 'pre' }} 
                    />
            </Card>
        );
    }
};
