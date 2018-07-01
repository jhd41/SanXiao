cc.Class({
    extends: cc.Component,

    properties: {
        block: {
            default: [],
            type: cc.Prefab
        },
        row: 5,
        column: 5,
    },

    onLoad: function () {
        this.init();
        // 根据配置信息生成每个元素的坐标点集合
        this.buildCoordinateArr();
        this.createBlock();
    },

    init: function () {
        // layout的位置 宽高
        this.node.height = this.node.width;
        // 获得当前窗口下每一个“Block”的size
        // 因为“Block”为正方形，故width和height应该相等
        this.blockWidth = this.node.width / this.column;
        this.blockHeight = this.blockWidth;
        // 保存block的位置
        Global.blocksPosArr = [];
        // 保存 spriteframe 实例的节点
        Global.blocksNodeArr = [];
    },

    buildCoordinateArr: function () {
        // row 行 column 列
        // 横着是 i 竖着是 j
        for (var i = 0; i < this.column; i++) {
            var colPosArr = [];
            for (var j = 0; j < this.row; j++) {
                colPosArr.push({
                    x: (i + 1) * this.blockWidth - this.node.width / 2 - this.blockWidth / 2,
                    y: (j + 1) * this.blockHeight - this.node.height / 2 - this.blockHeight / 2
                });
            }
            Global.blocksPosArr.push(colPosArr);
        }
    },

    createBlock: function () {
        for (var i = 0; i < this.column; i++) {
            var colNodeArr = [];
            for (var j = 0; j < this.row; j++) {
                var blockNode = this.instantiateBlock(this.block[(i+j)%2], i, j);
                colNodeArr.push(blockNode);
            }
            Global.blocksNodeArr.push(colNodeArr);
        }
    },

    instantiateBlock: function (prefab, i, j) {
        // 实例
        var el = cc.instantiate(prefab);
        // el在 cellsNodeArr 数组中的下标
        el.index = {
            i: i,
            j: j
        }
        el.setContentSize(this.blockWidth, this.blockHeight);
        el.setPosition(Global.blocksPosArr[i][j]);
        this.node.addChild(el);

        return el;
    },

});