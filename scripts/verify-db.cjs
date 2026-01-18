(async () => {
  try {
    const { pool } = require('../lib/sql');
    const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name");
    console.log('Tables in public schema:');
    console.log(res.rows.map(r => r.table_name).join(', '));
    const ev = (await pool.query('SELECT COUNT(*)::int as count FROM events')).rows[0].count;
    const nw = (await pool.query('SELECT COUNT(*)::int as count FROM news')).rows[0].count;
    let giCount = 0;
    try {
      giCount = (await pool.query('SELECT COUNT(*)::int as count FROM gallery_images')).rows[0].count;
    } catch (e) {
      giCount = 'N/A';
    }
    console.log('counts => events:', ev, ' news:', nw, ' gallery_images:', giCount);
    await pool.end();
  } catch (err) {
    console.error('Verification failed:', err);
    process.exit(1);
  }
})();
