const NodeCache = require( "node-cache" );
const myCache = new NodeCache();
require('dotenv').config()

module.exports = function Caching() {
    return {
        applyCache: function(){
            if(myCache.has(process.env.CACHE_KEY)) {
                console.log("Cached");
                return myCache.get(process.env.CACHE_KEY);
              }
              else{
                console.log("Not Cahced");
                myCache.set(process.env.CACHE_KEY, {}, 5);
              }
        },
    }
}