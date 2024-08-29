// const express = require('express')
// const logger = require('morgan')
// const bodyParser = require('body-parser');
// const mysql = require('mysql2/promise'); // Sử dụng mysql2/promise để sử dụng Promises

// const app = express()

// app.use(logger('dev'))

// // Kết nối với database MySQL
// const dbConfig = {
//     host: 'localhost',
//     port: '3306',
//     database: 'caotest',
//     user: 'root',
//     password: '12345678',
// };


// const pool = mysql.createPool(dbConfig);

// // Route lấy dữ liệu từ database
// app.get('/action', async (req, res, next) => {
//     try {
//         const connection = await pool.getConnection();
//         console.log("thanh cong tb1");
//         const [rows, fields] = await connection.query('SELECT * FROM caotest.caotable'); // Sửa lại tên bảng nếu cần
//         connection.release();

//         res.status(200).json({
//             action: rows,
//         });
//     } catch (err) {
//         next(err);
//     }
// });

// app.get('/', (req, res, next) => {
//     return res.status(200).json({
//         message: 'Server is OK!'
//     })
// })

// // app.use((req, res, next) => {
// //     const err = new Error('Not Found')
// //     err.status = 404
// //     next(err)
// // })

// // app.use(() => {
// //     const error = app.get('env') === 'development' ? err : {}
// //     const status = err.status || 500
// //     res.status(status).json({
// //         error: {
// //             message: error.message
// //         }
// //     })
// // })

// const port = app.get('port') || 8080
// app.listen(port, () => console.log(`Server is listening on port ${port}`))


// code cũ 1 
// tách comment 1
// không bôi đen đoạn này

// const express = require('express')
// const path = require('path')
// const app = express()
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*'); // Cho phép truy cập từ mọi domain
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });
// const port = 8081
// const APIController = require('./controller/APIController')
// const connection = require('./configs/connectDB')
// // const mysql = require('mysql2');

// // import initAPIRoute from './route/api'
// const initAPIRoute = require('./route/api')


// //config template engine
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'ejs')

// // config static files
// app.use(express.static(path.join(__dirname, 'public')))

// app.get('/', (req, res) => {
//     res.send('Hello World! nodemon')
// })
// app.get('/abc', (req, res) => {
//     res.send('Abc')
// })
// app.get('/hoidanit', (req, res) => {
//     // res.send('<h1>Hoidanit</h1>')
//     res.render('sample.ejs')
// })

// //test connection
// // const connection = mysql.createConnection({
// //     host: 'localhost',
// //     port: 3306,
// //     user: 'root',
// //     password: '12345678',
// //     database: 'caotest'
// // });

// // simple query
// // connection.query(
// //     'SELECT * FROM caotest.caotable',
// //     function (err, results, fields) {
// //         console.log(">>>results= ", results); // results contains rows returned by server
// //         console.log(">>>fields= ", fields); // fields contains extra meta data about results, if available
// //     }
// // );


// //init API route
// // initAPIRoute(app)

// //tách comment 2
// initAPIRoute(app)



// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })

// tách code 3

// server mới

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const mqtt = require('mqtt');

const app = express();
const server = require('http').createServer(app);

app.use(logger('dev'));
app.use(express.json());

// Sử dụng bodyParser để phân tích dữ liệu JSON từ client
app.use(bodyParser.json());

// database config
const dbConfig = {
    host: 'localhost',
    port: '3306',
    database: 'IOT_2023',
    user: 'root',
    password: '12345678',
};

const pool = mysql.createPool(dbConfig);

const mqttClient = mqtt.connect('mqtt://broker.emqx.io');
const mqttTopic = 'mcu8266/tmp';

// đoạn này dùng để sub vào topic để lấy dữ liệu nhiẹt độ độ ẩm
mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe(mqttTopic);
});

//  đoạn này là lấy message ra ngoài để lưu vào database. call function saveToDatabase ><
mqttClient.on('message', (topic, message) => {
    // Handle incoming MQTT messages
    try {
        // console.log(message)
        const data = JSON.parse(message);
        saveToDatabase(data);
    } catch (error) {
        console.error('Error parsing MQTT message:', error.message);
    }
});

// function save database
async function saveToDatabase(data) {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to the database');

        // Insert data into the database
        await connection.execute('INSERT INTO data_sensor (temperature, humidity, light) VALUES (?, ?, ?)', [data.temperature, data.humidity, data.light]);

        connection.release();

        console.log('Data saved to the database');
    } catch (error) {
        console.error('Error saving data to the database:', error.message);
    }
}

// Định nghĩa API endpoint để nhận trạng thái đèn từ client và ghi vào cơ sở dữ liệu và lưu vào dbs
// nona là lấy cái sự kiện được truyền từ frontend qua backend. Back nghe được thì sẽ biến đổi
// cái req để phân tích xem front truyền cho cái gì. truyền true thì ông sẽ chuyển thành on ngược lại.
app.post('/api/updateLightStatus', async (req, res) => {
    let light = "";
    if (req.body.status == true) {
        light = "on";
        const topic = "esp8266/led";
        mqttClient.publish(topic, light);
        console.log(req.body);
    }
    if (req.body.status == false) {
        light = "off";
        const topic = "esp8266/led";
        mqttClient.publish(topic, light);
        console.log(req.body);
    }
    try {
        const connection = await pool.getConnection();
        console.log("Connected to action_history table");

        // Thực hiện truy vấn để ghi trạng thái đèn vào cơ sở dữ liệu
        const query = 'INSERT INTO action_history (name, status) VALUES (?, ?)';
        const [rows, fields] = await connection.execute(query, ["Led", light]);

        connection.release();

        console.log('Inserted light status into database');
        res.json({ message: 'Light status updated successfully' });
    } catch (err) {
        console.error('Error inserting light status into database:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Định nghĩa API endpoint để nhận trạng thái quat từ client và ghi vào cơ sở dữ liệu và lưu vào dbs
// tương tự như đèn
app.post('/api/updateFanStatus', async (req, res) => {
    let quay = "";
    if (req.body.status == true) {
        quay = "on";
        const topic = "esp8266/fan";
        mqttClient.publish(topic, quay);
        console.log(req.body);
    }
    if (req.body.status == false) {
        quay = "off";
        const topic = "esp8266/fan";
        mqttClient.publish(topic, quay);
        console.log(req.body);
    }
    try {
        const connection = await pool.getConnection();
        console.log("Connected to action_history table");

        // Thực hiện truy vấn để ghi trạng thái đèn vào cơ sở dữ liệu
        const query = 'INSERT INTO action_history (name, status) VALUES (?, ?)';
        const [rows, fields] = await connection.execute(query, ["Quat", quay]);

        connection.release();

        console.log('Inserted light status into database');
        res.json({ message: 'Light status updated successfully' });
    } catch (err) {
        console.error('Error inserting light status into database:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// api này dùng để get ra dữ liệu của bảng data_sensor (bảng dữ liệu nhiệt độ độ ẩm) 
// (10 phần tử cuối cùng theo hướng ngược lại theo cột ID)
app.get('/data_tmp', async (req, res, next) => {
    try {
        const connection = await pool.getConnection();
        console.log("Connected to data_sensor table");
        const [rows, fields] = await connection.query('SELECT * FROM data_sensor ORDER BY id DESC LIMIT 10');
        connection.release();

        res.status(200).json({
            action: rows,
        });

    } catch (err) {
        next(err);
    }
});

// get api history on of in led
// lấy ra toàn bộ lịch sử on và of của đèn
app.get('/history', async (req, res, next) => {
    try {
        const connection = await pool.getConnection();
        console.log("Connected to action_history table");
        const [rows, fields] = await connection.query('SELECT * FROM action_history');
        connection.release();

        res.status(200).json({
            sensor: rows,
        });
    } catch (err) {
        next(err);
    }
});

// api get date + time status on of 
// lấy ra trạng thái on of theo thời gian được lựa chọn ( ngày + thời gian)
app.get('/api/search_data_sensor', async (req, res) => {
    const connection = await pool.getConnection();
    const { startTime, endTime } = req.query;
    const sql = 'SELECT * FROM action_history WHERE created_at >= FROM_UNIXTIME(?) AND created_at <= FROM_UNIXTIME(?)';
    // ??
    const [rows, fields] = await connection.query(sql, [startTime, endTime]);
    connection.release();

    res.status(200).json({
        sensor: rows,
    })
});

// api get date + time datasensor data + time  
// tương tự. đây là bảng nhiệt độ độ ẩm
app.get('/api/search_data', async (req, res) => {
    const connection = await pool.getConnection();
    const { startTime, endTime } = req.query;
    const sql = 'SELECT * FROM data_sensor WHERE created_at >= FROM_UNIXTIME(?) AND created_at <= FROM_UNIXTIME(?)';
    // ??
    const [rows, fields] = await connection.query(sql, [startTime, endTime]);
    connection.release();

    res.status(200).json({
        rows
    })
});

// api get số lần on của bóng đèn trong cả bảng
app.get('/count_led_on',async (req, res) => {
    const connection = await pool.getConnection();
    const sql = 'SELECT COUNT(*) as count FROM IOT_2023.action_history where name = "Led" and status = "on"';
    const [rows, fields] = await connection.query(sql);
    connection.release();

    res.status(200).json({
        rows,
    })
});
// api get số lần of của bóng đèn trong cả bảng
app.get('/count_led_off',async (req, res) => {
    const connection = await pool.getConnection();
    const sql = 'SELECT COUNT(*) as count FROM IOT_2023.action_history where name = "Led" and status = "off"';
    const [rows, fields] = await connection.query(sql);
    connection.release();

    res.status(200).json({
        rows,
    })
});

//

const port = process.env.PORT || 8081;
server.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});
