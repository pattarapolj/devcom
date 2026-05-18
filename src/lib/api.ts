import { IAccount } from '@/app/database/account.model';
import { IUser } from '@/app/database/user.model';


import { fetchHandler } from './handlers/fetch';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const api = {
  users: {
    getAll: () => fetchHandler(`${apiBaseUrl}/users`),
    getById: (id: string) => fetchHandler(`${apiBaseUrl}/users/${id}`),
    getByEmail: (email: string) => fetchHandler(`${apiBaseUrl}/users/email`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
    create: (userData: Partial<IUser>) => fetchHandler(`${apiBaseUrl}/users`, {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    update: (id: string, userData: Partial<IUser>) => fetchHandler(`${apiBaseUrl}/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
    delete: (id: string) => fetchHandler(`${apiBaseUrl}/users/${id}`, {
      method: 'DELETE',

    })
  },
  account: {
    getAll: () => fetchHandler(`${apiBaseUrl}/accounts`),
    getById: (id: string) => fetchHandler(`${apiBaseUrl}/accounts/${id}`),
    getByProvider: (provider: string) => fetchHandler(`${apiBaseUrl}/accounts/provider`, {
      method: 'POST',
      body: JSON.stringify({ provider }),
    }),
    create: (accountData: Partial<IAccount>) => fetchHandler(`${apiBaseUrl}/accounts`, {
      method: 'POST',
      body: JSON.stringify(accountData),
    }),
    update: (id: string, accountData: Partial<IAccount>) => fetchHandler(`${apiBaseUrl}/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(accountData),
    }),
    delete: (id: string) => fetchHandler(`${apiBaseUrl}/accounts/${id}`, {
      method: 'DELETE',
    })
  }
}