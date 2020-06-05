import React from "react";
// import ReactDOM from 'react-dom';
// import "./Home.css";

function buttonClick() {
  fetch(
    // "https://aerodatabox.p.rapidapi.com/flights/airports/icao/KPDX/2020-05-26T00%253A00/2020-05-25T00%253A00?withLeg=false&direction=Both",
    "https://aerodatabox.p.rapidapi.com/flights/airports/icao/KPDX/2020-05-25T10%253A00/2020-05-25T20%253A00?withLeg=false&direction=Both",
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "aerodatabox.p.rapidapi.com",
        "x-rapidapi-key": "ff1949cfaamsh7acf24456654c6fp1f1679jsn2c9d6264fded",
      },
    }
  )
    .then((response) => {
      console.log(response);
      return response.json;
    })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
}
function buttonClick2() {
  fetch("https://adsbx-flight-sim-traffic.p.rapidapi.com/api/aircraft/json/lat/45.5895/lon/-122.595172/dist/25/", {
    method: "GET",
    headers: {
      "x-rapidapi-host": "adsbx-flight-sim-traffic.p.rapidapi.com",
      "x-rapidapi-key": "ff1949cfaamsh7acf24456654c6fp1f1679jsn2c9d6264fded",
    },
  })
    .then((response) => {
      console.log(response);
      return response.json;
    })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

function buttonClick3() {
  const url = "https://swapi.dev/api/people/";
  fetch(url)
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      const people = data.results.map((x: any) => `<li>${x.name} - ${x.birth_year}</li>`);
      console.log(people);
      // results.innerHTML += people.join("");
      // fetchPeople(data.next)
    });
  // .catch((err) => (results.innerHTML = err));
}

function buttonClick4() {
  fetch("https://adsbx-flight-sim-traffic.p.rapidapi.com/api/aircraft/json/lat/45.5895/lon/-122.595172/dist/25/", {
    method: "GET",
    headers: {
      "x-rapidapi-host": "adsbx-flight-sim-traffic.p.rapidapi.com",
      "x-rapidapi-key": "ff1949cfaamsh7acf24456654c6fp1f1679jsn2c9d6264fded",
    },
  })
    .then((response) => {
      console.log(response);
      return response.json;
    })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
}
function buttonClick5() {
  fetch(
    "https://cometari-airportsfinder-v1.p.rapidapi.com/api/airports/by-radius?radius=50&lng=-157.895277&lat=21.265600",
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "cometari-airportsfinder-v1.p.rapidapi.com",
        "x-rapidapi-key": "eccc71950emsh71a3ca86e50f985p195ea4jsndc1501ca6804",
      },
    }
  )
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
}

function HomePage() {
  return (
    <div className='HomePage'>
      <h2>Home</h2>
      <button onClick={buttonClick}>Click Me</button>
      <button onClick={buttonClick2}>Click Me2</button>
      <button onClick={buttonClick3}>Click Me3</button>
      <button onClick={buttonClick4}>Click Me4</button>
      <button onClick={buttonClick5}>Click Me5</button>
    </div>
  );
}

export default HomePage;
