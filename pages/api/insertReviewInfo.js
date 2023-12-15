// Import necessary modules and database connection
import { db } from '../db';
import fs from 'fs';
export default async function insertReviewInfo(req, res) {
    try {
        // Extract data from the request body
        const {
            groupNumber,
            sequence,
            qualificationNumber,
            reviewTimeStart,
            reviewTimeEnd,
            defenseLocation,
            committeeMember1,
            committeeMember2,
            committeeMember3,
        } = req.body;
 // 记录插入日志
 const logEntry = `INSERT INTO ReviewInfo VALUES('${groupNumber}', '${sequence}', '${qualificationNumber}', '${reviewTimeStart}', '${reviewTimeEnd}', '${defenseLocation}', '${committeeMember1}', '${committeeMember2}', '${committeeMember3}');\n`;
 fs.appendFileSync('public/insertReviewInfo.txt', logEntry);
        // Execute the SQL insert query for the 'ReviewInfo' table
        const query =
            'INSERT INTO ReviewInfo VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const result = await db.query(query, [
            groupNumber,
            sequence,
            qualificationNumber,
            reviewTimeStart,
            reviewTimeEnd,
            defenseLocation,
            committeeMember1,
            committeeMember2,
            committeeMember3,
        ]);
       
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
