var glob=require("glob");
var fs=require("fs");
var content='',allcount=0,bampocounts=[];
//--先接上所有檔案--//
mergefiles=function(fn){	
  content+=fs.readFileSync(fn,'utf8').replace(/\r?\n/g,"");   
}

function merge_reg_counts(content){
	var stridx=[];
	//content=content.match(/འདི་སྐད་བདག་གིས་ཐོས་པ་དུས་གཅིག་ན། .* ?[\u0f00-\u0fff]/g).toString(); //有可能是在 <bampo 之後, 取經文
  content.replace(/བམ་པོ་/g,function(m,idx){
    stridx.push(idx);
  });

  for(var i=0;i<stridx.length;i++){
     if(i==stridx.length-1){
     		//console.log(content.substring(stridx[i],content.length));
       dosoloka(content.substring(stridx[i],(content.length)));
     }else{
     	  //console.log(content.substring(stridx[i],stridx[i+1]));
    	 dosoloka(content.substring(stridx[i],stridx[i+1]));
     	 }
  }
}

function dosoloka(subcontent)
{
	 var items=[], outstr='', outarr=[];
   var bampo_node_counts=0;
	 subcontent=subcontent.replace(/<.+?> ?/g,""); //有些> 後會留一個空白, 不要!
	 //過濾包含空白字元所有藏字
	 subcontent=subcontent.match(/[\u0f00-\u0fff].+/g).toString(); //這時候變Array, 轉string
   subcontent=subcontent.replace(/།  །/g,"། །");
   //console.log(subcontent);
	  for(var i=0;i<subcontent.length;i++)
	  {	    
	    	outstr+=subcontent[i];
	         if(subcontent[i]=='།' && subcontent[i+1]=='།' && subcontent[i+2]==' ' && 
	         	subcontent[i+3]=='།' && subcontent[i+4]=='།'){
	         	outstr+='། །།\n';
	         i+=4;
	         }
	         else if(subcontent[i]=='།' && subcontent[i+1]==' ' && subcontent[i+2]=='།'){
	            outstr+=' །\n';
	            i+=2;
	         }	        
	         else if(subcontent[i]=='།' && subcontent[i+1]==' '){
	         	outstr+=' \n';
	         	i+=1;
	         }else if(subcontent[i]=='།' && subcontent[i+1]=='།'){
	         	outstr+='།\n';
	         	i+=1;
	         }else if(subcontent[i]=='།'){
	            outstr+='\n';
	         }
	   }
    
	    	outarr=outstr.split(/\r?\n/);   
	    	
			outarr.map(function(m){
					var len;
					if(m.match(/[\u0f20-\u0fff]+/g)!=null){
					  len=m.match(/[\u0f20-\u0fff]+/g).length;
					  items.push([m,len]);
					  allcount+=len;
					  bampo_node_counts+=len;

					}else{
						items.push([m,0]); // \u0F0D
					}
				});
  bampocounts.push(bampo_node_counts);
  console.log("total of bampo:"+bampo_node_counts);
	console.log(items);
	console.log("------------------------------------------");
}

glob("./deg/*.xml",function(err,files){
	files.map(mergefiles);
	merge_reg_counts(content);
	console.log('total of words:'+allcount);
  console.log(bampocounts);
});

