import { db } from '../db';

export default async function handler(req, res) {
    try {
        // Extract user input from the POST request body
        const { id, name, number } = req.body;

        // Execute the SQL insert query for the 'test' table
        const query = 'CALL insert_test_procedure(?, ?, ?)';
        const result = await db.query(query, [id, name, number]);

        // Construct an object with the inserted data
        const insertedData = {
            id,
            name,
            number,
        };

        res.status(200).json({ insertedData });
    } catch (error) {
        console.error('Insertion failed:', error);
        if (error.sqlMessage && error.sqlMessage.includes('Number exceeds the threshold')) {
            console.error('Number exceeds the threshold. 插入失败。');
            // 在这里处理触发器错误的逻辑，可以通过消息提示给前端用户
          }
        if (error.code === 'ER_SIGNAL_EXCEPTION') {
            console.error('存储过程调用失败:', error.message);
            if (error.sqlState === '42321') {
                console.error('主键重复错误处理逻辑...');
                res.status(400).json({ error: 'rPrimaryKey，插入失败，已存在相同的记录。请提供唯一的 ID。' });
                // 在这里处理主键重复错误的逻辑，可以通过消息提示给前端用户
            } 
        }
        if (error.code === 'ER_DUP_ENTRY') {
            // Check if the error message contains information about rPrimaryKey
            if (error.message.includes('rPrimaryKey')|| error.sqlMessage.includes('rPrimaryKey')) {
                res.status(400).json({ error: 'rPrimaryKey，插入失败，已存在相同的记录。请提供唯一的 ID。' });
            } else {
                res.status(400).json({ error: '违反唯一性约束。' });
            }
        } else if (error.code === 'ER_PARSE_ERROR') {
            res.status(400).json({ error: 'SQL语法解析错误。' });
        } else if (error.code === 'ER_NO_SUCH_TABLE') {
            res.status(400).json({ error: '表不存在错误。' });
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            res.status(403).json({ error: '访问被拒绝，无足够的权限。' });
        } else if (error.code === 'ER_DATA_TOO_LONG') {
            res.status(400).json({ error: '数据过长，无法存储在指定的列中。' });
        } else if (error.code === 'ER_UNKNOWN_COLUMN') {
            res.status(400).json({ error: '未知列名错误。' });
        } 
        else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            // 处理外键约束违反错误
            console.error('外键约束违反，确保 name 对应于 reference_table 中的 referenced_field。');
            res.status(400).json({ error: '外键约束违反。' });
        }
        else {
            res.status(500).json({ error: '插入数据到表时发生错误。' });
        }
        
    }
}
