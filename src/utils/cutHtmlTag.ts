export default function cutHtmlTag(content: string) {
  return content.replace(/<.+?>/g, '')
}