import React from "react";
import star from "../assets/Star.svg";
import shield from "../assets/Shield.svg";
import send from "../assets/Send.svg";

const features = [
  {
    id: "feature-1",
    icon: star,
    title: "Wide Selection of Cars",
    content:
      "Choose from a wide selection of vehicles, including sedans, SUVs, trucks, and more, for your rental needs.",
  },
  {
    id: "feature-2",
    icon: shield,
    title: "Convenient Parking Options",
    content:
      "Access convenient parking options near your destination, ensuring a hassle-free experience when you arrive.",
  },
  {
    id: "feature-3",
    icon: send,
    title: "Secure Payment Methods",
    content:
      "Enjoy peace of mind with our secure payment methods, ensuring your transactions are safe and protected.",
  },
];

const styles = {
  boxWidth: "xl:max-w-[1280px] w-full",
  heading2:
    "font-poppins font-semibold xs:text-[48px] text-[40px] text-black xs:leading-[76.8px] leading-[66.8px] w-full mb-8",
  paragraph:
    "font-poppins font-normal text-gray-700 text-[18px] leading-[30.8px]",
  flexCenter: "flex justify-center",
  flexStart: "flex justify-center items-start",
  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-16 py-6",
  padding: "sm:px-16 px-6 sm:py-12 py-4",
  marginX: "sm:mx-16 mx-6",
  marginY: "sm:my-16 my-6",
};

export const layout = {
  section: `flex md:flex-row flex-col ${styles.paddingY} bg-gray-100 relative overflow-hidden`,
  sectionReverse: `flex md:flex-row flex-col-reverse ${styles.paddingY}`,
  sectionImgReverse: `flex-1 flex ${styles.flexCenter} md:mr-10 mr-0 md:mt-0 mt-10 relative`,
  sectionImg: `flex-1 flex ${styles.flexCenter} md:ml-10 ml-0 md:mt-0 mt-10 relative`,
  sectionInfo: `flex-1 ${styles.flexStart} flex-col`,
};

const Button = ({ styles }) => (
  <button
    type="button"
    className={`py-4 px-6 font-poppins font-medium text-[18px] text-white bg-blue-600 rounded-[10px] outline-none hover:bg-blue-700 transition-colors ${styles}`}
    data-aos="fade-up"
  >
    Get Started
  </button>
);

const FeatureCard = ({ icon, title, content, index }) => (
  <div
    className={`flex flex-row p-6 rounded-[20px] justify-center items-center bg-white shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl ${
      index !== features.length - 1 ? "mb-6" : "mb-0"
    } feature-card`}
  >
    <div className={`w-[64px] h-[64px] ${styles.flexCenter} bg-blue-100 rounded-full`}>
      <img src={icon} alt={title} className="w-[50%] h-[50%] object-contain" />
    </div>
    <div className="flex-1 flex flex-col ml-3">
      <h4 className="font-poppins font-semibold text-black text-[23px] mb-1">
        {title}
      </h4>
      <p className="font-poppins text-gray-600 text-[16px]">
        {content}
      </p>
    </div>
  </div>
);

const Business = () => (
  <section
    id="features"
    className={`${layout.section} pl-[120px] m-[30px] text-black`}
  >
    <div className="absolute inset-0 z-0">
      <div className="bubble bg-blue-300"></div>
      <div className="bubble bg-blue-400"></div>
      <div className="bubble bg-blue-500"></div>
    </div>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>Find Your Perfect Ride with Us</h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Discover a seamless car rental and parking experience with our platform.
        Choose from a wide range of vehicles, find convenient parking spots, and
        enjoy secure payment options.
      </p>
      <Button styles={`mt-10`} />
    </div>
    <div className={`${layout.sectionImg} flex-col z-10`}>
      {features.map((feature, index) => (
        <FeatureCard key={feature.id} {...feature} index={index} />
      ))}
    </div>
  </section>
);

export default Business;
