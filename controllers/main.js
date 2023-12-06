const User = require('../firebase/config.js');

exports.maintheme = async(req, res) => {
  const snapshot = await User.get()
  var list = snapshot.data()
  console.log(list)
  temperature = list["Temperature"]
  humidity = list["Humidity"]
  pump = list["Pump"]
  door = list["Door"]
  brightness = list["Brightness"]
  soil = list['Soil']
  Light = list["Light"]
  
  res.render('iot', { temperature, humidity, pump, door, brightness,Light,soil,
  pageTitle: "IOT Garden", isAuthenticated: req.session.isLoggedIn, csrfToken: req.csrfToken()});
}
  