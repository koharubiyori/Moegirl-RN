import createControls from '../utils/createControl'

// 这个控件的实现代码来自萌百，懒得加类型了，直接用.js
export default createControls('切换显示', () => {
  const cssSanitizer = (cssStr) => (typeof cssStr === 'string' ? cssStr : '').replace(RegExp(decodeURIComponent('%3C!--'), 'g'), '').replace(RegExp(decodeURIComponent('-%3E'), 'g'), '').replace(/\/\/[^./]\.[^/]\//g, '').replace(/pointer-event/g, ';')
  const uuidv4 = () => {
      let result = ''
      while (result === '' || $(`#${result}, [name="${result}"]`).length > 0) {
          result = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
              (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16),
          )
      }
      return result
  }
  const datasetParser = (ele) => {
      const result = {
          config: {},
          data: {},
      }
      Object.keys(ele.dataset).filter((n) => n.startsWith('key-')).forEach((__key) => {
          const _key = ele.dataset[__key]
          const value = ele.dataset[`value-${__key.substring(4)}`]
          if (_key.length > 0 && value.length > 0) {
              const isConfig = _key.startsWith('@')
              const key = isConfig ? _key.substring(1) : _key
              const base = result[isConfig ? 'config' : 'data']
              base[key] = value
              if (/@o(?:n|ff)$/.test(_key)) {
                  const id = _key.replace(/@o(?:n|ff)$/, '')
                  if (!(id in base)) {
                      base[id] = value
                  }
              } else if (_key.endsWith('@input')) {
                  base[_key] = value
                  const id = _key.replace(/@input$/, '')
                  if (!(id in base)) {
                      base[id] = ''
                  }
              } else {
                  if (!(`${key}@on` in base)) {
                      base[`${key}@on`] = value
                  }
                  if (!(`${key}@off` in base)) {
                      base[`${key}@off`] = value
                  }
                  if (!(`${key}@input` in base)) {
                      base[`${key}@input`] = ''
                  }
              }
          }
      })
      return result
  }
  const getKeys = (obj) => Object.keys(obj).filter((k) => !/@(?:on|off|input)$/.test(k))
  const triggerHandler = ($ele) => {
      $ele.each((_, ele) => {
          $(ele).triggerHandler('change', [true])
      })
  }
  const textToggleDisplayStyle = {}
  $('.textToggleDisplayStyle').each((_, ele) => {
      const dataset = datasetParser(ele).data
      getKeys(dataset).forEach((id) => {
          textToggleDisplayStyle[id] = dataset[id]
      })
  })
  $('.textToggleDisplay').each((_, ele) => {
      if (ele.dataset.id in textToggleDisplayStyle) {
          $(ele).attr('style', cssSanitizer(textToggleDisplayStyle[ele.dataset.id]))
      }
  }).addClass('hidden')
  $('.textToggleDisplayButtons').each((_, ele) => {
      const self = $(ele)
      const parsedDataset = datasetParser(ele)
      const ifRadio = 'radio' in parsedDataset.config && parsedDataset.config.radio.length > 0
      const ifReverse = 'reverse' in parsedDataset.config && parsedDataset.config.reverse.length > 0
      const name = uuidv4()
      let hasDefault = false
      self.empty()
      getKeys(parsedDataset.data).forEach((id) => {
          const input = $('<input/>')
          const inputId = uuidv4()
          input.attr({
              'data-id': id,
              id: inputId,
              type: ifRadio ? 'radio' : 'checkbox',
          }).addClass(ifReverse ? 'textToggleDisplayButtonInputReverse' : 'textToggleDisplayButtonInput')
          if (ifRadio) {
              input.attr('name', name)
          }
          const label = $('<label/>')
          const span = $('<span/>')
          span.text(parsedDataset.data[`${id}@off`]).attr({
              'data-off': parsedDataset.data[`${id}@off`],
              'data-on': parsedDataset.data[`${id}@on`],
          })
          label.attr({
              'data-id': id,
              for: inputId,
          }).addClass('textToggleDisplayButtonLabel')
          self.append(label.append(input).append(span))
          if (id === parsedDataset.config.default) {
              input.prop('checked', true)
              span.text(parsedDataset.data[`${id}@on`])
              hasDefault = true
          }
      })
      if (ifRadio) {
          const input = $('<input/>')
          const inputId = uuidv4()
          input.attr({
              'data-id': '',
              'data-radio-cancel': 'true',
              id: inputId,
              name,
              type: 'radio',
          }).addClass(ifReverse ? 'textToggleDisplayButtonInputReverse' : 'textToggleDisplayButtonInput').css({
              'margin-left': '0',
              'margin-right': '0',
              width: '0',
          })
          const label = $('<label/>')
          const span = $('<span/>')
          span.text('取消选择')
          label.attr({
              'data-id': '',
              for: inputId,
          }).addClass('textToggleDisplayButtonLabel cancelButton')
          self.append(label.append(input).append(span))
          if (!hasDefault) {
              input.prop('checked', true)
          }
      }
  })
  $('.textToggleDisplayButtonsStyle').each((_, ele) => {
      const parsedDataset = datasetParser(ele)
      $('.textToggleDisplayButtonLabel.cancelButton').attr({
          'data-style-off': parsedDataset.config['cancel@off'] || '',
          'data-style-on': parsedDataset.config['cancel@on'] || '',
      })
      $('.textToggleDisplayButtonLabel.cancelButton > input').attr('style', cssSanitizer(parsedDataset.config['cancel@input']))
      getKeys(parsedDataset.data).forEach((id) => {
          $(`.textToggleDisplayButtonLabel[data-id="${id}"]`).attr({
              'data-style-off': parsedDataset.data[`${id}@off`] || '',
              'data-style-on': parsedDataset.data[`${id}@on`] || '',
          }).children('input').attr('style', cssSanitizer(parsedDataset.data[`${id}@input`]))
      })
  })
  triggerHandler($('.textToggleDisplayButtonInput').on('change', ({
      target,
  }, fromTriggerHandler = false) => {
      const {
          dataset: {
              id,
          },
          checked,
      } = target
      $(`.textToggleDisplay[data-id="${id}"]`)[checked ? 'removeClass' : 'addClass']('hidden')
      const self = $(target)
      const label = self.closest('.textToggleDisplayButtonLabel')
      const span = label.find('span')
      label[checked ? 'addClass' : 'removeClass']('on').attr('style', cssSanitizer(label.attr(checked ? 'data-style-on' : 'data-style-off')))
      span.text(span.attr(checked ? 'data-on' : 'data-off'))
      if (checked) {
          span.attr('style', cssSanitizer(textToggleDisplayStyle[id]))
      } else {
          span.removeAttr('style')
      }
      if (!fromTriggerHandler) {
          triggerHandler(self.closest('.textToggleDisplayButtons').find('input').not(target))
      }
  }))
  triggerHandler($('.textToggleDisplayButtonInputReverse').on('change', ({
      target,
  }, fromTriggerHandler = false) => {
      const {
          dataset: {
              id,
              radioCancel,
          },
          checked,
      } = target
      const isRadioCancel = (radioCancel || '').length > 0
      const self = $(target)
      const label = self.closest('.textToggleDisplayButtonLabel')
      if (isRadioCancel) {
          label[checked ? 'addClass' : 'removeClass']('on').attr('style', cssSanitizer(label.attr(checked ? 'data-style-on' : 'data-style-off')))
      } else {
          $(`.textToggleDisplay[data-id="${id}"]`)[checked ? 'addClass' : 'removeClass']('hidden')
          const span = label.find('span')
          label[checked ? 'removeClass' : 'addClass']('on').attr('style', cssSanitizer(label.attr(checked ? 'data-style-off' : 'data-style-on')))
          span.text(span.attr(checked ? 'data-off' : 'data-on'))
          if (checked) {
              span.removeAttr('style')
          } else {
              span.attr('style', cssSanitizer(textToggleDisplayStyle[id]))
          }
      }
      if (!fromTriggerHandler) {
          triggerHandler(self.closest('.textToggleDisplayButtons').find('input').not(target))
      }
  }))
}, {
  
})