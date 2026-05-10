import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const baseStyles = `
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
`;

const containerStyle = `
  max-width: 600px;
  margin: 0 auto;
  background: #f9f9f9;
`;

function getHeader() {
  return `
    <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 40px 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 32px; font-weight: bold;">NA Organic Store</h1>
      <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Premium Organic Hair Care</p>
    </div>
  `;
}

function getFooter() {
  return `
    <div style="background: #f5f5f5; padding: 30px 20px; text-align: center; border-top: 1px solid #ddd;">
      <p style="margin: 10px 0; font-size: 14px; color: #666;">
        <strong>Contact Us</strong><br>
        Phone: <a href="tel:+923028337026" style="color: #16a34a; text-decoration: none;">+92 302 833 7026</a><br>
        Email: <a href="mailto:hakeemaziz8320@gmail.com" style="color: #16a34a; text-decoration: none;">hakeemaziz8320@gmail.com</a><br>
        Address: Abaseen Market, Shop #17, Peshawar, Pakistan
      </p>
      <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">
        © 2024 NA Organic Store. All rights reserved. | This email was sent because you contacted us through our website.
      </p>
    </div>
  `;
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { ${baseStyles} }
          .container { ${containerStyle} }
        </style>
      </head>
      <body style="${baseStyles}">
        <div class="container" style="${containerStyle}">
          ${getHeader()}
          <div style="padding: 40px 20px; background: white;">
            <h2 style="color: #16a34a; margin-top: 0;">New Contact Message</h2>
            <div style="background: #f0fdf4; padding: 20px; border-left: 4px solid #16a34a; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${data.name}</p>
              <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #16a34a; text-decoration: none;">${data.email}</a></p>
              <p style="margin: 0;"><strong>Received:</strong> ${new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}</p>
            </div>
            <h3 style="color: #333; margin: 20px 0 10px 0;">Message:</h3>
            <div style="background: #fafafa; padding: 20px; border-radius: 8px; white-space: pre-wrap; word-break: break-word;">
              ${data.message.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}
            </div>
          </div>
          ${getFooter()}
        </div>
      </body>
      </html>
    `;

    const customerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { ${baseStyles} }
          .container { ${containerStyle} }
        </style>
      </head>
      <body style="${baseStyles}">
        <div class="container" style="${containerStyle}">
          ${getHeader()}
          <div style="padding: 40px 20px; background: white;">
            <h2 style="color: #16a34a; margin-top: 0;">Thank You for Reaching Out!</h2>
            <p>Hi <strong>${data.name}</strong>,</p>
            <p>We appreciate you taking the time to contact NA Organic Store. Your message has been received and we'll review it carefully.</p>

            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #16a34a;">Your Message:</h3>
              <div style="background: white; padding: 15px; border-left: 4px solid #16a34a; white-space: pre-wrap; word-break: break-word;">
                ${data.message.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}
              </div>
            </div>

            <p><strong>What happens next?</strong></p>
            <ul style="color: #666;">
              <li>Our team will review your message</li>
              <li>We'll get back to you as soon as possible (usually within 24 hours)</li>
              <li>You can expect a response via email or phone</li>
            </ul>

            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              If your matter is urgent, you can also reach us directly at <strong>+92 302 833 7026</strong>
            </p>
          </div>
          ${getFooter()}
        </div>
      </body>
      </html>
    `;

    // Send email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO_ADMIN,
      subject: `📧 New Contact Message from ${data.name}`,
      html: adminHtml,
    });

    // Send email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: data.email,
      subject: 'We Received Your Message - NA Organic Store',
      html: customerHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

export async function sendOrderConfirmationEmail(data: {
  customerEmail?: string;
  customerName: string;
  customerPhone: string;
  customerLocation: string;
  items: Array<{ name: string; price: number; quantity: number }>;
  total: number;
  orderId: string;
}) {
  try {
    const itemsHtml = data.items
      .map(
        (item, index) =>
          `<tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 15px; text-align: left;">${item.name}</td>
            <td style="padding: 15px; text-align: center; color: #666;">x${item.quantity}</td>
            <td style="padding: 15px; text-align: right; font-weight: 600; color: #16a34a;">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
          </tr>`
      )
      .join('');

    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { ${baseStyles} }
          .container { ${containerStyle} }
        </style>
      </head>
      <body style="${baseStyles}">
        <div class="container" style="${containerStyle}">
          ${getHeader()}
          <div style="padding: 40px 20px; background: white;">
            <h2 style="color: #16a34a; margin-top: 0;">🛒 New Order Received</h2>

            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0; font-weight: 600; color: #92400e;">New Order Alert</p>
              <p style="margin: 5px 0 0 0; font-size: 18px; color: #d97706;">Order ID: <strong>${data.orderId}</strong></p>
            </div>

            <h3 style="color: #333; margin: 25px 0 15px 0;">Customer Information</h3>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 8px 0;"><strong>Name:</strong> ${data.customerName || 'Not provided'}</p>
              <p style="margin: 8px 0;"><strong>Phone:</strong> <a href="tel:${data.customerPhone}" style="color: #16a34a; text-decoration: none;">${data.customerPhone}</a></p>
              <p style="margin: 8px 0;"><strong>Delivery Location:</strong> ${data.customerLocation || 'Not specified'}</p>
              <p style="margin: 8px 0;"><strong>Order Time:</strong> ${new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}</p>
            </div>

            <h3 style="color: #333; margin: 25px 0 15px 0;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; background: white;">
              <thead>
                <tr style="background: #f0fdf4; border-bottom: 2px solid #16a34a;">
                  <th style="padding: 15px; text-align: left; color: #16a34a; font-weight: 600;">Product</th>
                  <th style="padding: 15px; text-align: center; color: #16a34a; font-weight: 600;">Qty</th>
                  <th style="padding: 15px; text-align: right; color: #16a34a; font-weight: 600;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: right;">
              <p style="margin: 0; font-size: 18px; color: #16a34a;"><strong>Total: Rs. ${data.total.toLocaleString()}</strong></p>
            </div>

            <p style="color: #666; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
              <strong>Next Step:</strong> Contact the customer to confirm delivery details and process payment.
            </p>
          </div>
          ${getFooter()}
        </div>
      </body>
      </html>
    `;

    const customerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { ${baseStyles} }
          .container { ${containerStyle} }
        </style>
      </head>
      <body style="${baseStyles}">
        <div class="container" style="${containerStyle}">
          ${getHeader()}
          <div style="padding: 40px 20px; background: white;">
            <h2 style="color: #16a34a; margin-top: 0;">✅ Order Confirmed!</h2>
            <p>Hi <strong>${data.customerName}</strong>,</p>
            <p>Thank you for placing an order with NA Organic Store! We're excited to deliver premium organic products to you.</p>

            <div style="background: #dbeafe; border-left: 4px solid #0284c7; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0;"><strong style="font-size: 16px;">Order ID: ${data.orderId}</strong></p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #0c4a6e;">Placed on ${new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}</p>
            </div>

            <h3 style="color: #333; margin: 25px 0 15px 0;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse; background: white;">
              <thead>
                <tr style="background: #f0fdf4; border-bottom: 2px solid #16a34a;">
                  <th style="padding: 15px; text-align: left; color: #16a34a; font-weight: 600;">Product</th>
                  <th style="padding: 15px; text-align: center; color: #16a34a; font-weight: 600;">Qty</th>
                  <th style="padding: 15px; text-align: right; color: #16a34a; font-weight: 600;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: right;">
              <p style="margin: 0; font-size: 20px; color: #16a34a;"><strong>Total: Rs. ${data.total.toLocaleString()}</strong></p>
            </div>

            <h3 style="color: #333; margin: 25px 0 15px 0;">Delivery Details</h3>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
              <p style="margin: 8px 0;"><strong>Phone:</strong> ${data.customerPhone}</p>
              <p style="margin: 8px 0;"><strong>Delivery Location:</strong> ${data.customerLocation || 'To be specified'}</p>
            </div>

            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #047857;">What's Next?</h4>
              <ul style="margin: 10px 0; padding-left: 20px; color: #047857;">
                <li>Our team will contact you within 24 hours</li>
                <li>We'll confirm the delivery details with you</li>
                <li>Your order will be prepared with care</li>
                <li>You'll receive tracking information</li>
              </ul>
            </div>

            <p style="color: #666; margin-top: 20px;">
              <strong>Questions?</strong> Feel free to reach out to us:
            </p>
            <p style="color: #666;">
              📞 <a href="tel:+923028337026" style="color: #16a34a; text-decoration: none;">+92 302 833 7026</a><br>
              💬 <a href="https://wa.me/923291945009" style="color: #16a34a; text-decoration: none;">WhatsApp</a>
            </p>
          </div>
          ${getFooter()}
        </div>
      </body>
      </html>
    `;

    // Send to admin
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO_ADMIN,
      subject: `📦 New Order ${data.orderId} - NA Organic Store`,
      html: adminHtml,
    });

    // Send to customer if email provided
    if (data.customerEmail) {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: data.customerEmail,
        subject: `✅ Order Confirmed ${data.orderId} | NA Organic Store`,
        html: customerHtml,
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Order email sending error:', error);
    throw error;
  }
}
