package
{
	import flash.display.DisplayObject;
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.Event;
	
	[SWF(frameRate="30",width="400",height="300")]
	public class hiteggs extends Sprite
	{
		[Embed("assets/egg.png")]
		public const eggClass:Class;

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
			
//			var data:BitmapData = new eggClass() as BitmapData;
			
//			var bitmap :Bitmap = new Bitmap( new eggClass() as BitmapData );
			var bitmap:DisplayObject = new eggClass();
			this.addChild( bitmap );
			
		}
	}
}