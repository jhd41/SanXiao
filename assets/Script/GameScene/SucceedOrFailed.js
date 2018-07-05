
cc.Class({
    extends: cc.Component,

    properties: {
        targetGrade: 50,
    },

    onLoad: function () {
        // 获取 挑战成功 节点
        var succeedNode = cc.find("Canvas/Main/Succeed");
        // 获取 挑战失败 节点
        var FailedNode = cc.find("Canvas/Main/Failed");
        // 获取Cell_Layout节点，用于暂停触控事件
        var cellNode = cc.find("Canvas/Main/Box_Img/Cell_Layout");

        //定时器
        this.schedule(this.tickFunc = function(){
            if(Global.gameTime <= 0){
                var tmpScore = cc.find("Canvas/Main/GradeBoard_Layout/GradeBoard/grade");
                var scoreLabel = tmpScore.getComponent(cc.Label);
                // 当时间用完之后跳框
                if(parseInt(scoreLabel.string) >= this.targetGrade){
                    succeedNode.setPosition(cc.p(0, -48));
                    succeedNode.opacity = 255;
                }else{
                    FailedNode.setPosition(cc.p(0, -48));
                    FailedNode.opacity = 255;
                }
                // 暂停当前节点上注册的所有节点系统事件
                cellNode.pauseSystemEvents(true);
            }else{
                Global.gameTime--;
            }
        }, 1);
    },
});
