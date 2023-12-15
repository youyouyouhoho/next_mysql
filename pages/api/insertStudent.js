// Import necessary modules and database connection
import { db } from '../db';
import fs from 'fs';

export default async function insertStudent(req, res) {
    try {
        // Extract data from the request body
        const { qualificationNumber, name, major, supervisor, thesisTitle } = req.body;

        // Execute the SQL insert query for the 'Student' table
        const query =
            'INSERT INTO Student (Sno, Sname, Smajor, AdvisorName, PaperTitle) VALUES (?, ?, ?, ?, ?)';
        const result = await db.query(query, [
            qualificationNumber,
            name,
            major,
            supervisor,
            thesisTitle,
        ]);

        // 记录插入日志
    const logEntry = `INSERT INTO Student VALUES('${qualificationNumber}', '${name}', '${major}', '${supervisor}', '${thesisTitle}');\n`;
    fs.appendFileSync('public/insertStudent.txt', logEntry);
        if (result.affectedRows > 0) {
            res.status(200).json({ success: '数据插入成功！' });
        } else {
            res.status(500).json({ error: '数据插入失败。' });
        }
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
