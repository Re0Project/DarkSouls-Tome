/**
 * 格式化游戏文本，处理特殊标记
 */
export function formatGameText(text: string): string {
  return text
    .replace(/#1/g, '<span class="text-gold line-through">')
    .replace(/#2/g, '<span class="text-gold">')
    .replace(/#3/g, '</span>')
    .replace(/##/g, '<i class="text-red text-sm">未使用</i>')
    .replace(/#0/g, '<strong class="text-title">')
    .replace(/\n/g, '<br>');
}

/**
 * 移除格式化标记，获取纯文本
 */
export function stripFormatting(text: string): string {
  return text.replace(/(#1|#2|#3|##|#0|\n)/g, '');
}

/**
 * 高亮搜索关键词
 */
export function highlightText(text: string, keyword: string): string {
  if (!keyword) return text;
  const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * 转义正则表达式特殊字符
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
