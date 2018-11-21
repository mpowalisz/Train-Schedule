// Initialize Firebase
var config = {
  apiKey: "AIzaSyCsxIQN5h5BQDVtHExEKyzGoJM0qILiDtI",
  authDomain: "train-schedule-96151.firebaseapp.com",
  databaseURL: "https://train-schedule-96151.firebaseio.com",
  projectId: "train-schedule-96151",
  storageBucket: "train-schedule-96151.appspot.com",
  messagingSenderId: "902832211257"
};

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// Creates variables for our data
var trainName;
var destination;
var frequency;
var firstTrain;
var nextArrival;
var minAway;

// This is the click function for the form
$("#submit").on("click", function(event) {
  event.preventDefault();

  console.log("Submit was clicked");

  trainName = $("#trainName")
    .val()
    .trim();
  destination = $("#destination")
    .val()
    .trim();
  frequency = $("#frequency")
    .val()
    .trim();
  firstTrain = $("#firstTrain")
    .val()
    .trim();

  // console log data values for debugging
  console.log(trainName);
  console.log(destination);
  console.log(frequency);
  console.log(firstTrain);

  // Create object newTrain and store variable inside object.
  newTrain = {
    trainName: trainName,
    destination: destination,
    frequency: frequency,
    firstTrain: firstTrain
  };

  // Push newTrain object to db
  database.ref().push(newTrain);

  trainName = $("#trainName").val("");
  destination = $("#destination").val("");
  frequency = $("#frequency").val("");
  firstTrain = $("#firstTrain").val("");

  alert("You've added a new train!");
  $(".footer").html(
    "<audio controls autoplay>" +
      '<source src="assets/music/train.MP3" type="audio/mp3">' +
      "</audio>"
  );
});

database.ref().on("child_added", function(childSnap) {
  // Stores firstTrain value from db as a variable
  var initTrain = childSnap.val().firstTrain;
  var intFrequency = childSnap.val().frequency;
  // Use moment to verify proper format of military time
  var trainProper = moment(initTrain, "hh:mm").subtract(1, "years");
  console.log(initTrain);
  console.log(trainProper);

  // Creates a value for current time, logs as "Now"
  var currentTime = moment();
  console.log("Now: " + moment(currentTime).format("hh:mm"));

  // Computes the difference in time between trainProper and the current time.
  var difference = moment().diff(moment(trainProper), "minutes");
  console.log("Difference: " + difference);

  // Difference in frequency from time difference firstTrain/now
  var remaining = difference % intFrequency;
  console.log("Remaining: " + remaining);

  // Minutes until next train
  var minAway = intFrequency - remaining;
  console.log("minAway: " + minAway);

  // Current time plus minAway formatted for military time.
  var nextArrival = moment().add(minAway, "minutes");
  console.log("Arriving: " + moment(nextArrival).format("hh:mm"));

  // Appends new table data into the HTML. Yay!
  var newRow = $("<tr>");
  newRow.append("<td>" + childSnap.val().trainName + "</td>");
  newRow.append("<td>" + childSnap.val().destination + "</td>");
  newRow.append("<td>" + childSnap.val().frequency + "</td>");
  //Next Arrival
  newRow.append("<td>" + moment(nextArrival).format("hh:mm") + "</td>");
  //Minutes Away
  newRow.append("<td>" + minAway + "</td>");
  $("tbody").append(newRow);
});
