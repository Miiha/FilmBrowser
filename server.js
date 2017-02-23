import express from 'express';
import app from './api/express';
import path from "path";
import proxy from 'express-http-proxy';

const port = process.env.PORT || "8080";
const debug = process.env.NODE_ENV !== "production";

const publicPath = path.resolve(__dirname + '/../public');

if (!debug) {
  app.use(express.static(publicPath));

  const frontendRouter = express.Router();
  frontendRouter.get('*', (req, res) => {
    const indexPath = path.join(publicPath, 'index.html');
    res.sendFile(indexPath);
  });

  app.use('/assets', proxy('store:9000'));
  app.use('*', frontendRouter);
}


// listen on port config.port
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});

export default app;
