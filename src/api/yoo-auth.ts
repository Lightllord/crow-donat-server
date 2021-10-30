import 'reflect-metadata';
import { Body, Get, HttpError, JsonController, Post, QueryParam, Res, UseBefore } from 'routing-controllers';
import { Response } from 'express';
import { Requster } from '../tools/requster';
import { YOO_CLIENT_ID, YOO_CLIENT_SECRET } from '../../configs/yoo.config';
import bodyParser from 'body-parser';

const defaultOptions = {
  hostname: 'yoomoney.ru',
}

const urlencodedParser = bodyParser.urlencoded({extended: false})
const yooMoneyHttp = new Requster(defaultOptions);

@JsonController('/yoo/auth')
@UseBefore(urlencodedParser)
export class YooAuthController {
  // todo делать запрос при редиректе после авторизации
  @Post('/get-token')
  async getYooToken(@Body() info: any, @Res() response: Response) {
    try {
      const resp = await yooMoneyHttp.postForm('/oauth/token', {
        code: info?.code,
        client_id: YOO_CLIENT_ID,
        grant_type: 'authorization_code',
        redirect_uri: 'http://crow.test/yoo/auth/accept'
      });
      return response.send(resp);
    } catch (e) {
      return;
    }
  }

  @Get('/accept')
  async registerToken(@QueryParam('code') code: string) {
    if (!code) {
      return new HttpError(500, 'Code is not specified');
    }
    try {
      const resp = await yooMoneyHttp.postForm('/oauth/token', {
        code: code,
        client_id: YOO_CLIENT_ID,
        grant_type: 'authorization_code',
        redirect_uri: 'http://crow.test/yoo/auth/accept',
        client_secret: YOO_CLIENT_SECRET
      });
      console.log(resp);
      return 'sssss';
    } catch (e) {
      return;
    }
  }
}
