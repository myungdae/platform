import { React, useState, useEffect } from "react";
import Footer from "../components/Footer";
import PartsHeader from "../components/PartsHeader";
import axios from "axios";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

import "../styles/style.css";

const PartsPage = (props) => {
  const facet = props.facet;
  const [filters, setFilters] = useState({});
  const [viewType, setViewType] = useState("list");
  const [itemCount, setItemCount] = useState(5);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [content, setContent] = useState([]);
  const [canViewAsMap, setCanViewAsMap] = useState(false);

  const descriptionKey = "http://purl[dot]org/dc/elements/1[dot]1/description";
  const latLongKey = "http://www[dot]w3[dot]org/2003/01/geo/wgs84_pos#lat_long";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resourcePrefix = "http://platform[dot]eventpool[dot]kr/resource/";

        let url = `http://platform2.eventpool.kr/api/facet/${facet}`;
        if (Array.from(selectedFilters).length > 0) {
          url += "?filters=";
          selectedFilters.forEach((filter) => {
            let idx = filter.indexOf("-");
            url += filter.slice(idx + 1).replaceAll(".", "[dot]") + ",";
          });
          url = url.slice(0, -1);
        }

        let headers = {
          "Content-Type": "application/json",
        };

        const response = await axios.get(url, { headers: headers });

        // Helper function to clean strings
        const cleanString = (prefix, str) => {
          if (str.startsWith(prefix)) {
            str = str.slice(prefix.length);
          }
          return str.replace("[dot]", ".");
        };

        const filters = {};
        const content = [];
        response.data.list.forEach((filter) => {
          const part = cleanString(facet + "_", filter.parentType);
          const id = cleanString(resourcePrefix, filter._id);
          const attr = Array.isArray(filter.attr)
            ? id
            : cleanString(resourcePrefix, filter.attr);
          const value = {
            id: `${id}::${part}::${attr}`,
            name: attr,
            count: filter.sum,
          };
          if (filters[part]) {
            filters[part].push(value);
          } else {
            filters[part] = [value];
          }
        });

        let body = response.data.body.filter(
          (item) => item["_id"] === resourcePrefix + facet
        )[0];
        body.list.forEach((item) => {
          let imageLink = "/assets/empty.gif";
          if (
            item[resourcePrefix + "그림"] &&
            item[resourcePrefix + "그림"]["@value"]
          )
            imageLink = item[resourcePrefix + "그림"]["@value"].replaceAll(
              "[dot]",
              "."
            );
          let description = "";
          if (item[descriptionKey] && item[descriptionKey]["@value"])
            description = item[descriptionKey]["@value"];

          let latLong = [];
          if (latLongKey in item && item[latLongKey]["@value"]) {
            let latLongStr = item[latLongKey]["@value"].replaceAll(
              "[dot]",
              "."
            );
            latLong = latLongStr.split(",").map((str) => parseFloat(str));
          }
          content.push({
            title: cleanString(resourcePrefix, item["@id"]),
            description: description,
            imageLink: imageLink,
            latLong: latLong,
          });
        });

        content.sort((a, b) => {
          if (a.title < b.title) return -1;
          if (a.title > b.title) return 1;
          return 0;
        });

        setFilters(filters);
        setContent(content);
        setCanViewAsMap(response.data.canViewAsMap);
      } catch (error) {
        console.error(error);
      } finally {
        // console.log("done");
      }
    };

    fetchData();
  }, [facet, selectedFilters]);

  const onFilterClick = (e) => {
    if (e.target.checked) {
      setSelectedFilters([...selectedFilters, e.target.id]);
    } else {
      setSelectedFilters(
        selectedFilters.filter((filter) => filter !== e.target.id)
      );
    }
  };

  const onRemoveButtonClicekd = (filterId) => {
    setSelectedFilters(selectedFilters.filter((filter) => filter !== filterId));
    let elem = document.getElementById(filterId);
    if (elem) elem.checked = false;
  };

  return (
    <div>
      <PartsHeader />
      <main className="parts-main-container">
        <h1 className="text-black text-xl font-700 text-center" style={{
          borderBottom: "1px solid #e0e0e0",
          paddingBottom: "1rem",
        }}>
          {facet}
        </h1>
        <section className="main-content-container">
          <aside className="parts-options-menu">
            <div className="parts-selected-container">
              {selectedFilters.map((filter, index) => (
                <SelectedFilterButton
                  key={filter}
                  filterId={filter}
                  onRemoveButtonClicekd={onRemoveButtonClicekd}
                />
              ))}
            </div>
            <div className="parts-filters-container">
              <button
                onClick={() => {
                  setViewType("list");
                  setItemCount(5);
                }}
                style={{
                  fontWeight: viewType === "list" ? "bold" : "normal",
                  gap: "0.5rem",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={viewType === "list" ? "2" : "1.5"}
                  stroke="currentColor"
                  className=""
                  style={{ height: "32px", width: "32px" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                리스트
              </button>
              {canViewAsMap ? (
                <button
                  onClick={() => {
                    setViewType("map");
                    setItemCount(6);
                  }}
                  style={{
                    fontWeight: viewType === "map" ? "bold" : "normal",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={viewType === "map" ? "2" : "1.5"}
                    stroke="currentColor"
                    style={{ height: "32px", width: "32px" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 2.25c2.9 0 5.25 2.35 5.25 5.25 0 3.9-5.25 10.5-5.25 10.5s-5.25-6.6-5.25-10.5c0-2.9 2.35-5.25 5.25-5.25Zm0 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 21.75h15"
                    />
                  </svg>
                  지도
                </button>
              ) : (
                <button
                  onClick={() => {
                    setViewType("grid");
                    setItemCount(6);
                  }}
                  style={{
                    fontWeight: viewType === "grid" ? "bold" : "normal",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={viewType === "grid" ? "2.5" : "2"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-layout-grid"
                  >
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                  그리드
                </button>
              )}
              <DropdownMenu
                items={viewType === "list" ? [5, 10, 15, 20] : [6, 12, 24, 48]}
                selectedItem={itemCount}
                onSelectItem={(item) => setItemCount(item)}
              />
            </div>
          </aside>
          <div className="max-width-lg-container-parts gap-4">
            <aside id="parts-content-aside" className="text-black">
              <p className="text-black font-500">필터</p>
              {Object.keys(filters).map((filterGroup, index) => (
                <FilterElement
                  key={index}
                  isOpen={index === 0}
                  filterGroup={filterGroup}
                  filters={filters[filterGroup]}
                  onFilterClick={onFilterClick}
                />
              ))}
            </aside>
            <PageParts
              pageCount={itemCount}
              viewType={viewType}
              content={content}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const DropdownMenu = (props) => {
  const items = props.items;
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = (item) => {
    setIsOpen(false);
    props.onSelectItem(item);
  };

  return (
    <div className="dropdown">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="12"
          viewBox="0 0 13 12"
          fill="none"
          style={{
            height: "12px",
            width: "12px",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.5s ease", // 애니메이션 효과
          }}
        >
          <path
            d="M6.5 12L0.00481036 0.749999L12.9952 0.75L6.5 12Z"
            fill="#131313"
          />
        </svg>
        {props.selectedItem}{" "}
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {items.map((item, index) => (
            <li key={index} onClick={() => closeDropdown(item)}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const SelectedFilterButton = (props) => {
  const filterId = props.filterId;

  return (
    <button
      onClick={() => {
        props.onRemoveButtonClicekd(filterId);
      }}
      style={{ padding: "0.5rem 1rem" }}
    >
      {idToTitle(filterId.replaceAll("_", " "))}{" "}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className=""
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};

const FilterElement = (props) => {
  const filterGroup = props.filterGroup;
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const [itemCount, setItemCount] = useState(5);
  const [viewFilters, setViewFilters] = useState(props.filters.slice(0, 5));

  useEffect(() => {
    setViewFilters(props.filters.slice(0, itemCount));
  }, [itemCount, props.filters]);

  return (
    <figure className="bg-light-gray px-1 py-05 mt-1 rounded-xl scroll-container">
      <figcaption className="font-500 filter-title">
        <button onClick={() => setIsOpen(!isOpen)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="12"
            viewBox="0 0 13 12"
            fill="none"
            style={{
              transform: !isOpen ? "rotate(-90deg)" : "rotate(0deg)",
              transition: "transform 0.5s ease", // 애니메이션 효과
            }}
          >
            <path
              d="M6.5 12L0.00481036 0.749999L12.9952 0.75L6.5 12Z"
              fill="#131313"
            />
          </svg>
        </button>
        {filterGroup}
      </figcaption>
      {isOpen && (
        <ul className="filter-list font-300">
          {viewFilters.map((filter, index) => (
            <li key={index}>
              <label htmlFor={filter.id}>
                {filter.name.replaceAll("_", " ")} ({filter.count})
              </label>
              <input
                type="checkbox"
                id={filterGroup + "-" + filter.id}
                onChange={props.onFilterClick}
              />
            </li>
          ))}
          <li>
            <button onClick={() => setItemCount(itemCount + 5)}>
              + 더보기
            </button>
          </li>
        </ul>
      )}
    </figure>
  );
};

const PageParts = ({ viewType, pageCount, content }) => {
  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState([]);
  const maxViewPage = 7;

  useEffect(() => {
    setData(content.slice(0, pageCount));
  }, [content, pageCount]);

  const handlePageClick = (page) => {
    setPageNo(page);
    setData(content.slice((page - 1) * pageCount, page * pageCount));
  };

  const handleNextClick = () => {
    if (pageNo < Math.ceil(content.length / pageCount)) {
      handlePageClick(pageNo + 1);
    }
  };

  const handlePrevClick = () => {
    if (pageNo > 1) {
      handlePageClick(pageNo - 1);
    }
  };

  const generatePagination = () => {
    const totalPages = Math.ceil(content.length / pageCount);

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
      {viewType === "list" ? (
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
      ) : viewType === "grid" ? (
        <ul className="main-content-parts-grid rounded-xl">
          {data.map((item, index) => (
            <PartsGridElement
              key={index}
              title={item.title}
              description={item.description}
              imageLink={item.imageLink}
            />
          ))}
        </ul>
      ) : viewType === "map" ? (
        <PartsMapElement content={content} />
      ) : (
        <p>No valid view type selected</p>
      )}
      {viewType !== "map" && (
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
            disabled={pageNo === Math.ceil(content.length / pageCount)}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

const PartsListElement = (props) => {
  let description = props.description.replaceAll("[dot]", ".");
  if (description.length > 350) {
    description = description.slice(0, 350) + "...";
  }

  return (
    <li className="bg-light-gray">
      <div>
        <a href={`/resource/${props.title.replace(/\./g, "[dot]")}`}>
          <img
            className="main-content-parts-img"
            src={props.imageLink}
            alt={props.title}
            loading="lazy"
          />
        </a>
      </div>
      <dl>
        <dt>
          <a href={`/resource/${props.title.replace(/\./g, "[dot]")}`}>
            {props.title.replaceAll("_", " ")}
          </a>
        </dt>
        <dd>{description}</dd>
      </dl>
      {props.locationLink && (
        <a href={props.locationLink}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className=""
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
          위치 보기
        </a>
      )}
    </li>
  );
};

const PartsGridElement = (props) => {
  return (
    <li>
      <a href={`/resource/${props.title.replace(/\./g, "[dot]")}`}>
        <img src={props.imageLink} alt={props.title} loading="lazy" />
        <dl>
          <dt>{props.title.replaceAll("_", " ")}</dt>
        </dl>
      </a>
    </li>
  );
};

const PartsMapElement = (props) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAoKqPhGcAi5y7_DIx_0r1XxrmSZEk9-4E",
  });

  const [validMarkers, setValidMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredMarker, setHoveredMarker] = useState(null);

  const handleMouseOver = (marker) => {
    setHoveredMarker(marker);
  };

  const handleMouseOut = () => {
    setHoveredMarker(null);
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMarker(null);
  };

  useEffect(() => {
    setValidMarkers(
      props.content.filter((marker) => marker.latLong.length === 2)
    );
  }, [props.content]);

  return (
    <div>
      <GoogleMap
        mapContainerClassName="map-container"
        center={{ lat: 37.5652, lng: 126.9774 }}
        zoom={12}
      >
        {validMarkers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.latLong[0], lng: marker.latLong[1] }}
            title={marker.title}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", // 기본 아이콘 URL
              scaledSize: new window.google.maps.Size(40, 40), // 크기 조정
            }}
            onClick={() => handleMarkerClick(marker)}
            onMouseOver={() => handleMouseOver(marker)}
            onMouseOut={handleMouseOut}
          >
            {hoveredMarker === marker && (
              <InfoWindow
                position={marker.position}
                options={{
                  disableAutoPan: true,
                  zIndex: 100,
                }}
              >
                <div style={markerStyle.infoWindowStyle}>
                  <h3 style={markerStyle.titleStyle}>{marker.title}</h3>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
      {isModalOpen && selectedMarker && (
        <div style={modalStyle.overlay}>
          <div style={modalStyle.modal}>
            <h2>{selectedMarker.title}</h2>
            <img
              src={selectedMarker.imageLink}
              alt={selectedMarker.title}
              width="280px"
              height="280px"
              style={{ objectFit: "contain", marginBottom: "20px" }}
            />
            <p style={modalStyle.description}>
              {selectedMarker.description.replaceAll("[dot]", ".")}
            </p>
            <button onClick={closeModal} style={modalStyle.button}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const trimFilterName = (filter) => {
  let idx = filter.lastIndexOf("::");
  return filter.slice(idx + 2);
};

const idToTitle = (id) => {
  let idx = id.indexOf("-");
  return trimFilterName(id.slice(idx + 1));
};

const modalStyle = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "left",
    width: "480px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
  },
  description: {
    overflowY: "auto",
    height: "200px",
    marginBottom: "20px",
  },
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

const markerStyle = {
  infoWindowStyle: {
    padding: "10px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "200px",
  },
  titleStyle: {
    margin: "0",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
  },
};

export default PartsPage;
export {DropdownMenu, PartsListElement};
