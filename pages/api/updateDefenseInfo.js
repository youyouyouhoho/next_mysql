import { db } from '../db';
import fs from 'fs';

export default async function handler(req, res) {
  try {
    // Extract user input from the POST request body
    const {
        DGroupID,
        DMem1Name,
        DMem2Name,
        DMem3Name,
        DMem4Name,
        DMem5Name,
    } = req.body;

    // Execute the SQL update query for the 'DefenseInfo' table
    const query =
      'UPDATE tmpdefenseinfo SET DMem1Name = ?, DMem2Name = ?, DMem3Name = ?, DMem4Name = ?, DMem5Name = ? WHERE DGroupID = ?';
    const result = await db.query(query, [
        DMem1Name,
      DMem2Name,
      DMem3Name,
      DMem4Name,
      DMem5Name,
      DGroupID,
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
