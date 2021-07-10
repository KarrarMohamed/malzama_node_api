// let userObject = '{"name":"Scorpion", "link":"/en/mk/scorpion", "redirect":0}';

//         userObject = userObject.replace(/[()`%;=<>&j\\]/g, function (a) {
//             return `&#${a.codePointAt(0)};`;
//         });

//         userObject = JSON.parse(userObject);
    
        
//         let freezedName = userObject['name'];
//         let freezedLink = userObject['link'];
       
//        // let test_value = new URL(location).searchParams.get('test_value') || Math.random() + '1';
        
//         test_value = "0.71735657632569661";
        
//         // Subzero Magic 
//         Object.freeze(userObject);

//         // immutability tests
//         // None of these changes will be implemented, otherwise subzero you are fired! 

//         eval(`
       
//        userObject['name'] = "${test_value}";
//        userObject['name'][0] = "${test_value}";
//        userObject.name = "${test_value}";
//        userObject.name = userObject.name.toString() + "${test_value}";

//        userObject['link'] = "${test_value}";
//        userObject['link'][0] = "${test_value}";
//        userObject.link = "${test_value}";
//        userObject.link = userObject.link.toString() + "${test_value}";

//        userObject['redirect'] = "${test_value}";
//        userObject['redirect'][0] = "${test_value}";
//        userObject.redirect = "${test_value}";
//        userObject.redirect = userObject.redirect.toString() +"${test_value}";
     
//        `);

//        if (userObject['name'] !== freezedName || userObject['link'] !== freezedLink) {

//         throw console.error("Object has not been freezed");
//         // Zubzero loses 
//        // exit();


//     }

//     if (userObject['redirect']) {
//             console.log('redirect has been performed');

//         var url = userObject['link'].toString().replace(/ /g, '');

//         if (url.indexOf("javascript") === 0 || url.indexOf("data") === 0) {

//             throw console.error("Invaild URL scheme");
//             exit();

//         }

//         document.location = url;

//     } else {
//          console.log('Dom has been performed');
//         //document.getElementById("player").innerHTML = `Name: ${encodeURI(userObject["name"])} Link: ${encodeURI(userObject["link"])}`;

//     }

//let test_value = '{"name":"<script>let h = 10</script>","link":"anything"}';
let test_value = '{"name":"anything","link":"<script>let h = 10</script>","redirect":true}';
test_value = test_value.replace(/[()`%;=<>&j\\]/g, function (a) {
    return `&#${a.codePointAt(0)};`;
});
test_value = JSON.parse(test_value.toString());
let c = test_value['link'].toString().replace(/ /g, '');
console.log(encodeURI(test_value['name']));
console.log(c);

