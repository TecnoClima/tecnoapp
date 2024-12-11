import fabricas from "../../assets/carrousell/Fabricas.png";
import logo from "../../assets/carrousell/Logo.png";
import servicios from "../../assets/carrousell/servicios.png";
import surrey from "../../assets/carrousell/surrey.png";

import React, { useState } from "react";

import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from "reactstrap";

const images = [servicios, fabricas, surrey, logo];
const items = [];
for (let i = 0; i < images.length; i++) {
  items.push({
    src: images[i],
    altText: "Slide " + i,
    caption: "",
  });
}

const Example = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = items.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.src}
      >
        <img src={item.src} alt={item.altText} width="100%" height="100%" />
        <CarouselCaption
          captionText={item.caption}
          captionHeader={item.caption}
        />
      </CarouselItem>
    );
  });

  return (
    <Carousel activeIndex={activeIndex} next={next} previous={previous}>
      <CarouselIndicators
        items={items}
        activeIndex={activeIndex}
        onClickHandler={goToIndex}
      />
      {slides}
      <CarouselControl
        direction="prev"
        directionText="Previous"
        onClickHandler={previous}
      />
      <CarouselControl
        direction="next"
        directionText="Next"
        onClickHandler={next}
      />
    </Carousel>
  );
};

export function ExampleCarrousell() {
  return <Example />;
}

export default function DaisyuiCarousel({ className }) {
  const [imageIndex, setImageIndex] = useState(0);

  function handleClick(e) {
    e.preventDefault();
    const index = e.currentTarget.value;
    console.log(e.currentTarget.id, index);
    document
      .getElementById(`slide${index}`)
      .scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className={`carousel w-full ${className}`}>
      {images.map((image, index) => (
        <div
          key={image}
          id={`slide${index + 1}`}
          className="carousel-item relative w-full"
        >
          <img src={image} className="w-full" alt={`Imagen ${index + 1}`} />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <button
              id={index}
              onClick={handleClick}
              value={4 - index}
              className="btn btn-circle mb-2"
            >
              ❮
            </button>
            <button
              onClick={handleClick}
              value={index + 2 > 4 ? 1 : index + 2}
              className="btn btn-circle translate-x-1 mt-2"
            >
              ❯
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
