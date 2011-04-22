package
{
	import flash.display.SimpleButton;
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
			this.graphics.drawRect( 0, 0, 500, 80 );
			this.graphics.endFill();
			
			//说明文字
			var _textFiled:TextField = new TextField();
			var tf:TextFormat = new TextFormat();
			tf.size = 12;
			tf.color = 0x000000;
			_textFiled.defaultTextFormat = tf;
			_textFiled.mouseEnabled = false;
			_textFiled.text = "点评并分享图片：";
			_textFiled.x = 36;
			_textFiled.y = 0;
			this.addChild( _textFiled );
			
			var shareBtn:ShareButton = new ShareButton( "转发至微博" );
			shareBtn.addEventListener(MouseEvent.CLICK, onShareBtn );
			this.addChild( shareBtn );
			
			init();
		}
		
		public function init() :void
		{
			this.addChild( createButton( "哭", 36, 28, "{name}，我哭啊", "http://eggs.sinaapp.com/assets/cry.png" ) );
			this.addChild( createButton( "杯具", 152, 28, "{name}，杯具了", "http://eggs.sinaapp.com/assets/beiju.png") );
			this.addChild( createButton( "亲亲", 264, 28, "{name}，亲亲", "http://eggs.sinaapp.com/assets/kiss.jpg" ) );
			this.addChild( createButton( "真棒", 376, 28, "{name}，你真棒", "http://eggs.sinaapp.com/assets/great.jpg" ) );
			this.addChild( createButton( "浮云", 36, 52, "{name}，这都是浮云", "http://eggs.sinaapp.com/assets/shenma.jpg" ) );
			this.addChild( createButton( "给力", 152, 52, "{name}，真给力", "http://eggs.sinaapp.com/assets/geiliable.jpg" ) );
			this.addChild( createButton( "为什么", 264, 52, "{name}，为什么呢？", "http://eggs.sinaapp.com/assets/why.jpg" ) );
			this.addChild( createButton( "不给力", 376, 52, "{name}，太不给力了", "http://eggs.sinaapp.com/assets/ungeiliable.jpg" ) );
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
			
			if ( _selectBtn != null ){
				ct.setBackground( _selectBtn.img );
				ct.addText( ct.translate ( _selectBtn.comment ) );
			}else{
				ct.setBackground( "" );
				ct.addText( "" );
			}
		}
		
		private function onClick( event:MouseEvent ) :void
		{
			_selectBtn = event.target as CustomButton;
		}
		
		private var _selectBtn:CustomButton;
		protected function onShareBtn(event:MouseEvent):void
		{
			if ( _selectBtn == null ){
				ct.addText( "先点评一下吧" );
				return;
			}
			
			ct.updateStatus( _selectBtn.comment );
		}
		
		
	}
}