/**********************************************************************************
 *   Description : 통합 함수 정의
 *   Author      : credit@mediaset.co.kr
 *   Date        : 2011/09/05
 *   Update      : 2012-01-28-1039
 *   Copyright (C) MEDIASET corporation.  
 **********************************************************************************/

$.fn.maxHeight = function() {
	var max = 0;
	this.each(function() {
	  max = Math.max( max, $(this).height() );
	});
	return max;
};
$.fn.maxWidth = function() {
	var max = 0;
	this.each(function() {
	  max = Math.max( max, $(this).width() );
	});
	return max;
};

//콘솔 DEBUG
var debug = function(){
	
  // check browser has console
  if(typeof console != 'undefined' && typeof console.log != 'undefined'){
	  
	console['info'](arguments); // call Firebug's console	
  }
}

/** 
 * 날짜 변환 함수
 * : 8자리 문자형 숫자를 날짜 타입으로 변환
 * ex) 20120201 -> 2012.02.01
 */
String.prototype.dateform1 = function(){
	
	if(null == this){
		return "";
	}
	
    var orival= this.toString();
    
    if(orival.length != 8){
    	return "";
    }
    
    return orival.substr(0, 4) + "." + orival.substr(4, 2) + "." + orival.substr(6, 2);
};

/** 
 * 날짜 변환 함수2
 * : 8자리 문자형 숫자를 날짜 타입으로 변환
 * ex) 20120201 -> 12.02.01
 */
String.prototype.dateform2 = function(){
	
	if(null == this){
		return "";
	}
	
    var orival= this.toString();
    
    if(orival.length != 8){
    	return "";
    }
   
    return orival.substr(2, 2) + "." + orival.substr(4, 2) + "." + orival.substr(6, 2);
};

/** 
 * 날짜 변환 함수3
 * : 12자리 문자형 숫자를 날짜 타입으로 변환
 * ex) 20120201123456 -> 12.02.01 12:34:56
 */
String.prototype.dateform3 = function(){
	
    var orival= this.toString();
    if(orival.length != 14)
    	return "";
    
    var makeval = "";
    makeval = orival.substr(2, 2) + "." + orival.substr(4, 2) + "." + orival.substr(6, 2) + " " 
    + orival.substr(8, 2) + ":" + orival.substr(10, 2) + ":" + orival.substr(12, 2) ;
   
    return makeval;
};


/**
 * 숫자 콤마 포멧 변환 함수
 * : 숫자 타입에서 쓸 수 있도록 format() 함수 추가
 */
Number.prototype.format = function(){
	
    if(this==0) return 0;
 
    var reg = /(^[+-]?\d+)(\d{3})/;
    var n = (this + '');
 
    while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');
 
    return n;
};

/** 
 * 숫자 콤마 포멧 변환 함수
 * : 문자열 타입에서 쓸 수 있도록 format() 함수 추가
 */
String.prototype.format = function(){
	
    var num = parseFloat(this);
    
    if( isNaN(num) ) return "0";
 
    return num.format();
};

String.prototype.trim = function() { //전체공백제거
       return this.replace(/^\s+|\s+$/g,"");
}

String.prototype.ltrim = function() { //좌측공백제거
       return this.replace(/^\s+/,"");    
}

String.prototype.rtrim = function() { //우측공백제거
       return this.replace(/\s+$/,"");   
}

String.prototype.double1 = function() { //문자열 쌍따옴표 홀따옴표로 치환
	 return this.replace(/"/g, "'");
}

String.prototype.double2 = function() { //문자열 홀따옴표 쌍따옴표로 치환
	return this.replace(/'/g, '"')
}

//문자열 치환 
String.prototype.replaceAll = function(orgStr,repStr) { 
	return this.split(orgStr).join(repStr);
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var printf = function(string)
{
	if (arguments.length < 2) { return string; }
		for (var i=1; i<arguments.length; i++)
		{ string = string.replace(/%s/, arguments[i]); }
	return string;
}

var utils = {
	ajaxLoading:true,
	showLoading:function(act){
		if(act === false)
		{
			if(Ext.MessageBox.isVisible())
			{
				 Ext.MessageBox.hide();
			};
		}
		else 
		{
			if(!Ext.MessageBox.isVisible())
			{
				Ext.MessageBox.show({
					msg:"오픈서비스 연동중입니다. 잠시만 기다려 주세요.",
					progressText:'로딩중....',
					width:300,
					wait:true,
					waitConfig:{interval:150}
				});
			}			
		}
	}
}

/**
 * 문자열 길이 제한 잘라내기 처리
 * 
 * @param content 대상 문자열
 * @param max_length byte 제한 문자열 길이
 * @returns 유효한 문자열
 */
function chkContentLen(content, max_length){
	
	if(null == content || "" == content || 1 > max_length)
		return "";
	
	var sResult = content;
	
	var one_char;
	var str_byte  = 0;
	var str_length= 0;
	
	for(var i = 0 ; i < content.length ; i++){
		
		// 한글자추출
		one_char = content.charAt(i);
	  
		// 한글이면 2를 더한다.
		if(escape(one_char).length > 4){
			
			str_byte = str_byte + 2;
			
		}else{
			// 그외의 경우는 1을 더한다.
			str_byte++;
		}
	  
		// 전체 크기가  max_length를 넘지않으면
		if(str_byte <= max_length){
			
			str_length = i + 1;
		}
	}
	// 전체길이를 초과하면
	if(str_byte > max_length){
		sResult = content.substr(0, str_length) + "...";
	}
	return sResult;
}

/**
 * 메세지창 출력 함수
 *20120703:smlee
 */
function alertMsgEvent(title, msg, width){

	$("#ms_alert").load("/html/oasis_common/alert.jsp", function(){
		
		$("#alert_title").text(title);
		$("#alert_msg").html(msg);
		
		$("#alert_top_div").css("width", null != width ? width : "420px");
		
		$(".alert_ok").bind("click",function(e){
			
			e.preventDefault();
			$("#ms_alert").msPopup("close");
		});
		$("#ms_alert").msPopup("open");
	});	
}

/**
 * 메세지창 출력 함수(Focus 기능 추가)
 */
function alertMsgEventBeforeFocus(title, msg, width, focusId){

	$("#ms_alert").load("/html/oasis_common/alert.jsp", function(){
		
		$("#alert_title").text(title);
		$("#alert_msg").html(msg);
		
		$("#alert_top_div").css("width", null != width ? width : "420px");
		
		$(".alert_ok").bind("click",function(e){
			
			e.preventDefault();
			$("#ms_alert").msPopup("close");
			
			// 창 닫히며 포커스를 파라메터 ID에 맞춘다.
			$("#" + focusId).focus(function(){
				$(this).select();
			});
			$("#" + focusId).focus();
		});
		$("#ms_alert").msPopup("open");
	});	
}

/**
 * 입력데이터 숫자형 체크 함수
 *20120626:smlee
 */
//function number_check()
//{
//    var txt  = window.event.keyCode
//    //숫자키와 backspace, <-(방향키), ->(방향키), tab, del  키만 눌러지도록 함.
//   if((txt >= 48 && txt <=57) || txt==8 || txt==9 || txt==37|| txt==39|| txt==46){  window.event.returnValue = true
//    }else{ window.event.returnValue = false }
//}
function number_check(e){
	
	if($.browser.msie){
		
		var txt  = window.event.keyCode;
		//숫자키와 backspace, <-(방향키), ->(방향키), tab, del  키만 눌러지도록 함.
		if(	(txt >= 48 && txt <= 57) || txt==8 || txt==9 || txt==37|| txt==39|| txt==46 ||
			(txt >= 96 && txt <= 105)){
			
			window.event.returnValue = true;
	    
		}else{
		
			window.event.returnValue = false; 
		}
	}
	else{
		
		var txt  = e.which;
		
		//숫자키와 backspace, <-(방향키), ->(방향키), tab, del  키만 눌러지도록 함.
		if(	(txt >= 48 && txt <=57) || txt==8 || txt==9 || txt==37|| txt==39|| txt==46 ||
			(txt >= 96 && txt <= 105)){
			
			// 처리없음
	    
		}else{
		
			e.preventDefault();
		}
	}
}

//------------------------------------------------------------------------------------------------------------------


