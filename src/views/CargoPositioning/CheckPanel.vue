<template>
  <div class="check-panel">
    <n-layout style="height: 100%" has-sider>
      <n-layout-sider width="60px" content-style="padding: 4px;" :native-scrollbar="false" bordered>
        <template v-for="(area) in activeAreas" :key="area">
          <div :class="['sider-item', { 'is-active': activeKey === area }]" @click="activeKey = area">
            {{ area }}
          </div>
        </template>
      </n-layout-sider>
      <n-layout content-style="padding: 4px;" :native-scrollbar="false">
        <template v-for="(area) in activeData" :key="area">
          <div v-if="!area.checked" class="group-card">
            <div>
              <n-space justify="space-between">
                <div>
                  <span style="font-weight: bold;font-size: 18px;">{{ area.area }}</span>
                  <span style="display: inline-block;margin-left: 8px;">({{ area.items.length }})</span>
                </div>

                <n-button type="primary" size="small" @click="handleChecked(area)">确认</n-button>
              </n-space>
            </div>
            <template v-for="(item, index) in area.items" :key="index">
              <div class="group-card-item">
                <n-space :size="40">
                  <span>{{ item.position }}</span>
                  <span>{{ item.no }}</span>
                  <span>{{ item.qty }}</span>
                </n-space>
              </div>
            </template>
          </div>
        </template>
      </n-layout>
    </n-layout>
  </div>
</template>
<script setup>
import { computed, ref } from "vue";
import { NButton, NSpace, NLayout, NLayoutSider } from "naive-ui";

const props = defineProps({
  data: Array,
});
const emits = defineEmits(["change"])
const activeKey = ref(null);

const handleChecked = (area) => {
  emits('change', area.area)
}
const activeData = computed(() => {
  return props.data.filter((item) => item.area.indexOf(activeKey.value) === -0);
});
const activeAreas = computed(() => {
  const areas = new Set();
  props.data.forEach((d) => {
    !d.checked && d.items.forEach(item => {
      areas.add(item.area);
    })
  });

  const areaList = Array.from(areas)
  activeKey.value = areaList[0]
  return areaList;
});
</script>
<style lang="less" scoped>
.check-panel {
  position: fixed;
  top: 70px;
  left: 10px;
  width: 340px;
  height: 210px;
  border-radius: 8px;
  box-sizing: border-box;
  border: 1px solid #d4d4d4;
  box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.15);
  z-index: 1;
  overflow: hidden;
}

.sider-item {
  box-sizing: border-box;
  padding: 0 4px;
  margin-bottom: 4px;
  border-radius: 4px;
  border: 1px solid #f1f1f1;
  background-color: #ffffff;
  text-align: center;
}

.is-active {
  box-sizing: border-box;
  outline: 1px solid #264eff;
}

.group-card {
  position: relative;
  padding: 8px;
  margin-bottom: 6px;
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  box-sizing: border-box;
  font-weight: 500;

  &-item:not(:last-child) {
    border-bottom: 1px solid #efefef;
  }
}
</style>
