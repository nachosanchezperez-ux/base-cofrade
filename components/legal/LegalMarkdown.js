import React from 'react'

const INLINE_TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)]+\))/g

function inline(text) {
  return String(text).split(INLINE_TOKEN).filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={`${part}-${index}`}>{part.slice(1, -1)}</code>
    }
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/)
    if (link) {
      return <a href={link[2]} key={`${part}-${index}`} rel="noreferrer">{link[1]}</a>
    }
    return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
  })
}

function collect(lines, start, matcher) {
  const items = []
  let index = start
  while (index < lines.length) {
    const match = lines[index].match(matcher)
    if (!match) break
    items.push(match[1])
    index += 1
  }
  return { items, next: index }
}

export default function LegalMarkdown({ children }) {
  const lines = String(children || '').replace(/\r\n/g, '\n').split('\n')
  const blocks = []

  for (let index = 0; index < lines.length;) {
    const line = lines[index].trim()
    if (!line) {
      index += 1
      continue
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/)
    if (heading) {
      const level = Math.min(heading[1].length + 1, 4)
      blocks.push(React.createElement(`h${level}`, { key: `heading-${index}` }, inline(heading[2])))
      index += 1
      continue
    }

    if (/^-\s+/.test(line)) {
      const { items, next } = collect(lines.map((item) => item.trim()), index, /^-\s+(.+)$/)
      blocks.push(<ul key={`list-${index}`}>{items.map((item, itemIndex) => <li key={`${item}-${itemIndex}`}>{inline(item)}</li>)}</ul>)
      index = next
      continue
    }

    if (/^\d+\.\s+/.test(line)) {
      const { items, next } = collect(lines.map((item) => item.trim()), index, /^\d+\.\s+(.+)$/)
      blocks.push(<ol key={`list-${index}`}>{items.map((item, itemIndex) => <li key={`${item}-${itemIndex}`}>{inline(item)}</li>)}</ol>)
      index = next
      continue
    }

    const paragraph = [line]
    let next = index + 1
    while (next < lines.length) {
      const candidate = lines[next].trim()
      if (!candidate || /^(#{1,3})\s+/.test(candidate) || /^-\s+/.test(candidate) || /^\d+\.\s+/.test(candidate)) break
      paragraph.push(candidate)
      next += 1
    }
    blocks.push(<p key={`paragraph-${index}`}>{inline(paragraph.join(' '))}</p>)
    index = next
  }

  return blocks
}
