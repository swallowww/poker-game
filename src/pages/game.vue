<template>
    <div class="poker-game">
        <canvas id="pokerCanvas" width="375" height="812"></canvas>
    </div>
</template>

<script>
export default {
    name:'game',
    data(){
        return {
            pokerCanvas:'',
            pokerSize:{
                //纸牌尺寸
                w:40,//宽
                h:80//高
            },
            sider:10,//卡牌间距
        }
    },
    mounted(){
        this.initPoker();
        this.createCard(1,1,'黑桃',1);
        this.createCard(1,2,'黑桃',2);
        this.createCard(2,1,'红心',3);
        this.createCard(1,3,'黑桃',4);
        this.createCard(1,4,'黑桃',5);
        this.createCard(1,5,'黑桃',6);
        this.createCard(1,6,'黑桃',7);
        this.createCard(1,7,'黑桃','K');
        this.createCard(3,1,'黑桃','J');
        this.createCard(3,7,'黑桃','10');
    },methods:{
        initPoker(){
            this.pokerCanvas=document.getElementById("pokerCanvas");
        },
        createCard(y,x,type,num){
            var newCard=this.pokerCanvas.getContext("2d");
            newCard.fillStyle="#FFFFFF";
            newCard.fillRect((x-1)*this.pokerSize.w+this.sider*x,(y-1)*this.pokerSize.h+this.sider*y,this.pokerSize.w,this.pokerSize.h);
            newCard.fillStyle="#000000";
            newCard.font="14px Arial";
            newCard.fillText(type,(x-1)*this.pokerSize.w+this.sider*x+6,(y-1)*this.pokerSize.h+y*this.sider+45);
            newCard.fillText(num,(x-1)*this.pokerSize.w+this.sider*x+2,(y-1)*this.pokerSize.h+y*this.sider+20);
            newCard.fillText(num,(x-1)*this.pokerSize.w+this.sider*x+22,(y-1)*this.pokerSize.h+y*this.sider+70);
        }
    }
}
</script>

<style scoped>
.poker-game{
    overflow: hidden;
}
#pokerCanvas{
    float: left;
    background:#ececec;
}
</style>