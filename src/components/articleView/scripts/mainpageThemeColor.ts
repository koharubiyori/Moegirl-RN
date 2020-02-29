// 首页使用主题色

export default function() {
  if (
    window._articleTitle !== 'Mainpage' || 
    window._appConfig.source !== 'moegirl' ||
    window._appConfig.theme === 'night'
  ) { return }

  $('head').append(`<style>
    .mainpage-title {
      background: ${window._themeColors.primary} !important;
    }
  </style>`)
}