// 添加分类在条目底部

export default function() {
  if (window._articleTitle.text === 'Mainpage' || window._settings.source === 'hmoe') { return }
  let viewBox = $('#articleContentContainer')
  const i = window._i.scripts.addCapyright
  
  const content = `
    <div style="color:#ABABAB; font-size:14px">
      <hr>
      <p>${i.content}</p>
    </div>
  `

  viewBox.find('.mw-parser-output').append(content)
}