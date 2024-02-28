<template>
    <div class="v-ace-loading" @click.self="handleClick" @touch.self="handleClick">
        <n-spin size="large">
            <template #icon>
                <n-icon color="#2566ff">
                    <Loader />
                </n-icon>
            </template>
            <template #description>
                <span style="color:#2566ff">{{ description }}</span>
            </template>
        </n-spin>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { NSpin, NIcon } from "naive-ui";
import { Loader } from "@vicons/tabler";

const description = ref('加载中...')

const handleClick = (e) => {
    e.stopPropagation()
}

defineExpose({
    setDiscription(text) {
        description.value = text
    }
})
</script>
<style lang="less" scoped>
.v-ace-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999;
    font-size: 14px;
    background: rgba(0, 0, 0, 0.2);
    overflow: hidden;
    transition: all 0.5s ease-in-out;
    z-index: auto;
    user-select: none;
    backdrop-filter: blur(1px);
}
</style>

<style>
.v-ace-loading-relative {
    position: relative;
}
</style>