
var Utils = require("Utils");
var info = cc.Class({
    name: 'info',
    properties: {
        target: cc.Node,
    }
});
cc.Class({
    extends: cc.Component,

    properties: {
        itemTemp: {
            default: null,
            type: cc.Prefab
        },
        targetArray: {
            default: [],
            type: [info]
        },
        maxNumInOnePage : 18,
    },

    onLoad: function () {
        var stage = Utils.getStage();
        this.stageNum = stage.num;
        this.clearStages = stage.clearStages;
        var curTargetIndex = 0;
        var target = this.targetArray[curTargetIndex].target;
        for (var stageIndex = 0; stageIndex < this.stageNum ; ++stageIndex) {
            if((stageIndex+1)>(curTargetIndex+1)*this.maxNumInOnePage) {
                target = this.targetArray[++curTargetIndex].target;
            }
            this._createItem(target,stageIndex);
        }

    },

    _createItem: function (parentNode, index) {
        var item = cc.instantiate(this.itemTemp);
        var label = item.getComponentInChildren(cc.Label);
        label.string = index;
        if(index>this.clearStages){
            item.getComponent(cc.Button).interactable = false;
        }
        item.parent = parentNode;
    },
});
