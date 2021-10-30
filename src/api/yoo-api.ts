import 'reflect-metadata';
import { Body, JsonController, Post, Res, UseBefore } from 'routing-controllers';
import { Response } from 'express';
import { Requster } from '../tools/requster';
import { YOO_TOKEN } from '../../configs/yoo.config';
import bodyParser from 'body-parser';

const defaultOptions = {
  hostname: 'yoomoney.ru',
  headers: {
    'Authorization': 'Bearer ' + YOO_TOKEN,
  }
}

const urlencodedParser = bodyParser.urlencoded({extended: false})
const yooMoneyHttp = new Requster(defaultOptions);

@JsonController('/yoo/api')
@UseBefore(urlencodedParser)
export class YooApiController {
  @Post('/do-payment')
  async registerWallet(@Body() info: any, @Res() response: Response) {
    try {
      const resp = await yooMoneyHttp.postForm('/api/process-payment', {
        request_id: info?.request_id
      })
      return response.send(resp);
    } catch (e) {
      return;
    }
  }

  @Post('/get-account-info')
  async getAccountInfo(@Res() response: Response) {
    try {
      const resp = await yooMoneyHttp.postForm('/api/account-info');
      return response.send(resp);
    } catch (e) {
      return;
    }
  }
}
