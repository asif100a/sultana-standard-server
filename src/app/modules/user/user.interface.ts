
  export interface UserType {

  }

  export interface UserResponseType {
    success: boolean;
    data?: UserType | UserType[];
    message: string
  }
  