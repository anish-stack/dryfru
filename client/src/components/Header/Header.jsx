import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Search,
  Menu,
  Heart,
  X,
  ChevronRight,

  LogIn,
  User
} from 'lucide-react';
import logo from './logo.png'
import { useSelector, useDispatch } from 'react-redux';
import { findMarqueee, findMyDetails, findNavs } from '../../utils/Api'
import { fetchWishlist } from '../../store/slice/whishlist';
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [token, setToken] = useState(false);
  const { wishlist } = useSelector((state) => state.whishlist)
  const { cart } = useSelector((state) => state.cart)
  const [annoncement, setAnnouncements] = useState([])
  const dispatch = useDispatch()
  const [navLinks, setNavLinks] = useState([])

  // const navLinks = [
  //   {
  //     id: 1,
  //     name: "PECAN NUTS",
  //     path: "/productpage/6780fa0ae800bca193163975",
  //     icon: "🥜"
  //   },
  //   {
  //     id: 2,
  //     name: "CASHEW",
  //     path: "/productpage/6780fae573f5c96b00a45915",
  //     icon: "🌰"
  //   },
  //   {
  //     id: 3,
  //     name: "PISTACHIO",
  //     path: "/productpage/6780fb0073f5c96b00a45916",
  //     icon: "🥜"
  //   },
  //   {
  //     id: 4,
  //     name: "SHOP",
  //     path: "/shop",
  //     icon: "🛒"
  //   }
  // ];

  useEffect(() => {

    const fetch = async () => {
      try {

        const announce = await findMarqueee();
        const filter = announce.filter((item) => item.status !== false)
        setAnnouncements(filter)
      } catch (error) {
        console.log("err", error)
      }
    }
    fetch()
  }, [])
  useEffect(() => {
    const tokens = sessionStorage.getItem('token_login') || {};

    if (tokens === null || tokens === undefined) {
      setToken(false)
    } else {
      setToken(true)
    }
    const fetch = async () => {
      const data = await findNavs()
      setNavLinks(data)
    }
    const fetchData = async () => {

      try {

        await findMyDetails();

      } catch (error) {
        setToken(false)
        sessionStorage.removeItem('token_login')

      }
    };

    dispatch(fetchWishlist())
    fetch()
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className={`w-full ${scrolled ? 'fixed top-0 z-[999] transition-all duration-300' : ''} `}>

      <div className="bg-gradient-to-r from-green-600 to-green-800 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap py-2">
          <div className="inline-flex">
            {[...annoncement, ...annoncement, ...annoncement].map((text, index) => (
              <span key={index} className="mx-8 text-white text-sm font-medium">
                {text.title}
              </span>
            ))}
          </div>
        </div>
      </div>

      <header className={`bg-white  border  px-0 md:px-10 ${scrolled ? 'shadow-lg  w-full' : ''
        }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">

            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} className="h-12 object-fit" alt='' />

            </Link>


            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link._id}
                  to={`/Page/details/${link._id}/${link.name.replace(/\s+/g, '-').replace(/%/g, '-')}`}


                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 font-medium transition-colors"
                >
                  {/* <span className="text-lg">{link.icon}</span> */}
                  <span> {link.name.replace(/%/g, '-')}</span>
                </Link>
              ))}
              <Link className="flex items-center space-x-2 text-gray-700 hover:text-green-600 font-medium transition-colors" to={'/Shop'}>
                Shop
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4 lg:space-x-6">

              <Link className="relative  p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Heart className="h-5 w-5 text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlist.length || 0}
                </span>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cart.length || 0}
                </span>
              </Link>

              {
                token ? (
                  <Link to="/profile/dashboard" className="relative p-2 flex items-center gap-1 hover:bg-gray-100 rounded-full transition-colors">
                    <User className="h-5 w-5 text-gray-700" />
                    {/* <span>User</span> */}
                  </Link>
                ) : (
                  <Link to="/login" className="relative p-2 flex items-center gap-1 hover:bg-gray-100 rounded-full transition-colors">
                    <LogIn className="h-5 w-5 text-gray-700" />
                    {/* <span>Login</span> */}
                  </Link>
                )
              }

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Menu className="h-6 w-6 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className={`overflow-hidden transition-all duration-300 ${showSearch ? 'h-16 opacity-100' : 'h-0 opacity-0'
            }`}>
            <div className="container mx-auto px-4 py-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-green-200 rounded-full focus:outline-none focus:border-green-500 transition-colors"
                />
                <Search className="absolute left-4 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
        <div className={`absolute right-0 z-[999] top-0 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>

          <nav className="p-2">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={`/Page/details/${link._id}/${link.name.replace(/\s+/g, '-').replace(/%/g, '-')}`}

                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {/* <span className="text-xl">{link.icon}</span> */}
                  <span className="font-medium">{link.name}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            ))}
            <Link className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
              to={'/Shop'}>
              <span className="font-medium">Shop</span>

              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;