//https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("sw.js", {
        scope: "/",
      });
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

// …

registerServiceWorker();

window.onload = function () {
  if (document.URL.includes("currency_converter.html")) {
    getCurrentExchangeRate();
  }

  if (document.URL.includes("forecaster.html")) {
    initializeChart(d7dwData, d7duData, d7dtData, d7dvData);
  }
};

const longformMessageChecker = () => {
  let messageBox = document.getElementById("longform-message");
  let feedbackMessage = document.getElementById(
    "longform-message-feedback-label"
  );
  let currentLength = messageBox.value.length;
  let maxLength = messageBox.maxLength;

  let differential = maxLength - currentLength;
  feedbackMessage.textContent = "Characters remaining: " + differential;
};

async function getCurrentExchangeRate() {
  let baseURL = "https://www.floatrates.com/daily/";
  let currency = document.getElementById("input-currency").value;
  //grab the output contents of the dropdown - this is what we search the JSON using
  //e.g. if contents is EUR, we look for the euros code
  let outputCurrency = document.getElementById("output-currency").value;

  let feedbackMessage = document.getElementById("currency-converter-feedback");
  //do some error handling
  //firstly, check if we even need to do the calc - we could be offline
  if (navigator.onLine == false) {
    feedbackMessage.innerText =
      "You don't seem to have an internet connection. Please check your connection and try again.";
    feedbackMessage.style.color = "red";
    return;
  }
  if (currency === outputCurrency) {
    return;
  }
  //append input to baseURL + .json
  baseURL = baseURL + currency + ".json";
  //this is our json address
  //e.g. http://www.floatrates.com/daily/usd.json
  const response = await fetch(baseURL)
    .then((response) => response.json())
    .then((response) =>
      parseCurrentExchangeRate(response, currency, outputCurrency)
    );
}

async function parseCurrentExchangeRate(
  response,
  inputCurrency,
  outputCurrency
) {
  let rate = response[outputCurrency].rate;
  let date = response[outputCurrency].date;
  let feedbackMessage = document.getElementById(
    "currency-converter-exchange-rate"
  );

  //grab current date for timestamp
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  options.timeZone = "GMT";
  options.timeZoneName = "short";
  // const dateNow = new Date().toLocaleDateString('en-GB', options);
  const dateNow = new Date();
  feedbackMessage.innerText = `1 ${inputCurrency.toUpperCase()} = ${rate} ${outputCurrency.toUpperCase()}.
    Price last updated on: ${date}.
    You checked this on: ${dateNow} `;
}

//currency converter
async function getFloatRatesData() {
  let baseURL = "https://www.floatrates.com/daily/";
  //grab the input contents of the dropdown
  let inputCurrency = document.getElementById("input-currency").value;
  //grab the output contents of the dropdown - this is what we search the JSON using
  //e.g. if contents is EUR, we look for the euros code
  let outputCurrency = document.getElementById("output-currency").value;
  let feedbackMessage = document.getElementById("currency-converter-feedback");
  //do some error handling

  //firstly, check if we even need to do the calc - we could be offline
  if (navigator.onLine == false) {
    feedbackMessage.innerText =
      "You don't seem to have an internet connection. Please check your connection and try again.";
    feedbackMessage.style.color = "red";
    return;
  }
  //ensure the currencies aren't the same - we can't convert from one to the other!
  if (inputCurrency === outputCurrency) {
    feedbackMessage.innerText =
      "Ensure input and output currency are different and try again.";
    feedbackMessage.style.color = "red";
    return;
  }
  let inputCurrencyValue = parseInt(
    document.getElementById("input-currency-value").value
  );
  let maxInputValue = parseInt(
    document.getElementById("input-currency-value").max
  );
  if (isNaN(inputCurrencyValue)) {
    feedbackMessage.innerText = "Ensure input is a valid number.";
    feedbackMessage.style.color = "red";
    return;
  }
  if (inputCurrencyValue <= 0 || inputCurrencyValue > maxInputValue) {
    feedbackMessage.innerText = `Ensure input currency is greater than 0 and less than ${maxInputValue}`;
    feedbackMessage.style.color = "red";
    return;
  }
  //no errors! Ensure feedback message is nulled for future interactions.
  feedbackMessage.innerText = "";
  //append input to baseURL + .json
  baseURL = baseURL + inputCurrency + ".json";
  //this is our json address
  //e.g. http://www.floatrates.com/daily/usd.json
  const response = await fetch(baseURL)
    .then((response) => response.json())
    .then((response) =>
      parseFloatRatesData(
        response,
        inputCurrencyValue,
        inputCurrency,
        outputCurrency
      )
    );

  //we can then return whats inside the name, rate, date
  //if we wanted to, we could grab the inverse to save some cpu time if the user wants to switch
}

function parseFloatRatesData(
  response,
  inputCurrencyValue,
  inputCurrency,
  outputCurrency
) {
  //at this point, the whole json for all of usd is stored in response
  //we only need the key equal to our output currency
  const dateNow = new Date();
  let rate = response[outputCurrency].rate;
  let output = document.getElementById("output-currency-value");
  output.innerText = `${inputCurrencyValue}${inputCurrency.toUpperCase()} = ${
    inputCurrencyValue * rate
  }${outputCurrency.toUpperCase()}. 
    You checked this on: ${dateNow}`;
}

let chartMode = 0;

let historicLabels = [
  "1996 January",
  "1996 February",
  "1996 March",
  "1996 April",
  "1996 May",
  "1996 June",
  "1996 July",
  "1996 August",
  "1996 September",
  "1996 October",
  "1996 November",
  "1996 December",
  "1997 January",
  "1997 February",
  "1997 March",
  "1997 April",
  "1997 May",
  "1997 June",
  "1997 July",
  "1997 August",
  "1997 September",
  "1997 October",
  "1997 November",
  "1997 December",
  "1998 January",
  "1998 February",
  "1998 March",
  "1998 April",
  "1998 May",
  "1998 June",
  "1998 July",
  "1998 August",
  "1998 September",
  "1998 October",
  "1998 November",
  "1998 December",
  "1999 January",
  "1999 February",
  "1999 March",
  "1999 April",
  "1999 May",
  "1999 June",
  "1999 July",
  "1999 August",
  "1999 September",
  "1999 October",
  "1999 November",
  "1999 December",
  "2000 January",
  "2000 February",
  "2000 March",
  "2000 April",
  "2000 May",
  "2000 June",
  "2000 July",
  "2000 August",
  "2000 September",
  "2000 October",
  "2000 November",
  "2000 December",
  "2001 January",
  "2001 February",
  "2001 March",
  "2001 April",
  "2001 May",
  "2001 June",
  "2001 July",
  "2001 August",
  "2001 September",
  "2001 October",
  "2001 November",
  "2001 December",
  "2002 January",
  "2002 February",
  "2002 March",
  "2002 April",
  "2002 May",
  "2002 June",
  "2002 July",
  "2002 August",
  "2002 September",
  "2002 October",
  "2002 November",
  "2002 December",
  "2003 January",
  "2003 February",
  "2003 March",
  "2003 April",
  "2003 May",
  "2003 June",
  "2003 July",
  "2003 August",
  "2003 September",
  "2003 October",
  "2003 November",
  "2003 December",
  "2004 January",
  "2004 February",
  "2004 March",
  "2004 April",
  "2004 May",
  "2004 June",
  "2004 July",
  "2004 August",
  "2004 September",
  "2004 October",
  "2004 November",
  "2004 December",
  "2005 January",
  "2005 February",
  "2005 March",
  "2005 April",
  "2005 May",
  "2005 June",
  "2005 July",
  "2005 August",
  "2005 September",
  "2005 October",
  "2005 November",
  "2005 December",
  "2006 January",
  "2006 February",
  "2006 March",
  "2006 April",
  "2006 May",
  "2006 June",
  "2006 July",
  "2006 August",
  "2006 September",
  "2006 October",
  "2006 November",
  "2006 December",
  "2007 January",
  "2007 February",
  "2007 March",
  "2007 April",
  "2007 May",
  "2007 June",
  "2007 July",
  "2007 August",
  "2007 September",
  "2007 October",
  "2007 November",
  "2007 December",
  "2008 January",
  "2008 February",
  "2008 March",
  "2008 April",
  "2008 May",
  "2008 June",
  "2008 July",
  "2008 August",
  "2008 September",
  "2008 October",
  "2008 November",
  "2008 December",
  "2009 January",
  "2009 February",
  "2009 March",
  "2009 April",
  "2009 May",
  "2009 June",
  "2009 July",
  "2009 August",
  "2009 September",
  "2009 October",
  "2009 November",
  "2009 December",
  "2010 January",
  "2010 February",
  "2010 March",
  "2010 April",
  "2010 May",
  "2010 June",
  "2010 July",
  "2010 August",
  "2010 September",
  "2010 October",
  "2010 November",
  "2010 December",
  "2011 January",
  "2011 February",
  "2011 March",
  "2011 April",
  "2011 May",
  "2011 June",
  "2011 July",
  "2011 August",
  "2011 September",
  "2011 October",
  "2011 November",
  "2011 December",
  "2012 January",
  "2012 February",
  "2012 March",
  "2012 April",
  "2012 May",
  "2012 June",
  "2012 July",
  "2012 August",
  "2012 September",
  "2012 October",
  "2012 November",
  "2012 December",
  "2013 January",
  "2013 February",
  "2013 March",
  "2013 April",
  "2013 May",
  "2013 June",
  "2013 July",
  "2013 August",
  "2013 September",
  "2013 October",
  "2013 November",
  "2013 December",
  "2014 January",
  "2014 February",
  "2014 March",
  "2014 April",
  "2014 May",
  "2014 June",
  "2014 July",
  "2014 August",
  "2014 September",
  "2014 October",
  "2014 November",
  "2014 December",
  "2015 January",
  "2015 February",
  "2015 March",
  "2015 April",
  "2015 May",
  "2015 June",
  "2015 July",
  "2015 August",
  "2015 September",
  "2015 October",
  "2015 November",
  "2015 December",
  "2016 January",
  "2016 February",
  "2016 March",
  "2016 April",
  "2016 May",
  "2016 June",
  "2016 July",
  "2016 August",
  "2016 September",
  "2016 October",
  "2016 November",
  "2016 December",
  "2017 January",
  "2017 February",
  "2017 March",
  "2017 April",
  "2017 May",
  "2017 June",
  "2017 July",
  "2017 August",
  "2017 September",
  "2017 October",
  "2017 November",
  "2017 December",
  "2018 January",
  "2018 February",
  "2018 March",
  "2018 April",
  "2018 May",
  "2018 June",
  "2018 July",
  "2018 August",
  "2018 September",
  "2018 October",
  "2018 November",
  "2018 December",
  "2019 January",
  "2019 February",
  "2019 March",
  "2019 April",
  "2019 May",
  "2019 June",
  "2019 July",
  "2019 August",
  "2019 September",
  "2019 October",
  "2019 November",
  "2019 December",
  "2020 January",
  "2020 February",
  "2020 March",
  "2020 April",
  "2020 May",
  "2020 June",
  "2020 July",
  "2020 August",
  "2020 September",
  "2020 October",
  "2020 November",
  "2020 December",
  "2021 January",
  "2021 February",
  "2021 March",
  "2021 April",
  "2021 May",
  "2021 June",
  "2021 July",
  "2021 August",
  "2021 September",
  "2021 October",
  "2021 November",
  "2021 December",
  "2022 January",
  "2022 February",
  "2022 March",
  "2022 April",
  "2022 May",
  "2022 June",
  "2022 July",
  "2022 August",
];

let forecastLabels = [
  "2022 September",
  "2022 October",
  "2022 November",
  "2022 December",
  "2023 January",
  "2023 February",
  "2023 March",
  "2023 April",
  "2023 May",
  "2023 June",
  "2023 July",
  "2023 August",
];
let d7dwData = [
  45.4, 45.4, 45.4, 45.4, 44.0, 43.8, 43.9, 43.9, 44.8, 45.7, 46.1, 46.1, 46.2,
  46.2, 46.1, 46.0, 44.7, 44.5, 44.6, 44.4, 44.3, 45.9, 45.9, 45.9, 45.9, 45.9,
  45.9, 45.9, 44.8, 44.9, 45.1, 45.1, 45.4, 46.9, 47.0, 47.0, 47.0, 47.0, 47.0,
  47.1, 46.0, 45.9, 45.9, 45.9, 46.3, 47.4, 47.6, 47.7, 47.8, 47.7, 47.8, 47.7,
  46.5, 46.2, 46.1, 46.2, 47.1, 48.6, 49.0, 49.1, 49.3, 49.1, 49.1, 49.1, 48.6,
  48.4, 48.1, 48.2, 50.6, 51.9, 52.2, 52.3, 52.3, 52.3, 52.4, 52.4, 51.6, 51.4,
  51.4, 51.3, 52.2, 53.2, 53.7, 53.6, 53.5, 53.5, 53.6, 53.2, 52.7, 52.6, 52.6,
  52.6, 53.3, 54.4, 54.5, 54.5, 54.7, 54.9, 54.8, 54.8, 54.4, 54.3, 54.6, 55.5,
  56.9, 59.1, 59.8, 60.4, 60.6, 61.1, 61.2, 61.2, 60.6, 60.4, 60.3, 61.1, 61.7,
  64.4, 65.0, 65.2, 65.3, 65.3, 65.4, 65.5, 66.2, 64.9, 64.8, 65.4, 66.2, 69.6,
  70.4, 70.4, 70.5, 70.7, 70.7, 70.7, 70.4, 70.0, 69.9, 70.0, 70.8, 72.9, 74.2,
  75.7, 76.6, 77.0, 77.3, 77.5, 79.1, 80.7, 81.5, 82.4, 89.8, 98.2, 99.0, 99.9,
  101.0, 101.1, 101.0, 101.0, 99.3, 98.5, 97.7, 98.3, 98.5, 100.6, 101.4, 101.5,
  101.4, 101.5, 101.5, 101.5, 99.1, 97.8, 96.9, 97.6, 98.1, 101.0, 101.6, 102.2,
  103.1, 104.0, 103.7, 104.1, 102.7, 102.5, 102.7, 102.8, 103.4, 109.1, 109.9,
  110.1, 110.2, 109.5, 110.0, 110.0, 107.7, 106.8, 107.2, 107.0, 107.5, 108.4,
  108.9, 109.4, 109.5, 109.8, 109.2, 109.2, 109.4, 109.3, 109.6, 109.5, 110.1,
  111.4, 112.4, 112.6, 113.3, 113.3, 113.2, 113.4, 112.5, 112.3, 112.1, 111.9,
  112.5, 114.6, 114.8, 114.8, 114.6, 114.6, 114.8, 114.9, 112.5, 112.1, 112.0,
  112.0, 112.4, 113.8, 114.1, 114.1, 114.1, 114.2, 114.0, 114.2, 112.8, 111.9,
  111.0, 111.1, 112.0, 114.0, 114.8, 115.4, 115.7, 116.2, 116.2, 116.3, 114.8,
  114.5, 114.4, 114.4, 114.4, 116.8, 118.0, 118.4, 118.6, 118.6, 119.0, 118.8,
  115.6, 115.3, 116.0, 116.2, 115.8, 120.0, 119.1, 121.5, 121.5, 121.6, 121.9,
  119.9, 120.9, 121.6, 121.3, 120.5, 121.0, 122.8, 125.8, 126.4, 125.3, 126.7,
  126.7, 126.6, 126.6, 126.4, 126.9, 125.9, 127.0, 128.8, 130.6, 130.2, 130.3,
  130.1, 130.3, 130.4, 130.3, 130.6, 130.6, 130.5, 131.2, 132.6, 133.1, 136.8,
  137.5, 140.0, 144.9, 147.8, 152.0, 159.8, 165.8, 169.5,
];

let d7duData = [
  43.3, 43.3, 43.3, 43.3, 43.3, 43.3, 43.3, 43.3, 43.3, 43.3, 43.3, 43.3, 43.3,
  43.3, 43.3, 43.1, 43.1, 43.1, 43.1, 43.1, 42.1, 42.1, 42.1, 42.1, 41.6, 41.6,
  41.4, 41.4, 41.4, 41.3, 41.4, 41.4, 41.4, 41.4, 41.4, 41.4, 41.6, 41.6, 41.7,
  41.3, 41.3, 41.3, 41.3, 41.3, 41.3, 41.3, 41.3, 41.3, 41.3, 41.3, 41.3, 40.2,
  40.2, 40.2, 40.2, 40.2, 40.2, 40.4, 40.4, 40.4, 40.4, 40.5, 40.5, 42.1, 42.2,
  42.2, 42.2, 42.2, 42.2, 42.2, 42.2, 42.2, 44.1, 44.1, 44.2, 44.3, 44.3, 44.5,
  44.5, 44.5, 44.5, 44.5, 44.5, 44.6, 44.6, 44.6, 44.6, 44.7, 45.0, 45.3, 45.4,
  45.5, 45.5, 45.6, 45.8, 45.9, 46.2, 46.7, 47.4, 47.8, 47.9, 48.0, 48.2, 48.3,
  48.4, 49.1, 50.7, 52.4, 53.3, 53.6, 53.7, 54.0, 54.1, 54.4, 54.4, 54.5, 55.1,
  57.3, 59.4, 60.6, 61.1, 61.3, 63.3, 67.3, 71.4, 73.4, 74.1, 74.9, 76.8, 80.5,
  83.0, 84.6, 84.8, 85.1, 84.4, 82.1, 79.4, 77.2, 75.5, 74.4, 73.9, 73.6, 73.6,
  73.7, 74.1, 83.4, 83.4, 85.1, 85.1, 85.1, 85.2, 95.1, 110.8, 111.1, 110.9,
  110.9, 110.9, 110.9, 106.2, 105.1, 105.1, 105.1, 104.6, 104.6, 104.6, 104.5,
  104.5, 104.5, 104.6, 101.6, 101.6, 98.7, 98.7, 98.7, 98.7, 98.7, 98.7, 98.7,
  98.7, 103.2, 104.1, 104.5, 105.0, 105.0, 105.0, 105.0, 105.0, 106.9, 120.7,
  122.4, 123.6, 123.6, 123.6, 122.4, 121.9, 121.2, 121.2, 121.2, 121.2, 121.2,
  121.2, 121.2, 123.5, 130.1, 129.9, 131.3, 131.3, 131.3, 131.3, 131.3, 131.3,
  131.3, 131.3, 131.3, 131.3, 140.1, 138.8, 139.1, 138.7, 138.0, 138.0, 138.0,
  138.0, 138.0, 138.0, 138.0, 138.0, 138.0, 137.3, 136.4, 132.8, 132.7, 131.9,
  131.9, 131.9, 131.9, 129.0, 129.0, 129.0, 129.0, 129.0, 128.1, 124.8, 123.1,
  123.1, 123.1, 123.1, 123.1, 123.1, 123.1, 123.1, 123.1, 122.6, 122.6, 122.6,
  121.9, 122.4, 122.4, 123.1, 123.1, 123.1, 123.1, 123.2, 123.2, 123.4, 123.4,
  123.4, 123.7, 123.9, 126.9, 128.4, 128.4, 129.8, 132.5, 132.5, 132.5, 121.2,
  121.4, 121.4, 132.6, 132.6, 132.6, 132.6, 132.6, 132.6, 121.0, 121.0, 121.0,
  121.0, 121.0, 121.0, 116.6, 116.8, 116.8, 116.6, 116.6, 116.6, 102.4, 102.4,
  102.4, 102.4, 102.4, 102.4, 112.0, 112.0, 112.0, 112.0, 112.0, 112.0, 131.1,
  131.1, 131.1, 131.3, 131.3, 131.3, 218.9, 218.9, 218.9, 219.1, 219.1,
];

let d7dtData = [
  62.5, 62.5, 62.5, 62.5, 62.6, 62.9, 63.0, 62.7, 62.4, 61.7, 61.3, 61.1, 60.4,
  60.7, 60.9, 60.8, 60.4, 60.1, 59.7, 59.5, 57.7, 57.6, 57.1, 56.7, 56.6, 57.1,
  57.6, 57.6, 57.0, 56.5, 56.1, 56.1, 56.1, 56.1, 56.1, 56.1, 56.1, 56.1, 56.1,
  56.1, 56.0, 56.0, 55.8, 55.8, 55.8, 55.8, 55.8, 55.8, 55.8, 55.8, 55.7, 55.6,
  55.1, 54.5, 54.2, 54.2, 54.2, 54.2, 54.2, 54.2, 54.2, 54.2, 54.2, 54.2, 54.2,
  54.3, 54.3, 54.3, 54.4, 54.4, 54.4, 54.4, 54.4, 54.4, 54.4, 54.4, 54.5, 54.5,
  54.5, 54.5, 54.5, 54.5, 54.5, 54.5, 54.7, 54.7, 54.7, 54.7, 54.8, 54.9, 55.1,
  55.3, 55.4, 55.4, 55.6, 55.7, 56.0, 56.3, 57.0, 57.6, 57.9, 58.3, 58.4, 58.5,
  58.8, 59.4, 60.4, 61.6, 62.5, 63.0, 63.4, 63.6, 63.8, 63.9, 63.9, 64.0, 64.8,
  66.2, 67.6, 68.2, 68.9, 69.7, 71.6, 74.6, 77.7, 79.6, 80.4, 81.0, 82.1, 84.3,
  85.9, 86.9, 87.3, 87.6, 87.6, 86.8, 85.8, 84.6, 83.6, 83.1, 83.1, 83.0, 83.0,
  83.0, 83.4, 92.2, 92.2, 94.1, 94.1, 94.1, 94.1, 98.1, 108.2, 109.0, 109.0,
  109.0, 108.7, 108.7, 108.2, 102.7, 100.5, 100.5, 100.5, 100.5, 100.5, 100.1,
  100.1, 100.1, 100.1, 100.1, 100.1, 99.9, 99.9, 99.9, 99.9, 99.9, 99.9, 99.6,
  99.6, 100.9, 101.7, 103.2, 104.0, 104.0, 104.0, 104.0, 104.0, 105.0, 112.8,
  114.5, 115.1, 115.1, 115.1, 113.7, 112.4, 112.4, 112.3, 112.3, 112.3, 112.3,
  112.3, 111.8, 113.8, 119.6, 119.6, 121.0, 121.0, 121.0, 121.0, 121.0, 121.4,
  121.4, 121.4, 121.4, 121.4, 129.3, 129.1, 129.3, 129.1, 128.3, 128.3, 128.3,
  128.3, 128.3, 128.3, 128.3, 128.3, 128.3, 128.3, 128.3, 128.3, 128.0, 128.0,
  127.9, 127.9, 127.9, 127.9, 127.9, 127.9, 127.9, 127.9, 127.9, 127.9, 127.7,
  127.7, 127.7, 127.7, 127.7, 127.7, 127.7, 127.7, 127.7, 127.7, 127.7, 128.9,
  132.1, 137.5, 137.5, 139.2, 139.2, 139.2, 142.3, 142.3, 142.3, 142.3, 142.3,
  142.3, 143.5, 143.7, 146.9, 149.4, 149.4, 152.1, 155.2, 155.2, 155.2, 147.6,
  147.8, 147.8, 163.8, 163.8, 163.8, 163.8, 163.8, 163.8, 160.3, 160.3, 160.3,
  160.3, 160.3, 160.3, 160.6, 160.6, 160.6, 160.4, 160.4, 160.4, 155.2, 155.2,
  155.2, 155.2, 155.2, 155.2, 169.4, 169.4, 169.4, 169.7, 169.7, 169.7, 184.4,
  184.4, 184.4, 185.0, 185.0, 185.0, 260.2, 260.2, 260.2, 261.3, 261.3,
];

let d7dvData = [
  33.2, 32.9, 33.9, 34.9, 32.8, 32.1, 32.6, 32.9, 37.4, 40.7, 36.5, 38.3, 38.5,
  36.1, 33.0, 31.3, 31.4, 30.6, 29.3, 30.5, 29.8, 31.3, 31.2, 30.3, 28.1, 26.6,
  25.0, 25.2, 25.3, 24.5, 23.7, 23.2, 24.0, 24.9, 24.0, 22.3, 22.5, 22.2, 23.3,
  25.8, 25.5, 25.5, 28.8, 29.4, 31.4, 31.4, 33.2, 38.1, 37.3, 37.5, 38.8, 37.7,
  36.8, 37.9, 40.9, 41.2, 52.2, 55.2, 51.4, 48.8, 42.4, 43.0, 41.6, 40.3, 42.1,
  42.2, 40.4, 39.2, 46.6, 38.5, 34.9, 32.8, 34.3, 33.2, 35.2, 36.5, 36.7, 35.7,
  35.2, 34.8, 39.3, 39.7, 36.1, 40.0, 41.9, 49.2, 50.7, 37.9, 35.7, 35.0, 36.2,
  37.7, 37.2, 40.4, 40.2, 42.1, 41.3, 40.2, 40.7, 44.2, 47.7, 44.9, 45.3, 49.7,
  52.2, 59.2, 55.0, 51.0, 51.8, 51.8, 59.2, 61.3, 57.9, 63.7, 68.1, 72.3, 73.8,
  76.8, 68.4, 71.0, 72.3, 73.7, 74.5, 76.6, 77.1, 77.0, 79.5, 77.8, 73.7, 67.6,
  64.5, 67.6, 62.9, 64.3, 66.6, 69.3, 69.0, 70.7, 72.6, 71.1, 75.5, 78.3, 88.8,
  89.3, 92.7, 92.9, 106.1, 117.3, 127.2, 132.9, 139.6, 118.3, 115.3, 98.5, 90.5,
  80.5, 79.3, 74.9, 67.5, 71.5, 71.6, 79.2, 70.9, 79.0, 77.1, 82.0, 84.3, 86.2,
  103.6, 90.6, 97.0, 100.1, 100.1, 96.8, 95.0, 94.8, 94.5, 98.2, 101.6, 128.1,
  125.5, 119.8, 130.4, 135.7, 125.4, 128.7, 124.8, 120.1, 123.8, 123.2, 130.9,
  131.4, 131.6, 134.1, 136.4, 134.8, 127.3, 117.4, 120.4, 128.9, 132.4, 133.9,
  130.7, 137.5, 134.7, 143.2, 141.5, 133.9, 125.0, 124.7, 128.0, 128.0, 131.1,
  127.1, 124.7, 128.4, 125.1, 125.3, 121.7, 119.6, 118.3, 117.5, 116.4, 116.7,
  115.0, 109.5, 108.1, 99.3, 86.7, 91.0, 88.3, 88.5, 89.8, 87.4, 83.7, 74.4,
  75.6, 75.6, 73.0, 67.3, 61.2, 58.6, 63.2, 64.7, 68.7, 74.2, 74.4, 72.9, 76.2,
  86.9, 83.4, 90.6, 96.0, 94.5, 89.8, 89.9, 83.7, 82.2, 81.5, 85.3, 88.8, 89.7,
  98.0, 105.6, 106.9, 105.1, 110.5, 110.9, 114.8, 113.7, 110.8, 112.2, 117.7,
  126.2, 119.1, 111.6, 107.7, 110.1, 110.9, 111.4, 113.2, 108.7, 108.0, 109.7,
  109.8, 113.8, 110.3, 110.4, 114.1, 101.5, 83.4, 64.8, 60.7, 70.9, 71.5, 71.3,
  68.3, 71.3, 67.5, 79.6, 85.7, 92.2, 94.8, 90.6, 94.8, 97.8, 98.3, 97.1, 101.5,
  120.5, 125.0, 121.2, 125.9, 140.8, 202.8, 193.8, 211.1, 223.8, 210.4, 180.8,
];

let d7dwForecastData = [
  160.8, 162.5, 163.2, 167.6, 168.5, 171.5, 177.7, 181.1, 186.3, 195.9, 203.3,
  207.7, 207.7,
];

let d7duForecastData = [
  166.8, 195.2, 195.2, 195.2, 195.4, 195.4, 195.4, 325.9, 325.9, 325.9, 326.3,
  326.3, 326.3,
];

let d7dtForecastData = [
  229.2, 249.1, 249.1, 249.1, 249.9, 249.9, 249.9, 351.5, 351.5, 351.5, 353.0,
  353.0, 353.0,
];

let d7dvForecastData = [
  156.9, 186.4, 193.4, 187.4, 194.7, 217.8, 313.6, 299.7, 326.5, 346.1, 325.4,
  279.6, 346.1,
];

async function initializeChart(d7dw, d7du, d7dt, d7dv) {
  //get current year
  let currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  let yearDiff = currentYear - 1996;
  let monthDiff = Math.min(yearDiff * 12, historicLabels.length);
  const ctx = document.getElementById("forecaster-chart");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: historicLabels,
      datasets: [
        {
          label: "Solid Fuels - D7DW",
          data: d7dw,
          borderWidth: 1,
        },
        {
          label: "Gas - D7DU",
          data: d7du,
          borderWidth: 1,
        },
        {
          label: "Electricity - D7DT",
          data: d7dt,
          borderWidth: 1,
        },
        {
          label: "Liquid Fuels - D7DV",
          data: d7dv,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          min: monthDiff - 12,
          max: monthDiff,
        },
        y: {},
      },
      plugins: {
        title: {
          display: true,
          text: `Fuel cost - Historic Data`,
        },
      },
    },
  });
}

function scrollChartRight() {
  let canvas = document.getElementById("forecaster-chart");
  const chart = Chart.getChart(canvas);
  let dataLength = chart.data.labels.length;
  if (chart.config.options.scales.x.max >= dataLength - 1) {
    chart.config.options.scales.x.min = dataLength - 12;
    chart.config.options.scales.x.max = dataLength - 1;
    let feedbackMessage = document.getElementById("feedback-text");
    feedbackMessage.style.color = "red";
    feedbackMessage.innerText =
      "Sorry, there's no historic data beyond this date. Maybe you'll find forecast mode interesting?";
  } else {
    chart.config.options.scales.x.min += 1;
    chart.config.options.scales.x.max += 1;
    let feedbackMessage = document.getElementById("feedback-text");
    feedbackMessage.innerText = "";
  }
  chart.update();
}

function scrollAllChartRight() {
  let canvas = document.getElementById("forecaster-chart");
  const chart = Chart.getChart(canvas);
  let dataLength = chart.data.labels.length;
  if (chart.config.options.scales.x.max >= dataLength - 1) {
    let feedbackMessage = document.getElementById("feedback-text");
    feedbackMessage.style.color = "red";
    feedbackMessage.innerText =
      "Sorry, there's no historic data beyond this date. Maybe you'll find forecast mode interesting?";
  } else {
    chart.config.options.scales.x.min = dataLength - 12;
    chart.config.options.scales.x.max = dataLength - 1;
    let feedbackMessage = document.getElementById("feedback-text");
    feedbackMessage.innerText = "";
  }
  chart.update();
}

function scrollChartLeft() {
  let canvas = document.getElementById("forecaster-chart");
  const chart = Chart.getChart(canvas);
  let dataLength = chart.data.labels.length;
  if (chart.config.options.scales.x.min <= 0) {
    chart.config.options.scales.x.min = 0;
    chart.config.options.scales.x.max = 11;
    let feedbackMessage = document.getElementById("feedback-text");
    feedbackMessage.style.color = "red";
    feedbackMessage.innerText =
      "Sorry, there's no historic data beyond this date";
  } else {
    chart.config.options.scales.x.min -= 1;
    chart.config.options.scales.x.max -= 1;
    let feedbackMessage = document.getElementById("feedback-text");
    feedbackMessage.innerText = "";
  }
  chart.update();
}

function scrollAllChartLeft() {
  let canvas = document.getElementById("forecaster-chart");
  const chart = Chart.getChart(canvas);
  let dataLength = chart.data.labels.length;
  if (chart.config.options.scales.x.min <= 0) {
    let feedbackMessage = document.getElementById("feedback-text");
    feedbackMessage.style.color = "red";
    feedbackMessage.innerText =
      "Sorry, there's no historic data beyond this date";
  } else {
    chart.config.options.scales.x.min = 0;
    chart.config.options.scales.x.max = 11;
    let feedbackMessage = document.getElementById("feedback-text");
    feedbackMessage.innerText = "";
  }
  chart.update();
}

function switchMode() {
  chartMode = 1 - chartMode;
  //historic mode
  if (chartMode == 0) {
    //enable buttons
    document.getElementById("scrollLeftBtn").style.visibility = "visible";
    document.getElementById("scrollRightBtn").style.visibility = "visible";
    document.getElementById("scrollAllLeftBtn").style.visibility = "visible";
    document.getElementById("scrollAllRightBtn").style.visibility = "visible";
    amendChart(
      historicLabels,
      d7dwData,
      d7duData,
      d7dtData,
      d7dvData,
      "Fuel cost - Historic Data"
    );
  }
  //forecast mode
  else if (chartMode == 1) {
    //disable buttons
    document.getElementById("scrollLeftBtn").style.visibility = "hidden";
    document.getElementById("scrollRightBtn").style.visibility = "hidden";
    document.getElementById("scrollAllLeftBtn").style.visibility = "hidden";
    document.getElementById("scrollAllRightBtn").style.visibility = "hidden";
    amendChart(
      forecastLabels,
      d7dwForecastData,
      d7duForecastData,
      d7dtForecastData,
      d7dvForecastData,
      "Fuel cost - Forecast Data"
    );
  }
  console.log(chartMode);
}

function amendChart(chartLabels, d7dw, d7du, d7dt, d7dv, chartName) {
  let canvas = document.getElementById("forecaster-chart");
  const chart = Chart.getChart(canvas);
  chart.options.plugins.title.text = chartName;
  chart.data.datasets[0].data = d7dw;
  chart.data.datasets[1].data = d7du;
  chart.data.datasets[2].data = d7dt;
  chart.data.datasets[3].data = d7dv;
  chart.data.labels = chartLabels;

  if (chartMode == 1) {
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let yearDiff = currentYear - 1996;
    let monthDiff = Math.min(yearDiff * 12, chartLabels.length);
    chart.options.scales.x.min = monthDiff - 12;
    chart.options.scales.x.max = monthDiff;
  }
  chart.update();
}
