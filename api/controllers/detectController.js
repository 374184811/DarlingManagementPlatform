module.exports = {
    
    getDetectInfo: function(req, res) {
        console.log('getDetectInfo: This is the function entry.  check it out: ', msg);
        
        var userid = req.param('userid');

        var querytext = 'select * from userdetectinfo'+userid;
        Creator.query(querytext, function(err, results) {
          if (err) return res.serverError(err);
          //console.log(results);
        });

        
    },

    triggerDetectInfo: function(req, res) {
        console.log('triggerDetectInfo: This is the function entry.  check it out: ', msg);
        
        var userid = req.param('userid');
        
        var querytext = 'create table userdetectinfo'+userid+' like detectprototype';
        Creator.query(querytext, function(err, results) {
          if (err) return res.serverError(err);
          //console.log(results);
        });
    },
    // showaddbanner: function(req, res) {
    //     Recommendhomepage.find({}, function userCreated(err, recommends) {
    //         if (err) {
    //             console.log("err: ", err);
    //             return res.negotiate(err);
    //         }
    //         return res.view('goods/addbanner',{recommends:recommends});
    //     });
    // },
    
    // listbanner: function(req, res) {
    //     Banner.find({}, function userCreated(err, banners) {
    //         if (err) {
    //             console.log("err: ", err);
    //             return res.negotiate(err);
    //         }
    //         return res.view('goods/listbanner',{banners:banners});
    //     });
    // },

    // bannerClassify: function(req, res) {

    //     console.log('bannerClassify: Get the most recent banners from the database.  check it out: ');
    //     Banner.find({ where:{ order: {'<=': 6, '>=': 1} }, sort:'order' }, function userCreated(err, banners) {

    //         if (err) {
    //             console.log("err: When this error is returned, the query fails.");
    //             return res.negotiate(err);
    //         }
            
    //         console.log('log: Present you with different views of the same document. check it out: ', banners)
    //         return res.view('goods/listbanner', { banners:banners });
    //     });
    // },


};
