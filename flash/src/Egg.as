package
{
	import flash.display.DisplayObject;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.filters.GlowFilter;
	
	public class Egg extends Sprite
	{
		private var eggshell:DisplayObject;
		private var eggshellBroken:DisplayObject; 
		
		public var broken:Boolean = false;
		private var _disable:Boolean = false;
		private var _clickable:Boolean = false;
		
		public function Egg( obj:DisplayObject, obj2 : DisplayObject )
		{
			super();

			eggshell = obj;
			eggshellBroken = obj2;
			
			this.addChild( obj );
			
			addListener();
		}
		
		
		
		private function addListener() :void
		{
			this.addEventListener(MouseEvent.ROLL_OVER, onEggRollOver ); 
			this.addEventListener(MouseEvent.ROLL_OUT, onEggRollOut );
			this.addEventListener(MouseEvent.CLICK, onEggClick ); 	
		}
		
		private var growFilter:GlowFilter = new GlowFilter( 0xFFFF55, 0.8, 35, 35, 2, 1, false, false );
		
		private function onEggRollOver( event : MouseEvent  ) :void 
		{
			this.filters = [ growFilter ];		
		}
		
		private function onEggRollOut( event : MouseEvent  ) :void 
		{
			this.filters = [];		
		}
		
		private function onEggClick( event : MouseEvent  ) :void 
		{
			if ( broken ){
				//nothing
			}else{
				trace( "this._clickable = " + this._clickable );
				if ( this._clickable ){
					//可以hit
					onHit();
				}else{
					//不可以hit
					this.dispatchEvent( new Event( "clickegg" ) );
				}
			}
		}
		
		//触发事件
		private function onHit() :void 
		{
			removeListener();
			this.dispatchEvent( new Event( "hit" ) );
		}
		
		//更改蛋壳图片
		public function broke() :void 
		{
			if ( !broken ){
				broken = true;
				
				this.addChild( eggshellBroken );
				this.removeChild( eggshell );
				removeListener();
				this.filters = [];	
				
				this.dispatchEvent( new Event( "broke" ) );
			}
		}
		
		public function reset() : void
		{
			broken = false;
			
			try{
				this.removeChild( eggshellBroken );
				this.removeChild( eggshell );
				this.addChild( eggshell );
			}catch( e:Error ){
			}
			
			removeListener();
			addListener();
		}
		
		private function removeListener() : void
		{
			this.removeEventListener( 	MouseEvent.ROLL_OVER, onEggRollOver );
			this.removeEventListener( 	MouseEvent.ROLL_OUT, onEggRollOut );
			this.removeEventListener( 	MouseEvent.CLICK, onEggClick );
		}
		
		public function set disable( b : Boolean ) : void
		{
			trace( "set egg disable : " + b.toString() );
			_disable = b;
			if ( b ){
				//失效
				this.filters = [];		
				removeListener();
			}else{
				//有效
				removeListener();
				addListener();
			}
		}		

		public function set clickable( b : Boolean ) : void
		{
			_clickable = b;
		}	
	}
}