import { db } from '@/lib/db';
import { auth } from '@/features/auth/auth';

export interface AuditLogEntry {
  action: string;
  entity: string;
  entityId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(entry: AuditLogEntry) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      console.error('No user session found for audit log');
      return null;
    }

    const log = await db.auditLog.create({
      data: {
        userId: session.user.id,
        userEmail: session.user.email || 'unknown',
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId,
        details: entry.details,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
      },
    });

    return log;
  } catch (error) {
    console.error('Failed to create audit log:', error);
    return null;
  }
}

// Helper function for common audit scenarios
export const auditActions = {
  async logLogin(userId: string, email: string, ipAddress?: string) {
    await db.auditLog.create({
      data: {
        userId,
        userEmail: email,
        action: 'LOGIN',
        entity: 'AUTH',
        ipAddress,
      },
    });
  },

  async logLogout(userId: string, email: string) {
    await db.auditLog.create({
      data: {
        userId,
        userEmail: email,
        action: 'LOGOUT',
        entity: 'AUTH',
      },
    });
  },

  async logApproval(
    userId: string,
    email: string,
    entity: 'INNOVATOR' | 'COLLABORATOR',
    entityId: string,
    details?: any
  ) {
    await db.auditLog.create({
      data: {
        userId,
        userEmail: email,
        action: 'APPROVE',
        entity,
        entityId,
        details,
      },
    });
  },

  async logRejection(
    userId: string,
    email: string,
    entity: 'INNOVATOR' | 'COLLABORATOR',
    entityId: string,
    details?: any
  ) {
    await db.auditLog.create({
      data: {
        userId,
        userEmail: email,
        action: 'REJECT',
        entity,
        entityId,
        details,
      },
    });
  },

  async logExport(
    userId: string,
    email: string,
    entity: string,
    details?: any
  ) {
    await db.auditLog.create({
      data: {
        userId,
        userEmail: email,
        action: 'EXPORT',
        entity,
        details,
      },
    });
  },

  async logPasswordChange(userId: string, email: string, ipAddress?: string) {
    await db.auditLog.create({
      data: {
        userId,
        userEmail: email,
        action: 'PASSWORD_CHANGE',
        entity: 'AUTH',
        ipAddress,
      },
    });
  },
};

// Query helpers for audit logs
export async function getAuditLogs(options?: {
  userId?: string;
  entity?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}) {
  const where: any = {};
  
  if (options?.userId) where.userId = options.userId;
  if (options?.entity) where.entity = options.entity;
  if (options?.action) where.action = options.action;
  
  if (options?.startDate || options?.endDate) {
    where.createdAt = {};
    if (options.startDate) where.createdAt.gte = options.startDate;
    if (options.endDate) where.createdAt.lte = options.endDate;
  }

  return db.auditLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: options?.limit || 50,
    skip: options?.offset || 0,
  });
}
