// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        gameTime:60,
    },

    onLoad: function(){
        var time = this.gameTime;
        var TimeBarWidth =this.node.getContentSize().width;
        // cc.log(time);
        //定时器
        this.schedule(this.tickFunc = function(){
            this.gameTime -= 0.01;
            var percent = this.gameTime/time;
            // cc.log(percent);
            this.node.setContentSize(TimeBarWidth*percent,this.node.getContentSize().height);
            if(percent <= 0.4){ //若。。。停止计时器
                this.unschedule(this.tickFunc);
            }
            // this.node.setContentSize(this.node.getContentSize());
            // if(this.gameTime <= 0){
            //     //cc.audioEngine.playEffect(this.overAudio,false);
            //     //cc.audioEngine.pauseMusic();
            //     cc.director.loadScene("OverScene");
            // }
        },0.01);
    },
});
