var Utils = require("Utils");
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    ChangeScenes : function(event,data){
        cc.director.loadScene(data);
    },

    LoadStages : function(event,data){
        var label = this.node.getComponentInChildren(cc.Label);
        cc.log("stage"+label.string + " data" + Utils.getStageJson().arr[label.string+1].data);
    }
});
