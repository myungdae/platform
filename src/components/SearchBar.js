import React, { useState } from "react";
import axios from "axios";

const SearchBox = ({searchTerm, setSearchTerm}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const _resource = "http://platform[dot]eventpool[dot]kr/resource/";
  const _label = "http://www[dot]w3[dot]org/2000/01/rdf-schema#label";

  const fetchSuggestions = async (term) => {
    try {
      const response = await axios.get(
        "http://platform2.eventpool.kr/api/search?keyword=" + term
      );
      const result = response.data
        .map((item) => {
          if (!item.hasOwnProperty("@type")) return null;
          const type =
            typeof item["@type"] === "string"
              ? item["@type"]
                  .replace(_resource, "")
                  .replace(/\[dot\]/g, ".")
              : item["@type"][0]
                  .replace(_resource, "")
                  .replace(/\[dot\]/g, ".");
          const value = item.hasOwnProperty(_label)
            ? item[_label].hasOwnProperty("@value")
              ? item[_label]["@value"]
                  .replace(_resource, "")
                  .replace(/\[dot\]/g, ".")
              : item[_label][0]
                  .replace(_resource, "")
                  .replace(/\[dot\]/g, ".")
            : item["@id"].replace(_resource, "");

          const _id = "/resource/" + item["@id"].replace(_resource, "");
          return {
            "@id": _id,
            "@type": type,
            label: `${value} (${type})`,
            value: value,
          };
        })
        .filter((item) => item !== null);
      setSuggestions(result);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      fetchSuggestions(term);
      setDropdownVisible(true);
    } else {
      setSuggestions([]);
      setDropdownVisible(false);
    }
  };

  const handleSuggestionClick = (item) => {
    if (item) {
      window.location.href = item["@id"];
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (selectedSuggestion) {
        handleSuggestionClick(selectedSuggestion);
      } else {
        window.location.href = `/sitemap?keyword=${searchTerm}`;
      }
    } else if (e.key === "ArrowDown") {
      if (selectedSuggestion === null) {
        setSelectedSuggestion(suggestions[0]);
      } else {
        const currentIndex = suggestions.indexOf(selectedSuggestion);
        if (currentIndex < suggestions.length - 1) {
          setSelectedSuggestion(suggestions[currentIndex + 1]);
        }
      }
    } else if (e.key === "ArrowUp") {
      if (selectedSuggestion === null) {
        setSelectedSuggestion(suggestions[suggestions.length - 1]);
      } else {
        const currentIndex = suggestions.indexOf(selectedSuggestion);
        if (currentIndex > 0) {
          setSelectedSuggestion(suggestions[currentIndex - 1]);
        }
      }
    }
  };

  return (
    <div style={{ position: "relative", maxWidth: "400px", margin: "20px auto" }}>
      <input
        id="search-input"
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        placeholder="Search..."
        autoComplete="off"
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "14px",
          border: "1px solid #ddd",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          outline: "none",
          fontSize: "16px",
          minWidth: "400px",
        }}
      />
      {isDropdownVisible && suggestions.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            margin: "8px 0 0",
            padding: "0",
            border: "1px solid #ddd",
            borderRadius: "6px",
            position: "absolute",
            width: "100%",
            backgroundColor: "#fff",
            zIndex: 1000,
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            maxHeight: "200px", // 드롭다운 최대 높이
            overflowY: "auto", // 스크롤바 활성화
          }}
        >
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(item)}
              style={{
                padding: "10px 12px",
                cursor: "pointer",
                borderBottom: "1px solid #f0f0f0",
                fontSize: "14px",
                color: "#333",
                backgroundColor:
                  selectedSuggestion === item ? "#f5f5f5" : "transparent",
              }}
              onMouseEnter={() => setSelectedSuggestion(item)} // 마우스 호버 시 선택
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
