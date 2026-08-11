'use server';

import { redirect } from 'next/navigation';

export default function AdminIndex() {
  // Server-side redirect to the dashboard page
  redirect('/admin/dashboard');
}
