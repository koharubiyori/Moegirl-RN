// 添加分类在条目底部
export default function() {
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
      padding: 5px 10px;
      margin: 2px 2.5px;
      background-color: ${window._colors.primary};
      border-radius: 20px;
      color: white;
    }
  </style>`)
}