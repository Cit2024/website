export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface EmailTemplateData {
  name: string;
  email: string;
  companyName?: string;
  projectTitle?: string;
  rejectionReason?: string;
  [key: string]: any;
}

// Email template generator functions
export const emailTemplates = {
  // Collaborator Templates
  collaboratorSubmissionConfirmation: (data: EmailTemplateData): EmailTemplate => ({
    subject: 'Application Received - Misurata Center for Entrepreneurship',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .info-box { background: #f8f9fa; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Received Successfully</h1>
            </div>
            <div class="content">
              <p>Dear ${data.companyName || data.name},</p>
              
              <p>Thank you for submitting your application to join the Misurata Center for Entrepreneurship & Business Incubators platform as a collaborator.</p>
              
              <div class="info-box">
                <strong>Application Status:</strong> Under Review<br>
                <strong>Submitted:</strong> ${new Date().toLocaleDateString()}<br>
                <strong>Reference:</strong> ${data.email}
              </div>
              
              <p>Our team will carefully review your application and verify the information provided. This process typically takes 3-5 business days.</p>
              
              <p>You will receive an email notification once a decision has been made regarding your application.</p>
              
              <p>If you have any questions in the meantime, please don't hesitate to contact us.</p>
              
              <p>Best regards,<br>
              <strong>Misurata Center for Entrepreneurship Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Misurata Center for Entrepreneurship & Business Incubators</p>
              <p>This is an automated message. Please do not reply directly to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Application Received Successfully
      
      Dear ${data.companyName || data.name},
      
      Thank you for submitting your application to join the Misurata Center for Entrepreneurship & Business Incubators platform as a collaborator.
      
      Application Status: Under Review
      Submitted: ${new Date().toLocaleDateString()}
      
      Our team will carefully review your application. This process typically takes 3-5 business days.
      
      Best regards,
      Misurata Center for Entrepreneurship Team
    `
  }),

  collaboratorApproval: (data: EmailTemplateData): EmailTemplate => ({
    subject: '🎉 Congratulations! Your Application Has Been Approved',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .success-box { background: #d1fae5; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0; }
            .celebration { font-size: 48px; text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Our Platform!</h1>
            </div>
            <div class="content">
              <div class="celebration">🎉 🎊 ✨</div>
              
              <p>Dear ${data.companyName || data.name},</p>
              
              <p><strong>Congratulations!</strong> We are thrilled to inform you that your application to join the Misurata Center for Entrepreneurship & Business Incubators has been <strong>APPROVED</strong>!</p>
              
              <div class="success-box">
                <strong>✅ Application Status:</strong> Approved<br>
                <strong>✅ Company Logo:</strong> Now visible on our platform<br>
                <strong>✅ Profile Status:</strong> Active
              </div>
              
              <p>Your organization's logo and information are now featured in our collaborators section, showcasing your partnership with our entrepreneurship center.</p>
              
              <h3>What's Next?</h3>
              <ul>
                <li>Your company profile is now live on our platform</li>
                <li>You'll receive partnership opportunities and updates</li>
                <li>Access to our network of innovators and entrepreneurs</li>
                <li>Invitation to exclusive events and workshops</li>
              </ul>
              
              <center>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/collaborators" class="button">View Your Profile</a>
              </center>
              
              <p>We look forward to a successful partnership and collaboration!</p>
              
              <p>Warm regards,<br>
              <strong>Misurata Center for Entrepreneurship Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Misurata Center for Entrepreneurship & Business Incubators</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Congratulations! Your Application Has Been Approved
      
      Dear ${data.companyName || data.name},
      
      We are thrilled to inform you that your application has been APPROVED!
      
      Your organization's logo and information are now featured in our collaborators section.
      
      What's Next:
      - Your company profile is now live
      - Access to our network of innovators
      - Invitation to exclusive events
      
      Welcome aboard!
      
      Misurata Center for Entrepreneurship Team
    `
  }),

  collaboratorRejection: (data: EmailTemplateData): EmailTemplate => ({
    subject: 'Application Update - Misurata Center for Entrepreneurship',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #6b7280; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .info-box { background: #fef2f2; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Update</h1>
            </div>
            <div class="content">
              <p>Dear ${data.companyName || data.name},</p>
              
              <p>Thank you for your interest in joining the Misurata Center for Entrepreneurship & Business Incubators platform.</p>
              
              <p>After careful review, we regret to inform you that we are unable to approve your application at this time.</p>
              
              ${data.rejectionReason ? `
              <div class="info-box">
                <strong>Feedback:</strong><br>
                ${data.rejectionReason}
              </div>
              ` : ''}
              
              <p>We encourage you to address any concerns mentioned and reapply in the future. Our decision does not reflect on your organization's capabilities, and we hope to have the opportunity to work together in the future.</p>
              
              <p>If you have any questions or would like to discuss this decision, please feel free to contact us.</p>
              
              <p>Best regards,<br>
              <strong>Misurata Center for Entrepreneurship Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Misurata Center for Entrepreneurship & Business Incubators</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  // Innovator Templates
  innovatorSubmissionConfirmation: (data: EmailTemplateData): EmailTemplate => ({
    subject: 'Project Submission Received - Misurata Center for Entrepreneurship',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .info-box { background: #f8f9fa; padding: 15px; border-left: 4px solid #f5576c; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Project Submission Received</h1>
            </div>
            <div class="content">
              <p>Dear ${data.name},</p>
              
              <p>Thank you for submitting your innovative project "<strong>${data.projectTitle}</strong>" to the Misurata Center for Entrepreneurship & Business Incubators.</p>
              
              <div class="info-box">
                <strong>Project Status:</strong> Under Review<br>
                <strong>Submitted:</strong> ${new Date().toLocaleDateString()}<br>
                <strong>Project:</strong> ${data.projectTitle}
              </div>
              
              <p>Our expert panel will review your project submission and assess how we can best support your innovation journey. This review process typically takes 5-7 business days.</p>
              
              <p>During this time, we will evaluate:</p>
              <ul>
                <li>Project feasibility and innovation potential</li>
                <li>Resource requirements and support needed</li>
                <li>Alignment with our incubation programs</li>
                <li>Potential collaboration opportunities</li>
              </ul>
              
              <p>You will receive a detailed response once our review is complete.</p>
              
              <p>Best regards,<br>
              <strong>Misurata Center for Entrepreneurship Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Misurata Center for Entrepreneurship & Business Incubators</p>
              <p>This is an automated message. Please do not reply directly to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  innovatorApproval: (data: EmailTemplateData): EmailTemplate => ({
    subject: '🚀 Great News! Your Project Has Been Accepted',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .success-box { background: #d1fae5; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0; }
            .rocket { font-size: 48px; text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Innovation Journey Begins!</h1>
            </div>
            <div class="content">
              <div class="rocket">🚀 💡 🎯</div>
              
              <p>Dear ${data.name},</p>
              
              <p><strong>Congratulations!</strong> We are excited to inform you that your project "<strong>${data.projectTitle}</strong>" has been <strong>ACCEPTED</strong> into our innovation support program!</p>
              
              <div class="success-box">
                <strong>✅ Project Status:</strong> Accepted<br>
                <strong>✅ Support Level:</strong> Full Incubation Support<br>
                <strong>✅ Project Visibility:</strong> Featured on Platform
              </div>
              
              <h3>Your Innovation Support Package Includes:</h3>
              <ul>
                <li>Dedicated mentorship from industry experts</li>
                <li>Access to our state-of-the-art facilities</li>
                <li>Networking opportunities with investors and partners</li>
                <li>Technical and business development support</li>
                <li>Visibility on our innovation showcase platform</li>
                <li>Potential funding opportunities</li>
              </ul>
              
              <p>Your project is now featured in our innovators section, showcasing your innovative solution to our network of collaborators and investors.</p>
              
              <center>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/innovators" class="button">View Your Project</a>
              </center>
              
              <p>Our team will contact you shortly to schedule an onboarding session and discuss the next steps in your innovation journey.</p>
              
              <p>Let's build the future together!</p>
              
              <p>Warm regards,<br>
              <strong>Misurata Center for Entrepreneurship Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Misurata Center for Entrepreneurship & Business Incubators</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  innovatorRejection: (data: EmailTemplateData): EmailTemplate => ({
    subject: 'Project Review Update - Misurata Center for Entrepreneurship',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #6b7280; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .info-box { background: #fef2f2; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Project Review Update</h1>
            </div>
            <div class="content">
              <p>Dear ${data.name},</p>
              
              <p>Thank you for submitting your project "<strong>${data.projectTitle}</strong>" to the Misurata Center for Entrepreneurship & Business Incubators.</p>
              
              <p>After thorough evaluation by our expert panel, we regret to inform you that we are unable to accept your project into our current incubation program.</p>
              
              ${data.rejectionReason ? `
              <div class="info-box">
                <strong>Feedback from Review Panel:</strong><br>
                ${data.rejectionReason}
              </div>
              ` : ''}
              
              <h3>Moving Forward:</h3>
              <ul>
                <li>Consider the feedback provided to strengthen your project</li>
                <li>You're welcome to reapply with an updated proposal</li>
                <li>Attend our workshops and events to enhance your project</li>
                <li>Connect with our mentors for guidance</li>
              </ul>
              
              <p>This decision doesn't diminish the value of your innovation. We encourage you to continue developing your idea and hope to see an enhanced version in the future.</p>
              
              <p>If you would like additional feedback or guidance, please don't hesitate to reach out to our team.</p>
              
              <p>Best regards,<br>
              <strong>Misurata Center for Entrepreneurship Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Misurata Center for Entrepreneurship & Business Incubators</p>
            </div>
          </div>
        </body>
      </html>
    `
  })
};
