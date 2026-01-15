export interface User {
  id: number;
  username: string;
  role: "ADMIN" | "MEMBER";
}

/**
 * Payload for creating a user.
 * Password is required on creation.
 */
export interface CreateUserInput {
  username: User["username"];
  role: User["role"];
  password: string;
}

/**
 * Payload for updating a user.
 * Password is optional on update.
 */
export interface UpdateUserInput {
  id: User["id"];
  username?: User["username"];
  role?: User["role"];
  password?: string;
}
