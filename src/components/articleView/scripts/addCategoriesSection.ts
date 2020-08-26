// 添加分类在条目底部

export default function() {
  if (!window._categories || window._categories.length === 0) { return }
  let viewBox = $('#articleContentContainer')
  const i = window._i.scripts.addCategoriesSection

  let title = $(`<h2>${i.category}</h2>`)
  let categories = $('<p>').html(
    window._categories.map(categoryName => `
      <a href="/${i.category}:${categoryName}">
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
      background-color: ${window._colors.primary};
      border-radius: 20px;
      color: ${window._settings.theme === 'night' ? window._colors.text : 'white'};
    }
  </style>`)
}