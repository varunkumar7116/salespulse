export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string; // e.g. "user.login", "sales.upload"
  module: string; // e.g. "auth", "sales"
  description: string;
  ipAddress: string;
  userAgent?: string;
  status: "success" | "failure";
  changes?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
  };
  createdAt: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  module?: string;
  actionUrl?: string;
  createdAt: string;
}
