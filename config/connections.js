/**
 * Connections
 * (sails.config.connections)
 *
 * `Connections` are like "saved settings" for your adapters.  What's the difference between
 * a connection and an adapter, you might ask?  An adapter (e.g. `sails-mysql`) is generic--
 * it needs some additional information to work (e.g. your database host, password, user, etc.)
 * A `connection` is that additional information.
 *
 * Each model must have a `connection` property (a string) which is references the name of one
 * of these connections.  If it doesn't, the default `connection` configured in `config/models.js`
 * will be applied.  Of course, a connection can (and usually is) shared by multiple models.
 * .
 * Note: If you're using version control, you should put your passwords/api keys
 * in `config/local.js`, environment variables, or use another strategy.
 * (this is to prevent you inadvertently sensitive credentials up to your repository.)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.connections.html
 */

module.exports.connections = {

    /***************************************************************************
     *                                                                          *
     * Local disk storage for DEVELOPMENT ONLY                                  *
     *                                                                          *
     * Installed by default.                                                    *
     *                                                                          *
     ***************************************************************************/
    // localDiskDb: {
    //   adapter: 'sails-disk'
    // },

    /***************************************************************************
     *                                                                          *
     * MySQL is the world's most popular relational database.                   *
     * http://en.wikipedia.org/wiki/MySQL                                       *
     *                                                                          *
     * Run: npm install sails-mysql                                             *
     *                                                                          *
     ***************************************************************************/
    // someMysqlServer: {
    //   adapter: 'sails-mysql',
    //   host: 'YOUR_MYSQL_SERVER_HOSTNAME_OR_IP_ADDRESS',
    //   user: 'YOUR_MYSQL_USER', //optional
    //   password: 'YOUR_MYSQL_PASSWORD', //optional
    //   database: 'YOUR_MYSQL_DB' //optional
    // },

    mysql: {
        adapter: 'sails-mysql',
        host: '127.0.0.1',
        user: 'darlingDev',
        password: 'MyNewPass4!',
        //user: 'appstoreDev',
        //password: 'BqlCt2u2hK9i8',
        database: 'oneinstack'
    },
    /***************************************************************************
     *                                                                          *
     * More adapters: https://github.com/balderdashy/sails                      *
     *                                                                          *
     ***************************************************************************/
     redis: {
        adapter: 'sails-redis',
        host: 'localhost',
        password: 'bqldaling890',
        port: 6379,
        db: 0
    },
    wxPubOauthURL:'http://dev.darlinglive.com/order/getWeichatOpenid3?showwxpaytitle=1&userid=',
    redirectURL:'http://dev.darlinglive.com/wechat/darling/www/',
    kuaidi100:'http://dev.darlinglive.com:1336/deliver/deliverTrack?no=12349',
    //pingppKey:'sk_test_P0uDGK1SqfPGzzzfHKLWnb5G',
    pingppKey:'sk_live_vXzrjT9mnLC4qHG0WTfzvXXD',

    ordernumberbase:600000000000000,//测试 和开发服务器

    //ordernumberbase:100000000000000,//正式服务器
    wxgzh_ping_app:'wx42b76c895fd1b0b8',//测试服务器的公众号应用id
    wxgzh_key:'294cd47e906d22063b48d2617373396b',//测试服务器的公众号应用key
            wxauth_info:{
        4:['wx42b76c895fd1b0b8','294cd47e906d22063b48d2617373396b'],
        5:['wx8c9b3748a225ed20','9838bbce9d99790c287a5a30e1c59aa6'],
        6:['wx42b76c895fd1b0b8','294cd47e906d22063b48d2617373396b'],
        7:['wx42b76c895fd1b0b8','294cd47e906d22063b48d2617373396b'],
        8:['wx42b76c895fd1b0b8','294cd47e906d22063b48d2617373396b'],
    },
   //dev服务器
    alipaywap_success_url: 'http://dev.darlinglive.com/h5/darling/www/#/webpaysuccess',// 支付宝web同步回调地址
    alipaywap_cancel_url: 'http://dev.darlinglive.com/h5/darling/www/#/webpayfail',// 支付宝web同步回调地址
    upacpwap_result_url: 'http://dev.darlinglive.com/h5/darling/www?succeed=1',// 银联同步回调地址
    //dev服务器
    alipaywap_success_pc_url: 'http://test.darlinglive.com/pcweb/www/templates/Playsuccess.html',// 支付宝web同步回调地址
    alipaywap_cancel_pc_url: 'http://test.darlinglive.com/pcweb/www/templates/Playfauit.html',// 支付宝web同步回调地址
   upacpwap_result_pc_url: 'http://test.darlinglive.com/pcweb/www/#/Playback',// 银联同步回调地址

};
