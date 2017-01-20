define(function(require, exports, module) {
	var Fiddler = require("fiddler");
	var $ = require("jquery");
	var config = require("config");
	var System = require("system");
	var Calibur = require("calibur");
	var Storage = require("storage");
	require("bootstrap");
	require("bootstrapswitch");
	require('common');
	$('#status').on('click', function(e) {
		Fiddler.ResetCertificate(function() {
			$.statusbar("Root Certificate has been reset.",'info');
		});
	});
	$('#proxyoption').on('click', function(e) {
		Fiddler.OpenWinNet(function() {
		});
	});
	$('#calc').on('click', function(e) {
		Fiddler.RunExecutable('calc','',function() {
		});
	});
	$('#inetmgr').on('click', function(e) {
		Fiddler.RunExecutable('inetmgr','',function() {
		});
	});
	$('#certManager').on('click', function(e) {
		Fiddler.OpenCertManager();
	});


	$('#updateserverhref').attr('href',config.ServerPakage).on('click', function(e){
		if(System.UpdateApplication){
			System.UpdateApplication('Calibur.exe',config.ServerPakage,null);
			e.stopPropagation();
			e.preventDefault();
		}
	});


	var $sethttps = $('#sethttps')
	.bootstrapSwitch('size','small')
	.on('switchChange.bootstrapSwitch', function (e, value) {
		Fiddler.SetHttps(value).ReStart(function(){
			$.statusbar("HTTPS proxy has "+(value?'open':'closed'),'info');
		});
	});
	Calibur.SyncTimer(function(clear){
		Fiddler.GetHttps&&Fiddler.GetHttps(function(isHttps){
			$sethttps.bootstrapSwitch('state',isHttps);
		});
	});

	var $setForceProxys = $('#setForceProxys')
	.bootstrapSwitch('size','small')
	.on('switchChange.bootstrapSwitch', function (e, value) {
		Storage.Set("AutoForceProxy",(value?'true':''),function(isopen){
			$.statusbar("Auto Force Proxy has "+(value?'open':'closed'),'info');
		});
	});
	Calibur.SyncTimer(function(clear){
		Storage.Get&&Storage.Get("AutoForceProxy",function(isopen){
			$setForceProxys.bootstrapSwitch('state',!!isopen);
			clear();
		});
	});

	var $portno = $('#portno')
	   ,$setport = $('#setport').on('click', function (e) {
	   	var port = parseInt($portno.val());
	   	if(port){
	   		Fiddler.SetPort(port).ReStart(function(){
				$.statusbar("Proxy port has been set to " + port,'info');
			});
	   	}else{
	   		$.statusbar("The format('"+$portno.val()+"') of Proxy port is invalid.",'danger');
	   	}
	});


	//更新
	Calibur.SyncTimer(function(clear){
		var version = config.Version;
		var newVersion = function(){
			var $popup = $.showPopup('Update',
				'A new version can be updated.',
				'<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button><button type="button" class="btn btn-success updatenewversion">Update</button>');
			$popup.find('.updatenewversion').on('click',function(){
				System.UpdateApplication('Calibur.exe',config.ServerPakage,null);
			});

			setStorageValueByKey("showUpdateVersion",version,function(){

			});
			//localStorage.showUpdateVersion=version;
		};
		if(!$.isEmptyObject(System)&&!System.CompareVersion){
			newVersion();
		}
		System.CompareVersion&&System.CompareVersion(version,function(sysversion){
			clear();
			if(sysversion < 0){
				if(getStorageValueByKey('showUpdateVersion')!==version){
					var $popup = $.showPopup('Update',
						'A new version can be updated.',
						'<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button><button type="button" class="btn btn-success updatenewversion">Update</button>');
					$popup.find('.updatenewversion').on('click',function(){
						System.UpdateApplication('Calibur.exe',config.ServerPakage,null);
					});
					setStorageValueByKey("showUpdateVersion",version,function(){
					});
					//localStorage.showUpdateVersion=version;
				}
				$('#settingtab').html('.');		
				$('#updateserver').show();
			}
		});
	});

    function setStorageValueByKey(key,value,callback){
    	//localStorage['AutoResponserSettings'] = JSON.stringify(zTree.getNodes());
    	if( key!=null && value!=null){
	    	if(typeof value != "string"){
	    		value = JSON.stringify(value);
	    	}
	    	Storage.Set(key,value,function(isopen){
	    		if(callback != null && typeof callback == 'function' && isopen){
	    			callback();
	    		}
			});
	    }
    }

    function getStorageValueByKey(key){
    	//return localStorage['AutoResponserSettings'];
		//换成本地文件 发送请求
		var retVal = "";
		
		key!=null&&Storage.Get&&Storage.Get(key,function(msg){
			retVal = msg;
		});
		return retVal;
	}

	//设置初始化端口号
    Calibur.SyncTimer(function(clear){
		Fiddler.GetPort&&Fiddler.GetPort(function(port){
			clear();
    		$portno.val(port);
    	});
	});
	//设置初始化IP
    Calibur.SyncTimer(function(clear){
		System.GetAddressIP&&System.GetAddressIP(function(ip){
			clear();
			$('#ipaddress').html(ip);
		});
	});

    //设置Clear Session Strategy
    var $setMaxLines = $('#setMaxLines').on('click',function(){
    	var maxLines = +$('#ssnMaxLines').val();
    	Storage.Set("MaxLines",(isNaN(maxLines)?'1000':''+maxLines));    
    });
    // var $setMaxLines = $('#setMaxSpan').on('click',function(){
    // 	var maxSpan = +$('#ssnMaxSpan').val();
    // 	Storage.Set("MaxTimeSpan",(isNaN(maxSpan)?'600':''+maxSpan));
    // });

    //初始化Clear Session Strategy
	Calibur.SyncTimer(function(clear){
		Storage.Get&&Storage.Get("MaxLines",function(maxLines){
			maxLines=isNaN(+maxLines)?'1000':''+maxLines;
			Storage.Set("MaxLines",maxLines);
			$('#ssnMaxLines').val(maxLines);
			clear();
		});
		//&&Storage.Get("MaxTimeSpan",function(maxSpan){
		// 	$('#ssnMaxSpan').val(maxSpan);
		// 	clear();
		// });
	});
});
