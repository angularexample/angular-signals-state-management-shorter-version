import { XxxUserApiResponse, XxxUserType } from './xxx-user-types';

export const mockUser: XxxUserType = {
  firstName: 'John',
  id: 1,
  lastName: 'Doe',
};

export const mockUsers: XxxUserType[] = [mockUser];

export const mockXxxUserApiResponse: XxxUserApiResponse = {
  limit: 10,
  skip: 0,
  total: 1,
  users: mockUsers,
};
