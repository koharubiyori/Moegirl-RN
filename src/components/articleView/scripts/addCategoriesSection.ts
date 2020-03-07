// 添加分类在条目底部

export default function() {
  if (!window._categories || window._categories.length === 0) { return }
  let viewBox = $('#articleContentContainer')

  let title = $('<h2>分类</h2>')
  let categories = $('<p>').html(
    window._categories.map(categoryName => `
      <a href="/分类:${categoryName}">
        <div class="categoryBox">${categoryName}</div>
      </a>
    `).join('')
  )
  
  viewBox.find('.mw-parser-output').append(title, categories)

  $('head').append(`<style>
    .categoryBox {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      padding: 0 10px;
      margin: 2px 2.5px;
      background-color: ${window._appConfig.theme === 'night' ? window._colors.night.primary : window._themeColors.primary};
      border-radius: 20px;
      color: ${window._appConfig.theme === 'night' ? window._colors.night.text : 'white'};
    }
  </style>`)
}