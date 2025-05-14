export class JwtDecoder {

  decodeToken(token: string): any {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      return JSON.parse(payloadJson);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
