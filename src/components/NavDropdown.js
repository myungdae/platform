import React, { useState, useEffect, useRef } from "react";
import "../styles/style.css";

const DropdownMenu = (props) => {
  const items = props.items;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleNavigation = (href) => {
    closeDropdown();
    window.location.href = href;
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = (item) => {
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        style={{ color: props.color, fontWeight: 500 }}
      >
        +더보기
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() =>
                handleNavigation(`/facet/${item.replace(/\s+/g, "")}`)
              }
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
