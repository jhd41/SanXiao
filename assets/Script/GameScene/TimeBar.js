cc.Class({
    extends: cc.Component,

    properties: {
        gameTime: 60,

    },

    onLoad: function () {
        Global.gameTime = this.gameTime
        this.TmpTime = this.gameTime;
        this.originX = this.node.getPositionX();
        this.barLength = this.node.getContentSize().width;
    },

    update: function (dt) {
        if(this.node.x >= this.originX - this.barLength){
            this.node.x -= this.barLength * dt / this.TmpTime;
        }
    },

});