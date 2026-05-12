import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/email';

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

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    try {
      // Send confirmation email to customer
      await sendOrderConfirmationEmail({
        customerEmail: customerInfo.email,
        customerName: customerInfo.name || 'Customer',
        customerPhone: customerInfo.phone,
        customerLocation: customerInfo.location || 'Not specified',
        items,
        total,
        orderId,
      });
    } catch (emailError) {
      console.error('Customer email error:', emailError);
    }

    try {
      // Send admin notification
      await sendAdminOrderNotification({
        customerName: customerInfo.name || 'Unknown',
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        customerLocation: customerInfo.location || 'Not specified',
        items,
        total,
        orderId,
      });
    } catch (adminError) {
      console.error('Admin email error:', adminError);
    }

    return NextResponse.json(
      {
        success: true,
        orderId,
        message: '✅ Order placed successfully! Confirmation email sent. Our team will contact you shortly via WhatsApp.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Order API error:', error);
    return NextResponse.json(
      { error: 'Failed to process order. Please try again.' },
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
