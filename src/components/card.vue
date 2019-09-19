<template>
    <div class="poker-card" :style="'left:'+left+';top:'+top">
        <div v-show="!card.cover">{{card.num}}{{card.color}}</div>
        <div v-show="card.cover" class="poker-card-cover"></div>
    </div>
</template>

<script>
export default {
    name:'card',
    props:{
        card:{
            type:Object,
            default:{}
        }
    },
    data(){
        return {
            left:'0.2rem',
            top:'0.2rem',
            topSide:2.5,//距离上方的rem数
            leftSide:0.2,//距离左边的间隔rem数
            cardWidth:1.2//扑克宽
        }
    },
    mounted:function(){
        if(this.card.position){
            this.postionThisCard();
        }
    },methods:{
        postionThisCard:function(){
            this.left=((this.card.position.col-1)*(this.cardWidth+0.2)+this.leftSide)+'rem';
            this.top=((this.card.position.rol-1)*0.5+this.topSide)+'rem';
        }
    }
}
</script>

<style lang="less" scoped>
.poker-card{
    width:1.2rem;
    height: 2rem;
    border-radius: 0.1rem;
    float: left;
    font-size: 0.3rem;
    background-color:#fff;
    // display: flex;
    // flex: 1;
    // justify-content: center;
    // flex-direction: column;
    // text-align: center;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 0.02rem #999;
    .poker-card-cover{
        position: absolute;
        width:100%;
        height:100%;
        background-color:#ccc;
    }
}
</style>