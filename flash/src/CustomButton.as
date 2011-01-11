package
{
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import flash.text.TextFormat;
	
	public class CustomButton extends Sprite
	{
		private var _text :String = "";
		private var _textFiled:TextField = new TextField();
		
		public var comment :String = "";
		public var img :String = "";
		
		public function CustomButton( text:String = "", comment:String = "", img:String = "" )
		{
			super();
			this._text = text;
			
			this.comment = comment;
			this.img = img;
			
			init();
		}
		
		public function init():void
		{
			this.addEventListener(MouseEvent.ROLL_OVER, onRollOver );
			this.addEventListener(MouseEvent.ROLL_OUT, onRollOut );
			this.addEventListener(MouseEvent.MOUSE_DOWN, onMouseDown );
			this.addEventListener(MouseEvent.MOUSE_UP, onMouseUp );

			//设置底部文字
			var tf:TextFormat = new TextFormat();
			tf.font = "Verdana";
			tf.size = 20;
			tf.color = 0xFFFFFF;
			_textFiled.defaultTextFormat = tf;
			_textFiled.mouseEnabled = false;
			this.addChild( _textFiled );
			
			this.text = this._text;
			
			this.buttonMode = true;
		}
		
		private function onRollOver( event:MouseEvent ) :void
		{
			paintColor( 0xCC5100 );
		}
		
		private function onRollOut( event:MouseEvent ) :void
		{
			paintColor( 0xAEB2CF );
		}
		
		private function onMouseDown( event:MouseEvent ) :void
		{
			paintColor( 0x000000 );
		}
		
		private function onMouseUp( event:MouseEvent ) :void
		{
			paintColor( 0xCC5100 );
		}
		
		private function paintColor( color:uint ) :void
		{
			this.graphics.beginFill( color );
			this.graphics.drawRect( 0, 0, Math.max( 80, _textFiled.width ), 25 );
			this.graphics.endFill();	
		}
		
		public function set text( text :String ):void
		{
			this._text = text;
			_textFiled.text = text;
			_textFiled.height = _textFiled.textHeight + 8;
			_textFiled.width = _textFiled.textWidth + 4;
			
			_textFiled.x = ( this.width - _textFiled.width ) / 2;
			_textFiled.y = ( this.height - _textFiled.height ) / 2 ;
			
			paintColor( 0xAEB2CF );
		}
		
		public function get text(): String
		{
			return this._text;
		}
	}
}