<template>
  <div class="poker-game">
    <card
      class="cards"
      v-for="(card,index) in cards"
      :key="index"
      :data-index="index"
      :card="card"
    />
  </div>
</template>

<script>
import Card from "@/components/card";

export default {
  name: "game",
  data() {
    return {
      cards: []
    };
  },
  components: {
    Card
  },
  mounted() {
    this.initPoker();
  },
  methods: {
    randArr: function(arr) {
        //打乱顺序
      for (var i = 0; i < arr.length; i++) {
        var iRand = parseInt(arr.length * Math.random());
        var temp = arr[i];
        arr[i] = arr[iRand];
        arr[iRand] = temp;
      }
      return arr;
    },
    initPosition: function(cards) {
      let card_index = 0;
      for (let i = 1; i <= 7; i++) {
        for (let j = 0; j < i; j++) {
          cards[card_index].position = {
            col: i,
            rol: j + 1
          };
          cards[card_index].cover = false;
          card_index++;
        }
      }
      return cards;
    },
    openPoker: function() {
      //开始摆扑克
    },
    initPoker: function() {
      //生成扑克牌
      let newCards = [];
      for (let c = 0; c < 4; c++) {
        for (let i = 1; i <= 13; i++) {
          let obj = {
            num: this.pokerNumber(i),
            color: this.pokerColor(c),
            cover: true
          };
          newCards.push(obj);
        }
      }
      //打乱
      newCards = this.randArr(newCards);
      //生成位置坐标
      this.cards = this.initPosition(newCards);
      this.openPoker();
    },
    pokerNumber: function(i) {
      //生成扑克面值
      if (i > 10) {
        switch (i) {
          case 11:
            return "J";
            break;
          case 12:
            return "Q";
            break;
          case 13:
            return "K";
            break;
          default:
            return "";
        }
      } else {
        return String(i);
      }
    },
    pokerColor: function(c) {
      //生成扑克花色
      let type = "";
      switch (c) {
        case 0:
          type = "黑桃";
          break;
        case 1:
          type = "红桃";
          break;
        case 2:
          type = "梅花";
          break;
        case 3:
          type = "方块";
          break;
        default:
          type = "";
      }
      return type;
    }
  }
};
</script>

<style lang="less" scoped>
.poker-game {
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: #ececec;
  .cards {
    position: fixed;
    left: 0;
    top: 0;
  }
}
</style>