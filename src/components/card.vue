<template>
  <div
    :class="{'poker-card':true,'cardCover':card.cover,'move':onDrag}"
    :style="'left:'+left+';top:'+top+';background-position:'+findCardBg()"
    v-on:click="cardClick"
    v-on:touchstart="cardTouchStart($event)"
    v-on:mousedown="cardTouchStart($event)"
    v-on:touchmove="cardTouchMove($event)"
    v-on:mousemove="cardTouchMove($event)"
    v-on:touchend="cardTouchEnd($event)"
    v-on:mouseup="cardTouchEnd($event)"
    v-on:mouseleave="cardTouchEnd($event)"
  ></div>
</template>

<script>
export default {
  name: "card",
  props: {
    card: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      left: "0.06rem",
      top: "0.06rem",
      topSide: 2.5, //距离上方的rem数
      leftSide: 0.06, //距离左边的间隔rem数
      matchSide: 0.5, //匹配后向下间距
      cardWidth: 1.36, //扑克宽(单位rem)
      cardHeight: 2.05, //扑克高(单位rem)
      oldPosition: "",
      onDrag: false //是否在拖拽纸牌中
    };
  },
  mounted: function() {
    if (this.card.position) {
      this.postionThisCard();
    }
  },
  methods: {
    matchPoker: function(element) {
      //尝试匹配
      let cards = this.$parent.cards;
      let dragId = parseInt(element.getAttribute("data-unique"));
      let dragIndex = element.getAttribute("data-index");
      let checkPokers = [];
      let matchType = "";
      let elementLeft = parseFloat(element.style.left);
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].position && !cards[i].cover && cards[i].unique != dragId) {
          //如果是布置过坐标的牌&&数字面牌&&不是当前拖拽牌
          let checkElement = document.querySelectorAll(
            '[data-unique="' + cards[i].unique + '"]'
          )[0];
          let checkLeft = parseFloat(checkElement.style.left);
          let checkTop = parseFloat(checkElement.style.top);
          let absLeft = Math.abs(checkLeft - elementLeft);
          let absTop = Math.abs(checkTop - parseFloat(element.style.top));
          if (absLeft < this.cardWidth && absTop < this.cardHeight) {
            //如果扑克区域有重合
            if (checkTop > this.leftSide + this.cardHeight) {
              //向下摆开
              matchType = "sub";
            } else {
              //上方收纳
              matchType = "add";
            }
            checkPokers.push(cards[i]);
          }
        }
      }
      let selectPoker = [];
      for (let i = 0; i < checkPokers.length; i++) {
        //循环遮挡的扑克牌
        if (i == 0) {
          //如果是循环中第一个，则按照列录入
          selectPoker[checkPokers[i].position.col] = checkPokers[i];
        } else {
          //如果不是第一个，进行比较
          if (selectPoker[checkPokers[i].position.col]) {
            //如果该列已有卡牌
            if (matchType == "sub") {
              //向下摆开
              if (
                checkPokers[i].index <
                selectPoker[checkPokers[i].position.col].index
              ) {
                selectPoker[checkPokers[i].position.col] = checkPokers[i];
              }
            } else {
              //上方收纳
            }
          } else {
            //如果该列暂无卡牌
            selectPoker[checkPokers[i].position.col] = checkPokers[i];
          }
        }
      }
      //检查各列覆盖卡牌的花色和数字
      let dragNum = parseInt(dragIndex.split("-")[0]);
      let dragColor = parseInt(dragIndex.split("-")[1]);
      let resPokers = []; //符合摆牌规则的牌数组(可能是1-2个)
      for (let i = 0; i < selectPoker.length; i++) {
        if (selectPoker[i]) {
          if (matchType == "sub") {
            if (
              selectPoker[i].index == dragNum + 1 &&
              !this.isSameColor(dragColor, selectPoker[i].color)
            ) {
              resPokers.push(selectPoker[i]);
            }
          } else {
            if (
              selectPoker[i].index == dragNum - 1 &&
              this.isSameColor(dragColor, selectPoker[i].color)
            ) {
              resPokers.push(selectPoker[i]);
            }
          }
        }
      }
      //如果有两张相同面值颜色的卡牌，选中最近的那个
      let nearestCard = false;
      for (let i = 0; i < resPokers.length; i++) {
        if (i == 0) {
          nearestCard = resPokers[i];
        } else {
          let checkLeft = parseFloat(
            document.querySelectorAll(
              '[data-unique="' + resPokers[i].unique + '"]'
            )[0].style.left
          );
          let nearestLeft = parseFloat(
            document.querySelectorAll(
              '[data-unique="' + nearestCard.unique + '"]'
            )[0].style.left
          );
          if (
            elementLeft > checkLeft - this.cardWidth / 2 &&
            elementLeft <= checkLeft + this.cardWidth / 2
          ) {
            nearestCard = resPokers[i];
          }
        }
      }
      return nearestCard;
    },
    isSameColor: function(dragColor, targetColor) {
      //0-H红块 1-红心 2-黑桃 3-黑梅
      if (
        (dragColor == 0 || dragColor == 1) &&
        (targetColor == 2 || targetColor == 3)
      ) {
        return false;
      } else if (
        (dragColor == 2 || dragColor == 3) &&
        (targetColor == 0 || targetColor == 1)
      ) {
        return false;
      } else {
        return true;
      }
    },
    cardTouchEnd: function(e) {
      if (this.onDrag) {
        this.onDrag = false;
        let matchCard = this.matchPoker(e.target);
        if (matchCard) {
          if(!this.card.position){
            this.$parent.removeReverse(this.card,matchCard.position,setZindex);
          }
          let matchElement = document.querySelectorAll(
            '[data-unique="' + matchCard.unique + '"]'
          )[0];
          let setLeft = matchElement.style.left;
          let setTop =
            parseFloat(matchElement.style.top) + this.matchSide + "rem";
          let setZindex = matchElement.style.zIndex
            ? parseInt(matchElement.style.zIndex) + 1
            : 101;
          e.target.style.left = setLeft;
          e.target.style.top = setTop;
          e.target.style.zIndex = setZindex;
        } else {
          //归位
          this.left = this.oldPosition.left;
          this.top = this.oldPosition.top;
        }
      }
    },
    cardTouchMove: function(e) {
      if (this.onDrag) {
        let pageX = 0,
          pageY = 0;
        if (e.touches) {
          pageX = e.touches[0].pageX;
          pageY = e.touches[0].pageY;
        } else {
          pageX = e.pageX;
          pageY = e.pageY;
        }
        this.left =
          (pageX * 10) / document.body.clientWidth -
          this.oldPosition.offsetX +
          "rem";
        this.top =
          (pageY * 10) / document.body.clientWidth -
          this.oldPosition.offsetY +
          "rem";
      }
    },
    cardTouchStart: function(e) {
      if (!this.card.cover) {
        let element = document.querySelectorAll(
          '[data-unique="' + this.card.unique + '"]'
        )[0];
        let offsetX = 0,
          offsetY = 0;
        if (e.touches) {
          offsetX = e.touches[0].pageX - e.target.offsetLeft;
          offsetY = e.touches[0].pageY - e.target.offsetTop;
        } else {
          offsetX = e.pageX - e.target.offsetLeft;
          offsetY = e.pageY - e.target.offsetTop;
        }
        this.oldPosition = {
          left: element.style.left,
          top: element.style.top,
          offsetX: (offsetX * 10) / document.body.clientWidth,
          offsetY: (offsetY * 10) / document.body.clientWidth
        };
        this.onDrag = true;
      }
    },
    cardClick: function() {
      if (this.card.cover && !this.card.position) {
        this.card.cover = false;
        this.$parent.addLook(this.card);
      } else if (this.card.cover && this.card.position) {
        this.card.cover = false;
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
.poker-card.move {
  transition: none;
  z-index: 999 !important;
}
</style>