/**
 * create by lgmcolin 2013/4/4
 */

window.onload = function(){
    init(); 
}
function init(){
    this.oOpen = $("open");
    this.oShow = $("show");
    this.btn = true;
    this.oList = $("list");  
    this.oList_ul = $("list_ul");
    this.oList_li = oList_ul.getElementsByTagName("li");
    
    this.oWebIm = $("webIm");
    this.oList_src = $("list_src");
    this.oList_title = $("list_title");
    this.oSetting = $("setting");
    this.oMin = $("min");
    this.oClose = $("close");
    this.oSetUl = $("set_ul");
    this.aSetLi = oSetUl.getElementsByTagName("li");

    this.goTop = $("go_top");
    this.oContent_ul = $("content_ul");
    this.aContent_li = oContent_ul.getElementsByTagName("li");
    this.goBot = $("go_bot"); 
    this.iNum = 0;
    
    this.oText = $("text");
    //传说中最短判断是否为ie，主要在于ie的bug，-[1,]字符串强制转换为数字，ie会返回NaN,转化为boolean型为false.相反，其他浏览器
    this.ie = !-[1,];  
    this.oSendUp = $("send_up");
    this.listScroll = $("scroll");
    this.oContent = $("content");
    this.oBtn = $("btn");
    
    this.oBtn_list = $("btn_list");
    this.oBtn_list_ul = oBtn_list.getElementsByTagName("ul")[0];
    this.oBtn_list_li = oBtn_list.getElementsByTagName("li");
    //获取在线的人
    ajax('/getPerson',function(str){
      //  console.log('gag'+str);
        var json = eval('('+str+')');
        for(var i=0,j=json.list.length;i<j;i++){
            var oLi = document.createElement("li"); 
            var img = '<img src="images/'+json.list[i].src+'" />';
            oLi.innerHTML = '<div class="list_li">'+img.toString()+'</div1>'; 
            console.log(oLi.innerHTML);
            oLi.name = json.list[i].name;
            oLi.title = json.list[i].title;
            oList_ul.appendChild(oLi);
        }
    }); 
    getList();
    //阻止冒泡
    oWebIm.onClick = function(ev){
        if(window.event){
            ev.cancelBubble = true; 
        }else{
            ev.stopPropagation(); 
        } 
    }
    oList.onClick = function(ev){
        if(window.event){
            ev.cancleBubble = true; 
        }else{
            ev.stopPropagation(); 
        }
    }
        
    //
    oOpen.onclick = function(){
        if(btn){
            oShow.innerHTML = "隐藏聊天";
            startRun(oList,{right:1});
            btn = false;
            for(var i=0;i<oList_li.length;i++){
                oList_li[i].index = i;
                addEvent(oList_li[i],"click",function(){
                    if(getStyle(oWebIm,"display")=="none"){
                          oWebIm.className="webim_now";
                          oList_src.src = "";
                          oList_title.innerHTML = "";
                          oContent.innerHTML="";
                          oList_src.src="/images/"+this.title+".jpg";
                          oList_title.innerHTML = this.title;
                          oWebIm.style.display = "block";
                          oOpen.style.display = "none";
                          getList(); //获取聊天信息
                          startMove(oSendUp,listScroll,oContent);
                          setTimeout(function(){
                                goScroll(listScroll,oContent); 
                          },200); 
                          var oLi = document.createElement("li");
                          oLi.title = this.title;
                          oLi.innerHTML = '<div class="tishi active">'+this.title+'</div>';
                          oContent_ul.appendChild(oLi);
                    }else{
                          for(var k=0;k<aContent_li.length;k++){
                            if(aContent_li[k].title == this.title){
                                var attr = aContent_li[k];//aContent[k]插入前必须先被建立，否则直接insertBefore(aContent_li[k])会报错
                                oContent_ul.removeChild(aContent_li[k]);
                                oContent_ul.insertBefore(attr,aContent_li[0]);
                                oList_src.src = "/images/"+attr.title+".jpg"; 
                                oList_title.innerHTML = "";
                                oList_title.innerHTML = attr.title;
                                ceshi(); // 给列表中的人增加点击触发  ceshi()
                                return false;  //如果满足，则不需要继续执行下去
                            } 
                          } 
                          oWebIm.className = 'webim_now';
                          oList_src.src = "";
                          oList_title.innerHTML = "";
                          oContent.innerHTML = "";
                          oList_src.src =  "/images/"+this.title+".jpg";
                          oList_title.innerHTML = this.title;
                          var oLi = document.createElement("li");
                          oLi.title = this.title;
                          oLi.innerHTML = '<div class="tishi">'+this.title+'</div>';
                          oContent_ul.insertBefore(oLi,aContent_li[0]);
                          ceshi();                    
                    } 
                });                       
            }
        }else{
            oShow.innerHTML = "开始聊天";
            startRun(oList,{right:-51});
            btn = true;
            oList_ul.innerHTML = "";
            ajax("/getPerson",function(str){
                 var json = eval('('+str+')');
                 for(var i=0,j=json.list.length;i<j;i++){                                 
                     var oLi = document.createElement("li"); 
                     var img = '<img src="images/'+json.list[i].src+'" />';
                     oLi.innerHTML = '<div class="list_li">'+img.toString()+'</div1>'; 
                     console.log(oLi.innerHTML);
                     oLi.name = json.list[i].name;
                     oLi.title = json.list[i].title;
                     oList_ul.appendChild(oLi);
                 }
            });
        } 
    }

    goTop.onclick = function(){
        console.log("click go_top");
        console.log(aContent_li[0].offsetHeight);
        if(aContent_li[0].offsetHeight*aContent_li.length>=oContent_ul.offsetHeight && aContent_li.length-11>iNum){
            iNum++;
            startRun(oContent_ul,{top:-iNum*aContent_li[0].offsetHeight});
        }else{
            return false; 
        }        
    }
    
    goBot.onclick = function(){
        console.log("click go_bottom");
        if(aContent_li[0].offsetHeight*aContent_li.length>=oContent_ul.offsetHeight && iNum>0){
            iNum--;
            startRun(oContent_ul,{top:-iNum*aContent_li[0].offsetHeight});
        }else{
            return false; 
        }
    }
    
    //发送消息处理
    if(ie){
        text.onpropertychange = toChange;
    }
    else{
        text.oninput = toChange; 
    }


    oSetting.onclick = function(ev){
        var ev = ev||window.event;
        oSetUl.style.display = "block";
        for(var i=0;i<aSetLi.length;i++){
            aSetLi[i].onmouseover = function(){
                for(var i=0;i<aSetLi.length;i++){
                    aSetLi[i].className = ""; 
                }
                this.className = "active";
            } 
        }
        aSetLi[0].onclick = function(ev){
            var ev = ev||window.event;
            oSetUl.style.display = "none";
            document.onclick = function(){
                oWebIm.style.display = "none"; 
                oOpen.style.display = "block";
                oContent_ul.innerHTML = "";
                oContent.innerHTML = "";
                return false;
            }
            ev.cancleBubble = true;
        }
        aSetLi[1].onclick = function(ev){
            var ev = ev||window.event;
            oSetUl.style.display = "none";
            document.onclick = function(){
                return false; 
            }
            ev.cancleBubble = true;
        }
        
    
    }

    oBtn.onclick = function(ev){  //点击发送
        createDiv();  //附上发送的内容
    }
    
    //设置发送快捷键
    oBtn_list.onclick = function(){
        if(oBtn_list_ul.style.display=="none"){
            oBtn_list_ul.style.display="block";}
        else{
            oBtn_list_ul.style.display ="none";
        }
    }
    for(var i=0;i<oBtn_list_li.length;i++){
        oBtn_list_li[i].index = i;
        oBtn_list_li[i].onmouseover = function(){
            for(var j=0;j<oBtn_list_li.length;j++){
                oBtn_list_li[j].className = ""; 
            } 
            this.className = "active";
        }
    }
    //按回车发送
    oBtn_list_li[0].onclick = function(ev){
        console.log("click [0]"); 
        var ev = ev||window.event;
        this.parentNode.style.display = "none";
        console.log(this.parentNode);
        oText.onkeydown = function(ev){
            var ev = ev||window.event; 
            if(ev.keyCode=="13"){
                if(oText.value==""){
                   return;  
                }else{
                    createDiv();
                    event.returnValue = false;
                }
            }
        }
        ev.cancleBubble = true; 
    }
    //ctrl+回车发送
    oBtn_list_li[1].onclick = function(){
       console.log("click [1]"); 
       var ev = ev||window.event;
       this.parentNode.style.display = "none";
       oText.onkeydown = function(ev){
            if(ev.ctrlKey && ev.keyCode=="13"){
                if(oText.value==""){
                    return ;    
                }else{
                    createDiv(); 
                    event.returnValue = false;
                }
            } 
       }   
       ev.cancleBubble = true; 
    }
    

    oClose.onclick = function(ev){  //点击关闭
        var ev = ev||window.event;
        ev.cancleBubble = true;
        webIm.style.display = "none"; 
        oOpen.style.display = "block";
        oContent_ul.innerHTML = "";
        content.innerHTML = "";
    }



}

//对于onpropertychange(ie)和oninput出发该事件，需要注意的是，发现在响应用户onclick了textarea时，如果使用obj.className="XX";来改变textarea输入框中字体的样式，会导致在ie下会有在输入第一个字符的时候onpropertychange不会触发的bug，因此需要这样设置：obj.style.color="#000";
function toChange(){
    console.log("click text");
    var oValue = document.getElementById("text");
    var num = Math.ceil(getLength(oValue.value)/2);  //除以2
    var oNum = document.getElementById("num");
    if(!oNum) return;
    if(num<=10){
        oNum.innerHTML = 10-num;
        oNum.style.color = "";
    }else{
        oNum.innerHTML = "超出了"+(num-10)+"个"; 
        oNum.style.color = "red";
    }
}

function getLength(str){  //统计字数
    return String(str).replace(/^\x00-\xff/g).length; 
}

function ajax(url,fnSuccess,fnFail){
    var oAjax = null;
    if(window.ActiveXObject){
        oAjax = new ActiveXObject("Msxml.XMLHTTP") || new ActiveXObject("Microsoft.XMLHTTP"); 
    }else{
        oAjax = new XMLHttpRequest();
    }
    oAjax.open('get',url,true);
    oAjax.onreadystatechange = function(){
        console.log('onreadystatechange');
        if(oAjax.readyState==4){
            if(oAjax.status ==200){
                console.log("请求结果："+oAjax.responseText); 
                if(fnSuccess){
                    fnSuccess(oAjax.responseText); 
                }
            }else{
                if(fnFail){
                    fnFail(oAjax.status); 
                } 
            } 
        } 
    };
    oAjax.send();
    //oAjax.onreadystatechange = null;  //不能加上去，否则不会执行中间那段onreadystatechange代码，可以通过其他方法清除内存,如设置标志位
    //oAjax = null;
}

function ajaxPost(url,sData,fnSuccess,fnFail){ 
    var oAjax = null;
    if(window.ActiveXObject){
        oAjax = new ActiveXObject("Msxml2.XMLHTTP")||new ActiveXObject("Microsoft.XMLHTTP");
    }else{
        oAjax = new XMLHttpRequest(); 
    }
    oAjax.open();
    oAjax.onreadystatechange = function(){
        if(oAjax.readyState == 4){
            if(oAjax.status == 200){
                if(fnSuccess){
                    fnSuccess(oAjax.responseText); 
                }
            }else{
                    if(fnFail){
                        fnFail(oAjax.status); 
                    } 
            } 
        } 
    };
    oAjax.sendRequestHeader('content-type','urlencode');
    oAjax.send(sData);
}

function $(id){
    return document.getElementById(id);
}

function getStyle(obj,attr){
    if(obj.currentStyle){
        return obj.currentStyle[attr];
    }else{
        return getComputedStyle(obj,false)[attr]; 
    }
};

function createDiv(){
    var oDiv = document.createElement('div');
    var oNum = document.getElementById('num');
    var re = /<[^<>]+>/g;   //这里可以用正则定义些过滤
    oText.value = oText.value.replace(re,"");
    console.log("createDiv="+oText.value);
    oDiv.className = "content_r"; 
    oDiv.innerHTML = '<div class="time">'+getDate()+'</div>'+'<div class="speak"><p>'+oText.value+'</p></div>'
    oContent.appendChild(oDiv);
    oText.value = "";
    oNum.innerHTML = "140";
    oNum.style.color = "";
    startMove(oSendUp,listScroll,oContent);
    setTimeout(function(){
       goScroll(listScroll,oContent); 
    },200);
}

function toLength(obj){
    if(obj<"10"){
        obj+="0"; 
    }
    return obj;
}

function getDate(){
    var oDate = new Date();
    var now = toLength(oDate.getDay())+":";
    now = now+toLength(oDate.getMinutes());
    return now;
}

function ceshi(){
    for(var i=0;i<aContent_li.length;i++){
        aContent_li[i].index = i;
        aContent_li[i].childNodes[0].className= "";
        aContent_li[i].childNodes[0].className = "tishi";
        aContent_li[0].childNodes[0].className = "tishi active"
        aContent_li[i].onclick = function(){
            for(var i=0;i<aContent_li.length;i++){
                aContent_li[i].childNodes[0].className = "tishi";
            }
            aContent_li[this.index].childNodes[0].className = "tishi active";
            oList_src.scr = "";
            oList_title.innerHTML = "";
            oContent.innerHTML = "";
            oList_src.src = "/images/"+this.title+".jpg";
            oList_title.innerHTML = this.title;

       //     var attr = aContent_li[this.index];
       //     oContent_ul.removeChild(aContent_li[this.index]);
       //     var oLi = document.createElement("li");
       //     oLi.title = attr.title;
       //     oLi.innerHTML = '<div class="tishi active">'+attr.title+'</div>';
       //     oContent_ul.insertBefore(oLi,aContent_li[0]);

            getList();
        } 
    }
    getList();
}

function getList(){
    ajax("/getChat",function(str){
         oContent.innerHTML = "";
         var json = eval('('+str+')');
         for(var i=0,j=json.list.length;i<j;i++){
             var oDiv = document.createElement('div');
             if(json.list[i].type == "speak"){
                oDiv.className = "content_r"; 
             }else{
                oDiv.className = "content_l"; 
             }
             oDiv.innerHTML = '<div class="time">'+json.list[i].time+'</div>'+'<div class="speak"><p>'+json.list[i].content+'</p></div>'
             oContent.appendChild(oDiv);
             startMove(oSendUp,listScroll,oContent);
             setTimeout(function(){
                goScroll(listScroll,oContent); 
             },200);
         }
    });
}

//滑动scroll控制聊天content
function startMove(oParent,obj,oContent){
    var parentDiv = oParent;
    var scrollDiv = obj;
    var contentDiv = oContent;

    if(parentDiv.scrollHeight>=parentDiv.offsetHeight){
        scrollDiv.style.display = "block"; 
        scrollDiv.style.height = (parentDiv.offsetHeight/parentDiv.scrollHeight)*parentDiv.offsetHeight+"px";
    }
    else{
        scrollDiv.style.display = "none"; 
    }

    scrollDiv.onmousedown = function(ev){
        var ev = ev||window.event;
        disY = ev.clientY - scrollDiv.offsetTop;
        if(scrollDiv.setCapture){
            scrollDiv.setCapture(); //给当前的scrollDiv设置鼠标捕获，不用给body设置，只用于ie 
        }
        document.onmousemove = function(ev){
            var ev = ev||window.event;
            var T = ev.clientY - disY;
            if(T<0){     //判断T的最大和最小滑动距离
                T = 0;
            }else if(T>parentDiv.offsetHeight-obj.offsetHeight){
                T = parentDiv.offsetHeight - obj.offsetHeight      
            }
            scrollDiv.style.top = T+"px";
            var srcY =  T/(parentDiv.offsetHeight-scrollDiv.offsetHeight);
            contentDiv.style.top = srcY *(parentDiv.offsetHeight-content.offsetHeight)+"px";
        }
        document.onmouseup = function(){
            document.onmousemove = null;
            document.onmouseup = null;  //释放资源
            if(scrollDiv.setCapture){
                scrollDiv.realeaseCapture(); 
            }
        }
        return false;
    }
    
    if(contentDiv.addEventListener){
        parentDiv.addEventListener("DOMMouseScroll",toRun,false); 
        contentDiv.addEventListener("DOMMouseScroll",toRun,false);
    }

    parentDiv.onmousewheel = toRun;  //onmousewheel  for ie
    contentDiv.onmousewhell = toRun; //兼容ie,或者写成obj.attachEvent(type,func);

function toRun(ev){
         var ev = ev||window.event;
         var bBtn = true;  //判断滚轮滚动方向  bBtn=true:向下滚动    
         if(ev.detail){
            bBtn = ev.detail>0?true:false; 
         }else{
            bBtn = ev.wheelDelta<0?true:false; 
         }
         if(bBtn){
            T = scrollDiv.offsetTop+10; 
         }else{
            T = scrollDiv.offsetTop-10; 
         }
         if(T<0){  //对T的可能取值进行判断
            T = 0; 
         }else if(T>parentDiv.offsetHeight-scrollDiv.offsetHeight){
            T = parentDiv.offsetHeight-scrollDiv.offsetHeight; 
         }
         scrollDiv.style.top = T +"px";
         var scrY = T/(parentDiv.offsetHeight-scrollDiv.offsetHeight);
         contentDiv.style.top =  scrY*(parentDiv.offsetHeight-contentDiv.offsetHeight)+"px";
      }
} //startMove

//走滚动条和鼠标控制,运动模型js
//调用如:startRun(obj,{left:100,top:100,opacity:50},function(){startMove(obj,{opacity:100})});
function startRun(obj,json,fn){
    clearInterval(obj.timer);    

    obj.timer = setInterval(function(){
        var bFlag = true;

        for(var attr in json){
            var iCur = 0;
            if(attr=='opacity'){
                iCur = Math.round(parseFloat(getStyle(obj,'opacity'))*100); 
            }else if(attr=='scroll'){
                iCur = getScroll();
            }else{
                iCur = parseInt(getStyle(obj,attr)); 
            }
            var iSpeed = (json[attr]-iCur)/8;
            iSpeed = iSpeed>0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

            if(attr=='opacity'){
                obj.style.filter = 'alpha(opacity='+(iSpeed+iCur)+')'; 
                obj.style.opacity = (iSpeed+iCur)/100;    
            }else if(attr=='scroll'){
                document.documentElement.scrollTop = document.body.scrollTop=iSpeed+iCur; 
            }else{
                obj.style[attr] = (iSpeed+iCur)+'px';  
            }

            if(json[attr]!=iCur){ //若设定的值和原本的值一样
                bFlag = false; 
            }
        }
        if(bFlag){
            clearInterval(obj.timer); 
            if(fn){
                fn.call(obj); 
            }
        }
    },30);
}

function getScroll(){
    return document.documentElement.scrollTop || document.body.scrollTop;
}

function goScroll(obj,oContent){ //滚动条，和聊天窗口文字一直在底部
    var scrollDiv = obj;
    scrollDiv.style.top="";
    scrollDiv.style.bottom="0";
    var scrY = scrollDiv.offsetTop/(scrollDiv.parentNode.offsetHeight-scrollDiv.offsetHeight);
    oContent.style.top = scrY*(scrollDiv.parentNode.offsetHeight-oContent.offsetHeight)+"px";
}

function addEvent(obj,event,fn){  //添加事件 封装
    if(obj.addEventListener){
        obj.addEventListener(event,fn,true); 
    }else{
        obj.attachEvent("on"+event,function(){
            fn.call(obj); 
        }); 
    }
}

