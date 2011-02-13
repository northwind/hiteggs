package
{
	import com.adobe.serialization.json.JSON;
	import com.sina.microblog.MicroBlog;
	import com.sina.microblog.events.MicroBlogEvent;
	
	import flash.display.*;
	import flash.display.Loader;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.MouseEvent;
	import flash.external.ExternalInterface;
	import flash.filters.BitmapFilterQuality;
	import flash.filters.BlurFilter;
	import flash.filters.DropShadowFilter;
	import flash.filters.GlowFilter;
	import flash.geom.*;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.net.URLRequestHeader;
	import flash.net.URLRequestMethod;
	import flash.net.URLVariables;
	import flash.system.LoaderContext;
	import flash.text.TextField;
	import flash.text.TextFormat;
	import flash.ui.Mouse;
	import flash.utils.*; 
	
	/**
	 *  获取礼物后，调用JS方法onShowGift 
	 */	
	
	[SWF(frameRate="20",width="400",height="400" )]
	public class hiteggs extends Sprite
	{
		[Embed("assets/egg2.png")]
		public const eggClass:Class;

		[Embed("assets/broken.png")]
		public const eggBrokenClass:Class;
		
		[Embed("assets/hammer.png")]
		public const hammerClass:Class;
		
		[Embed("assets/award.png")]
		public const awardClass:Class;
		
		private var egg:Egg;
		private var bg: Sprite = new Sprite();
		private var uid:String = "";
		private var username :String = "";
		private var ufollows : int = 0;
		private var source:String = "";
		private var canhit:Boolean = false;
		private var inited:Boolean = false;
		private var setFriend:Boolean = false;
		private var urlGift:String = "/api/index.php/User.hitEgg";
		private var urlJump : String = "http://eggs.sinaapp.com/";
		private var fsid:String = "";
		private var fname:String = "";
		private var furl:String = "";
		private var text:String = "";
		private var sending:int = 0;
		
		private var cursor:DisplayObject = new hammerClass();
		private var textFiled:TextField = new TextField();
		
		private var mb:MicroBlog = new MicroBlog();
		
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
			
			//设置底部文字
			var tf:TextFormat = new TextFormat( null, 20 );
			tf.font = "Verdana";
			tf.size = 20;
			tf.bold = 700;
			tf.color = 0xFF0000;
			textFiled.defaultTextFormat = tf;
			textFiled.y = 300;
			textFiled.height = 30;
			textFiled.mouseEnabled = false;
			this.addChild( textFiled );
			
			//设置点评区
			var area:CommentArea = new CommentArea();
			area.x = 0;
			area.y = 330;
			area.ct = this;
			
			this.addChild( area );			
			
			
			//设置鼠标  TODO rollout 隐藏图标
			Mouse.hide();
//			cursor.visible = false;
			this.addChild( cursor );
			stage.addEventListener(MouseEvent.MOUSE_MOVE, mouseMoveHandler);

//			stage.addEventListener(MouseEvent.ROLL_OUT, onRollOut, true);
//			stage.addEventListener(MouseEvent.ROLL_OVER, onRollOver, true );
			
			//设置微博
			mb.addEventListener( MicroBlogEvent.UPDATE_STATUS_RESULT, updateResult );
			mb.isTrustDomain = true;
			
			//设置接口
			ExternalInterface.addCallback("prompt", this.addText );			//显示提示信息
			ExternalInterface.addCallback("init", this.setConfig );			//初始化
			ExternalInterface.addCallback("setPerson", this.setPerson );	//设置好友
			
			//调用JS
			var isAvailable:Boolean =ExternalInterface.available;
			if(isAvailable){
				ExternalInterface.call("onFlashComplete");
			}
			
			test();
		}
		
		private function test() : void
		{
//			this.setConfig( "562831874", "1362803703", "笑脸墙", 50, true );
//			this.setPerson( "1676619367", "佟野最喜剧-平男", "http://tp1.sinaimg.cn/1069829044/50/1282565209/0" );
//			this.addText( "@{name}，你太给力了" ); 
//			setBackground( "http://eggs.sinaapp.com/assets/geiliable.png"  );
		}
		
		private function onRollOut( event:MouseEvent ) :void
		{
			cursor.visible = false;
		}
		
		private function onRollOver( event:MouseEvent ) :void
		{
			cursor.visible = true;
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
			egg.addEventListener( "clickegg", onEggClick );
				
			this.addChild( egg );			
		}
		
		private function onEggClick( event: Event ) :void {
			if ( !this.setFriend ){
				addText( "还没选择要砸的好友呢" );
			}else{
				this.addText( "啊哦，一天只能敲一次，明天再来吧" );
			}	
		}
		
		private function onHit( event:Event ):void
		{
			trace( "onHit" );
				addText( "" );
				//从服务器取得奖品
				getGift();
				playAnimation();
		}

		private function getGift():void
		{
			var loader:URLLoader = new URLLoader();
			loader.addEventListener(Event.COMPLETE, loaded);		
			loader.addEventListener(IOErrorEvent.IO_ERROR, onError );
			
			var req : URLRequest = new URLRequest( urlGift );
			req.data = [ "sid=" + this.uid, "follows=" + this.ufollows ].join("&") ;
			req.contentType = "application/x-www-form-urlencoded";
			req.method= "POST";
			
			loader.load( req  );
		}

		private function onError( event:IOErrorEvent ) :void
		{
			trace(  "onError can't get gift" );
			//显示一个错误图片
			parseData( '{ "ret" : "-1", "msg" : "啊哦，出错啦，刷新页面再试次" }' );
		}

		private function loaded( evt:Event = null ):void
		{
			if ( evt ){
				var str:String = evt.target.data as String;
				parseData( str );
			}			
		}
		
		private var retObj:Object = null;
		private function parseData( str:String ): void
		{
			trace( "parseData = " + str );
			var result:Object;
			try{
				result = JSON.decode( str );
			}catch( e:Error ){ 
				trace( "parseData parse error" );
				result = null; 
			}
			
			//当是正确返回时
			if ( result is Object )
			{
				retObj = result;
				//0 积分 2物品 -1 报错信息
				trace( "result.ret = " +result.ret  );
				if ( result.ret == "0" ){
					egg.broke();
					showPoint( result.msg as int ); 
					onComplete();
				}else if ( result.ret == "2" ){
					egg.broke();
					showImage( result.msg as String ); 
					onComplete();
				}else if ( result.ret == "-1" ){
					this.addText( result.msg as String );
				}
			}		
		}
		
		private function onComplete() :void
		{
			//加载好友图像
			var lc:LoaderContext = new LoaderContext(true);
			var loader:Loader = new Loader();
			loader.load( new URLRequest( this.furl ), lc );
			
			loader.x = egg.x + (egg.width - 50) /2;
			loader.y = egg.y + (egg.height - 50) /2;
			
			this.addChildAt( loader, this.getChildIndex( egg ) );	
			
			//调用JS
			var isAvailable:Boolean =ExternalInterface.available;
			if(isAvailable){
				ExternalInterface.call("onShowGift", retObj.ret, retObj.msg );
			}
		}

		private var dropShadowFilter :DropShadowFilter = new DropShadowFilter( 10, 45, 0x000000, 0.8, 8, 8, 0.65, 1, false, false, false );
		private function showPoint( n:int ):void
		{
			var container:Sprite = new Sprite();
			var base:DisplayObject = new awardClass() as DisplayObject;
			var numFiled:TextField = new TextField();
			
			var tf:TextFormat = new TextFormat( null, 20 );
			tf.font = "Verdana";
			tf.size = 20;
			tf.bold = 700;
			if ( n > 0 ){
				tf.color = 0xFF0000;
			}else{
				tf.color = 0x00FF00;
			}
			numFiled.mouseEnabled = false;
			numFiled.defaultTextFormat = tf;
			numFiled.text = n.toString();
			numFiled.width = numFiled.textWidth + 5;
			numFiled.x = (base.width - numFiled.width) / 2;
			numFiled.y = (base.height - numFiled.textHeight) / 2;
			
//			container.addChild( base );
			container.addChild( numFiled );
			
			container.x = egg.x - 20;
			container.y = egg.y - 30;
			
			container.filters = [ dropShadowFilter ];
			
			this.addChild( container );
		}		
		
		private function showImage( url:String ):void
		{
			var lc:LoaderContext = new LoaderContext(true);
			var loader:Loader = new Loader();
			loader.load( new URLRequest( url ), lc );
			
			loader.x = egg.x - 20;
			loader.y = egg.y - 30;
			
			loader.filters = [ dropShadowFilter ];
			
			this.addChild( loader );				
		}
		
		private function playAnimation():void
		{
			
		}
		
		private var blurFilter :BlurFilter = new BlurFilter( 10, 10, 1 );
		public function setBackground( url:String  ) :void 
		{
			while( bg.numChildren > 0 ){
				bg.removeChildAt( bg.numChildren -1 );
			}
			
			if ( url ){
				var lc:LoaderContext = new LoaderContext(true);
				var loader:Loader = new Loader();
				
				loader.x = 0;
				loader.y = 0;
				loader.alpha = 0.7;
//				loader.filters = [ blurFilter ];
				
				loader.load( new URLRequest( url ), lc );
				bg.addChild( loader );
			}
		}
		
		private function getSnapshot() : ByteArray
		{
//			this.cursor.visible = false;

			var data:BitmapData ;
			try{
				data = new BitmapData( this.width, 330 );
				data.draw( this );
			}catch( e :Error ){
				trace( "getSnapshot error" );
				data = new BitmapData( this.width, 330 );
			}
//			this.cursor.visible = true;
			
			return PNGEncoder.encode( data );
		}
		
		public function setConfig( source:String, uid:String, username:String,
								   ufollows:int, canhit:Boolean
									  ) :void
		{
			this.source = source;
			this.uid = uid;
			this.username = username;
			this.ufollows = ufollows;
			this.canhit = canhit;
			this.inited = true;

			trace( "this.canhit = " + this.canhit );
			egg.clickable = this.canhit && this.setFriend ;
		}
		
		public function setPerson( fsid :String, fname:String, furl:String  ) :void
		{
			this.fsid = fsid;
			this.fname = fname;
			this.furl = furl;
			this.setFriend = true;
			
			egg.clickable = this.canhit && this.setFriend ;
		}
		
		private var dropShadowFilterText :DropShadowFilter = new DropShadowFilter( 5, 45, 0x000000, 0.8, 8, 8, 0.65, 1, false, false, false );
		private var growFilterText:GlowFilter = new GlowFilter( 0xFFFF55, 0.8, 5, 5, 1, 1, false, false );
		
		public function addText( text:String  ) :void
		{
			this.text = text.replace( "{name}", this.fname );

			textFiled.text = this.text;
			textFiled.width = textFiled.textWidth + 5;
			textFiled.x = (400 - textFiled.width ) / 2;
			textFiled.filters = [ dropShadowFilterText, growFilterText ];
		}
		
		public function updateStatus( status:String  ) :void
		{
			if ( egg.broken ){
				if (  sending == 4 ){
					addText( "已经分享过啦" );
					return;
				}
				sending = 4;	
				mb.source = this.source;
				status = translate( status );
				mb.updateStatus( status + " -- 砸彩蛋，得积分，换礼品，走过路过不要错过了 " + this.urlJump + "?" + Math.random() , null, getSnapshot() );
			}else{
				addText( "还没砸蛋呢" );
			}
		}
		
		public function translate( status:String ) : String
		{
			return status.replace( "{name}", "@" + this.fname );
		}
		
		private function updateResult( evt : MicroBlogEvent   ):void
		{
			addText( "发送成功" );
		}
	}
}