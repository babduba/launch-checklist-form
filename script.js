// Write your JavaScript code here!
let missionDestinations = "";

async function getMissionDestinations() {
      let missionDestinationsUrl = "https://handlers.education.launchcode.org/static/planets.json";
      try {
            let missionDestinationResponse = await fetch(missionDestinationsUrl);
            return await missionDestinationResponse.json();
      } catch (error) {
            console.log(error);
      }
}

async function populateMissionDestinationSelector() {
      missionDestinations = await getMissionDestinations();
      let missionSelector = document.getElementById("missionDestinationSelector");
      let missionDestination;

      missionDestinations.forEach(destination => {
            missionDestination = document.createElement("option");
            missionDestination.value = missionDestinations.indexOf(destination);
            missionDestination.innerHTML = destination.name;
            missionSelector.appendChild(missionDestination);
      });
}

function missionDestinationSelector_onChange(missionDestinationSelectorValue) {
      let missionTarget = document.getElementById("missionTarget");
      let  missionDestinationHtml= `
      <h2>Mission Destination</h2>
      <ol>
            <li>Name: ${missionDestinations[missionDestinationSelectorValue].name}</li>
            <li>Diameter: ${missionDestinations[missionDestinationSelectorValue].diameter}</li>
            <li>Star: ${missionDestinations[missionDestinationSelectorValue].star}</li>
            <li>Distance from Earth: ${missionDestinations[missionDestinationSelectorValue].distance}</li>
            <li>Number of Moons: ${missionDestinations[missionDestinationSelectorValue].moons}</li>
      </ol>
      <img src="${missionDestinations[missionDestinationSelectorValue].image}"></img>
      `
      ;
      missionTarget.innerHTML = missionDestinationHtml;

      faultyItems.style.visibility = "hidden";
      launchStatus("launchStatus", "Awaiting Information Before Launch", "black");

}

function validateForm() {
      let validationMessage = [];
      let faultyItemValue = "Is empty";
      let inputLabel = "";
      let itemStatusId = "";
      const form = document.getElementById("form");
      Array.prototype.forEach.call(form.elements, function(element) {
            if (element.required) {
                  itemStatusId = getItemStatusId(element.name);
                  inputLabel = getLableName(element.name);

                  if (element.checkValidity()) {
                        launchStatus(itemStatusId, `${inputLabel}: ${element.value} is ready for launch`);

                  } else {
                        
                        if (element.value === "" || element.value === null || element.value === undefined) {
                              faultyItemValue = "Is empty";
                        } else {
                              faultyItemValue = element.value;
                        }
                        validationMessage.push(`${inputLabel}: ${faultyItemValue} - ${element.validationMessage}`);
                        launchStatus(itemStatusId, `${inputLabel}: ${faultyItemValue} - ${element.validationMessage}`);              
                  }
            }

      });

      if (validationMessage.length > 0) {
            form.addEventListener("submit", function(event) {
                  event.preventDefault();
            });
            alert((validationMessage.join("\n")));
            
            launchStatus("launchStatus", "Shuttle not ready for launch", "red");

      }   else {
            launchStatus("launchStatus", "Shuttle is ready for launch", "green");
            // This line shouldn't be there if the form is actually submiting.
            form.addEventListener("submit", function(event) {
                  event.preventDefault();
            });

      }
      
      faultyItems.style.visibility = "visible"

}
function getLableName (inputName) {
      const labelNames = document.getElementById("form").getElementsByTagName("label");
      for (let i = 0; i < labelNames.length; i++){
            if ((labelNames[i].htmlFor) === inputName) {
                  return (labelNames[i].innerHTML);
            }
      }
}

function getItemStatusId(inputName) {
      const itemStatusIdCollection = document.getElementById("faultyItems").getElementsByTagName("li");
      let itemStatusIdArray = [];
      let itemStatusPattern = inputName.slice(0,4);
      let itemStatusId = [];
      for (let i = 0; i < itemStatusIdCollection.length; i++) {
            itemStatusIdArray.push(itemStatusIdCollection[i].id);
      }
      itemStatusId = itemStatusIdArray.filter(function (str) { return str.includes(itemStatusPattern);});
      return itemStatusId[0];
}
function launchStatus(elementId, textValue, elementColor="black") {
      let statusElement = document.getElementById(elementId);
      statusElement.innerHTML = textValue;
      statusElement.style.color=elementColor;
}


function init () { 
      populateMissionDestinationSelector();
}
window.onload = init;