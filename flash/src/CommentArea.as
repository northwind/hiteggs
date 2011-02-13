package
{
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import flash.text.TextFormat;
	
	public class CommentArea extends Sprite
	{
		public var ct:hiteggs = null;
		
		public function CommentArea(  )
		{
			super();
			
			this.graphics.beginFill( 0xDAFECF );
			this.graphics.drawRect( 0, 0, 400, 70 );
			this.graphics.endFill();
			
			//说明文字
			var _textFiled:TextField = new TextField();
			var tf:TextFormat = new TextFormat();
			tf.size = 12;
			tf.color = 0x000000;
			_textFiled.defaultTextFormat = tf;
			_textFiled.mouseEnabled = false;
			_textFiled.text = "点评并分享图片：";
			
			this.addChild( _textFiled );
			
			init();
		}
		
		public function init() :void
		{
			this.addChild( createButton( "哭", 10, 25, "{name}，我哭啊", "http://eggs.sinaapp.com/assets/cry.png" ) );
			this.addChild( createButton( "杯具", 110, 25, "{name}，杯具了", "http://eggs.sinaapp.com/assets/beiju.png") );
			this.addChild( createButton( "亲亲", 210, 25, "{name}，亲亲", "http://eggs.sinaapp.com/assets/kiss.png" ) );
			this.addChild( createButton( "真棒", 310, 25, "{name}，你真棒", "http://eggs.sinaapp.com/assets/great.png" ) );
			this.addChild( createButton( "浮云", 10, 50, "{name}，这都是浮云", "http://eggs.sinaapp.com/assets/shenma.png" ) );
			this.addChild( createButton( "给力", 110, 50, "{name}，真给力", "http://eggs.sinaapp.com/assets/geiliable.png" ) );
			this.addChild( createButton( "为什么", 210, 50, "{name}，为什么呢？", "http://eggs.sinaapp.com/assets/why.png" ) );
			this.addChild( createButton( "不给力", 310, 50, "{name}，太不给力了", "http://eggs.sinaapp.com/assets/ungeiliable.png" ) );
		}
		
		public function createButton( label :String, x :int, y: int, comment :String, img:String ) : CustomButton
		{
			var b:CustomButton = new CustomButton( label, comment, img );
			b.x = x;
			b.y = y;
			b.width = 80;
			b.height = 25;
			b.text = label;
		
			b.addEventListener(MouseEvent.ROLL_OVER, onRollOver );
			b.addEventListener(MouseEvent.ROLL_OUT, onRollOut );
			b.addEventListener(MouseEvent.CLICK, onClick );
				
			return b;
		}
		
		private function onRollOver( event:MouseEvent ) :void
		{
			var t:CustomButton = event.target as CustomButton;
			
			ct.setBackground( t.img );
			ct.addText( ct.translate ( t.comment ) );
		}
		
		private function onRollOut( event:MouseEvent ) :void
		{
			var t:CustomButton = event.target as CustomButton;
			
			ct.setBackground( "" );
			ct.addText( "" );
		}
		
		private function onClick( event:MouseEvent ) :void
		{
			var t:CustomButton = event.target as CustomButton;
			
			ct.updateStatus( t.comment );
		}
		
	}
}