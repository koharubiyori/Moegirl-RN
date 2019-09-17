export default function(content, vueObj, config){
  // 链接预处理
  var isLogin = vueObj.$root.$data.state.isLogin
  content.find('a').each(function (e) {
    // 编辑按钮替换图片 && 登录后显示
    if ($(this).text() === '编辑') {
      $(this).addClass('page-editBtn')
    }

    if (this.classList.contains('page-editBtn')) {
      var img = $('<div class="edit-btn page-editBtn" alt="编辑">')
      $(this).html(img)
    }

    if (this.classList.contains('page-editBtn') && !isLogin) {
      $(this).hide()
    }
  })


  // 链接协调路由系统
  content.find('a').click(function (e) {
    // 外部链接
    if (this.target === '_blank') {
      if (!confirm('您即将跳转到非萌百页面，是否前往？')) {
        e.preventDefault()
      }
      return
    }
    e.preventDefault()

    // 未创建链接
    if (this.classList.contains('new')) {
      if (confirm('该页面未创建，是否要跳转到电脑版页面进行创建编辑？')) {
        var params = this.href.split(location.host + '/').pop()
        window.open(`https://zh.moegirl.org/${params}`, '_blank')
      }
      return
    }

    // 编辑按钮
    if (this.classList.contains('page-editBtn')) {
      var page = decodeURIComponent(this.href.match(/title=(.+?)(&|$)/)[1])
      var section = this.dataset.section
      if(!section){
        section = parseInt(this.href.match(/&section=(.+?)(&|$)/)[1])
      }

      vueObj.$router.push({
        name: 'edit',
        query: { 
          page,
          section,
          title: this.title 
        }
      })
      return
    }

    // 禁止特殊页面
    if (/.*[Ss]pecial:.+/.test(this.href)) {  
      return
    }

    // 配合黑幕的第一次点击不跳转
    if ($(this).parent('.heimu').data('unopened')) {
      return
    }

    // 排除上面，所有非图片链接进行路由导向
    if (!this.classList.contains('image')) {
      if($(this).attr('href')[0] != '#'){
        var pageTitle = this.href.split(location.host + '/').pop() || this.title
        // 快速预览视图
        if('isQuickViewOn' in config && config.isQuickViewOn){
          vueObj.quickViewTitle = this.textContent || $(this).find('img').eq(0).attr('alt')
          vueObj.quickViewLink = pageTitle
          vueObj.isVisibleQuickView = true
        }else{
          vueObj.$toArticle(pageTitle)
        }
      }else{
        var hash = $(this).attr('href')
        if(/^#cite_note-/.test(hash)){
          var refText = $(hash).find('.reference-text').html()
          vueObj.citeNoteText = refText
          vueObj.isVisibleCiteNote = true
        }else{
          $($(this).attr('href').replace(/\./g, '\\.'))[0].scrollIntoView(true, {
            behavior: 'smooth'
          })
        }
      }
    }
  })
}