import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`

  try {
    console.log('📧 Attempting to send verification email:', {
      to: email,
      verificationUrl
    })

    const result = await resend.emails.send({
      from: 'onboarding@resend.dev', // Default verified sender
      to: email,
      subject: 'Verify your Water Bar account',
      html: `
        <div style="
          font-family: system-ui, -apple-system, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        ">
          <h1 style="color: #1a1a2e;">Welcome to The Water Bar!</h1>
          <p style="color: #4a5568; font-size: 16px;">Please verify your email address by clicking the link below:</p>
          <a href="${verificationUrl}" style="
            display: inline-block;
            background-color: #1e40af;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            margin: 16px 0;
            font-weight: 500;
          ">
            Verify Email
          </a>
          <div style="margin-top: 24px; color: #718096; font-size: 14px;">
            <p>If you didn't request this email, you can safely ignore it.</p>
            <p>This link will expire in 24 hours.</p>
          </div>
        </div>
      `,
    })

    console.log('📧 Email sent successfully:', result)
    return result

  } catch (error) {
    console.error('📧 Failed to send verification email:', {
      error,
      email,
      verificationUrl
    })
    
    // Throw error with more details
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred while sending email'
    
    throw new Error(`Failed to send verification email: ${errorMessage}`)
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
    console.log('📧 Sending booking confirmation:', {
      to: email,
      name,
      date: date.toLocaleDateString()
    })

    const result = await resend.emails.send({
      from: 'onboarding@resend.dev', // Default verified sender
      to: email,
      subject: 'Booking Confirmed - The Water Bar',
      html: `
        <div style="
          font-family: system-ui, -apple-system, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        ">
          <h1 style="color: #1a1a2e;">Booking Confirmed!</h1>
          <p style="color: #4a5568; font-size: 16px;">Hi ${name},</p>
          <p style="color: #4a5568; font-size: 16px;">Your booking for the Morning Party has been confirmed:</p>
          <div style="
            background-color: #f3f4f6;
            padding: 16px;
            border-radius: 4px;
            margin: 16px 0;
            color: #4a5568;
          ">
            <p><strong>Date:</strong> ${date.toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
          </div>
          <p style="color: #4a5568; font-size: 16px;">We look forward to seeing you!</p>
          <p style="color: #4a5568; font-size: 16px;">The Water Bar Team</p>
        </div>
      `,
    })

    console.log('📧 Booking confirmation sent:', result)
    return result

  } catch (error) {
    console.error('📧 Failed to send booking confirmation:', {
      error,
      email,
      name,
      date
    })
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred while sending email'
    
    throw new Error(`Failed to send booking confirmation: ${errorMessage}`)
  }
}
