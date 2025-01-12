import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      userName,
      email,
      wellnessType,
      drinks,
      specialRequests 
    } = body

    // Send email to yacht team
    await resend.emails.send({
      from: 'The Water Bar <noreply@waterbar.com>',
      to: 'team@waterbar.com', // Replace with actual yacht team email
      subject: 'New Wellness & Drinks Request',
      html: `
        <div>
          <h1>New Request from ${userName}</h1>
          
          <h2>Contact Information</h2>
          <p><strong>Name:</strong> ${userName}</p>
          <p><strong>Email:</strong> ${email}</p>

          <h2>Request Details</h2>
          <p><strong>Wellness Experience:</strong> ${wellnessType}</p>
          <p><strong>Preferred Drinks:</strong> ${drinks || 'None specified'}</p>
          
          ${specialRequests ? `
            <h2>Special Requests</h2>
            <p>${specialRequests}</p>
          ` : ''}
          
          <p style="color: #666; margin-top: 20px;">
            Please review and contact the member to arrange their experience.
          </p>
        </div>
      `,
    })

    // Send confirmation email to user
    await resend.emails.send({
      from: 'The Water Bar <noreply@waterbar.com>',
      to: email,
      subject: 'Your Wellness & Drinks Request Received',
      html: `
        <div>
          <h1>Request Received</h1>
          <p>Dear ${userName},</p>
          
          <p>We've received your request for:</p>
          <ul>
            <li>Wellness Experience: ${wellnessType}</li>
            <li>Preferred Drinks: ${drinks || 'None specified'}</li>
          </ul>
          
          ${specialRequests ? `
            <p><strong>Your Special Requests:</strong></p>
            <p>${specialRequests}</p>
          ` : ''}
          
          <p>Our team will review your request and contact you shortly to arrange the details.</p>
          
          <p>Best regards,<br>The Water Bar Team</p>
        </div>
      `,
    })

    return NextResponse.json({
      message: 'Request sent successfully'
    })
  } catch (error) {
    console.error('Request error:', error)
    return NextResponse.json(
      { message: 'Failed to send request' },
      { status: 500 }
    )
  }
}
