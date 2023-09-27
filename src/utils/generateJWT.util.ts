import jwt from 'jwt-simple';

interface IOptions {
  secretOrKey: string;
}

interface IPayload {
  userId: number;
}

const generateJWT = ({ secretOrKey }: IOptions, payload: IPayload): string =>
  `JWT ${jwt.encode(payload, secretOrKey)}`;

export { generateJWT };
