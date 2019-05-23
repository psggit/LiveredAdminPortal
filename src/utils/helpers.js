export function formatStateAndCityList(data) {
  const list = data
  console.log("list", list)
  let cityList = [], stateList = [], stateMap = {}
  let index = 0;
  for (const i in list) {
    //state list
    let state = {}
    state.text = list[i].state_name
    state.value = list[i].state_id
    stateList[i] = state

    //city list
    for (const j in list[i].cities) {
      let city = {}
      city.text = (list[i].cities[j].city_name)
      city.value = (list[i].cities[j].city_id)
      cityList[index] = city
      index = index + 1
    }
  }

  //Maps state to city
  for (const i in list) {
    let cityList = []
    for (const j in list[i].cities) {
      let cityDetail = {}
      cityDetail.text = (list[i].cities[j].city_name)
      cityDetail.value = (list[i].cities[j].city_id)
      cityList[j] = cityDetail
    }
    stateMap[list[i].state_id] = cityList
  }
  console.log("statelist", stateList, "citylist", cityList, "statemap", stateMap)
  return { stateList, cityList, stateMap }
}