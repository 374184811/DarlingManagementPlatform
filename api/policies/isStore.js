// policies/Merchants.js
module.exports = function isStore (req, res, next) {

  //console.log('商户策略. This is the function entry. ',req.allParams());

  var mine = req.session.mine;
  var allParams = req.allParams();
  // If there's no `userId` in the session, then the user is not logged in
  // (so we can't tell if they're an admin or not!)
  // In that case, don't allow access.
  if (!req.session.mine) {
    return res.forbidden();
  }
 
  var storeid = mine.storeid;
  // Attempt to look the user up in the database.
  Accountseller.findOne({id:storeid}).exec(function(err, user) {

    // Handle unknown errors
    if (err) { return res.serverError(err); }

    // If the user couldn't be found, forbid access.
    // (this handles the rare case of a logged-in user being deleted)
    if (!user) { return res.forbidden(); }

    // If the user isn't an admin, forbid access.
    if (!user.id) { return res.forbidden(); }

    // If we made it all the way down here, looks like everything's ok, so we'll let the user through.
    // (from here, the next policy or the action will run)

    utils.policiesLayer("商户后台",req);
    return next();

  });

};
