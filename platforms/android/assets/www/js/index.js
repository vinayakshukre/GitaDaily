/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var aboutThisAppText = "<p><b>Empower yourself with daily nuggets of wisdom from the Bhagavad-gita written by Chaitanya Charan das.</b>This is mobile application version of website www.GitaDaily.com which is world's only website that daily delivers a new 300 word long inspirational reflection on a verse from Bhagavad-Gita.</p><p><b>About Author:</b>Chaitanya Charan Das is a celibate spiritual teacher (brahmachari) at ISKCON Pune. He has done his Electronics & Telecommunications Engineering from the Govt College of Engg, Pune. He subsequently served as a software engineer in a multinational software company, Patni Computer Systems.<p><p><b> To know more, please visit:</b><ul><li>www.GitaDaily.com</li><li>www.thespiritualscientist.com</li><li>www.iskcon.org</li></ul></p>"
var postDisplayHTML = "<div id=\"titleDiv\" class=\"titleClass\"></div><div id=\"authorDiv\">-By Chaitanya Charan Das</div><div id=\"mainDiv\" class=\"completeArea\"><div class=\"centerAlignment\"><br><img src=\"img/KrishnaArjun3.jpg\" class=\"KrishnaArjunImg\"><br><img src=\"img/wait2.gif\"></div></div>";
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
var postArray = [];
var firstTimeToShowPrevPostList = true;
var showPrevPosts = function(){
    //alert("Test");

    $("#homepage").toggle("slide",{direction: 'left'},400,function(){
        //alert("slide complete");
        $("#homepage").empty();
        $("#prevPosts").hide();
        var postsList = $("#homepage").append("<ul class=\"postlist\"></ul>");
        //alert(firstTimeToShowPrevPostList);
        allItems.each(function(index,element){
            //alert(index + " = index");
            var el = $(this);
            if(firstTimeToShowPrevPostList){
                 postArray.push(el);   
            }
            if(index == 0 && firstTimeToShowPrevPostList){    
                return;
            }
            
            postsList.append("<li id=\"li_" + index +"\" class=\"post\">" + getPostLink(el,index)  + "</li>");
            //postArray.push(el);
            //alert(el.find("title").text());
        });
        $("#homepage").toggle("fade");
        $("#homepage").addClass("postListDiv");
        $("li").on("click",showFullPost);
        firstTimeToShowPrevPostList = false;
    });
    //alert(allItems);//.each()
};
var getPostLink = function(el,index){
    var post = "<span id=\"dt_" + index +"\" class=\"mydate\">" + getDate(el) + "</span><span id=\"ct_" + index +"\" class=\"mycategory\">Based on " + getCategory(el) + "</span><br><h3 id=\"h3_" + index +"\">" + getTitle(el) + "</h3>" + getDesciption(el);
    return post; ;
};
var getDate = function(el){
    var d = new Date(el.find("pubDate").text());
    return d.toDateString();
};
var getDesciption = function(el){
    return el.find("description").text();;
};
var getTitle = function(el){
    return el.find("title").text();
};
var getCategory = function(el){
    return el.find("category").text();
};
var removeIFrameIfAny = function(contentStr){
    contentStr = replaceHTML4StyleAttributes(contentStr);
    //alert(contentStr);
    var parser = new DOMParser();
    //alert(parser);
    contentStr = removeNonXMLChars(contentStr);
  //  alert(contentStr);
    var mydom = parser.parseFromString("<div>"+contentStr+"</div>", "text/xml");
   // alert(mydom);
    var allIFrames = mydom.getElementsByTagName("iframe");
    for(var i=0; i< allIFrames.length; i++){
        allIFrames[i].parentNode.removeChild(allIFrames[i]);
    }
    
    correctAllImgWidths(mydom);

    var oSerializer = new XMLSerializer();
    var sXML = oSerializer.serializeToString(mydom);
    //alert(sXML);
    return replaceUnnecessaryStrings(sXML);
};
var displayPost = function(item,firstTime){
   // alert(item);
    $("#prevPosts").show();
    $("#authorDiv").show();
    if(firstTime){
        displayActualPost(item);
    }else{
        $("#homepage").toggle("slide",{direction: 'left'},400,function(){
            displayActualPost(item);
            $("#homepage").toggle("fade");
        });
    }
    
};
var displayActualPost = function(item){
    $("#homepage").empty();
    $("#homepage").removeClass("postListDiv");
    $("#homepage").html(postDisplayHTML);
    $("#titleDiv").html(item.find("title").text());
    $("#mainDiv").html(removeIFrameIfAny(item.find("encoded").text()));    
    $("a").on("click",disableAllLinks);
};
var showFullPost = function(event){
    var elementId = event.target.id 
    /*alert(event.target.id);
    if(elementId.substr(0,3) != "li_"){  // This condition comes when user taps on span used to show date or category.
        alert("Tapped on either date or category");
        var parent = $(event.target).parent(); // Jump to corressponding li.
        alert(parent);
        elementId = parent.get("id");
        alert(elementId + " after recalculation");    
        if(elementId.substr(0,3) != "li_")
            return;
    }*/
    alert(elementId + " final");
    if(elementId == "")
        return; // do nothing
    var index = elementId.substr(3); // Strip off li_
    displayPost(postArray[index],false);
    
};
var removeNonXMLChars = function(contentStr){
    contentStr = contentStr.split("&ldquo;").join("\"");
    contentStr = contentStr.split("&rdquo;").join("\"");
    //alert(contentStr);
    contentStr = contentStr.split("&rsquo;").join("'");
    //alert(contentStr);
    contentStr = contentStr.split("&lsquo;").join("'");
    contentStr = contentStr.split("&ndash;").join("-");
    contentStr = contentStr.split("&nbsp;").join(" ");

    //contentStr = contentStr.replace("","");
    //alert(contentStr);
    return contentStr;
};
var removeNonXMLChars2 = function(contentStr){
    contentStr = contentStr.replace("&ldquo;","\"");
    contentStr = contentStr.replace("&rdquo;","\"");
    contentStr = contentStr.replace("&rsquo;","'");
    //alert(contentStr);
    contentStr = contentStr.replace("&lsquo;","'");
    contentStr = contentStr.replace("&ndash;","-");

    //contentStr = contentStr.replace("","");
    return contentStr;
};
var replaceHTML4StyleAttributes = function(contentStr){
    contentStr = contentStr.replace("allowfullscreen","");

    return contentStr;
};
var showAboutApp = function(){
    $( "#dialog" ).dialog( "open" );
};
var init = function(){
    $("#homepage").html(postDisplayHTML);
    $("#authorDiv").hide();
    $( "#dialog" ).dialog({
      autoOpen: false,
      show: {
        effect: "blind",
        duration: 500
      },
      hide: {
        effect: "blind",
        duration: 500
      },
      width:'90%',
      height:600,
      buttons: {
                Close: function() {
                  $( this ).dialog( "close" );
                }
              }
    });
};
var disableAllLinks = function(){
    return false;
};
var processPostsList = function(data){
    allItems = $(data).find("item");
    var firstItem = allItems.first();
    displayPost(firstItem,true);
};
var putDataInLocalStorage = function(data){
    //  
};
var getDataFromLocalStorage = function(data){

};
var isInternetConnectionAvailable = function(){
    //alert(navigator.onLine);
    return true;
};
var correctAllImgWidths = function(mydom){
    var allImgs = mydom.getElementsByTagName("img");
    for(var i=0; i< allImgs.length; i++){        
        allImgs[i].setAttribute("style","width:100%;");        
    }   
};
var replaceUnnecessaryStrings =  function(sXML){
    sXML = sXML.replace("Explanation of article:","");
    sXML = sXML.replace("Listen audio","");
    sXML = sXML.replace("Podcast:","");
    return sXML;
};

