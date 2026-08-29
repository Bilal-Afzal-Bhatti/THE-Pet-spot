import { Kafka, type Producer, type Consumer } from "kafkajs";
import sendEmail from "./sendEmail.js";

const kafka = new Kafka({
  clientId: "petspot-backend",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

let producer: Producer | null = null;
let consumer: Consumer | null = null;

export const getKafkaProducer = async (): Promise<Producer> => {
  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
    console.log("🚀 Kafka Producer Connected");
  }
  return producer;
};

export type OtpEventType = "SEND_OTP" | "FORGOT_PASSWORD_OTP" | "USER_REGISTERED";

export interface OtpEventData {
  id: string;
  email: string;
  otp: string;
  name?: string;
  type?: OtpEventType;
  isPetParent?: string;
}

export const sendOtpEvent = async (userData: OtpEventData) => {
  const eventType = userData.type || "SEND_OTP";
  
  // Dynamic subject assignment based on event type
  const subject = eventType === "FORGOT_PASSWORD_OTP" 
    ? "PetSpot - Password Reset OTP" 
    : "Your PetSpot Verification Code";

  try {
    const p = await getKafkaProducer();

    await p.send({
      topic: "user-registered",
      messages: [
        {
          key: userData.id,
          value: JSON.stringify({
            event: eventType,
            subject,
            timestamp: new Date().toISOString(),
            data: userData,
          }),
        },
      ],
    });

    console.log(`✉️ Published ${eventType} event to Kafka for: ${userData.email}`);
  } catch (error) {
    console.error("⚠️ Kafka Producer Error, falling back to direct Nodemailer delivery:", error);
    await sendEmail({
      email: userData.email,
      subject,
      message: userData.otp,
    });
  }
};

// Backward-compatible alias for registration flow
export const sendRegistrationEvent = sendOtpEvent;

export const initKafkaConsumer = async () => {
  try {
    consumer = kafka.consumer({ groupId: "petspot-email-group" });
    await consumer.connect();
    await consumer.subscribe({ topic: "user-registered", fromBeginning: false });

    console.log("📥 Kafka Consumer Connected & Listening on topic: user-registered");

    await consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;

        const payload = JSON.parse(message.value.toString());
        const { data, subject } = payload;

        if (data?.email && data?.otp) {
          console.log(`📨 Kafka Consumer processing email for: ${data.email}`);

          await sendEmail({
            email: data.email,
            subject: subject || "Your PetSpot Verification Code",
            message: data.otp,
          });

          console.log(`✅ Email successfully sent to: ${data.email}`);
        }
      },
    });
  } catch (error) {
    console.error("❌ Kafka Consumer initialization failed:", error);
  }
};