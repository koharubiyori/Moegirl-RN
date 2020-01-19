import request from './request'

export default function(config){
  if(!config.params) config.params = {}
  config.params.format = 'json'

  const timeout = new Promise(resolve => setTimeout(() => resolve('timeout'), 12000))

  return new Promise((resolve, reject) =>{
    Promise.race([request(config), timeout])
    .then(data =>{
      if(data === 'timeout'){
        console.log('timeout', config)
        return reject()
      }
      
      data.error ? reject(data.error) : resolve(data)
    })
    .catch(e =>{
      console.log(e)
      reject()
    })
  })
}