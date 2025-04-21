//import React from 'react'

import heroImg01 from "../assets/images/hero-img01.png";
import heroImg02 from "../assets/images/hero-img02.png";
import heroImg03 from "../assets/images/hero-img03.png";
import icon01 from "../assets/images/icon01.png";
import icon02 from "../assets/images/icon02.png";
import icon03 from "../assets/images/icon03.png";
import featureImg from "../assets/images/feature-img.png";
import faqImg from "../assets/images/faq-img.png";
import videoIcon from "../assets/images/video-icon.png";
import avatarIcon from "../assets/images/avatar-icon.png";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import About from "../components/About/About";
import ServiceList from "../components/Services/ServiceList";
import DoctorList from "../components/Doctors/DoctorList";
import FaqList from "../components/Faq/FaqList";
import Testimonial from "../components/Testimonial/Testimonial";

import SplitText from "./Gsap/SplitText";

import CircularGallery from "./Gsap/CircularGallery";

const handleAnimationComplete = () => {
  console.log("All letters have animated!");
};
const Home = () => {
  return (
    <>
      {/* ============== hero section ============== */}

      <section className="hero_section pt-[60px] 2xl:h-[1024]">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-[90px] items-center justify-between">
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
                <div className="flex">

                <button className="btn ml-[180px]">Report an Issue</button>
                </div>

              </div>
              {/* ============== hero counter ============== */}
              <div className="mt-[30px] lg:mt-[70px] flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-[30px]">
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
          <div className="flex items-center justify-between flex-col lg:flex-row">
            {/* ============== Feature content ============== */}
            <div className="xl:w-[670px]">
              <h2 className="heading  m-6">
                Transform Your Area
                <br /> Today
              </h2>
              <ul className="pl-4">
                <li className="text__para mb-3">
                  {" "}
                  Identify Problems – Report potholes, broken streetlights,
                  water leaks, and more.
                </li>
                <li className="text__para mb-3">
                  Engage & Collaborate – Upvote and comment on existing reports.
                </li>
                <li className="text__para">
                  Track Progress – Stay updated on fixes and improvements.
                </li>
              </ul>
              <Link to="/">
                <button className="btn ml-3">Learn More</button>
              </Link>
            </div>

            {/* ============== Feature img ============== */}
            <div className="relative z-10 xl:w-[770px] flex justify-end mt-[50px] lg:mt-0">
              <img src={featureImg} className="w-3/4" alt="" />
              <div
                className="w-[150px] lg:w-[248px] bg-white absolute bottom-[50px] left-0 md:bottom-[100px]
              md:left-5 z-20 p-2 pb-3 lg:pt-4 lg:px-4 lg:pb-[26px] rounded-[10px]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[6px] lg:gap-3">
                    <p className="text-[10px] leading-[10px] lg:text-[14px] lg:leading-5 text-black font-[600]">
                      Tue, 24
                    </p>
                    <p className="text-[10px] leading-[10px] lg:text-[14px] lg:leading-5 text-textColor font-[400]">
                      10:00AM
                    </p>
                  </div>
                  <span
                    className="w-5 h-5 lg:w-[34px] lg:h-[34px] flex items-center justify-center bg-yellow-300
                  rounded py-1 px-[6px] lg:py-3 lg:px-[9px]"
                  >
                    <img src={videoIcon} alt="" />
                  </span>
                </div>

                <div
                  className="w-[65px] lg:w-[96px] bg-[#CCF0F3] py-1 px-2 lg:py-[6px] lg:px-[10px] text-8px
                leading-[8px] lg:text-[12px] lg:leading-4 text-[#246BCE] font-[500] mt-2 lg:mt-4 rounded-full"
                >
                  Consultation
                </div>
                <div className="flex items-center gap-[6px] lg:gap-[10px] mt-2 lg:mt-[18px]">
                  <img src={avatarIcon} alt="" />
                  <h4 className="text-[10px] leading-3 lg:text-[16px] lg:leading-[22px] font-[700] text-textColor">
                    Wayne Collins
                  </h4>
                </div>
              </div>
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
            <p className="text__para text-center mb-4">
              Word-class care for everyone. Our health system offers unmatched,
              expert health care.
            </p>
          </div>
          <Testimonial />
        </div>
      </section>
      {/* ============== testimonial end ============== */}
    </>
  );
};

export default Home;
