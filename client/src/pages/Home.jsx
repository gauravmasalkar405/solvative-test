import { useState, useEffect, useRef } from "react";
import Table from "../components/Table";
import axios from "axios";

const Home = () => {
  // to store search term
  const [searchTerm, setSearchTerm] = useState("");
  // State to store the API response data
  const [responseData, setResponseData] = useState(null);

  // search box ref
  const searchBoxRef = useRef(null);

  // search term handle
  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  // keyboard shortcut implementation to focus on search input
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "/") {
        event.preventDefault();
        searchBoxRef.current.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Function to fetch data from the API based on the search term
  const fetchData = () => {
    const options = {
      method: "GET",
      url: "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
      params: { countryIds: "IN", namePrefix: searchTerm, limit: "5" },
      headers: {
        "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
        "x-rapidapi-key": "4ac5e3352fmshe6ac515ca3b8ccap1f0045jsnf0a504a87bbe",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        // Store the API response data in the state variable
        setResponseData(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  // Call the fetchData function whenever the searchTerm changes
  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  return (
    <div>
      <div className="home_searchbox">
        <input
          ref={searchBoxRef}
          placeholder="Search..."
          onChange={handleSearchTerm}
          value={searchTerm}
        />
      </div>
      <div className="home_table">
        <Table responseData={responseData} />
      </div>
    </div>
  );
};

export default Home;
