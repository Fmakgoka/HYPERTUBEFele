const { session } = require("passport");

module.exports = {
   
    intra: {
        clientID:'be29ed0d0e4799fd42c3d08d5c53bcd8d3008608ac31c7bc8d70c930321c44aa',
        clientSecret:'1e00274db4b4c353da335f3a5d5fd02145564a6af50317e8a071d02cbf8af38b'
    },

    github: {
        clientID:'bd4aee02121533ee4ddb',
        clientSecret:'d62d820726787cfe6314fda712b57972023fe225'
    },

    session:{
        cookieKey:'Felecialovefoodanddance'
    },
    jwt: {
        secret:"idontevenknowwhy"
    }
}