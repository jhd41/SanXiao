cc.Class({
    extends: cc.Component,

    onLoad: function () {
        // 激活碰撞组件
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;

        this.actSeq = null;
    },

    onCollisionEnter: function (other, self) {
        // self 是被按住的 cellNode
        var sNode = self.node;
        var oNode = other.node;

        if (sNode.select) {
            var s_i = sNode.index.i;
            var s_j = sNode.index.j;
            var o_i = oNode.index.i;
            var o_j = oNode.index.j;

            // 解构赋值, 将 self.node.index 和 other.node.index 的值交换
            var nodeArr = Global.cellsNodeArr;

            [sNode.index, oNode.index] = [oNode.index, sNode.index];
            [nodeArr[s_i][s_j], nodeArr[o_i][o_j]] = [nodeArr[o_i][o_j], nodeArr[s_i][s_j]];

        
            var movePosition = cc.moveTo(0.05, Global.cellsPosArr[s_i][s_j]).easing(cc.easeCubicActionIn());
            this.actSeq = cc.sequence.

            oNode.runAction(movePosition);

            // oNode.setPosition(Global.cellsPosArr[s_i][s_j]);
        }
    },

});
