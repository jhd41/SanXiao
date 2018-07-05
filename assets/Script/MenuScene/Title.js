cc.Class({
    extends: cc.Component,

    properties: {
        ariseTime: 3,
    },

    onLoad: function () {
        this.node.opacity = 0;
        this.node.y = 477;
    },

    update: function (dt) {
        if (this.node.y >= 325) {
            this.node.y -= (174 * dt / this.ariseTime);
            this.node.opacity += 255 * dt / this.ariseTime;
        }
    }
});