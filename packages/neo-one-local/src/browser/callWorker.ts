export interface CallWorkerOptions<TOptions> {
  readonly name: string;
  readonly createWorker: () => Worker;
  readonly options: TOptions;
}

// tslint:disable-next-line readonly-keyword
const mutableWorkerCache: { [key: string]: Worker } = {};

const getWorker = (name: string, createWorker: () => Worker) => {
  const worker = mutableWorkerCache[name] as Worker | undefined;
  if (worker === undefined) {
    mutableWorkerCache[name] = createWorker();
  }

  return mutableWorkerCache[name];
};

// tslint:disable-next-line no-let
let currentID = 0;

const getID = () => {
  const id = currentID;
  currentID += 1;

  return id;
};

export const callWorker = async <TOptions, TResult>({
  name,
  createWorker,
  options,
}: CallWorkerOptions<TOptions>): Promise<TResult> => {
  const worker = getWorker(name, createWorker);
  const id = getID();

  const result = new Promise<TResult>((resolve, reject) => {
    const cleanup = () => {
      worker.removeEventListener('message', onMessage);
    };

    const onMessage = (event: MessageEvent) => {
      const { id: messageID, type, data } = event.data;
      if (id === messageID) {
        if (type === 'failure') {
          cleanup();
          reject(new Error(data));
        } else {
          cleanup();
          resolve(data);
        }
      }
    };

    worker.addEventListener('message', onMessage);
  });

  worker.postMessage({
    id,
    data: options,
  });

  return result;
};
