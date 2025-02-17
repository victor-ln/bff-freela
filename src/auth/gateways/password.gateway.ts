export interface PasswordGateway {
  compare(plainPassword: string, encryptedPassword: string): boolean;
  encrypt(plainPassword: string): string;
}