import "./styles/index.css";
import Main from "./pages/Main";
import PartsPage from "./pages/Parts";
import DetailPage from "./pages/Detail";
import SitemapPage from "./pages/Sitemap";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  useLocation,
} from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";

function App() {
  return (
    <LoadScript googleMapsApiKey={"AIzaSyAoKqPhGcAi5y7_DIx_0r1XxrmSZEk9-4E"}>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/facet/:facet" element={<PartsPageWrapper />} />
          <Route path="/resource/:resource" element={<DetailPageWrapper />} />
          <Route path="/sitemap" element={<SitemapPageWrapper />} />
        </Routes>
      </Router>
    </LoadScript>
  );
}

const PartsPageWrapper = () => {
  const { facet } = useParams(); // URL 파라미터 추출
  return <PartsPage facet={facet} />;
};

const DetailPageWrapper = () => {
  const { resource } = useParams(); // URL 파라미터 추출
  return <DetailPage resource={resource} />;
};

const SitemapPageWrapper = () => {
  const { search } = useLocation();
  const keyword = new URLSearchParams(search).get("keyword");
  console.log(`keyword: ${keyword}`);
  return <SitemapPage keyword={keyword} />;
};

export default App;
