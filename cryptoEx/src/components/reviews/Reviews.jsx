import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Container, Modal, Box, Button } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import "swiper/css";
import "swiper/css/navigation";
import "./reviews.sass"

const Reviews = () => {
  const [reviews, setReviews] = useState([
    {
      username: "Ivan Ivanov",
      text: "I exchanged USDT to RUB, the process was smooth and fast. The operator confirmed the transaction quickly. Highly recommend!",
      orderId: "#123456"
    },
    {
      username: "Petr Petrov",
      text: "Excellent service! I purchased USDT at a great rate. The transaction was completed in no time. Will definitely use again.",
      orderId: "#654321"
    },
    {
      username: "Sidor Sidorov",
      text: "Amazing experience! I bought BTC, and everything went perfectly. Great team!",
      orderId: "#789012"
    },
    {
      username: "Petr Petrov",
      text: "Excellent service! I purchased USDT at a great rate. The transaction was completed in no time. Will definitely use again.",
      orderId: "#654321"
    },
  ]);

  const [form, setForm] = useState({ username: "", text: "", orderId: "" });
  const [open, setOpen] = useState(false);

  return (
    <Container>
      <div className="reviews">
        <h2 className="reviews__title">What people say about us:</h2>
        <Button variant="contained" onClick={() => setOpen(true)} sx={{ display: "block", margin: "0 auto" }}>Leave a Review</Button>
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box className="reviews__modal">
            <form
              className="reviews__form"
              onSubmit={(e) => {
                e.preventDefault();
                if (form.text.length > 200 || !form.username || !form.orderId) return;
                setReviews([{ ...form }, ...reviews]);
                setForm({ username: "", text: "", orderId: "" });
                setOpen(false);
              }}
            >
              <input
                type="text"
                placeholder="Your name"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Order ID (e.g. #123456)"
                value={form.orderId}
                onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                required
              />
              <textarea
                placeholder="Your review (max 200 chars)"
                value={form.text}
                maxLength="200"
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                required
              />
              <button type="submit">Add Review</button>
            </form>
          </Box>
        </Modal>
        <div className="reviews__slider-wrap">
          <div className="swiper-button-prev custom-prev">
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
          <Swiper
            slidesPerView={3}
            spaceBetween={30}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 10,
                navigation: false,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
                navigation: false,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
                navigation: {
                  prevEl: ".custom-prev",
                  nextEl: ".custom-next",
                },
              },
            }}
            modules={[Navigation]}
            className="mySwiper"
          >
            {reviews.map((review, index) => (
              <SwiperSlide key={index}>
                <div className="reviews__slide">
                  <div className="reviews__slide-user">
                    <img src="https://www.w3schools.com/howto/img_avatar.png" alt="user" className="reviews__slide-img" />
                    <p className="reviews__slide-name">{review.username}</p>
                  </div>
                  <p className="reviews__slide-text">{review.text}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="swiper-button-next custom-next">
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Reviews