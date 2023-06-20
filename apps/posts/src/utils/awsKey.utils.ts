import { v4 as uuid } from 'uuid';
export const generateAwsKey = (filename: string) => {
  return `${uuid()},,${filename}`;
};
