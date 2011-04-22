package
{
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import flash.text.TextFormat;
	
	public class ShareButton extends CustomButton
	{
		private var normalColor:uint = 0xCC5100;
		private var overColor:uint = 0xFF0000;
		
		public function ShareButton( text:String = "", comment:String = "" )
		{
			super( text, comment );
			this.x = 350;
			this.y = 0;
			this.width = 150;
			this.height = 30;			
			this._textFiled.x = 20;
			this._textFiled.y = -2;
		}
		
		override public function set text( text :String ):void
		{
			super.text = text;
			
			paintColor( normalColor );
		}
	
		override protected function onRollOver( event:MouseEvent ) :void
		{
			super.onRollOver( event );
			
			paintColor( overColor );
		}
		
		override protected function onRollOut( event:MouseEvent ) :void
		{
			super.onRollOut( event );
			
			paintColor( normalColor );
		}
		
	}
}