export interface LoginRequest {
  email: string;
  password: string;
  client_id: string;
}

export interface LoginResponse {
  access_token: string;
  expires_in: number;
}
