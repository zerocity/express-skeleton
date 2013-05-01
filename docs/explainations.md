### Explantaions for Callbacks

function test(argument, callback) {
   //logic
   var query = database.find({})
   
   query.sort('-date');
   
   query.exec(function(err, obj) {
        
        callback(err, obj);
   });
}

test(argument, function(err, obj) {
    if(err) return err;
    
    test2(obj, function(testing2) {
      // 
       
   });
});