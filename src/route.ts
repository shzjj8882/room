import { Express } from 'express';
import { v4 as uuid } from 'uuid'
import { logger } from './utils';

export default (app: Express) => {
  app.get('/', (_req, res) => {
    const message = 'server is up ^_^';
    logger.serverDebug('User visited the page')
    res.send(message);
  })

  app.get('/room/generate',(_req,res)=>{
    res.send({
      code: uuid().replace(/-/g,''),
    })
  })
}
