cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    toGameScene:function(){
        cc.director.loadScene("Game");
    },
    
});
