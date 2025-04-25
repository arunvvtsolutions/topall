'use server';

import { cookies } from 'next/headers';

export async function removeCookies() {
  cookies().delete('refreshToken');
  cookies().delete('role');
  cookies().delete('mobileNumber');
}
