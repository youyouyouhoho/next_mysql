// 导入数据库连接
import { db } from '../db';
import fs from 'fs';

export default async function handler(req, res) {
  try {
    // 从POST请求体中提取用户输入
    const { name, department, title } = req.body;

    // 执行导师表的SQL插入语句
    const query = 'INSERT INTO Advisor VALUES(?, ?, ?)';
    const result = await db.query(query, [name, department, title]);

    // 构造插入数据的对象
    const insertedData = {
      name,
      department,
      title,
    };

    // 记录插入日志
    const logEntry = `INSERT INTO Advisor VALUES('${name}', '${department}', '${title}');\n`;
    fs.appendFileSync('public/insertAdvisor.txt', logEntry);

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
