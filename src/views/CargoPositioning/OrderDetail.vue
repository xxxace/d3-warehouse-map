<template>
  <n-layout position="absolute">
    <n-layout-header bordered style="padding: 10px">
      <div>指令单号：{{ orderNo || "请选择要出库的指令单" }}</div>
      <div>出库明细：({{ items.length }})</div>
      <div class="action-panel">
        <n-button @click="showMap">
          <template #icon>
            <n-icon :component="Map2" />
          </template>
          查看地图
        </n-button>
      </div>
    </n-layout-header>

    <n-layout position="absolute" style="top: 74px; bottom: 48px">
      <n-layout-content ref="layoutContentRef" content-style="padding: 10px;">
        <!-- <template v-for="item in items" :key="item">
          <n-card
            :class="[{ isChecked: item.checked }]"
            size="small"
            style="margin-bottom: 4px"
          >
            <div style="display: flex">
              <div style="flex: 1">
                <n-space vertical="">
                  <div>
                    <span>区域：{{ item.shelfNo }}</span>
                    <span style="display: inline-block; margin-left: 10px"
                      >数量：{{ item.items.reduce((t, n) => t + n.qty, 0) }}
                    </span>
                  </div>
                  <div>
                    <span>货架：</span>
                    <n-tag
                      v-for="e in item.items"
                      :key="e.id"
                      size="small"
                      type="info"
                      style="margin-right: 4px"
                    >
                      {{ e.id }}-{{ e.level }}
                    </n-tag>
                  </div>
                </n-space>
              </div>
              <div>
                <n-switch v-model:value="item.checked" />
              </div>
            </div>
          </n-card>
        </template> -->
        <n-data-table
          size="small"
          :columns="columns"
          :data="data"
          :max-height="dataTableMaxHeight"
        />
      </n-layout-content>
    </n-layout>

    <n-layout-footer position="absolute" style="height: 48px; padding: 7px" bordered>
      <div style="text-align: right">
        <n-button type="primary">提交</n-button>
      </div>
    </n-layout-footer>
  </n-layout>

  <n-drawer
    v-model:show="drawerActive"
    width="100vw"
    placement="right"
    :on-after-enter="() => (mapActive = true)"
    :on-after-leave="() => (mapActive = false)"
  >
    <n-drawer-content :body-content-style="{ padding: 0 }" closable>
      <template #header>
        <n-space>
          <n-tag>
            <template #icon>
              <n-icon :component="BuildingWarehouse" />
            </template>
            <span>D栋3楼仓库</span>
          </n-tag>
          <n-tag :bordered="false" type="warning">
            <template #icon>
              <n-icon :component="Forklift" />
            </template>
            <span>4号叉车</span>
          </n-tag>
          <n-tag :bordered="false" type="info">指令单号：{{ orderNo }}</n-tag>
        </n-space>
      </template>
      <OpenLayers
        v-if="mapActive"
        :high-light-items="items"
        @feature-click="handelFeatureClick"
      />

      <CheckPanel />
    </n-drawer-content>
  </n-drawer>

  <n-modal
    v-model:show="showModal"
    preset="dialog"
    :title="modalTitle"
    :mask-closable="false"
  >
    <template v-for="item in modalContent" :key="item">
      <div>{{ item }}</div>
    </template>
  </n-modal>
</template>

<script setup>
import { h, ref, watch, onMounted } from "vue";
import {
  NButton,
  NCard,
  NCheckbox,
  NModal,
  NDrawer,
  NDrawerContent,
  NIcon,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
  NSwitch,
  NSpace,
  NTag,
  NDataTable,
  useNotification,
} from "naive-ui";
import { BuildingWarehouse, Map2, Forklift } from "@vicons/tabler";
import OpenLayers from "@/components/OpenLayers/index.vue";
import CheckPanel from "./CheckPanel.vue";

const props = defineProps({
  orderNo: [String, Number],
});

const notification = useNotification();
const items = ref([]);

const modalTitle = ref("");
const modalContent = ref([]);
const showModal = ref(false);
const drawerActive = ref(false);
const mapActive = ref(false);

function showMap() {
  if (!props.orderNo) {
    notification.warning({
      content: "请先选择指令单！",
      duration: 2500,
      keepAliveOnHover: true,
    });

    return;
  }
  drawerActive.value = true;
}

function handelFeatureClick(feature) {
  const id = feature[0].values_.id;
  if (/[A-Z]-\d+$/.test(id)) {
    const itemGroup = items.value.find((item) => item.shelfNo === id[0]);
    if (itemGroup) {
      const group = itemGroup.items.filter((i) => i.id === id);
      if (group.length > 0) {
        modalContent.value = JSON.parse(JSON.stringify(group));
        modalTitle.value = id;
        showModal.value = true;
      }
    }
  }
}

watch(
  () => props.orderNo,
  () => {
    const newItems = [];
    const length = Math.floor(Math.random() * 24) + 1;
    const charactersArray = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];

    function generateItems(index) {
      const items = [];
      const count = index > 8 ? 11 : 8;
      const randomCount = Math.floor(Math.random() * count) + 1;

      for (let i = 0; i < randomCount; i++) {
        const randomIndex = Math.floor(Math.random() * randomCount) + 1;
        items.push({
          id: `${charactersArray[index]}-${randomIndex}`,
          area: charactersArray[index],
          index: randomIndex,
          level: Math.floor(Math.random() * 4) + 1,
          qty: 22,
        });
      }

      return items.sort((a, b) => a.index - b.index).sort((a, b) => a.level - b.level);
    }

    for (let i = 0; i < length; i++) {
      newItems.push({
        shelfNo: charactersArray[i],
        items: [...generateItems(i)],
        checked: false,
      });
    }

    items.value = newItems;
  }
);

const data = ref([
  {
    vat: "DF-24000381",
    no: "20230316001",
    qty: 20,
    position: "A-1-1",
  },
  {
    vat: "DF-24000381",
    no: "20230316002",
    qty: 20,
    position: "A-1-1",
  },
  {
    vat: "DF-24000381",
    no: "20230316003",
    qty: 20,
    position: "A-1-2",
  },
  {
    vat: "DF-24000381",
    no: "20230316004",
    qty: 20,
    position: "A-1-3",
  },
  {
    vat: "DF-24000381",
    no: "20230316005",
    qty: 20,
    position: "A-1-3",
  },
  {
    vat: "DF-24000381",
    no: "20230316006",
    qty: 20,
    position: "A-1-2",
  },
  {
    vat: "DF-24000381",
    no: "20230316007",
    qty: 20,
    position: "A-1-2",
  },
]);
const columns = ref([
  {
    title: "缸号",
    key: "vat",
    width: 100,
  },
  {
    title: "布票号",
    key: "no",
    width: 100,
  },
  {
    title: "数量",
    key: "qty",
    width: 60,
  },
  {
    title: "货位号",
    key: "position",
    width: 60,
  },
  {
    title: "状态",
    key: "isChecked",
    width: 60,
    render(row, index) {
      return h(NCheckbox, {
        value: row.isChecked,
        size: "large",
        onUpdateChecked(v) {
          data.value[index].isChecked = v;
        },
      });
    },
  },
]);

const dataTableMaxHeight = ref(0);
const layoutContentRef = ref(null);
onMounted(() => {
  const maxHeight = layoutContentRef.value.$el.parentElement.clientHeight - 63;
  dataTableMaxHeight.value = maxHeight;
});
</script>

<style lang="less" scoped>
.action-panel {
  position: absolute;
  top: 6px;
  right: 10px;
}

.isChecked {
  border: 1px solid #1890ff;
  box-sizing: border-box;
}
</style>
