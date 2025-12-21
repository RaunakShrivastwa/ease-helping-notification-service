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
  await transporter.sendMail({
    from: `"Ease Helper" <${process.env.EMAIL_USER}>`,
    to,
    subject: "New Booking Available",
    html: `
      <h3>New Booking</h3>
      <p>Category: ${booking.category}</p>
      <p>Location: ${booking.location}</p>
    `,
  });
}
