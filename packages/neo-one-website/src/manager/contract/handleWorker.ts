export const handleWorker = <TOptions, TResult>(
  worker: DedicatedWorkerGlobalScope,
  handleCall: (options: TOptions) => Promise<TResult>,
) => {
  // tslint:disable-next-line no-object-mutation
  worker.onmessage = (event) => {
    const { id, data } = event.data;
    handleCall(data)
      .then((result) => {
        worker.postMessage({ id, type: 'success', data: result });
      })
      .catch((error) => {
        worker.postMessage({ id, type: 'failure', data: error.stack === undefined ? error.message : error.stack });
      });
  };
};
