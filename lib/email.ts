import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`

  try {
    await resend.emails.send({
      from: 'The Water Bar <azambata.1984@gmail.com>',
      to: email,
      subject: 'Verify your email address',
      html: `
        <div>
          <h1>Welcome to The Water Bar!</h1>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="${verificationUrl}" style="
            display: inline-block;
            background-color: #1e40af;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            margin: 16px 0;
          ">
            Verify Email
          </a>
          <p>If you didn't request this email, you can safely ignore it.</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send verification email:', error)
    throw new Error('Failed to send verification email')
  }
}

export async function sendBookingConfirmation(
  email: string,
  name: string,
  date: Date,
  startTime: string,
  endTime: string
) {
  try {
    await resend.emails.send({
      from: 'The Water Bar <azambata.1984@gmail.com>',
      to: email,
      subject: 'Booking Confirmation - Morning Party',
      html: `
        <div>
          <h1>Booking Confirmed!</h1>
          <p>Hi ${name},</p>
          <p>Your booking for the Morning Party has been confirmed:</p>
          <div style="
            background-color: #f3f4f6;
            padding: 16px;
            border-radius: 4px;
            margin: 16px 0;
          ">
            <p><strong>Date:</strong> ${date.toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
          </div>
          <p>We look forward to seeing you!</p>
          <p>The Water Bar Team</p>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send booking confirmation:', error)
    throw new Error('Failed to send booking confirmation')
  }
}
