import { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Container, Modal, Box, Button } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import "swiper/css";
import "swiper/css/navigation";
import "./reviews.sass";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(false); // Добавлено состояние для модального окна
  const [form, setForm] = useState({ // Добавлено состояние для формы
    username: "",
    text: "",
    orderId: ""
  });

  useEffect(() => {
    axios.get("http://localhost:8000/api/reviews/")
      .then(response => {
        if (response.data && Array.isArray(response.data.results)) {
          setReviews(response.data.results);
        } else if (Array.isArray(response.data)) {
          setReviews(response.data);
        } else {
          setReviews([]);
        }
      })
      .catch(error => {
        console.error("Failed to fetch reviews:", error);
        setReviews([]);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.text.length > 200 || !form.username || !form.orderId) return;

    const payload = {
      username: form.username,
      text: form.text,
      order_id: form.orderId.replace("#", ""),
    };

    axios.post("http://localhost:8000/api/reviews/", payload)
      .then((res) => {
        setReviews([res.data, ...reviews]);
        setForm({ username: "", text: "", orderId: "" });
        setOpen(false);
      })
      .catch((err) => {
        console.error("Failed to post review:", err);
        alert("Ошибка при отправке отзыва. Убедитесь, что Order ID существует.");
      });
  };

  return (
    <Container>
      <div className="reviews">
        <h2 className="reviews__title">What people say about us:</h2>
        <Button variant="contained" onClick={() => setOpen(true)} sx={{ display: "block", margin: "0 auto" }}>
          Leave a Review
        </Button>
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box className="reviews__modal">
            <form className="reviews__form" onSubmit={handleSubmit}>
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
                onChange={(e) => {
                  let value = e.target.value;
                  if (!value.startsWith("#") && value.length > 0) value = "#" + value; // Исправлено условие
                  setForm({ ...form, orderId: value });
                }}
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
                    <img
                      src="https://www.w3schools.com/howto/img_avatar.png"
                      alt="user"
                      className="reviews__slide-img"
                    />
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
  );
};

export default Reviews;