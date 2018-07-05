

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad: function () {
        this.node.opacity = 255;
        this.node.setPosition(cc.p(0, -48));
    },

    backToMenu: function () {
        cc.director.loadScene("Menu");
    },

    cancel: function () {
        this.node.opacity = 0;
        this.node.setPosition(cc.p(-720, -1280));
    },
});
