#!user/bin/env node

import { getArgs } from "./helpers/args.js";
import { getIcon, getWeather } from "./services/api.service.js";
import { printHelp, printSuccess, printError, printWeather } from "./services/log.service.js";
import { setKeyValue, TOKEN_DICTIONARY, getKeyValue } from "./services/storage.service.js";


const saveToken = async (token) => {
  if (!token.length) {
    printError('Не передан токен')
    return;
  }
  try {
    await setKeyValue(TOKEN_DICTIONARY.token, token)
    printSuccess('Токен сохранен')
  } catch (err) {
    printError(e.message)
  }
}


const saveCity = async (city) => {
  if (!city.length) {
    printError('Не передан город')
    return;
  }
  try {
    await setKeyValue(TOKEN_DICTIONARY.city, city)
    printSuccess('Город сохранен')
  } catch (err) {
    printError(e.message)
  }
}

const getForecast = async () => {
  try {
    const city = process.env.CITY ?? await getKeyValue(TOKEN_DICTIONARY.city)
    const weather = await getWeather(city)
    printWeather(weather, getIcon(weather.weather[0].icon))
  } catch (e) {
    if (e?.response?.status == 404) {
      printError('Неверно указан город')
    } else if (e?.response?.status == 401) {
      printError('Неверно указан токен')
    } else {
      printError(e.message)
    }
  }

}

const initCLI = () => {
  const args = getArgs(process.argv)
  // console.log(args);
  if (args.h) {
    // Output help
    return printHelp()
  }
  if (args.s) {
    // Save city
    return saveCity(args.s)
  }
  if (args.t) {
    // Save token
    return saveToken(args.t)
  }

  return getForecast()
};

initCLI();