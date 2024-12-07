import { React, useState, useEffect } from "react";
import "../styles/style.css";
import PartsHeader from "../components/PartsHeader";
import Footer from "../components/Footer";
import axios from "axios";

const resourcePrefix = "http://platform[dot]eventpool[dot]kr/resource/";
const descriptionKey = "http://purl[dot]org/dc/elements/1[dot]1/description";
const labelKey = "http://www[dot]w3[dot]org/2000/01/rdf-schema#label";
const latLongKey = "http://www[dot]w3[dot]org/2003/01/geo/wgs84_pos#lat_long";

const DetailPage = (props) => {
  const resource = props.resource;

  const [data, setData] = useState(null);

  const handleVideoClick = (videoUrl) => {
    if (videoUrl) {
      window.open(videoUrl, "_blank");
    }
  };

  const getAttributeFromData = (data) => {
    if (!data) return [];
    const doc = data.doc;
    const displayOnBottom = data["order_info"][
      resourcePrefix + "displayOnBottom"
    ]["@list"].map((v) => v["@id"]);
    const attributeData = displayOnBottom
      .filter((v) => {
        if (doc[v]) return v;
      })
      .map((v) => {
        let obj = {};
        if (Array.isArray(doc[v])) {
          let arr = doc[v].map((item) => {
            if (item["@value"]) {
              return item["@value"];
            }
          });
          obj[v.replace(resourcePrefix, "")] = arr;
        } else if (typeof doc[v] === "object") {
          obj[v.replace(resourcePrefix, "")] = [doc[v]["@value"]];
        }
        return obj;
      });

    return attributeData;
  };

  const getLinkFromData = (data) => {
    if (!data) return [];
    const doc = data.doc;
    const displayOnMiddle = data["order_info"][
      resourcePrefix + "displayOnMiddle"
    ]["@list"].map((v) => v["@id"]);
    const linkData = displayOnMiddle
      .filter((v) => {
        if (doc[v]) return v;
      })
      .map((v) => {
        let obj = {};
        if (Array.isArray(doc[v])) {
          let arr = doc[v].map((item) => {
            if (item["@id"]) {
              return item["@id"];
            }
          });
          obj[v.replace(resourcePrefix, "")] = arr;
        } else if (typeof doc[v] === "object") {
          obj[v.replace(resourcePrefix, "")] = [doc[v]["@id"]];
        }
        return obj;
      });

    return linkData;
  };

  const getLocationFromData = (data) => {
    if (!data) return [];
    const doc = data.doc;
    const locationData = doc[latLongKey]
      ? doc[latLongKey]["@value"].replaceAll("[dot]", ".").split(",")
      : [];

    return locationData;
  };

  const getCompanyInfoFromData = (data) => {
    if (!data) return [];
    const doc = data.doc;
    const displayOnCompany = data["order_info"][
      resourcePrefix + "displayOnCompany"
    ]["@list"].map((v) => v["@id"]);
    const companyData = displayOnCompany
      .filter((v) => {
        if (doc[v]) return v;
      })
      .map((v) => {
        let obj = {};
        if (Array.isArray(doc[v])) {
          let arr = doc[v].map((item) => {
            if (item["@value"]) {
              return item["@value"];
            }
          });
          obj[v.replace(resourcePrefix, "")] = arr;
        } else if (typeof doc[v] === "object") {
          obj[v.replace(resourcePrefix, "")] = [doc[v]["@value"]];
        }
        // obj[v.replace(resourcePrefix, "")] = doc[v]["@value"];
        return obj;
      });

    return companyData;
  };

  const getImageFromData = () => {
    if (!data) return "/assets/empty.gif";

    const doc = data.doc;
    if (doc[resourcePrefix + "그림"]) {
      return doc[resourcePrefix + "그림"]["@value"].replaceAll("[dot]", ".");
    }

    return "/assets/empty.gif";
  };

  const getVideoFromData = () => {
    if (!data) return "";

    const doc = data.doc;
    if (doc[resourcePrefix + "topic_clip"]) {
      return doc[resourcePrefix + "topic_clip"]["@value"].replaceAll(
        "[dot]",
        "."
      );
    }

    return "";
  };

  const getDescriptionFromData = () => {
    if (!data) return "";

    let desc = "";

    const doc = data.doc;
    if (doc[descriptionKey]) {
      desc =
        doc[descriptionKey]?.[0]?.["@value"] ||
        doc[descriptionKey]?.["@value"] ||
        "";
    } else if (doc[`${resourcePrefix}설명`]) {
      desc =
        doc[`${resourcePrefix}설명`]?.["@value"] ||
        doc[`${resourcePrefix}설명`] ||
        "";
    }

    desc = desc.replace(/\[dot\]/g, ".");
    if (data.skos_concept) {
      data.skos_concept.forEach((item) => {
        if (item[labelKey] && item[labelKey]["@value"] !== "공연예술") {
          const replaceSKOS = item[labelKey]["@value"];
          const SKOSdescription = item.description?.["@value"] || replaceSKOS;
          desc = desc.replace(
            replaceSKOS,
            `<a href="/resource/${replaceSKOS}" style="color:#ff3399;cursor:pointer;" data-toggle="tooltip" data-placement="bottom" title="${SKOSdescription}">${replaceSKOS}</a>`
          );
        }
      });
    }
    if (data.skos_name_filter) {
      data.skos_name_filter.forEach((item) => {
        const replaceSKOS = item.label["@value"];
        const SKOSdescription = item.description?.["@value"] || replaceSKOS;
        desc = desc.replace(
          replaceSKOS,
          `<a href="/resource/${replaceSKOS}" style="color:#378936;cursor:pointer;" data-toggle="tooltip" data-placement="bottom" title="${SKOSdescription}">${replaceSKOS}</a>`
        );
      });
    }

    return desc;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `http://platform2.eventpool.kr/api/resource/${resource}`;
        const response = await axios.get(url);

        if (response.status === 200) {
          setData(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        // console.log("done");
      }
    };

    fetchData();
  }, [resource]);

  return (
    <div>
      <PartsHeader />
      <main className="parts-main-container">
        <h1 className="text-black text-xl font-700 text-center mb-5">
          {resource.replaceAll("_", " ").replaceAll("[dot]", ".")}
        </h1>
        <article
          className="product-info-container"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <img
            className="product-main-img"
            src={getImageFromData()}
            alt={resource}
            width="1464"
            height="848"
            loading="eager"
          />
          {getVideoFromData().length > 0 && (
            <button
              className="product-video-btn"
              onClick={() => handleVideoClick(getVideoFromData())}
              disabled={getVideoFromData().length === 0}
            >
              <img
                src="/play.png"
                alt="재생"
                width="160"
                height="160"
                loading="eager"
                id="play-img"
              />
              영상 보기
            </button>
          )}
          <section style={{ width: "80%" }}>
            <h2>설명</h2>
            <p
              style={{ whiteSpace: "pre-line" }}
              dangerouslySetInnerHTML={{ __html: getDescriptionFromData() }}
            />
          </section>
          <PageBottom
            attributeData={getAttributeFromData(data)}
            companyData={getCompanyInfoFromData(data)}
            linkData={getLinkFromData(data)}
            locData={getLocationFromData(data)}
            doc={data ? data.doc : {}}
            displayOnLabel={data ? data.display_on_label : {}}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default DetailPage;

const PageBottom = (props) => {
  const doc = props.doc;
  const attributeData = props.attributeData;

  const [activeTab, setActiveTab] = useState("context");
  const tabInfo = {
    context: {
      name: "연계탐색",
      data: props.linkData,
    },
    spec: {
      name: "제품사양",
      data: attributeData,
    },
    company: {
      name: "생산자정보",
      data: props.companyData,
    },
    location: {
      name: "위치정보",
      data: props.locData,
    },
    gallery: {
      name: "갤러리",
      data: doc[`${resourcePrefix}기록물페이지`],
    },
  };

  return (
    <aside
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div className="product-info-aside-container">
        {Object.keys(tabInfo)
          .filter((tab) => tabInfo[tab].data && tabInfo[tab].data.length > 0)
          .map((tab) => (
            <button
              key={tab}
              data-active={activeTab === tab ? "true" : "false"}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tabInfo[tab].name}
            </button>
          ))}
      </div>
      {activeTab === "spec" && attributeData.length > 0 ? (
        <ProductInfoSpec
          attributeData={attributeData}
          resource={resourcePrefix}
          dol={doc}
          domc={doc}
        />
      ) : activeTab === "company" && props.companyData.length > 0 ? (
        <ProductInfoCompany
          companyData={props.companyData}
          doc={doc}
          displayOnLabel={props.displayOnLabel}
        />
      ) : activeTab === "context" && props.linkData.length > 0 ? (
        <ProductInfoLinks
          linkData={props.linkData}
          doc={doc}
          displayOnLabel={props.displayOnLabel}
          displayOnMovieClip={props.displayOnMovieClip}
        />
      ) : activeTab === "location" && doc ? (
        <ProductInfoLocation locData={props.locData} />
      ) : activeTab === "gallery" &&
        doc[`${resourcePrefix}기록물페이지`] &&
        doc[`${resourcePrefix}기록물페이지`].length > 0 ? (
        <ProductInfoPhotoGallery doc={doc} />
      ) : (
        <div>
          <h1>Not implemented yet</h1>
        </div>
      )}
    </aside>
  );
};

const ProductInfoSpec = (props) => {
  const resource = props.resource;
  const dol = props.dol;
  const domc = props.domc;

  const extract_key_value = (data) => {
    if (!data) return [];
    let key = Object.keys(data)[0]
      .replaceAll(resource, "")
      .replaceAll("[dot]", ".");
    let values = data[key].map((v) => v.replaceAll("[dot]", "."));
    return [key, values];
  };

  const renderContent = () => {
    return props.attributeData.map((attr, index) => {
      let data = extract_key_value(attr);
      const key = data[0];
      const values = data[1];

      if (key === "Youtube") {
        return (
          <dl key={index}>
            <dt>Youtube</dt>
            <dd>
              <iframe
                src={`https://www.youtube.com/embed/${values[0]}?controls=0&showinfo=0&rel=0&autoplay=1&loop=1&playlist=${values[0]}`}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </dd>
          </dl>
        );
      }

      return (
        <dl key={index}>
          <dt>{key}</dt>
          <dd>
            {values.map((value, valueIndex) => {
              if (value.startsWith("http")) {
                return (
                  <a
                    key={valueIndex}
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {value}
                  </a>
                );
              }

              return <p key={valueIndex}>{value}</p>;
            })}
          </dd>
        </dl>
      );
    });
  };

  return (
    <div className="product-info-aside-content">
      <div>{renderContent()}</div>
    </div>
  );
};

//       if (key === "Youtube") {
//         return (
//           <dl key={index}>
//             <dt>Youtube</dt>
//             <dd>
//               <iframe
//                 src={`https://www.youtube.com/embed/${value}?controls=0&showinfo=0&rel=0&autoplay=1&loop=1&playlist=${value}`}
//                 frameBorder="0"
//                 allowFullScreen
//               ></iframe>
//             </dd>
//           </dl>
//         );
//       }

//       if (key.startsWith("http")) {
//         return (
//           <dl key={index}>
//             <dt>{key}</dt>
//             <dd>
//               <a href={value} target="_blank" rel="noopener noreferrer">
//                 {value}
//               </a>
//             </dd>
//           </dl>
//         );
//       }

//       return (
//         <dl key={index}>
//           <dt>{key}</dt>
//           <dd>{value}</dd>
//         </dl>
//       );
//     });
//   };

//   return (
//     <div className="product-info-aside-content">
//       <div>{renderContent()}</div>
//     </div>
//   );
// };

const ProductInfoCompany = (props) => {
  const doc = props.doc;
  const displayOnLabel = props.displayOnLabel || {};

  const renderContent = () => {
    return props.companyData.map((item, index) => {
      const key = Object.keys(item)[0];
      const values = item[key];

      return (
        <dl key={index}>
          <dt>{displayOnLabel[key] ? displayOnLabel[key] : key}</dt>
          <dd>
            {values.map((value, valueIndex) => {
              const httpChgdot = value?.replace(/\[dot\]/g, ".") || "";
              if (httpChgdot.startsWith("http")) {
                return (
                  <a
                    key={valueIndex}
                    href={httpChgdot}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {httpChgdot}
                  </a>
                );
              }

              return <p key={valueIndex}>{httpChgdot}</p>;
            })}
          </dd>
        </dl>
      );
    });
  };

  return (
    <div className="product-info-aside-content">
      <div>{renderContent()}</div>
    </div>
  );
};

const ProductInfoLinks = (props) => {
  const doc = props.doc;
  const displayOnLabel = props.displayOnLabel;
  const displayOnMovieClip = props.displayOnMovieClip;
  const renderContent = () => {
    return props.linkData.map((item, index) => {
      const key = Object.keys(item)[0] || "";
      const values = item[key] || [];

      let keyUrl = key.replace(/\[dot\]/g, ".");
      let keyWord = keyUrl.replace(resourcePrefix, "").replace(/\[dot\]/g, ".");

      return (
        <dl key={index}>
          <dt>{displayOnLabel[keyUrl] ? displayOnLabel[keyUrl] : keyWord}</dt>
          <dd
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "right",
              gap: "5px",
            }}
          >
            {values.map((value, valueIndex) => {
              let valueWord = value.replace(resourcePrefix, "");
              let valueUrl = value
                .replace(/\[dot\]/g, ".")
                .replace(
                  "http://platform.eventpool.kr/resource/",
                  "/resource/"
                );

              if (valueUrl != "") {
                return (
                  <a
                    key={valueIndex}
                    href={valueUrl}
                  >
                    <p>{valueWord}</p>
                  </a>
                );
              }

              return <p key={valueIndex}>{valueWord}</p>;
            })}
          </dd>
        </dl>
      );

      // let keyUrl = key.replace(/\[dot\]/g, ".");
      // let valueUrl = value.replace(/\[dot\]/g, ".");

      // let keyWord = key.replaceAll(resourcePrefix, "");
      // let valueWord = value.replaceAll(resourcePrefix, "");

      // if (keyUrl.match(/https?:\/\/[\w\-\.]+/g)) {
      //   return (
      //     <dl key={index}>
      //       <dt>
      //         <a href={keyUrl} target="_blank" rel="noopener noreferrer">
      //           {keyWord}
      //         </a>
      //       </dt>
      //       <dd>
      //         <a href={valueUrl} target="_blank" rel="noopener noreferrer">
      //           {valueWord}
      //         </a>
      //       </dd>
      //     </dl>
      //   );
      // }

      // return (
      //   <dl key={index}>
      //     <dt>{displayOnLabel[keyUrl] ? displayOnLabel[keyUrl] : keyWord}</dt>
      //     <dd>
      //       <a href={valueUrl}>{valueWord}</a>
      //     </dd>
      //   </dl>
      // );
    });
  };

  return (
    <div className="product-info-aside-content">
      <div>{renderContent()}</div>
    </div>
  );
};

const ProductInfoPhotoGallery = (props) => {
  const photos = props.doc ? props.doc[`${resourcePrefix}기록물페이지`] : [];

  const [activeIndex, setActiveIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div className="product-info-aside-content-gallery">
        <p>갤러리가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="product-info-aside-content-gallery">
      <div className="gallery-wrapper">
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="3"
            stroke="currentColor"
            className="size-6"
            onClick={() =>
              setActiveIndex((activeIndex - 1 + photos.length) % photos.length)
            }
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <div className="gallery-preview-container">
          {photos.map((photo, index) => {
            return (
              <img
                key={index}
                className="gallery-preview-img"
                src={photo["@value"].replace(/\[dot\]/g, ".")}
                alt="gallery"
                loading="lazy"
                onClick={() => setActiveIndex(index)}
              />
            );
          })}
        </div>
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="3"
            stroke="currentColor"
            className="size-6"
            onClick={() => setActiveIndex((activeIndex + 1) % photos.length)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
        <div className="gallery-content">
          <img
            src={photos[activeIndex]["@value"].replace(/\[dot\]/g, ".")}
            alt="gallery"
            width="1464"
            height="848"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

const ProductInfoLocation = (props) => {
  const locData = props.locData;

  console.log(locData);

  return (
    <div className="product-info-aside-content-gallery">
      <iframe
        title="map"
        src={`https://maps.google.com/?ll=${locData[0]},${locData[1]}&z=16&output=embed`}
        width="100%"
        height="500px"
        frameBorder="0"
        style={{
          border: 0,
          // width: "100%",
          // height: "100%",
          // minHeight: "400px",
        }}
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
  );
};
