import jss from 'jss'
import preset from 'jss-preset-default'

jss.setup(preset() as any)

export default function createControls(controlsName: string, scriptFn: () => any, styleSheet: Parameters<typeof jss.createStyleSheet>[0]) {
  return {
    script: `\n\n/* ${controlsName} */\n(${scriptFn.toString()})();\n`,
    styleSheet: `/* ${controlsName} */\n` + jss.createStyleSheet({
      '@global': styleSheet as any
    }).toString() + '\n'
  }
}