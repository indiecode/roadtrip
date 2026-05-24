import type { Day, Stage } from '../../src/types.js'

export function parseDayTable(block: string): Day[] {
  const lines = block.split('\n')
  const tableLines = lines.filter(
    l => l.startsWith('|') && !l.match(/^\|[-\s|]+$/)
  )
  return tableLines
    .slice(1)
    .map(line => {
      const cells = line.split('|').slice(1, -1).map(c => c.trim())
      if (cells.length < 4) return null
      const [day, route, charge, sleep] = cells
      const cleanDay = day.replace(/\*\*/g, '').trim()
      if (!cleanDay || cleanDay === 'Day') return null
      const cleanSleep = sleep.replace(/\*\*/g, '').trim()
      return {
        day: cleanDay,
        route: route.replace(/\*\*/g, '').trim(),
        charge: charge.replace(/\*\*/g, '').trim(),
        sleep: cleanSleep,
        sleep_type: sleep.includes('🏕') ? 'camp' : 'hotel',
      } satisfies Day
    })
    .filter((d): d is Day => d !== null)
}

export function parseStageBlock(block: string): Stage {
  const headerMatch = block.match(/^## Stage (\d+) — (.+)/m)
  if (!headerMatch) throw new Error(`No stage header found in block: ${block.slice(0, 50)}`)
  const id = parseInt(headerMatch[1], 10)
  const name = headerMatch[2].trim()

  const summaryMatch = block.match(/^\*Days?\s+([^·\u00b7*]+?)\s*[·\u00b7](?:\s*~([\d,]+)\s*mi)?/m)
  if (!summaryMatch) {
    console.warn(`[parse-trip] Could not parse summary line for Stage ${id} — days/miles will be empty`)
  }
  const days = summaryMatch ? `Days ${summaryMatch[1].trim()}` : ''
  const miles = summaryMatch && summaryMatch[2] ? `~${summaryMatch[2]} mi` : ''

  const notesMatch = block.match(/\*\*Notes:\*\*\s*(.+?)(?=\n\n|\n>|\n##|$)/s)
  const notes = notesMatch
    ? notesMatch[1].replace(/\n/g, ' ').trim()
    : ''

  return { id, name, days, miles, notes, days_list: parseDayTable(block) }
}

export function parseStages(md: string): Stage[] {
  const parts = md.split(/(?=^## Stage \d+)/m)
  return parts
    .filter(p => /^## Stage \d+/.test(p))
    .map(parseStageBlock)
}
