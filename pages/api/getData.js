import { db } from '../db';
export default async function handler(req, res) {
  const { table } = req.query;

  try {
    if (!table) {
      return res.status(400).json({ error: 'Missing table parameter' });
    }

    const query = 'SELECT * FROM ??';
    const data = await db.query(query, [table]);

    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  } finally {
    db.end();
  }
}
