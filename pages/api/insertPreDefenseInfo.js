// import your database connection (db) here
import { db } from '../db';
import fs from 'fs';
export default async function handler(req, res) {
    try {
        // Extract user input from the POST request body
        const {
            groupNumber,
            sequence,
            qualificationNumber,
            preDefenseTimeStart,
            preDefenseTimeEnd,
            defenseLocation,
            committeeMember1,
            committeeMember2,
            committeeMember3,
        } = req.body;

        // Execute the SQL insert query for the 'PreDefenseInfo' table
        const query =
            'INSERT INTO PreDefenseInfo VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const result = await db.query(query, [
            groupNumber,
            sequence,
            qualificationNumber,
            preDefenseTimeStart,
            preDefenseTimeEnd,
            defenseLocation,
            committeeMember1,
            committeeMember2,
            committeeMember3,
        ]);

        // Construct an object with the inserted data
        const insertedData = {
            groupNumber,
            sequence,
            qualificationNumber,
            preDefenseTimeStart,
            preDefenseTimeEnd,
            defenseLocation,
            committeeMember1,
            committeeMember2,
            committeeMember3,
        };
        // 记录插入日志
    const logEntry = `INSERT INTO PreDefenseInfo VALUES (${groupNumber}, ${sequence}, '${qualificationNumber}', '${preDefenseTimeStart}', '${preDefenseTimeEnd}', '${defenseLocation}', '${committeeMember1}', '${committeeMember2}', '${committeeMember3}');\n`;
    fs.appendFileSync('public/insertPreDefenseInfo.txt', logEntry);


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
