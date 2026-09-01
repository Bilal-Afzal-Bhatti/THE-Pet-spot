// Next.js + Tailwind 'News & Blog' section clone
// Drop this into your Next.js + Tailwind project as a separate component or page.
// It closely matches the screenshot: three blog cards with shadows, images, titles, date, description, and 'Read More' / 'View All Blogs' links.

import Image from "next/image";

export default function NewsBlog() {
  const blogs = [
    {
      id: 1,
      title: "For Dogs That Get Cold Feet At The G...",
      date: "October 5, 2024",
      desc: "Introducing pet and kids to each other, the pros of getting a pet, pet behavioural training, basic training, professional training.",
      image: "/Blog/DogImage.jpg",
      link: "#",
    },
    {
      id: 2,
      title: "5 Accessories That Are a Must-Have f...",
      date: "February 27, 2024",
      desc: "Pet buying is an irreversible decision. Consider all the important things beforehand, especially when it comes to...",
      image: "/Blog/DogImage2.jpg",
      link: "#",
    },
    {
      id: 3,
      title: "The Best Dog Crates for Every Pup, A...",
      date: "January 4, 2024",
      desc: "New to pet parenting? Explore the top 10 dog breeds for first-time owners in India...",
      image: "/Blog/DogImage3.jpg",
      link: "#",
    },
  ];

  return (
    <section className="bg-white py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-lg italic text-gray-700">Our Blogs & Tips</p>
        <h2 className="text-4xl font-semibold mt-2">News & Blog</h2>
      </div>

      <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-xl shadow-2xl ring-1 p-6 ring-gray-100 overflow-hidden flex flex-col hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-shadow duration-300"
          >
            <div className="relative w-full h-56">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover rounded"
              />
            </div>
            <div className=" flex flex-col grow">
              <h3 className="text-xl font-medium text-black leading-snug line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-sm text-gray-500 mt-2">{blog.date}</p>
              <p className="text-gray-600 mt-3 text-sm leading-relaxed line-clamp-3">
                {blog.desc}
              </p>
              <div className="mt-auto pt-4">
                <a
                  href={blog.link}
                  className="text-violet-500 text-sm font-medium hover:underline inline-flex items-center"
                >
                  Read More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 ml-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto text-right mt-10">
        <a
          href="#"
          className="text-violet-500 text-sm font-medium hover:underline inline-flex items-center"
        >
          View All Blogs
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 ml-1"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
