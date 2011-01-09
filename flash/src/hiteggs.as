package
{
	import flash.display.*;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.filters.BitmapFilterQuality;
	import flash.filters.BlurFilter;
	import flash.filters.GlowFilter;
	import flash.geom.*;
	import flash.ui.Mouse;
	
	[SWF(frameRate="20",width="400",height="300",bgcolor="0x000000" )]
	public class hiteggs extends Sprite
	{
		[Embed("assets/egg2.png")]
		public const eggClass:Class;

		[Embed("assets/kiss.png")]
		public const kissClass:Class;
		
		[Embed("assets/hammer.png")]
		public const hammerClass:Class;
		
		private var egg:Sprite = new Sprite();
		private var bg: Sprite = new Sprite();
		
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
			showEgg( new eggClass() );
			
			//设置鼠标
			Mouse.hide();
			this.addChild( cursor );
			stage.addEventListener(MouseEvent.MOUSE_MOVE, mouseMoveHandler);
			
			test();
		}
		
		private function test() : void
		{
			setBackground( new kissClass() as DisplayObject );
		}
		
		private function mouseMoveHandler(evt:MouseEvent):void
		{
			cursor.x = evt.stageX;
			cursor.y = evt.stageY;
		}
		
		private function showEgg( obj:DisplayObject ) :void
		{
			egg.addChild( obj );
			
			egg.x = ( 400 - egg.width ) / 2;
			egg.y = ( 300 - egg.height ) / 2;
			
			egg.addEventListener(MouseEvent.ROLL_OVER, onEggRollOver ); 
			egg.addEventListener(MouseEvent.ROLL_OUT, onEggRollOut ); 
			
			this.addChild( egg );			
		}

		private var growFilter:GlowFilter = new GlowFilter( 0xFFFF55, 0.8, 35, 35, 2, 1, false, false );

		private function onEggRollOver( event : MouseEvent  ) :void 
		{
			egg.filters = [ growFilter ];		
		}

		private function onEggRollOut( event : MouseEvent  ) :void 
		{
			egg.filters = [];		
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
		
		
	}
}