import https from 'https';

export class Requster {
  private options: any;

  constructor(defaultOptions: any) {
    this.options = defaultOptions;
  }

  post() {

  }

  postData() {

  }

  postForm(path: string, requestBody?: any): Promise<any> {
    let currentHeaders = this.options.headers ? {...this.options.headers} : {};
    let requestString: string;
    if (requestBody) {
      requestString = '';
      for (let field in requestBody) {
        const newParam = `${encodeURI(field)}=${encodeURI(requestBody[field])}`;
        requestString += requestString ? `&${newParam}` : newParam;
      }
      currentHeaders['Content-Length'] = Buffer.byteLength(requestString);
    }
    currentHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
    let currentOptions = {
      ...this.options,
      path: (this.options.path || '')  + path,
      method: 'POST',
      headers: currentHeaders
    }
    return this.postCore(currentOptions, requestString);
  }

  postCore(options: any, requestString?: string): Promise<{ body?: any, response?: any }> {
    console.log(options, requestString);
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        // This may need to be modified based on your server's response
        res.setEncoding('utf8')
        let responseBody = '';
        // Build JSON string from response chunks
        res.on('data', (chunk) => {console.log(chunk); responseBody += chunk});
        res.on('end', () => {
          if (responseBody) {
            try {
              const parsedBody = JSON.parse(responseBody);
              (res.statusCode > 199 && res.statusCode < 300) ? resolve({
                body: parsedBody,
                response: res
              }) : reject({
                body: parsedBody,
                response: res
              });
            } catch (err) {
              reject({
                body: err,
                response: res
              })
            }
          }
          // Resolve or reject based on status code
          (res.statusCode > 199 && res.statusCode < 300) ? resolve({
            response: res
          }) : reject({
            response: res
          });
        });
      });
      console.log(req);
      if (requestString) {
        req.write(requestString);
      }
      req.end();
      req.on('error',  (e) => {
        reject({
          body: e
        });
      });
    })
  }
}
