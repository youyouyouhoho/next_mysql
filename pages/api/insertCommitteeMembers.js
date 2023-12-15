import { db } from '../db';
import fs from 'fs';
export default async function handler(req, res) {
    try {
        // Extract user input from the POST request body
        const { name, department, title, isSupervisor, isInSchool } = req.body;

        // Execute the SQL insert query for the 'CommitteeMembers' table
        const query = 'INSERT INTO CommitteeMembers VALUES (?, ?, ?, ?, ?)';
        const result = await db.query(query, [name, department, title, isSupervisor, isInSchool]);

        // Construct an object with the inserted data
        const insertedData = {
            name,
            department,
            title,
            isSupervisor,
            isInSchool,
        };
// 记录插入日志
const logEntry = `INSERT INTO CommitteeMembers VALUES('${name}', '${department}', '${title}', '${isSupervisor}', '${isInSchool}');\n`;
fs.appendFileSync('public/insertCommitteeMembers.txt', logEntry);
        res.status(200).json({ insertedData });
    } catch (error) {
        if (error.sqlMessage) {
            console.error('插入失败。');
            res.status(400).json({ error: error.sqlMessage });
        }  else {
            // Handle other generic errors
            res.status(500).json({ error: '插入数据到表时发生错误。' });
        }
    }
}
