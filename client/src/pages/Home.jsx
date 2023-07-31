import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Home = () => {
  // to store search term
  const [searchTerm, setSearchTerm] = useState("");
  // State to store the API response data
  const [responseData, setResponseData] = useState(null);
  // State to indicate whether data is currently being fetched
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [dataLimit, setDataLimit] = useState(5);

  const [itemsPerPage, setItemsPerPage] = useState(3);

  // search box ref
  const searchBoxRef = useRef(null);

  // Handle ctrl+/ button click
  const handleCtrlSlashClick = () => {
    searchBoxRef.current.focus();
  };

  // search term handle
  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  // handle data limit change
  const handleDataLimitChange = (e) => {
    const limit = parseInt(e.target.value, 10);
    setDataLimit(limit > 10 ? 10 : limit);

    // If itemsPerPage is greater than the new dataLimit, update itemsPerPage
    if (itemsPerPage > limit) {
      setItemsPerPage(limit);
    }
  };

  // State to store the timer ID for the delayed API call
  const [timerId, setTimerId] = useState(null);

  // Function to trigger the API call after a brief delay
  const triggerApiCall = () => {
    // Clear any existing timer
    if (timerId) {
      clearTimeout(timerId);
    }

    // Set a new timer for the API call
    const newTimerId = setTimeout(() => {
      fetchData();
    }, 500); // Adjust the delay time (in milliseconds) as needed

    // Store the new timer ID
    setTimerId(newTimerId);
  };

  // keyboard shortcut implementation to focus on search bar
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

  // Function to fetch data from the API based on the search term and data limit
  const fetchData = () => {
    setLoading(true); // Set loading state to true while fetching data

    const options = {
      method: "GET",
      url: "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
      params: { countryIds: "IN", namePrefix: searchTerm, limit: dataLimit },
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

  // Call the triggerApiCall function whenever the searchTerm changes
  useEffect(() => {
    triggerApiCall();
  }, [searchTerm]);

  // Call the fetchData function whenever the dataLimit changes
  useEffect(() => {
    fetchData();
  }, [dataLimit]);

  // Calculate total pages when the API response data changes
  useEffect(() => {
    if (responseData?.data) {
      const totalDataCount = responseData.data.length;
      setTotalPages(Math.ceil(totalDataCount / itemsPerPage));
    }
  }, [responseData, itemsPerPage]);

  // Handle pagination button clicks
  const handlePaginationClick = (page) => {
    setCurrentPage(page);
  };

  // Calculate the index of the first and last data item to be displayed on the current page
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  // Get the data items to be displayed on the current page
  const dataToShow = responseData?.data?.slice(firstIndex, lastIndex);

  return (
    <div>
      <div className="home_searchbox">
        <div className="searchbox_container">
          <input
            ref={searchBoxRef}
            placeholder="Search..."
            onChange={handleSearchTerm}
            value={searchTerm}
          />
          <button className="shortcut_button" onClick={handleCtrlSlashClick}>
            ctrl+/
          </button>
        </div>
        <span>Select items per page</span>
        <input
          type="number"
          value={itemsPerPage}
          min={1}
          max={dataLimit}
          onChange={(e) => setItemsPerPage(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </div>
      <div className="home_table">
        {loading ? (
          <div className="spinner"></div>
        ) : dataToShow && dataToShow.length ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Place Name</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                {dataToShow.map((city, index) => (
                  <tr key={city.id}>
                    <td>{firstIndex + index + 1}</td>
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
            <div className="pagination_datalimit_container">
              <div className="pagination">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePaginationClick(page)}
                    className={currentPage === page ? "active" : ""}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <div className="datalimit_container">
                <span>Select data limit</span>
                <input
                  type="number"
                  min={5}
                  value={dataLimit}
                  onChange={handleDataLimitChange}
                  style={{ marginLeft: "10px" }}
                />
                {dataLimit > 10 && (
                  <span style={{ color: "red" }}> Maximum limit reached</span>
                )}
              </div>
            </div>
          </>
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
