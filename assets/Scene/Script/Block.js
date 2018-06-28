cc.Class({
    extends: cc.Component,

    onLoad: function () {
        // this.toMove = false;
        // this.toDestroy = false;
        
        // 激活碰撞组件
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
    },

    // 摧毁时调用
    // onDestroy: function() {
    //     var act = cc.sequence(cc.blink(0.2, 1), cc.scaleBy(0.2, 0, 0));//消失动画
    //     this.node.runAction(act);
    // },

    onCollisionEnter: function (other, self) {
        // self 是被按住的 cellNode
        var sNode = self.node;
        var oNode = other.node;

        if (sNode.select) {
            var s_i = sNode.index.i;
            var s_j = sNode.index.j;
            var o_i = oNode.index.i;
            var o_j = oNode.index.j;

            // var temp = other.node.index;
            // other.node.index = self.node.index;
            // self.node.index = temp;
            // 解构赋值, 将 self.node.index 和 other.node.index 的值交换
            var nodeArr = Global.cellsNodeArr;

            [sNode.index, oNode.index] = [oNode.index, sNode.index];
            [nodeArr[s_i][s_j], nodeArr[o_i][o_j]] = [nodeArr[o_i][o_j], nodeArr[s_i][s_j]]
            i
            // var position = cc.moveTo(0.05, Global.cellsPosArr[s_i][s_j]).easing(cc.easeCubicActionIn());
            // oNode.runAction(position);

            oNode.setPosition(Global.cellsPosArr[s_i][s_j]);
        }
    },

    update: function () {
        // if (this.node.toMove) {
        //     this.node.toMove = false;
        //     var action = cc.moveTo(0.3, Global.cellsPosArr[this.node.index.i][this.node.index.j]);
        //     this.node.runAction(action);
        // }
        // if (this.node.toDestroy) {
        //     this.node.toDestroy = false;
        //     var action = cc.sequence(cc.blink(0.1, 1), cc.scaleBy(0.2, 0, 0));//消失动画
        //     this.node.runAction(action);

        //     var self = this;
        //     setTimeout(function () {
        //         self.node.destroy();
        //     }, 300);
        // }
    }
});
