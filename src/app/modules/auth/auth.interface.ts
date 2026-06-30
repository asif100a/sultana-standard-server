
  export interface AuthType {

  }

  export interface AuthResponseType {
    success: boolean;
    data?: AuthType | AuthType[];
    message: string
  }
  