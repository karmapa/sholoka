var glob=require("glob");
var fs=require("fs");
var content='',allcount=0;
//--先接上所有檔案--//
mergefiles=function(fn){	
 content+=fs.readFileSync(fn,'utf8').replace(/\r?\n/g,"");   
}

function merge_reg_counts(content)
{
	var items=[]; outstr='', outarr=[];
	content=content.replace(/\r?\n/g,"");

	//有可能是在 <bampo 之後, 取經文
	if(content.match(/<bampo .* ?[\u0f00-\u0fff]/g)!=null)
	  content=content.match(/<bampo .* ?[\u0f00-\u0fff]/g).toString(); 
    // བམ་པོ་དང་པོ། 可能要納入
	content=content.replace(/<.+?> /g,""); //有些> 後會留一個空白, 不要!
	content=content.replace(/<.+?>/g,"");  //有些> 後, 不會有空白, 但整個tag 不要!
    
	content=content.match(/[\u0f00-\u0fff].+/g).toString(); //這時候變Array, 轉string
    
    for(var i=0;i<content.length-4;i++)
    {
    	outstr+=content[i];
         if(content[i]==='།' && content[i+1]==='།' && content[i+2]===' ' && 
         	content[i+3]==='།' && content[i+4]==='།'){
         	outstr+='། །།\n';
         i+=4;
         }
         else if(content[i]==='།' && content[i+1]===' ' && content[i+2]==='།'){
            outstr+=' །\n';
            i+=2;
        }
         else if(content[i]==='།' && content[i+1]===' '){
         	outstr+='\n';
         	i+=1;
         }else if(content[i]==='།'){
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
		}else{
			items.push([m,0]); // \u0F0D
		}
	});
	return items;
	
}
glob("./014/014/*.xml",function(err,files){
       files.map(mergefiles);
       var countline=merge_reg_counts(content);
       console.log('Total of words: '+allcount);
       console.log(countline);
});

