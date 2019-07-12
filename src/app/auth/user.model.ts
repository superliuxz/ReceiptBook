export class UserModel {
  constructor(
    public email: string,
    public localId: string,
    private idToken: string,
    private tokenExpirationDate: Date
  ) {}

  get token(): string {
    if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
      return null;
    }
    return this.idToken;
  }
}
