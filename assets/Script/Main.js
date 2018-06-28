cc.Class({
    extends: cc.Component,

    properties: {
        cells: {
            default: [],
            type: cc.Prefab
        },
        paddingX: 10,
        paddingY: 50,
        row: 5,
        column: 5,
    },

    onLoad: function () {
        this.init();
        // 根据配置信息生成每个元素的坐标点集合
        this.buildCoordinateArr();
        this.createCells();
        this.check();
    },

    init: function () {
        //layout的位置 宽高
        //this.node.width = cc.winSize.width - 2 * this.paddingX;
        //this.node.height = this.node.width;
        //this.node.setPosition(cc.p(cc.winSize.getLocationX / 2, this.node.height / 2 + this.paddingY));
        // 获得当前窗口下每一个“块”的size
        // 因为“块”为正方形，故width和height应该相等
        this.cellWidth = this.node.width / this.column;
        this.cellHeight = this.cellWidth;

        this.mask = [];
        // 保存block的位置
        Global.cellsPosArr = [];
        // 保存 prefab 实例的节点
        Global.cellsNodeArr = [];
    },

    buildCoordinateArr: function () {
        // row 行 column 列
        // 横着是 i 竖着是 j
        for (var i = 0; i < this.column; i++) {
            var colPosArr = [];
            var colMaskArr = [];
            for (var j = 0; j < this.row * 2; j++) {
                colPosArr.push({
                    x: (i + 1) * this.cellWidth - this.node.width / 2 - this.cellWidth / 2,
                    y: (j + 1) * this.cellHeight - this.node.height / 2 - this.cellHeight / 2,
                });
                if (j < this.row) {
                    colMaskArr.push(0);
                } else {
                    colMaskArr.push(1);
                }
            }
            Global.cellsPosArr.push(colPosArr);
            this.mask.push(colMaskArr);
        }
    },

    createCells: function () {
        for (var i = 0; i < this.column; i++) {
            var colNodeArr = [];
            for (var j = 0; j < this.row; j++) {
                var rand = Math.floor(Math.random() * (this.cells.length));
                var cellNode = this.instantiateBlock(this.cells[rand], rand, i, j);
                colNodeArr.push(cellNode);
            }
            Global.cellsNodeArr.push(colNodeArr);
        }
    },

    instantiateBlock: function (prefab, tag, i, j) {
        // 实例
        var el = cc.instantiate(prefab);

        // el 在 cellsNodeArr 数组中的下标
        el.index = {
            i: i,
            j: j
        }

        el.tag = tag;
        el.select = false;
        el.setContentSize(this.cellWidth, this.cellHeight);
        el.setPosition(Global.cellsPosArr[i][j]);

        // 注册事件
        this.setEventControl(el);

        this.node.addChild(el);

        //获取碰撞组件并改变其碰撞的size
        var boxComponent = el.getComponent(cc.BoxCollider);
        boxComponent.size = cc.size(this.cellWidth * 0.4, this.cellHeight * 0.4);

        return el;
    },

    setEventControl: function (node) {
        node.on('touchstart', function (event) {
            node.select = true;
            // 为了保证点中的block不被其他block覆盖，修改它的z轴index
            node.zIndex = 1;
        }, this);
        node.on('touchmove', function (event) {
            if (node.select) {
                var touchPos = {};
                touchPos.x = event.getLocationX() - this.node.width / 2;
                touchPos.y = event.getLocationY() - this.node.height / 2;
                node.setPosition(touchPos);
            }
        }, this);
        node.on('touchend', function (event) {
            node.select = false;
            node.zIndex = 0;
            node.setPosition(Global.cellsPosArr[node.index.i][node.index.j]);
            this.check();
        }, this);
        node.on('touchcancel', function (event) {
            node.select = false;
            node.zIndex = 0;
            node.setPosition(Global.cellsPosArr[node.index.i][node.index.j]);
        }, this);
    },

    check: function () {
        // 暂停当前节点上注册的所有节点系统事件
        this.node.pauseSystemEvents(true);
        // 所有要被消除的坐标数组
        var indexArr = [];
        this.verticalCheckConnected(indexArr);
        this.horizontalCheckConnected(indexArr);

        indexArr = this.changeToSet(indexArr);

        if (indexArr.length != 0) {
            this.del(indexArr);
        } else {
            // 恢复当前节点上注册的所有节点系统事件
            this.node.resumeSystemEvents(true);
        }
    },

    changeToSet: function (arr) {
        var judge = {};
        var objectSet = [];

        for (var index of arr) {
            var property = index.i + '_' + index.j;
            judge[property] = {
                i: index.i,
                j: index.j
            };
        }
        for (var i in judge) {
            objectSet.push({
                i: judge[i].i,
                j: judge[i].j
            });
        }

        return objectSet;
    },

    verticalCheckConnected: function (arr) {
        for (var i = 0; i < this.column; i++) {
            var column = Global.cellsNodeArr[i];
            var start = 0;
            var stop = 1;
            var storeStart = 0;
            var storeStop = 0;
            while (stop != this.row) {
                if (column[start].tag == column[stop].tag) {
                    stop++;
                    storeStart = start;
                    storeStop = stop;
                    if (stop == this.row) {
                        if (storeStop - storeStart >= 3) {
                            for (var j = storeStart; j < storeStop; j++) {
                                arr.push({
                                    i: i,
                                    j: j
                                });
                            }
                        }
                    }
                } else {
                    start = stop;
                    stop += 1;
                    if (storeStop - storeStart >= 3) {
                        for (var j = storeStart; j < storeStop; j++) {
                            arr.push({
                                i: i,
                                j: j
                            });
                        }
                    }
                }
            }
        }
    },

    horizontalCheckConnected: function (arr) {
        for (var i = 0; i < this.row; i++) {
            var row = []
            for (var col = 0; col < this.column; col++) {
                row.push(Global.cellsNodeArr[col][i]);
            }
            var start = 0;
            var stop = 1;
            var storeStart = 0;
            var storeStop = 0;
            while (stop != this.column) {
                if (row[start].tag == row[stop].tag) {
                    stop++;
                    storeStart = start;
                    storeStop = stop;
                    if (stop == this.column) {
                        if (storeStop - storeStart >= 3) {
                            for (var j = storeStart; j < storeStop; j++) {
                                arr.push({
                                    i: j,
                                    j: i
                                });
                            }
                        }
                    }
                } else {
                    start = stop;
                    stop += 1;
                    if (storeStop - storeStart >= 3) {
                        for (var j = storeStart; j < storeStop; j++) {
                            arr.push({
                                i: j,
                                j: i
                            });
                        }
                    }
                }
            }
        }
    },

    del: function (arr) {
        var createArr = [];
        var dropArr = [];
        var minCol = 0;
        for (var i = 0; i < this.column; i++) {
            createArr.push(this.row);
            dropArr.push(this.row * 2);
        }

        for (var index = 0; index < arr.length; index++) {
            var i = arr[index].i;
            var j = arr[index].j;
            let node = Global.cellsNodeArr[i][j];

            this.mask[i][j] = 1;
            createArr[i]++;
            if (dropArr[i] > j) dropArr[i] = j;
            if (minCol < i) minCol = i;

            var destroy = cc.callFunc(this.destroyNode, this, node);
            if (index == arr.length - 1) {
                var create = cc.callFunc(this.create, this, {
                    create: createArr,
                    drop: dropArr,
                    minCol: minCol
                });
                var action = cc.sequence(cc.blink(0.1, 1), cc.scaleBy(0.2, 0, 0), destroy, create);
            } else {
                var action = cc.sequence(cc.blink(0.1, 1), cc.scaleBy(0.2, 0, 0), destroy);
            }
            node.runAction(action);
        }
    },

    destroyNode: function (target, node) {
        node.getComponent('Block').node.destroy();
    },

    create: function (target, info) {
        for (var i = 0; i < this.column; i++) {
            for (var j = this.row; j < info.create[i]; j++) {
                var rand = Math.floor(Math.random() * (this.cells.length));
                var cellNode = this.instantiateBlock(this.cells[rand], rand, i, j);
                Global.cellsNodeArr[i][j] = cellNode;
                this.mask[i][j] = 0;
            }
        }
        this.drop(info);
    },

    drop: function (info) {
        for (var i = 0; i <= info.minCol; i++) {
            for (var j = info.drop[i] + 1; j < info.create[i]; j++) {
                var node = Global.cellsNodeArr[i][j];
                var temp = j - 1;

                if (this.mask[i][temp] == 1 && this.mask[i][j] == 0) {
                    while (this.mask[i][temp - 1] == 1) {
                        temp--;
                    }
                    node.index.j = temp;

                    var destination = Global.cellsPosArr[i][temp];
                    if (i == info.minCol && j == info.create[i] - 1) {
                        var check = cc.callFunc(this.check, this);
                        var action = cc.sequence(cc.moveTo(0.3, destination), check);
                    } else {
                        var action = cc.moveTo(0.3, destination);
                    }
                    node.runAction(action);

                    Global.cellsNodeArr[i][temp] = node;
                    this.mask[i][temp] = 0;
                    this.mask[i][j] = 1;
                }
            }
        }
    }
});