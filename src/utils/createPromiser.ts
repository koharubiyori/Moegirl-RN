// 创建一个暴露resolve和reject方法的promise
export default function createPromiser<PromiseValueType = any>() {
  let promiseResolve: (value?: PromiseValueType) => void = null as any
  let promiseReject: (reason?: any) => void = null as any
  const promise = new Promise<PromiseValueType>((resolve, reject) => {
    promiseResolve = resolve
    promiseReject = reject
  })

  return {
    promise,
    resolve: promiseResolve,
    reject: promiseReject
  }
}