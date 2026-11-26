export type FaqCategory = { id: string; title: string; blurb: string; items: { q: string; a: string }[] };

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "booking", title: "Booking & Reservations", blurb: "Find, book and track your slots.",
    items: [
      { q: "How can I book a sports venue?", a: "Browse available venues, select your preferred sport, choose a date and time slot, and proceed with the booking and payment." },
      { q: "Can I book a venue for multiple hours?", a: "Yes, you can select available time slots based on the venue's booking schedule and availability." },
      { q: "How can I check my booking status?", a: "Visit the My Bookings section in your dashboard to view your booking details and current status." },
      { q: "Can I modify my booking after confirmation?", a: "Booking modifications depend on the venue's policies and availability. Contact support for assistance." },
      { q: "Will I receive a booking confirmation?", a: "Yes, once your booking is successfully confirmed, you can view its details in your dashboard." },
    ],
  },
  {
    id: "payments", title: "Payments & Refunds", blurb: "Payment methods, failures and refunds.",
    items: [
      { q: "What payment methods are accepted?", a: "PlayNora supports the payment methods available through its secure Razorpay payment gateway." },
      { q: "What happens if my payment fails?", a: "If your payment fails, check your payment status before trying again to avoid duplicate payments." },
      { q: "My payment was successful, but my booking is not confirmed. What should I do?", a: "Contact PlayNora support with your payment transaction ID and booking details. Our team will investigate the issue." },
      { q: "How long does a refund take?", a: "Refund processing time depends on the payment provider and your bank. You can contact support to check your refund status." },
      { q: "How can I check my refund status?", a: "Contact customer support with your booking ID and payment reference number to get an update." },
    ],
  },
  {
    id: "cancellation", title: "Cancellation & Policies", blurb: "Cancel, reschedule and venue policies.",
    items: [
      { q: "How can I cancel my booking?", a: "Go to My Bookings, select the booking you want to cancel, and use the cancellation option if available." },
      { q: "Will I receive a full refund after cancellation?", a: "Refund eligibility depends on the applicable cancellation policy of the venue and the time of cancellation." },
      { q: "Can I reschedule my booking?", a: "Rescheduling is subject to venue availability and its booking policies. Contact support if you need assistance." },
      { q: "What happens if the venue cancels my booking?", a: "If a venue cancels your confirmed booking, contact PlayNora support for assistance with an alternative arrangement or applicable refund." },
      { q: "What happens if it rains during my booking?", a: "Weather-related cancellations depend on the venue's individual policies. Please contact the venue or PlayNora support." },
    ],
  },
  {
    id: "account", title: "Account & Support", blurb: "Your profile, password and help.",
    items: [
      { q: "How can I create a PlayNora account?", a: "Click Sign Up, enter the required details, and follow the registration instructions to create your account." },
      { q: "How can I reset my password?", a: "Select Forgot Password on the login page and follow the instructions to reset your password." },
      { q: "How can I update my profile information?", a: "Navigate to Profile Settings in your dashboard to update your available personal information." },
      { q: "How can I contact customer support?", a: "Visit the Help & Support section in your dashboard to submit your query or report an issue." },
      { q: "How can I report a problem with a venue?", a: "Open your booking details and contact support with the venue name, booking ID, and a description of the issue." },
    ],
  },
];
