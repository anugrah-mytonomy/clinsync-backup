export interface LoginRequest {
  email: string;
  password: string;
  client_id: string;
}

export interface LoginResponse {
  access_token: string;
  expires_in: number;
}

// GET /centralauth/get_current_user_data
export interface CurrentUserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  status: { id: string } & Record<string, unknown>;
}

export type PermissionMenu = 'DA' | 'LB' | 'SH';

export type PermissionAction = 'read' | 'upload' | 'modify';

export interface Session {
  user: { userId: number; roles: string[] };
  organization: { organizationId: string; name: string; config: Record<string, unknown> };
  permissions: Partial<Record<PermissionMenu, PermissionAction[]>>;
  tokenExpiresAt: string; // ISO datetime
}

export interface ClinsyncApiError {
  error: { code: string; message: string; details: unknown[]; request_id: string };
}
