import Image from "next/image";
import {
  FaHeartbeat,
  FaShieldAlt,
  FaUserFriends,
  FaRegSmileBeam,
} from "react-icons/fa";
import {
  MdOutlineVaccines,
  MdOutlinePets,
  MdOutlineSupportAgent,
} from "react-icons/md";
export const data = [
  {
    icon: FaHeartbeat,
    title: "Healthy Pet",
    text: "Being pet lovers our self, we understand the importance of a pet’s health. All our puppies are at least eight weeks old when they are sent to you. Before your bundle of joy reaches you, he is required to undergo an extensive health checkup by a licensed veterinarian.",
  },
  {
    icon: MdOutlineVaccines,
    title: "Vaccinated & Insured Pet",
    text: "To make the initial experience with your furry family member smooth and trouble-free, we make sure that all our puppies are up-to-date on their vaccinations and are insured.",
  },
  {
    icon: FaUserFriends,
    title: "Responsible Breeders",
    text: "All of our puppies are raised by responsible breeders who consider their pet’s health their foremost priority. We have zero tolerance for puppy mills and all our breeders are pet lovers just like us who are looking for the best homes for their fur babies.",
  },
  {
    icon: FaRegSmileBeam,
    title: "Easy and Hassle-free Process",
    text: "With Pets Corner, your journey with a pet starts with no difficulties. You have access to adorable pets looking for furever homes nationwide. You can receive guidance regarding any pet-related aspect in the comfort of your home. We make sure that a healthy and happy pet is delivered to you and have a secured payment process.",
  },
  {
    icon: MdOutlineSupportAgent,
    title: "Expert Pet Guidance",
    text: "Our pet experts will guide you throughout your journey as a pet parent and will always be at your beck and call there to help you.",
  },
  {
    icon: MdOutlinePets,
    title: "Happy Pet Parenting",
    text: "We don’t stop at providing you with a furry family member and guidance related to it. We are also connected with service providers such as veterinarians, trainers, groomers, and hostels. We always make sure to provide you with the best of best to.",
  },
];

export default function BreedWhyMMP() {
  return (
    <section className="bg-white py-6">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <h2 className="text-2xl font-semibold text-[#028d8f] mb-2">Why MMP?</h2>
        <p className="text-gray-600 mb-10">
          Looking for a furry companion? Know why MMP is the perfect option for
          you.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="p-8 shadow-xl rounded-xl text-center">
                <Icon className="text-[#028d8f] text-4xl mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
