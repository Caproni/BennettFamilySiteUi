export interface ApiResponse {
  success: boolean;
  message: string;
  content: any[] | any;
  exceptions: any[];
}
