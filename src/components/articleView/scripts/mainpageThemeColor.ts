// 首页使用主题色

export default function() {
  if (
    window._articleTitle.text !== 'Mainpage' || 
    window._settings.source !== 'moegirl' ||
    window._settings.theme === 'night'
  ) { return }

  $('head').append(`<style>
    .mainpage-title {
      background: ${window._colors.primary} !important;
    }
  </style>`)
}