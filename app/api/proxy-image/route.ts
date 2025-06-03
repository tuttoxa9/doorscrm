import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const imageUrl = searchParams.get('url')

    if (!imageUrl) {
      return new NextResponse('Missing image URL', { status: 400 })
    }

    // Проверяем, что URL относится к Firebase Storage
    if (!imageUrl.includes('firebasestorage.googleapis.com')) {
      return new NextResponse('Invalid image URL', { status: 400 })
    }

    // Получаем изображение с Firebase Storage
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      return new NextResponse('Failed to fetch image', { status: response.status })
    }

    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    // Возвращаем изображение с правильными CORS заголовками
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Кешируем на 24 часа
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Error proxying image:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
