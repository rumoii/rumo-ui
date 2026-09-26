<template>
  <div style="display:flex;justify-content: center;">
    <rumo-progress type="circle" :percentage="progress" :status="status"/>
  </div>
</template>
<script>
import RumoProgress from 'rumo-ui/packages/progress'

export default {
  components:{
    RumoProgress
  },
  data(){
    return {
      progress:0,
      status: ''
    }
  }
}
</script>
