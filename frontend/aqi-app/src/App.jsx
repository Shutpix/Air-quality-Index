import AqiHeader from "./components/AqiHeader";
import AqiSearch from "./components/AqiSearch";
import CachedCityList from "./components/CachedCityList";

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <AqiHeader/>
      <AqiSearch />
      <CachedCityList />
    </div>
  );
}

export default App;
