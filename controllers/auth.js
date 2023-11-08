const bcrypt = require('bcryptjs')
const User = require('../models/user')
const User_data = require('../firebase/config.js');
const hist_door = require('../models/door.js')

const Access = require('../models/access')
const sensors = require('../models/sensors');
const time_schedule = require('../models/time-schedule');


exports.getLogin = (req, res, next) => {
  res.render('login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn,
    csrfToken: req.csrfToken(),
    errMessage: req.flash('error')
  });
};

exports.postLogin = (req, res, next) => {
  let name;
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email:email})
  .then(user=>{
    if(!user){
      req.flash('error', 'Invalid email or password.')
      return res.redirect('/login')
    }
    name = user.name
    bcrypt.compare(password, user.password)
    .then(doMatch=>{
      if(doMatch){
        const access = new Access({
          name: name,
          email: email,
        })
        return access.save()
        .then(result=>{
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err=>{
            console.log(err)
            res.redirect('/')
          })
        })
        .catch(err=>{
          console.log(err)
          res.redirect('/')
        })
      }
      req.flash('error', 'Invalid email or password.')
      res.redirect('/login')
    })
    .catch(err=>{
      console.log(err)
      res.redirect('/login')
    })
  })

};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err=>{
    console.log(err)
    res.redirect('/')
  })  
};
exports.getSignup = (req, res, next) => {
  res.render('signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    csrfToken: req.csrfToken(),
    errMessage: req.flash('error')
  });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  console.log(name)
  const confirmPassword = req.body.confirmPassword;
  User.findOne({email: email}).then(userDoc=>{
    if(userDoc){
      req.flash('error', 'Email exists already, please pick a different one.')
      return res.redirect('/signup')
    }
    return bcrypt.hash(password, 12)
    .then(hashedPassword=>{
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
      })
      return user.save()
    }
    ).then(result=>{
      res.redirect('/login')
    })
  })
  .catch(err=>{
    console.log(err)
  })
};

exports.getHistoryAccess = (req, res, next)=>{
  Access.find()
  .then(access=>{
    res.render('history_access',{
      access : access,
      pageTitle: "History access",
      path: '/history_access',
      isAuthenticated: req.session.isLoggedIn,
      csrfToken: req.csrfToken(),
    })
  })
  .catch(err=>{
    console.log(err)
  })
}

exports.getHistoryDoor = (req, res, next)=>{
  hist_door.find()
  .then(access=>{
    res.render('history_door',{
      access : access,
      pageTitle: "History access door",
      path: '/history_access',
      isAuthenticated: req.session.isLoggedIn,
      csrfToken: req.csrfToken(),
    })
  })
  .catch(err=>{
    console.log(err)
  })
}


exports.getChartTemp = async (req, res, next)=>{
  const sensor = await sensors.find()
  var list_temp = []
  for(const item of sensor){
    list_temp.push(item['temperature'])
  }
  const snapshot = await User_data.get()
  var list = snapshot.data()
  temperature = list["Temperature"]
  res.render('chart-temp', {temperature, list_temp,
  pageTitle:"Chart Temperature",
  isAuthenticated: req.session.isLoggedIn,
  csrfToken: req.csrfToken() 
  });
}
exports.getChartHumidity = async (req, res, next)=>{
  const sensor = await sensors.find()
  var list_humi = []
  for(const item of sensor){
    list_humi.push(item['humidity'])
  }
  const snapshot = await User_data.get()
  var list = snapshot.data()
  temperature = list["Temperature"]
  res.render('chart-humidity', {temperature, list_humi,
  pageTitle:"Chart Temperature",
  isAuthenticated: req.session.isLoggedIn,
  csrfToken: req.csrfToken() 
  });
}
exports.getChartBrightness = async (req, res, next)=>{
  const sensor = await sensors.find()
  var list_brightness = []
  for(const item of sensor){
    list_brightness.push(item['brightness_level'])
  }
  const snapshot = await User_data.get()
  var list = snapshot.data()
  temperature = list["Temperature"]
  res.render('chart-brightness', {temperature, list_brightness,
  pageTitle:"Chart Temperature",
  isAuthenticated: req.session.isLoggedIn,
  csrfToken: req.csrfToken() 
  });
}

exports.getPumpShedule = async (req, res, next)=>{
  await time_schedule.find().then(schedules=>{
    res.render('pump-shedule', {
      schedules: schedules,
      path: '/pump-shedule',
      pageTitle:"Pump Shedule",
      isAuthenticated: req.session.isLoggedIn,
      csrfToken: req.csrfToken() 
    });
  }
  )
  .catch(err=>{
    console.log(err)
  })
}
exports.postPumpShedule = async (req, res, next)=>{
  schedule = new time_schedule({
    hour: Number(req.body.time.split(':')[0]),
    minute: Number(req.body.time.split(':')[1]),
    intervals: Number(req.body.intervals)
  })
  return schedule.save().then(async result=>{
    await time_schedule.find().then(schedules=>{
      res.render('pump-shedule', {
        schedules: schedules,
        path: '/pump-shedule',
        pageTitle:"Pump Shedule",
        isAuthenticated: req.session.isLoggedIn,
        csrfToken: req.csrfToken() 
      });
    })
    .catch(err=>{
      console.log(err)
    })
  })
}

exports.deletePumpShedule = async (req, res, next)=>{
  await time_schedule.deleteOne({_id: req.body.id}).then(async result=>{
    await time_schedule.find().then(schedules=>{
      res.render('pump-shedule', {
        schedules: schedules,
        path: '/pump-shedule',
        pageTitle:"Pump Shedule",
        isAuthenticated: req.session.isLoggedIn,
        csrfToken: req.csrfToken() 
      });
    }
    )
    .catch(err=>{
      console.log(err)
    })
  })
}