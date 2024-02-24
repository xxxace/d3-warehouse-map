<template>
  <ol-map
    ref="oMap"
    :moveTolerance="6"
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
    :pixelRatio="pixelRatio"
    :controls="[]"
    style="height: 100%; background-color: #d6d6d6"
    @singleclick="handleClick"
  >
    <ol-view
      ref="view"
      :center="center"
      :constrainOnlyCenter="false"
      :enableRotation="false"
      :zoom="zoom"
      :minZoom="1"
      :maxZoom="4"
      :projection="imgProjection"
    />

    <ol-image-layer id="ace">
      <ol-source-image-static
        :url="imgUrl"
        :imageSize="size"
        :imageExtent="extent"
        :projection="imgProjection"
      ></ol-source-image-static>
    </ol-image-layer>

    <!-- <ol-overlay :position="[260, 1361]">
      <div class="overlay-content">xxxxF</div>
    </ol-overlay> -->
    <ol-mouseposition-control />
  </ol-map>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Polygon, Point } from "ol/geom";
import { Style, Fill, Stroke, Text } from "ol/style";
// import Select from "ol/interaction/Select";
// import { DragPan } from "ol/interaction";
import d3_map from "@/assets/d3_map.png";
import { geneateMultiPolygon } from "./utils";
import { featuresMetas } from "./featureData";

const props = defineProps({
  highLightItems: Array,
});
const emits = defineEmits(["feature-click"]);

const imgUrl = ref(d3_map);
const size = ref([2560, 1449]);
const extent = ref([0, 0, ...size.value]);
const imgProjection = reactive({
  code: "ace-img",
  units: "pixels",
  extent: extent,
});

const oMap = ref(null);
const pixelRatio = ref(window.devicePixelRatio || 1);

const center = ref([size.value[0] / 2, size.value[1] / 2]);
const zoom = ref(2.6);

function zoomToFit(map, extent) {
  const view = map.getView();
  // const imgLayer = map.getLayers();
  // const layerExtent = imgLayer.array_[0].values_.source.getImageExtent();
  console.log(extent, map.getSize());
  view.fit(extent, {
    size: map.getSize(),
    // callback: function () {
    //   // 获取地图视图对象的约束信息
    //   const constraints = view.getConstraints();
    //   // 在地图视图边界处禁止移动
    //   constraints.maxX = 0;
    //   constraints.maxY = 0;
    //   constraints.minX = -layerExtent[2] + view.getResolution() * map.getSize()[0];
    //   constraints.minY = -layerExtent[3] + view.getResolution() * map.getSize()[1];
    // },
  });
}

function handleClick(e) {
  const targetFeature = e.map.getFeaturesAtPixel(e.pixel);
  if (targetFeature && targetFeature.length) emits("feature-click", targetFeature);
}

// function addSelectInteraction() {
//   const map = oMap.value.map;
//   const selectInteraction = new Select({
//     layers: map.getLayers().getArray(),
//   });

//   map.addInteraction(selectInteraction);

//   // 监听要素的选择事件
//   selectInteraction.on("select", function (event) {
//     console.log("select", event);
//     if (event.selected && event.selected.length) {
//       emits("feature-click", event.selected);
//     }
//   });
// }

const layerMap = new Map();
const featureMap = new Map();
const highLightLayerMap = new Map();
const highLightFeatureMap = new Map();

function randomHightLight() {
  // 复原高亮的货柜
  if (highLightFeatureMap.size > 0) {
    Array.from(highLightFeatureMap.values()).forEach((feature) => {
      feature.style_.fill_.setColor("rgba(0,0,0,0.3)");
      feature.style_.stroke_.setColor("black");
    });
    Array.from(highLightLayerMap.values()).forEach((layer) => {
      layer.changed();
    });

    highLightLayerMap.clear();
    highLightFeatureMap.clear();
  }

  // const highLightCount = Math.floor(Math.random() * (240 / 2)) + 1;
  // const charactersArray = [
  //   "A",
  //   "B",
  //   "C",
  //   "D",
  //   "E",
  //   "F",
  //   "G",
  //   "H",
  //   "I",
  //   "J",
  //   "K",
  //   "L",
  //   "M",
  //   "N",
  //   "O",
  //   "P",
  //   "Q",
  //   "R",
  //   "S",
  //   "T",
  //   "U",
  //   "V",
  //   "W",
  //   "X",
  //   "Y",
  //   "Z",
  // ];
  // for (let i = 0; i < highLightCount; i++) {
  //   const colIndex = Math.floor(Math.random() * 24) + 1;
  //   const seqIndex = Math.floor(Math.random() * (colIndex > 8 ? 11 : 8)) + 1;
  //   const layerId = `${charactersArray[colIndex - 1]}`;
  //   const featureId = `${layerId}-${seqIndex}`;
  //   const layer = getLayerById(layerId);
  //   if (!highLightLayerMap.has(layerId)) highLightLayerMap.set(layerId, layer);
  //   setVectorLayerFeatureStyleById({
  //     layer,
  //     id: featureId,
  //     styleFunction: (feature) => {
  //       feature.style_.fill_.setColor("rgba(160, 207, 255,0.5)");
  //       feature.style_.stroke_.setColor("rgb(64, 158, 255)");
  //       highLightFeatureMap.set(featureId, feature);
  //     },
  //   });
  // }
  for (let i = 0; i < props.highLightItems.length; i++) {
    const itemGroup = props.highLightItems[i];

    for (let j = 0; j < itemGroup.items.length; j++) {
      const item = itemGroup.items[j];
      const layer = getLayerById(item.area);
      if (!highLightLayerMap.has(item.id)) highLightLayerMap.set(item.id, layer);
      setVectorLayerFeatureStyleById({
        layer,
        id: item.id,
        styleFunction: (feature) => {
          feature.style_.fill_.setColor("rgba(160, 207, 255,0.5)");
          feature.style_.stroke_.setColor("rgb(64, 158, 255)");
          highLightFeatureMap.set(item.id, feature);
        },
      });
    }
  }

  // layer统一更新
  Array.from(highLightLayerMap.values()).forEach((layer) => {
    layer.changed();
  });
}

function getLayerById(id) {
  if (layerMap.has(id)) return layerMap.get(id);
  const foundLayer = oMap.value.map
    .getLayers()
    .getArray()
    .find((layer) => layer.get("id") === id);
  layerMap.set(id, foundLayer);
  return foundLayer;
}

function setVectorLayerFeatureStyleById({ layer, id, styleFunction }) {
  let targetFeature = featureMap.get(id);
  if (!targetFeature) {
    try {
      targetFeature = layer
        .getSource()
        .getFeatures()
        .find((feature) => feature.get("id") === id);
    } catch (e) {
      console.log(e, id);
    }
  }

  if (styleFunction) styleFunction(targetFeature);
}

function renderPolygon(map) {
  featuresMetas.forEach((featureMeta) => {
    const features = [];
    const { coordinate, count, width } = featureMeta;
    const polygonCoordinates = geneateMultiPolygon({ coordinate, count, width, gap: 7 });

    polygonCoordinates.forEach((polygonCoordinate, i) => {
      const seq = i + 1;
      const id = `${featureMeta.id}-${seq}`;
      const feature = new Feature({
        id: id,
        geometry: new Polygon(polygonCoordinate),
      });

      const style = new Style({
        fill: new Fill({
          color: "rgba(0,0,0,0.3)",
        }),
        stroke: new Stroke({
          color: "black",
          width: 2,
        }),
        text: new Text({
          text: String(seq),
          font: "16px Calibri,sans-serif",
          fill: new Fill({
            color: "white",
          }),
          stroke: new Stroke({
            color: "black",
            width: 2,
          }),
          overflow: true,
        }),
      });

      feature.setStyle(style);
      features.push(feature);
    });

    if (featureMeta.label) {
      const labelFeature = renderLabel(featureMeta);
      features.push(labelFeature);
    }

    const vectorLayer = new VectorLayer({
      id: featureMeta.id,
      source: new VectorSource({
        features: features,
      }),
    });

    map.addLayer(vectorLayer);
  });
}

function renderLabel(featureMeta) {
  const {
    text: labelTextValue,
    coordinate: labelCoordinate,
    style: labelStyle,
  } = featureMeta.label;
  const labelText = labelTextValue || featureMeta.id;
  const labelFeature = new Feature({
    id: `${featureMeta.id}-label`,
    geometry: new Point(labelCoordinate),
  });

  labelFeature.setStyle(
    new Style({
      text: new Text({
        text: String(labelText),
        font: "20px Calibri,sans-serif",
        fill: new Fill({
          color: "#165dff",
        }),
        overflow: true,
        ...(labelStyle || {}),
      }),
    })
  );

  return labelFeature;
}

onMounted(() => {
  zoomToFit(oMap.value.map, extent.value);
  renderPolygon(oMap.value.map);
  setTimeout(() => {
    randomHightLight();
  }, 500);
  // addSelectInteraction();
});
</script>

<style lang="less" scoped>
.overlay-content {
  background-color: #ffffff;
  width: 600px;
  height: 300px;
}
</style>
