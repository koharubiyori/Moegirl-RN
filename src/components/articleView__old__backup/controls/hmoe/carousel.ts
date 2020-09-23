import createControls from '../../utils/createControl'

export default createControls('首页轮播图', () => {
  let viewBox = $('#articleContentContainer')

  const imgContainer = viewBox.find('.mainpage-banner-container')
  const count = imgContainer.find(' > a').length

  const controlContainer = viewBox.find('.mainpage-banner-control')
  controlContainer.append(`
    ${('<div class="mainpage-banner-control-triggle"></div>').repeat(count)}
  `)

  const selectItem = (index: number) => {
    controlContainer.find('.mainpage-banner-control-triggle')
      .removeClass('on')
      .eq(index)
      .addClass('on')
    imgContainer.css('right', index * 345)
  }

  selectItem(0)

  let currentIndex = 0
  let pauseTimeoutKey = 0
  controlContainer.find('.mainpage-banner-control-triggle').each((index, item) => {
    $(item).on('click', () => {
      selectItem(index)
      pauseTimeoutKey = setTimeout(() => {
        clearTimeout(pauseTimeoutKey)
        pauseTimeoutKey = 0
      }, 3000)
    })
  })
  
  setInterval(() => {
    if (pauseTimeoutKey !== 0) { return }

    selectItem(currentIndex)
    imgContainer.css('right', currentIndex * 345)
    controlContainer.find('.mainpage-banner-control-triggle')
      .removeClass('on')
      .eq(currentIndex)
      .addClass('on')

    currentIndex++
    if (currentIndex === count) currentIndex = 0
  }, 5000)
}, {
  '.mainpage-banner': {
    width: 350,
    margin: '0 auto !important',
    padding: '5px !important',
    position: 'relative',
    
    '& > p': {
      display: 'none'
    },
    
    '& .mainpage-banner-control': {
      position: 'absolute',
      top: 15,
      right: 20,
      
      '& .mainpage-banner-control-triggle': {
        width: 24,
        height: 24,
        borderRadius: 18,
        backgroundColor: 'white',
        display: 'inline-block',
        border: '3px rgba(139, 139, 34, .5) solid',
        marginLeft: 8,

        '&.on': {
          borderColor: 'white',
          backgroundColor: '#BABF33'
        }
      }
    },

    '& .mainpage-banner-container': {
      width: 'max-content',
      position: 'relative',
      
      '& .mainpage-banner-page': {
        width: 340,
        display: 'inline-block',
        marginRight: 5,

        '& .mainpage-page-img': {
          width: 340,
          height: 240,
          objectFit: 'cover'
        }
      }
    }
  }
})