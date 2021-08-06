"use strict";angular.module("comedyApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).service("comedyService",["$http","$log",function(t,e){var n=[],o=[],i=[],l=0,s="inferno",r=localStorage.getItem("comedyOpt");null!=r&&(s=r),e.log("comedyService.opt: "+s);var a=localStorage.getItem("comedyRawlines"+s);null!=a&&(o=a);var c=localStorage.getItem("comedyLines"+s);null!=c&&""!=c&&(n=c);function d(e){var t="<br>";if(0<e.trim().length){if(/^##/.test(e))return 0<i.length&&(n.push({name:name,line:l,text:i.join(t),visible:!0}),i=[]),name=e.replace(/^## /,""),void(l=0);var o=e.replace(/--/g,"&#x2012;");i.push(o.trim()),l++,3==i.length&&(n.push({name:name,line:l-2,text:i.join(t),visible:!0}),i=[])}}function m(){n=[];for(var e=0;e<o.length;e++)d(o[e]);0<n.length&&n.push({line:l-1,text:o.join("<br>")}),localStorage.setItem("comedyLines"+s,JSON.stringify(n))}return{opt:function(e){return s!=e&&(s=e,localStorage.setItem("comedyOpt",s)),s},lines:function(e){return n!=e&&(n=e),n},makelines:function(){m()},feedme:function(){var e="https://dsmarkchen.github.io/comedy/data/"+s+".txt";return t.get(e).then(function(e){o=e.data.split(/\r?\n/),localStorage.setItem("comedyRawlines"+s,JSON.stringify(o)),m()})},rawlines:function(e){return o!=e&&(o=e),o},feed:function(e){return feedme(e)}}}]).filter("highlight",function(){return function(e,t){if(t){var o=new RegExp(t,"g");return e.replace(o,'<span class="highlighted">'+t+"</span>")}return e}}).directive("xwindow",["$window",function(i){return{link:function(e,t,o){function n(){console.log(i.innerWidth),e.width!==i.innerWidth&&(e.width=i.innerWidth,e.$digest()),e.height!==i.innerHeight&&(e.height=i.innerHeight,e.$digest())}e.width=i.innerWidth,e.height=i.innerHeight,angular.element(i).on("resize",n),e.$on("$destroy",function(){angular.element(i).off("resize",n)})},restrict:"A"}}]).directive("countUp",["$compile",function(i,e){return{restrict:"E",replace:!1,scope:{countTo:"=countTo",start:"=start",step:"=step",interval:"=interval"},controller:["$scope","$element","$attrs","$timeout",function(t,e,o,n){t.millis=t.start,0===e.html().trim().length?e.append(i("<span>{{millis}}</span>")(t)):e.append(i(e.contents())(t));!function e(){n(function(){t.millis+=t.step,t.$digest(),t.millis<t.countTo&&e()},t.interval)}()}]}}]).directive("tooltip",["$compile","$sce",function(i,l){return{restrict:"A",scope:{content:"=tooltipContent"},link:function(t,e,o){t.displayTooltip=!1,t.updateTooltipOpacity=function(e){n.css({opacity:e,"max-width":340})},t.updateTooltipPosition=function(e,t){$(this);n.css({top:e+"px",left:t+"px"})},t.getSafeContent=function(e){return l.trustAsHtml(e)};var n=angular.element('<div ng-show="displayTooltip" id="tooltip">        \t<span ng-bind-html="getSafeContent(content)"></span>        </div>');angular.element('<div ng-show="displayTooltip" class="tooltip">        \t<span ng-bind-html="getSafeContent(content)"></span>        </div>');angular.element(document.querySelector("body")).append(n),e.on("mouseenter",function(e){t.displayTooltip=!0,t.$digest()}),e.on("mousemove",function(e){t.updateTooltipOpacity(.9),t.updateTooltipPosition(e.clientY-20,e.clientX+5)}),e.on("mouseleave",function(){t.displayTooltip=!1,t.$digest()}),i(n)(t)}}}]).directive("xtooltip",function(){return{restrict:"A",link:function(e,t,o){t.hover(function(){t.tooltip({html:"true",container:"body"}),t.tooltip("show")},function(){t.tooltip("hide")})}}}).directive("bs-tooltip",function(){return function(e,t,o){o.$observe("title",function(e){t.tooltip("destroy"),jQuery.trim(e)&&t.tooltip()}),t.on("$destroy",function(){t.tooltip("destroy"),delete o.$$observers.title})}}).directive("owlCarousel",function(){return{restrict:"E",transclude:!1,link:function(i){i.initCarousel=function(e){var t={},o=i.$eval($(e).attr("data-options"));for(var n in o)t[n]=o[n];$(e).owlCarousel(t)}}}}).directive("owlCarouselItem",function(){return{restrict:"A",transclude:!1,link:function(e,t){e.$last&&e.initCarousel(t.parent())}}}).config(["$routeProvider",function(e,t){e.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/comedy/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/main",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/comedy/about",{templateUrl:"views/about.html",controller:"AboutCtrl",controllerAs:"about"}).when("/comedy/voyage",{templateUrl:"views/voyage.html",controller:"VoyageCtrl",controllerAs:"voyage"}).when("/voyage",{templateUrl:"views/voyage.html",controller:"VoyageCtrl",controllerAs:"voyage"}).when("/settings",{templateUrl:"views/settings.html",controller:"SettingsCtrl",controllerAs:"settings"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl",controllerAs:"about"}).when("/notes",{templateUrl:"views/notes.html",controller:"NotesCtrl",controllerAs:"notes"}).when("/canto",{templateUrl:"views/canto.html",controller:"CantoCtrl",controllerAs:"canto"}).otherwise({redirectTo:"/"})}]),angular.module("comedyApp").filter("split",function(){return function(e){var t=e.split(/([!,.;?-])/g),o="",n="",i="";return t.forEach(function(e){if(o+=e,52<e.length){return o.split(/(that|where|which|when|who)/g).forEach(l),n+=i,void(o="")}((n+=e).endsWith("--")&&"-"==e||"?"==e||";"==e||"."==e||"!"==e||","==e)&&(n+="\n",o="")}),console.log("line_index:0"),n;function l(e){if("that"==e||"where"==e||"when"==e||"who"==e||"which"==e)return i+="\n ",void(i+=e);i+=e}}}).controller("MainCtrl",["$window","$scope","$location",function(e,t,o){var n,i;this.test="testing mainController",t.txTotalSymbols=localStorage.getItem("totalSymbols"),t.txTotalLHs=localStorage.getItem("totalLHs"),t.rxTotalSymbols=localStorage.getItem("rxTotalSymbols"),t.rxTotalLHs=localStorage.getItem("rxTotalLHs"),t.isActive=function(e){return e===o.path()},t.ie=(n=window.navigator.userAgent,0<(i=n.indexOf("MSIE"))?parseInt(n.substring(i+5,n.indexOf(".",i))):navigator.userAgent.match(/Trident\/7\./)?11:0)}]),angular.module("comedyApp").controller("CantoCtrl",["$scope","$http","comedyService","fileReader",function(r,e,t,o){r.lines=[],r.selectedWord="",r.selectedText="",r.myQuery="1:1,25",r.opt=localStorage.getItem("comedyOpt"),null==r.opt&&(r.opt="inferno",localStorage.setItem("comedyOpt",r.opt)),t.opt(r.opt);var n=JSON.parse(localStorage.getItem("comedyLines"+r.opt));null!=n?r.lines=n:t.feedme().then(function(e){r.lines=t.lines}),r.notes=JSON.parse(localStorage.getItem("comedyNotes"));var a=3;r.move=function(){r.selectedWord="",r.selectedText="";var e=r.myQuery;if(""!=e){var t=e.split(/[,:]/),o=t[0].trim(),n=parseInt(t[1].trim(),10),i=parseInt(t[2].trim(),10),l=i-n;if(0<a){i=i+l+1;var s=(n=n+l+1)%3;0==s&&(n+=1,i+=1),2==s&&(n-=1,i-=1)}a<0&&(n=n-l-1,i=i-l-1,0==s&&(n+=1,i+=1),2==s&&(n-=1,i-=1)),n<0&&(n=1),r.myQuery=o+":"+n.toString()+","+i.toString(),localStorage.setItem("myQuery",r.myQuery)}},r.prev=function(){a=-3,r.move()},r.next=function(){a=3,r.move()},r.change=function(){t.opt(r.opt),localStorage.setItem("myCantoOpt",r.opt)},r.getComedylines=function(){return t.lines},r.$watch("comedyService.rawlines",function(e,t){t!=e&&(r.rawlines=e,localStorage.setItem("myRawlines",r.rawlines))}),r.hoverIn=function(e){r.selectedWord=e.key,r.selectedText=e.text,console.log("hover: "+r.selectedWord)},r.$watch("comedyService.lines",function(e,t){t!=e&&(r.lines=e)}),r.$watch("comedyService.opt",function(e,t){t!=e&&(r.opt=e)})}]).filter("noteFilter",function(){return function(e,t){var l=[];if(""==t)return l;var o=t.split(/[,:]/),s=o[0],r=o[1],a=o[2];return angular.forEach(e,function(e){var t=e.book.split(/[,:]/),o=t[0].toLowerCase(),n=parseInt(t[1]),i=parseInt(t[2]);"inferno"==o&&n==s&&r<=i&&i<=a&&(l.push(e),console.log("book: "+e.book+"\nkey:"+e.key+"\ntext:"+e.text))}),l}}).filter("myCantoFilter",function(){return function(e,t){var o=[];if(""==t)return e;var n=t.split(/[,:]/),i=n[0],l=n[1],s=n[2];return angular.forEach(e,function(e){null!=e.name&&e.name.trim()==i.trim()&&e.line>=l&&e.line<s&&o.push(e)}),o}}),angular.module("comedyApp").controller("NotesCtrl",["$scope","fileReader",function(i,e){i.clear=function(){i.book_name="",i.key="",i.input="",i.ind=-1},i.clear();var t=JSON.parse(localStorage.getItem("comedyNotes"));null==t?(i.items=[{book:"Inferno,1,31",key:"Beasts",text:"- leopard (envy) \n\n- lion (wrath, or pride) \n\n- she-wolf (avarice)\r\n</p>"},{book:"Inferno,1,79",key:"Virgil",text:"Roman Poet, Aeneid"},{book:"Inferno,1,133",key:"Saint Peter",text:"Simon Peter"}],localStorage.setItem("comedyNotes",JSON.stringify(i.items))):i.items=t,i.select=function(e){var t=i.items[e];i.ind=e,i.book_name=t.book,i.key=t.key,i.input=t.text},i.moveItem=function(e){var t=i.ind+e;i.items=function(e,t,o){for(;t<0;)t+=e.length;for(;o<0;)o+=e.length;if(o>=e.length)for(var n=o-e.length;1+n--;)e.push(void 0);return e.splice(o,0,e.splice(t,1)[0]),e}(i.items,i.ind,t),localStorage.setItem("comedyNotes",JSON.stringify(i.items)),i.clear()},i.addItem=function(e,t,o){var n={book:e,key:t,text:o};i.items.push(n),localStorage.setItem("comedyNotes",JSON.stringify(i.items)),i.clear()},i.updateItem=function(e,t,o){if(-1!=i.ind){var n={book:e,key:t,text:o};i.items[i.ind]=n,localStorage.setItem("comedyNotes",JSON.stringify(i.items)),i.clear()}else i.addItem(e,t,o)},i.deleteItem=function(){-1!=i.ind&&(i.items.splice(i.ind,1),localStorage.setItem("comedyNotes",JSON.stringify(i.items)),i.clear())},i.saveJSON=function(e){var t=JSON.stringify(e),o=new Blob([t],{type:"application/json"});i.filename=i.filename||"my_json",saveAs(o,i.filename+".json")},i.getFile=function(){e.readAsText(i.file,i).then(function(e){i.items=JSON.parse(e)||[],localStorage.setItem("comedyNotes",JSON.stringify(i.items)),console.log("getTeam "+i.items.length)})},i.$on("fileProgress",function(e,t){i.progress=t.loaded/t.total})}]).filter("markdown",function(){return(new Showdown.converter).makeHtml}),angular.module("comedyApp").controller("VoyageCtrl",["$scope",function(t){t.selectedIndex=-1,t.current=0,t.setCurrent=function(e){t.current=e},t.selectedItem=[],t.items2=[{name:"Francesca",text:"Love, that releases no beloved from loving took hold of me so strongly through his beauty that, as you see, it has not left me yet."},{name:"Purgatorio",text:"the process of transmuting fleshly into spiritual experience"},{name:"Picarda",text:"And in His will there is our peace: that sea to which all beings move—the beings He creates or nature makes—such is His will."}],t.users=["joseph","james","joseph 22 ","joseph"],t.comments=["comment 1","comment2","",""],t.selectItem=function(e){t.selectedItem=t.items2[e],t.selectedIndex=e}}]),angular.module("comedyApp").controller("SettingsCtrl",["$scope","comedyService","fileReader",function(o,t,e){o.opt=localStorage.getItem("comedyOpt"),null==o.opt&&(o.opt="inferno",localStorage.setItem("comedyOpt",o.opt)),o.items2=[{name:"Inferno",text:"the misery of the spirit bound to the prides and actions of the flash"},{name:"Purgatorio",text:"the process of transmuting fleshly into spiritual experience"},{name:"Paradiso",text:"the degrees of spiritual realization"}],o.users=["joseph","james","joseph 22 ","joseph"],o.comments=["comment 1","comment2","",""],o.change=function(){t.opt(o.opt),t.lines([])},o.isNullOrEmpty=function(e){return null==e||""===e},o.getFile=function(){e.readAsText(o.file,o).then(function(e){o.raw=e.split(/\r?\n/),localStorage.setItem("comedyRawlines",JSON.stringify(o.raw)),t.rawlines(o.raw),t.makelines(),console.log("getRaw "+o.raw)})},o.reset=function(){localStorage.removeItem("comedyNotes"),t.opt(o.opt),t.rawlines([]),t.feedme(),t.makelines()},o.$on("fileProgress",function(e,t){o.progress=t.loaded/t.total}),o.$watch("comedyService.lines",function(e,t){t!=e&&(o.lines=e)}),o.$watch("comedyService.opt",function(e,t){t!=e&&(o.opt=e)})}]).directive("ngFileSelect",function(){return{link:function(t,e){e.bind("change",function(e){t.file=(e.srcElement||e.target).files[0],t.getFile()})}}}).factory("fileReader",["$q","$log",function(n,e){e.log("fileReader");return{readAsText:function(e,t){var o=n.defer();return function(e,t){var o=new FileReader;return o.onload=function(e,t,o){return function(){o.$apply(function(){t.resolve(e.result)})}}(o,e,t),o.onerror=function(e,t,o){return function(){o.$apply(function(){t.reject(e.result)})}}(o,e,t),o.onprogress=function(e,t){return function(e){t.$broadcast("fileProgress",{total:e.total,loaded:e.loaded})}}(0,t),o}(o,t).readAsText(e),o.promise}}}]),angular.module("comedyApp").controller("AboutCtrl",["$scope","comedyService","fileReader",function(o,t,e){o.opt=localStorage.getItem("comedyOpt"),null==o.opt&&(o.opt="inferno",localStorage.setItem("comedyOpt",o.opt)),o.items2=[{name:"Inferno",text:"the misery of the spirit bound to the prides and actions of the flash"},{name:"Purgatorio",text:"the process of transmuting fleshly into spiritual experience"},{name:"Paradiso",text:"the degrees of spiritual realization"}],o.users=["joseph","james","joseph 22 ","joseph"],o.comments=["comment 1","comment2","",""],o.change=function(){t.opt(o.opt),t.lines([])},o.isNullOrEmpty=function(e){return null==e||""===e},o.getFile=function(){e.readAsText(o.file,o).then(function(e){o.raw=e.split(/\r?\n/),localStorage.setItem("comedyRawlines",JSON.stringify(o.raw)),t.rawlines(o.raw),t.makelines(),console.log("getRaw "+o.raw)})},o.$on("fileProgress",function(e,t){o.progress=t.loaded/t.total}),o.$watch("comedyService.lines",function(e,t){t!=e&&(o.lines=e)}),o.$watch("comedyService.opt",function(e,t){t!=e&&(o.opt=e)})}]),angular.module("comedyApp").run(["$templateCache",function(e){e.put("views/about.html",' <section id="about"> <div class="container"> <div class="row"> <div class="col-md-6"> <div class="block"> <ul class="counter-box clearfix"> <li> <div class="block"> <i class="ion-ios-chatboxes-outline"></i> <h4 class="counter"><count-up start="0" step="5" count-to="70" interval="1"></count-up></h4> <span>Life Span</span> </div> </li> <ul class="counter-box clearfix"> <li> <div class="block"> <i class="ion-ios-glasses-outline"></i> <h4 class="counter"><count-up start="0" step="1" count-to="3" interval="1000"></count-up></h4> <span>Root to source</span> </div> </li> <ul class="counter-box clearfix"> <li> <div class="block"> <i class="ion-ios-compose-outline"></i> <h4 class="counter"><count-up count-to="1321" step="1" start="1265" step="10" interval="1"></count-up></h4> <span>Death</span> </div> </li> <ul class="counter-box clearfix"> <li> <div class="block"> <i class="ion-ios-timer-outline"></i> <h4 class="counter"><count-up count-to="1265" step="5" start="1200" interval="1"></count-up></h4> <span>Born</span> </div> </li> </ul> </ul> </ul> </ul> </div> </div> <div class="col-md-6"> <data-owl-carousel class="about-carousel owl-carousel" data-options="{navigation: false, pagination: true, singleItem: true, rewindNav : false}"> <div owl-carousel-item="" ng-repeat="item in ::items2 track by $index" class="owl-item"> <div> <div class="user"> <img src="images/item-img2.1626849d.jpg" alt="People"> <h2>{{item.name}}</h2> </div> <p>{{item.text}}</p> </div> </div> </data-owl-carousel> </div> </div> </div> </section> '),e.put("views/canto.html",'<section id="canto"> <div class="container"> <div class="row"> <div class="col-md-3"> <div class="form-check form-check-inline"> <input class="form-check-input" type="radio" ng-model="opt" value="inferno" ng-change="change()"> <label class="form-check-label">inferno</label> </div> <div class="form-check form-check-inline"> <input class="form-check-input" type="radio" ng-model="opt" value="purgatorio" ng-change="change()"> <label class="form-check-label">purgatorio</label> </div> <div class="form-check form-check-inline"> <input class="form-check-input" type="radio" ng-model="opt" value="paradiso" ng-change="change()"> <label class="form-check-label">paradiso</label> </div> </div> <div class="canto-outline col-md-6"> <div class="" ng-repeat="canto in lines | myCantoFilter: myQuery  track by $index "> <div class="row" ng-if="canto.visible"> <div class="col-1" style="margin:0px 0px 0px 0px;padding:0px 0px; border: 1px solid #f8f9fa;"> <p class="line" style="margin:0px 0px 0px 0px;padding:0px 0px;background-color:#f8f9fa;">{{canto.name}}:{{canto.line}} </p> </div> <div class="col-11" style="padding-left:1px;padding-right:1px"> <p class="canto" ng-bind-html="canto.text | highlight : selectedWord"></p> </div> </div> </div> </div> <div class="col-md-3"> <div class="row"> <form> <div class="form-group row"> <div class="input-group-addon col-sm-1"><i class="fa fa-search"></i></div> <input type="text" class="form-control col-sm-9 offset-sm-1" placeholder="query: start, end" ng-model="myQuery"> </div> </form> </div> <div class="row"> <button class="btn btn-secondary col-sm-3 offset-sm-1" ng-click="prev()"><i class="ion-ios-arrow-left"></i></button> <button class="btn btn-secondary col-sm-3 offset-sm-1" ng-click="next()"><i class="ion-ios-arrow-right"></i></button> </div> <div class="row"> <ul class="list-group list-group-flush"> <li ng-mouseover="hoverIn(comment)" ng-repeat="comment in notes  | noteFilter: myQuery track by $index"> <small>{{comment.key}}</small> </li> </ul> </div> <div class="row" ng-hide="selectedText == \'\'"> <div class="note" ng-bind-html="selectedText  | markdown"></div> </div> </div> </div> </div></section> '),e.put("views/main.html",'<div class="jumbotron jumbotron-fluid"> <div class="container"> <div class="block"> <h1 class="animated fadeInUp">The Divine Comedy</h1> <p class="animated fadeInUp">Inferno, Purgatorio, Paradiso</p> <div ng-hide="ie == 0"> <p class="animated fadeInUp">IE {{ie}}</p> </div> </div> </div> </div> <div class="container"> <p> <strong> Summary </strong> </p> <table class="table table-striped"> <tr> <th> </th> <th> Tx</th> <th> Rx</th> <th> Percentage</th> </tr> <tr> <td> symbols </td> <td>{{txTotalSymbols}} </td> <td>{{rxTotalSymbols}} </td> <td>{{rxTotalSymbols /txTotalSymbols * 100 | number : 2}} </td> </tr> <tr><td> sequences </td> <td> {{txTotalLHs}} </td> <td> {{rxTotalLHs}} </td> <td> {{rxTotalLHs/txTotalLHs * 100 | number : 2}} </td> </tr> </table> <div xwindow> <p ng-if="width > 320">The device window is: [{{width}}, {{height}}].</p> </div> </div> '),e.put("views/notes.html",'<section id="notes"> <div class="container"> <form> <div class="form-group row"> <div class="col-md-3"> <h4><small>Book</small></h4> <input type="text" name="bookname" ng-model="book_name"> <h4><small>Key</small></h4> <input type="text" name="keyword" ng-model="key"> </div> <div class="col-md-6"> <h4><small>Text</small></h4> <textarea ng-model="input" class="form-control" placeholder="Enter Markdown text here" autofocus rows="5" style="max-width: 100%;"></textarea> <div ng-cloak ng-if="input.length > 0"> <h4><small>HTML Preview</small></h4> <div ng-bind-html="input | markdown" class="preview"></div> </div> </div> <div class="col-md-3"> <button class="btn btn-secondary" ng-hide="ind < 0" ng-click="updateItem(book_name, key, input)">Save</button> <button class="btn btn-secondary" ng-hide="ind < 0" ng-click="deleteItem()">Delete</button> <button class="btn btn-secondary" ng-hide="ind < 0" ng-click="moveItem(-1)">Up</button> <button class="btn btn-secondary" ng-hide="ind < 0" ng-click="moveItem(1)">Down</button> <button class="btn btn-secondary" ng-hide="ind >= 0 " ng-click="addItem(book_name, key, input)">Add</button> </div> </div> </form> </div> </section> <section id="notes"> <div class="container"> <table class="table table-hover"> <tbody> <tr class="d-flex" ng-repeat="note in items track by $index " ng-click="select($index)"> <td class="col-sm-3"> <p class="line" style="margin:0px 0px 0px 0px;padding:0px 0px;background-color:#f8f9fa;">{{note.book}} </p> </td> <td class="col-sm-9"> <h4><small>{{note.key}}</small></h4> <div class="preview" ng-bind-html="note.text  | markdown"></div> </td> </tr> </tbody> </table> </div> </section> <section id="notes"> <div class="container"> <div class="col-row"> File Name: <input type="text" ng-model="filename"><br> <button class="btn btn-secondary" ng-click="saveJSON(items)">Save</button> </div> <div class="col-row"> <input type="file" ng-file-select="onFileSelect($files)" class="form-control-file border"> </div> </div> </section> '),e.put("views/settings.html",' <section id="settings"> <div class="container"> <div class="row"> <div class="col-md-12"> <h2> Settings </h2> </div> </div> <div class="row"> <div class="col-md-6"> <div class="form-check form-check-inline"> <input class="form-check-input" type="radio" ng-model="opt" value="inferno" ng-change="change()"> <label class="form-check-label">inferno</label> </div> <div class="form-check form-check-inline"> <input class="form-check-input" type="radio" ng-model="opt" value="purgatorio" ng-change="change()"> <label class="form-check-label">purgatorio</label> </div> <div class="form-check form-check-inline"> <input class="form-check-input" type="radio" ng-model="opt" value="paradiso" ng-change="change()"> <label class="form-check-label">paradiso</label> </div> <form> <b>Import Your Canto:</b> <input type="file" ng-file-select="onFileSelect($files)" class="form-control-file border"> </form> </div> <div class="col-md-6"> <form> <b>Reset:</b><br> <button class="btn btn-secondary" ng-click="reset()">default</button> </form> </div> </div> </div> </section> '),e.put("views/voyage.html",' <section id="voyage"> <div class="container"> <div class="row"> <div class="col-md-12"> <div class="block"> <div class="voyage-menu"> <ul> <li ng-repeat="item in items2 track by $index " ng-click="setCurrent($index)">{{item.name}}</li> </ul> </div> <div class="voyage-content"> {{items2[current].text}} </div> </div> </div> </div> </div> </section> ')}]);