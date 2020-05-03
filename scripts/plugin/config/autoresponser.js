define(function(require, exports, module) {
	exports.config = [{
		"id": 1,
		"text": "1eeqw",
		"pId": null,
		"name": "AutoResponser",
		"drag": false,
		"open": true,
		"children": [{
			"id": 11,
			"pId": 1,
			"name": "服务代理",
			"open": true,
			"children": [{
				"id": 101,
				"pId": 11,
				"name": "Detail代理v3",
				"level": 2,
				"tId": "autoResponserTree_3",
				"parentTId": "autoResponserTree_2",
				"open": false,
				"isParent": false,
				"zAsync": true,
				"isFirstNode": true,
				"isLastNode": false,
				"isAjaxing": false,
				"checked": false,
				"checkedOld": false,
				"nocheck": false,
				"chkDisabled": false,
				"halfCheck": false,
				"check_Child_State": -1,
				"check_Focus": false,
				"isHover": false,
				"editNameFlag": false,
				"requestScript": "var session = context.session;\r\nif (session.FullUrl.indexOf('/GetOrderDetail.json') > -1) {\r\n\r\n    session.GetRequestBodyAsString(function(ssn) {\r\n        var requestBody = JSON.parse(ssn.Return || \"{}\");\r\n        if (requestBody && requestBody.RequestType === 1) {\r\n            session.SetfullUrl(\"http://localhost:3915/GetOrderDetailV3.json\");\r\n        }\r\n    });\r\n}"
			}, {
				"id": 112,
				"pId": 11,
				"name": "前端fws代理本地服务",
				"level": 2,
				"tId": "autoResponserTree_4",
				"parentTId": "autoResponserTree_2",
				"open": false,
				"isParent": false,
				"zAsync": true,
				"isFirstNode": false,
				"isLastNode": false,
				"isAjaxing": false,
				"isHover": false,
				"editNameFlag": false,
				"checked": false,
				"checkedOld": false,
				"nocheck": false,
				"chkDisabled": false,
				"halfCheck": false,
				"check_Child_State": -1,
				"check_Focus": false,
				"responseScript": "",
				"requestScript": "var session = context.session;\nif(/.+\\/10124\\/(.+?)(\\?.*)?/.test(session.FullUrl))\n{\n session.SetfullUrl(session.FullUrl.replace(\n /.+\\/10124\\/(.+?)(\\?.*)?/,\n \"http://localhost:3915/$1\")\n );\n}\n"
			}, {
				"id": 113,
				"pId": 11,
				"name": "跨域",
				"level": 2,
				"tId": "autoResponserTree_5",
				"parentTId": "autoResponserTree_2",
				"open": false,
				"isParent": false,
				"zAsync": true,
				"isFirstNode": false,
				"isLastNode": true,
				"isAjaxing": false,
				"isHover": false,
				"editNameFlag": false,
				"checked": false,
				"checkedOld": false,
				"nocheck": false,
				"chkDisabled": false,
				"halfCheck": false,
				"check_Child_State": -1,
				"check_Focus": false,
				"responseScript": "var session = context.session;\nvar csrfHeaders = {\n \"Access-Control-Allow-Headers\": \"accept, content-type, cookieorigin\",\n \"Access-Control-Allow-Origin\":session.RequestHeaders.Origin || \"*\",\n \"Access-Control-Allow-Credentials\": \"true\",\n \"Access-Control-Allow-Methods\":\"POST\",\n};\nsession.SetResponseHeaders(JSON.stringify(csrfHeaders));\n\n"
			}],
			"level": 1,
			"tId": "autoResponserTree_2",
			"parentTId": "autoResponserTree_1",
			"isParent": true,
			"zAsync": true,
			"isFirstNode": true,
			"isLastNode": false,
			"isAjaxing": false,
			"isHover": false,
			"editNameFlag": false,
			"checked": false,
			"checkedOld": false,
			"nocheck": false,
			"chkDisabled": false,
			"halfCheck": false,
			"check_Child_State": 0,
			"check_Focus": false
		}, {
			"id": 12,
			"pId": 1,
			"name": "飞燕缓存",
			"open": true,
			"children": [{
				"id": 122,
				"pId": 12,
				"name": "实时不刷缓存",
				"level": 2,
				"tId": "autoResponserTree_7",
				"parentTId": "autoResponserTree_6",
				"open": false,
				"isParent": false,
				"zAsync": true,
				"isFirstNode": true,
				"isLastNode": false,
				"isAjaxing": false,
				"isHover": true,
				"editNameFlag": false,
				"checked": false,
				"checkedOld": false,
				"nocheck": false,
				"chkDisabled": false,
				"halfCheck": false,
				"check_Child_State": -1,
				"check_Focus": false,
				"requestScript": "var session = context.session;\nif(session.FullUrl.indexOf('ProductDetailV3') > -1)\n{\n var lastRequestBody = null;\n session.GetRequestBodyAsString(function(ssn){\n var requestBody = JSON.parse(ssn.Return||\"{}\");\n if(requestBody&&requestBody.RequestTypeList){\n requestBody.D = {D:true,T:true};\n lastRequestBody = JSON.stringify(requestBody);\n session.UtilSetRequestBody(lastRequestBody);\n }\n });\n \n}"
			}, {
				"id": 121,
				"pId": 12,
				"name": "强刷缓存",
				"level": 2,
				"tId": "autoResponserTree_8",
				"parentTId": "autoResponserTree_6",
				"open": false,
				"isParent": false,
				"zAsync": true,
				"isFirstNode": false,
				"isLastNode": true,
				"isAjaxing": false,
				"isHover": false,
				"editNameFlag": false,
				"checked": false,
				"checkedOld": false,
				"nocheck": false,
				"chkDisabled": false,
				"halfCheck": false,
				"check_Child_State": -1,
				"check_Focus": false,
				"requestScript": "var session = context.session;\nif(session.FullUrl.indexOf('ProductDetailV3') > -1)\n{\n var lastRequestBody = null;\n session.GetRequestBodyAsString(function(ssn){\n var requestBody = JSON.parse(ssn.Return||\"{}\");\n if(requestBody&&requestBody.RequestTypeList){\n requestBody.D = {D:true,T:true,F:true};\n lastRequestBody = JSON.stringify(requestBody);\n session.UtilSetRequestBody(lastRequestBody);\n }\n });\n}\n"
			}],
			"level": 1,
			"tId": "autoResponserTree_6",
			"parentTId": "autoResponserTree_1",
			"isParent": true,
			"zAsync": true,
			"isFirstNode": false,
			"isLastNode": false,
			"isAjaxing": false,
			"isHover": false,
			"editNameFlag": false,
			"checked": false,
			"checkedOld": false,
			"nocheck": false,
			"chkDisabled": false,
			"halfCheck": false,
			"check_Child_State": 0,
			"check_Focus": false
		}, {
			"id": 13,
			"pId": 1,
			"name": "ABTesting",
			"open": true,
			"children": [{
				"id": 131,
				"pId": 13,
				"name": "ab_testing_tracker",
				"level": 2,
				"tId": "autoResponserTree_10",
				"parentTId": "autoResponserTree_9",
				"open": false,
				"isParent": false,
				"zAsync": true,
				"isFirstNode": true,
				"isLastNode": true,
				"isAjaxing": false,
				"isHover": false,
				"editNameFlag": false,
				"checked": false,
				"checkedOld": false,
				"nocheck": false,
				"chkDisabled": false,
				"halfCheck": false,
				"check_Child_State": -1,
				"check_Focus": false,
				"responseScript": "var session = context.session;\r\nvar contentType = session.ResponseHeaders['Content-Type'];\r\nif (contentType && contentType.indexOf('text/html') > -1 && (session.Host.indexOf('xxxx.com') > -1 || session.Host.indexOf('xxxxXxxx.com') > -1)) {\r\n\tvar abTestingMapping = {\r\n\t\t\"151123_vag_LTHY\": \"B\",\r\n\t\t\"151123_vag_PSHY\": \"B\",\r\n\t\t\"151125_dya_SPDH5\": \"B\",\r\n\t\t\"151216_dya_PSH5\": \"B\"\r\n\t};\r\n\r\n\tif (abTestingMapping) {\r\n\t\tsession.GetResponseBodyAsString(function(ssn) {\r\n\t\t\tvar html = ssn.Return;\r\n\t\t\tvar re_abTesting = /value=\\\"((M:.+?;)*)\\\"/;\r\n\t\t\tvar splitData = html.split(re_abTesting);\r\n\t\t\tif (splitData) {\r\n\t\t\t\tabData = splitData[1];\r\n\t\t\t\tfor (var abKey in abTestingMapping) {\r\n\t\t\t\t\tif (abData.indexOf(abKey) > -1) {\r\n\t\t\t\t\t\tabData = abData.replace(\r\n\t\t\t\t\t\t\tnew RegExp('(' + abKey + ':)(.)'),\r\n\t\t\t\t\t\t\t'$1' + abTestingMapping[abKey]\r\n\t\t\t\t\t\t);\r\n\t\t\t\t\t} else {\r\n\t\t\t\t\t\tabData += 'M:32,' + abKey + ':' + abTestingMapping[abKey] + ';';\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\t\t\t\thtml = splitData[0] + 'value=\"' + abData + '\"' + splitData[3];\r\n\t\t\t}\r\n\t\t\treturn html;\r\n\t\t}).UtilSetResponseBody({\r\n\t\t\t'inc': null,\r\n\t\t\t'met': function(ssn,msg) {\r\n\t\t\t\treturn [msg.LastReturn];\r\n\t\t\t}\r\n\t\t});\r\n\t}\r\n}",
				"requestScript": ""
			}],
			"level": 1,
			"tId": "autoResponserTree_9",
			"parentTId": "autoResponserTree_1",
			"isParent": true,
			"zAsync": true,
			"isFirstNode": false,
			"isLastNode": false,
			"isAjaxing": false,
			"isHover": false,
			"editNameFlag": false,
			"checked": false,
			"checkedOld": false,
			"nocheck": false,
			"chkDisabled": false,
			"halfCheck": false,
			"check_Child_State": 0,
			"check_Focus": false
		}, {
			"id": 101,
			"pId": 1,
			"name": "response",
			"level": 1,
			"tId": "autoResponserTree_11",
			"parentTId": "autoResponserTree_1",
			"open": true,
			"isParent": true,
			"zAsync": true,
			"isFirstNode": false,
			"isLastNode": true,
			"isAjaxing": false,
			"checked": false,
			"checkedOld": false,
			"nocheck": false,
			"chkDisabled": false,
			"halfCheck": false,
			"check_Child_State": 0,
			"check_Focus": false,
			"isHover": false,
			"editNameFlag": false,
			"children": [{
				"id": 102,
				"pId": 101,
				"name": "ProtoBuff",
				"level": 2,
				"tId": "autoResponserTree_12",
				"parentTId": "autoResponserTree_11",
				"open": false,
				"isParent": false,
				"zAsync": true,
				"isFirstNode": true,
				"isLastNode": false,
				"isAjaxing": false,
				"checked": false,
				"checkedOld": false,
				"nocheck": false,
				"chkDisabled": false,
				"halfCheck": false,
				"check_Child_State": -1,
				"check_Focus": false,
				"isHover": false,
				"editNameFlag": false,
				"responseScript": "var session = context.session;\nif(/.+\\/GetProtoBuf/.test(session.FullUrl))\n{\n    session.GetResponseBodyAsString(function(ssn) {\n        var response = JSON.parse(ssn.Return||\"{}\");\n        return response.Data;\n    }).UtilSetResponseBody({\n\t\t'inc': null,\n\t\t'met': function(ssn,msg) {\n\t\t\treturn [msg.LastReturn];\n\t\t}\n\t}).SetResponseHeaders(JSON.stringify({'Content-Type':'application/xml'}));\n}"
			}, {
				"id": 101,
				"pId": 101,
				"name": "Root_cert",
				"level": 2,
				"tId": "autoResponserTree_13",
				"parentTId": "autoResponserTree_11",
				"open": false,
				"isParent": false,
				"zAsync": true,
				"isFirstNode": false,
				"isLastNode": false,
				"isAjaxing": false,
				"checked": false,
				"checkedOld": false,
				"nocheck": false,
				"chkDisabled": false,
				"halfCheck": false,
				"check_Child_State": -1,
				"check_Focus": false,
				"isHover": false,
				"editNameFlag": false,
				"responseScript": "",
				"requestScript": "var session = context.session;\r\nif(session.FullUrl.indexOf('calibur.com/root.cer')>-1)\r\n{\r\n    session.manual=true;\r\n    Fiddler.GetBase64RootCertificate(function(base64){\r\n        session.SetBypassGateway(true)\r\n\t\t   .UtilCreateResponseAndBypassServer()\r\n\t\t   .SetResponseBodyAsBase64(base64)\r\n\t\t   .UtilChunkResponse(1)\r\n\t\t   .Resume();\r\n    });\r\n}"
			}]
		}],
		"level": 0,
		"tId": "autoResponserTree_1",
		"parentTId": null,
		"isParent": true,
		"zAsync": true,
		"isFirstNode": true,
		"isLastNode": true,
		"isAjaxing": false,
		"isHover": true,
		"editNameFlag": false,
		"checked": false,
		"checkedOld": false,
		"nocheck": null,
		"chkDisabled": false,
		"halfCheck": false,
		"check_Child_State": 0,
		"check_Focus": false
	}];
});
