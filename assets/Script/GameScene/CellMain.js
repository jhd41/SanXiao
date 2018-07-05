cc.Class({
    extends: cc.Component,

    properties: {
        cells: {
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
        this.createCells();
        this.check();
    },

    init: function () {
        // layout的位置 宽高
        this.node.height = this.node.width;
        // 获得当前窗口下每一个“Cell”的size
        // 因为“Cell”为正方形，故width和height应该相等
        this.cellWidth = this.node.width / this.column;
        this.cellHeight = this.cellWidth;

        this.mask = [];
        // 保存cell的位置
        Global.cellsPosArr = [];
        // 保存 prefab 实例的节点
        Global.cellsNodeArr = [];

        // 保存奖励cell的位置
        this.bonusCell = [];

        // 获取分数的Label，并定义累计分数
        this.tmpScore = cc.find("Canvas/Main/GradeBoard_Layout/GradeBoard/grade");
        this.scoreLabel = this.tmpScore.getComponent(cc.Label);
        this.score = 0;
    },

    buildCoordinateArr: function () {
        // row 行 column 列
        // 横着是 i 竖着是 j
        for (var i = 0; i < this.column; i++) {
            var colPosArr = [];
            // [0]：不消除元素标记  [1]：消除元素标记
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
                var cellNode = this.instantiateCell(this.cells[rand], rand, i, j);
                colNodeArr.push(cellNode);
            }
            Global.cellsNodeArr.push(colNodeArr);
        }
    },

    instantiateCell: function (prefab, tag, i, j) {
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
        boxComponent.size = cc.size(this.cellWidth * 0.5, this.cellHeight * 0.5);

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
                touchPos.x = event.getLocationX() - cc.winSize.width / 2;
                touchPos.y = event.getLocationY() - cc.winSize.height / 2 - node.parent.parent.getPositionY();
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
        // 所有要被消除的坐标数组，是二维数组
        var indexArr = [];
        // 查重表，判断横竖相连时要用
        var hashTable = {};
        this.verticalCheckConnected(indexArr, hashTable);
        this.horizontalCheckConnected(indexArr, hashTable);

        cc.log(indexArr);

        if (indexArr.length) {
            this.del(indexArr);
        } else {
            // 恢复当前节点上注册的所有节点系统事件
            this.node.resumeSystemEvents(true);
        }
    },

    // arr 为 indexArr
    verticalCheckConnected: function (arr, hash) {
        for (var i = 0; i < this.column; i++) {
            var column = Global.cellsNodeArr[i];
            var start = 0;
            var stop = 1;

            while (stop < this.row + 1) {
                if (stop != this.row && column[start].tag == column[stop].tag) {
                    stop++;
                } else {
                    if (stop - start >= 3) {
                        // push到indexArr中的数组，表示需要消除的节点
                        var list = [];
                        // 记录list处于indexArr中的下标，arr.length是indexArr的长度：表示里面存了几个数组
                        var index = arr.length

                        for (var j = start; j < stop; j++) {
                            // 将ij坐标切换成字符串'i_j'
                            var postition = i + '_' + j
                            list.push(postition);
                            hash[postition] = index;
                        }

                        arr.push(list);
                    }
                    start = stop;
                    stop++;
                }
            }
        }
    },

    horizontalCheckConnected: function (arr, hash) {
        for (var i = 0; i < this.row; i++) {
            var row = [];
            for (var col = 0; col < this.column; col++) {
                row.push(Global.cellsNodeArr[col][i]);
            }
            var start = 0;
            var stop = 1;

            while (stop < this.column + 1) {
                if (stop != this.column && row[start].tag == row[stop].tag) {
                    stop++;
                } else {
                    if (stop - start >= 3) {
                        var list = [];
                        var isCrossed = false;
                        var index;

                        for (var j = start; j < stop; j++) {
                            var position = j + '_' + i
                            // 判断hashTable中是否已经存了这个位置，有的话说明交叉
                            if (typeof hash[position] == 'number') {
                                // index就是与之交叉的坐标组在indexArr中的下标
                                index = hash[position];
                                isCrossed = true;
                                this.bonusCell.push(position);
                            } else {
                                list.push(position);
                            }
                        }

                        if (isCrossed) {
                            // 把交叉的list（保存这一行需要消除的点的数组）push到arr[index]（垂直扫描时与本次水平扫描时交叉的数组）中
                            arr[index].push(...list);
                            // 如果没有交叉的话就push到indexArr中
                        } else if (list.length) arr.push(list);
                    }
                    start = stop;
                    stop++;
                }
            }
        }
    },

    del: function (arr) {
        // 传给create函数，初始值是[this.row, this.row, this.row....],需要在某列创建cell的时候对应的this.row++，用于create函数的for循环条件中
        var createArr = [];
        // 传给drop函数，初始值是[this.row * 2, this.row * 2, this.row * 2....],用于记录掉落最低到哪一行为止，用于drop函数的for循环条件中
        var dropArr = [];
        // 如果0、1、2列发生消除的话它的值就是2,记录发生消除的最大列
        var maxCol = 0;

        // 初始化
        for (var i = 0; i < this.column; i++) {
            createArr.push(this.row);
            dropArr.push(this.row * 2);
        }

        // cc.log('初始createArr', createArr);
        // cc.log('出事dropArr', dropArr);

        // 表示indexArr中的数组index，用于遍历indexArr
        var list = 0;
        // 表示indexArr[list]中的条目（记录坐标）index，用于遍历indexArr[list]
        var index = 0;
        cc.log(arr);
        for (var index = 0; index < arr[list].length; index++) {
            // 在此根据消除个数计分
            if(arr[list].length == 3){
                this.score += 40;
            }else if(arr[list].length == 4){
                this.score += 100;
            }else if(arr[list] == 5){
                this.score += 100;
            }else if(arr[list] == 6){
                this.score += 200;
            }else{
                this.score += 300;
            }

            destroyList(list, index, this);
            this.scoreLabel.string = this.score.toString();
        }

        // 每次删除1个节点
        function destroyList (list, index, self) {
            // 将类似 '2_3' 的坐标 split 成 ['2', '3']，表示i坐标和j坐标
            var cord = arr[list][index].split('_');
            // 在字符串 cord[0] 前加一个 + 可以隐式转换成数字类型
            var i = +cord[0];
            var j = +cord[1];
            let node = Global.cellsNodeArr[i][j];

            // for (var item of self.bonusCell) {
            //     if (item == arr[list][index]) return
            // }
    
            // destroy的让它的mask变成1
            self.mask[i][j] = 1;
            // destroy之后i列中的值自增，（this.row++)
            createArr[i]++;
            // 如果dropArr在该列（i）保存的值比当前垂直坐标（j）小，就赋j值，用于表示要掉到的最低位置
            if (dropArr[i] > j) dropArr[i] = j;
            if (maxCol < i) maxCol = i;
    
            var destroy = cc.callFunc(self.destroyNode, self, node);
            if (index == arr[list].length - 1 && list == arr.length - 1) {
                var info = {
                    create: createArr,
                    drop: dropArr,
                    maxCol: maxCol
                }
                // cc.log('处理完的createArr', createArr)
                // cc.log('处理玩的dropArr', dropArr)
                var create = cc.callFunc(self.create, self, info);
                var action = cc.sequence(cc.scaleBy(0.2, 0, 0), destroy, create);
            } else {
                var action = cc.sequence(cc.scaleBy(0.2, 0, 0), destroy);
            }
            node.runAction(action);

            // 如果1组indexArr[list]遍历完，并且有下一组的话就延时100ms消除下一组（继续调用destroyList）
            if (index === arr[list].length - 1) {
                if (list !== arr.length - 1) {
                    setTimeout(function() {
                        // 自增，遍历下一组数组
                        list++
                        for (var index = 0; index < arr[list].length; index++) {
                            destroyList(list, index, self)
                        }
                    }, 100)
                }
            }
        }
    },

    destroyNode: function (target, node) {
        node.getComponent('Cell').node.destroy();
    },

    // info: {
    //     create: createArr,
    //     drop: dropArr,
    //     maxCol: maxCol
    // }
    create: function (target, info) {
        for (var i = 0; i < this.column; i++) {
            for (var j = this.row; j < info.create[i]; j++) {
                var rand = Math.floor(Math.random() * (this.cells.length));
                var cellNode = this.instantiateCell(this.cells[rand], rand, i, j);
                Global.cellsNodeArr[i][j] = cellNode;
                this.mask[i][j] = 0;
            }
        }
        this.drop(info);
    },

    drop: function (info) {
        for (var i = 0; i <= info.maxCol; i++) {
            for (var j = info.drop[i] + 1; j < info.create[i]; j++) {
                var node = Global.cellsNodeArr[i][j];
                // temp记录需要移动到的垂直j坐标
                var temp = j - 1;

                // 如果目标mask是1，表示空位，并且自身mask是0，表示自身有节点，可以移入
                if (this.mask[i][temp] == 1 && this.mask[i][j] == 0) {
                    // 通过while循环表示需要drop到的最低j坐标（temp就是j坐标）
                    while (this.mask[i][temp - 1] == 1) {
                        temp--;
                    }
                    node.index.j = temp;

                    var destination = Global.cellsPosArr[i][temp];
                    if (i == info.maxCol && j == info.create[i] - 1) {
                        var check = cc.callFunc(this.check, this);
                        var action = cc.sequence(cc.moveTo(0.5, destination).easing(cc.easeCubicActionOut()), check);
                    } else {
                        var action = cc.moveTo(0.5, destination).easing(cc.easeCubicActionOut());
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