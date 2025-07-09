// utils/convertCurrency.js
import axios from "axios";

const convertUsdToNaira = async (amountUSD, deliveryUSD = 10) => {
  try {
    const response = await axios.get("https://open.er-api.com/v6/latest/USD");

    const usdToNgnRate = response.data.rates.NGN;
    if (!usdToNgnRate) throw new Error("Unable to fetch NGN rate");

    const totalUSD = amountUSD + deliveryUSD;
    const amountNGN = Math.round(totalUSD * usdToNgnRate);

    console.log(`Converted USD (${totalUSD}) to NGN:`, amountNGN);
    return amountNGN;
  } catch (error) {
    console.error(
      "Currency conversion error:",
      error.response?.data || error.message
    );
    throw new Error("Currency conversion failed");
  }
};

export default convertUsdToNaira;
