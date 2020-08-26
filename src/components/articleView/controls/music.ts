import createControls from '../utils/createControl'

export default createControls('音频播放器', () => {
  let viewBox = $('#articleContentContainer')

  viewBox.find('.sm2-loading-stub + div[data-bind]').each(function() {
    let data = JSON.parse(this.dataset.bind!)
    let playlist = data.component.params.playlist
    let url = playlist[0].audioFileUrl
    let audio = $(`<audio src="${url}" controls style="width:100%; min-width:220px;">`)
    $(this).append(audio)
  })
}, {

})