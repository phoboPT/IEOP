import { app } from './app';

const start = async () => {
  app.listen(3000, () => {
    console.log('Listening port 3000!!!!!!!!');
  });
};

start();
