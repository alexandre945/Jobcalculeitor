const Profile = require('../model/Profile')

module.exports = {
   async index(req, res) {
      return res.render("profile",{ profile: await Profile.get()})
    },
   async update(req, res) {
      const data = await req.body
      const weeksPerYear = await 52
      const weeksPerMonth =  await (weeksPerYear - data["vacation-per-year"] ) / 12
      const weekTotalHours  = await data["hours-per-day"] * data["days-per-week"]
      const monthlyTotalHours = await weekTotalHours * weeksPerMonth
      const valueHour = await data["monthly-budget"] / monthlyTotalHours

     const profile = await Profile.get()

      Profile.update({
        ... profile,
        ...req.body,
        "value-hour": valueHour
      });
      return res.redirect('/profile')
    },
  }