cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function () {
        this.node.opacity = 0;
        this.node.setPosition(cc.p(-720, -1280));
    },

    settingMenu: function () {
        if (0 == this.node.opacity) {
            this.node.opacity = 255;
            this.node.setPosition(cc.p(14, -101));
        } else {
            this.node.opacity = 0;
            this.node.setPosition(cc.p(-720, -1280));
        }

    },

    onExit: function () {
        if (0 == this.node.opacity) {
            this.node.opacity = 255;
            this.node.setPosition(cc.p(0, -48));
        } else {
            this.node.opacity = 0;
            this.node.setPosition(cc.p(-720, -1280));
        }
    },



});