import mysql from 'mysql2/promise';

async function insertAdmin() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'gateway02.us-east-1.prod.aws.tidbcloud.com',
      user: '3uRLT9dvpRVtv1Z.59e047063c03',
      password: '2nxuN2Qj82ix8pmAso1D',
      database: 'mUCtWCKwF3aoCHWs5odRP4',
      port: 4000,
      ssl: {
        rejectUnauthorized: false
      },
    });

    console.log('Connected to database');

    // Check if user exists
    const [rows] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['charonejr@gmail.com']
    );

    if (rows.length > 0) {
      console.log('Admin user already exists');
      await connection.end();
      return;
    }

    // Insert admin user
    const [result] = await connection.execute(
      `INSERT INTO users (email, password, name, role, isActive, approvedAt, approvedBy, loginMethod, createdAt, updatedAt, lastSignedIn) 
       VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, NOW(), NOW(), NOW())`,
      [
        'charonejr@gmail.com',
        '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
        'Admin',
        'admin',
        1,
        'system',
        'email'
      ]
    );

    console.log('Admin user inserted successfully with ID:', result.insertId);
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
    if (connection) await connection.end();
  }
}

insertAdmin();
