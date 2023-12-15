import { db } from '../db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // 连接数据库并调用存储过程
        const query = 'CALL cache_all()';
        await db.query(query);

        res.status(200).json({ success: true, message: '存储过程 cache_all() 执行成功' });
    } catch (error) {
        console.error('调用存储过程时发生错误:', error);
        res.status(500).json({ error: '调用存储过程时发生错误' });
    } finally {
        db.end();
    }
}
