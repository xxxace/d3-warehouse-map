<template>
  <n-layout position="absolute" v-loading="loading">

    <n-layout-header bordered style="padding: 10px">
      <div>指令单号：{{ orderNo || "请选择要出库的指令单" }}</div>
      <div>出库明细：({{ tableData.length }})</div>
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
        <!-- <n-data-table
          size="small"
          v-model:checked-row-keys="checkedRowKeys"
          :columns="columns"
          :data="tableData"
          :max-height="dataTableMaxHeight"
          :row-key="(row) => row.rowKey"
        /> -->
        <template v-for="item in dataGroup" :key="item.area">
          <n-card v-if="!item.checked" size="small" :class="[{ 'is-checked': item.checked }]" style="margin-bottom: 10px">
            <template #header>
              <n-space justify="space-between">
                <n-h3 style="margin: 0;">
                  <span style="font-weight: bold;">{{ item.area }}</span>
                  <span> ({{ item.items.length }}) </span>
                </n-h3>
                <!-- <n-tag size="small" :type="item.checked ? 'success' : 'default'"
                    style="vertical-align: text-bottom; margin-left: 10px">{{ item.checked ? "已" : "未" }}确认</n-tag>
            
                <n-button :type="item.checked ? `error` : `primary`" size="small" ghost @click="handleConfirm(item)">
                  {{ item.checked ? "取消" : "" }}确认
                </n-button> -->
                <n-button type="primary" size="small" ghost @click="handleConfirm(item)">
                  确认
                </n-button>
              </n-space>
            </template>
            <n-data-table size="small" :columns="columns" :data="item.items" />
          </n-card>
        </template>

      </n-layout-content>

    </n-layout>


    <n-layout-footer position="absolute" style="height: 48px; padding: 7px" bordered>
      <n-space :item-style="{ flex: 1 }">
        <div>
          <n-button :disabled="checkItemCount <= 0" @click="checkedListDrawerActive = true">已确认列表 ({{ checkItemCount
          }})</n-button>
        </div>
        <div style="text-align: right">
          <n-button type="primary" :disabled="checkItemCount !== tableData.length">提交 ({{ checkItemCount }}/{{
            tableData.length }})</n-button>
        </div>
      </n-space>
    </n-layout-footer>
  </n-layout>

  <n-drawer v-model:show="drawerActive" width="100vw" placement="right" :on-after-enter="handleEnter"
    :on-after-leave="() => (mapActive = false)">
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
      <OpenLayers v-if="mapActive" :high-light-items="items" @feature-click="handelFeatureClick" />

      <CheckPanel v-model:checked-row-keys="checkedRowKeys" :data="dataGroup" @change="handleCheckPanelChange" />
    </n-drawer-content>
  </n-drawer>


  <n-drawer v-model:show="checkedListDrawerActive" width="410px" placement="right">
    <n-drawer-content :body-content-style="{ padding: 0 }" closable>

      <template #header>
        已确认列表：({{ checkItemCount }})
      </template>

      <div style="padding: 10px;">
        <template v-for="item in dataGroup" :key="item.area">
          <n-card v-if="item.checked" size="small" :class="[{ 'is-checked': item.checked }]" style="margin-bottom: 10px">
            <template #header>
              <n-space justify="space-between">
                <n-h3 style="margin: 0;">
                  <span style="font-weight: bold;">{{ item.area }}</span>
                  <span> ({{ item.items.length }}) </span>
                </n-h3>
                <n-button type="error" size="small" ghost @click="handleConfirm(item)">
                  取消确认
                </n-button>
              </n-space>
            </template>
            <n-data-table size="small" :columns="columns" :data="item.items" />
          </n-card>
        </template>
      </div>
    </n-drawer-content>
  </n-drawer>

  <n-modal v-model:show="showModal" preset="dialog" :title="modalTitle" :mask-closable="false">
    <template v-for=" item  in  modalContent " :key="item">
      <div>{{ item }}</div>
    </template>
  </n-modal>
</template>

<script setup>
import { computed, h, ref, watch, onMounted } from "vue";
import {
  NButton,
  NCard,
  NH3,
  NModal,
  NDrawer,
  NDrawerContent,
  NIcon,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
  NSpace,
  NSpin,
  NTag,
  NDataTable,
  useDialog,
  useNotification,
} from "naive-ui";
import { BuildingWarehouse, Map2, Forklift } from "@vicons/tabler";
import OpenLayers from "@/components/OpenLayers/index.vue";
import CheckPanel from "./CheckPanel.vue";

const props = defineProps({
  orderNo: [String, Number],
});

const dialog = useDialog();
const notification = useNotification();
const items = ref([]);
const tableData = ref([]);
const dataGroup = ref([]);
const checkedRowKeys = ref([]);
const modalTitle = ref("");
const modalContent = ref([]);
const loading = ref(false);
const showModal = ref(false);
const drawerActive = ref(false);
const checkedListDrawerActive = ref(false);
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

const checkItemCount = computed(() => {
  return tableData.value.filter((item) => item.checked).length;
});

const handleConfirm = (item) => {
  let type = 'info'
  let content = `确定 ${item.area} 已全取？`

  if (item.checked) {
    type = 'warning'
    content = `确定取消 ${item.area} 的确认？`
  }
  dialog[type]({
    title: "提示",
    content: content,
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      item.checked = !item.checked;
      setItemsChecked(item.items, item.checked);
    },
  });
};

const handleCheckPanelChange = (area) => {
  const checkItem = dataGroup.value.find(d => d.area === area)

  if (checkItem) {
    handleConfirm(checkItem)
  }
}

const handleEnter = () => {
  setTimeout(() => {
    mapActive.value = true
  }, 300)
}

function setItemsChecked(items, checked) {
  if (items) {
    items.forEach((item) => {
      item.checked = checked;
    });
  }
}

watch(
  () => props.orderNo,
  async () => {
    loading.value = true
    dataGroup.value = []
    tableData.value = []
    await loadData()
    loading.value = false
  }
);

function sleep(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
const loadData = async () => {
  await sleep(300)
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
      const level = Math.floor(Math.random() * 4) + 1;
      items.push({
        id: `${charactersArray[index]}-${randomIndex}`,
        rowKey: `${new Date().getTime()}${Math.floor(Math.random() * 1000)}${Math.floor(
          Math.random() * 1000
        )}${randomIndex}${level}`,
        area: charactersArray[index],
        index: randomIndex,
        level: level,
        vat: `DF-2400038${i}`,
        no: `2023031600${i}`,
        position: `${charactersArray[index]}-${randomIndex}-${level}`,
        qty: 22,
      });
    }

    return items.sort((a, b) => a.level - b.level).sort((a, b) => a.index - b.index);
  }
  tableData.value = [];
  const itemsGroup = []
  for (let i = 0; i < length; i++) {
    const temp = {
      shelfNo: charactersArray[i],
      items: [...generateItems(i)],
      checked: false,
    }
    newItems.push(temp);

    itemsGroup.push(...temp.items)
  }

  tableData.value = itemsGroup;

  items.value = newItems;
  // console.log(dataGroup.value);

  const areaMap = new Map();
  tableData.value.forEach((item) => {
    const areaKey = `${item.area}-${item.index}`;
    let areaDataGroup = areaMap.get(areaKey);
    if (!areaDataGroup) {
      areaDataGroup = [];
      areaMap.set(areaKey, areaDataGroup);
    }

    areaDataGroup.push(item);
  });

  // console.log(areaMap.entries());
  dataGroup.value = Array.from(areaMap.entries()).map((item) => {
    return {
      area: item[0],
      items: item[1],
      checked: false,
    };
  });
}

const columns = ref([
  {
    title: "货位号",
    key: "position",
    width: 60,
  },
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
  // {
  //   title: "状态",
  //   key: "isChecked",
  //   width: 60,
  //   render(row, index) {
  //     return h(NCheckbox, {
  //       value: row.checked,
  //       size: "large",
  //       onUpdateChecked(v) {
  //         tableData.value[index].checked = v;
  //       },
  //     });
  //   },
  // },
  // {
  //   title: "已检",
  //   type: "selection",
  //   width: 100,
  // },
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

.is-checked {
  border: 3px solid #2897ff;
  border-radius: 8px;
  box-sizing: border-box;
}
</style>
