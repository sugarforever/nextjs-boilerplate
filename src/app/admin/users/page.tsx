import prisma from '@/lib/prisma';
import { UserManagementTable } from './user-management-table';
import { redirect } from 'next/navigation';

export default async function UsersPage() {
  if (!prisma) {
    redirect('/');
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users Management</h1>
        <p className="text-muted-foreground">Manage user accounts and permissions</p>
      </div>
      <UserManagementTable users={users} />
    </div>
  );
}
