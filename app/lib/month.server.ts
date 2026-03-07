import { getAvailableMonths } from './sheets.server';

export async function resolveActiveMonth(
  cookieMonth?: string
): Promise<{ months: string[]; activeMonth: string }> {
  const months = await getAvailableMonths();

  if (months.length === 0) {
    throw new Error(
      'No monthly sheet tabs found. Create a tab named YYYY-MM (e.g., 2025-07) in the spreadsheet.'
    );
  }

  // Priority 1: cookie value, if it still exists as a tab
  if (cookieMonth && months.includes(cookieMonth)) {
    return { months, activeMonth: cookieMonth };
  }

  // Priority 2: current calendar month
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  if (months.includes(currentMonth)) {
    return { months, activeMonth: currentMonth };
  }

  // Priority 3: most recent available month
  return { months, activeMonth: months[0] };
}
