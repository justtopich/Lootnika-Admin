import { LooseObject } from '../config/index.type'
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

export const logList = {
    "status": "ok",
    "message": "",
    "files": ["lootnika.log", "rest.log", "user_topics.log"]
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

export const logRead: LooseObject = {
    'user_topics.log': {"status": "ok", "message": "", "offset": 0, "end": 5, "records": ["2021-06-06 00:53:32 user_topics WARNING: Fail to verify taskstore: no such table: documents\n", "2021-06-06 00:53:32 user_topics WARNING: Creating new taskstore scheme\n", "2021-06-06 00:53:33 user_topics INFO: Task is running\n", "2021-06-06 00:53:33 user_topics INFO: Connecting to source...\n", "2021-06-06 00:53:33 user_topics INFO: Retrieving objects ID\n", "2021-06-06 00:53:33 user_topics INFO: Retrieved 50 objects ID\n", "2021-06-06 00:53:33 user_topics INFO: Receive 1 (1/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-1 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 2 (2/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-2 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 3 (3/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-3 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 4 (4/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-4 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 5 (5/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-5 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 6 (6/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-6 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 7 (7/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-7 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 8 (8/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-8 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 9 (9/50)\n", "2021-06-06 00:53:33 user_topics INFO: New parcel sending, size: 8\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-9 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 10 (10/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-10 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 11 (11/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-11 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 12 (12/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-12 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 13 (13/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-13 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 14 (14/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-14 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 15 (15/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-15 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 16 (16/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-16 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 17 (17/50)\n", "2021-06-06 00:53:33 user_topics INFO: New parcel sending, size: 8\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-17 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 18 (18/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-18 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 19 (19/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-19 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 20 (20/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-20 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 21 (21/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-21 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 22 (22/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-22 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 23 (23/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-23 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 24 (24/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-24 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 25 (25/50)\n", "2021-06-06 00:53:33 user_topics INFO: New parcel sending, size: 8\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-25 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 26 (26/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-26 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 27 (27/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-27 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 28 (28/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-28 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 29 (29/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-29 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 30 (30/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-30 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 31 (31/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-31 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 32 (32/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-32 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 33 (33/50)\n", "2021-06-06 00:53:33 user_topics INFO: New parcel sending, size: 8\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-33 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 34 (34/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-34 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 35 (35/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-35 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 36 (36/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-36 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 37 (37/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-37 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 38 (38/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-38 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 39 (39/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-39 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 40 (40/50)\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-40 is new\n", "2021-06-06 00:53:33 user_topics INFO: Receive 41 (41/50)\n", "2021-06-06 00:53:33 user_topics INFO: New parcel sending, size: 8\n", "2021-06-06 00:53:33 user_topics INFO: Document myDB-41 is new\n", "2021-06-06 00:53:34 user_topics INFO: Receive 42 (42/50)\n", "2021-06-06 00:53:34 user_topics INFO: Document myDB-42 is new\n", "2021-06-06 00:53:34 user_topics INFO: Receive 43 (43/50)\n", "2021-06-06 00:53:34 user_topics INFO: Document myDB-43 is new\n", "2021-06-06 00:53:34 user_topics INFO: Receive 44 (44/50)\n", "2021-06-06 00:53:34 user_topics INFO: Document myDB-44 is new\n", "2021-06-06 00:53:34 user_topics INFO: Receive 45 (45/50)\n", "2021-06-06 00:53:34 user_topics INFO: Document myDB-45 is new\n", "2021-06-06 00:53:34 user_topics INFO: Receive 46 (46/50)\n", "2021-06-06 00:53:34 user_topics INFO: Document myDB-46 is new\n", "2021-06-06 00:53:34 user_topics INFO: Receive 47 (47/50)\n", "2021-06-06 00:53:34 user_topics INFO: Document myDB-47 is new\n", "2021-06-06 00:53:34 user_topics INFO: Receive 48 (48/50)\n", "2021-06-06 00:53:34 user_topics INFO: Document myDB-48 is new\n", "2021-06-06 00:53:34 user_topics INFO: Receive 49 (49/50)\n", "2021-06-06 00:53:34 user_topics INFO: New parcel sending, size: 8\n", "2021-06-06 00:53:34 user_topics INFO: Document myDB-49 is new\n", "2021-06-06 00:53:34 user_topics INFO: Receive 50 (50/50)\n", "2021-06-06 00:53:34 user_topics INFO: Document myDB-50 is new\n", "2021-06-06 00:53:34 user_topics INFO: New parcel sending, size: 2\n", "2021-06-06 00:53:34 user_topics INFO: Task done\n", "\t\t\t\t\tTotal objects: 50\n", "\t\t\t\t\tSeen: 50\n", "\t\t\t\t\tNew: 50\n", "\t\t\t\t\tDiffer: 0\n", "\t\t\t\t\tDeleted: 0\n", "\t\t\t\t\tTask errors: 0\n", "\t\t\t\t\tExport errors: 0\n"]
    },
    'lootnika.log': {"status": "ok", "message": "", "offset": 0, "end": 11, "records": ["2021-06-02 21:50:42 Lootnika WARNING: Lootnika stopping on 0.0.0.0:8080\n", "2021-06-02 21:50:45 Lootnika INFO: Lootnika stopped\n", "2021-06-03 12:44:51 Lootnika WARNING: The previous shutdown was unexpected. Last lootnika status: working.\n", "2021-06-03 12:44:51 Lootnika WARNING: Creating new tasks journal scheme\n", "2021-06-03 12:44:52 Lootnika INFO: Found new exporter docs: lootnika_binary\n", "2021-06-03 12:44:52 Lootnika INFO: Found new exporter docs: lootnika_text\n", "2021-06-03 12:44:52 Lootnika INFO: Found new picker docs: lootnika_mysql\n", "2021-06-03 12:44:52 Lootnika INFO: Found new picker docs: lootnika_pyodbc\n", "2021-06-03 12:44:52 Lootnika WARNING: Found changes in documentations. Start me with <make-doc> key.\n", "2021-06-03 12:44:52 Lootnika INFO: Lootnika started - Source version: 1.2.0-beta.0_nt\n", "2021-06-03 12:44:52 Lootnika INFO: Welcome to http://localhost:8080/admin\n"]
    },
    'rest.log': {"status": "ok", "message": "", "offset": 0, "end": 9, "records": ["2021-06-03 12:44:52 RestServer INFO: Started on 0.0.0.0:8080\n", "2021-06-03 12:45:15 RestServer INFO: 127.0.0.1 200 \"GET /admin HTTP/1.1\" \"-\"\n", "2021-06-03 12:45:15 RestServer INFO: 127.0.0.1 200 \"GET /static/css/main.53f876fd.chunk.css HTTP/1.1\" \"http://localhost:8080/admin\"\n", "2021-06-03 12:45:15 RestServer INFO: 127.0.0.1 200 \"GET /static/js/main.c0740c1d.chunk.js HTTP/1.1\" \"http://localhost:8080/admin\"\n", "2021-06-03 12:45:15 RestServer INFO: 127.0.0.1 200 \"GET /static/css/4.92c2f793.chunk.css HTTP/1.1\" \"http://localhost:8080/admin\"\n", "2021-06-03 12:45:15 RestServer INFO: 127.0.0.1 200 \"GET /static/js/4.91885d0c.chunk.js HTTP/1.1\" \"http://localhost:8080/admin\"\n", "2021-06-03 12:45:15 RestServer INFO: 127.0.0.1 200 \"GET /static/js/0.df60b7b4.chunk.js HTTP/1.1\" \"http://localhost:8080/admin\"\n", "2021-06-03 12:45:15 RestServer INFO: 127.0.0.1 200 \"GET /static/js/7.963d82ee.chunk.js HTTP/1.1\" \"http://localhost:8080/admin\"\n", "2021-06-03 12:45:15 RestServer INFO: 127.0.0.1 200 \"GET /static/js/3.486ed8e7.chunk.js HTTP/1.1\" \"http://localhost:8080/admin\"\n", "2021-06-03 12:45:15 RestServer INFO: 127.0.0.1 404 \"GET /logo192.png HTTP/1.1\" \"http://localhost:8080/admin\"\n", "2021-06-03 12:45:15 RestServer INFO: 127.0.0.1 200 \"GET /a=getinfo HTTP/1.1\" \"http://localhost:8080/admin\"\n"]}
}
logRead['lootnika.log'].records = logRead['lootnika.log'].records.concat(logRead['lootnika.log'].records)
logRead['lootnika.log'].records = logRead['lootnika.log'].records.concat(logRead['lootnika.log'].records)

for (let i of Array(50) ){
    logRead['rest.log'].records.push('2021-06-03 12:45:15 RestServer INFO: 127.0.0.1 200 "GET /a=getinfo HTTP/1.1" "http://localhost:8080/admin"')
    logRead['rest.log'].records.push("2021-06-03 12:45:15 RestServer INFO: 127.0.0.1 200 \"GET /a=schedule?cmd=QueueInfo&limit=6 HTTP/1.1\" \"http://localhost:8080/admin\"\n")
}