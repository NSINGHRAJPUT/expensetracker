import React from "react";

const HeroLayout = ({ data }) => {
  return (
    // <div className="relative h-[50vh] bg-[url('/path-to-your-background-image.jpg')] bg-cover bg-center flex items-center justify-center">
    <div className="relative h-[50vh] flex items-center justify-center">
      <h1 className="text-5xl font-bold text-white text-center">
        {data.title1}
        <br />
        {data.title2}
      </h1>
    </div>
  );
};

export default HeroLayout;
