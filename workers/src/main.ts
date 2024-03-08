import dotenv from 'dotenv';
import CronjobRunner from 'infrastructure/lib/runner/cronjob';
import WorkerRunner from 'infrastructure/lib/runner/worker';

/**
 *
 * node dist/main.js -m=stale-transaction -t=worker
 *
 */
dotenv.config();
const start = async (args: string[]) => {
  console.debug('🚀 ~ file: main.ts:16 ~ start ~ start:');

  const module = args.filter((it: string) => it.startsWith('-m='));
  const type = args.filter((it: string) => it.startsWith('-t='));

  switch (type[0].split('=')[1]) {
    case 'worker': {
      const name = module[0].split('=')[1];
      WorkerRunner({ name, modulePath: 'modules', queueName: process.env.QUEUE_NAME });
      break;
    }
    case 'cronjob':
      CronjobRunner({
        name: module[0].split('=')[1],
        modulePath: 'cronjobs',
        ...Object.entries(process.env).reduce((acc, [key, value]) => {
          if (key.startsWith('CRONJOB_')) {
            const [_, name] = key.split('CRONJOB_');
            const nameParts = name.split('_');
            const nameInCamelCase = nameParts
              .map((it, index) => {
                if (index === 0) return it.toLowerCase();
                return it.charAt(0).toUpperCase() + it.slice(1).toLowerCase();
              })
              .join('');
            acc[nameInCamelCase] = value;
          }
          return acc;
        }, {}),
      });
      break;
  }
};

start(process.argv);
