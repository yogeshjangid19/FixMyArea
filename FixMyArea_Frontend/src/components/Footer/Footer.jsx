import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { RiLinkedinFill } from 'react-icons/ri';
import { AiFillYoutube, AiFillGithub, AiOutlineInstagram } from 'react-icons/ai';

const socialLinks = [
  {
    path: "https://www.linkedin.com/in/",
    icon: <RiLinkedinFill className="group-hover:text-white w-4 h-5" />,
  },
  {
    path: "https://github.com/yourusername",
    icon: <AiFillGithub className="group-hover:text-white w-4 h-5" />,
  },
  {
    path: "https://www.instagram.com/yourhandle",
    icon: <AiOutlineInstagram className="group-hover:text-white w-4 h-5" />,
  },
  {
    path: "https://www.youtube.com/c/yourchannel",
    icon: <AiFillYoutube className="group-hover:text-white w-4 h-5" />,
  },
];

const quickLinks01 = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/about",
    display: "About Us",
  },
  {
    path: "/services",
    display: "Our Services",
  },
  {
    path: "/blog",
    display: "Blog",
  },
];

const quickLinks02 = [
  {
    path: "/report-issue",
    display: "Report an Issue",
  },
  {
    path: "/track-fix",
    display: "Track Fixes",
  },
  {
    path: "/community",
    display: "Join the Community",
  },
  {
    path: "/get-involved",
    display: "Get Involved",
  },
];

const quickLinks03 = [
  {
    path: "/",
    display: "FAQs",
  },
  {
    path: "/contact",
    display: "Contact Us",
  },
  {
    path: "/support",
    display: "Support",
  },
];

const Footer = () => {
  const year = new Date().getFullYear(); // Define the 'year' variable.

  return (
    <footer className='pb-16 pt-10 font-poppins'>
      <div className='container'>
        <div className="flex justify-between flex-col md:flex-row flex-wrap gap-[30px]">
          <div className='w-full md:w-2/5'>
            <img src={logo} alt="Fix My Area Logo" />
            <p className='text-[16px] leading-7 font-400 text-textColor mt-4'>
              Copyright &copy; {year} Fix My Area. All rights reserved.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {socialLinks.map((link, index) => (
                <Link to={link.path} key={index} className='w-9 h-9 border-solid border-[#181A1E] rounded-full flex
                items-center justify-center group hover:bg-[#343f76] hover:border-none'>
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className='text-[20px] leading-[30px] font-[700] mb-6 text-black'>Quick Links</h2>
            {quickLinks01.map((item, index) => (
              <li key={index} className='mb-4'>
                <Link to={item.path} className='text-[16px] leading-7 font-[400] text-textColor'>
                  {item.display}
                </Link>
              </li>
            ))}
          </div>

          <div>
            <h2 className='text-[20px] leading-[30px] font-[700] mb-6 text-black'>I want to:</h2>
            {quickLinks02.map((item, index) => (
              <li key={index} className='mb-4'>
                <Link to={item.path} className='text-[16px] leading-7 font-[400] text-textColor'>
                  {item.display}
                </Link>
              </li>
            ))}
          </div>

          <div>
            <h2 className='text-[20px] leading-[30px] font-[700] mb-6 text-black'>Support</h2>
            {quickLinks03.map((item, index) => (
              <li key={index} className='mb-4'>
                <Link to={item.path} className='text-[16px] leading-7 font-[400] text-textColor'>
                  {item.display}
                </Link>
              </li>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
