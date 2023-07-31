import React from "react";

const Table = ({ responseData }) => {
  console.log(responseData);
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Place Name</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          {responseData &&
            responseData.data.map((city, index) => (
              <tr key={city.id}>
                <td>{index + 1}</td>
                <td>{city.name}</td>
                <td>
                  {city.country}{" "}
                  <img
                    src={`https://flagsapi.com/${city.countryCode}/flat/64.png`}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
