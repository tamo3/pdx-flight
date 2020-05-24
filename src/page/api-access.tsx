


// fetch("https://adsbx-flight-sim-traffic.p.rapidapi.com/api/aircraft/json/lat/%7Blat%7D/lon/%7Blon%7D/dist/25/", {
// 	"method": "GET",
// 	"headers": {
// 		"x-rapidapi-host": "adsbx-flight-sim-traffic.p.rapidapi.com",
// 		"x-rapidapi-key": "ff1949cfaamsh7acf24456654c6fp1f1679jsn2c9d6264fded"
// 	}
// })
// .then(response => {
// 	console.log(response);
// })
// .catch(err => {
// 	console.log(err);
// });

// // var unirest = require("unirest");

// // var req = unirest("GET", "https://adsbx-flight-sim-traffic.p.rapidapi.com/api/aircraft/json/lat/%7Blat%7D/lon/%7Blon%7D/dist/25/");

// // req.headers({
// // 	"x-rapidapi-host": "adsbx-flight-sim-traffic.p.rapidapi.com",
// // 	"x-rapidapi-key": "ff1949cfaamsh7acf24456654c6fp1f1679jsn2c9d6264fded",
// // 	"useQueryString": true
// // });


// // req.end(function (res) {
// // 	if (res.error) throw new Error(res.error);

// // 	console.log(res.body);
// // });

// https://stackoverflow.com/questions/56577201/why-is-isolatedmodules-error-fixed-by-any-import/56577324
export {} // work around for error: "All files must be modules when the '--isolatedModules' flag is provided.  TS1208"