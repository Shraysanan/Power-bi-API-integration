function requestToken() { 
$.ajax({ 
"async": true, 
"crossDomain": true, 
"url": "https://cors-anywhere.herokuapp.com/https://login.microsoftonline.com/{your tenant name}/oauth2/v2.0/token", // Pass your tenant name  
"method": "POST", 
"headers": { 
"content-type": "application/x-www-form-urlencoded" 
}, 
"data": { 
"grant_type": "password",
"username": "{your username}",
"password": "{your password}",
"client_id": "{your client id}",
"scope": "https://analysis.windows.net/powerbi/api/.default",
}, 
success: function(response) { 
console.log(response); 
token = response.access_token;
var sample=document.getElementById("sample");
sample.innerHTML=token;
}, 
error: function(error) { 
console.log(JSON.stringify(error)); 
} 
}) 
}
//############################################################################################
//getting workspace
var myworkspaceid;
function getworkspace(){
var settings = {
  "url": "https://api.powerbi.com/v1.0/myorg/groups",
  "method": "GET",
  "timeout": 0,
  "headers": {
    "Authorization": `Bearer ${token}`
  },
};

$.ajax(settings).done(function (response) {
  console.log(response);
  myworkspaceid=response.value[0].id;
});
}
//############################################################################################
var myembedurl,myreportid,myembedtoken;
function getreport(){
$.ajax({
type: 'GET',
url: `https://api.powerbi.com/v1.0/myorg/groups/${myworkspaceid}/reports`,
headers: {
"Authorization": `Bearer ${token}`
},
success: (data) => {
console.log(data);
const serverresponse=document.getElementById("sample2");
serverresponse.innerHTML=data;
myembedurl=data.value[0].embedUrl;
myreportid=data.value[0].id;
},
error: (data) => {
console.log(data)
}
});
}
function getembedtoken(){
$.ajax({
type: 'POST',
url: `https://api.powerbi.com/v1.0/myorg/groups/${myworkspaceid}/reports/${myreportid}/GenerateToken`,
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${token}`
},
data: JSON.stringify({
  "accessLevel": "View"
}),
success: (data) => {
console.log(data);
const sample3=document.getElementById("sample3");
sample3.innerHTML=data;
myembedtoken=data.token;
},
error: (data) => {
console.log(data)
}
});
}

function embedreport(){
var txtAccessToken =myembedtoken;
var txtEmbedUrl =myembedurl;
var txtEmbedReportId = myreportid;

var tokenType = 1;

var models = window["powerbi-client"].models;

var permissions = models.Permissions.All;

var config = {
    type: "report",
    tokenType: tokenType == "0" ? models.TokenType.Aad : models.TokenType.Embed,
    accessToken: txtAccessToken,
    embedUrl: txtEmbedUrl,
    id: txtEmbedReportId,
    permissions: permissions,
    settings: {
        panes: {
            filters: {
                visible: true,
            },
            pageNavigation: {
                visible: true,
            },
        },
    },
};

var embedContainer = $("#embedContainer")[0];

var report = powerbi.embed(embedContainer, config);
}

//##################################################################################################

function getdashboards(){
  var settings = {
  "url": `https://api.powerbi.com/v1.0/myorg/groups/${myworkspaceid}/dashboards`,
  "method": "GET",
  "timeout": 0,
  "headers": {
    "Authorization": `Bearer ${token}`
  },
};

$.ajax(settings).done(function (response) {
  console.log(response);
  dashboardurl=response.value[0].embedUrl;
  dashboardid=response.value[0].id;
});
}

function dashboardtoken(){
  var settings = {
  "url": `https://api.powerbi.com/v1.0/myorg/groups/${myworkspaceid}/dashboards/${dashboardid}/GenerateToken`,
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/x-www-form-urlencoded"
  },
  "data": {
    "accesslevel": "view"
  }
};

$.ajax(settings).done(function (response) {
  console.log(response);
  dashboardembedtoken=response.token;
});
}

function embeddashboard(){
var txtAccessToken = dashboardembedtoken;
 
var txtEmbedUrl = dashboardurl;
 
var txtEmbedDashboardId = dashboardid;
 
var tokenType = 1; 


var models = window['powerbi-client'].models;

var config = {
    type: 'dashboard',
    tokenType: tokenType == '0' ? models.TokenType.Aad : models.TokenType.Embed,
    accessToken: txtAccessToken,
    embedUrl: txtEmbedUrl,
    id: txtEmbedDashboardId,
    pageView: 'fitToWidth'
};
 
var dashboardContainer = $('#dashboardContainer')[0];
 
var dashboard = powerbi.embed(dashboardContainer, config);
}
//############################################################################################
