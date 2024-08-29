const { pool } = require('../configs/connectDB')


let getAllUsers = async (req, res) => {
    try {
        const result = await pool.promise().query('SELECT * FROM nhandien.sensor');
        const rows = result[0]; // Lấy dữ liệu từ kết quả truy vấn
        console.log('Rows:', rows);
        return res.status(200).json({
            data: rows
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

let getAll = async (req, res) => {
    try {
        const result = await pool.promise().query('SELECT * FROM IOT_2023.action_history');
        const rows = result[0]; // Lấy dữ liệu từ kết quả truy vấn
        console.log('Rows:', rows);
        return res.status(200).json({
            data: rows
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

let g

module.exports = {
    getAllUsers, 
    getAll
};