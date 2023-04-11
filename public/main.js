const currentYear = new Date().getFullYear()
const maxYear = new Date(currentYear + 1, 11, 31)
const urlStringNow = `https://feiertage-api.de/api/?jahr=${currentYear}&nur_land=NW`
const urlStringNext = `https://feiertage-api.de/api/?jahr=${currentYear + 1}&nur_land=NW`
const dt = dateFns
let holidays = [
  {
    startDate: new Date(),
    endDate: new Date(),
    color: 'lightgreen',
    name: 'today',
  },
]

let calendar = new Calendar('#calendar', {
  style: 'background',
  minDate: new Date(currentYear, 0, 1),
  maxDate: maxYear,
  dataSource: [
    {
      startDate: new Date(),
      endDate: new Date(),
      color: 'lightgreen',
      name: 'today',
    },
  ],
})
calendar.setLanguage('de')

function getHolidays(uri) {
  fetch(uri)
    .then((res) => res.json())
    .then((data) => {
      Object.keys(data).forEach(function (key, index) {
        const event = {}
        event.name = 'feiertag'
        event.startDate = new Date(data[key].datum)
        event.endDate = new Date(data[key].datum)
        event.color = 'rgba(255, 0, 0, 0.5)'
        holidays.push(event)
      })
      const dataSRC = calendar.getDataSource()
      holidays.forEach((e) => dataSRC.push(e))
      calendar.setDataSource(dataSRC)
    })
}
getHolidays(urlStringNow)
getHolidays(urlStringNext)

function setEvents(e, n = null, color = null) {
  const dataSRC = calendar.getDataSource()
  const event = {}
  event.name = n
  event.startDate = e
  event.endDate = e
  event.color = color
  dataSRC.push(event)
  calendar.setDataSource(dataSRC)
}

function setPattern(firstDay, doubleMonday = true) {
  const differenceInDays = dt.differenceInDays(new Date(firstDay), new Date(currentYear, 0, 1))

  // 49 DAYS Between Each Pattern : Double Monday
  // xx DAYS Between Each Pattern : Single Monday
  const res = Math.floor(differenceInDays / 49) * 49
  const currentDay = firstDay.getDay()
  if (currentDay === 0) {
    firstDay = dt.addDays(firstDay, -6)
  } else {
    firstDay = dt.addDays(firstDay, -currentDay + 1)
  }
  firstDay = dt.subDays(firstDay, res + 49)
  setEvents(firstDay, null, 'rgba(255, 0, 0, 0.5)')
  while (dt.isBefore(firstDay, maxYear)) {
    const pattern = [7, 8, 6, 2, 8, 4, 4, 8, 2]
    pattern.forEach((el) => {
      setEvents(firstDay, null, 'rgba(255, 0, 0, 0.5)')
      firstDay = dt.addDays(firstDay, el)
    })
  }
  const dataSRC = calendar.getDataSource()
  holidays.forEach((e) => dataSRC.push(e))
  calendar.setDataSource(dataSRC)
}

document.getElementById('date').addEventListener('change', function () {
  const input = this.value
  calendar.setDataSource(null)
  setPattern(new Date(input))
})
