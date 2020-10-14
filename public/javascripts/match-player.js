function initDataLoad(){
    return;
}

var query_list = {};
var query = location.search.replace( "?" , "" ).split('&');

for(parameters of query){
    var qp = parameters.split('=');
    if(qp.length == 2){
        query_list[qp[0]] = qp[1];
    }
}