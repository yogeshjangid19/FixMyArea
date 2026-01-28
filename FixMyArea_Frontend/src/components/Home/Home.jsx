//import React from 'react'
import heroImg01 from "../../assets/images/hero-img01.png";
import heroImg02 from "../../assets/images/hero-img02.png";
import heroImg03 from "../../assets/images/hero-img03.png";
import icon01 from "../../assets/images/icon01.png";
import icon02 from "../../assets/images/icon02.png";
import icon03 from "../../assets/images/icon03.png";
import featureImg from "../../assets/images/feature-img.jpg";
import faqImg from "../../assets/images/faq-img.jpg";
import videoIcon from "../../assets/images/video-icon.png";
import avatarIcon from "../../assets/images/avatar-icon.png";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import About from "../About/About";
import ServiceList from "../Services/ServiceList";
import DoctorList from "../Doctors/DoctorList";
import FaqList from "../Faq/FaqList";
import Testimonial from "../Testimonial/Testimonial";

import SplitText from "../Gsap/SplitText";
import CircularGallery from "../Gsap/CircularGallery";

const handleAnimationComplete = () => {
  console.log("All letters have animated!");
};
const Home = () => {
  return (
    <>
      {/* ============== hero section ============== */}

      <section className="hero_section pt-[60px] 2xl:h-[1024]">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-[90px] items-center justify-between h-[90vh]">
            {/* ============== hero content ============== */}
            <div>
              <div className="lg:w-[570px]">
                <div className="text-center">
                  <SplitText
                    text="Your City, Your Responsibility"
                    className="text-[36px] leading-[46px] text-headingColor font-[800] md:text-[60px] md:leading-[70px]"
                    delay={30}
                    animationFrom={{
                      opacity: 0,
                      transform: "translate3d(0,50px,0)",
                    }}
                    animationTo={{
                      opacity: 1,
                      transform: "translate3d(0,0,0)",
                    }}
                    easing="easeOutCubic"
                    threshold={0.2}
                    rootMargin="-50px"
                    onLetterAnimationComplete={handleAnimationComplete}
                  />
                  <br />
                  <SplitText
                    text="Report, Track & Get Them Fixed!"
                    className="text-[25px] md:text-[30px] font-[600] block"
                    delay={30}
                    animationFrom={{
                      opacity: 0,
                      transform: "translate3d(0,30px,0)",
                    }}
                    animationTo={{
                      opacity: 1,
                      transform: "translate3d(0,0,0)",
                    }}
                    easing="easeOutCubic"
                    threshold={0.2}
                    rootMargin="-50px"
                    onLetterAnimationComplete={handleAnimationComplete}
                  />
                </div>

                <div className="mt-6 flex justify-center">
                  <Link to="/reportissue">
                    <button
                      className="
    relative overflow-hidden
    bg-blue-600 text-white 
    px-7 py-2.5 rounded-full
    text-sm font-semibold
    shadow-md
    transition-all duration-300
    hover:bg-blue-700
    hover:shadow-blue-500/50
    active:scale-95
  "
                    >
                      <span
                        className="
      absolute top-0 left-[-100%] w-full h-full
      bg-gradient-to-r from-transparent via-white/40 to-transparent
      skew-x-[-20deg]
      transition-all duration-500
      hover:left-[100%]
    "
                      ></span>

                      <span className="relative z-10">Report an Issue</span>
                    </button>
                  </Link>
                </div>
              </div>
              {/* ============== hero counter ============== */}
              <div className="mt-[30px] ml-[50px] lg:mt-[70px] flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-[30px]">
                <div>
                  <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                    500+
                  </h2>
                  <span className="w-[100px] h-2 bg-yellow-300 rounded-full block mt-[-14px]"></span>
                  <p className="text__para">Issues Resolved</p>
                </div>

                <div>
                  <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                    100+
                  </h2>
                  <span className="w-[100px] h-2 bg-purple-300 rounded-full block mt-[-14px]"></span>
                  <p className="text__para">Community Members</p>
                </div>

                <div>
                  <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                    10+
                  </h2>
                  <span className="w-[100px] h-2 bg-blue-300 rounded-full block mt-[-14px]"></span>
                  <p className="text__para">Issues Covered</p>
                </div>
              </div>
            </div>

            {/* ============== hero content ============== */}
            <div className="flex flex-col lg:flex-row gap-[30px] justify-end items-center">
              {/* Main Image */}
              <div className="w-full lg:w-2/3">
                <img
                  className="w-full rounded-lg shadow-lg"
                  src={heroImg01}
                  alt="Main Image"
                />
              </div>

              {/* Side Images */}
              <div className="flex flex-col gap-[30px] w-full lg:w-1/3">
                <img
                  className="w-full rounded-lg shadow-lg"
                  src={heroImg02}
                  alt="Side Image 1"
                />
                <img
                  className="w-full rounded-lg shadow-lg"
                  src={heroImg03}
                  alt="Side Image 2"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== hero section end ============== */}

      <section>
        <br />
        <div className="container">
          <div className="lg:w-[470px] mx-auto">
            <h2 className="heading text-center ">How Fix My Area works?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
            <div className="py-[30px] px-5">
              <div className="flex items-center justify-center">
                <img src={icon01} alt="" />
              </div>

              <div className="mt-[px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  Capture & Report
                </h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  Take a photo, describe the issue, and submit it in seconds.
                </p>
              </div>
            </div>

            <div className="py-[30px] px-5 ">
              <div className="flex items-center justify-center">
                <img src={icon02} alt="" />
              </div>

              <div className="mt-[px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  Get Noticed
                </h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  Your report reaches local authorities & the community.
                </p>
              </div>
            </div>

            <div className="py-[30px] px-5">
              <div className="flex items-center justify-center">
                <img src={icon03} alt="" />
              </div>

              <div className="mt-[px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  Problem Fixed!
                </h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  Track updates & see how issues are resolved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== About section Start ============== */}

      {/* <About /> */}

      {/* ============== Service section ============== */}
      <br />
      <br />
      <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center mb-4"> What can you report? </h2>
          </div>
          <div style={{ height: "600px", position: "relative" }}>
            <CircularGallery bend={3} textColor="#ffffff" borderRadius={0.05} />
          </div>
          {/* <ServiceList /> */}
        </div>
      </section>

      {/* ============== Service section end ============== */}

      {/* ============== Feature section ============== */}
      <br />
      <br />
      <br />
      <section>
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-[90px] items-center justify-between ml-20 mr-20  bg-cover bg-center bg-no-repeat">
            {" "}
            {/* ============== Feature content ============== */}
            <div className="xl:w-[670px]">
              <h2 className="heading  m-6 ">Transform Your Area Today</h2>

              <ul className="pl-4">
                <li className="text__para mb-3 flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6 flex-shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    />
                  </svg>
                  <span>
                    Identify Problems – Report potholes, broken streetlights,
                    water leaks, and more.
                  </span>
                </li>
                <li className="text__para mb-3 flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6 flex-shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    />
                  </svg>
                  <span>
                    Engage & Collaborate – Upvote and comment on existing
                    reports.
                  </span>
                </li>
                <li className="text__para mb-3 flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6 flex-shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    />
                  </svg>
                  <span>
                    Track Progress – Stay updated on fixes and improvements.
                  </span>
                </li>
              </ul>
              <Link to="/">
                <button className="btn ml-3">Learn More</button>
              </Link>
            </div>
            {/* ============== Feature img ============== */}
            <div className="relative z-10 xl:w-[770px] flex justify-end mt-[50px] lg:mt-0 ">
              <img src={featureImg} className="w-3/4 rounded-lg" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* ============== Trusted Authorities for a Better City! ============== */}
      <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center m-5">
              {" "}
              Trusted Authorities for a Better City!{" "}
            </h2>
            <p className="text__para text-center mb-4">
              Government bodies dedicated to improving public infrastructure.
            </p>
          </div>

          <DoctorList />
        </div>
      </section>

      {/* ============== faq section  ================ */}
      <br />
      <br />
      <br />
      <section>
        <div className="container">
          <div className="flex justify-between gap-[50px] lg:gap-0">
            <div className="w-1/2 hidden md:block">
              <img src={faqImg} alt="" />
            </div>

            <div className="w-full md:w-1/2">
              <h2 className="heading">Frequently Asked Questions (FAQ)</h2>

              <FaqList />
            </div>
          </div>
        </div>
      </section>
      {/* ============== faq section end  ============== */}

      {/* ============== testimonial  ============== */}
      <br />
      <br />
      <br />
      <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center m-5">
              {" "}
              What our community says
            </h2>
          </div>
          <Testimonial />
        </div>
      </section>
      {/* ============== testimonial end ============== */}
    </>
  );
};

export default Home;
