// In the head medium loading necessary static
document.write('<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/mdui@0.4.3/dist/css/mdui.min.css">');

// markdown support
document.write('<script src="//cdn.jsdelivr.net/npm/markdown-it@10.0.0/dist/markdown-it.min.js"></script>');
document.write(`<style>.mdui-appbar .mdui-toolbar{height:56px;font-size:1pc}
.mdui-toolbar>*{padding:0 6px;margin:0 2px}
.mdui-toolbar>i{opacity:.5}.mdui-toolbar>.mdui-typo-headline{padding:0 1pc 0 0}
.mdui-toolbar>i{padding:0}.mdui-toolbar>a:hover,a.active,a.mdui-typo-headline{opacity:1}
.mdui-container{max-width:980px}.mdui-list-item{transition:none}.mdui-list>
.th{background-color:initial}.mdui-list-item>a{width:100%;line-height:3pc}
.mdui-list-item{margin:2px 0;padding:0}
.mdui-toolbar>a:last-child{opacity:1}@media screen and (max-width:980px){.mdui-list-item .mdui-text-right{display:none}
.mdui-container{width:100%!important;margin:0}.mdui-toolbar>.mdui-typo-headline,.mdui-toolbar>a:last-child,
.mdui-toolbar>i:first-child{display:block}}</style>`);

// Player id definition
document.write(`<style> .player{margin: 20px 1px 10px 1px;display: static;text-align: center;position: sticky;width: 100%;height: 85vh;color: white;}
.player_iframe {margin: 1px 1px 1px 1px;width: 100%;height: 100%;display: static;text-align: center;border: 10px;color: #FFFFFF;}</style>`);

// add custome theme and darkmode
document.write(`<style>* {box-sizing: border-box}
body{color:rgba(255,255,255,.87);
background-color:#333232}
.mdui-theme-primary-grey .mdui-color-theme{background-color:#232427!important}</style>`);


var id;

// Initialize the page and load the necessary resources
function init(){
    document.siteName = $('title').html();
    $('body').addClass("mdui-theme-primary-blue-grey mdui-theme-accent-blue");
    var html = `
<header class="mdui-appbar mdui-color-theme"> 
   <div id="nav" class="mdui-toolbar mdui-container"> 
   </div> 
</header>
<div id="content" class="mdui-container"> 
</div>
	`;
    $('body').html(html);
}

// Rendering drive 
function render(path){
	if(path.indexOf("?") > 0){
		path = path.substr(0,path.indexOf("?"));
	}
    title(path);
    nav(path);
	var reg = /\/\d+:$/g;
    if(path.substr(-1) == '/'){
    	list(path);
    }else{
	    file(path);
    }
}

// Rendering title
function title(path){
    path = decodeURI(path);
    var tname = path.split('/').pop();
    var tempd = path.split('/');
    if(tname == ''){
        tempd.pop();
	tname = tempd.pop();
    }
    $('title').html(document.siteName+' - '+tname);
}

// Render the navigation bar
function nav(path){
    var html = "";
    html += `<a href="/" class="mdui-typo-headline folder">${document.siteName}</a>`;
    var arr = path.trim('/').split('/');
    var p = '/';
    if(arr.length > 0){
        for(i in arr){
            var n = arr[i];
            n = decodeURI(n);
            p += n+'/';
            if(n == ''){
                break;
            }
            html += `<i class="mdui-icon material-icons mdui-icon-dark folder" style="margin:0;">chevron_right</i><a class="folder" href="${p}">${n}</a>`;
        }
    }
    $('#nav').html(html);
}

// Render file list
function list(path){
	var content = `
		<div id="head_md" class="mdui-typo" style="display:none;padding: 20px 0;"></div>

		 <div class="mdui-row"> 
		  <ul class="mdui-list"> 
		   <li class="mdui-list-item th"> 
			<div class="mdui-col-xs-12 mdui-col-sm-7">
			 Name
		<i class="mdui-icon material-icons icon-sort" data-sort="name" data-order="more">expand_more</i>
			</div> 
			<div class="mdui-col-sm-3 mdui-text-right">
			 Date Modified
		<i class="mdui-icon material-icons icon-sort" data-sort="date" data-order="downward">expand_more</i>
			</div> 
			<div class="mdui-col-sm-2 mdui-text-right">
			 Size
		<i class="mdui-icon material-icons icon-sort" data-sort="size" data-order="downward">expand_more</i>
			</div> 
			</li> 
		  </ul> 
		 </div> 
		 <div class="mdui-row"> 
		  <ul id="list" class="mdui-list"> 
		  </ul> 
		 </div>
		 <div id="count" class="mdui-hidden mdui-center mdui-text-center mdui-m-b-3 mdui-typo-subheading mdui-text-color-blue-grey-500">Total <span class="number"></span> items</div>
		 <div id="readme_md" class="mdui-typo" style="display:none; padding: 20px 0;"></div>
	`;
	$('#content').html(content);
	
    //var password = localStorage.getItem('password'+path);
    var password = sessionStorage.getItem('password'+path);
    $('#list').html(`<div class="mdui-progress"><div class="mdui-progress-indeterminate"></div></div>`);
    $('#readme_md').hide().html('');
    $('#head_md').hide().html('');
    $.post(path,'{"password":"'+password+'"}', function(data,status){
        var obj = jQuery.parseJSON(data);
        if(typeof obj != 'null' && obj.hasOwnProperty('error') && obj.error.code == '401'){
            var pass = prompt("Password:","");
            //localStorage.setItem('password'+path, pass);
            sessionStorage.setItem('password'+path, pass);
            if(pass != null && pass != ""){
                list(path);
            }else{
                history.go(-1);
            }
        }else if(typeof obj != 'null'){
            list_files(path,obj.files);
        }
    });
}

//This lists the files according to the extension that are allowed
function list_files(path,files){
    html = "";
    for(i in files){
        var item = files[i];
        var p = path+item.name+'/';
        if(item['size']==undefined){
            item['size'] = "";
        }

        item['modifiedTime'] = utc2beijing(item['modifiedTime']);
        item['size'] = formatFileSize(item['size']);
        if(item['mimeType'] == 'application/vnd.google-apps.folder'){
            html +=`<li class="mdui-list-item mdui-ripple"><a href="${p}" class="folder">
	            <div class="mdui-col-xs-12 mdui-col-sm-7 mdui-text-truncate">
	            <i class="mdui-icon material-icons">folder_open</i>
	              ${item.name}
	            </div>
	            <div class="mdui-col-sm-3 mdui-text-right">${item['modifiedTime']}</div>
	            <div class="mdui-col-sm-2 mdui-text-right">${item['size']}</div>
	            </a>
	        </li>`;
        }else{
            var p = path+item.name;
            var c = "file";
		    // When the last page is loaded, README is displayed, otherwise it will affect the scroll event
            if(item.name == "README.md"){
                 get_file(p, item, function(data){
                    markdown("#readme_md",data);
                });
            }
            if(item.name == "HEAD.md"){
	            get_file(p, item, function(data){
                    markdown("#head_md",data);
                });
            }
            
			// Checking extension
			var ext = p.split('.').pop();
            if("|txt|mp4|webm|avi|m4a|mp3|wav|ogg|mpg|mpeg|mkv|mov|srt|".indexOf(`|${ext}|`) >= 0){
	            p += "?a=view";
	            c += " view";
            }
			if("|mp4|webm|avi|mpg|mpeg|mkv|mov|".indexOf(`|${ext}|`) >=0){
				id=item.id;
			}
            html += `<li class="mdui-list-item file mdui-ripple" target="_blank"><a gd-type="${item.mimeType}" href="${p}" class="${c}">
	          <div class="mdui-col-xs-12 mdui-col-sm-7 mdui-text-truncate">
	          <i class="mdui-icon material-icons">insert_drive_file</i>
	            ${item.name}
	          </div>
	          <div class="mdui-col-sm-3 mdui-text-right">${item['modifiedTime']}</div>
	          <div class="mdui-col-sm-2 mdui-text-right">${item['size']}</div>
	          </a>
	      </li>`;
        }
    }
    $('#list').html(html);
}

function get_file(path, file, callback){
	var key = "file_path_"+path+file['modifiedTime'];
	var data = localStorage.getItem(key);
	if(data != undefined){
		return callback(data);
	}else{
		$.get(path, function(d){
			localStorage.setItem(key, d);
            callback(d);
        });
	}
}

// File display: ?a=view
function file(path){
	var name = path.split('/').pop();
	var ext = name.split('.').pop().toLowerCase().replace(`?a=view`,"");
	if("|txt|srt|".indexOf(`|${ext}|`) >= 0){
		return file_code(path);
	}

	if("|mp4|webm|avi|".indexOf(`|${ext}|`) >= 0){
		return file_video(path);
	}

	if("|mpg|mpeg|mkv|mov|".indexOf(`|${ext}|`) >= 0){
		return file_video(path);
	}
	
	if("|mp3|wav|ogg|m4a|".indexOf(`|${ext}|`) >= 0){
		return file_audio(path);
	}

}

// File display: Text |txt|srt|
function file_code(path){
	var type = {
    "srt": "srt",
    "txt": "Text",
	};
	var name = path.split('/').pop();
	var ext = name.split('.').pop();
	var href = window.location.origin + path;
	var content = `
<div class="mdui-container">
<pre id="editor" height=80vh></pre>
</div>

<script src="https://cdn.staticfile.org/ace/1.4.7/ace.js"></script>
<script src="https://cdn.staticfile.org/ace/1.4.7/ext-language_tools.js"></script>
	`;
	$('#content').html(content);
	
	$.get(path, function(data){
		$('#editor').html($('<div/>').text(data).html());
		var code_type = "Text";
		if(type[ext] != undefined ){
			code_type = type[ext];
		}
		var editor = ace.edit("editor");
	    editor.setTheme("ace/theme/ambiance");
	    editor.setFontSize(13);
	    editor.session.setMode("ace/mode/"+code_type);
	    editor.session.setUseWrapMode(true);

	    //Autocompletion
	    editor.setOptions({
	        enableBasicAutocompletion: true,
		autoScrollEditorIntoView: true,
	        enableSnippets: true,
	        enableLiveAutocompletion: true,
		//
		maxLines: 40
		//
	    });
	});
}

// File display: Video |mp4|webm|avi|
function file_video(path){
	var url = window.location.origin + path;	
	var content = `
<div class="mdui-container-fluid">
     <div class="mdui-container-fluid">
	<br>		
	<div class="player">
     		<iframe class="player_iframe" src="https://drive.google.com/file/d/${id}/preview" webkitallowfullscreen mozallowfullscreen allowfullscreen></webview>
	</div>
	</br>
     </div>
</div>
<a href="${url}" class="mdui-fab mdui-fab-fixed mdui-ripple mdui-color-theme-accent"><i class="mdui-icon material-icons">file_download</i></a>
	`;
	$('#content').html(content);
}

//File display: Audio |mp3|flac|m4a|wav|ogg|
function file_audio(path){
	var url = window.location.origin + path;
	var content = `
<div class="mdui-container-fluid">
	<br>
	<audio class="mdui-center" preload controls>
	  <source src="${url}"">
	</audio>
	<br>
</div>
<a href="${url}" class="mdui-fab mdui-fab-fixed mdui-ripple mdui-color-theme-accent"><i class="mdui-icon material-icons">file_download</i></a>
	`;
	$('#content').html(content);
}

// Time Conversion
function utc2beijing(utc_datetime) {
    // Convert to normal time format year-month-day hour: minute: second
    var T_pos = utc_datetime.indexOf('T');
    var Z_pos = utc_datetime.indexOf('Z');
    var year_month_day = utc_datetime.substr(0,T_pos);
    var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
    var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06

    // Processing becomes timestamp
    timestamp = new Date(Date.parse(new_datetime));
    timestamp = timestamp.getTime();
    timestamp = timestamp/1000;

    // Add 8 hours, Beijing time is eight time zones more than UTC time
    var unixtimestamp = timestamp+5.5*60*60;

    // Timestamp to time
    var unixtimestamp = new Date(unixtimestamp*1000);
    var year = 1900 + unixtimestamp.getYear();
    var month = "0" + (unixtimestamp.getMonth() + 1);
    var date = "0" + unixtimestamp.getDate();
    var hour = "0" + unixtimestamp.getHours();
    var minute = "0" + unixtimestamp.getMinutes();
    var second = "0" + unixtimestamp.getSeconds();
    return year + "-" + month.substring(month.length-2, month.length)  + "-" + date.substring(date.length-2, date.length)
        + " " + hour.substring(hour.length-2, hour.length) + ":"
        + minute.substring(minute.length-2, minute.length) + ":"
        + second.substring(second.length-2, second.length);
}

// Displaing size in readable form
function formatFileSize(bytes) {
    if (bytes>=1000000000) {bytes=(bytes/1000000000).toFixed(2)+' GB';}
    else if (bytes>=1000000)    {bytes=(bytes/1000000).toFixed(2)+' MB';}
    else if (bytes>=1000)       {bytes=(bytes/1000).toFixed(2)+' KB';}
    else if (bytes>1)           {bytes=bytes+' bytes';}
    else if (bytes==1)          {bytes=bytes+' byte';}
    else                        {bytes='';}
    return bytes;
}

// URL Trim
String.prototype.trim = function (char) {
    if (char) {
        return this.replace(new RegExp('^\\'+char+'+|\\'+char+'+$', 'g'), '');
    }
    return this.replace(/^\s+|\s+$/g, '');
};

// README.md HEAD.md stand by
function markdown(el, data){
    if(window.md == undefined){
        //$.getScript('https://cdn.jsdelivr.net/npm/markdown-it@10.0.0/dist/markdown-it.min.js',function(){
        window.md = window.markdownit();
        markdown(el, data);
        //});
    }else{
        var html = md.render(data);
        $(el).show().html(html);
    }
}

// Listen for fallback events
window.onpopstate = function(){
    var path = window.location.pathname;
    render(path);
}

// Function to render path
$(function(){
    init();
    var path = window.location.pathname;
    $("body").on("click",'.folder',function(){
        var url = $(this).attr('href');
        history.pushState(null, null, url);
        render(url);
        return false;
    });

    $("body").on("click",'.view',function(){
        var url = $(this).attr('href');
        history.pushState(null, null, url);
        render(url);
        return false;
    });
    
    render(path);
});
