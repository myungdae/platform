import { React, useState, useEffect } from "react";
import Footer from "../components/Footer";
import PartsHeader from "../components/PartsHeader";
import { DropdownMenu, PartsListElement } from "./Parts";
import axios from "axios";

const SitemapPage = ({ keyword }) => {
  const [loading, setLoading] = useState(true);
  const [itemCount, setItemCount] = useState(5);
  const [pageNo, setPageNo] = useState(1);
  const [content, setContent] = useState([]);
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const maxViewPage = 7;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let url = `http://platform2.eventpool.kr/api/sitemap?keyword=${keyword}`;
        const response = await axios.get(url);

        if (response.status === 200) {
          let data = {};
          if (response.data == null || response.data.length === 0) {
            setContent(data);
            return;
          }
          response.data.forEach((item) => {
            data[item._id] = {
              name: item._id
                .replaceAll(
                  "http://platform[dot]eventpool[dot]kr/resource/",
                  ""
                )
                .replaceAll("_", " ")
                .replaceAll("[dot]", "."),
              count: item.count,
              list: item.list.map((subItem) => {
                return {
                  title: subItem["@id"]
                    .replace(
                      "http://platform[dot]eventpool[dot]kr/resource/",
                      ""
                    )
                    .replaceAll("[dot]", "."),
                  description: subItem[
                    "http://purl[dot]org/dc/elements/1[dot]1/description"
                  ]
                    ? subItem[
                        "http://purl[dot]org/dc/elements/1[dot]1/description"
                      ]["@value"]
                    : "",
                  imageLink: subItem[
                    "http://platform[dot]eventpool[dot]kr/resource/그림"
                  ]
                    ? subItem[
                        "http://platform[dot]eventpool[dot]kr/resource/그림"
                      ]["@value"].replaceAll("[dot]", ".")
                    : "/assets/empty.gif",
                  locationLink: "",
                };
              }),
            };
          });
          setContent(data);
          let activeItemKey = Object.keys(data)[0];
          setSelectedItem(activeItemKey);
          setData(data[activeItemKey]["list"].slice(0, itemCount));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        // console.log("done");
      }
    };

    fetchData();
  }, [keyword]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSetItemCount = (itemCount) => {
    setItemCount(itemCount);
    if (selectedItem) {
      setData(content[selectedItem]["list"].slice(0, itemCount));
    } else {
      setData([]);
    }
  }

  const handlePageClick = (page) => {
    setPageNo(page);
    if (!selectedItem) return;
    setData(content[selectedItem]["list"].slice((page - 1) * itemCount, page * itemCount));
  };

  const handleNextClick = () => {
    if (selectedItem != null && pageNo < Math.ceil(content[selectedItem]["list"].length / itemCount)) {
      handlePageClick(pageNo + 1);
    }
  };

  const handlePrevClick = () => {
    if (pageNo > 1) {
      handlePageClick(pageNo - 1);
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setData(content[item]["list"].slice(0, itemCount));
  };

  const generatePagination = () => {
    if (!selectedItem) return [];
    const totalPages = Math.ceil(content[selectedItem]["list"].length / itemCount);

    if (totalPages <= maxViewPage) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    if (pageNo <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (pageNo > totalPages - 4) {
      pages.push(
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pages.push(1, "...", pageNo - 1, pageNo, pageNo + 1, "...", totalPages);
    }

    return pages;
  };

  return (
    <div>
      <PartsHeader />
      {Object.keys(content).length > 0 ? (
        <section className="main-content-container">
        <aside className="parts-options-menu" style={{
          display: "flex",
          justifyContent: "flex-end",
        }}>
          <div className="parts-filters-container">
            <DropdownMenu
              items={[5, 10, 15, 20]}
              selectedItem={itemCount}
              onSelectItem={(item) => handleSetItemCount(item)}
            />
          </div>
        </aside>
          <div className="max-width-lg-container-parts">
            <aside id="parts-content-aside" className="text-black">
              <MenuComponent
                items={content}
                selectedItem={selectedItem}
                setSelectedItem={handleSelectItem}
              />
            </aside>
            <ul className="main-content-parts rounded-xl">
              {data.map((item, index) => (
                <PartsListElement
                  key={index}
                  title={item.title}
                  description={item.description}
                  imageLink={item.imageLink}
                  locationLink={item.locationLink}
                />
              ))}
            </ul>
          </div>
          <div className="pagination">
            <button onClick={handlePrevClick} disabled={pageNo === 1}>
              이전
            </button>
            {generatePagination().map((page, index) =>
              page === "..." ? (
                <span key={index}>...</span>
              ) : (
                <button
                  key={index}
                  onClick={() => handlePageClick(page)}
                  style={{
                    fontWeight: pageNo === page ? "bold" : "normal",
                    textDecoration: pageNo === page ? "underline" : "none",
                  }}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={handleNextClick}
              disabled={selectedItem != null && pageNo === Math.ceil(content[selectedItem]["list"].length / itemCount)}
            >
              다음
            </button>
          </div>
        </section>
        ) : (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "500px",
            fontSize: "24px",
            fontWeight: "bold",
          }}>
            검색 결과가 없습니다.
          </div>
        )}
      <Footer />
    </div>
  );
};

export default SitemapPage;

const MenuComponent = ({ items, selectedItem, setSelectedItem }) => {
  const handleClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div
      className="main-content-parts rounded-xl"
      style={{
        maxWidth: "300px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {Object.keys(items).map((key) => {
        let item = items[key];
        return (
          <div
            key={key}
            onClick={() => handleClick(key)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 15px",
              borderBottom: "1px solid #ddd",
              cursor: "pointer",
              backgroundColor: selectedItem === key ? "#e6f7ff" : "transparent",
              color: selectedItem === key ? "#007bff" : "#000",
              fontWeight: selectedItem === key ? "bold" : "normal",
            }}
          >
            <span>{item.name}</span>
            <span
              style={{
                backgroundColor: "#ff5722",
                color: "#fff",
                borderRadius: "50%",
                padding: "5px 10px",
                fontSize: "12px",
                minWidth: "20px",
                textAlign: "center",
              }}
            >
              {item.count}
            </span>
          </div>
        );
      })}
    </div>
  );
};
