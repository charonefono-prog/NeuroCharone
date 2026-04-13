import { getDb } from '../server/db';
import { users } from '../drizzle/schema';
import { v4 as uuidv4 } from 'uuid';

async function createAdmin() {
  try {
    const db = await getDb();
    if (!db) {
      console.error('Database not available');
      process.exit(1);
    }

    const openId = uuidv4();
    
    const result = await db.insert(users).values({
      openId,
      email: 'charonejr@gmail.com',
      name: 'Admin',
      role: 'admin',
      loginMethod: 'email',
      lastSignedIn: new Date(),
    });

    console.log('Admin user created successfully with openId:', openId);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
