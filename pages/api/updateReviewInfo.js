import { db } from '../db';
import fs from 'fs';

export default async function handler(req, res) {
    try {
        // Extract user input from the POST request body
        const {
            RGroupID,
            RMember1Name, RMember2Name, RMember3Name
        } = req.body;

        // Execute the SQL update query for the 'DefenseInfo' table
        const query =
            'UPDATE tmpreviewinfo SET RMember1Name = ?, RMember2Name = ?, RMember3Name = ? WHERE RGroupID = ?';
        const result = await db.query(query, [
            RMember1Name,
            RMember2Name,
            RMember3Name,
            RGroupID,
        ]);

        // 记录更新日志
        // const logEntry = `UPDATE DefenseInfo SET DMem1Name = '${committeeMember1}', DMem2Name = '${committeeMember2}', DMem3Name = '${committeeMember3}', DMem4Name = '${committeeMember4}', DMem5Name = '${externalCommitteeMember}' WHERE DGroupID = ${groupNumber};\n`;
        // fs.appendFileSync('public/updateDefenseInfo.txt', logEntry);

        res.status(200).json({ updatedData: req.body });
    } catch (error) {
        if (error.sqlMessage) {
            console.error('更新失败。');
            res.status(400).json({ error: error.sqlMessage });
        } else {
            // Handle other generic errors
            res.status(500).json({ error: '更新数据时发生错误。' });
        }
    }
}
