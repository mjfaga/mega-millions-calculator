const fetch = require("node-fetch");

function getRawJson(pageNumber) {
  return fetch(
    "https://www.megamillions.com/cmspages/utilservice.asmx/GetDrawingPagingData",
    {
      credentials: "include",
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "content-type": "application/json; charset=UTF-8",
        pragma: "no-cache",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest"
      },
      referrer:
        "https://www.megamillions.com/Winning-Numbers/Previous-Drawings.aspx",
      referrerPolicy: "no-referrer-when-downgrade",
      body: `{"pageSize":400,"startDate":"","endDate":"","pageNumber":${pageNumber}}`,
      method: "POST",
      mode: "cors"
    }
  ).then(result => {
    return result.json();
  });
}

function getAllData(drawings = [], fromPageNumber = 1) {
  return getRawJson(fromPageNumber)
    .then(json => {
      const newDrawings = JSON.parse(json.d).DrawingData;
      const allDrawings = [...drawings, ...newDrawings];

      if (newDrawings.length === 400) {
        return getAllData(allDrawings, fromPageNumber + 1);
      } else {
        return allDrawings;
      }
    })
    .catch(error => {
      console.log(error);
      throw new Error("Data fetching failed");
    });
}

function getMatchingNumbers(numbers, megaball, result) {
  const resultNumbers = [result.N1, result.N2, result.N3, result.N4, result.N5];
  const total = new Set([...resultNumbers, ...numbers]);
  const numberMatches = 10 - [...total].length;
  const megaballMatch = result.MBall === megaball;

  return [numberMatches, megaballMatch];
}

function addField(fieldName, fieldValue) {
  return results => {
    return results.map(result => {
      return {
        ...result,
        [fieldName]: fieldValue(result)
      };
    });
  };
}

function filterResults(customFilter) {
  return results => {
    return results.filter(customFilter);
  };
}

function groupResultsBy(field) {
  return results => {
    const groups = {};

    for (result of results) {
      const playDate = new Date(result.PlayDate);
      const year = playDate.toLocaleDateString("en-US", { year: "numeric" });
      groups[year] = groups[year] || [];
      groups[year].push({
        ...result
      });
    }

    return groups;
  };
}

function printResults(results) {
  console.log(results);
  return results;
}

function printGroupSummary(summaryCalculation) {
  return winners => {
    const final = Object.keys(winners).reduce((agg, key) => {
      agg[key] = summaryCalculation(winners[key]);

      return agg;
    }, {});

    console.log(final);
    return winners;
  };
}

module.exports = {
  getAllData,
  getMatchingNumbers,
  addField,
  filterResults,
  groupResultsBy,
  printResults,
  printGroupSummary
};
