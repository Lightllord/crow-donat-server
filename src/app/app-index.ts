import 'reflect-metadata';
import { Controller, Get, Req, Res } from 'routing-controllers';
import path from 'path';
import { Response } from 'express';

@Controller('/app')
export class AppController {
  @Get('/register-wallet')
  async registerWallet(@Req() request: any, @Res() response: Response) {
    const filePath = path.join(__dirname, '/templates/register.html');
    try {
      await new Promise((resolve, reject) => {
        response.sendFile(filePath, (err: any) => {
          if (err) {
            reject(err);
          }
          resolve(filePath);
        });
      });
    } catch (error) {
      throw new Error(error);
    }
    return response;
  }
}
