import { createApp } from "vue"
import Loading from "./loading.vue"

export default function useLoadingDirective(app) {
    app.directive('loading', {
        mounted(el, binding) {
            const loadingContainer = document.createElement('div')
            const LoadingApp = createApp(Loading)
            const instance = LoadingApp.mount(loadingContainer)
            el.instance = instance

            if (binding.value === true) {
                append(el)
            }
        },
        updated(el, binding, vnode, prevVnode) {
            if (!binding.value && !binding.oldValue) return

            const loading = binding.value
            if (loading === true) {
                append(el)
            } else {
                remove(el)
            }
        }
    })
}

function append(el) {
    if (el.hasAttribute('ace-loading-text')) {
        const text = el.getAttribute('ace-loading-text')
        el.instance.setDiscription(text)
    }

    const style = getComputedStyle(el)
    if (['absolute', 'relative', 'fixed'].indexOf(style.position) === -1) {
        el.classList.add('v-ace-loading-relative')
    }

    el.appendChild(el.instance.$el)
}

function remove(el) {
    el.classList.remove('v-ace-loading-relative')
    el.contains(el.instance.$el) && el.removeChild(el.instance.$el)
}