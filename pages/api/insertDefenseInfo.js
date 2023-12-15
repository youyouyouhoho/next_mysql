import { db } from '../db';
import fs from 'fs';
export default async function handler(req, res) {
    try {
        // Extract user input from the POST request body
        const {
            groupNumber,
            sequence,
            qualificationNumber,
            defenseTimeStart,
            defenseTimeEnd,
            defenseLocation,
            committeeMember1,
            committeeMember2,
            committeeMember3,
            committeeMember4,
            externalCommitteeMember,
        } = req.body;

        // Execute the SQL insert query for the 'DefenseInfo' table
        const query =
            'INSERT INTO DefenseInfo VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const result = await db.query(query, [
            groupNumber,
            sequence,
            qualificationNumber,
            defenseTimeStart,
            defenseTimeEnd,
            defenseLocation,
            committeeMember1,
            committeeMember2,
            committeeMember3,
            committeeMember4,
            externalCommitteeMember,
        ]);

        const insertedData = {
            groupNumber,
            sequence,
            qualificationNumber,
            defenseTimeStart,
            defenseTimeEnd,
            defenseLocation,
            committeeMember1,
            committeeMember2,
            committeeMember3,
            committeeMember4,
            externalCommitteeMember,
        };
        // 记录插入日志
    const logEntry = `INSERT INTO DefenseInfo VALUES (${groupNumber}, ${sequence}, '${qualificationNumber}', '${defenseTimeStart}', '${defenseTimeEnd}', '${defenseLocation}', '${committeeMember1}', '${committeeMember2}', '${committeeMember3}', '${committeeMember4}', '${externalCommitteeMember}');\n`;
    fs.appendFileSync('public/insertDefenseInfo.txt', logEntry);
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
