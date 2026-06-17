import type { Day, Stage } from '../../src/types.js'

export function parseDayTable(block: string): Day[] {
  const lines = block.split('\n')
  const tableLines = lines.filter(
    l => l.startsWith('|') && !l.match(/^\|[-\s|]+$/)
  )
  const parsed: Day[] = []
  for (const line of tableLines.slice(1)) {
    const cells = line.split('|').slice(1, -1).map(c => c.trim())
    if (cells.length < 4) continue
    const [day, route, charge, sleep] = cells
    const cleanDay = day.replace(/\*\*/g, '').trim()
    if (!cleanDay || cleanDay === 'Day') continue
    const cleanSleep = sleep.replace(/\*\*/g, '').trim()
    const fillsFast = sleep.includes('⏳')
    const finalSleep = fillsFast ? cleanSleep.replace('⏳', '').trim() : cleanSleep
    // Detect camp nights by either the 🏕 emoji or the word "Camping" in the sleep text
    // Use String.fromCodePoint to ensure the correct emoji character
    const campsiteEmoji = String.fromCodePoint(0x1f3d5)
    const isCamp = sleep.includes(campsiteEmoji) || sleep.includes("Camping") || sleep.includes("camping")
    const parsedDay: Day = {
      day: cleanDay,
      route: route.replace(/\*\*/g, '').trim(),
      charge: charge.replace(/\*\*/g, '').trim(),
      sleep: finalSleep,
      sleep_type: isCamp ? 'camp' : 'hotel',
      fills_fast: fillsFast,
      mapCenter: [0, 0],  // will be filled by computeDayGeometry
      mapZoom: 6,          // default zoom level
    }
    parsed.push(parsedDay)
  }
  return parsed
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
