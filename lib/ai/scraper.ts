/**
 * Scrape web content using Jina Reader API
 * @param url - URL to scrape
 * @returns Markdown content
 */
export async function scrapeWithJina(url: string): Promise<string> {
  const apiKey = process.env.JINA_API_KEY

  if (!apiKey) {
    throw new Error('JINA_API_KEY is not set')
  }

  try {
    // Jina Reader API endpoint
    const response = await fetch('https://r.jina.ai/' + encodeURIComponent(url), {
      method: 'GET',
      headers: {
        'X-Return-Format': 'markdown',
        'Authorization': `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Jina Reader API error: ${response.status} - ${errorText}`)
    }

    const markdown = await response.text()
    return markdown
  } catch (error) {
    console.error('Jina Reader scraping error:', error)
    throw error
  }
}

/**
 * Check if URL is a government website (HDB, URA, etc.)
 */
export function isGovernmentWebsite(url: string): boolean {
  const govDomains = [
    'hdb.gov.sg',
    'ura.gov.sg',
    'iras.gov.sg',
    'mas.gov.sg',
    'mnd.gov.sg',
  ]

  try {
    const urlObj = new URL(url)
    return govDomains.some(domain => urlObj.hostname.includes(domain))
  } catch {
    return false
  }
}

/**
 * Extract relevant content from scraped markdown
 */
export function extractRelevantContent(markdown: string, maxLength: number = 4000): string {
  // Remove excessive whitespace and normalize
  let content = markdown.replace(/\n{3,}/g, '\n\n').trim()

  // If content is too long, truncate intelligently
  if (content.length > maxLength) {
    // Try to cut at a paragraph boundary
    const truncated = content.substring(0, maxLength)
    const lastParagraph = truncated.lastIndexOf('\n\n')
    if (lastParagraph > maxLength * 0.7) {
      content = truncated.substring(0, lastParagraph) + '\n\n[...]'
    } else {
      content = truncated + '...'
    }
  }

  return content
}

