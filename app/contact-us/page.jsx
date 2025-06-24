export default function ContactUs() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-12 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-center mb-8 text-green-700">Contact Us</h1>

      <p className="mb-6 text-gray-700 leading-relaxed">
        We’d love to hear from you! Whether you have questions, feedback, or need assistance, feel free to reach out to us through any of the following methods:
      </p>

      <div className="space-y-6 text-gray-700 text-lg">
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-green-600">Phone</h2>
          <p>Call us at: <a href="tel:+919555983097" className="text-blue-600 underline">+91 95559 83097</a></p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 text-green-600">Email</h2>
          <p>
            You can also email us at:{" "}
            <a href="mailto:thenutrionshop@gmail.com" className="text-blue-600 underline">
              thenutrionshop@gmail.com
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 text-green-600">Address</h2>
          <p>Our office is located at:</p>
          <address className="not-italic mt-1">
            The Nutrion Shop<br />
            123 Wellness Street<br />
            Fitness City, IN 110001
          </address>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">Send Us a Message</h2>
        <form className="space-y-4 max-w-lg">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium text-gray-800">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-800">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block mb-1 font-medium text-gray-800">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              placeholder="Write your message here..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
