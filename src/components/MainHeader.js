import { React } from "react";
import "../styles/style.css";
import { NavItems } from "../store/NavItems";
import DropdownMenu from "./NavDropdown";

const MainHeader = () => {
  return (
    <header className="text-white">
      <a href="http://www.koidi.co.kr">
        <img
          src="/logo-white.svg"
          alt="데이터센터"
          width="106"
          height="38"
          loading="eager"
          className="logo"
        />
      </a>
      <nav className="header-nav max-width">
        {NavItems.slice(0, 9).map((item, index) => (
          <a href={`/facet/${item.replace(/\s+/g, "")}`} key={index}>
            {item}
          </a>
        ))}
        <DropdownMenu items={NavItems.slice(9)} color="white" />
        <div className="header-nav-side">
          <button className="text-white" onClick={() => {
            window.location.href = "http://kodex.eventpool.kr";
          }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1"
              stroke="currentColor"
              className=""
              id="globe-svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
          </button>
          <div id="auth-container">
            <a href="/login" id="login-btn" className="border-r-white">
              로그인
            </a>
            <a href="/signup">회원가입</a>
          </div>
        </div>
      </nav>
      <button id="mobile-menu-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="#FFFFFF"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#FFFFFF"
          style={{ width: "100%", height: "100%" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>
    </header>
  );
};

export default MainHeader;
