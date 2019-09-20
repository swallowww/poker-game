<template>
  <div
    :class="{'poker-card':true,'cardCover':card.cover}"
    :style="'left:'+left+';top:'+top+';background-position:'+findCardBg()"
    v-on:click="cardClick"
  ></div>
</template>

<script>
export default {
  name: "card",
  props: {
    card: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      left: "0.06rem",
      top: "0.06rem",
      topSide: 2.5, //距离上方的rem数
      leftSide: 0.06, //距离左边的间隔rem数
      cardWidth: 1.36 //扑克宽
    };
  },
  mounted: function() {
    if (this.card.position) {
      this.postionThisCard();
    }
  },
  methods: {
    cardClick: function() {
      if (this.card.cover && !this.card.position) {
        this.card.cover = false;
        this.$parent.addLook(this.card);
      }
    },
    findCardBg: function() {
      let res = "left top";
      let bgWidth = -1.36;
      let bgHeight = -2.06;
      if (this.card.cover) {
        let left = bgWidth * 2 + "rem";
        let top = bgHeight * 4 + "rem";
        return "left " + left + " top " + top;
      }
      {
        let left = bgWidth * (this.card.index - 1) + "rem";
        let top = bgHeight * this.card.color + "rem";
        res = "left " + left + " top " + top;
        return res;
      }
    },
    postionThisCard: function() {
      this.left =
        (this.card.position.col - 1) * (this.cardWidth + this.leftSide) +
        this.leftSide +
        "rem";
      this.top = (this.card.position.rol - 1) * 0.2 + this.topSide + "rem";
    }
  }
};
</script>

<style lang="less" scoped>
.poker-card {
  width: 1.36rem;
  height: 2.05rem;
  border-radius: 0.1rem;
  float: left;
  font-size: 0.3rem;
  background-color: #fff;
  position: relative;
  overflow: hidden;
  user-select: none;
  background-image: url(../assets/img/pokerBg.jpg);
  background-repeat: no-repeat;
  background-size: 17.7rem auto;
  z-index: 100;
  transition: left 0.3s;
  transition-property: left, top;
  .poker-card-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #ccc;
  }
}
</style>