const myId = '...'
const authKey = '...'
fetch(
  `https://api.familysearch.org/platform/tree/ancestry?person=${myId}&generations=7&marriageDetails=true&personDetails=true`,
  {
    headers: {
      Authorization: `Bearer ${authKey}`,
      Accept: "application/json"
    }
  }
);