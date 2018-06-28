cc.Class({
    extends: cc.Component,

    properties: {
        gameTime:60,
    },

    onLoad: function(){
        //定时器
        var timer = 0;
        var sprite = this.node.getComponent(cc.Sprite);
        var meddlePixl = this.node.getContentSize().width - sprite.getInsetLeft() - sprite.getInsetRight();
        this.schedule(this.tickFunc = function(){
            timer++;
            if(timer <= this.gameTime*10){
                this.node.setContentSize(this.node.getContentSize().width-meddlePixl/(this.gameTime*10), this.node.getContentSize().height);
            }else{
                this.unschedule(this.tickFunc);
            }
        }, 0.1);
    },

    update: function(dt) {
        // this.node.getComponent(cc.ProgressBar).progress-=dt/this.gameTime;
    },
});