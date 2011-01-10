package
{
	import com.adobe.serialization.json.JSON;
	
	import flash.display.*;
	import flash.display.Loader;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.MouseEvent;
	import flash.filters.BitmapFilterQuality;
	import flash.filters.BlurFilter;
	import flash.filters.GlowFilter;
	import flash.geom.*;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.net.URLRequestHeader;
	import flash.text.TextField;
	import flash.text.TextFormat;
	import flash.ui.Mouse;
	import flash.utils.*;
	
	[SWF(frameRate="20",width="400",height="300",bgcolor="0x000000" )]
	public class hiteggs extends Sprite
	{
		[Embed("assets/egg2.png")]
		public const eggClass:Class;

		[Embed("assets/broken.png")]
		public const eggBrokenClass:Class;
		
		[Embed("assets/kiss.png")]
		public const kissClass:Class;
		
		[Embed("assets/hammer.png")]
		public const hammerClass:Class;
		
		[Embed("assets/award.png")]
		public const awardClass:Class;
		
		
		
		private var egg:Egg;
		private var bg: Sprite = new Sprite();
		private var uid:String = "";
		private var source:String = "";
		private var urlGift:String = "aaa.html";
		private var fname:String = "";
		private var furl:String = "";
		private var text:String = "";
		
		private var cursor:DisplayObject = new hammerClass();
		
		public function hiteggs()
		{
			if (stage) init();
			else addEventListener(Event.ADDED_TO_STAGE, init);			
		}
		
		private function init(e:Event = null):void 
		{
			removeEventListener(Event.ADDED_TO_STAGE, init);
			// entry point
			
			if ( this.stage )
			{
				this.stage.scaleMode = StageScaleMode.NO_SCALE;
				this.stage.align = StageAlign.TOP;
			}
			
			//设置背景
			this.addChild( bg );
			
			//显示彩蛋
			showEgg(  new eggClass() , new eggBrokenClass() );
			
			//设置鼠标
			Mouse.hide();
			this.addChild( cursor );
			stage.addEventListener(MouseEvent.MOUSE_MOVE, mouseMoveHandler);
			
			test();
		}
		
		private function test() : void
		{
			setBackground( new kissClass() as DisplayObject );
			
			function broke():void
			{
				egg.broke();
			}
			
//			var intervalId:uint = setTimeout( broke, 1000 );
		}
		
		private function mouseMoveHandler(evt:MouseEvent):void
		{
			cursor.x = evt.stageX;
			cursor.y = evt.stageY;
		}
		
		private function showEgg( obj:DisplayObject ,  obj2:DisplayObject) :void
		{
			egg = new Egg( obj, obj2 );
			
			egg.x = ( 400 - egg.width ) / 2;
			egg.y = ( 300 - egg.height ) / 2;
			
			egg.addEventListener( "hit", onHit );
			egg.addEventListener( "broke", onBroke );
			
			this.addChild( egg );			
		}
		
		private function onHit( event:Event ):void
		{
			getGift();
			playAnimation();
		}

		private function onBroke( event:Event ):void
		{
			this.removeChild( cursor );
			Mouse.show();
		}
		
		private function getGift():void
		{
			var loader:URLLoader = new URLLoader();
			loader.addEventListener(Event.COMPLETE, loaded);		
			loader.addEventListener(IOErrorEvent.IO_ERROR, onError );
			
			var req : URLRequest = new URLRequest( urlGift );
			req.data = [ "user_id=" + this.uid, "source=" + this.source ].join("&") ;
			req.contentType = "application/x-www-form-urlencoded";
			req.method= "POST";
			
			loader.load( req  );
		}

		private function onError( event:IOErrorEvent ) :void
		{
			loaded();
		}

		private function loaded( evt:Event = null ):void
		{
			evt = new Event("aaa");
			
			if ( evt ){
//				var str:String = evt.target.data as String;
				var str:String = '{ "code" : "1", "data" : 200 }';
				
				var ret:Object = JSON.decode( str );
				//当是正确返回时
				if ( ret is Object )
				{
					egg.broke();
					
					//1 积分 2物品
					if ( ret.code == "1" ){
						showPoint( ret.data as int ); 
					}
				}
			}			
		}
		
		private function showPoint( n:int ):void
		{
			var container:Sprite = new Sprite();
			var base:DisplayObject = new awardClass() as DisplayObject;
			var numFiled:TextField = new TextField();
			
			var tf:TextFormat = new TextFormat( null, 18 );
			tf.font = "Verdana";
			tf.size = 18;
			if ( n > 0 ){
				tf.color = 0xFF0000;
			}else{
				tf.color = 0x0000FF;
			}
			numFiled.defaultTextFormat = tf;
			numFiled.text = n.toString();
			numFiled.width = numFiled.textWidth + 5;
			numFiled.x = (base.width - numFiled.width) / 2;
			numFiled.y = (base.height - numFiled.textHeight) / 2;
			
			container.addChild( base );
			container.addChild( numFiled );
			
			container.x = egg.x - 30;
			container.y = egg.y - 30;
			
			this.addChild( container );
		}		
		
		private function playAnimation():void
		{
			
		}
		
		private var blurFilter :BlurFilter = new BlurFilter( 10, 10, 1 );
		private function setBackground( obj :DisplayObject  ) :void 
		{
			while( bg.numChildren > 0 ){
				bg.removeChildAt( bg.numChildren );
			}
			obj.x = 0;
			obj.y = 0;
			obj.alpha = 0.7;
			obj.filters = [ blurFilter ];
			
			bg.addChild( obj );
		}
		
		private function setCursor() : void
		{
			
		}
		
		private function getSnapshot() : void
		{
			
		}
		
		public function setUser( uid:String, source:String ) :void
		{
			this.uid = uid;
			this.source = source;
		}
		
		public function setPerson( fname:String, furl:String  ) :void
		{
			this.fname = fname;
			this.furl = furl;
		}
		
		public function addText( text:String  ) :void
		{
			this.text = text;
		}
		
		public function updateStatus( str:String  ) :void
		{
			
		}
	}
}