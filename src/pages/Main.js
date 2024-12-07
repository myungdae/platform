import { React, useState } from "react";
import "../styles/style.css";
import MainHeader from "../components/MainHeader";
import Footer from "../components/Footer";
import SearchBox from "../components/SearchBar";

const Main = () => {
  const [searchTerm, setsearchTerm] = useState("");
  const handleSearchClick = () => {
    window.location.href = `/sitemap?keyword=${searchTerm}`;
  };

  return (
    <body>
      <div className="bg-container main-bg">
        <MainHeader />
        <div className="hero-section text-white">
          <h1>국방산업연구원</h1>
          <p>방위산업 무기 장비 부품 매칭 플랫폼</p>
          <label htmlFor="search-input">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#6A6A6A"
              id="search-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <SearchBox searchTerm={searchTerm} setSearchTerm={setsearchTerm} />
          </label>
          <button onClick={handleSearchClick}>Search</button>
        </div>
      </div>
      <article className="main-img-container bg-black">
        <img
          src="/fighter-banner.webp"
          alt="전투기"
          width="100%"
          height="100%"
          loading="lazy"
        />
      </article>
      <article className="main-content-container bg-black">
        <div className="max-width-lg-container">
          <aside id="main-content-aside" className="text-white">
            <h2>서비스 더보기</h2>
            <nav>
              <a href="">이주의 업체</a>
              <a href="">연계탐색형 온라인 플랫폼 장점</a>
              <a href="">방산용어사전</a>
              <a href="">방산뉴스</a>
              <a href="">국내외 국사박물관 소개</a>
              <a href="">신기술 신제품 소개</a>
              <a href="">국내외 국방관련주요사이트</a>
              <a href="">국방관련기관 인물 저서</a>
              <a href="">오늘의 군사영어</a>
            </nav>
          </aside>
          <div className="main-content-main">
            <div>
              <img
                src="/assets/first-card.webp"
                alt="BAYKAR 미팅"
                width="609"
                height="853"
                loading="lazy"
              />
              <a href="">더보기</a>
            </div>
            <div>
              <img
                src="/assets/second-card.webp"
                alt="BAYKAR 미팅"
                width="609"
                height="853"
                loading="lazy"
              />
              <a href="">더보기</a>
            </div>
            <div>
              <img
                src="/assets/third-card.webp"
                alt="BAYKAR 미팅"
                width="609"
                height="853"
                loading="lazy"
              />
              <a href="">더보기</a>
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </body>
  );
};

export default Main;
