export default function(content){
  content.find('.sm2-loading-stub + div[data-bind]').each(function(){
    var data = JSON.parse(this.dataset.bind)
    var playlist = data.component.params.playlist
    var url = playlist[0].audioFileUrl
    var audio = $(`<audio src="${url}" controls style="width:100%; min-width:220px;">`)
    $(this).append(audio)
  })
}