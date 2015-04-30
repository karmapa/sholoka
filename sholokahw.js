var fs=require("fs");
var keygroup={};
var out=[];

var processfile=function(fn){
  fn='../jiangkangyur/'+fn;
  if(!fs.existsSync(fn)) return;
  
  var content=fs.readFileSync(fn,'utf8');   
  content.replace(/[\u0f20-\u0fff]+/g,function(m,offset){
       if(m in keygroup) keygroup[m]++;  
       else keygroup[m]=1;
  });
}

var sortarr=function(){
  var keys=Object.keys(keygroup);
  var arr=keys.map(function(kwd){
    var itemsarray=[kwd,keygroup[kwd]];
    out.push(itemsarray);
    out=out.sort(function(a,b){
      return b[1]-a[1];
        });
   });
}

  fs.readFileSync('../jiangkangyur/jiangkangyur.lst','utf8')
  .split(/\r?\n/).map(processfile); //note: slice可先取一個file

sortarr();
console.log(out);