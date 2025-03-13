import { useEffect, useState } from 'react';
import { Phone, Mail, Clock, MapPin, Send } from 'lucide-react';
import { findSettings } from '../../utils/Api';
import axios from 'axios'
import { Helmet } from 'react-helmet';
import ReCAPTCHA from "react-google-recaptcha";

const PROHIBITED_LINKS = [
  'https://www.facebook.com',
  'https://www.instagram.com',
  'https://www.twitter.com',
  'https://www.linkedin.com',
  'https://www.pinterest.com',
  'https://www.google.com',
  'https://www.youtube.com',
  'https://www.reddit.com',
  'https://www.tumblr.com',
  'https://www.twitch.tv',
  'https://www.vimeo.com',
  'https://www.spotify.com',
  'https://www.github.com',
  'https://www.gitlab.com',
  'https://www.stackoverflow.com',
  'https://www.hackerrank.com',
  'https://www.leetcode.com',
  'https://www.codewars.com',
  'https://www.kaggle.com',
  'https://xhamster.desi/',
  "https://www.xvideos.com",
  "https://www.youporn.com",
  "https://www.pornhub.com",
  "https://www.redtube.com",
  "https://www.tube8.com",
  "https://www.xnxx.com/",
  "https://www.xvideos.com/tags/xnxx",
  "lyase12a.com",
  "wearens.com",
  "webnextlabs.com",
  "lyase12b.com",
  "lyase12c.com",
  "clavius12c.com",
  "lyase12d.com",
  "wearens.net",
  "wearens.org",
  "lyase12e.com",
  "webnextlabs.net",
  "webnextlabs.org",
  "lyase12f.com",
  "clavius12d.com",
  "wearens.info",
  "lyase12g.com",
  "webnextlabs.info",
  "wearens.biz",
  "lyase12h.com",
  "clavius12e.com",
  "webnextlabs.biz",
  "wearens.co",
  "lyase12i.com",
  "clavius12f.com",
  "webnextlabs.co"
]
const PROHIBITED_WORDS = ["xxx", "Xhamster", "sex", "blowjob", "fuck", "sperm", "condom", "suck", "vagina", "sexy", "abuse", "xnxx", "<script>", "script", "virus", "ifrmae"]

const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
const isValidPhone = (phone) => /^[0-9]{10,15}$/.test(phone);
const isValidName = (name) => name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);


function Support() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [settings, setSettings] = useState(false);

  useEffect(() => {
    const dataFetchSettings = async () => {
      const dataSetting = await findSettings()

      setSettings(dataSetting)
    }

    dataFetchSettings()
  }, [])

  const containsProhibitedContent = (text) => {
    const lowerText = text.toLowerCase();

    // Log detected words
    const foundWords = PROHIBITED_WORDS.filter(word => lowerText.includes(word.toLowerCase()));
    const foundLinks = PROHIBITED_LINKS.filter(link => lowerText.includes(link.toLowerCase()));

    if (foundWords.length || foundLinks.length) {
      console.log("Blocked Words:", foundWords);
      console.log("Blocked Links:", foundLinks);
      return true;
    }

    return false;
  };
  const [captchaValue, setCaptchaValue] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (!isValidName(formData.name)) {
      setError('Invalid name: Must be at least 2 characters and contain only letters.')
      // alert("Invalid name: Must be at least 2 characters and contain only letters.");
      return;
    }
    if (!isValidEmail(formData.email)) {
      setError('Invalid email format.')
      // alert("");
      return;
    }
    if (!isValidPhone(formData.phone)) {
      setError('Invalid phone number: Must contain only digits and be 10-15 characters long.')

      // alert("Invalid phone number: Must contain only digits and be 10-15 characters long.");
      return;
    }
    if (containsProhibitedContent(formData.message)) {
      setError("Your message contains prohibited words or links.")
      // alert("Your message contains prohibited words or links.");
      return;
    }

    try {
      const data = {
        Name: formData.name,
        Email: formData.email,
        Phone: formData.phone,
        Message: formData.message,
        captchaValue

      }
      const response = await axios.post('https://api.dyfru.com/api/v1/support-request', data);
      console.log(response);

      if (response.status === 201) {
        setTimeout(() => {
          setSubmitted(true);

          setTimeout(() => {
            setSubmitted(false);
          }, 3000);
        }, 200);
      }
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      })

    } catch (error) {
      setError(error?.response?.data?.message || error?.response?.data?.error || error.message || "Error during form submission")
      console.error("Error during form submission:", error);
    }

  };



  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Helmet>
        <title>{`Get in Touch - DyFru | Contact Us for Premium Dry Fruits & Nuts`}</title>
        <meta
          name="description"
          content="Have questions or need assistance? Get in touch with DyFru! Contact us for inquiries about our premium dry fruits, nuts, orders, or wholesale deals."
        />
        <meta
          name="keywords"
          content="Contact DyFru, get in touch, dry fruits customer support, nuts online help, buy dry fruits, wholesale dry fruits, DyFru support, premium nuts supplier"
        />
      </Helmet>


      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-green-800 mb-12">Get in Touch</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-transform duration-300">
              <h2 className="text-2xl font-bold mb-8 text-green-700">Contact Information</h2>

              <div className="space-y-8">
                <div className="flex items-center space-x-4 group">
                  <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-300">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Call Us</p>
                    <p className="text-green-600">{settings?.contactNumber}</p>
                    <p className="text-sm text-green-500">Mon-Fri: 9:00 AM - 5:00 PM</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-300">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Email Us</p>
                    <p className="text-green-600">{settings?.supportEmail}</p>
                  </div>
                </div>



                <div className="flex items-center space-x-4 group">
                  <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-300">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Visit Us</p>
                    <p className="text-green-600">{settings?.address}</p>

                  </div>
                </div>
              </div>

              {/* Map with iframe */}
              <div className="mt-8 rounded-xl overflow-hidden shadow-lg h-64">
                <iframe
                  title="DyFru Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5461.815245929877!2d77.09230368820187!3d28.647816768108576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d04849fd22327%3A0x84e08b536d8bf3f2!2sChand%20Nagar%2C%20Vishnu%20Garden%2C%20Delhi%2C%20110018!5e1!3m2!1sen!2sin!4v1741845834561!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade">
                </iframe>

              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-transform duration-300">
              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h2>
                  <p className="text-green-600">We have received your message and will get back to you soon.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-8 text-green-700">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-green-700">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border rounded-lg border-gray-900 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 p-3 transition-colors duration-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-green-700">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border rounded-lg border-gray-900 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 p-3 transition-colors duration-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-green-700">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border rounded-lg border-gray-900 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 p-3 transition-colors duration-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-green-700">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        required
                        className="mt-1 block w-full border rounded-lg border-gray-900 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 p-3 transition-colors duration-200"
                      ></textarea>
                    </div>
                    <div className='w-full'>

                      <ReCAPTCHA
                        style={{ width: "100%" }}
                        bottomleft
                        sitekey="6LduBfMqAAAAAPDRkR-5__ccDCXJY6qZkoXxQBs2" // Replace with your site key
                        onChange={handleCaptchaChange}
                      />
                    </div>

                    {error && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md flex items-center gap-2">
                        <span className="text-lg">❌</span>
                        <p className="text-sm font-medium">Error: {error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform hover:scale-[1.02] transition-all duration-200"
                    >
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Support;