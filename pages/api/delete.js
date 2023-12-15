// pages/api/delete.js

import { db } from '../db';

export default async function handler(req, res) {
    const { table } = req.query;
    
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        if (!table) {
            return res.status(400).json({ error: 'Missing table parameter' });
        }
      
        // 连接数据库并执行删除操作
        const query = 'DELETE FROM ??';
        const data = await db.query(query, [table]);

        res.status(200).json({ success: true, message: `表 ${table} 中所有数据已成功删除` });
    } catch (error) {
        console.error(`删除表 ${table} 中所有数据时发生错误:`, error);
        res.status(500).json({ error: `删除表 ${table} 中所有数据时发生错误` });
    } finally {
        db.end();
    }
}
