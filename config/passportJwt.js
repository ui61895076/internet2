const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
const connection=require('./mysql_connect')
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';


// module.exports=passport=>{
//     passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
//         User.findOne({id: jwt_payload.sub}, function(err, user) {
//             if (err) {
//                 return done(err, false);
//             }
//             if (user) {
//                 return done(null, user);
//             } else {
//                 return done(null, false);
//                 // or you could create a new account
//             }
//         });
//     }));
// }


module.exports=passport=>{
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        let sql =`select * from students where name = '${jwt_payload.name}'`
        connection.query(sql,(err,result)=>{

            if (err){
                return done(err,false);
            }
            if(result){
                return done(null,result)
            }else{
                return done(null,false)
            }
        })
    }));
}