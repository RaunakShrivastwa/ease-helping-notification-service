import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smpt.gmail.com",
  secure: false,
  auth: {
    user: "puse476@gmail.com",
    pass: "rdfviwvmdsvodvtl",
  },
});

export async function sendBookingMail(to: string, booking: any) {
  console.log("hello bokking",booking);
  
  await transporter.sendMail({
    from: `"Ease Helper" <${process.env.EMAIL_USER}>`,
    to,
    subject: "New Booking Available😍😍😍😍😍😍😍",
    html:  `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f9;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .email-container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            h3 {
              color: #333;
              font-size: 24px;
              text-align: center;
            }
            h1 {
              color: #2d87f0;
              font-size: 28px;
              margin-bottom: 10px;
              text-align: center;
            }
            h2 {
              color: #5f6368;
              font-size: 22px;
              margin-bottom: 15px;
              text-align: center;
            }
            p {
              font-size: 16px;
              line-height: 1.5;
              color: #666666;
              margin: 8px 0;
              text-align: center;
            }
            .highlight {
              color: #ff5722;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <h3>New Booking</h3>
            <p>Booking ID: <span class="highlight">${booking._id}</span></p>
            <h2>User ID: ${booking.userId}</h2>
            <p>Category: ${booking.catogery}</p>
            <p>Location: ${booking.location}</p>
          </div>
        </body>
      </html>
    `,
  });
}
