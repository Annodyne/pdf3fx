$(function(){
	ThreeFXanalytics = {};
	ThreeFXanalytics.Init = function(){
			ThreeFXanalytics.Timers = {},
			ThreeFXanalytics.Timers.VideoDuration,
			ThreeFXanalytics.Timers.Video = 0,
			ThreeFXanalytics.Session = {},
			ThreeFXanalytics.Session.UniqueSessionID = new Date().getTime(),
			ThreeFXanalytics.Watching = {},
			ThreeFXanalytics.Watching.Abstract,
			ThreeFXanalytics.Watching.Page,
			ThreeFXanalytics.Watching.Video,
			ThreeFXanalytics.inQA = false;
		},
		ThreeFXanalytics.SendData = function(cat, data){
			if(!ThreeFXanalytics.inQA){
				ga('send', 'event', cat, data, ThreeFXanalytics.Session.UniqueSessionID);
			}else{
				var send = {
					'Category' 	: cat,
					'Event'		: data,
					'Label'		: ThreeFXanalytics.Session.UniqueSessionID
				};
				console.log('Data to Send:');
				console.log(send);
			}
		},
		ThreeFXanalytics.SendDataWithValue = function(cat, data, val){
			if(!ThreeFXanalytics.inQA){
				ga('send', 'event', cat, data, ThreeFXanalytics.Session.UniqueSessionID, Math.floor(val));
			}else{
				var send = {
					'Category' 	: cat,
					'Event'		: data,
					'Label'		: ThreeFXanalytics.Session.UniqueSessionID,
					'Value'		: Math.floor(val)
				};
				console.log('Data to Send:');
				console.log(send);
			}
		},
		ThreeFXanalytics.Tracking = function(){
			//Add Abstract Tracking
			(function(){
				$(document).off("click.ThreeFXanalyticsAbstract").on(
					"click.ThreeFXanalyticsAbstract",
					'.abstract-nav .btn',
					function(){
						var AbstractName = $(this).find('h2').text().trim();
						if(ThreeFXanalytics.Watching.Abstract!=AbstractName){
							ThreeFXanalytics.SendData('AbstractView', AbstractName.trim());
							ThreeFXanalytics.Watching.Abstract=AbstractName;
						}
					}
				);
			})();
			
			//Add Pipeline Tracking
			(function(){
				$(document).off("click.ThreeFXanalyticsPipeline").on(
					"click.ThreeFXanalyticsPipeline",
					'.progress-bar',
					function(){
						var data = $(this).find('li:nth-child(1)').text() + ' - '+$(this).find('li:nth-child(3)').text();
						ThreeFXanalytics.SendData('PipelineView', data);
					}
				);
			})();
			
			//Add Page Tracking
			(function(){
				$(document).off("click.ThreeFXanalyticsHomePage").on(
					"click.ThreeFXanalyticsHomePage",
					".logo, .view .home-btn",
					function(){
						if(ThreeFXanalytics.Watching.Page!='Home'){
							ThreeFXanalytics.SendData('PageView', 'Home');
							ThreeFXanalytics.Watching.Page ='Home';
						}
					}
				);
				$(document).off("click.ThreeFXanalyticsSubPage").on(
					"click.ThreeFXanalyticsSubPage",
					'.nav-button.loads-page',
					function(){
						var intentPage = $(this).attr('data-pagelink');
						if(ThreeFXanalytics.Watching.Page!=intentPage){
							ThreeFXanalytics.SendData('PageView', intentPage);
							ThreeFXanalytics.Watching.Page=intentPage;
						}
					}
				);
			})();
			
			//Touch To Start
			(function(){
				$(document).off("click.ThreeFXanalyticsStartScreen").on(
					"click.ThreeFXanalyticsStartScreen",
					".start-screen",
					function(){
						ThreeFXanalytics.SendData('SessionStart', 'TouchScreenClicked');
					}
				);
			})();
		},
		ThreeFXanalytics.VideoTracking = function(){
			//VideoTracking
			(function(){
				$('video').off('play.ThreeFXanalyticsVideoPlay').on(
					"play.ThreeFXanalyticsVideoPlay",
					function(){
						if(this.currentTime == 0){
							ThreeFXanalytics.Timers.VideoDuration = this.duration;
							ThreeFXanalytics.Watching.Video = $(this).attr("data-videoname");
							ThreeFXanalytics.Timers.Video = new Date().getTime()/1000;
							
							ThreeFXanalytics.SendData("StartedVideo", ThreeFXanalytics.Watching.Video);
						}
					}
				);
				$('video').off('ended.ThreeFXanalyticsVideoEnd').on(
					"ended",
					function(){
						if(ThreeFXanalytics.Watching.Video){
							var time = new Date().getTime()/1000 - ThreeFXanalytics.Timers.Video,
								vidlength = this.duration;
							ThreeFXanalytics.SendDataWithValue('WatchedVideoSeconds', ThreeFXanalytics.Watching.Video, time);
							ThreeFXanalytics.SendDataWithValue('WatchedVideoPercent', ThreeFXanalytics.Watching.Video, (time/ThreeFXanalytics.Timers.VideoDuration)*100);
							ThreeFXanalytics.Watching.Video = '';
						}
					}
				);
				$(document).off('click.ThreeFXanalyticsVideoWatched').on(
					"click.ThreeFXanalyticsVideoWatched",
					"#video_pop .replay-btn",
					/*function(){
						if(ThreeFXanalytics.Watching.Video){
							var time = new Date().getTime()/1000 - ThreeFXanalytics.Timers.Video,
								vidlength = $('#the_Video')[0].duration;
							ThreeFXanalytics.SendDataWithValue('WatchedVideoSeconds', ThreeFXanalytics.Watching.Video, time);
							ThreeFXanalytics.SendDataWithValue('WatchedVideoSeconds', ThreeFXanalytics.Watching.Video, (time/vidlength)*100);
							ThreeFXanalytics.Watching.Video = $(this).attr("data-videoname");
							ThreeFXanalytics.Timers.Video = new Date().getTime()/1000;
							
							ThreeFXanalytics.SendData("StartedVideo", ThreeFXanalytics.Watching.Video);
						}else{
							ThreeFXanalytics.Watching.Video = $(this).attr("data-videoname");
							ThreeFXanalytics.Timers.Video = new Date().getTime()/1000;
							
							ThreeFXanalytics.SendData("StartedVideo", ThreeFXanalytics.Watching.Video);
						}
					}*/
					function(){
						if(ThreeFXanalytics.Watching.Video){
							var time = new Date().getTime()/1000 - ThreeFXanalytics.Timers.Video;
							ThreeFXanalytics.SendDataWithValue('WatchedVideoSeconds', ThreeFXanalytics.Watching.Video, time);
							ThreeFXanalytics.SendDataWithValue('WatchedVideoPercent', ThreeFXanalytics.Watching.Video, (time/ThreeFXanalytics.Timers.VideoDuration)*100);
							ThreeFXanalytics.Watching.Video = '';
						}
					}
				);
				$(document).off('click.ThreeFXanalyticsVideoReplay').on(
					"click.ThreeFXanalyticsVideoReplay",
					"#video_pop .home-btn",
					function(){
						if(ThreeFXanalytics.Watching.Video){
							var time = new Date().getTime()/1000 - ThreeFXanalytics.Timers.Video;
							ThreeFXanalytics.SendDataWithValue('WatchedVideoSeconds', ThreeFXanalytics.Watching.Video, time);
							ThreeFXanalytics.SendDataWithValue('WatchedVideoPercent', ThreeFXanalytics.Watching.Video, (time/ThreeFXanalytics.Timers.VideoDuration)*100);
							ThreeFXanalytics.Watching.Video = '';
						}
					}
				);
			})();
		};
});
	
	//Video Tracking
	//	on click - 	gasend -> VideoStart, VideoName, SessionData
	//				set video name in ThreeFXanalytics.Watching.Video
	//				set ThreeFXanalytics.Timers.Video to new Date().getTime()/1000
	//	
	//	when video ends/they leave modal - gasend -> VideoWatchTimke, ThreeFXanalytics.Watching.Video, SessionData, new Date().getTime()/1000 - ThreeFXanalytics.Timers.Video
	//
	//
	//on session reset
	//	reinitialize