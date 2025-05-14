export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errorCode: string | null;
  errors: any | null;
}
