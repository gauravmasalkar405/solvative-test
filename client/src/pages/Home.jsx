import { useState, useEffect, useRef } from "react";
import axios from "axios";

const Home = () => {
  // to store search term
  const [searchTerm, setSearchTerm] = useState("");
  // State to store the API response data
  const [responseData, setResponseData] = useState(null);
  // State to indicate whether data is currently being fetched
  const [loading, setLoading] = useState(false);

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
    setLoading(true); // Set loading state to true while fetching data

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
      })
      .finally(() => {
        setLoading(false); // Set loading state to false after fetching data
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
        {loading ? (
          <div className="spinner"></div>
        ) : responseData && responseData.data.length ? (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Place Name</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {responseData.data.map((city, index) => (
                <tr key={city.id}>
                  <td>{index + 1}</td>
                  <td>{city.name}</td>
                  <td>
                    {city.country}{" "}
                    <img
                      src={`https://flagsapi.com/${city.countryCode}/flat/64.png`}
                      alt={`${city.country} Flag`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No result found</div>
        )}
        {/* Display "Start searching" if search term is null/undefined/blank */}
        {!loading && !responseData && <div>Start searching</div>}
      </div>
    </div>
  );
};

export default Home;
