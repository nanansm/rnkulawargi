import { createCookie } from 'react-router';

export const selectedMonthCookie = createCookie('selected_month', {
  maxAge: 60 * 60 * 24 * 90, // 90 days
  path: '/',
});

export const selectedUserCookie = createCookie('selected_user', {
  maxAge: 60 * 60 * 24 * 90,
  path: '/',
});
