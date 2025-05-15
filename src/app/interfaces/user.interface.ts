import { UserRole } from '../interfaces/enums.interface';


export interface CreateUserDto {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  document?: string;
  userRole: UserRole;
}

export interface UpdateUserDto {
  uuid: string;
  fullName?: string;
  email?: string;
  phone?: string;
  document?: string;
  userRole?: UserRole;
  isActive?: boolean;
}

export interface UserDto {
  uuid: string;
  fullName: string;
  email: string;
  phone?: string;
  document?: string;
  userRole: UserRole;
  isActive: boolean;
}

export interface ChangePasswordDto {
  uuid: string;
  oldPassword: string;
  newPassword: string;
  ConfirmNewPassword: string;

}
