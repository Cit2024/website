import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/features/auth/auth';
import { db } from '@/lib/db';
import { auditActions } from '@/lib/audit-log';
import { createRateLimitMiddleware } from '@/lib/rate-limit';

// Admin role check
const ADMIN_ROLES = ['GENERAL_MANAGER', 'NEWS_EDITOR', 'REQUEST_REVIEWER'];

async function checkAdminAuth() {
  const session = await auth();
  if (!session?.user || !ADMIN_ROLES.includes(session.user.role as string)) {
    return null;
  }
  return session;
}

// Search collaborators endpoint
export async function GET(req: NextRequest) {
  const session = await checkAdminAuth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const type = searchParams.get('type') || 'collaborators';
  const query = searchParams.get('q') || '';
  const status = searchParams.get('status') || 'all';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const skip = (page - 1) * limit;

  try {
    if (type === 'collaborators') {
      const where: any = {};
      
      if (query) {
        where.OR = [
          { companyName: { contains: query } },
          { email: { contains: query } },
          { primaryPhoneNumber: { contains: query } },
          { specialization: { contains: query } },
        ];
      }
      
      if (status !== 'all') {
        where.status = status;
      }

      const [total, collaborators] = await Promise.all([
        db.collaborator.count({ where }),
        db.collaborator.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      return NextResponse.json({
        data: collaborators,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } else if (type === 'innovators') {
      const where: any = {};
      
      if (query) {
        where.OR = [
          { name: { contains: query } },
          { email: { contains: query } },
          { phone: { contains: query } },
          { projectTitle: { contains: query } },
        ];
      }
      
      if (status !== 'all') {
        where.status = status;
      }

      const [total, innovators] = await Promise.all([
        db.innovator.count({ where }),
        db.innovator.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      return NextResponse.json({
        data: innovators,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } else if (type === 'audit') {
      const where: any = {};
      
      if (query) {
        where.OR = [
          { userEmail: { contains: query } },
          { action: { contains: query } },
          { entity: { contains: query } },
        ];
      }

      const [total, logs] = await Promise.all([
        db.auditLog.count({ where }),
        db.auditLog.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      return NextResponse.json({
        data: logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    );
  }
}

// Export endpoint
export async function POST(req: NextRequest) {
  const session = await checkAdminAuth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { type, format = 'json', filters = {} } = body;

    let data: any[] = [];
    
    if (type === 'collaborators') {
      data = await db.collaborator.findMany({
        where: filters,
        include: {
          experienceProvidedMedia: true,
          machineryAndEquipmentMedia: true,
        },
      });
    } else if (type === 'innovators') {
      data = await db.innovator.findMany({
        where: filters,
      });
    } else if (type === 'audit') {
      data = await db.auditLog.findMany({
        where: filters,
        orderBy: { createdAt: 'desc' },
        take: 1000, // Limit audit log export
      });
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    // Log the export action
    await auditActions.logExport(
      session.user.id,
      session.user.email || 'unknown',
      type.toUpperCase(),
      { count: data.length, filters }
    );

    if (format === 'csv') {
      // Convert to CSV
      const csvData = convertToCSV(data);
      return new NextResponse(csvData, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${type}_export_${new Date().toISOString()}.csv"`,
        },
      });
    } else {
      // Return as JSON
      return NextResponse.json({
        data,
        count: data.length,
        exportedAt: new Date().toISOString(),
        exportedBy: session.user.email,
      });
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

// Helper function to convert data to CSV
function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value).includes(',') ? `"${value}"` : value;
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
}
