// 这个对象用于tab页之间互相和index页传参

import createPromiser from '~/utils/createPromiser'

const reset = () => ({
  title: '', // 条目标题
  section: undefined as number | undefined, // 编辑的章节
  isCreate: false as boolean | undefined, // 是否为创建新页面
  content: '', // wiki文本内容，每次变化都会更新，这将在提交编辑时获取
  contentReady: createPromiser<string>(), // wiki文本内容初次加载完成，预览视图需要监听这个
  isContentChanged: false, // wiki文本被编辑过，在用户未保存退出时需要提示  
  needUpdate: true, // wiki文本内容发生变化，需要更新视图，这会在刚进入预览视图时检查
})

const tabDataCommunicator = {
  data: reset(),
  reset() { this.data = reset() },
}

export default tabDataCommunicator