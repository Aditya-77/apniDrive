// load in head necessary static
document.write(
'<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/mdui@0.4.3/dist/css/mdui.min.css">');
document.write(
'<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/plyr/3.6.2/plyr.css">');

// markdown support
document.write(
'<script src="//cdn.jsdelivr.net/npm/markdown-it@10.0.0/dist/markdown-it.min.js"></script>');
document.write(
'<style>.mdui-appbar .mdui-toolbar{height:56px;font-size:1pc}.mdui-toolbar>*{padding:0 6px;margin:0 2px}.mdui-toolbar>i{opacity:.5}.mdui-toolbar>.mdui-typo-headline{padding:0 1pc 0 0}.mdui-toolbar>i{padding:0}.mdui-toolbar>a:hover,a.active,a.mdui-typo-headline{opacity:1}.mdui-container{max-width:980px}.mdui-list-item{transition:none}.mdui-list>.th{background-color:initial}.mdui-list-item>a{width:100%;line-height:3pc}.mdui-list-item{margin:2px 0;padding:0}.mdui-toolbar>a:last-child{opacity:1}@media screen and (max-width:980px){.mdui-list-item .mdui-text-right{display:none}.mdui-container{width:100%!important;margin:0}.mdui-toolbar>.mdui-typo-headline,.mdui-toolbar>a:last-child,.mdui-toolbar>i:first-child{display:block}}</style>');

// Player id definition
document.write(
`<style> .player{margin: 20px 1px 10px 1px;display: static;text-align: center;position: sticky;width: 100%;height: 85vh;color: white;}
.player_iframe {margin: 1px 1px 1px 1px;width: 100%;height: 100%;display: static;text-align: center;border: 10px;color: #FFFFFF;}</style>`);

// add custome theme and darkmode
if(dark){
	document.write('<style>* {box-sizing: border-box}body{color:rgba(255,255,255,.87);background-color:#000000}.mdui-theme-primary-'+main_color+' .mdui-color-theme{background-color:#E50914!important}</style>');}

var id={};

// Initialize the page and load the necessary resources
function init(){
    document.siteName = $('title').html();
    $('body').addClass("mdui-theme-primary-"+main_color+" mdui-theme-accent-"+accent_color);
    var html = "";
    html += `
    <header class="mdui-appbar mdui-color-theme">`
    if(dark){
        html += `
        <div id="nav" class="mdui-toolbar mdui-container mdui-text-color-white-text">
        </div>`;
    }else{
        html += `
        <div id="nav" class="mdui-toolbar mdui-container">
        </div>`;
    }
html += `
    </header>
        <div id="content" class="mdui-container"> 
        </div>`;
    $('body').html(html);
}

// Rendering drive 
function render(path){
	if(path.indexOf("?") > 0){
		path = path.substr(0,path.indexOf("?"));
	}
    title(path);
    nav(path);
    if(path.substr(-1) == '/'){
    	list(path);
    }else{
	    file(path);
    }
}

// Title
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

// Nav
function nav(path) {
	var html = "";
	html += `<a href="/" class="mdui-typo-headline folder">${document.siteName}</a>`;
	var arr = path.trim('/').split('/');
	var p = '/';
	if (arr.length > 0) {
		for (i in arr) {
			var n = arr[i];
			n = decodeURI(n);
			p += n + '/';
			if (n == '') {
				break;
			}
			html += `<i class="mdui-icon material-icons mdui-icon-dark folder" style="margin:0;">chevron_right</i><a class="folder" href="${p}">${n}</a>`;
		}
	}
	html += `<div class="mdui-toolbar-spacer"></div>
    <a href="https://tddown.herokuapp.com" target="_blank" class="mdui-btn mdui-btn-icon mdui-ripple mdui-ripple-white" mdui-tooltip="{content: 'Downloader'}">
 <svg version="1.1" id="Capa_1" viewBox="0 0 384.97 384.97" style="enable-background:new 0 0 384.97 384.97;display: block;margin:10px;" xmlns="http://www.w3.org/2000/svg" height="25px" width="25px">
    <g>
      <path d="M192.485,0C86.185,0,0,86.185,0,192.485C0,298.797,86.185,384.97,192.485,384.97 c106.312,0,192.485-86.173,192.485-192.485C384.97,86.185,298.797,0,192.485,0z M192.485,361.282 c-92.874,0-168.424-75.923-168.424-168.797S99.611,24.061,192.485,24.061s168.424,75.55,168.424,168.424 S285.359,361.282,192.485,361.282z" style="fill: rgb(255, 255, 255); --darkreader-inline-fill:#e8e6e3;" data-darkreader-inline-fill=""></path>
      <path d="M281.196,157.356c-1.612-0.674-3.32-0.95-5.041-0.902H108.429c-10.671-0.289-16.602,12.872-8.926,20.476l84.2,82.997 c4.644,4.596,12.548,4.596,17.191,0l84.104-82.913C291.218,171.083,289.136,160.556,281.196,157.356 C279.584,156.695,285.599,159.137,281.196,157.356C279.584,156.695,285.599,159.137,281.196,157.356 C279.584,156.695,285.599,159.137,281.196,157.356z M192.292,234.447l-54.846-54.064h109.692L192.292,234.447z" style="fill: rgb(255, 255, 255); --darkreader-inline-fill:#e8e6e3;" data-darkreader-inline-fill=""></path>
    </g>
</svg>
    </a>`;
	$('#nav').html(html);
}

// List files
function list(path){
    var content = "";
	content += `
	<div id="head_md" class="mdui-typo" style="display:none;padding: 20px 0;"></div>`;
    if(search){
        if(dark){content += `<div class="mdui-textfield"><input class="mdui-textfield-input mdui-text-color-white-text" id="searchInput" onkeyup="searchOnlyActiveDir()" type="text" placeholder="Type to search.."></input></div>`;
        }else{content += `<div class="mdui-textfield"><input class="mdui-textfield-input" id="searchInput" onkeyup="searchOnlyActiveDir()" type="text" placeholder="Type to search.."></input></div>`;}
    }
	content += `<div class="mdui-row"> 
	  <ul class="mdui-list"> 
	   <li class="mdui-list-item th"> 
	    <div class="mdui-col-xs-12 mdui-col-sm-7">
	    Name
	<i class="mdui-icon material-icons icon-sort" data-sort="name" data-order="more">expand_more</i>
	    </div> 
	    <div class="mdui-col-sm-3 mdui-text-right">
        Date modified
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
	 <div id="readme_md" class="mdui-typo" style="display:none; padding: 20px 0;"></div>
	`;
	$('#content').html(content);
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

function list_files(path,files){
    html = "";
    for(i in files){
        var item = files[i];
        var p = path+item.name+'/';
        if(item['size']==undefined){
            item['size'] = "";
        }

        item['modifiedTime'] = utc2jakarta(item['modifiedTime']);
        item['size'] = formatFileSize(item['size']);
        if(item['mimeType'] == 'application/vnd.google-apps.folder'){
			if(item.name == "Storage"){
					continue;
			}
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
            var ext = p.split('.').pop();
            if("|txt|mp4|webm|avi|m4a|mp3|wav|ogg|mpg|mpeg|mkv|mov|srt|".indexOf(`|${ext}|`) >= 0){
	            p += "?a=view";
	            c += " view";
            }
			if("|mp4|webm|avi|mpg|mpeg|mkv|mov|".indexOf(`|${ext}|`) >=0){
				id[item.name]=item.id;
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

// file display ?a=view
function file(path){
	var name = path.split('/').pop();
	var ext = name.split('.').pop().toLowerCase().replace(`?a=view`,"");
	if("|txt|srt|".indexOf(`|${ext}|`) >= 0){
		return file_code(path);
	}

	if("|mp4|webm|avi|mpg|mpeg|mkv|mov|".indexOf(`|${ext}|`) >= 0){
		return file_video(path,name);
	}
	
	if("|mp3|wav|ogg|m4a|".indexOf(`|${ext}|`) >= 0){
		return file_audio(path);
	}
}

// file display |srt|txt|
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
<pre id="editor" ></pre>
</div>
<div class="mdui-textfield">
	<label class="mdui-textfield-label">Download link</label>
	<input class="mdui-textfield-input" type="text" value="${href}"/>
</div>
<a href="${href}" class="mdui-fab mdui-fab-fixed mdui-ripple mdui-color-theme-accent"><i class="mdui-icon material-icons">file_download</i></a>
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
			maxLines: 40
	    });
	});
}

// file display video |mp4|webm|avi|
function file_video(path,fname){
	var url = window.location.origin + path;
	var adi = id[fname];
	var content = `
<div class="mdui-container-fluid">
	<br>		
	<div class="player">
     		<iframe class="player_iframe" src="https://drive.google.com/file/d/${adi}/preview" webkitallowfullscreen mozallowfullscreen allowfullscreen></webview>
	</div>
	</br>
<a href="${url}" class="mdui-fab mdui-fab-fixed mdui-ripple mdui-color-theme-accent"><i class="mdui-icon material-icons">file_download</i></a>
	`;
	$('#content').html(content);
}

// file display music |mp3|m4a|wav|ogg|
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

document.write('<script src="//cdnjs.cloudflare.com/ajax/libs/mdui/0.4.3/js/mdui.min.js"></script>');

function searchOnlyActiveDir() {
	var e, t, n, l;
	for (e = document.getElementById("searchInput").value.toUpperCase(), t = document.getElementById("list").getElementsByTagName("li"), l = 0; l < t.length; l++)((n = t[l].getElementsByTagName("a")[0]).textContent || n.innerText).toUpperCase().indexOf(e) > -1 ? t[l].style.display = "" : t[l].style.display = "none"
}

// time conversion
function utc2jakarta(utc_datetime) {
    // change to normal time format year-month-day hour: minutes: seconds
    var T_pos = utc_datetime.indexOf('T');
    var Z_pos = utc_datetime.indexOf('Z');
    var year_month_day = utc_datetime.substr(0, T_pos);
    var hour_minute_second = utc_datetime.substr(T_pos + 1, Z_pos - T_pos - 1);
    var new_datetime = year_month_day + " " + hour_minute_second;

    // processing becomes a timestamp
    timestamp = new Date(Date.parse(new_datetime));
    timestamp = timestamp.getTime();
    timestamp = timestamp / 1000;

    // Add 7 hours, Jakarta time is eight more time zones than UTC time
    var unixtimestamp = timestamp + 5.5 * 60 * 60;

    // timestamp into time
    var unixtimestamp = new Date(unixtimestamp * 1000);
    var year = 1900 + unixtimestamp.getYear();
    var month = "0" + (unixtimestamp.getMonth() + 1);
    var date = "0" + unixtimestamp.getDate();
    var hour = "0" + unixtimestamp.getHours();
    var minute = "0" + unixtimestamp.getMinutes();
    var second = "0" + unixtimestamp.getSeconds();
    return year + "-" + month.substring(month.length - 2, month.length) + "-" + date.substring(date.length - 2, date.length) +
        " " + hour.substring(hour.length - 2, hour.length) + ":" +
        minute.substring(minute.length - 2, minute.length) + ":" +
        second.substring(second.length - 2, second.length);
}

// bytes conversion to KB, MB, GB
function formatFileSize(bytes) {
    if (bytes>=1000000000) {bytes=(bytes/1000000000).toFixed(2)+' GB';}
    else if (bytes>=1000000)    {bytes=(bytes/1000000).toFixed(2)+' MB';}
    else if (bytes>=1000)       {bytes=(bytes/1000).toFixed(2)+' KB';}
    else if (bytes>1)           {bytes=bytes+' bytes';}
    else if (bytes==1)          {bytes=bytes+' byte';}
    else                        {bytes='';}
    return bytes;
}

String.prototype.trim = function (char) {
    if (char) {
        return this.replace(new RegExp('^\\'+char+'+|\\'+char+'+$', 'g'), '');
    }
    return this.replace(/^\s+|\s+$/g, '');
};

// README.md HEAD.md support
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
});ñ