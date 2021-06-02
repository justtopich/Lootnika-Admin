import { createFakeTask } from '../utils/public'


export const getinfo = {
    "status": "ok",
    "message": "",
    "product": "Lootnika data collector",
    "picker_type": "lootnika_pyodbc",
    "version": "1.1.2-beta.0",
    "service_name": "Lootnika-svc",
    "directory": "D:\\app\\lootnika\\",
    "client_host": "127.0.0.1",
    "client_role": "admin",
    "pid": 10680,
    "pid_owner": "ETL-2\\megumin"
}

export const getstatus = {
    "status": "ok",
    "message": "",
    "uptime": "1:14:15",
    "cpu": 36.6,
    "ram_total": 6154336768,
    "ram_available": 2288584192,
    "ram_percent": 62.81,
    "ram_used": 3865752576,
    "ram_free": 2288584192,
    "ram_lootnika_percent": 2.4
}

export const stop = {
    "status": "ok",
    "message": ""
}

export const tasksinfo = {
    "status": "ok",
    "message": "",
    "tasks": {
    "user_topics": {
    "simpleQuery": [
    "SELECT * FROM users where id = @loot_id@"
    ],
    "bundleQuery": [
    {
    "topics": [
    "SELECT id, title FROM topics where author = @loot_id@",
    "SELECT id as post_id FROM posts where topic = @id@",
    "SELECT dtm as post_dtm FROM posts where topic = @id@"
    ]
    },
    {
    "posts": [
    "SELECT id as post_id, text FROM posts where user = @id@"
    ]
    }
    ],
    "DBhost": "localhost",
    "DBport": 3306,
    "DBscheme": "forum",
    "DBusr": "root",
    "DBpsw": "987654",
    "docRef": "myDB-@loot_id@",
    "skipEmptyRows": true,
    "selectID": "select id as loot_id from users",
    "overwriteTaskstore": false,
    "exporter": "export_csv"
    }
    }
}


let ls = [];
for (let i of Array(97) ){
    ls.push(createFakeTask('', ''))
}

let tomorrow =  new Date()
tomorrow.setDate(new Date().getDate() + 1)

export const queueinfo = {
    "status": "ok",
    "message": "returned 100 tasks",
    "scheduler_status": "ready",
    "next_start_time": `${tomorrow.toISOString().split('T')[0]} ${tomorrow.toLocaleTimeString()}`,
    "cycles_left": -1,
    "tasks": [
    {
    "id": 543,
    "name": "example",
    "start_time": "05.05.2021 9:55:11",
    "end_time": "05.05.2021 13:55:13",
    "status": "complete",
    "count_total": 4758,
    "count_seen": 4758,
    "count_new": 52,
    "count_differ": 11,
    "count_delete": 2,
    "count_task_error": 0,
    "count_export_error": 0,
    "last_doc_id": "ex_313"
    },
    {
    "id": 542,
    "name": "files_copy",
    "start_time": "25.04.2021 12:55:11",
    "end_time": "25.04.2021 12:55:13",
    "status": "complete",
    "count_total": -1,
    "count_seen": 0,
    "count_new": 0,
    "count_differ": 0,
    "count_delete": 0,
    "count_task_error": 1,
    "count_export_error": 0,
    "last_doc_id": "fi_143"
    },
    {
    "id": 541,
    "name": "user_topics",
    "start_time": "01.03.2021 12:16:17",
    "end_time": "01.03.2021 12:16:18",
    "status": "complete",
    "count_total": 364864682,
    "count_seen": 182432341,
    "count_new": 4548744,
    "count_differ": 342342,
    "count_delete": 11212,
    "count_task_error": 1232,
    "count_export_error": 32,
    "last_doc_id": "laval-sr_87"
    }
   ].concat(ls)
}
