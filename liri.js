//****************************************
//REQUIRED FILES
//****************************************

//require dotenv to link keys file for spotify
require("dotenv").config();

//require keys.js file where secure information is stored
var keys = require("./keys.js");

//require spotify and create variable to hold keys information for spotify
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

//require inquirer for question prompting
var inquirer = require("inquirer");

//require fs for file reading and writing
var fs = require("fs");

//Require moment for date manipulation
var moment = require('moment');
moment().format();

// Include the axios npm package (Don't forget to run "npm install axios" in this folder first!)
var axios = require("axios");

//create function to call and recall set of LIRI questions
var liriAsk = function() {

  //create function to ask user if they want to do a new search
    function confirm() {

        inquirer.prompt([
                {
                    type: "confirm",
                    message: "Would you like to try a new search?",
                    name: "confirm",
                    default: false
                }
            ])
            .then(answers => {
                if (answers.confirm) {
                    liriAsk();
                }
                else {
                    console.log("Thank you for using Liri Bot!");
                }
            })
            .catch(errors => {
                console.log(`Error occurred: ${errors}`);
            });
    }
    
//setup first question to start LIRI bot. Give user 4 choices of searches to do.
    inquirer.prompt([
        {
            message: "Welcome to LIRI Bot. What would you like to search for? Choose option 1, 2, 3 or 4",
            type: "rawlist",
            name: "searchOptions",
            choices: ["Find a concert date for a favorite artist or band", "Look up details for a favorite song", "Look up details for a favorite movie", "Do What It Says"],
        },
    ])
        //grab user input if user selected concert search and ask followup question. 
        .then(function (userChoice) {
            if (userChoice.searchOptions.slice() === "Find a concert date for a favorite artist or band") {
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Which band or artist would you like to search concert dates for?",
                        name: "band",
                        default: "Gloria Estefan"
                    }
                ])

                    //grab user input from artist/band and run bandsintown search and display result to the console.
                    .then(function (userChoice) {
                        axios.get("https://rest.bandsintown.com/artists/" + userChoice.band + "/events?app_id=codingbootcamp")
                            .then(function (response) {
                                for (var i = 0; i < 5; i++) {
                                    var concertResults = "******************************************************************" +
                                        "\nVenue Name: " + response.data[i].venue.name +
                                        "\nVenue Location: " + response.data[i].venue.city +
                                        "\nDate of the Event: " + moment(response.data[i].datetime).format("MM/DD/YYYY") +
                                        "\n******************************************************************";
                                    console.log(concertResults);
                                    confirm();
                                }
                            })
                            .catch(function (error) {
                                console.log("Sorry. There are no concerts scheduled at this time");
                                confirm();
                            });
                    });

            }
            //grab user input if user selected song search and ask followup question. 

            else if (userChoice.searchOptions.slice() === "Look up details for a favorite song") {
                inquirer.prompt([
                    {
                        type: "input",
                        message: "What song would you like to get details for?",
                        name: "song",
                        default: "The Doors:Gloria"
                    }
                ])
                    //grab user input from song and run spotify search and display result to the console.

                    .then(function (userChoice) {
                        spotify.search({
                            type: "artist,track",
                            query: userChoice.song,
                        }, function (err, response) {
                            if (err) {
                                return console.log("Error occurred: " + err);
                            }
                            var spotifySearch = "******************************************************************" +
                                "\nArtist(s): " + response.tracks.items[0].artists[0].name +
                                "\nSong Name: " + response.tracks.items[0].name +
                                "\nAlbum Name: " + response.tracks.items[0].album.name +
                                "\nPreview Link: " + response.tracks.items[0].external_urls.spotify +
                                "\n******************************************************************";
                            console.log(spotifySearch);
                            confirm();
                        })
                    })
            }
            //grab user input if user selected movie search and ask followup question. 

            else if (userChoice.searchOptions.slice() === "Look up details for a favorite movie") {
                inquirer.prompt([
                    {
                        type: "input",
                        message: "What movie would you like to get details for?",
                        name: "movie",
                        default: "Wonder Woman"
                    }
                ])
                    //grab user input from movie and run OMDB movie search and display result to the console.

                    .then(function (userChoice) {
                        axios.get("http://www.omdbapi.com/?t=" + userChoice.movie + "&y=&plot=short&apikey=trilogy")
                            .then(function (response) {
                                var movieResults = "******************************************************************" +
                                    "\nTitle " + response.data.Title +
                                    "\nYear: " + response.data.Year +
                                    "\nIMDB Rating: " + response.data.Ratings[0].Value +
                                    "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value +
                                    "\nCountry: " + response.data.Country +
                                    "\nLanguage: " + response.data.Language +
                                    "\nPlot: " + response.data.Plot +
                                    "\nActors " + response.data.Actors +
                                    "\n******************************************************************";
                                console.log(movieResults);
                                confirm();

                            })
                            .catch(function (error) {
                                console.log("Sorry, there was no information available");
                                confirm();
                            });
                    })
            }
            //grab user input if user selected "Do What It Says" search and run function to readFile of random.text and show results to console. 

            else if (userChoice.searchOptions.slice() === "Do What It Says") {
                fs.readFile("random.txt", "utf8", function (error, data) {
                    if (error) {
                        return console.log(error);
                    }
                    var textArray = data.split(","); spotify.search({
                        type: "artist,track",
                        query: textArray[1],
                    }, function (err, response) {
                        if (err) {
                            return console.log("Error occurred: " + err);
                        }
                        var doWhatSays = "******************************************************************" +
                            "\nArtist(s): " + response.tracks.items[0].artists[0].name +
                            "\nSong Name: " + response.tracks.items[0].name +
                            "\nAlbum Name: " + response.tracks.items[0].album.name +
                            "\nPreview Link: " + response.tracks.items[0].external_urls.spotify +
                            "\n******************************************************************";
                        console.log(doWhatSays);
                        confirm();
                    })

                })
            }
        });

        //     Adam Ravitz   [21 hours ago]
    // @Gloria i have a function that gets fired after each search that has another prompt in it that will either fire the main liri function, or quit the app



};
liriAsk();



