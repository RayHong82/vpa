import { NextRequest, NextResponse } from 'next/server'
import { scrapeWithJina, isGovernmentWebsite } from '@/lib/ai/scraper'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Scrape the URL
    const markdown = await scrapeWithJina(url)

    return NextResponse.json({
      url,
      markdown,
      isGovernmentWebsite: isGovernmentWebsite(url),
    })
  } catch (error: any) {
    console.error('Scrape error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to scrape URL' },
      { status: 500 }
    )
  }
}

