export interface IWebService {
  webServicePort: number;
  webServiceHost: string;
}

export const webService: IWebService = {
  webServicePort: parseInt(process.env.WEB_SERVICE_PORT, 10) || 3000,
  webServiceHost: process.env.WEB_SERVICE_HOST || '0.0.0.0',
};
