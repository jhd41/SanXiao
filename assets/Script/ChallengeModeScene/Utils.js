var Utils = (function(){
    //xml、json加载参数
    var Xml = cc.Class({
        properties:{
            arr : null,
            xmlDoc : null,
            xmlPath : null,
        }
    });

    var xml = new Xml();
    
    var Json = cc.Class({
        properties:{
            arr : null,
            jsonPath : null,
        }
    });
    
    var json = new Json();
    var stageJson = new Json();

    //关卡参数
    var Stage = cc.Class({
        properties:{
            num : 54,   //关卡数
            clearStages : 0,  //清空关卡数
        }
    });

    var stage = new Stage();
    

    var instance = null;

    function getInstance(){
        if(instance==null){
            instance = new myObj();
            instance.loadJson("/res/raw-assets/resources/stage.json");

            instance.loadXml("/res/raw-assets/resources/book.xml",'book');
            // instance.loadJson("/res/raw-assets/Resources/example.json");
            return instance;
        }else{
            return instance;
        }
    }

    function myObj(){
        //关卡初始化
        var clearStages = cc.sys.localStorage.getItem("STAGE_CLEARSTAGES");
        if(clearStages != null){
            stage.clearStages = cc.sys.localStorage.getItem("STAGE_CLEARSTAGES");
        }else{
            cc.sys.localStorage.setItem("STAGE_CLEARSTAGES",0);
        }
    }

    myObj.prototype.loadXml = function(url,tag){
        if(url!='undefined' && xml.xmlPath!=url){
            xml.xmlPath = url; 
            var parser=new DOMParser();
            cc.loader.load(cc.url.raw(url),function(err,result){
                xml.xmlDoc = parser.parseFromString(result,"text/xml");
                if(tag !='undefined')
                    xml.arr = xml.xmlDoc.getElementsByTagName(tag);
                else
                    xml.arr = xml.xmlDoc.getElementsByTagName("root");
                // window.dispatchEvent(new Event('xml-loaded'));
            });
            // return "wait";
        }
    }

    myObj.prototype.loadJson = function(url){
        if(url!='undefined' && json.jsonPath!=url){
            json.jsonPath = url; 
            cc.loader.load(cc.url.raw(url),function(err,result){
                json.arr = result;
                
                //测试用
                stageJson = json;
                if(stageJson.arr)
                    stage.num = stageJson.arr[0].StageNum;
            });
        }
    }

    // myObj.prototype.getArrayByIndex = function(index){
    //     return Xml.arr[index].textContent;
    // }

    // myObj.prototype.getArray2ByIndex = function(index){
    //     return Json.arr[index].name;
    // }

    myObj.prototype.getXML = function(){
        return xml;
    }

    myObj.prototype.getJSON = function(){
        return json;
    }

    myObj.prototype.getStage = function(){
        return stage;
    }

    myObj.prototype.setClearStages = function(clearStages){
        this.stage.clearStages = clearStages;
        cc.sys.localStorage.setItem("STAGE_CLEARSTAGES",clearStages);
    }

    myObj.prototype.getStageJson = function(){
        return stageJson;
    }

    return {getInstance:getInstance};
})();
module.exports = Utils.getInstance();