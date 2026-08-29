import HeroSection from "../components/HeroSection";
import TextSection from "../components/textSection";

export default function ShippingPolicy() {
  return (
    <div>
      <HeroSection
        title="About Pets Corner"
        bgImage="/terms.webp"
        currentPage="Shipping Policy"
      />

      <TextSection
        heading="Shipping Policy"
        paragraphs={[
          "These Terms and Conditions (“Terms”) form a legally binding electronic agreement under the Information Technology Act, 2000, between you (“User”) and Pets Corner (operated from 10, Shaheed Amit Bhardwaj Marg, Jai Shree Nagar, Sector 5, Malviya Nagar, Jaipur, Rajasthan 302017, hereinafter referred to as “Company,” “we,” “us,” or “our”).",
          "By accessing or using our website https://www.mrnmrspet.com (“Platform”), you agree to these Terms and our Privacy Policy. If you do not agree, please discontinue use immediately.",
          "Users must be 18 years or older and legally competent to contract under the Indian Contract Act, 1872.",
          "To access or book services, users may be required to register an account by providing accurate and current information.",
          "Users are responsible for maintaining the confidentiality of their account credentials and for all activities under their account.",
          "Pets Corner offers a variety of pet-related products and services, including but not limited to grooming, training, hostel stays, walking, and the sale of pet accessories, foods, toys and other pet-care products.",
          "All orders and services are subject to availability, local regulations, and may be modified or discontinued without prior notice.",
          "The Company follows and enforces a strict zero-tolerance policy against any unethical, unsafe, or illegal practices in the delivery of its services, sale or promotion of pet-related foods, products, or accessories. All offerings made available through the Platform are sourced, prepared, and provided in compliance with applicable quality, safety, and animal welfare standards. The Company neither engages in nor supports any activity that may compromise the health, safety, or well-being of pets or users. Any violation of this policy by associated service providers, vendors, or partners shall result in immediate suspension, removal, and reporting to the relevant authorities.",
          "All payments are processed securely through third-party payment gateways or UPI.",
          "By completing a transaction, users authorize the Company to process payments in compliance with applicable laws.",
          "Services such as grooming, training, walking, boarding, and adoption support are executed by authorized professionals or partners.",
          "Delivery and fulfillment of all products and services are subject to availability, location, and scheduling.",
          "The Company is not liable for delays caused by unforeseen circumstances such as weather, logistics issues, or emergencies.",
          "Cancellations made at least 24 hours before a scheduled service are eligible for a partial refund.",
          "Cancellations of scheduled services made at least 24 hours in advance are eligible for a partial refund. Cancellations of food products, accessories, or other pet-care products must be made at least 48 hours in advance to be eligible for a refund. For a complete and detailed refund policy, please refer to the Refund Policy available on our website.",
          "No refund is provided for services already rendered, last-minute cancellations, or “change of mind” requests.",
          "The Company collects and processes personal data as per its Privacy Policy, in compliance with the Digital Personal Data Protection Act, 2023, and IT Rules, 2021.",
          "Users consent to sharing limited data with third parties such as service providers and logistics partners for service fulfillment.",
          "Reasonable security measures are implemented to protect user data; however, the Company is not liable for breaches beyond its control.",
          "The Company shall not be liable for any indirect, incidental, or consequential damages arising from use of the Platform or services.",
          "The total liability of the Company shall not exceed the transaction amount paid by the user.",
          "For grievances, users may contact the Grievance Officer: Name – Simran, Email – support@mrnmrspet.com, Phone – 9257022415, Address – 10, Shaheed Amit Bhardwaj Marg, Jai Shree Nagar, Sector 5, Malviya Nagar, Jaipur, Rajasthan – 302017.",
          "Disputes will be resolved through arbitration in Jaipur, Rajasthan, under the Arbitration and Conciliation Act, 1996.",
          "Courts in Jaipur, Rajasthan shall have exclusive jurisdiction.",
          "These Terms are governed by and construed in accordance with the laws of India.",
        ]}
      />
    </div>
  );
}
