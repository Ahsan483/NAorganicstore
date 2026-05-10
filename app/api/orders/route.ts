import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerInfo, items, total } = body;

    // Validate request
    if (!customerInfo || !items || !total) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate phone number
    if (!customerInfo.phone || customerInfo.phone.trim().length < 10) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    // TODO: Integrate with your backend
    // - Save order to database
    // - Send email notification
    // - Send SMS/WhatsApp message
    // - Process payment if applicable

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    console.log('New Order:', {
      orderId,
      customerInfo,
      items,
      total,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        orderId,
        message: 'Order received successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Order API error:', error);
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Order API endpoint' },
    { status: 200 }
  );
}
