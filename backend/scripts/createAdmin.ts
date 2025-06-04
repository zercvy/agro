import bcrypt from 'bcrypt';
import { db } from '../src/models/db';

const createAdmin = async () => {
  const email = 'admin@example.com';
  const password = 'admin123';
  const hashed = await bcrypt.hash(password, 10);

  await db.query(
    'INSERT INTO admins (email, password) VALUES (?, ?)',
    [email, hashed]
  );

  console.log('✅ Админ создан:', email);
  process.exit();
};

createAdmin();
