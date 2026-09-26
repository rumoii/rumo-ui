<template>
  <footer class="footer">
    <div class="container">
      <ul>
        <li class="rumo-col rumo-col-xs-24 rumo-col-sm-24 rumo-col-md-8">
          <h2>Rumo UI</h2>
          <div>
            <span>Vue.js 组件库</span>
          </div>
        </li>
        <li class="rumo-col rumo-col-xs-24 rumo-col-sm-24 rumo-col-md-16">
          <h2>
            Copyright © 2026
          </h2>
          <div>
            <span>rumo</span>
          </div>
        </li>
      </ul>
    </div>
  </footer>
</template>

<style>
.footer {
  background-color: #f7fbfd;
  width: 100%;
  padding: 20px 50px;
  margin-top: -250px;
  box-sizing: border-box;
  height: 250px;

  .container {
    box-sizing: border-box;
    width: auto;
  }

  ul {
    overflow: hidden;
    font-size: 14px;
    margin: 0;
    list-style: none;

    li {
      padding: 24px 2% 10px;

      & > h2 {
        font-size: 14px;
        margin: 0 auto 16px;
        font-weight: 500;
        position: relative;
      }

      & > div {
        margin-bottom: 8px;
      }
    }
  }
}
@media (max-width: 1140px) {
  .footer {
    height: auto;
  }
}
</style>

<script type="text/babel">
export default {
  computed: {
    lang() {
      return this.$route.path.split('/')[1] || 'zh-CN';
    }
  }
};
</script>
