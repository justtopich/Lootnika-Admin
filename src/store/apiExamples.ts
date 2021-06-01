import { random_number } from '../utils/public'


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
for (let i of Array(94) ){
    let ttl = random_number(200, 999)
    let task_error = 0
    let export_error = 0

    if(2 === random_number(0,4)){
        export_error = random_number(0,40)
    }

    if(3 === random_number(0,5)){
        task_error = random_number(0,20)
    }
    task_error += export_error

    let newDoc = ttl - random_number(0,50)
    let seen = ttl - task_error + export_error
    let name = ['files_copy', 'example', 'user_topics'][random_number(0,3)]

    ls.push(
        {
            "id": 537 - i,
            "name": name,
            "start_time": "05.05.2021 9:55:11",
            "end_time": "05.05.2021 13:55:13",
            "status": "complete",
            "count_total": ttl,
            "count_seen": seen,
            "count_new": newDoc,
            "count_differ": random_number(0,99),
            "count_delete": random_number(0,99),
            "count_task_error": task_error,
            "count_export_error": export_error,
            "last_doc_id": `${name.slice(0, 4)}_${random_number(653,345)}`
        }
    )
}

export const queueinfo = {
    "status": "ok",
    "message": "returned 100 tasks",
    "scheduler_status": "ready",
    "next_start_time": "2021-05-05 12:56:10",
    "remained_cycles": 0,
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
    "name": "user_topics",
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
    "last_doc_id": "laval-sr_143"
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
    },
    {
    "id": 540,
    "name": "example",
    "start_time": "01.03.2021 12:16:02",
    "end_time": "01.03.2021 12:16:03",
    "status": "complete",
    "count_total": 4880,
    "count_seen": 4872,
    "count_new": 50,
    "count_differ": 41,
    "count_delete": 0,
    "count_task_error": 8,
    "count_export_error": 0,
    "last_doc_id": "ex_515"
    },
    {
    "id": 539,
    "name": "user_topics",
    "start_time": "01.03.2021 12:15:59",
    "end_time": "01.03.2021 12:16:00",
    "status": "fail",
    "count_total": -1,
    "count_seen": 0,
    "count_new": 0,
    "count_differ": 0,
    "count_delete": 0,
    "count_task_error": 0,
    "count_export_error": 0,
    "last_doc_id": ""
    },
    {
    "id": 537,
    "name": "user_topics",
    "start_time": "01.03.2021 12:11:41",
    "end_time": "01.03.2021 12:11:43",
    "status": "cancel ",
    "count_total": 5433,
    "count_seen": 123,
    "count_new": 123,
    "count_differ": 0,
    "count_delete": 0,
    "count_task_error": 0,
    "count_export_error": 0,
    "last_doc_id": "123"
    },
   ].concat(ls)
}
