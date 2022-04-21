import React from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/bundle"
import { Swiper, SwiperSlide } from "swiper/react";
import classes from "../../styles/Auth.module.scss";
import classNames from "classnames";
import Image from "next/image";
import SwiperCore, { Autoplay, Pagination } from "swiper";

SwiperCore.use([Pagination]);
SwiperCore.use([Autoplay]);


interface Props {
  image: any;
}

function AuthCarousel({ image }: Props) {

  return (
    <div
      className={classNames(classes.auth_items__carousel, "d-flex flex-column")}
    >
      <div className={classes.swiper}>
        <Swiper
          pagination={true}
          autoplay={{
            delay: 3500
          }}
        >
          {image && (
            <SwiperSlide className={classes.swiperSlide}>
              <Image src={image} alt="image group 86" />
            </SwiperSlide>
          )}
          {image && (
            <SwiperSlide className={classes.swiperSlide}>
              <Image src={image} alt="image group 86" />
            </SwiperSlide>
          )}
          {image && (
            <SwiperSlide className={classes.swiperSlide}>
              <Image src={image} alt="image group 86" />
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div >
  );
}

export default AuthCarousel;
