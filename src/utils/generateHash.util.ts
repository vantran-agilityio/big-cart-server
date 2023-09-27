// Libraries
import bcrypt from 'bcrypt';

const generateHash = (value: string) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(value, salt);

  return { hash };
};

export { generateHash };
