/**********************************************************************************
 *   Description : 팝업 라이브러리
 *   Author      : credit@mediaset.co.kr
 *   Date        : 2011/09/05
 *   Update      : 2012-01-20-1321
 *   Copyright (C) MEDIASET corporation.  
 **********************************************************************************/
 /* CSS 등록
	.popup_back{
		display:none;
		position:fixed;
		_position:absolute; 
		height:100%;
		width:100%;
		top:0;
		left:0;
		background:#000000; 
		border:1px solid #cecece;
	}
	.popup_layer{
		display:none;
		position:fixed;
		_position:absolute;
		border:1px solid #cecece;
		padding:10px 10px 10px 10px;   
		font-size:13px;
		background:#FFFFFF;
		box-sizing: border-box; 
		border-radius: 20px;
		border: 2px solid #fff; 
	}
	Example :
	<div id="hv_mjoin_form"></div>
	$("#hv_mjoin_form").msPopup("init");  CSS 적용, background div 생성 
	$("#hv_mjoin_form").msPopup("open");  팝업 오픈
	$("#hv_mjoin_form").msPopup("close"); 팝업 닫기 
 */
(function($){
	
	var msPopupConf = {
			
		init:function(){
			
			var $this = $(this);
			var $id = $this.attr("id");
			
			$this.addClass("popup_layer");
			
			if($("#"+$id+"_back").length == 0){
				
				$this.before("<div id='"+$id+"_back' class='popup_back'></div>", function(){});	
			}
		},
		
		progressPopup:function(){

			var $this = $(this);
			var $id = $this.attr("id");

			if($("#" + $id + "_progress").length == 0){
				
				$this.after("<div id='" + $id + "_progress' style='height:200px;width:200px;'>" +
						"<img src='/images/progressbar.gif' style='height:140px;width:140px;'></div>", function(){});	
			}
			var $this_progress = $("#" + $id + "_progress");
			
        	$this.css('z-index', Number($this.css('z-index')) - 2);
        	$this_progress.css("z-index", Number($this.css('z-index')) + 2);

			var nTop = ($(window).height() / 2) - ($this_progress.height() / 2) + $(window).scrollTop();
			var nLeft = ($(window).width() / 2) - ($this_progress.width() / 2) + $(window).scrollLeft();
			
			if($(window).maxHeight() < $this_progress.height()){
				
				$this_progress.height(($(window).maxHeight()- 100));
				nTop = ($(window).height()/2) - ($this_progress.height() / 2) + $(window).scrollTop() ;
			}
			$this_progress.css({ "position": 'absolute', "top": nTop + 'px',"left": nLeft + 'px' });
			
			if($this_progress.attr("scroll") != "false") 
			{
				$(window).resize(function(){
					msPopupConf.actResize($this_progress);  
				}).scroll(function(){
					msPopupConf.actScroll($this_progress);  
				});	
			}
			$this_progress.show();
		},
		
		/**
		 * Add SayidLee Progress Bar 닫기 기능 추가
		 */
		closeProgress: function(){

			var $this = $(this);
			var $id = $this.attr("id");

			if($("#" + $id + "_progress").length != 0){
				
				$("#" + $id + "_progress").remove();
	        	$this.css('z-index', Number($this.css('z-index')) + 2);
			}
		},
		
		open:function(){
			
			msPopupConf.centerPopup(this); 
			msPopupConf.loadPopup(this);
		},
		
		centerPopup:function(THIS){
			
			var $this = $(THIS);
			var $id   = $this.attr("id");
			var $this_bak = $("#"+$id+"_back");
			
			// * 주의
			//  $this.height()의 경우, 
			//  Load 파일안에서 최상단 <div>에 id값이 설정되어있을 경우, 
			//  값을 제데로 못 가져오는 경우 발생.
			var nTop = ($(window).height()/2) - ($this.height()/2) + $(window).scrollTop() ;
			var nLeft = ($(window).width()/2) - ($this.width()/2) + $(window).scrollLeft() ;
			
			
			if($(window).maxHeight() < $this.height()){
				
				$this.height(($(window).maxHeight()- 100));
				nTop = ($(window).height()/2) - ($this.height()/2) + $(window).scrollTop() ;
			}
			$this_bak.height($(window).maxHeight());  
			$this.css({ "position": 'absolute', "top": nTop+'px',"left": (nLeft-400)+'px',  "display": 'inline'});
			
			
			if($this.attr("scroll") != "false") 
			{
				$(window).resize(function(){
					msPopupConf.actResize($this);  
				}).scroll(function(){
					msPopupConf.actScroll($this);  
				});	
			} 
		},
		actScroll:function(THIS)
		{ 
			var $this = $(THIS);
			var $id   = $this.attr("id");
			var $this_bak = $("#"+$id+"_back");
			if(!$this.is(":hidden"))
			{
				$this_bak.height($(window).maxHeight()); 
				var yPos = 0;
				//el Height 길이가 전체창 크기보다 클경우 스크롤 에니메이션 효과를 쓰지않는다. 2011-12-02 Fix 
				if($this.height() < ($(window).maxHeight()-100))
				{ 
					 yPos = ( ($(window).height()/2) - ($this.height()/2) + $(window).scrollTop() );	
					$this.animate({  "top":yPos }, {duration:300, easing:'linear', queue:false});	
				}      
			}
		},	
		actResize:function(THIS)
		{
			var $this = $(THIS);
			var $id   = $this.attr("id");
			var $this_bak = $("#"+$id+"_back");
			if(!$this.is(":hidden"))
			{
				$this_bak.height($(window).maxHeight());
				//easing type : linear, swing  
				var nTop = ($(window).height()/2) - ($this.height()/2) + $(window).scrollTop() ;
				var nLeft = ($(window).width()/2) - ($this.width()/2) + $(window).scrollLeft() ;
				$this.css({ "position": 'absolute', "top": nTop+'px',"left": nLeft+'px'});
			}
		},
		loadPopup:function(THIS)
		{
			var $this = $(THIS);
			var $id   = $this.attr("id");
			var $this_bak = $("#"+$id+"_back");
			$this_bak = ($this_bak.length > 0)?$this_bak:$this.prev();
			
			var $len = 0;
			$len =  $(".popup_layer").not(":hidden").length;
			//$len =  $(".popup_layer").length;
			$this.css("z-index",Number("1"+$len+"01"));
			$this_bak.css("z-index",Number("1"+$len+"00"));
			$this_bak.css({ "opacity": "0.3" });
			$this_bak.show();
			$this.show();
		},  
		close:function(){
			
			var $this = $(this);
			var $id   = $this.attr("id");
			var $this_bak = $("#"+$id+"_back");
			
			$this_bak = ($this_bak.length > 0)?$this_bak:$this.prev();
			$this.unbind("scroll",msPopupConf.actScroll(this));
	 		$this_bak.hide();
			$this.hide();
			
			// 공통으로 쓰는 DIV 팝업은 이벤트를 초기화 시켜야한다. 이벤트가 종속되어 남아있으므로 이벤트가 중복으로 잘못 처리될수있다.
			// 초기화 시, 사용되지 않는 부분도 이벤트가 해제되므로 분리 작업시킴(MOD 20120801 SayidLee)
//			if($id == "ms_confirm" || $id == "ms_alert"){
//				
//				$(".confirm_ok").unbind("click");
//				$(".confirm_can").unbind("click");
//				
//				$(".alert_ok").unbind("click");
//				
//				$(".alert_ok").click(function(){
//					$("#ms_alert").hide();
//					$("#ms_alert_back").hide();
//				});
//				$(".confirm_can").click(function(){
//					$("#ms_confirm").hide();
//					$("#ms_confirm_back").hide(); 
//				});
//			}			
			if($id == "ms_confirm"){
				
				$(".confirm_ok").unbind("click");
				$(".confirm_can").unbind("click");
				
				$(".confirm_can").click(function(){
					$("#ms_confirm").hide();
					$("#ms_confirm_back").hide(); 
				});
			}
			if($id == "ms_alert"){
				
				$(".alert_ok").unbind("click");
				
				$(".alert_ok").click(function(){
					$("#ms_alert").hide();
					$("#ms_alert_back").hide();
				});
			}
			
			if($id == "img_viewer"){
               $(".confirm_ok").unbind("click");
				
				$(".confirm_ok").click(function(){
					$("#img_viewer").hide();
					$("#img_viewer_back").hide();
				});
			}
			
		}
	};
	$.fn.msPopup = function(method) 
	{ 
		if ( msPopupConf[method] ) 
		{
	      return msPopupConf[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } 
		else if ( typeof method === 'object' || ! method ) 
		{
	      return methods.init.apply( this, arguments );
	    } 
		else 
		{
	      $.error( 'Method ' +  method + ' does not exist on jQuery.msPopup' );
	    }  
	};
})(jQuery);