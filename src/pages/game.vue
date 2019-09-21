<template>
  <div class="poker-game">
    <ul class="poker-collect">
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    <div class="poker-all" v-on:click="coverAgain"></div>
    <card
      class="cards"
      v-for="(card,index) in cards"
      :key="index"
      :data-index="card.index+'-'+card.color"
      :data-unique="card.unique"
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
      cards: [],
      look: [],
      scrollZ: 100,
      reversePokersId: []
    };
  },
  components: {
    Card
  },
  mounted() {
    this.initPoker();
  },
  methods: {
    removeReverse: function(card,position) {
      this.look.pop();
      let newArr=this.reversePokersId.concat();
      let len = newArr.length;
      for (let i = 0; i < len; i++) {
        if (newArr[i] == card.unique) {
          newArr.splice(i, 1);
        }
      }
      this.reversePokersId=newArr;
      for (let i = 0; i < this.cards.length; i++) {
        if (this.cards[i].unique == card.unique) {
          this.cards[i].position = {
            col: position.col+1,
            rol: position.rol
          };
        }
      }
    },
    coverAgain: function() {
      //重新翻牌
      for (let i = 0; i < this.reversePokersId.length; i++) {
        for (let j = 0; j < this.cards.length; j++) {
          if (this.cards[j].unique == this.reversePokersId[i]) {
            let element = document.querySelectorAll(
              '[data-unique="' + this.cards[j].unique + '"]'
            )[0];
            element.style.zIndex = 100;
            element.style.left = "0.06rem";
            this.cards[j].cover = true;
            break;
          }
        }
      }
      this.scrollZ = 100;
      this.look.length = 0;
    },
    addLook: function(card) {
      //翻牌
      this.reversePokersId.push(card.unique);
      if (this.look.length == 3) {
        let backCard = this.look.shift();
        let element = document.querySelectorAll(
          '[data-index="' + backCard + '"]'
        )[0];
        this.scrollZ--;
        element.style.zIndex = this.scrollZ;
        let unique = element.getAttribute("data-unique");
        for (let i = 0; i < this.cards.length; i++) {
          if (this.cards[i].unique == unique) {
            this.cards[i].cover = true;
            break;
          }
        }
      }
      this.look.push(card.index + "-" + card.color);
      for (let i = 0; i < this.look.length; i++) {
        let element = document.querySelectorAll(
          '[data-index="' + this.look[i] + '"]'
        )[0];
        element.style.left = 1.48 + i * 0.3 + "rem";
        element.style.zIndex = i + 100;
      }
    },
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
      //摆牌
      let card_index = 0;
      for (let i = 1; i <= 7; i++) {
        for (let j = 0; j < i; j++) {
          cards[card_index].position = {
            col: i,
            rol: j + 1
          };
          if (j < i - 1) {
            cards[card_index].cover = true;
          } else {
            cards[card_index].cover = false;
          }
          card_index++;
        }
      }
      return cards;
    },
    initPoker: function() {
      //生成扑克牌
      let newCards = [];
      let unique = 0;
      for (let c = 0; c < 4; c++) {
        for (let i = 1; i <= 13; i++) {
          let obj = {
            index: i,
            num: this.pokerNumber(i),
            color: c,
            cover: true,
            unique: unique
          };
          newCards.push(obj);
          unique++;
        }
      }
      //打乱
      newCards = this.randArr(newCards);
      //生成位置坐标
      this.cards = this.initPosition(newCards);
    },
    pokerNumber: function(i) {
      //生成扑克面值
      if (i > 10) {
        switch (i) {
          case 11:
            return "J";
          case 12:
            return "Q";
          case 13:
            return "K";
          default:
            return "";
        }
      } else {
        return String(i);
      }
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
  .poker-all {
    width: 1.36rem;
    height: 2.05rem;
    box-sizing: border-box;
    border-radius: 0.1rem;
    border: solid 0.03rem #000;
    position: fixed;
    left: 0.06rem;
    top: 0.06rem;
    opacity: 0.3;
  }
  .poker-collect {
    width: 5.68rem;
    position: fixed;
    left: 4.32rem;
    top: 0.06rem;
    height: 2.1rem;
    float: left;
    li {
      list-style: none;
      width: 1.36rem;
      height: 2.05rem;
      box-sizing: border-box;
      float: left;
      border-radius: 0.1rem;
      border: solid 0.03rem #000;
      margin-right: 0.06rem;
      opacity: 0.3;
    }
  }
}
</style>